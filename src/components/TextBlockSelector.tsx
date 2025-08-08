import React, { useState, useRef } from 'react';
import { Search, Plus, Edit, Trash2, Check, X, Grid, List, Star, Upload } from 'lucide-react';
import { TextBlock, FormattedContent } from '../types';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface TextBlockSelectorProps {
  textBlocks: TextBlock[];
  onBlocksChange: (blocks: TextBlock[]) => void;
}

// Helper function to render formatted content
const renderFormattedContent = (formattedContent: FormattedContent[] | undefined, maxLength?: number) => {
  if (!formattedContent || formattedContent.length === 0) {
    return null;
  }

  let currentLength = 0;
  const elements: React.ReactNode[] = [];

  for (const item of formattedContent) {
    if (maxLength && currentLength >= maxLength) {
      elements.push(<span key={`ellipsis-${currentLength}`}>...</span>);
      break;
    }

    const style: React.CSSProperties = {};
    const className: string[] = [];

    // Apply font size
    if (item.style?.fontSize) {
      switch (item.style.fontSize) {
        case 'xs':
          className.push('text-xs');
          break;
        case 'sm':
          className.push('text-sm');
          break;
        case 'base':
          className.push('text-base');
          break;
        case 'lg':
          className.push('text-lg');
          break;
        case 'xl':
          className.push('text-xl');
          break;
        case '2xl':
          className.push('text-2xl');
          break;
        case '3xl':
          className.push('text-3xl');
          break;
      }
    }

    // Apply font weight
    if (item.style?.bold) {
      className.push('font-bold');
    }

    // Apply font style
    if (item.style?.italic) {
      className.push('italic');
    }

    // Apply text decoration
    if (item.style?.underline) {
      className.push('underline');
    }

    // Apply color
    if (item.style?.color) {
      style.color = item.style.color;
    }

    const textContent = maxLength && currentLength + item.text.length > maxLength 
      ? item.text.substring(0, maxLength - currentLength)
      : item.text;

    elements.push(
      <span
        key={`${currentLength}-${item.text.substring(0, 10)}`}
        className={className.join(' ')}
        style={style}
      >
        {textContent}
      </span>
    );

    currentLength += item.text.length;
    if (maxLength && currentLength >= maxLength) {
      break;
    }
  }

  return <>{elements}</>;
};

// Build CSS classes and inline styles from formatting options
const buildFormatting = (formatting?: { fontFamily?: string; fontSize?: string; bold?: boolean; italic?: boolean; underline?: boolean; color?: string; }) => {
  const classes: string[] = [];
  const style: React.CSSProperties = {};

  switch (formatting?.fontSize) {
    case 'xs': classes.push('text-xs'); break;
    case 'sm': classes.push('text-sm'); break;
    case 'base': classes.push('text-base'); break;
    case 'lg': classes.push('text-lg'); break;
    case 'xl': classes.push('text-xl'); break;
    case '2xl': classes.push('text-2xl'); break;
    case '3xl': classes.push('text-3xl'); break;
  }
  if (formatting?.bold) classes.push('font-bold');
  if (formatting?.italic) classes.push('italic');
  if (formatting?.underline) classes.push('underline');
  if (formatting?.color) style.color = formatting.color;
  if (formatting?.fontFamily) style.fontFamily = formatting.fontFamily;

  return { className: classes.join(' '), style };
};

