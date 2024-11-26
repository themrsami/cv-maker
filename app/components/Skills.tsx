'use client';

import { FC, useState } from 'react';
import { useCV } from '../context/CVContext';
import EditableSection from './EditableSection';
import EditableHeading from './EditableHeading';
import { Skill } from '../types/cv';
import { 
  skillsStyles, skillLevels, levelColors, levelBars, 
  SkillStyle, SkillLevel 
} from '../data/skillsStyles';
import { Layout, Plus, X, Check } from 'lucide-react';

const Skills: FC = () => {
  const { cvData, updateCV } = useCV();
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<SkillStyle>(skillsStyles[0]);

  const handleSkillChange = (index: number, field: keyof Skill, content: string) => {
    const newSkills = [...cvData.skills];
    newSkills[index] = { 
      ...newSkills[index], 
      [field]: field === 'level' && !skillLevels.includes(content as SkillLevel) 
        ? 'Beginner' 
        : content 
    };
    updateCV({ skills: newSkills });
  };

  const cycleSkillLevel = (index: number) => {
    const currentLevel = cvData.skills[index].level as SkillLevel;
    const currentIndex = skillLevels.indexOf(currentLevel);
    const nextIndex = (currentIndex + 1) % skillLevels.length;
    handleSkillChange(index, 'level', skillLevels[nextIndex]);
  };

  const addSkill = () => {
    const newSkill: Skill = {
      name: 'New Skill',
      level: 'Beginner'
    };
    updateCV({ skills: [...cvData.skills, newSkill] });
  };

  const removeSkill = (index: number) => {
    const newSkills = cvData.skills.filter((_, i) => i !== index);
    updateCV({ skills: newSkills });
  };

  const changeStyle = (style: SkillStyle) => {
    setSelectedStyle(style);
    setShowStyleSelector(false);
  };

  const renderSkillItem = (skill: Skill, index: number) => {
    if (selectedStyle.id === 'bars') {
      return (
        <div key={index} className={`${selectedStyle.itemClassName} group`}>
          <div className="flex items-center justify-between">
            <EditableSection
              content={skill.name}
              onChange={(content) => handleSkillChange(index, 'name', content)}
              className="font-medium text-gray-800"
            />
            <button
              onClick={() => cycleSkillLevel(index)}
              className="text-sm text-gray-600"
            >
              {skill.level}
            </button>
          </div>
          <div className="relative h-2 bg-gray-100 rounded-full">
            <div 
              className="absolute inset-y-0 left-0 bg-blue-500 rounded-full transition-all"
              style={{ width: `${levelBars[skill.level as SkillLevel]}%` }}
            />
          </div>
          <button
            onClick={() => removeSkill(index)}
            className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-8 top-0"
          >
            <X size={16} className="text-gray-500 hover:text-red-500" />
          </button>
        </div>
      );
    }

    return (
      <div 
        key={index} 
        className={`${selectedStyle.itemClassName} group relative`}
      >
        <EditableSection
          content={skill.name}
          onChange={(content) => handleSkillChange(index, 'name', content)}
          className="font-medium text-gray-800"
        />
        <button
          onClick={() => cycleSkillLevel(index)}
          className={`text-xs ${levelColors[skill.level as SkillLevel]} px-2 py-0.5 rounded`}
        >
          {skill.level}
        </button>
        <button
          onClick={() => removeSkill(index)}
          className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-8 top-1/2 -translate-y-1/2"
        >
          <X size={16} className="text-gray-500 hover:text-red-500" />
        </button>
      </div>
    );
  };

  return (
    <div className="relative border-b pb-2 mb-2">
      {/* Controls - Absolutely positioned and print-hidden */}
      <div className="absolute -right-12 top-0 flex flex-col gap-2 print:hidden">
        <button
          onClick={addSkill}
          className="p-1 hover:bg-gray-100 rounded bg-white shadow-sm"
          title="Add skill"
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
            {skillsStyles.map(style => (
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

      {/* Main Section */}
      <div>
        <EditableHeading
          content="Technical Skills"
          onChange={(value) => updateCV({ headings: { ...cvData.headings, skills: value } })}
        />
        <div className={selectedStyle.className}>
          {cvData.skills.map((skill, index) => renderSkillItem(skill, index))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
