'use client';

import { FC } from 'react';
import EditableText from './EditableText';

interface EditableSectionProps {
  title?: string;
  content: string;
  onChange?: (content: string) => void;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  placeholder?: string;
}

const EditableSection: FC<EditableSectionProps> = ({
  title,
  content,
  onChange,
  className = '',
  titleClassName = '',
  contentClassName = '',
  placeholder = 'Click to edit...',
}) => {
  return (
    <div className={className}>
      {title && (
        <EditableText
          content={title}
          onChange={onChange}
          className={`font-bold text-xl ${titleClassName}`}
        />
      )}
      <EditableText
        content={content}
        onChange={onChange}
        className={contentClassName}
        placeholder={placeholder}
      />
    </div>
  );
};

export default EditableSection;
