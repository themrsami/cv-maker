'use client';

import { FC, useState } from 'react';
import { useCV } from '../context/CVContext';
import EditableSection from './EditableSection';
import EditableHeading from './EditableHeading';
import { summaryStyles, SummaryStyle } from '../data/summaryStyles';
import { Layout, Plus, X, Check } from 'lucide-react';

const Summary: FC = () => {
  const { cvData, updateCV } = useCV();
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<SummaryStyle>(summaryStyles[0]);
  const [paragraphs, setParagraphs] = useState<string[]>(
    selectedStyle.layout === 'single' 
      ? [cvData.summary] 
      : cvData.summary.split('\n\n').filter(p => p.trim())
  );

  const handleChange = (content: string, index: number) => {
    let newSummary: string;
    const newParagraphs = [...paragraphs];
    newParagraphs[index] = content;
    setParagraphs(newParagraphs);

    if (selectedStyle.layout === 'single') {
      newSummary = content;
    } else {
      newSummary = newParagraphs.join('\n\n');
    }
    updateCV({ summary: newSummary });
  };

  const addParagraph = () => {
    if (selectedStyle.layout === 'single') return;
    const newParagraphs = [...paragraphs, ''];
    setParagraphs(newParagraphs);
    updateCV({ summary: newParagraphs.join('\n\n') });
  };

  const removeParagraph = (index: number) => {
    if (selectedStyle.layout === 'single') return;
    const newParagraphs = paragraphs.filter((_, i) => i !== index);
    setParagraphs(newParagraphs);
    updateCV({ summary: newParagraphs.join('\n\n') });
  };

  const changeStyle = (style: SummaryStyle) => {
    setSelectedStyle(style);
    setShowStyleSelector(false);

    // Convert current content to new format
    let newParagraphs: string[];
    if (style.layout === 'single') {
      newParagraphs = [paragraphs.join('\n\n')];
    } else {
      newParagraphs = paragraphs.flatMap(p => p.split('\n\n').filter(p => p.trim()));
    }
    setParagraphs(newParagraphs);
    updateCV({ summary: newParagraphs.join('\n\n') });
  };

  const renderContent = () => {
    switch (selectedStyle.layout) {
      case 'bullets':
        return (
          <ul className={selectedStyle.className}>
            {paragraphs.map((paragraph, index) => (
              <li key={index} className="relative group">
                <EditableSection
                  content={paragraph}
                  onChange={(content) => handleChange(content, index)}
                  className="inline-block w-[calc(100%-2rem)]"
                />
                {paragraphs.length > 1 && (
                  <button
                    onClick={() => removeParagraph(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-1"
                  >
                    <X size={16} className="text-gray-500 hover:text-red-500" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        );
      case 'paragraphs':
        return (
          <div className={selectedStyle.className}>
            {paragraphs.map((paragraph, index) => (
              <div key={index} className="relative group">
                <EditableSection
                  content={paragraph}
                  onChange={(content) => handleChange(content, index)}
                  className="inline-block w-[calc(100%-2rem)]"
                />
                {paragraphs.length > 1 && (
                  <button
                    onClick={() => removeParagraph(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-1"
                  >
                    <X size={16} className="text-gray-500 hover:text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
        );
      default:
        return (
          <EditableSection
            content={paragraphs[0] || ''}
            onChange={(content) => handleChange(content, 0)}
            className={selectedStyle.className}
          />
        );
    }
  };

  return (
    <div className="relative">
      {/* Controls - Absolutely positioned and print-hidden */}
      <div className="absolute -right-12 top-0 flex flex-col gap-2 print:hidden">
        {selectedStyle.layout !== 'single' && (
          <button
            onClick={addParagraph}
            className="p-1 hover:bg-gray-100 rounded bg-white shadow-sm"
            title="Add paragraph"
          >
            <Plus size={16} className="text-gray-600" />
          </button>
        )}
        <button
          onClick={() => setShowStyleSelector(!showStyleSelector)}
          className="p-1 hover:bg-gray-100 rounded bg-white shadow-sm"
          title="Change layout"
        >
          <Layout size={16} className="text-gray-600" />
        </button>

        {showStyleSelector && (
          <div className="absolute right-8 top-0 bg-white shadow-lg rounded-lg p-2 z-10 min-w-[120px]">
            {summaryStyles.map(style => (
              <button
                key={style.id}
                onClick={() => changeStyle(style)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 w-full rounded"
              >
                {style.name}
                {selectedStyle.id === style.id && (
                  <Check size={16} className="text-green-500" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Summary Section */}
      <div className="border-b pb-2 mb-2">
        <EditableHeading
          content="Professional Summary"
          onChange={(value) => updateCV({ headings: { ...cvData.headings, summary: value } })}
        />
        {renderContent()}
      </div>
    </div>
  );
};

export default Summary;
