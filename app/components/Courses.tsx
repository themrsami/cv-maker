'use client';

import { FC, useState } from 'react';
import { useCV } from '../context/CVContext';
import EditableSection from './EditableSection';
import EditableHeading from './EditableHeading';
import { Course } from '../types/cv';
import { courseStyles, CourseStyle } from '../data/courseStyles';
import { Layout, Plus, X, Check, BookOpen, Calendar } from 'lucide-react';

const Courses: FC = () => {
  const { cvData, updateCV } = useCV();
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<CourseStyle>(courseStyles[0]);

  const handleCourseChange = (index: number, field: keyof Course, content: string) => {
    const newCourses = [...cvData.courses];
    newCourses[index] = { ...newCourses[index], [field]: content };
    updateCV({ courses: newCourses });
  };

  const addCourse = () => {
    const newCourse: Course = {
      name: 'Course Name',
      platform: 'Learning Platform',
      completionDate: 'Completion Date'
    };
    updateCV({ courses: [...cvData.courses, newCourse] });
  };

  const removeCourse = (index: number) => {
    const newCourses = cvData.courses.filter((_, i) => i !== index);
    updateCV({ courses: newCourses });
  };

  const changeStyle = (style: CourseStyle) => {
    setSelectedStyle(style);
    setShowStyleSelector(false);
  };

  const renderCourseItem = (course: Course, index: number) => {
    if (selectedStyle.id === 'timeline') {
      return (
        <div key={index} className={selectedStyle.itemClassName}>
          <div className="flex-1">
            <EditableSection
              content={course.name}
              onChange={(content) => handleCourseChange(index, 'name', content)}
              className="text-lg font-semibold text-gray-800 mb-1"
            />
            <EditableSection
              content={course.platform}
              onChange={(content) => handleCourseChange(index, 'platform', content)}
              className="text-sm text-gray-600"
            />
            <EditableSection
              content={course.completionDate}
              onChange={(content) => handleCourseChange(index, 'completionDate', content)}
              className="text-sm text-gray-500 mt-2"
            />
          </div>
          <button
            onClick={() => removeCourse(index)}
            className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-8 top-2"
          >
            <X size={16} className="text-gray-500 hover:text-red-500" />
          </button>
        </div>
      );
    }

    if (selectedStyle.id === 'timeline') {
      return (
        <div key={index} className={selectedStyle.itemClassName}>
          <div className="relative flex-none w-8 h-8">
            <div className="absolute w-0.5 h-full bg-gray-200 left-1/2 -translate-x-1/2 top-8" />
            <div className="relative z-10 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <BookOpen size={16} className="text-gray-500" />
            </div>
          </div>
          <div className="flex-1 pt-1">
            <EditableSection
              content={course.name}
              onChange={(content) => handleCourseChange(index, 'name', content)}
              className="font-medium text-gray-800"
            />
            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
              <EditableSection
                content={course.platform}
                onChange={(content) => handleCourseChange(index, 'platform', content)}
                className="text-gray-600"
              />
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar size={14} className="text-gray-400" />
                <EditableSection
                  content={course.completionDate}
                  onChange={(content) => handleCourseChange(index, 'completionDate', content)}
                  className="text-gray-500"
                />
              </div>
            </div>
          </div>
          <button
            onClick={() => removeCourse(index)}
            className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-8 top-2"
          >
            <X size={16} className="text-gray-500 hover:text-red-500" />
          </button>
        </div>
      );
    }

    return (
      <div key={index} className={selectedStyle.itemClassName}>
        <BookOpen size={18} className="text-gray-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <EditableSection
            content={course.name}
            onChange={(content) => handleCourseChange(index, 'name', content)}
            className="font-medium text-gray-800"
          />
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <EditableSection
              content={course.platform}
              onChange={(content) => handleCourseChange(index, 'platform', content)}
              className="text-gray-600"
            />
            <span>•</span>
            <EditableSection
              content={course.completionDate}
              onChange={(content) => handleCourseChange(index, 'completionDate', content)}
              className="text-gray-500"
            />
          </div>
        </div>
        <button
          onClick={() => removeCourse(index)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
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
          onClick={addCourse}
          className="p-1 hover:bg-gray-100 rounded bg-white shadow-sm"
          title="Add course"
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
            {courseStyles.map(style => (
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
          content="Professional Development"
          onChange={(value) => updateCV({ headings: { ...cvData.headings, courses: value } })}
        />
        <div className={selectedStyle.className}>
          {cvData.courses.map((course, index) => renderCourseItem(course, index))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
