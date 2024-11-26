'use client';

import { FC, useState } from 'react';
import { useCV } from '../context/CVContext';
import EditableSection from './EditableSection';
import EditableHeading from './EditableHeading';
import { Education as EducationType } from '../types/cv';
import { educationStyles, EducationStyle } from '../data/educationStyles';
import { Layout, Plus, X, Check, GraduationCap, BookOpen } from 'lucide-react';

interface EducationSettings {
  showActivities: boolean;
  showGPA: boolean;
}

const Education: FC = () => {
  const { cvData, updateCV } = useCV();
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<EducationStyle>(educationStyles[0]);
  const [educationSettings, setEducationSettings] = useState<{ [key: number]: EducationSettings }>({});

  const getEducationSettings = (index: number): EducationSettings => {
    return educationSettings[index] || { showActivities: true, showGPA: true };
  };

  const toggleSetting = (index: number, setting: keyof EducationSettings) => {
    const currentSettings = getEducationSettings(index);
    setEducationSettings({
      ...educationSettings,
      [index]: {
        ...currentSettings,
        [setting]: !currentSettings[setting]
      }
    });
  };

  const handleEducationChange = (index: number, field: keyof EducationType, content: string) => {
    const newEducation = [...cvData.education];
    newEducation[index] = { ...newEducation[index], [field]: content };
    updateCV({ education: newEducation });
  };

  const addEducation = () => {
    const newEducation: EducationType = {
      institution: 'Institution Name',
      degree: 'Degree Name',
      major: 'Major/Field of Study',
      graduationYear: 'Graduation Year',
      gpa: '3.5',
      activities: [
        'Add your extracurricular activities',
        'Add your achievements or honors'
      ]
    };
    const newIndex = cvData.education.length;
    setEducationSettings({
      ...educationSettings,
      [newIndex]: { showActivities: true, showGPA: true }
    });
    updateCV({ education: [...cvData.education, newEducation] });
  };

  const removeEducation = (index: number) => {
    const newEducation = cvData.education.filter((_: EducationType, i: number) => i !== index);
    const newSettings = { ...educationSettings };
    delete newSettings[index];
    setEducationSettings(newSettings);
    updateCV({ education: newEducation });
  };

  const addActivity = (eduIndex: number) => {
    const newEducation = [...cvData.education];
    if (!newEducation[eduIndex].activities) {
      newEducation[eduIndex].activities = [];
    }
    newEducation[eduIndex].activities!.push('New activity or achievement');
    updateCV({ education: newEducation });
  };

  const removeActivity = (eduIndex: number, activityIndex: number) => {
    const newEducation = [...cvData.education];
    if (newEducation[eduIndex].activities) {
      newEducation[eduIndex].activities = newEducation[eduIndex].activities!.filter((_: string, i: number) => i !== activityIndex);
      updateCV({ education: newEducation });
    }
  };

  const changeStyle = (style: EducationStyle) => {
    setSelectedStyle(style);
    setShowStyleSelector(false);
  };

  return (
    <div className="relative">
      {/* Controls */}
      <div className="absolute -right-12 top-0 flex flex-col gap-2 print:hidden">
        <button
          onClick={addEducation}
          className="p-1 hover:bg-gray-100 rounded bg-white shadow-sm"
          title="Add education"
        >
          <Plus size={16} className="text-gray-600" />
        </button>
        <button
          onClick={() => setShowStyleSelector(!showStyleSelector)}
          className="p-1 hover:bg-gray-100 rounded bg-white shadow-sm"
          title="Change layout"
        >
          <Layout size={16} className="text-gray-600" />
        </button>

        {showStyleSelector && (
          <div className="absolute right-8 top-0 bg-white shadow-lg rounded-lg p-2 z-10 min-w-[120px]">
            {educationStyles.map(style => (
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

      {/* Main Education Section */}
      <div className="border-b pb-2 mb-2">
        <EditableHeading
          content="Education"
          onChange={(value) => updateCV({ headings: { ...cvData.headings, education: value } })}
        />
        <div className={selectedStyle.className}>
          {cvData.education.map((edu, eduIndex) => {
            const settings = getEducationSettings(eduIndex);
            return (
              <div key={eduIndex} className={`${selectedStyle.itemClassName} relative group`}>
                {/* Education Header */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-grow">
                    <EditableSection
                      content={edu.institution}
                      onChange={(content) => handleEducationChange(eduIndex, 'institution', content)}
                      className="font-semibold text-gray-800"
                    />
                    <div className="flex items-center gap-2">
                      <EditableSection
                        content={edu.degree}
                        onChange={(content) => handleEducationChange(eduIndex, 'degree', content)}
                        className="text-gray-600"
                      />
                      <span className="text-gray-400">•</span>
                      <EditableSection
                        content={edu.major}
                        onChange={(content) => handleEducationChange(eduIndex, 'major', content)}
                        className="text-gray-600"
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <EditableSection
                      content={edu.graduationYear}
                      onChange={(content) => handleEducationChange(eduIndex, 'graduationYear', content)}
                      className="text-sm text-gray-500"
                    />
                    {settings.showGPA && edu.gpa && (
                      <EditableSection
                        content={`GPA: ${edu.gpa}`}
                        onChange={(content) => handleEducationChange(eduIndex, 'gpa', content.replace('GPA: ', ''))}
                        className="text-sm text-gray-500"
                      />
                    )}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-20 top-0 flex gap-2 print:hidden">
                    <button
                      onClick={() => toggleSetting(eduIndex, 'showActivities')}
                      className={`p-1 rounded ${settings.showActivities ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200`}
                      title={settings.showActivities ? 'Hide activities' : 'Show activities'}
                    >
                      <BookOpen size={16} className={settings.showActivities ? 'text-gray-800' : 'text-gray-400'} />
                    </button>
                    <button
                      onClick={() => toggleSetting(eduIndex, 'showGPA')}
                      className={`p-1 rounded ${settings.showGPA ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200`}
                      title={settings.showGPA ? 'Hide GPA' : 'Show GPA'}
                    >
                      <GraduationCap size={16} className={settings.showGPA ? 'text-gray-800' : 'text-gray-400'} />
                    </button>
                    <button
                      onClick={() => removeEducation(eduIndex)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <X size={16} className="text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Activities Section */}
                {settings.showActivities && edu.activities && edu.activities.length > 0 && (
                  <div className="mt-2">
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      {edu.activities.map((activity, activityIndex) => (
                        <li key={activityIndex} className="relative group/activity">
                          <EditableSection
                            content={activity}
                            onChange={(content) => {
                              const newEducation = [...cvData.education];
                              if (newEducation[eduIndex].activities) {
                                newEducation[eduIndex].activities![activityIndex] = content;
                                updateCV({ education: newEducation });
                              }
                            }}
                            className="inline-block w-[calc(100%-2rem)]"
                          />
                          {edu.activities && edu.activities.length > 1 && (
                            <button
                              onClick={() => removeActivity(eduIndex, activityIndex)}
                              className="opacity-0 group-hover/activity:opacity-100 transition-opacity absolute right-0 top-1 print:hidden"
                            >
                              <X size={14} className="text-gray-500 hover:text-red-500" />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => addActivity(eduIndex)}
                      className="mt-1 text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1 print:hidden"
                    >
                      <Plus size={14} />
                      <span>Add activity</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Education;
