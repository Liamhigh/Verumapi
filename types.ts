
export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  city?: string;
  country?: string;
  timezone?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  file?: {
    name:string;
    type: string;
    data: string;
  };
  seal?: string;
  actions?: string[];
  isPdfContent?: boolean;
  pdfContent?: string;
  geolocation?: GeolocationData;
  timestamp?: string;
}

export interface CaseData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  summary?: string;
}
