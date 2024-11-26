'use client';

import { FC, useRef, useState } from 'react';
import ContactInfo from './ContactInfo';
import Summary from './Summary';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';
import Certificates from './Certificates';
import Courses from './Courses';
import SpacingVisualizer from './SpacingVisualizer';

interface CVProps {
  template?: string;
}

const CV: FC<CVProps> = ({ template = 'modern' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCustomStylesEnabled, setIsCustomStylesEnabled] = useState(false);

  const templateStyles = {
    modern: {
      container: 'p-8 space-y-6 font-sans',
      section: 'space-y-4 relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-gray-100',
    },
    classic: {
      container: 'p-8 space-y-8 font-serif',
      section: 'space-y-6 border-b border-gray-200 pb-6 last:border-b-0',
    },
    minimal: {
      container: 'p-6 space-y-4 font-sans text-sm',
      section: 'space-y-3',
    },
    professional: {
      container: 'p-8 space-y-6 font-sans [&>div:first-child]:-mx-8 [&>div:first-child]:px-8 [&>div:first-child]:py-12 [&>div:first-child]:mb-8',
      section: 'space-y-4 relative',
    },
  };

  const styles = templateStyles[template as keyof typeof templateStyles];

  return (
    <div className="relative min-h-screen">
      <div ref={containerRef} className={`${styles.container} relative`}>
        <div className="p-4 mb-8">
          <ContactInfo />
        </div>
        <div className={`${styles.section} p-4 mb-6`}>
          <Summary />
        </div>
        <div className={`${styles.section} p-4 mb-6`}>
          <Experience />
        </div>
        <div className={`${styles.section} p-4 mb-6`}>
          <Education />
        </div>
        <div className={`${styles.section} p-4 mb-6`}>
          <Skills />
        </div>
        <div className={`${styles.section} p-4 mb-6`}>
          <Certificates />
        </div>
        <div className={`${styles.section} p-4 mb-6`}>
          <Courses />
        </div>
      </div>

      <button
        onClick={() => setIsCustomStylesEnabled(prev => !prev)}
        className="fixed bottom-4 right-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md z-50 print:hidden"
      >
        {isCustomStylesEnabled ? 'Disable Custom Styles' : 'Enable Custom Styles'}
      </button>

      {isCustomStylesEnabled && <SpacingVisualizer containerRef={containerRef} />}
    </div>
  );
};

export default CV;
