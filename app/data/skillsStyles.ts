export type SkillStyle = {
  id: string;
  name: string;
  className: string;
  itemClassName: string;
};

export const skillsStyles: SkillStyle[] = [
  {
    id: 'tags',
    name: 'Tags',
    className: 'flex flex-wrap gap-2',
    itemClassName: 'inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors',
  },
  {
    id: 'grid',
    name: 'Grid',
    className: 'grid grid-cols-2 md:grid-cols-3 gap-3',
    itemClassName: 'flex items-center justify-between p-2 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors',
  },
  {
    id: 'bars',
    name: 'Progress Bars',
    className: 'space-y-3',
    itemClassName: 'flex flex-col gap-1',
  },
];

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export const skillLevels: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const levelColors: Record<SkillLevel, string> = {
  Beginner: 'text-green-600 bg-green-50',
  Intermediate: 'text-blue-600 bg-blue-50',
  Advanced: 'text-purple-600 bg-purple-50',
  Expert: 'text-red-600 bg-red-50',
};

export const levelBars: Record<SkillLevel, number> = {
  Beginner: 25,
  Intermediate: 50,
  Advanced: 75,
  Expert: 100,
};
