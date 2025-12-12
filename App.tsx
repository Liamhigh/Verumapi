
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage as Message } from './types';
import { streamAIResponse, Content, Part } from './services/aiService';
import { sealDocument } from './services/documentSealService';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import WelcomeScreen from './components/WelcomeScreen';
import LandingPage from './components/LandingPage';

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
  const [showLandingPage, setShowLandingPage] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Verum Omnis session initialized. Forensic protocols engaged. Ready to apply AI forensics for truth in accordance with my constitutional mandate. How may I assist you?"
    }
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = useCallback(async (text: string, file: File | null) => {
    if (loading) return;

    setError(null);
    setLoading(true);

    let fileData: { name: string; type: string; data: string; seal?: any } | undefined;
    if (file) {
        const data = await fileToBase64(file);
        // Seal the document with cryptographic hash
        const sealedDoc = await sealDocument(file.name, file.type, data, file.size);
        fileData = { 
          name: sealedDoc.name, 
          type: sealedDoc.type, 
          data: sealedDoc.data,
          seal: sealedDoc.seal
        };
    }

    const userMessage: Message = { 
      role: 'user', 
      text,
      file: fileData,
    };
    
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);

    const aiMessagePlaceholder: Message = { role: 'model', text: '' };
    setMessages((prev) => [...prev, aiMessagePlaceholder]);

    try {
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
      
      const contents = [...history.slice(1), userTurn]; 

      const stream = streamAIResponse(contents);
      
      let fullResponse = '';
      for await (const chunk of stream) {
        const chunkText = chunk.text;
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
          
          let actions: string[] = [];
          try {
            actions = parseActions(fullResponse).filter(action => {
              // Validate action text - must be non-empty and not contain incomplete JSON
              if (!action || action.trim().length === 0) return false;
              // Check for incomplete JSON patterns
              if (action.includes('{') && !action.includes('}')) return false;
              if (action.includes('[') && !action.includes(']')) return false;
              return true;
            });
          } catch (e) {
            console.warn('Action parsing failed:', e);
            actions = [];
          }

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
            console.error('AI Provider Error:', message);
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
  }, [loading, messages]);
  
  if (showLandingPage) {
    return <LandingPage onEnter={() => setShowLandingPage(false)} />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#0A192F] text-slate-300 font-sans overflow-hidden">
      <Header />
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