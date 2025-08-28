import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, Upload, Trash2, List } from 'lucide-react';
import { FormattedContent } from '../types';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

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
  const [currentFormatting, setCurrentFormatting] = useState({
    fontFamily: 'Arial',
    fontSize: 'base',
    color: '#000000'
  });

  // Save caret position as character offset
  const saveCaretPosition = (element: HTMLElement): number | null => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.startContainer, range.startOffset);

    return preCaretRange.toString().length;
  };

  // Restore caret position from character offset
  const restoreCaretPosition = (element: HTMLElement, offset: number) => {
    const range = document.createRange();
    range.setStart(element, 0);
    range.collapse(true);

    let charIndex = 0;
    const nodeStack: Node[] = [element];
    let node: Node | undefined;
    let found = false;

    while (!found && (node = nodeStack.pop())) {
      if (node.nodeType === Node.TEXT_NODE) {
        const textLength = node.textContent?.length || 0;
        if (charIndex + textLength >= offset) {
          range.setStart(node, offset - charIndex);
          range.collapse(true);
          found = true;
        }
        charIndex += textLength;
      } else {
        for (let i = node.childNodes.length - 1; i >= 0; i--) {
          nodeStack.push(node.childNodes[i]);
        }
      }
    }

    if (found) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  // Initialize editor content with caret preservation
  useEffect(() => {
    if (!editorRef.current) return;

    // Save caret position before updating content
    const caretPosition = saveCaretPosition(editorRef.current);

    if (!value || value.trim() === '') {
      editorRef.current.innerHTML = '';
      editorRef.current.textContent = '';
      return;
    }

    if (formattedContent && formattedContent.length > 0) {
      renderFormattedContent();

      // Update current formatting from first formatted item
      if (formattedContent[0] && formattedContent[0].style) {
        const style = formattedContent[0].style;
        setCurrentFormatting({
          fontFamily: style.fontFamily || 'Arial',
          fontSize: style.fontSize || 'base',
          color: style.color || '#000000'
        });
      }
    } else {
      editorRef.current.innerHTML = value.replace(/\n/g, '<br>');
    }

    // Restore caret position after DOM update
    if (typeof caretPosition === 'number') {
      restoreCaretPosition(editorRef.current, caretPosition);
    }
  }, [value, formattedContent]);

  // Update editor style when current formatting changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.fontFamily = currentFormatting.fontFamily;
      editorRef.current.style.fontSize = getFormattingStyle('fontSize', currentFormatting.fontSize).replace('font-size: ', '');
      editorRef.current.style.color = currentFormatting.color;
    }
  }, [currentFormatting]);

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

      // Ensure text alignment is set
      style.push('text-align: left');

      const styleAttr = style.length > 0 ? ` style="${style.join('; ')}"` : '';
      const text = item.text.replace(/\n/g, '<br>');
      html += `<span${styleAttr}>${text}</span>`;
    }

    editorRef.current.innerHTML = html;
  };

  // Function to create bulleted list
  const createBulletedList = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (selectedText) {
      // If text is selected, convert each line to a bulleted list item
      const lines = selectedText.split('\n');
      const bulletedLines = lines.map(line => line.trim() ? `• ${line.trim()}` : line).join('\n');
      
      // Replace the selected text with bulleted list
      range.deleteContents();
      const textNode = document.createTextNode(bulletedLines);
      range.insertNode(textNode);
    } else {
      // If no text is selected, insert a bullet at the current position
      const bulletText = document.createTextNode('• ');
      range.insertNode(bulletText);
      range.setStartAfter(bulletText);
      range.collapse(true);
    }
    
    // Update selection
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Trigger change
    handleContentChange();
  };

  // Function to create numbered list
  const createNumberedList = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (selectedText) {
      // If text is selected, convert each line to a numbered list item
      const lines = selectedText.split('\n').filter(line => line.trim());
      const numberedLines = lines.map((line, index) => `${index + 1}. ${line.trim()}`).join('\n');
      
      // Replace the selected text with numbered list
      range.deleteContents();
      const textNode = document.createTextNode(numberedLines);
      range.insertNode(textNode);
    } else {
      // If no text is selected, insert a number at the current position
      const numberText = document.createTextNode('1. ');
      range.insertNode(numberText);
      range.setStartAfter(numberText);
      range.collapse(true);
    }
    
    // Update selection
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Trigger change
    handleContentChange();
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
    
    // Update current formatting state
    if (format === 'fontFamily' && value) {
      setCurrentFormatting(prev => ({ ...prev, fontFamily: value }));
    } else if (format === 'fontSize' && value) {
      setCurrentFormatting(prev => ({ ...prev, fontSize: value }));
    } else if (format === 'color' && value) {
      setCurrentFormatting(prev => ({ ...prev, color: value }));
    }
    
    // Trigger change
    handleContentChange();
  };

  // Function to handle formatting toolbar changes
  const handleFormattingChange = (format: 'fontFamily' | 'fontSize' | 'color', value: string) => {
    // Update current formatting state
    setCurrentFormatting(prev => ({ ...prev, [format]: value }));
    
    // Apply formatting to selected text if any
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      applyFormatting(format, value);
    }
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

  // Function to update current formatting based on cursor position
  const updateCurrentFormattingFromCursor = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const currentNode = range.startContainer;
    const parentElement = currentNode.parentElement;
    
    if (parentElement && parentElement.tagName === 'SPAN') {
      const style = parentElement.style;
      
      // Update font family
      if (style.fontFamily) {
        const fontFamily = style.fontFamily.replace(/['"]/g, '').split(',')[0].trim();
        setCurrentFormatting(prev => ({ ...prev, fontFamily }));
      }
      
      // Update font size
      if (style.fontSize) {
        const fontSize = style.fontSize;
        let fontSizeKey = 'base';
        if (fontSize === '0.75rem') fontSizeKey = 'xs';
        else if (fontSize === '0.875rem') fontSizeKey = 'sm';
        else if (fontSize === '1rem') fontSizeKey = 'base';
        else if (fontSize === '1.125rem') fontSizeKey = 'lg';
        else if (fontSize === '1.25rem') fontSizeKey = 'xl';
        else if (fontSize === '1.5rem') fontSizeKey = '2xl';
        else if (fontSize === '1.875rem') fontSizeKey = '3xl';
        
        setCurrentFormatting(prev => ({ ...prev, fontSize: fontSizeKey }));
      }
      
      // Update color
      if (style.color) {
        setCurrentFormatting(prev => ({ ...prev, color: style.color }));
      }
    }
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
        
        {/* List Buttons */}
        <button
          onClick={createBulletedList}
          className=""
          title="Bulleted List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={createNumberedList}
          className=""
          title="Numbered List"
        >
          <span className="text-sm font-bold">N</span>
        </button>
        
        <div className="toolbar-divider"></div>
        
        <select
          value={currentFormatting.fontSize}
          onChange={(e) => handleFormattingChange('fontSize', e.target.value)}
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
          value={currentFormatting.fontFamily}
          onChange={(e) => handleFormattingChange('fontFamily', e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          title="Font Family"
        >
          <option value="Arial">Arial</option>
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
        </select>
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
        onMouseUp={updateCurrentFormattingFromCursor}
        onKeyUp={updateCurrentFormattingFromCursor}
        data-placeholder={placeholder}
        style={{
          minHeight: `${rows * 1.5}rem`,
          direction: 'ltr',
          textAlign: 'left',
          fontFamily: currentFormatting.fontFamily,
          fontSize: getFormattingStyle('fontSize', currentFormatting.fontSize).replace('font-size: ', ''),
          color: currentFormatting.color
        }}
      />
    </div>
  );
}; 





