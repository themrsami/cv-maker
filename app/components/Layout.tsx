'use client';

import { FC, useState } from 'react';
import { useCV } from '../context/CVContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import CV from './CV';

const sections = [
  { id: 'contactInfo' as const, label: 'Contact Info' },
  { id: 'summary' as const, label: 'Summary' },
  { id: 'experiences' as const, label: 'Experience' },
  { id: 'education' as const, label: 'Education' },
  { id: 'skills' as const, label: 'Skills' },
  { id: 'certificates' as const, label: 'Certificates' },
  { id: 'courses' as const, label: 'Courses' },
] as const;

const templates = [
  { id: 'modern', label: 'Modern' },
  { id: 'classic', label: 'Classic' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'professional', label: 'Professional' },
] as const;

type SectionId = typeof sections[number]['id'];

const Layout: FC = () => {
  const { cvData, updateCV } = useCV();
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[number]['id']>('modern');
  const [editedJson, setEditedJson] = useState<Record<string, string>>({});

  const handleJsonEdit = (sectionId: SectionId, jsonString: string) => {
    try {
      const parsedJson = JSON.parse(jsonString);
      setEditedJson(prev => ({ ...prev, [sectionId]: jsonString }));
      updateCV({ [sectionId]: parsedJson });
    } catch {
      // If JSON is invalid, just update the editor but don't update the CV
      setEditedJson(prev => ({ ...prev, [sectionId]: jsonString }));
    }
  };

  const getJsonContent = (sectionId: SectionId) => {
    if (sectionId in editedJson) {
      return editedJson[sectionId];
    }
    const content = cvData[sectionId];
    return content ? JSON.stringify(content, null, 2) : '{}';
  };

  return (
    <div className="flex h-screen bg-gray-900 p-8 gap-8 print:block print:bg-white print:h-auto print:p-0">
      {/* Left Side - JSON Editor */}
      <div className="w-[500px] print:hidden">
        <Card className="h-[calc(100vh-4rem)] overflow-hidden rounded-xl border-gray-800 bg-gray-800">
          <Tabs defaultValue="contactInfo" className="flex-1">
            <div className="border-b border-gray-700 bg-gray-800 rounded-t-xl">
              <TabsList className="w-full h-auto p-1 bg-gray-900/50 rounded-t-xl">
                <div className="flex flex-wrap gap-1">
                  {sections.map((section) => (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className="px-3 py-1.5 text-gray-300 data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-lg"
                    >
                      {section.label}
                    </TabsTrigger>
                  ))}
                </div>
              </TabsList>
            </div>
            <ScrollArea className="flex-1 h-[calc(100vh-10rem)]">
              {sections.map((section) => (
                <TabsContent 
                  key={section.id} 
                  value={section.id}
                  className="p-4 mt-0"
                >
                  <textarea
                    className="w-full h-[calc(100vh-12rem)] p-4 font-mono text-sm bg-gray-900 text-gray-100 resize-none focus:outline-none rounded-lg border border-gray-700 focus:border-gray-600"
                    value={getJsonContent(section.id)}
                    onChange={(e) => handleJsonEdit(section.id, e.target.value)}
                    spellCheck={false}
                  />
                </TabsContent>
              ))}
            </ScrollArea>
          </Tabs>
        </Card>
      </div>

      {/* Center - CV Preview */}
      <div className="flex-1 overflow-auto scrollbar-hide print:overflow-visible print:p-0">
        <div className="max-w-[850px] mx-auto bg-white shadow-lg rounded-xl print:shadow-none print:max-w-none print:rounded-none">
          <CV template={selectedTemplate} />
        </div>
      </div>

      {/* Right Sidebar - Template Selection */}
      <div className="w-64 print:hidden">
        <Card className="p-6 rounded-xl border-gray-800 bg-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-white">Templates</h2>
          <div className="grid gap-3">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`w-full p-3 text-left rounded-lg border transition-all ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-900/50 text-white shadow-sm'
                    : 'border-gray-700 hover:border-gray-600 hover:bg-gray-700/50 text-gray-300 hover:text-white'
                }`}
              >
                {template.label}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Layout;
