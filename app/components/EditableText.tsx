'use client';

import { FC, useEffect } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import Underline from '@tiptap/extension-underline';
import Typography from '@tiptap/extension-typography';
import TextStyle from '@tiptap/extension-text-style';
import { Extension } from '@tiptap/core';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import { AlignLeftIcon, AlignCenterIcon, AlignRightIcon } from 'lucide-react';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      /**
       * Set the font size
       */
      setFontSize: (size: string) => ReturnType;
      /**
       * Unset the font size
       */
      unsetFontSize: () => ReturnType;
    };
  }
}

interface EditableTextProps {
  content: string;
  onChange?: (content: string) => void;
  className?: string;
  placeholder?: string;
}

type FontFamilyType = 
  | 'inter' 
  | 'roboto' 
  | 'poppins' 
  | 'montserrat' 
  | 'opensans'
  | 'playfair'
  | 'lato'
  | 'source'
  | 'ubuntu'
  | 'merriweather';
type TextAlignment = 'left' | 'center' | 'right';

const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize?.replace('px', ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}px`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ commands }) => {
          return commands.setMark('textStyle', { fontSize });
        },
      unsetFontSize:
        () =>
        ({ commands }) => {
          return commands.setMark('textStyle', { fontSize: null });
        },
    };
  },
});

const fontSizes = [
  { label: 'Extra Small', value: '12' },
  { label: 'Small', value: '14' },
  { label: 'Base', value: '16' },
  { label: 'Large', value: '18' },
  { label: 'Extra Large', value: '20' },
  { label: '2XL', value: '24' },
  { label: '3XL', value: '30' },
  { label: '4XL', value: '36' },
];

const fontFamilies: Array<{ label: string; value: FontFamilyType }> = [
  { label: 'Inter', value: 'inter' },
  { label: 'Roboto', value: 'roboto' },
  { label: 'Poppins', value: 'poppins' },
  { label: 'Montserrat', value: 'montserrat' },
  { label: 'Open Sans', value: 'opensans' },
  { label: 'Playfair Display', value: 'playfair' },
  { label: 'Lato', value: 'lato' },
  { label: 'Source Sans Pro', value: 'source' },
  { label: 'Ubuntu', value: 'ubuntu' },
  { label: 'Merriweather', value: 'merriweather' },
];

const alignments: Array<{ label: string; value: TextAlignment; icon: typeof AlignLeftIcon }> = [
  { label: 'Left', value: 'left', icon: AlignLeftIcon },
  { label: 'Center', value: 'center', icon: AlignCenterIcon },
  { label: 'Right', value: 'right', icon: AlignRightIcon },
];

const fontFamilyClasses: Record<FontFamilyType, string> = {
  inter: 'font-inter',
  roboto: 'font-roboto',
  poppins: 'font-poppins',
  montserrat: 'font-montserrat',
  opensans: 'font-opensans',
  playfair: 'font-playfair',
  lato: 'font-lato',
  source: 'font-source',
  ubuntu: 'font-ubuntu',
  merriweather: 'font-merriweather',
};

const EditableText: FC<EditableTextProps> = ({ 
  content, 
  onChange, 
  className = '',
  placeholder = 'Click to edit...'
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      BubbleMenuExtension,
      Underline,
      Typography,
      TextStyle,
      FontSize,
      FontFamily,
      TextAlign.configure({
        types: ['paragraph'],
      }),
    ],
    content: content || placeholder,
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || placeholder);
    }
  }, [content, editor, placeholder]);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative group">
      <EditorContent 
        editor={editor} 
        className={`hover:bg-gray-50/50 rounded px-1.5 py-0.5 -mx-1.5 -my-0.5 transition-colors cursor-text ${
          !content ? 'text-gray-400' : ''
        } ${className}`}
      />
      {editor.isEditable && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{
            duration: 100,
            placement: 'top',
            interactive: true,
            maxWidth: '100vw',
            zIndex: 50,
            appendTo: () => document.body,
          }}
          className="flex sm:flex-nowrap flex-wrap items-center gap-1 p-2 bg-white rounded-lg shadow-lg border border-gray-200 max-w-full z-50"
        >
          <div className="flex items-center gap-1 px-2 border-r border-gray-200">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1 rounded hover:bg-gray-100 ${
                editor.isActive('bold') ? 'bg-gray-100' : ''
              }`}
            >
              <span className="font-bold">B</span>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1 rounded hover:bg-gray-100 ${
                editor.isActive('italic') ? 'bg-gray-100' : ''
              }`}
            >
              <span className="italic">I</span>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-1 rounded hover:bg-gray-100 ${
                editor.isActive('underline') ? 'bg-gray-100' : ''
              }`}
            >
              <span className="underline">U</span>
            </button>
          </div>

          <div className="flex items-center gap-1 px-2 border-r border-gray-200">
            {alignments.map(({ label, value, icon: Icon }) => (
              <button
                key={value}
                onClick={() => editor.chain().focus().setTextAlign(value).run()}
                className={`p-1 rounded hover:bg-gray-100 ${
                  editor.isActive({ textAlign: value }) ? 'bg-gray-100' : ''
                }`}
                title={label}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>

          <div className="flex sm:flex-nowrap flex-wrap items-center gap-1 px-2">
            <select
              onChange={(e) => {
                const size = e.target.value;
                if (size) editor.commands.setFontSize(size);
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-24 px-2 py-1 text-sm rounded border border-gray-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">Size</option>
              {fontSizes.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <select
              onChange={(e) => {
                const family = e.target.value as FontFamilyType;
                if (family) editor.chain().focus().setFontFamily(family).run();
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-32 px-2 py-1 text-sm rounded border border-gray-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">Font</option>
              {fontFamilies.map(({ label, value }) => (
                <option key={value} value={value} className={fontFamilyClasses[value]}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </BubbleMenu>
      )}
    </div>
  );
};

export default EditableText;