export const TextBlockSelector: React.FC<TextBlockSelectorProps> = ({
  textBlocks,
  onBlocksChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  // Update newBlock state to include headerOptions, footerOptions, and formatting options
  const [newBlock, setNewBlock] = useState({ 
    title: '', 
    content: '', 
    category: 'Custom', 
    headerOptions: ['', ''], 
    footerOptions: ['', ''],
    titleFormatting: {
      fontFamily: 'Inter',
      fontSize: 'base',
      bold: false,
      italic: false,
      underline: false,
      color: '#000000'
    },
    contentFormatting: {
      fontFamily: 'Inter',
      fontSize: 'base',
      bold: false,
      italic: false,
      underline: false,
      color: '#000000'
    }
  });
  const [editBlock, setEditBlock] = useState<TextBlock | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addBlockFileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', ...Array.from(new Set(textBlocks.map(block => block.category)))];
  
  const filteredBlocks = textBlocks.filter(block => {
    const matchesSearch =
      block.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (block.headerOptions && block.headerOptions.some(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      (block.footerOptions && block.footerOptions.some(opt => opt.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesCategory = selectedCategory === 'All' || block.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedBlocks = textBlocks.filter(block => block.isSelected);

  const toggleBlockSelection = (blockId: string) => {
    const updatedBlocks = textBlocks.map(block =>
      block.id === blockId ? { ...block, isSelected: !block.isSelected } : block
    );
    onBlocksChange(updatedBlocks);
  };

  const addNewBlock = () => {
    if (newBlock.title && newBlock.content) {
      const block: TextBlock = {
        id: `custom-${Date.now()}`,
        title: newBlock.title,
        content: newBlock.content,
        category: newBlock.category,
        isSelected: false,
        headerOptions: newBlock.headerOptions,
        footerOptions: newBlock.footerOptions,
        titleFormatting: newBlock.titleFormatting,
        contentFormatting: newBlock.contentFormatting
      };
      onBlocksChange([...textBlocks, block]);
      setNewBlock({ 
        title: '', 
        content: '', 
        category: 'Custom', 
        headerOptions: ['', ''], 
        footerOptions: ['', ''],
        titleFormatting: {
          fontFamily: 'Inter',
          fontSize: 'base',
          bold: false,
          italic: false,
          underline: false,
          color: '#000000'
        },
        contentFormatting: {
          fontFamily: 'Inter',
          fontSize: 'base',
          bold: false,
          italic: false,
          underline: false,
          color: '#000000'
        }
      });
      setIsAddingBlock(false);
      // Reset file input
      if (addBlockFileInputRef.current) {
        addBlockFileInputRef.current.value = '';
      }
    }
  };

  const handleEditBlockSave = () => {
    if (editBlock) {
      const updatedBlocks = textBlocks.map(block =>
        block.id === editBlock.id ? { 
          ...editBlock,
          content: editBlock.content,
          // Clear formattedContent when content is edited to ensure the new content is displayed
          formattedContent: undefined,
          headerOptions: editBlock.headerOptions || ['', ''],
          footerOptions: editBlock.footerOptions || ['', '']
        } : block
      );
      onBlocksChange(updatedBlocks);
      setEditBlock(null);
    }
  };

  const deleteBlock = (blockId: string) => {
    const updatedBlocks = textBlocks.filter(block => block.id !== blockId);
    onBlocksChange(updatedBlocks);
  };



  const categoryColors = {
    'Introduction': 'from-blue-500 to-blue-600',
    'Requirements': 'from-emerald-500 to-emerald-600',
    'Assumptions': 'from-amber-500 to-amber-600',
    'Exceptions': 'from-red-500 to-red-600',
    'Resources': 'from-purple-500 to-purple-600',
    'Custom': 'from-gray-500 to-gray-600'
  };

  // Helper to safely set editBlock with header/footer options always present
  const openEditBlock = (block: TextBlock) => {
    setEditBlock({
      ...block,
      content: block.content, // Ensure content is properly set
      headerOptions: block.headerOptions && block.headerOptions.length === 2 ? block.headerOptions : [block.headerOptions?.[0] || '', block.headerOptions?.[1] || ''],
      footerOptions: block.footerOptions && block.footerOptions.length === 2 ? block.footerOptions : [block.footerOptions?.[0] || '', block.footerOptions?.[1] || ''],
    });
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative mb-12 overflow-hidden rounded-2xl">
        <div 
          className="h-56 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 flex items-center justify-center relative"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(147, 51, 234, 0.9), rgba(236, 72, 153, 0.9)), url('https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="text-center text-white z-10">
            <h2 className="text-4xl font-bold mb-4">Select Content Blocks</h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Choose from our extensive library of pre-built content blocks or create custom ones tailored to your specific needs.
            </p>
            <div className="mt-6 flex items-center justify-center space-x-8 text-purple-100">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                  <Check className="w-4 h-4" />
                </div>
                <span>Professional Content</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                  <Star className="w-4 h-4" />
                </div>
                <span>Industry Tested</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                  <Edit className="w-4 h-4" />
                </div>
                <span>Fully Customizable</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Content Library */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header with Controls */}
            <div 
              className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(249, 250, 251, 0.9)), url('https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Content Library</h3>
                  <p className="text-sm text-gray-600">{filteredBlocks.length} blocks available</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <div className="relative flex-1 lg:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search content blocks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-300"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm min-w-32"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    
                    <div className="flex border border-gray-300 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                    

                    
                    <button
                      onClick={() => setIsAddingBlock(true)}
                      className="px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <Plus className="w-4 h-4" />
                      Add Block
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">

              {isAddingBlock && (
                <div className="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-dashed border-emerald-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-emerald-600" />
                    Add New Content Block
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Block title"
                        value={newBlock.title}
                        onChange={(e) => setNewBlock({ ...newBlock, title: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                      />
                      <select
                        value={newBlock.category}
                        onChange={(e) => setNewBlock({ ...newBlock, category: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                      >
                        <option value="Custom">Custom</option>
                        <option value="Introduction">Introduction</option>
                        <option value="Requirements">Requirements</option>
                        <option value="Assumptions">Assumptions</option>
                        <option value="Exceptions">Exceptions</option>
                        <option value="Resources">Resources</option>
                      </select>
                    </div>

                    {/* Title Formatting Options */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Title Formatting
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Font Family</label>
                          <select
                            value={newBlock.titleFormatting.fontFamily}
                            onChange={(e) => setNewBlock({
                              ...newBlock,
                              titleFormatting: { ...newBlock.titleFormatting, fontFamily: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-sm"
                          >
                            <option value="Inter">Inter</option>
                            <option value="Arial">Arial</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Verdana">Verdana</option>
                            <option value="Helvetica">Helvetica</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Font Size</label>
                          <select
                            value={newBlock.titleFormatting.fontSize}
                            onChange={(e) => setNewBlock({
                              ...newBlock,
                              titleFormatting: { ...newBlock.titleFormatting, fontSize: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-sm"
                          >
                            <option value="xs">Extra Small</option>
                            <option value="sm">Small</option>
                            <option value="base">Base</option>
                            <option value="lg">Large</option>
                            <option value="xl">Extra Large</option>
                            <option value="2xl">2XL</option>
                            <option value="3xl">3XL</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                          <input
                            type="color"
                            value={newBlock.titleFormatting.color}
                            onChange={(e) => setNewBlock({
                              ...newBlock,
                              titleFormatting: { ...newBlock.titleFormatting, color: e.target.value }
                            })}
                            className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <button
                            onClick={() => setNewBlock({
                              ...newBlock,
                              titleFormatting: { ...newBlock.titleFormatting, bold: !newBlock.titleFormatting.bold }
                            })}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              newBlock.titleFormatting.bold 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Bold
                          </button>
                          <button
                            onClick={() => setNewBlock({
                              ...newBlock,
                              titleFormatting: { ...newBlock.titleFormatting, italic: !newBlock.titleFormatting.italic }
                            })}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              newBlock.titleFormatting.italic 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Italic
                          </button>
                          <button
                            onClick={() => setNewBlock({
                              ...newBlock,
                              titleFormatting: { ...newBlock.titleFormatting, underline: !newBlock.titleFormatting.underline }
                            })}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              newBlock.titleFormatting.underline 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Underline
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <textarea
                        placeholder="Block content"
                        value={newBlock.content}
                        onChange={(e) => setNewBlock({ ...newBlock, content: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white resize-none"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept=".txt,.doc,.docx,.pdf"
                          id="add-block-upload"
                          style={{ display: 'none' }}
                          ref={addBlockFileInputRef}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            let text = '';
                            if (file.type === 'application/pdf') {
                              // PDF: use PDF.js or fallback
                              try {
                                const arrayBuffer = await file.arrayBuffer();
                                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                                let pdfText = '';
                                for (let i = 1; i <= pdf.numPages; i++) {
                                  const page = await pdf.getPage(i);
                                  const content = await page.getTextContent();
                                  pdfText += content.items.map((item: any) => item.str).join(' ') + '\n';
                                }
                                text = pdfText;
                              } catch (err) {
                                alert('PDF reading failed. Please use a .txt file or paste content manually.');
                                return;
                              }
                            } else if (file.name.endsWith('.docx')) {
                              // DOCX: use mammoth
                              try {
                                const mammoth = await import('mammoth');
                                const arrayBuffer = await file.arrayBuffer();
                                const result = await mammoth.extractRawText({ arrayBuffer });
                                text = result.value;
                              } catch (err) {
                                alert('DOCX reading failed. Please use a .txt file or paste content manually.');
                                return;
                              }
                            } else if (file.name.endsWith('.doc')) {
                              alert('DOC files are not supported. Please use DOCX, TXT, or PDF.');
                              return;
                            } else {
                              // TXT or fallback
                              text = await file.text();
                            }
                            setNewBlock({ ...newBlock, content: text });
                          }}
                        />
                        <label htmlFor="add-block-upload" className="px-3 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-all text-xs">
                          Upload Content
                        </label>
                        <button
                          onClick={() => setNewBlock({ ...newBlock, content: '' })}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-xs"
                        >
                          Clear Content
                        </button>
                        <span className="text-xs text-gray-400">
                          {newBlock.content ? newBlock.content.length : 0} chars
                        </span>
                      </div>
                    </div>

                    {/* Content Formatting Options */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Content Formatting
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Font Family</label>
                          <select
                            value={newBlock.contentFormatting.fontFamily}
                            onChange={(e) => setNewBlock({
                              ...newBlock,
                              contentFormatting: { ...newBlock.contentFormatting, fontFamily: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-sm"
                          >
                            <option value="Inter">Inter</option>
                            <option value="Arial">Arial</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Verdana">Verdana</option>
                            <option value="Helvetica">Helvetica</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Font Size</label>
                          <select
                            value={newBlock.contentFormatting.fontSize}
                            onChange={(e) => setNewBlock({
                              ...newBlock,
                              contentFormatting: { ...newBlock.contentFormatting, fontSize: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-sm"
                          >
                            <option value="xs">Extra Small</option>
                            <option value="sm">Small</option>
                            <option value="base">Base</option>
                            <option value="lg">Large</option>
                            <option value="xl">Extra Large</option>
                            <option value="2xl">2XL</option>
                            <option value="3xl">3XL</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                          <input
                            type="color"
                            value={newBlock.contentFormatting.color}
                            onChange={(e) => setNewBlock({
                              ...newBlock,
                              contentFormatting: { ...newBlock.contentFormatting, color: e.target.value }
                            })}
                            className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <button
                            onClick={() => setNewBlock({
                              ...newBlock,
                              contentFormatting: { ...newBlock.contentFormatting, bold: !newBlock.contentFormatting.bold }
                            })}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              newBlock.contentFormatting.bold 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Bold
                          </button>
                          <button
                            onClick={() => setNewBlock({
                              ...newBlock,
                              contentFormatting: { ...newBlock.contentFormatting, italic: !newBlock.contentFormatting.italic }
                            })}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              newBlock.contentFormatting.italic 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Italic
                          </button>
                          <button
                            onClick={() => setNewBlock({
                              ...newBlock,
                              contentFormatting: { ...newBlock.contentFormatting, underline: !newBlock.contentFormatting.underline }
                            })}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              newBlock.contentFormatting.underline 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Underline
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Header Option 1</label>
                        <input
                          type="text"
                          value={newBlock.headerOptions[0]}
                          onChange={e => setNewBlock({ ...newBlock, headerOptions: [e.target.value, newBlock.headerOptions[1]] })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Header Option 2</label>
                        <input
                          type="text"
                          value={newBlock.headerOptions[1]}
                          onChange={e => setNewBlock({ ...newBlock, headerOptions: [newBlock.headerOptions[0], e.target.value] })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Footer Option 1</label>
                        <input
                          type="text"
                          value={newBlock.footerOptions[0]}
                          onChange={e => setNewBlock({ ...newBlock, footerOptions: [e.target.value, newBlock.footerOptions[1]] })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Footer Option 2</label>
                        <input
                          type="text"
                          value={newBlock.footerOptions[1]}
                          onChange={e => setNewBlock({ ...newBlock, footerOptions: [newBlock.footerOptions[0], e.target.value] })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={addNewBlock}
                        className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
                      >
                        <Check className="w-4 h-4" />
                        Add Block
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingBlock(false);
                          // Reset file input
                          if (addBlockFileInputRef.current) {
                            addBlockFileInputRef.current.value = '';
                          }
                        }}
                        className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Block Modal */}
              {editBlock && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
                    <button
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
                      onClick={() => setEditBlock(null)}
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Edit className="w-5 h-5 mr-2 text-primary-600" />
                      Edit Content Block
                    </h4>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Block title"
                        value={editBlock.title}
                        onChange={e => setEditBlock({ ...editBlock, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                      />
                                              <textarea
                          placeholder="Block content"
                          value={editBlock.content || ''}
                          onChange={e => setEditBlock({ ...editBlock, content: e.target.value })}
                          rows={6}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white resize-none"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept=".txt,.doc,.docx,.pdf"
                            id="edit-block-upload"
                            style={{ display: 'none' }}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              let text = '';
                              if (file.type === 'application/pdf') {
                                // PDF: use PDF.js or fallback
                                try {
                                  const arrayBuffer = await file.arrayBuffer();
                                  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                                  let pdfText = '';
                                  for (let i = 1; i <= pdf.numPages; i++) {
                                    const page = await pdf.getPage(i);
                                    const content = await page.getTextContent();
                                    pdfText += content.items.map((item: any) => item.str).join(' ') + '\n';
                                  }
                                  text = pdfText;
                                } catch (err) {
                                  alert('PDF reading failed. Please use a .txt file or paste content manually.');
                                  return;
                                }
                              } else if (file.name.endsWith('.docx')) {
                                // DOCX: use mammoth
                                try {
                                  const mammoth = await import('mammoth');
                                  const arrayBuffer = await file.arrayBuffer();
                                  const result = await mammoth.extractRawText({ arrayBuffer });
                                  text = result.value;
                                } catch (err) {
                                  alert('DOCX reading failed. Please use a .txt file or paste content manually.');
                                  return;
                                }
                              } else if (file.name.endsWith('.doc')) {
                                alert('DOC files are not supported. Please use DOCX, TXT, or PDF.');
                                return;
                              } else {
                                // TXT or fallback
                                text = await file.text();
                              }
                              setEditBlock({ ...editBlock, content: text });
                            }}
                          />
                          <label htmlFor="edit-block-upload" className="px-3 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-all text-xs">
                            Upload Content
                          </label>
                          <button
                            onClick={() => setEditBlock({ ...editBlock, content: '' })}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-xs"
                          >
                            Clear Content
                          </button>
                          <span className="text-xs text-gray-400">
                            {editBlock.content ? editBlock.content.length : 0} chars
                          </span>
                        </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold mb-1">Header Option 1</label>
                          <input
                            type="text"
                            value={editBlock.headerOptions?.[0] || ''}
                            onChange={e => setEditBlock({ ...editBlock, headerOptions: [e.target.value, editBlock.headerOptions?.[1] || ''] })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1">Header Option 2</label>
                          <input
                            type="text"
                            value={editBlock.headerOptions?.[1] || ''}
                            onChange={e => setEditBlock({ ...editBlock, headerOptions: [editBlock.headerOptions?.[0] || '', e.target.value] })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1">Footer Option 1</label>
                          <input
                            type="text"
                            value={editBlock.footerOptions?.[0] || ''}
                            onChange={e => setEditBlock({ ...editBlock, footerOptions: [e.target.value, editBlock.footerOptions?.[1] || ''] })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1">Footer Option 2</label>
                          <input
                            type="text"
                            value={editBlock.footerOptions?.[1] || ''}
                            onChange={e => setEditBlock({ ...editBlock, footerOptions: [editBlock.footerOptions?.[0] || '', e.target.value] })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleEditBlockSave}
                          className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
                        >
                          <Check className="w-4 h-4" />
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditBlock(null)}
                          className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                {filteredBlocks.map((block) => {
                  const categoryGradient = categoryColors[block.category as keyof typeof categoryColors] || categoryColors.Custom;
                  
                  return (
                    <div
                      key={block.id}
                      onClick={() => toggleBlockSelection(block.id)}
                      className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                        block.isSelected
                          ? 'ring-4 ring-primary-500 shadow-2xl scale-105'
                          : 'shadow-lg hover:shadow-2xl border border-gray-200'
                      }`}
                    >
                      {/* Category Header */}
                      <div className={`h-16 bg-gradient-to-r ${categoryGradient} relative flex items-center px-6`}>
                        <div className="flex items-center justify-between w-full">
                          <span className="text-white font-medium text-sm">{block.category}</span>
                          <div className="flex items-center gap-2">
                            {/* Allow editing for all blocks, not just custom ones */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditBlock(block);
                              }}
                              className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {/* Only allow deleting custom blocks */}
                            {block.id.startsWith('custom-') && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteBlock(block.id);
                                }}
                                className="p-1.5 text-white/80 hover:text-white hover:bg-red-500/30 rounded-lg transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                              block.isSelected
                                ? 'border-white bg-white'
                                : 'border-white/60 group-hover:border-white'
                            }`}>
                              {block.isSelected && (
                                <Check className="w-3 h-3 text-gray-700" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="bg-white p-6">
                        {(() => { const f = buildFormatting(block.titleFormatting); return (
                          <h4 className={`font-semibold mb-3 transition-colors duration-300 ${
                            block.isSelected ? 'text-primary-900' : 'text-gray-900 group-hover:text-primary-700'
                          } ${f.className}`}
                          style={f.style}
                          >
                            {block.title}
                          </h4>
                        ); })() }
                        <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                          block.isSelected ? 'text-primary-700' : 'text-gray-600 group-hover:text-gray-700'
                        }`}>
                          {block.formattedContent && block.formattedContent.length > 0 ? 
                            renderFormattedContent(block.formattedContent, viewMode === 'grid' ? 150 : 300) :
                            (() => { const f = buildFormatting(block.contentFormatting); return (
                              <span className={f.className} style={f.style}>
                                {block.content.substring(0, viewMode === 'grid' ? 150 : 300)}
                                {block.content.length > (viewMode === 'grid' ? 150 : 300) ? '...' : ''}
                              </span>
                            ); })()
                          }
                        </p>
                        {/* Show header/footer options if present */}
                        {(block.headerOptions && block.headerOptions.some(opt => opt)) && (
                          <div className="mt-2">
                            <div className="text-xs font-semibold text-gray-500 mb-1">Header Options:</div>
                            <ul className="text-xs text-gray-500 space-y-1">
                              {block.headerOptions.map((opt, idx) => opt && <li key={idx}>• {opt}</li>)}
                            </ul>
                          </div>
                        )}
                        {(block.footerOptions && block.footerOptions.some(opt => opt)) && (
                          <div className="mt-2">
                            <div className="text-xs font-semibold text-gray-500 mb-1">Footer Options:</div>
                            <ul className="text-xs text-gray-500 space-y-1">
                              {block.footerOptions.map((opt, idx) => opt && <li key={idx}>• {opt}</li>)}
                            </ul>
                          </div>
                        )}
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-xs text-gray-400">
                            {block.content.length} characters
                          </div>
                          <div className={`text-xs font-medium transition-colors duration-300 ${
                            block.isSelected ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'
                          }`}>
                            Click to {block.isSelected ? 'remove' : 'select'}
                          </div>
                        </div>
                      </div>

                      {/* Selection Overlay */}
                      <div className={`
                        absolute inset-0 bg-gradient-to-t from-primary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
                        ${block.isSelected ? 'opacity-100' : ''}
                      `}></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Blocks Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-6 overflow-hidden">
            <div 
              className="p-6 border-b border-gray-200 bg-gradient-to-br from-emerald-500 to-teal-600"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(20, 184, 166, 0.9)), url('https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=400')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <h3 className="text-lg font-semibold text-white mb-1">
                Selected Blocks
              </h3>
              <p className="text-emerald-100 text-sm">
                {selectedBlocks.length} block{selectedBlocks.length !== 1 ? 's' : ''} selected
              </p>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {selectedBlocks.length > 0 ? (
                <div className="space-y-3">
                  {selectedBlocks.map((block, index) => {
                    const categoryGradient = categoryColors[block.category as keyof typeof categoryColors] || categoryColors.Custom;
                    
                    return (
                      <div
                        key={block.id}
                        className="group relative overflow-hidden rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300"
                      >
                        <div className={`h-2 bg-gradient-to-r ${categoryGradient}`}></div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0">
                              <span className="text-xs text-gray-500 font-medium">
                                {block.category}
                              </span>
                              <h5 className="text-sm font-semibold text-gray-900 mt-1 truncate">
                                {block.title}
                              </h5>
                            </div>
                            <button
                              onClick={() => toggleBlockSelection(block.id)}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors ml-2 flex-shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-xs text-gray-600 leading-relaxed">
                            {block.formattedContent && block.formattedContent.length > 0 ? 
                              renderFormattedContent(block.formattedContent, 100) :
                              (() => { const f = buildFormatting(block.contentFormatting); return (
                                <span className={f.className} style={f.style}>
                                  {block.content.substring(0, 100)}
                                  {block.content.length > 100 ? '...' : ''}
                                </span>
                              ); })()
                            }
                          </div>
                          <div className="text-xs text-gray-400 mt-2">
                            Position: {index + 1}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium mb-1">No blocks selected</p>
                  <p className="text-sm text-gray-400">
                    Click on content blocks to add them to your document
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};