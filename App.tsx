
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Part, GoogleGenAI, Content, GenerateContentResponse } from '@google/genai';
import { ChatMessage as Message, GeolocationData, CaseData } from './types';
import { systemInstruction } from './services/geminiService';
import { caseService } from './services/caseService';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import WelcomeScreen from './components/WelcomeScreen';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64String = result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

const getGeolocation = (): Promise<GeolocationData | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser.');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const timestamp = position.timestamp;
        
        // Get timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Try to get location details via reverse geocoding
        let city, country;
        try {
          // Add proper headers and timeout for Nominatim API
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
            {
              headers: {
                'User-Agent': 'VerumOmnis/1.0'
              },
              signal: controller.signal
            }
          );
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const data = await response.json();
            city = data.address?.city || data.address?.town || data.address?.village;
            country = data.address?.country;
          }
        } catch (error) {
          // Silently fail for geocoding - coordinates are still available
          console.warn('Could not fetch location details:', error);
        }

        resolve({
          latitude,
          longitude,
          accuracy,
          timestamp,
          city,
          country,
          timezone
        });
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        resolve(null);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

const buildLocationContext = (geolocation: GeolocationData, timestamp: string): string => {
  const locationDetails = [
    `- Coordinates: ${geolocation.latitude.toFixed(6)}, ${geolocation.longitude.toFixed(6)}`,
    `- Accuracy: ${geolocation.accuracy.toFixed(0)}m`,
  ];
  
  if (geolocation.city) {
    locationDetails.push(`- City: ${geolocation.city}`);
  }
  if (geolocation.country) {
    locationDetails.push(`- Country: ${geolocation.country}`);
  }
  if (geolocation.timezone) {
    locationDetails.push(`- Timezone: ${geolocation.timezone}`);
  }
  locationDetails.push(`- Report Timestamp: ${timestamp}`);

  return `

CURRENT USER LOCATION CONTEXT:
${locationDetails.join('\n')}

Use this location information to determine the applicable jurisdiction for legal analysis. Consider local, state/provincial, and national laws that apply to this geographic location.`;
};

