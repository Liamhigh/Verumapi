
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
}
