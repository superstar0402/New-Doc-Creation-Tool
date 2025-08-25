import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, Type, Palette } from 'lucide-react';
import { FormattedContent } from '../types';

interface RichTextEditorProps {
  value: string;
  formattedContent?: FormattedContent[];
  onChange: (content: string, formattedContent: FormattedContent[]) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  formattedContent,
  onChange,
  placeholder = "Enter content...",
  className = "",
  rows = 6
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current) {
      if (formattedContent && formattedContent.length > 0) {
        // Render formatted content
        renderFormattedContent();
      } else {
        // Set plain text
        editorRef.current.innerHTML = value.replace(/\n/g, '<br>');
      }
    }
  }, [value, formattedContent]);

  const renderFormattedContent = () => {
    if (!editorRef.current || !formattedContent) return;

    let html = '';
    for (const item of formattedContent) {
      const style: string[] = [];
      
      if (item.style?.bold) style.push('font-weight: bold');
      if (item.style?.italic) style.push('font-style: italic');
      if (item.style?.underline) style.push('text-decoration: underline');
      if (item.style?.color) style.push(`color: ${item.style.color}`);
      if (item.style?.fontFamily) style.push(`font-family: ${item.style.fontFamily}`);
      
      // Convert fontSize to CSS
      if (item.style?.fontSize) {
        const fontSizeMap: Record<string, string> = {
          'xs': '0.75rem',
          'sm': '0.875rem',
          'base': '1rem',
          'lg': '1.125rem',
          'xl': '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem'
        };
        style.push(`font-size: ${fontSizeMap[item.style.fontSize] || '1rem'}`);
      }

      const styleAttr = style.length > 0 ? ` style="${style.join('; ')}"` : '';
      const text = item.text.replace(/\n/g, '<br>');
      html += `<span${styleAttr}>${text}</span>`;
    }

    editorRef.current.innerHTML = html;
  };

  const getSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const start = getTextOffset(range.startContainer, range.startOffset);
    const end = getTextOffset(range.endContainer, range.endOffset);
    
    return { start, end };
  };

  const getTextOffset = (node: Node, offset: number): number => {
    let textOffset = 0;
    const walker = document.createTreeWalker(
      editorRef.current!,
      NodeFilter.SHOW_TEXT,
      null
    );

    let currentNode: Node | null;
    while (currentNode = walker.nextNode()) {
      if (currentNode === node) {
        return textOffset + offset;
      }
      textOffset += currentNode.textContent?.length || 0;
    }
    return textOffset;
  };

  const applyFormatting = (format: 'bold' | 'italic' | 'underline' | 'color' | 'fontSize' | 'fontFamily', value?: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    
    // Create a new span element with the formatting
    const span = document.createElement('span');
    span.style.cssText = getFormattingStyle(format, value);
    
    // Extract the selected content
    const selectedContent = range.extractContents();
    span.appendChild(selectedContent);
    
    // Insert the formatted content
    range.insertNode(span);
    
    // Update the selection
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Trigger change
    handleContentChange();
  };

  const getFormattingStyle = (format: string, value?: string): string => {
    switch (format) {
      case 'bold':
        return 'font-weight: bold';
      case 'italic':
        return 'font-style: italic';
      case 'underline':
        return 'text-decoration: underline';
      case 'color':
        return `color: ${value || '#000000'}`;
      case 'fontSize':
        const fontSizeMap: Record<string, string> = {
          'xs': '0.75rem',
          'sm': '0.875rem',
          'base': '1rem',
          'lg': '1.125rem',
          'xl': '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem'
        };
        return `font-size: ${fontSizeMap[value || 'base']}`;
      case 'fontFamily':
        return `font-family: ${value || 'Arial'}`;
      default:
        return '';
    }
  };

  const handleContentChange = () => {
    if (!editorRef.current) return;

    const content = editorRef.current.innerText;
    const formattedContent = extractFormattedContent();
    onChange(content, formattedContent);
  };

  const extractFormattedContent = (): FormattedContent[] => {
    if (!editorRef.current) return [];

    const formattedContent: FormattedContent[] = [];
    const walker = document.createTreeWalker(
      editorRef.current,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      null
    );

    let node: Node | null;
    while (node = walker.nextNode()) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent) {
        const text = node.textContent;
        const parent = node.parentElement;
        
        if (parent && parent.tagName === 'SPAN') {
          const style = parent.style;
          const formatting: any = {};
          
          if (style.fontWeight === 'bold') formatting.bold = true;
          if (style.fontStyle === 'italic') formatting.italic = true;
          if (style.textDecoration === 'underline') formatting.underline = true;
          if (style.color) formatting.color = style.color;
          if (style.fontFamily) formatting.fontFamily = style.fontFamily;
          
          // Convert font size back to our format
          if (style.fontSize) {
            const size = style.fontSize;
            if (size === '0.75rem') formatting.fontSize = 'xs';
            else if (size === '0.875rem') formatting.fontSize = 'sm';
            else if (size === '1rem') formatting.fontSize = 'base';
            else if (size === '1.125rem') formatting.fontSize = 'lg';
            else if (size === '1.25rem') formatting.fontSize = 'xl';
            else if (size === '1.5rem') formatting.fontSize = '2xl';
            else if (size === '1.875rem') formatting.fontSize = '3xl';
            else formatting.fontSize = 'base';
          }
          
          formattedContent.push({
            text,
            style: Object.keys(formatting).length > 0 ? formatting : undefined
          });
        } else {
          formattedContent.push({ text });
        }
      }
    }

    return formattedContent;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.execCommand('insertLineBreak', false);
      handleContentChange();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    handleContentChange();
  };

  const isFormatActive = (format: string): boolean => {
    return document.queryCommandState(format === 'bold' ? 'bold' : 
                                    format === 'italic' ? 'italic' : 
                                    format === 'underline' ? 'underline' : '');
  };

  return (
    <div className={`rich-text-editor ${className}`}>
      {/* Formatting Toolbar */}
      <div className="formatting-toolbar">
        <button
          onClick={() => applyFormatting('bold')}
          className={`${isFormatActive('bold') ? 'active' : ''}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => applyFormatting('italic')}
          className={`${isFormatActive('italic') ? 'active' : ''}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => applyFormatting('underline')}
          className={`${isFormatActive('underline') ? 'active' : ''}`}
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>
        
        <div className="toolbar-divider"></div>
        
        <select
          onChange={(e) => applyFormatting('fontSize', e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          title="Font Size"
        >
          <option value="xs">XS</option>
          <option value="sm">SM</option>
          <option value="base">Base</option>
          <option value="lg">LG</option>
          <option value="xl">XL</option>
          <option value="2xl">2XL</option>
          <option value="3xl">3XL</option>
        </select>
        
        <select
          onChange={(e) => applyFormatting('fontFamily', e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          title="Font Family"
        >
          <option value="Arial">Arial</option>
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
        </select>
        
        <div className="color-picker">
          {['#000000', '#ffffff', '#dc2626', '#6b7280'].map((color) => (
            <button
              key={color}
              onClick={() => applyFormatting('color', color)}
              className={`${
                color === '#000000' ? 'bg-black' :
                color === '#ffffff' ? 'bg-white' :
                color === '#dc2626' ? 'bg-red-600' :
                'bg-gray-500'
              }`}
              title={`Color: ${color}`}
            />
          ))}
        </div>
      </div>
      
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className={`${isFocused ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        style={{
          minHeight: `${rows * 1.5}rem`
        }}
      />
    </div>
  );
}; 