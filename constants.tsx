
import React from 'react';
import { ShieldAlert, Home, Briefcase, ShoppingCart, Users, Siren, Scale, BookOpen, FileText } from 'lucide-react';
import { Category, Language, DocumentTemplate } from './types';

export const CATEGORIES = [
  { id: 'traffic', name: Category.TRAFFIC, icon: <ShieldAlert className="w-6 h-6" />, color: 'bg-blue-100 text-blue-700' },
  { id: 'landlord', name: Category.LANDLORD, icon: <Home className="w-6 h-6" />, color: 'bg-green-100 text-green-700' },
  { id: 'workplace', name: Category.WORKPLACE, icon: <Briefcase className="w-6 h-6" />, color: 'bg-purple-100 text-purple-700' },
  { id: 'consumer', name: Category.CONSUMER, icon: <ShoppingCart className="w-6 h-6" />, color: 'bg-orange-100 text-orange-700' },
  { id: 'domestic', name: Category.DOMESTIC, icon: <Users className="w-6 h-6" />, color: 'bg-pink-100 text-pink-700' },
  { id: 'emergency', name: Category.EMERGENCY, icon: <Siren className="w-6 h-6" />, color: 'bg-red-100 text-red-700' },
];

export const LANGUAGES: { name: Language; label: string }[] = [
  { name: 'English', label: 'English' },
  { name: 'Pidgin', label: 'Pidgin' },
  { name: 'Yoruba', label: 'Yoruba' },
  { name: 'Igbo', label: 'Igbo' },
  { name: 'Hausa', label: 'Hausa' },
];

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'demand-letter-rent',
    name: 'Rent Demand Letter',
    description: 'A formal letter to a landlord regarding essential repairs or rent disputes.',
    category: 'Tenancy',
    fields: ['Landlord Name', 'Property Address', 'Issue Description', 'Deadline Date', 'Your Name'],
    content: `To: {{Landlord Name}}
From: {{Your Name}}
Address: {{Property Address}}
Date: {{Date}}

Subject: Formal Notice Regarding {{Issue Description}}

I am writing to formally bring to your attention the issue of {{Issue Description}} at my rented apartment. 

According to Nigerian Tenancy Laws, specifically regarding the right to quiet enjoyment and essential services, I request that this matter be resolved by {{Deadline Date}}.

Failure to address this within the stipulated time may leave me with no choice but to seek legal redress at the Tenancy Tribunal.

Sincerely,
{{Your Name}}`
  },
  {
    id: 'quit-notice-response',
    name: 'Response to Quit Notice',
    description: 'A formal reply to an invalid or sudden eviction notice.',
    category: 'Tenancy',
    fields: ['Landlord Name', 'Date Received', 'Contract End Date', 'Your Name'],
    content: `Dear {{Landlord Name}},

I acknowledge receipt of your notice to quit dated {{Date Received}}.

However, I wish to point out that under the Recovery of Premises Act, as a yearly tenant, I am entitled to a statutory six months' notice. Since your notice does not comply with this legal requirement, it is invalid.

I remain committed to my obligations as a tenant but insist on my legal rights.

Regards,
{{Your Name}}`
  },
  {
    id: 'police-harassment-petition',
    name: 'Police Complaint Petition',
    description: 'A formal petition to the Police Complaints Commission.',
    category: 'Civil Rights',
    fields: ['Police Station', 'Officer Name/Description', 'Incident Date', 'Details of Harassment', 'Your Name'],
    content: `To the Commissioner of Police,
{{Police Station}}

PETITION AGAINST {{Officer Name/Description}} FOR UNLAWFUL HARASSMENT

I, {{Your Name}}, wish to lodge a formal complaint regarding an incident on {{Incident Date}}.

On the said date, I was subjected to {{Details of Harassment}} which is a violation of my fundamental human rights as enshrined in Section 34 of the 1999 Constitution of Nigeria.

I request an immediate investigation into this conduct.

Yours faithfully,
{{Your Name}}`
  },
  {
    id: 'employment-termination-response',
    name: 'Unfair Dismissal Notice',
    description: 'A response to an employer for summary dismissal without due process.',
    category: 'Workplace',
    fields: ['Company Name', 'HR Manager Name', 'Last Day Worked', 'Reason Given', 'Your Name'],
    content: `To: {{HR Manager Name}}
{{Company Name}}

Subject: Formal Objection to Summary Dismissal

I refer to the termination of my employment on {{Last Day Worked}}. 

I wish to state that my dismissal for "{{Reason Given}}" was done without adherence to the disciplinary procedures outlined in the Labour Act of Nigeria and my employment contract.

I request a formal review of this decision or a payment of my full benefits in lieu of notice.

Regards,
{{Your Name}}`
  },
  {
    id: 'small-business-service-agreement',
    name: 'Simple Service Agreement',
    description: 'A basic contract for freelance or artisan services (e.g., mechanic, tailor).',
    category: 'Business',
    fields: ['Client Name', 'Service Description', 'Total Fee', 'Completion Date', 'Your Name'],
    content: `SERVICE AGREEMENT

This agreement is between {{Your Name}} (Provider) and {{Client Name}} (Client).

1. SERVICES: Provider agrees to perform {{Service Description}}.
2. PAYMENT: Client shall pay a total sum of {{Total Fee}}. An initial deposit of 50% is required.
3. DEADLINE: Work shall be completed by {{Completion Date}}.
4. DISPUTES: Any disputes shall be resolved through mediation before seeking legal action.

Signed,
Provider: {{Your Name}}
Client: {{Client Name}}
Date: {{Date}}`
  }
];

export const GLOSSARY = [
  { term: 'Eviction Notice', definition: 'A formal letter from a landlord asking a tenant to move out within a specified legal timeframe.' },
  { term: 'Warrant', definition: 'A legal document issued by a judge or magistrate authorizing the police to perform a specified act, like a search or arrest.' },
  { term: 'Consumer Protection Council (CPC)', definition: 'The Nigerian agency responsible for protecting consumers from unfair trade practices.' },
  { term: 'Small Claims Court', definition: 'A special judicial process for resolving minor financial disputes quickly and without complex legal fees.' },
  { term: 'Tenancy Agreement', definition: 'A contract between a landlord and a tenant that outlines the rights and responsibilities of both parties.' },
  { term: 'Power of Attorney', definition: 'A legal document that allows one person to act on behalf of another in legal or financial matters.' },
  { term: 'Fundamental Human Rights', definition: 'Basic rights and freedoms that every Nigerian is entitled to under Chapter IV of the Constitution.' },
];
