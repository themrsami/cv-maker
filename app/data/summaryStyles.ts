export type SummaryStyle = {
  id: string;
  name: string;
  layout: 'single' | 'bullets' | 'paragraphs';
  className: string;
};

export const summaryStyles: SummaryStyle[] = [
  {
    id: 'single-paragraph',
    name: 'Single Paragraph',
    layout: 'single',
    className: 'text-gray-700 leading-relaxed',
  },
  {
    id: 'bullet-points',
    name: 'Bullet Points',
    layout: 'bullets',
    className: 'list-disc list-inside space-y-1 text-gray-700',
  },
  {
    id: 'multi-paragraph',
    name: 'Multiple Paragraphs',
    layout: 'paragraphs',
    className: 'space-y-2 text-gray-700',
  },
];
