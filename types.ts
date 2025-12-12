
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp?: string; // ISO 8601 timestamp when message was created
  geolocation?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
  };
  file?: {
    name: string;
    type: string;
    data: string;
  };
  seal?: string;
  actions?: string[];
  isPdfContent?: boolean;
  pdfContent?: string;
}
