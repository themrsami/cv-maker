'use client';

import { FC, useState } from 'react';
import { useCV } from '../context/CVContext';
import EditableSection from './EditableSection';
import EditableHeading from './EditableHeading';
import { Certificate } from '../types/cv';
import { certificateStyles, CertificateStyle } from '../data/certificateStyles';
import { Layout, Plus, X, Check, Award } from 'lucide-react';

const Certificates: FC = () => {
  const { cvData, updateCV } = useCV();
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<CertificateStyle>(certificateStyles[0]);

  const handleCertificateChange = (index: number, field: keyof Certificate, content: string) => {
    const newCertificates = [...cvData.certificates];
    newCertificates[index] = { ...newCertificates[index], [field]: content };
    updateCV({ certificates: newCertificates });
  };

  const addCertificate = () => {
    const newCertificate: Certificate = {
      name: 'Certificate Name',
      issuer: 'Issuing Organization',
      date: 'Completion Date'
    };
    updateCV({ certificates: [...cvData.certificates, newCertificate] });
  };

  const removeCertificate = (index: number) => {
    const newCertificates = cvData.certificates.filter((_, i) => i !== index);
    updateCV({ certificates: newCertificates });
  };

  const changeStyle = (style: CertificateStyle) => {
    setSelectedStyle(style);
    setShowStyleSelector(false);
  };

  const renderCertificateItem = (cert: Certificate, index: number) => {
    if (selectedStyle.id === 'grid') {
      return (
        <div key={index} className={selectedStyle.itemClassName}>
          <div className="flex-1">
            <EditableSection
              content={cert.name}
              onChange={(content) => handleCertificateChange(index, 'name', content)}
              className="text-lg font-semibold text-gray-800 mb-1"
            />
            <EditableSection
              content={cert.issuer}
              onChange={(content) => handleCertificateChange(index, 'issuer', content)}
              className="text-sm text-gray-600"
            />
            <EditableSection
              content={cert.date}
              onChange={(content) => handleCertificateChange(index, 'date', content)}
              className="text-sm text-gray-500 mt-2"
            />
          </div>
          <button
            onClick={() => removeCertificate(index)}
            className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-8 top-2"
          >
            <X size={16} className="text-gray-500 hover:text-red-500" />
          </button>
        </div>
      );
    }

    if (selectedStyle.id === 'compact') {
      return (
        <div key={index} className={selectedStyle.itemClassName}>
          <Award size={18} className="text-gray-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <EditableSection
              content={cert.name}
              onChange={(content) => handleCertificateChange(index, 'name', content)}
              className="font-medium text-gray-800"
            />
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <EditableSection
                content={cert.issuer}
                onChange={(content) => handleCertificateChange(index, 'issuer', content)}
                className="text-gray-600"
              />
              <span>•</span>
              <EditableSection
                content={cert.date}
                onChange={(content) => handleCertificateChange(index, 'date', content)}
                className="text-gray-500"
              />
            </div>
          </div>
          <button
            onClick={() => removeCertificate(index)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} className="text-gray-500 hover:text-red-500" />
          </button>
        </div>
      );
    }

    return (
      <div key={index} className={selectedStyle.itemClassName}>
        <div className="flex-1">
          <EditableSection
            content={cert.name}
            onChange={(content) => handleCertificateChange(index, 'name', content)}
            className="font-medium text-gray-800"
          />
          <EditableSection
            content={cert.issuer}
            onChange={(content) => handleCertificateChange(index, 'issuer', content)}
            className="text-sm text-gray-600"
          />
        </div>
        <div className="flex items-center gap-4">
          <EditableSection
            content={cert.date}
            onChange={(content) => handleCertificateChange(index, 'date', content)}
            className="text-sm text-gray-500"
          />
          <button
            onClick={() => removeCertificate(index)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} className="text-gray-500 hover:text-red-500" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative border-b pb-2 mb-2">
      {/* Controls - Absolutely positioned and print-hidden */}
      <div className="absolute -right-12 top-0 flex flex-col gap-2 print:hidden">
        <button
          onClick={addCertificate}
          className="p-1 hover:bg-gray-100 rounded bg-white shadow-sm"
          title="Add certificate"
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
            {certificateStyles.map(style => (
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
          content="Certifications"
          onChange={(value) => updateCV({ headings: { ...cvData.headings, certificates: value } })}
        />
        <div className={selectedStyle.className}>
          {cvData.certificates.map((cert, index) => renderCertificateItem(cert, index))}
        </div>
      </div>
    </div>
  );
};

export default Certificates;
