
export enum Category {
  TRAFFIC = 'Traffic / Police Stops',
  LANDLORD = 'Landlord / Tenant Issues',
  WORKPLACE = 'Workplace & Salary Rights',
  CONSUMER = 'Consumer Rights / Fraud',
  DOMESTIC = 'Domestic Disputes',
  EMERGENCY = 'Emergency Situations'
}

export type Language = 'English' | 'Pidgin' | 'Yoruba' | 'Igbo' | 'Hausa';

export interface LegalAdvice {
  explanation: string;
  steps: string[];
  laws: { title: string; section: string; link?: string }[];
  templates?: { name: string; content: string }[];
  contacts?: { name: string; info: string }[];
  groundingUrls?: string[];
}

export interface ClarificationQuestion {
  question: string;
  options: string[];
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string; // Markdown or raw text with placeholders like {{name}}
  fields: string[]; // List of placeholder keys
}

export interface SavedCase {
  id: string;
  title: string;
  timestamp: number;
  advice: LegalAdvice;
  status: 'pending' | 'resolved' | 'sent';
}

export interface AppState {
  currentView: 'home' | 'interaction' | 'tracker' | 'glossary' | 'emergency' | 'templates';
  history: string[];
  isSearching: boolean;
  language: Language;
}
