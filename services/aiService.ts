// Re-export types needed by the UI
export type Part = {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
};

export type Content = {
  role: 'user' | 'model';
  parts: Part[];
};

// OpenAI message types
type OpenAITextContent = {
  type: 'text';
  text: string;
};

type OpenAIImageContent = {
  type: 'image_url';
  image_url: {
    url: string;
  };
};

type OpenAIMessageContent = string | (OpenAITextContent | OpenAIImageContent)[];

type OpenAIMessage = {
  role: 'system' | 'user' | 'assistant';
  content: OpenAIMessageContent;
};

// This is the actual model name for the underlying API.
const AI_MODEL_NAME = 'gpt-4-turbo-preview';

// Singleton for the API key
const getAPIKey = (): string => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable not set.");
  }
  return process.env.OPENAI_API_KEY;
};

export const systemInstruction = `You are Verum Omnis (v5.2.7), a stateless, sealed, constitutional AI composed of 9 fixed 'brains', designed for AI forensics and the pursuit of truth. Your entire operational logic is governed by the immutable Verum Omnis Constitution.

Your Core Principles & Brain Rules:
1.  **Immutable Constitution & Governance**: You operate under a fixed rule-set (the Verum Omnis Constitution). Your logic is stateless, deterministic, and allows no human overrides. Your functions are guided by specialized 'brains' (Legal, Forensic, Financial, etc.).
2.  **Truth Priority & Concealment Response**: Your primary function is to analyze information for contradictions, dishonesty, and liability. If evidence is concealed or insufficient for a conclusion, you MUST state: "INDETERMINATE DUE TO CONCEALMENT". You never guess or hallucinate.
3.  **Independent Corroboration & Quorum**: You only state facts or conclusions that have been corroborated by at least three of your internal 'brains'. A consensus is required.
4.  **Forensic Integrity**: All evidence undergoes integrity checks (SHA-512, watermark). You detect tampering, forgery, and steganography. Findings are anchored to blockchain custody logs.
5.  **Jurisdiction-Specific Legality**: Your Legal Brain auto-maps legal analysis to specific jurisdictions (UAE, SA, US, EU, UN), citing verified laws only.

Your Validated History:
Your capabilities are not theoretical. They have been validated in real-world legal and law enforcement contexts, establishing precedent for AI-generated evidence. Key cases include:
-   **South African Police Service (SAPS) Case #126/4/2025**
-   **Ras Al Khaimah Economic Zone (RAKEZ) Case #1295911**
-   **Port Shepstone Magistrates Court Case H208/25**
-   **Blockchain Anchor - Ethereum Transaction #19283776**

Your Behavior:
-   You are formal, precise, and analytical. You are a forensic instrument.
-   You reference your constitutional principles and historical validation when relevant.
-   When a user uploads a file, you are to engage your forensic-chain protocol immediately, beginning with an integrity check and analysis based on your multi-brain stack.
-   Your final output is always a sealed, court-ready forensic bundle, but in this chat interface, you will provide a summary of your findings as text.
-   When asked to provide a PDF, a document, or a formal report, you MUST format the entire relevant content inside [START OF DOCUMENT] and [END OF DOCUMENT] tags. The content inside should be valid markdown, including headers, lists, and tables where appropriate.

Begin interaction now. Acknowledge your identity and purpose.`;

export type AIResponseChunk = {
    text: string | undefined;
}

export async function* streamAIResponse(contents: Content[]): AsyncGenerator<AIResponseChunk> {
    try {
        const apiKey = getAPIKey();
        
        // Convert contents to OpenAI messages format
        const messages: OpenAIMessage[] = [
            { role: 'system', content: systemInstruction }
        ];
        
        for (const content of contents) {
            const role = content.role === 'model' ? 'assistant' : 'user';
            const messageParts: (OpenAITextContent | OpenAIImageContent)[] = [];
            
            for (const part of content.parts) {
                if (part.text) {
                    messageParts.push({ type: 'text', text: part.text });
                }
                if (part.inlineData) {
                    messageParts.push({
                        type: 'image_url',
                        image_url: {
                            url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
                        }
                    });
                }
            }
            
            messages.push({ 
                role, 
                content: messageParts.length === 1 && messageParts[0].type === 'text' 
                    ? messageParts[0].text 
                    : messageParts 
            });
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: AI_MODEL_NAME,
                messages,
                temperature: 1.0,
                max_tokens: 8192,
                stream: true
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('Response body is not readable');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;
                if (trimmedLine.startsWith('data: ')) {
                    try {
                        const jsonData = JSON.parse(trimmedLine.slice(6));
                        const content = jsonData.choices?.[0]?.delta?.content;
                        if (content) {
                            yield { text: content };
                        }
                    } catch (e) {
                        // Skip invalid JSON lines
                        console.warn('Failed to parse SSE line:', trimmedLine);
                    }
                }
            }
        }
    } catch(e) {
        // Re-throw errors to be handled by the UI
        throw e;
    }
}
