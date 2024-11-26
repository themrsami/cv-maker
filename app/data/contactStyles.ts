import { ContactInfo } from '../types/cv';

export type ContactStyle = {
  id: string;
  name: string;
  layout: 'grid' | 'flex' | 'centered';
  className: string;
};

export type ContactField = {
  key: keyof ContactInfo;
  label: string;
  icon: ContactIcon;
};

export type ContactIcon = 'user' | 'mail' | 'phone' | 'map-pin' | 'linkedin' | 'github' | 'globe' | 'twitter';

export const contactStyles: ContactStyle[] = [
  {
    id: 'modern-grid',
    name: 'Modern Grid',
    layout: 'grid',
    className: 'grid grid-cols-2 md:grid-cols-3 print:grid-cols-3 gap-3',
  },
  {
    id: 'centered',
    name: 'Centered',
    layout: 'centered',
    className: 'flex flex-col items-center text-center',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    layout: 'flex',
    className: 'flex flex-wrap gap-4 items-center',
  },
];

export const defaultContactFields: ContactField[] = [
  { key: 'name', label: 'Name', icon: 'user' },
  { key: 'title', label: 'Title', icon: 'user' },
  { key: 'email', label: 'Email', icon: 'mail' },
  { key: 'phone', label: 'Phone', icon: 'phone' },
  { key: 'location', label: 'Location', icon: 'map-pin' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
  { key: 'github', label: 'GitHub', icon: 'github' }
];
