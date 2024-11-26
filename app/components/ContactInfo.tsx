'use client';

import { FC, useState } from 'react';
import { useCV } from '../context/CVContext';
import EditableSection from './EditableSection';
import { ContactInfo as ContactInfoType } from '../types/cv';
import { 
  contactStyles, defaultContactFields, ContactStyle, 
  ContactField, ContactIcon
} from '../data/contactStyles';
import { 
  User, Mail, Phone, MapPin, Linkedin, Github, Globe, Twitter,
  Plus, X, Layout, Check,
  LucideIcon
} from 'lucide-react';

const iconMap: Record<ContactIcon, LucideIcon> = {
  user: User,
  mail: Mail,
  phone: Phone,
  'map-pin': MapPin,
  linkedin: Linkedin,
  github: Github,
  globe: Globe,
  twitter: Twitter,
};

const ContactInfo: FC = () => {
  const { cvData, updateCV } = useCV();
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<ContactStyle>(contactStyles[0]);
  const [showAddField, setShowAddField] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleContactChange = (field: keyof ContactInfoType, content: string) => {
    const newContactInfo = { ...cvData.contactInfo, [field]: content };
    updateCV({ contactInfo: newContactInfo });
    setEditingField(null);
  };

  const removeField = (field: keyof ContactInfoType) => {
    if (field === 'name') return; // Prevent removing name
    const newContactInfo = { ...cvData.contactInfo };
    delete newContactInfo[field];
    updateCV({ contactInfo: newContactInfo });
  };

  const addField = (field: keyof ContactInfoType) => {
    if (field === 'name') return; // Prevent adding name
    const newContactInfo = {
      ...cvData.contactInfo,
      [field]: ''
    };
    updateCV({ contactInfo: newContactInfo });
    setShowAddField(false);
    setTimeout(() => setEditingField(field), 100); // Delay to ensure field is rendered
  };

  const changeStyle = (style: ContactStyle) => {
    setSelectedStyle(style);
    setShowStyleSelector(false);
  };

  const renderContactField = (field: ContactField) => {
    const key = field.key as keyof ContactInfoType;
    if (!cvData.contactInfo || !(key in cvData.contactInfo)) return null;
    const Icon = iconMap[field.icon];

    return (
      <div key={field.key} className="relative group flex items-center w-full max-w-[300px]">
        <div className="flex items-center gap-2 w-full">
          <Icon size={16} className="text-gray-600 flex-shrink-0" />
          <div 
            className="flex-1 overflow-visible"
            onClick={() => setEditingField(key)}
          >
            <EditableSection
              content={cvData.contactInfo[key] || ''}
              onChange={(content) => handleContactChange(key, content)}
              className={`text-gray-700 ${editingField === key ? 'ring-1 ring-blue-200 rounded' : ''}`}
              placeholder={`Enter your ${field.label.toLowerCase()}`}
            />
          </div>
          {key !== 'name' && (
            <button
              onClick={() => removeField(key)}
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
            >
              <X size={16} className="text-gray-500 hover:text-red-500" />
            </button>
          )}
        </div>
      </div>
    );
  };

  const getAvailableFields = () => {
    return defaultContactFields.filter(field => {
      if (field.key === 'name') return false;
      return !cvData.contactInfo || !(field.key in cvData.contactInfo);
    });
  };

  return (
    <div className="relative">
      {/* Name and Title Section */}
      <div className="text-center mb-4">
        <EditableSection
          content={cvData.contactInfo.name}
          onChange={(content) => handleContactChange('name', content)}
          className="text-4xl font-playfair font-bold text-gray-800 mb-2"
        />
        <EditableSection
          content={cvData.contactInfo.title}
          onChange={(content) => handleContactChange('title', content)}
          className="text-xl text-gray-600"
        />
      </div>

      {/* Contact Details Section */}
      <div className={selectedStyle.className}>
        {defaultContactFields
          .filter(field => field.key !== 'name' && field.key !== 'title' && (field.key in cvData.contactInfo))
          .map((field: ContactField) => renderContactField(field))}
      </div>

      {/* Controls */}
      <div className="absolute -right-12 top-0 flex flex-col gap-2 print:hidden">
        <button
          onClick={() => setShowAddField(!showAddField)}
          className="p-1 hover:bg-gray-100 rounded bg-white shadow-sm"
          title="Add field"
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
            {contactStyles.map(style => (
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

        {showAddField && (
          <div className="absolute right-8 top-0 bg-white shadow-lg rounded-lg p-2 z-10 min-w-[120px]">
            {getAvailableFields().map(field => (
              <button
                key={field.key}
                onClick={() => addField(field.key)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 w-full rounded whitespace-nowrap"
              >
                {field.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInfo;
