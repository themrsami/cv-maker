'use client';

import { FC } from 'react';
import EditableText from './EditableText';

interface EditableHeadingProps {
  content: string;
  onChange: (value: string) => void;
  className?: string;
}

const EditableHeading: FC<EditableHeadingProps> = ({
  content,
  onChange,
  className = '',
}) => {
  return (
    <EditableText
      content={content}
      onChange={onChange}
      className={`text-2xl font-bold text-gray-800 mb-4 font-playfair ${className}`}
    />
  );
};

export default EditableHeading;
