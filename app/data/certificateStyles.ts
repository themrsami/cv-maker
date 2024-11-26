export type CertificateStyle = {
  id: string;
  name: string;
  className: string;
  itemClassName: string;
};

export const certificateStyles: CertificateStyle[] = [
  {
    id: 'grid',
    name: 'Grid',
    className: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    itemClassName: 'flex flex-col p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors group relative',
  },
  {
    id: 'list',
    name: 'List',
    className: 'space-y-3',
    itemClassName: 'flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group relative',
  },
  {
    id: 'compact',
    name: 'Compact',
    className: 'flex flex-wrap gap-4',
    itemClassName: 'flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group relative',
  },
];
