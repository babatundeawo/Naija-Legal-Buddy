
import React from 'react';
import { ShieldAlert, Home, Briefcase, ShoppingCart, Users, Siren } from 'lucide-react';
import { Category, Language, DocumentTemplate } from './types';

export const CATEGORIES = [
  { id: 'traffic', name: Category.TRAFFIC, icon: <ShieldAlert className="w-5 h-5" />, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  { id: 'landlord', name: Category.LANDLORD, icon: <Home className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { id: 'workplace', name: Category.WORKPLACE, icon: <Briefcase className="w-5 h-5" />, color: 'bg-slate-50 text-slate-600 border-slate-200' },
  { id: 'consumer', name: Category.CONSUMER, icon: <ShoppingCart className="w-5 h-5" />, color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { id: 'domestic', name: Category.DOMESTIC, icon: <Users className="w-5 h-5" />, color: 'bg-rose-50 text-rose-600 border-rose-100' },
  { id: 'emergency', name: Category.EMERGENCY, icon: <Siren className="w-5 h-5" />, color: 'bg-red-50 text-red-600 border-red-100' },
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
    category: 'Employment',
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

export const LEGAL_GUIDES = [
  {
    id: 'landlord-tenant',
    title: 'Landlord-Tenant Disputes',
    description: 'A comprehensive guide on eviction, rent, and repairs in Nigeria.',
    sections: [
      {
        title: 'Eviction Process',
        content: 'In Nigeria, a landlord cannot forcefully evict a tenant. They must follow the legal process: 1. Serve a valid Notice to Quit (6 months for yearly tenants, 1 month for monthly). 2. Serve a 7-day Notice of Owner\'s Intention to Recover Possession. 3. File a suit in court. Only a court bailiff can physically evict a tenant.'
      },
      {
        title: 'Rent Increases',
        content: 'Rent increases must be reasonable and usually require notice. A landlord cannot arbitrarily double the rent. If you feel an increase is unfair, you can challenge it at the Rent Tribunal.'
      },
      {
        title: 'Repairs and Maintenance',
        content: 'Landlords are generally responsible for structural repairs (roof, walls, external pipes). Tenants are responsible for internal maintenance. If a landlord refuses to make essential repairs, you can apply to the court for an order to repair or for permission to repair and deduct from rent.'
      }
    ]
  },
  {
    id: 'police-stops',
    title: 'Handling Police Stops',
    description: 'Your rights and procedures during a police encounter in Nigeria.',
    sections: [
      {
        title: 'Your Rights',
        content: 'You have the right to remain silent. You have the right to be told why you are being stopped. You have the right to see the officer\'s ID card. You have the right to call your lawyer or family.'
      },
      {
        title: 'Procedures',
        content: 'Stay calm and polite. Show your ID if requested. Do not resist physically. If you are being searched, you have the right to have a witness present. Officers cannot search your phone without a warrant.'
      },
      {
        title: 'What to do if Harassed',
        content: 'Take note of the officer\'s name, badge number, and vehicle plate. Do not argue. Report the incident to the Police Complaints Commission or the nearest Area Command.'
      }
    ]
  },
  {
    id: 'fundamental-rights',
    title: 'Fundamental Legal Rights',
    description: 'Key rights guaranteed to every Nigerian citizen.',
    sections: [
      {
        title: 'Right to Liberty',
        content: 'No person shall be deprived of their liberty except in accordance with the law. If arrested, you must be brought before a court within a reasonable time (usually 24-48 hours).'
      },
      {
        title: 'Right to Fair Hearing',
        content: 'Every person is entitled to a fair hearing within a reasonable time by a court or tribunal. You are presumed innocent until proven guilty.'
      },
      {
        title: 'Right to Privacy',
        content: 'The privacy of citizens, their homes, correspondence, telephone conversations, and telegraphic communications is guaranteed and protected.'
      }
    ]
  },
  {
    id: 'consumer-rights',
    title: 'Consumer Rights & Fraud',
    description: 'Protection against faulty goods and unfair trade practices in Nigeria.',
    sections: [
      {
        title: 'Right to Quality',
        content: 'Under the Federal Competition and Consumer Protection Act (FCCPA), consumers have the right to goods that are of good quality and fit for their purpose. If a product is faulty, you have the right to a repair, replacement, or refund.'
      },
      {
        title: 'Protection from Fraud',
        content: 'Be wary of "too good to be true" offers. Always verify the identity of sellers. If you are a victim of fraud, report it to the FCCPC or the EFCC (for financial crimes).'
      },
      {
        title: 'Unfair Trade Practices',
        content: 'Businesses are prohibited from making false or misleading representations about their products. This includes fake discounts or false claims about product benefits.'
      }
    ]
  },
  {
    id: 'workplace-issues',
    title: 'Workplace Issues',
    description: 'Salary rights, unfair dismissal, and working conditions in Nigeria.',
    sections: [
      {
        title: 'Salary Rights',
        content: 'The Labour Act requires employers to pay wages in legal tender. Deductions from wages are strictly regulated and generally require the employee\'s consent or a court order.'
      },
      {
        title: 'Unfair Dismissal',
        content: 'An employer must follow the terms of the employment contract and the Labour Act when terminating employment. Summary dismissal without a fair hearing is often considered unfair.'
      },
      {
        title: 'Working Conditions',
        content: 'Employees are entitled to a safe working environment, reasonable working hours, and rest periods. The Labour Act also provides for sick leave and maternity leave.'
      }
    ]
  }
];
