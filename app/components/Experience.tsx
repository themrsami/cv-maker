'use client';

import { FC, useState } from 'react';
import { useCV } from '../context/CVContext';
import EditableSection from './EditableSection';
import EditableHeading from './EditableHeading';
import { Experience as ExperienceType } from '../types/cv';
import { experienceStyles, ExperienceStyle } from '../data/experienceStyles';
import { Layout, Plus, X, Check, ListTodo, Briefcase } from 'lucide-react';

interface ExperienceSettings {
  showBullets: boolean;
  showSkills: boolean;
}

const Experience: FC = () => {
  const { cvData, updateCV } = useCV();
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<ExperienceStyle>(experienceStyles[0]);
  const [experienceSettings, setExperienceSettings] = useState<{ [key: number]: ExperienceSettings }>({});

  const getExperienceSettings = (index: number): ExperienceSettings => {
    return experienceSettings[index] || { showBullets: true, showSkills: true };
  };

  const toggleSetting = (index: number, setting: keyof ExperienceSettings) => {
    const currentSettings = getExperienceSettings(index);
    setExperienceSettings({
      ...experienceSettings,
      [index]: {
        ...currentSettings,
        [setting]: !currentSettings[setting]
      }
    });
  };

  const handleExperienceChange = (expIndex: number, field: keyof ExperienceType, content: string) => {
    const newExperiences = [...cvData.experiences];
    newExperiences[expIndex] = { ...newExperiences[expIndex], [field]: content };
    updateCV({ experiences: newExperiences });
  };

  const handleBulletChange = (expIndex: number, bulletIndex: number, content: string) => {
    const newExperiences = [...cvData.experiences];
    const newResponsibilities = [...newExperiences[expIndex].responsibilities];
    newResponsibilities[bulletIndex] = content;
    newExperiences[expIndex] = { ...newExperiences[expIndex], responsibilities: newResponsibilities };
    updateCV({ experiences: newExperiences });
  };

  const addExperience = () => {
    const newExperience: ExperienceType = {
      company: 'Company Name',
      position: 'Position Title',
      startDate: 'Start Date',
      endDate: 'End Date',
      responsibilities: ['Describe your key responsibilities and achievements'],
      technologies: ['Add technologies used']
    };
    const newIndex = cvData.experiences.length;
    setExperienceSettings({
      ...experienceSettings,
      [newIndex]: { showBullets: true, showSkills: true }
    });
    updateCV({ experiences: [...cvData.experiences, newExperience] });
  };

  const removeExperience = (index: number) => {
    const newExperiences = cvData.experiences.filter((_, i) => i !== index);
    const newSettings = { ...experienceSettings };
    delete newSettings[index];
    setExperienceSettings(newSettings);
    updateCV({ experiences: newExperiences });
  };

  const addBullet = (expIndex: number) => {
    const newExperiences = [...cvData.experiences];
    newExperiences[expIndex].responsibilities.push('Add your responsibility');
    updateCV({ experiences: newExperiences });
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const newExperiences = [...cvData.experiences];
    const newResponsibilities = newExperiences[expIndex].responsibilities.filter((_, i) => i !== bulletIndex);
    newExperiences[expIndex] = { ...newExperiences[expIndex], responsibilities: newResponsibilities };
    updateCV({ experiences: newExperiences });
  };

  const addTechnology = (expIndex: number) => {
    const newExperiences = [...cvData.experiences];
    newExperiences[expIndex].technologies.push('New Skill');
    updateCV({ experiences: newExperiences });
  };

  const removeTechnology = (expIndex: number, techIndex: number) => {
    const newExperiences = [...cvData.experiences];
    const newTechnologies = newExperiences[expIndex].technologies.filter((_, i) => i !== techIndex);
    newExperiences[expIndex] = { ...newExperiences[expIndex], technologies: newTechnologies };
    updateCV({ experiences: newExperiences });
  };

  const changeStyle = (style: ExperienceStyle) => {
    setSelectedStyle(style);
    setShowStyleSelector(false);
  };

  return (
    <div className="relative">
      {/* Controls - Absolutely positioned and print-hidden */}
      <div className="absolute -right-12 top-0 flex flex-col gap-2 print:hidden">
        <button
          onClick={addExperience}
          className="p-1 hover:bg-gray-100 rounded bg-white shadow-sm"
          title="Add experience"
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
            {experienceStyles.map(style => (
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

      {/* Main Experience Section */}
      <div className="border-b pb-2 mb-2">
        <EditableHeading
          content="Work Experience"
          onChange={(value) => updateCV({ headings: { ...cvData.headings, experience: value } })}
        />
        <div className={selectedStyle.className}>
          {cvData.experiences.map((exp, expIndex) => {
            const settings = getExperienceSettings(expIndex);
            return (
              <div key={expIndex} className={`${selectedStyle.itemClassName} relative group`}>
                {/* Experience Header */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-grow">
                    <EditableSection
                      content={exp.position}
                      onChange={(content) => handleExperienceChange(expIndex, 'position', content)}
                      className="font-semibold text-gray-800"
                    />
                    <EditableSection
                      content={exp.company}
                      onChange={(content) => handleExperienceChange(expIndex, 'company', content)}
                      className="text-gray-600"
                    />
                  </div>
                  <div className="text-right text-sm text-gray-500 flex-shrink-0 ml-4">
                    <EditableSection
                      content={exp.startDate}
                      onChange={(content) => handleExperienceChange(expIndex, 'startDate', content)}
                      className="inline-block"
                    />
                    {' - '}
                    <EditableSection
                      content={exp.endDate || 'End Date'}
                      onChange={(content) => handleExperienceChange(expIndex, 'endDate', content)}
                      className="inline-block"
                    />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-20 top-0 flex gap-2 print:hidden">
                    <button
                      onClick={() => toggleSetting(expIndex, 'showBullets')}
                      className={`p-1 rounded ${settings.showBullets ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200`}
                      title={settings.showBullets ? 'Hide bullets' : 'Show bullets'}
                    >
                      <ListTodo size={16} className={settings.showBullets ? 'text-gray-800' : 'text-gray-400'} />
                    </button>
                    <button
                      onClick={() => toggleSetting(expIndex, 'showSkills')}
                      className={`p-1 rounded ${settings.showSkills ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200`}
                      title={settings.showSkills ? 'Hide skills' : 'Show skills'}
                    >
                      <Briefcase size={16} className={settings.showSkills ? 'text-gray-800' : 'text-gray-400'} />
                    </button>
                    <button
                      onClick={() => removeExperience(expIndex)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <X size={16} className="text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Bullets Section */}
                {settings.showBullets && (
                  <div className="relative">
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      {exp.responsibilities.map((resp, bulletIndex) => (
                        <li key={bulletIndex} className="relative group/bullet">
                          <EditableSection
                            content={resp}
                            onChange={(content) => handleBulletChange(expIndex, bulletIndex, content)}
                            className="inline-block w-[calc(100%-2rem)]"
                          />
                          {exp.responsibilities.length > 1 && (
                            <button
                              onClick={() => removeBullet(expIndex, bulletIndex)}
                              className="opacity-0 group-hover/bullet:opacity-100 transition-opacity absolute right-0 top-1 print:hidden"
                            >
                              <X size={14} className="text-gray-500 hover:text-red-500" />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                    {/* Add Bullet Button */}
                    <button
                      onClick={() => addBullet(expIndex)}
                      className="mt-1 text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1 print:hidden"
                    >
                      <Plus size={14} />
                      <span>Add bullet</span>
                    </button>
                  </div>
                )}

                {/* Technologies Section */}
                {settings.showSkills && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, techIndex) => (
                        <div key={techIndex} className="group/tech relative">
                          <EditableSection
                            content={tech}
                            onChange={(content) => {
                              const newExperiences = [...cvData.experiences];
                              const newTechnologies = [...exp.technologies];
                              newTechnologies[techIndex] = content;
                              newExperiences[expIndex] = { ...exp, technologies: newTechnologies };
                              updateCV({ experiences: newExperiences });
                            }}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded"
                          />
                          {exp.technologies.length > 1 && (
                            <button
                              onClick={() => removeTechnology(expIndex, techIndex)}
                              className="opacity-0 group-hover/tech:opacity-100 transition-opacity absolute -right-1 -top-1 print:hidden"
                            >
                              <X size={12} className="text-gray-500 hover:text-red-500" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addTechnology(expIndex)}
                        className="px-2 py-1 text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1 border border-dashed border-gray-300 rounded hover:border-gray-400 print:hidden"
                      >
                        <Plus size={14} />
                        <span>Add Skill</span>
                      </button>
                    </div>
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

export default Experience;
