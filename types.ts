
export interface DocumentSeal {
  hash: string;
  timestamp: string;
  filename: string;
  fileType: string;
  size: number;
  sealed: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  file?: {
    name:string;
    type: string;
    data: string;
    seal?: DocumentSeal;  // Document seal metadata
  };
  seal?: string;  // AI response seal
  actions?: string[];
  isPdfContent?: boolean;
  pdfContent?: string;
}
