'use client';

import { createContext, useContext, useState, FC, ReactNode } from 'react';
import { CVData } from '../types/cv';
import { sampleData } from '../data/sampleData';

interface CVContextType {
  cvData: CVData;
  updateCV: (newData: Partial<CVData>) => void;
  updateField: (path: string[], value: string) => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

type ObjectWithStringValues = {
  [key: string]: string | ObjectWithStringValues | unknown;
};

export const CVProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [cvData, setCVData] = useState<CVData>(sampleData);

  const updateCV = (newData: Partial<CVData>) => {
    setCVData((prev) => ({ ...prev, ...newData }));
  };

  const updateField = (path: string[], value: string) => {
    setCVData((prev) => {
      const newData = { ...prev };
      let current: ObjectWithStringValues = newData;
      
      // Navigate to the parent object
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (!(key in current) || typeof current[key] !== 'object') {
          return prev;
        }
        current = current[key] as ObjectWithStringValues;
      }
      
      // Get the last key
      const lastKey = path[path.length - 1];
      if (!(lastKey in current)) {
        return prev;
      }
      
      // Only update if the target is a string
      const target = current[lastKey];
      if (typeof target === 'string') {
        current[lastKey] = value;
        return newData;
      }
      
      return prev;
    });
  };

  return (
    <CVContext.Provider value={{ cvData, updateCV, updateField }}>
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};
