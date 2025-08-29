import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Bold, Italic, Underline, Upload, Trash2, List, Undo2, Redo2 } from 'lucide-react';
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

// List item types
interface ListItem {
  type: 'bullet' | 'number';
  level: number;
  text: string;
  number?: number;
}

// Undo/Redo history item
interface HistoryItem {
  content: string;
  formattedContent: FormattedContent[];
  selection: { start: number; end: number; direction: 'forward' | 'backward' | 'none' } | null;
  timestamp: number;
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
  const [currentListState, setCurrentListState] = useState<{ isList: boolean; type?: 'bullet' | 'number'; level: number }>({
    isList: false,
    level: 0
  });

  // Undo/Redo functionality
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isUndoRedo, setIsUndoRedo] = useState(false);

  // Word-style selection state
  const [selectionState, setSelectionState] = useState<{
    start: number;
    end: number;
    direction: 'forward' | 'backward' | 'none';
  } | null>(null);

  // Debounce for content changes
  const [changeTimeout, setChangeTimeout] = useState<NodeJS.Timeout | null>(null);

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

  // Save selection range
  const saveSelection = (element: HTMLElement): { start: number; end: number; direction: 'forward' | 'backward' | 'none' } | null => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    
    const start = preCaretRange.toString().length;
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    const end = preCaretRange.toString().length;
    
    return {
      start: Math.min(start, end),
      end: Math.max(start, end),
      direction: selection.anchorNode === range.startContainer ? 'forward' : 'backward'
    };
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

  // Restore selection range
  const restoreSelection = (element: HTMLElement, selection: { start: number; end: number; direction: 'forward' | 'backward' | 'none' }) => {
    const range = document.createRange();
    const sel = window.getSelection();
    
    // Find start position
    let startNode: Node | null = null;
    let startOffset = 0;
    let endNode: Node | null = null;
    let endOffset = 0;
    
    let charIndex = 0;
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let node: Node | null;
    while (node = walker.nextNode()) {
      const textLength = node.textContent?.length || 0;
      
      if (!startNode && charIndex + textLength >= selection.start) {
        startNode = node;
        startOffset = selection.start - charIndex;
      }
      
      if (!endNode && charIndex + textLength >= selection.end) {
        endNode = node;
        endOffset = selection.end - charIndex;
        break;
      }
      
      charIndex += textLength;
    }
    
    if (startNode && endNode) {
      range.setStart(startNode, startOffset);
      range.setEnd(endNode, endOffset);
      
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  // Add to history
  const addToHistory = useCallback((content: string, formattedContent: FormattedContent[], selection: { start: number; end: number; direction: 'forward' | 'backward' | 'none' } | null = null) => {
    if (isUndoRedo) return;

    const newItem: HistoryItem = {
      content,
      formattedContent,
      selection,
      timestamp: Date.now()
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newItem);
      // Keep only last 50 items
      return newHistory.slice(-50);
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex, isUndoRedo]);

  // Undo functionality
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setIsUndoRedo(true);
      const prevItem = history[historyIndex - 1];
      setHistoryIndex(prev => prev - 1);
      
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
        if (prevItem.formattedContent && prevItem.formattedContent.length > 0) {
          renderFormattedContent();
        } else {
          editorRef.current.textContent = prevItem.content;
        }
        
        // Restore selection if available
        if (prevItem.selection) {
          restoreSelection(editorRef.current, { ...prevItem.selection, direction: 'none' });
        }
      }
      
      onChange(prevItem.content, prevItem.formattedContent || []);
      setIsUndoRedo(false);
    }
  }, [history, historyIndex, onChange]);

  // Redo functionality
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setIsUndoRedo(true);
      const nextItem = history[historyIndex + 1];
      setHistoryIndex(prev => prev + 1);
      
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
        if (nextItem.formattedContent && nextItem.formattedContent.length > 0) {
          renderFormattedContent();
        } else {
          editorRef.current.textContent = nextItem.content;
        }
        
        // Restore selection if available
        if (nextItem.selection) {
          restoreSelection(editorRef.current, { ...nextItem.selection, direction: 'none' });
        }
      }
      
      onChange(nextItem.content, nextItem.formattedContent || []);
      setIsUndoRedo(false);
    }
  }, [history, historyIndex, onChange]);

  // Word-style keyboard shortcuts
  const handleWordShortcuts = useCallback((e: React.KeyboardEvent) => {
    const isCtrl = e.ctrlKey || e.metaKey;
    
    if (isCtrl) {
      switch (e.key.toLowerCase()) {
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          return true;
        case 'y':
          e.preventDefault();
          redo();
          return true;
        case 'a':
          e.preventDefault();
          document.execCommand('selectAll', false);
          return true;
        case 'c':
          // Let default copy behavior work
          return false;
        case 'v':
          // Let default paste behavior work, we'll handle it in onPaste
          return false;
        case 'x':
          // Let default cut behavior work
          return false;
        case 'b':
          e.preventDefault();
          applyFormatting('bold');
          return true;
        case 'i':
          e.preventDefault();
          applyFormatting('italic');
          return true;
        case 'u':
          e.preventDefault();
          applyFormatting('underline');
          return true;
      }
    }
    
    return false;
  }, [undo, redo]);

  // Word-style paste handling
  const handleWordPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    
    const text = e.clipboardData.getData('text/plain');
    const html = e.clipboardData.getData('text/html');
    
    if (html) {
      // Try to preserve some formatting from Word
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Clean up Word-specific markup
      const cleanHtml = tempDiv.innerHTML
        .replace(/<o:p>/g, '')
        .replace(/<\/o:p>/g, '')
        .replace(/<span[^>]*>/g, '')
        .replace(/<\/span>/g, '')
        .replace(/<p[^>]*>/g, '')
        .replace(/<\/p>/g, '\n')
        .replace(/<br[^>]*>/g, '\n')
        .replace(/&nbsp;/g, ' ');
      
      document.execCommand('insertHTML', false, cleanHtml);
    } else if (text) {
      document.execCommand('insertText', false, text);
    }
    
    handleContentChange();
  };

  // Word-style double-click word selection
  const handleDoubleClick = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    const target = e.target as Node;
    
    if (target.nodeType === Node.TEXT_NODE) {
      const text = target.textContent || '';
      const clickOffset = getClickOffset(target as Text, e);
      
      // Find word boundaries
      const wordStart = findWordStart(text, clickOffset);
      const wordEnd = findWordEnd(text, clickOffset);
      
      range.setStart(target, wordStart);
      range.setEnd(target, wordEnd);
      
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  // Get click offset in text node
  const getClickOffset = (textNode: Text, e: React.MouseEvent): number => {
    const rect = textNode.parentElement?.getBoundingClientRect();
    if (!rect) return 0;
    
    const x = e.clientX - rect.left;
    const text = textNode.textContent || '';
    
    // Simple approximation - in a real implementation you'd use more sophisticated text measurement
    const charWidth = rect.width / text.length;
    return Math.min(Math.floor(x / charWidth), text.length);
  };

  // Find start of word
  const findWordStart = (text: string, position: number): number => {
    const wordBoundary = /[\s\.,!?;:()[\]{}"'`~@#$%^&*+=|\\/<>]/;
    
    for (let i = position - 1; i >= 0; i--) {
      if (wordBoundary.test(text[i])) {
        return i + 1;
      }
    }
    return 0;
  };

  // Find end of word
  const findWordEnd = (text: string, position: number): number => {
    const wordBoundary = /[\s\.,!?;:()[\]{}"'`~@#$%^&*+=|\\/<>]/;
    
    for (let i = position; i < text.length; i++) {
      if (wordBoundary.test(text[i])) {
        return i;
      }
    }
    return text.length;
  };

  // Word-style triple-click paragraph selection
  const handleTripleClick = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    if (!selection) return;

    const target = e.target as Node;
    const range = document.createRange();
    
    // Find the paragraph element
    let paragraphElement = target;
    while (paragraphElement && paragraphElement.nodeType === Node.TEXT_NODE) {
      paragraphElement = paragraphElement.parentNode as Element;
    }
    
    if (paragraphElement && paragraphElement.nodeType === Node.ELEMENT_NODE) {
      range.selectNodeContents(paragraphElement);
      selection.removeAllRanges();
      selection.addRange(range);
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

  // Get current line content and position
  const getCurrentLineInfo = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const container = range.startContainer;
    
    // Find the current line
    let currentNode = container;
    while (currentNode && currentNode.nodeType !== Node.ELEMENT_NODE) {
      currentNode = currentNode.parentNode as Element;
    }
    
    if (!currentNode) return null;
    
    // Get the line content
    const lineText = currentNode.textContent || '';
    const cursorPosition = range.startOffset;
    
    return {
      node: currentNode,
      text: lineText,
      cursorPosition,
      range
    };
  };

  // Check if current line is already a list item
  const isCurrentLineListItem = (): { isList: boolean; type?: 'bullet' | 'number'; level: number } => {
    const lineInfo = getCurrentLineInfo();
    if (!lineInfo) return { isList: false, level: 0 };

    const text = lineInfo.text;
    
    // Check for bullet patterns (including various bullet characters)
    const bulletPattern = /^(\s*)([•·▪▫‣⁃◦‣⁌⁍]|\*|\-)\s/;
    const bulletMatch = text.match(bulletPattern);
    if (bulletMatch) {
      const level = Math.floor(bulletMatch[1].length / 2); // Assuming 2 spaces per level
      return { isList: true, type: 'bullet', level };
    }
    
    // Check for numbered list patterns
    const numberPattern = /^(\s*)(\d+)\.\s/;
    const numberMatch = text.match(numberPattern);
    if (numberMatch) {
      const level = Math.floor(numberMatch[1].length / 2);
      return { isList: true, type: 'number', level };
    }
    
    return { isList: false, level: 0 };
  };

  // Convert selected text to list
  const convertSelectionToList = (type: 'bullet' | 'number') => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (selectedText) {
      // Split by lines and convert each line to a list item
      const lines = selectedText.split('\n');
      const listItems = lines.map((line, index) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return line;
        
        if (type === 'bullet') {
          return `• ${trimmedLine}`;
        } else {
          return `${index + 1}. ${trimmedLine}`;
        }
      }).join('\n');
      
      // Replace the selected text with list items
      range.deleteContents();
      const textNode = document.createTextNode(listItems);
      range.insertNode(textNode);
      
      // Update selection
      selection.removeAllRanges();
      selection.addRange(range);
      
      handleContentChange();
    }
  };

  // Create or continue bulleted list
  const createBulletedList = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (selectedText) {
      // Convert selected text to bullet list
      convertSelectionToList('bullet');
      return;
    }

    const lineInfo = getCurrentLineInfo();
    if (!lineInfo) return;

    const { node, text, cursorPosition, range: lineRange } = lineInfo;
    const listInfo = isCurrentLineListItem();
    
    if (listInfo.isList && listInfo.type === 'bullet') {
      // Already a bullet list, increase level or continue
      if (listInfo.level < 5) { // Max 5 levels
        const newLevel = listInfo.level + 1;
        const indent = '  '.repeat(newLevel);
        const newText = text.replace(/^(\s*)([•·▪▫‣⁃◦‣⁌⁍]|\*|\-)\s/, `${indent}• `);
        
        if (node.textContent) {
          node.textContent = newText;
          lineRange.setStart(node, cursorPosition + 2); // +2 for the new indent
          lineRange.collapse(true);
        }
      }
    } else {
      // Create new bullet list
      const bulletText = '• ';
      const newText = text.substring(0, cursorPosition) + bulletText + text.substring(cursorPosition);
      
      if (node.textContent) {
        node.textContent = newText;
        lineRange.setStart(node, cursorPosition + bulletText.length);
        lineRange.collapse(true);
      }
    }
    
    // Update selection
    selection.removeAllRanges();
    selection.addRange(lineRange);
    
    // Trigger change
    handleContentChange();
  };

  // Create or continue numbered list
  const createNumberedList = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (selectedText) {
      // Convert selected text to numbered list
      convertSelectionToList('number');
      return;
    }

    const lineInfo = getCurrentLineInfo();
    if (!lineInfo) return;

    const { node, text, cursorPosition, range: lineRange } = lineInfo;
    const listInfo = isCurrentLineListItem();
    
    if (listInfo.isList && listInfo.type === 'number') {
      // Already a numbered list, increase level or continue
      if (listInfo.level < 5) { // Max 5 levels
        const newLevel = listInfo.level + 1;
        const indent = '  '.repeat(newLevel);
        const newText = text.replace(/^(\s*)(\d+)\.\s/, `${indent}1. `);
        
        if (node.textContent) {
          node.textContent = newText;
          lineRange.setStart(node, cursorPosition + 2); // +2 for the new indent
          lineRange.collapse(true);
        }
      }
    } else {
      // Create new numbered list
      const numberText = '1. ';
      const newText = text.substring(0, cursorPosition) + numberText + text.substring(cursorPosition);
      
      if (node.textContent) {
        node.textContent = newText;
        lineRange.setStart(node, cursorPosition + numberText.length);
        lineRange.collapse(true);
      }
    }
    
    // Update selection
    selection.removeAllRanges();
    selection.addRange(lineRange);
    
    // Trigger change
    handleContentChange();
  };

  // Handle Enter key for list continuation
  const handleListEnter = (e: React.KeyboardEvent) => {
    const lineInfo = getCurrentLineInfo();
    if (!lineInfo) return false;

    const { text } = lineInfo;
    const listInfo = isCurrentLineListItem();
    
    if (listInfo.isList) {
      e.preventDefault();
      
      // Check if the current line is empty (just the bullet/number)
      const listPattern = listInfo.type === 'bullet' 
        ? /^(\s*)([•·▪▫‣⁃◦‣⁌⁍]|\*|\-)\s*$/
        : /^(\s*)(\d+)\.\s*$/;
      
      const isEmptyListItem = listPattern.test(text);
      
      if (isEmptyListItem) {
        // Remove the list formatting and create a new line
        const newText = text.replace(listPattern, '');
        const node = lineInfo.node;
        if (node.textContent) {
          node.textContent = newText;
          
          // Insert a new line
          document.execCommand('insertHTML', false, '<br>');
          
          // Set cursor to the new line
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const container = range.startContainer;
            const parent = container.parentNode;
            
            if (parent && parent.textContent) {
              const newPosition = parent.textContent.length;
              range.setStart(parent, newPosition);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }
        }
      } else {
        // Continue the list
        if (listInfo.type === 'bullet') {
          // Continue bullet list
          const indent = '  '.repeat(listInfo.level);
          const newLineText = `${indent}• `;
          
          // Insert new line
          document.execCommand('insertHTML', false, `<br>${newLineText}`);
          
          // Move cursor to end of new line
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const container = range.startContainer;
            const parent = container.parentNode;
            
            if (parent && parent.textContent) {
              const newPosition = parent.textContent.length;
              range.setStart(parent, newPosition);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }
        } else if (listInfo.type === 'number') {
          // Continue numbered list
          const indent = '  '.repeat(listInfo.level);
          
          // Find the next number in sequence
          const currentNumberMatch = text.match(/^(\s*)(\d+)\.\s/);
          if (currentNumberMatch) {
            const currentNumber = parseInt(currentNumberMatch[2]);
            const newNumber = currentNumber + 1;
            const newLineText = `${indent}${newNumber}. `;
            
            // Insert new line
            document.execCommand('insertHTML', false, `<br>${newLineText}`);
            
            // Move cursor to end of new line
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              const container = range.startContainer;
              const parent = container.parentNode;
              
              if (parent && parent.textContent) {
                const newPosition = parent.textContent.length;
                range.setStart(parent, newPosition);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
              }
            }
          }
        }
      }
      
      handleContentChange();
      return true;
    }
    
    return false;
  };

  // Handle Backspace key for list management
  const handleListBackspace = (e: React.KeyboardEvent) => {
    const lineInfo = getCurrentLineInfo();
    if (!lineInfo) return false;

    const { text, cursorPosition } = lineInfo;
    const listInfo = isCurrentLineListItem();
    
    if (listInfo.isList && cursorPosition <= 2) {
      // If cursor is at the beginning of a list item, remove the list formatting
      e.preventDefault();
      
      if (listInfo.type === 'bullet') {
        const newText = text.replace(/^(\s*)([•·▪▫‣⁃◦‣⁌⁍]|\*|\-)\s/, '');
        const node = lineInfo.node;
        if (node.textContent) {
          node.textContent = newText;
          
          // Set cursor to beginning
          const range = document.createRange();
          range.setStart(node, 0);
          range.collapse(true);
          
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      } else if (listInfo.type === 'number') {
        const newText = text.replace(/^(\s*)(\d+)\.\s/, '');
        const node = lineInfo.node;
        if (node.textContent) {
          node.textContent = newText;
          
          // Set cursor to beginning
          const range = document.createRange();
          range.setStart(node, 0);
          range.collapse(true);
          
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }
      
      handleContentChange();
      return true;
    }
    
    return false;
  };

  // Handle Tab key for list indentation
  const handleListTab = (e: React.KeyboardEvent) => {
    const listInfo = isCurrentLineListItem();
    
    if (listInfo.isList) {
      e.preventDefault();
      
      if (e.shiftKey) {
        // Shift+Tab: decrease indent
        if (listInfo.level > 0) {
          const lineInfo = getCurrentLineInfo();
          if (lineInfo) {
            const { node, text } = lineInfo;
            const newLevel = listInfo.level - 1;
            const indent = '  '.repeat(newLevel);
            
            if (listInfo.type === 'bullet') {
              const newText = text.replace(/^(\s*)([•·▪▫‣⁃◦‣⁌⁍]|\*|\-)\s/, `${indent}• `);
              if (node.textContent) {
                node.textContent = newText;
              }
            } else if (listInfo.type === 'number') {
              const newText = text.replace(/^(\s*)(\d+)\.\s/, `${indent}1. `);
              if (node.textContent) {
                node.textContent = newText;
              }
            }
            
            handleContentChange();
          }
        }
      } else {
        // Tab: increase indent
        if (listInfo.level < 5) {
          const lineInfo = getCurrentLineInfo();
          if (lineInfo) {
            const { node, text } = lineInfo;
            const newLevel = listInfo.level + 1;
            const indent = '  '.repeat(newLevel);
            
            if (listInfo.type === 'bullet') {
              const newText = text.replace(/^(\s*)([•·▪▫‣⁃◦‣⁌⁍]|\*|\-)\s/, `${indent}• `);
              if (node.textContent) {
                node.textContent = newText;
              }
            } else if (listInfo.type === 'number') {
              const newText = text.replace(/^(\s*)(\d+)\.\s/, `${indent}1. `);
              if (node.textContent) {
                node.textContent = newText;
              }
            }
            
            handleContentChange();
          }
        }
      }
      
      return true;
    }
    
    return false;
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

    // Use innerHTML to preserve <br> tags, then convert to text
    const htmlContent = editorRef.current.innerHTML;
    const content = editorRef.current.innerText;
    const formattedContent = extractFormattedContent();
    
    // Save current selection for history
    const currentSelection = saveSelection(editorRef.current);
    
    // Add to history (debounced)
    if (changeTimeout) {
      clearTimeout(changeTimeout);
    }
    
    const timeout = setTimeout(() => {
      addToHistory(content, formattedContent, currentSelection);
    }, 300);
    
    setChangeTimeout(timeout);
    
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
      } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'BR') {
        // Handle <br> elements by adding a newline character
        formattedContent.push({ text: '\n' });
      }
    }

    return formattedContent;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Word-style shortcuts first
    if (handleWordShortcuts(e)) {
      return;
    }

    // Handle Enter key
    if (e.key === 'Enter') {
      e.preventDefault();

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);

      // Insert <br> element for a new line
      const br = document.createElement('br');
      range.deleteContents();
      range.insertNode(br);

      // Set caret position after <br>
      range.setStartAfter(br);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);

      // Trigger update
      handleContentChange();
    } else if (e.key === 'Backspace') {
      if (handleListBackspace(e)) {
        return; // List handling took care of it
      }
    } else if (e.key === 'Tab') {
      if (handleListTab(e)) {
        return; // List handling took care of it
      }
    }

    // Word-style text selection behavior
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      // Handle word-by-word navigation with Ctrl
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.key === 'ArrowLeft') {
          document.execCommand('moveWordLeft', false);
        } else {
          document.execCommand('moveWordRight', false);
        }
        return;
      }
    }

    // Word-style line navigation
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.key === 'ArrowUp') {
          document.execCommand('moveToBeginningOfDocument', false);
        } else {
          document.execCommand('moveToEndOfDocument', false);
        }
        return;
      }
    }

    // Word-style selection with Shift
    if (e.shiftKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      // Let default selection behavior work
      return;
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    handleWordPaste(e);
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
    
    // Update list state
    const listState = isCurrentLineListItem();
    setCurrentListState(listState);
  };

  return (
    <div className={`rich-text-editor ${className}`}>
      {/* Formatting Toolbar */}
      <div className="formatting-toolbar">
        {/* Undo/Redo Buttons */}
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          className={`${historyIndex <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className={`${historyIndex >= history.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>
        
        <div className="toolbar-divider"></div>
        
        <button
          onClick={() => applyFormatting('bold')}
          className={`${isFormatActive('bold') ? 'active' : ''}`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => applyFormatting('italic')}
          className={`${isFormatActive('italic') ? 'active' : ''}`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => applyFormatting('underline')}
          className={`${isFormatActive('underline') ? 'active' : ''}`}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>
        
        <div className="toolbar-divider"></div>
        
        {/* List Buttons */}
        <button
          onClick={createBulletedList}
          className={`list-button ${currentListState.isList && currentListState.type === 'bullet' ? 'active' : ''}`}
          title="Bulleted List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={createNumberedList}
          className={`list-button ${currentListState.isList && currentListState.type === 'number' ? 'active' : ''}`}
          title="Numbered List"
        >
          <span className="text-sm font-bold">1.</span>
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
        onDoubleClick={handleDoubleClick}
        onMouseDown={(e) => {
          // Handle triple-click for paragraph selection
          if (e.detail === 3) {
            e.preventDefault();
            handleTripleClick(e);
          }
        }}
        data-placeholder={placeholder}
        style={{
          minHeight: `${rows * 1.5}rem`,
          direction: 'ltr',
          textAlign: 'left',
          fontFamily: currentFormatting.fontFamily,
          fontSize: getFormattingStyle('fontSize', currentFormatting.fontSize).replace('font-size: ', ''),
          color: currentFormatting.color,
          userSelect: 'text',
          cursor: 'text'
        }}
      />
    </div>
  );
}; 





