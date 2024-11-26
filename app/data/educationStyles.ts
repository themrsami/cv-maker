export type EducationStyle = {
  id: string;
  name: string;
  layout: 'classic' | 'modern' | 'compact';
  className: string;
  itemClassName: string;
};

export const educationStyles: EducationStyle[] = [
  {
    id: 'classic',
    name: 'Classic',
    layout: 'classic',
    className: 'space-y-4',
    itemClassName: 'border-l-2 border-gray-200 pl-4',
  },
  {
    id: 'modern',
    name: 'Modern',
    layout: 'modern',
    className: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    itemClassName: 'bg-gray-50 p-4 rounded-lg shadow-sm',
  },
  {
    id: 'compact',
    name: 'Compact',
    layout: 'compact',
    className: 'space-y-2',
    itemClassName: 'pb-2',
  },
];
