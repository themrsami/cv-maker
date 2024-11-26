export type ExperienceStyle = {
  id: string;
  name: string;
  layout: 'timeline' | 'cards' | 'minimal';
  className: string;
  itemClassName: string;
};

export const experienceStyles: ExperienceStyle[] = [
  {
    id: 'timeline',
    name: 'Timeline',
    layout: 'timeline',
    className: 'space-y-6',
    itemClassName: 'border-l-2 border-gray-200 pl-4',
  },
  {
    id: 'cards',
    name: 'Cards',
    layout: 'cards',
    className: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    itemClassName: 'bg-gray-50 p-4 rounded-lg shadow-sm',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    layout: 'minimal',
    className: 'space-y-4',
    itemClassName: 'pb-4',
  },
];