async function generateSha512(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

const parseActions = (text: string): string[] => {
    const actions: string[] = [];
    const lines = text.split('\n');
    const actionRegex = /^\s*\*\s+\*\*Step\s[A-Z]:\*\*\s*(.+)/;

    for (const line of lines) {
        const match = line.match(actionRegex);
        if (match && match[1]) {
            let actionText = match[1].trim();
            if (actionText.toLowerCase().startsWith('submit the')) {
                actionText = actionText.replace(/immediately\.$/i, '').trim();
            }
            if (actionText.toLowerCase().startsWith('file the')) {
                actionText = actionText.replace(/complaint\.$/i, 'Complaint').trim();
            }
            actions.push(actionText);
        }
    }
    return actions.slice(0, 3);
};


const App: React.FC = () => {
  const [currentCase, setCurrentCase] = useState<CaseData | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Verum Omnis session initialized. Forensic protocols engaged. Ready to apply AI forensics for truth in accordance with my constitutional mandate. How may I assist you?"
    }
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const ai = useRef<GoogleGenAI | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialGreeting: Message = {
    role: 'model',
    text: "Verum Omnis session initialized. Forensic protocols engaged. Ready to apply AI forensics for truth in accordance with my constitutional mandate. How may I assist you?"
  };

  // Load existing case on mount
  useEffect(() => {
    const existingCase = caseService.getCurrentCase();
    if (existingCase && existingCase.messages.length > 0) {
      setCurrentCase(existingCase);
      setMessages([initialGreeting, ...existingCase.messages]);
    } else {
      // Create a new case if none exists
      const newCase = caseService.createNewCase();
      setCurrentCase(newCase);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  useEffect(() => {
    try {
       if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
      }
      ai.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } catch (e) {
      setError("Failed to initialize AI session. Please check your API key.");
      console.error(e);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Save messages to current case whenever they change
  useEffect(() => {
    if (currentCase && messages.length > 1) {
      const caseMessages = messages.slice(1); // Exclude initial greeting
      const updatedCase: CaseData = {
        ...currentCase,
        messages: caseMessages,
      };
      caseService.saveCurrentCase(updatedCase);
      setCurrentCase(updatedCase);
    }
  }, [messages, currentCase]);

  const handleClearChat = useCallback(() => {
    if (window.confirm('Are you sure you want to clear the chat and start a new case? The current case will be saved.')) {
      const newCase = caseService.createNewCase();
      setCurrentCase(newCase);
      setMessages([initialGreeting]);
      setError(null);
    }
  }, [initialGreeting]);

  const handleSendMessage = useCallback(async (text: string, file: File | null) => {
    if (loading) return;

    setError(null);
    setLoading(true);

    // Capture geolocation and timestamp
    const geolocation = await getGeolocation();
    const timestamp = new Date().toISOString();

    let fileData: { name: string; type: string; data: string } | undefined;
    if (file) {
        const data = await fileToBase64(file);
        fileData = { name: file.name, type: file.type, data };
    }

    const userMessage: Message = { 
      role: 'user', 
      text,
      file: fileData,
      geolocation: geolocation || undefined,
      timestamp,
    };
    
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);

    const aiMessagePlaceholder: Message = { 
      role: 'model', 
      text: '',
      timestamp: new Date().toISOString(),
      geolocation: geolocation || undefined,
    };
    setMessages((prev) => [...prev, aiMessagePlaceholder]);

    try {
      if (!ai.current) throw new Error("AI not initialized.");
    
      const history: Content[] = currentMessages.map(msg => {
          const parts: Part[] = [];
          if (msg.text) {
              parts.push({ text: msg.text });
          }
          if (msg.file) {
              parts.push({
                  inlineData: {
                      mimeType: msg.file.type,
                      data: msg.file.data,
                  },
              });
          }
          return { role: msg.role, parts };
      }).filter(c => c.parts.length > 0);
      
      const userTurn = history.pop();
      if (!userTurn) throw new Error("Cannot send empty message.");
      
      const contents = [...history.slice(1), userTurn]; // remove my initial welcome message from history but keep user's first message

      // Prepare system instruction with location and case context
      let contextualSystemInstruction = systemInstruction;
      
      // Add case context if available
      if (currentCase && currentCase.messages.length > 0) {
        contextualSystemInstruction += caseService.buildCaseContext(currentCase);
      }
      
      // Add location context if available
      if (geolocation) {
        contextualSystemInstruction += buildLocationContext(geolocation, timestamp);
      }

      const result = await ai.current.models.generateContentStream({
          model: 'gemini-3-pro-preview',
          contents,
          config: {
              systemInstruction: contextualSystemInstruction,
          }
      });
      
      let fullResponse = '';
      for await (const chunk of result) {
        const chunkText = (chunk as GenerateContentResponse).text;
        if (chunkText) {
          fullResponse += chunkText;
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.role === 'model') {
              newMessages[newMessages.length - 1] = { ...lastMessage, text: fullResponse };
            }
            return newMessages;
          });
        }
      }

      if (fullResponse) {
          const seal = await generateSha512(fullResponse);
          const actions = parseActions(fullResponse);

          let isPdf = false;
          let pdfContent: string | undefined = undefined;
          const startTag = '[START OF DOCUMENT]';
          const endTag = '[END OF DOCUMENT]';

          if (fullResponse.includes(startTag) && fullResponse.includes(endTag)) {
              isPdf = true;
              const startIndex = fullResponse.indexOf(startTag) + startTag.length;
              const endIndex = fullResponse.lastIndexOf(endTag);
              pdfContent = fullResponse.substring(startIndex, endIndex).trim();
          }

          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            const lastMessage = newMessages[newMessages.length - 1];
             if (lastMessage && lastMessage.role === 'model') {
                newMessages[newMessages.length - 1] = { 
                    ...lastMessage, 
                    seal, 
                    actions: actions.length > 0 ? actions : undefined,
                    isPdfContent: isPdf,
                    pdfContent: pdfContent,
                };
             }
            return newMessages;
          });
      }

    } catch (e: any) {
      let errorMessage = 'An error occurred. Please try again.';
      if (e?.message && typeof e.message === 'string') {
        const message = e.message;
        if (message.includes('Your API key was reported as leaked')) {
          errorMessage = 'Your API key was reported as leaked. Please use another API key.';
        } else if (message.includes('API key not valid')) {
          errorMessage = 'Your API key is not valid. Please check it and try again.';
        } else if (message.includes('PERMISSION_DENIED')) {
          errorMessage = 'Permission denied. Please check your API key and ensure it has the necessary permissions.';
        } else {
          if (message.trim().startsWith('{')) {
            errorMessage = 'An unexpected error occurred. More details are in the browser console.';
            console.error('Gemini API Error:', message);
          } else {
            errorMessage = message;
          }
        }
      }
      
      setError(errorMessage);
      setMessages((prev) => prev.slice(0, prev.length - (prev[prev.length -1].role === 'model' ? 2 : 1))); 
    } finally {
      setLoading(false);
    }
  }, [loading, messages, currentCase]);
  
  return (
    <div className="flex flex-col h-screen bg-[#0A192F] text-slate-300 font-sans overflow-hidden">
      <Header onClearChat={handleClearChat} caseName={currentCase?.name} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {messages.length === 1 && !loading && <WelcomeScreen onPromptClick={(prompt) => handleSendMessage(prompt, null)} />}
          {messages.slice(1).map((msg, index) => (
            <ChatMessage key={index} message={msg} onActionClick={(actionText) => handleSendMessage(`Based on your analysis, please: ${actionText}`, null)} />
          ))}
          {error && (
            <div className="my-4 p-3 bg-red-500/20 text-red-300 border border-red-500/50 rounded-lg">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <div className="sticky bottom-0 bg-[#0A192F]/80 backdrop-blur-sm border-t border-slate-700/50">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <ChatInput onSendMessage={handleSendMessage} loading={loading} />
             <p className="text-xs text-slate-500 text-center mt-3">
              Verum Omnis operates on fixed constitutional rules. All analysis is stateless and for informational purposes.
            </p>
        </div>
      </div>
    </div>
  );
};

export default App;