import React, { useState, useRef } from 'react';
import { Search, Plus, Edit, Trash2, Check, X, Grid, List, Star, Upload, Link, FileText, Download } from 'lucide-react';
import { TextBlock, FormattedContent } from '../types';

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

export const TextBlockSelector: React.FC<TextBlockSelectorProps> = ({
  textBlocks,
  onBlocksChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [isImportingContent, setIsImportingContent] = useState(false);
  const [newBlock, setNewBlock] = useState({ title: '', content: '', category: 'Custom' });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [importMethod, setImportMethod] = useState<'file' | 'url' | 'text'>('file');
  const [importData, setImportData] = useState({
    file: null as File | null,
    url: '',
    text: ''
  });
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', ...Array.from(new Set(textBlocks.map(block => block.category)))];
  
  const filteredBlocks = textBlocks.filter(block => {
    const matchesSearch = block.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         block.content.toLowerCase().includes(searchTerm.toLowerCase());
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
        isSelected: false
      };
      onBlocksChange([...textBlocks, block]);
      setNewBlock({ title: '', content: '', category: 'Custom' });
      setIsAddingBlock(false);
    }
  };

  const deleteBlock = (blockId: string) => {
    const updatedBlocks = textBlocks.filter(block => block.id !== blockId);
    onBlocksChange(updatedBlocks);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportData({ ...importData, file });
    }
  };

  const handleImportContent = async () => {
    setImporting(true);
    
    try {
      let content = '';
      let title = '';

      switch (importMethod) {
        case 'file':
          if (importData.file) {
            const text = await importData.file.text();
            content = text;
            title = importData.file.name.replace(/\.[^/.]+$/, ''); // Remove file extension
          }
          break;
        
        case 'url':
          if (importData.url) {
            // For demo purposes, we'll simulate fetching content from URL
            // In a real implementation, you'd make an actual HTTP request
            content = `Content imported from: ${importData.url}\n\nThis is a simulated import. In a real implementation, this would fetch the actual content from the URL.`;
            title = `Imported from URL`;
          }
          break;
        
        case 'text':
          if (importData.text) {
            content = importData.text;
            title = 'Imported Text';
          }
          break;
      }

      if (content) {
        // Split content into blocks (you can customize this logic)
        const blocks = content.split('\n\n').filter(block => block.trim().length > 0);
        
        const newBlocks: TextBlock[] = blocks.map((block, index) => ({
          id: `imported-${Date.now()}-${index}`,
          title: title + (blocks.length > 1 ? ` (Part ${index + 1})` : ''),
          content: block.trim(),
          category: 'Custom',
          isSelected: false
        }));

        onBlocksChange([...textBlocks, ...newBlocks]);
        
        // Reset import form
        setImportData({ file: null, url: '', text: '' });
        setIsImportingContent(false);
        setImportMethod('file');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Error importing content:', error);
      alert('Error importing content. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  const categoryColors = {
    'Introduction': 'from-blue-500 to-blue-600',
    'Requirements': 'from-emerald-500 to-emerald-600',
    'Assumptions': 'from-amber-500 to-amber-600',
    'Exceptions': 'from-red-500 to-red-600',
    'Resources': 'from-purple-500 to-purple-600',
    'Custom': 'from-gray-500 to-gray-600'
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
                      onClick={() => setIsImportingContent(true)}
                      className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <Upload className="w-4 h-4" />
                      Import
                    </button>
                    
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
              {/* Import Content Section */}
              {isImportingContent && (
                <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Upload className="w-5 h-5 mr-2 text-blue-600" />
                    Import Content
                  </h4>
                  
                  <div className="mb-4">
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => setImportMethod('file')}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                          importMethod === 'file' 
                            ? 'bg-blue-500 text-white shadow-lg' 
                            : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        File Upload
                      </button>
                      <button
                        onClick={() => setImportMethod('url')}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                          importMethod === 'url' 
                            ? 'bg-blue-500 text-white shadow-lg' 
                            : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Link className="w-4 h-4" />
                        URL Import
                      </button>
                      <button
                        onClick={() => setImportMethod('text')}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                          importMethod === 'text' 
                            ? 'bg-blue-500 text-white shadow-lg' 
                            : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Edit className="w-4 h-4" />
                        Text Input
                      </button>
                    </div>

                    {importMethod === 'file' && (
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".txt,.doc,.docx,.pdf"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center gap-3 w-full"
                          >
                            <Upload className="w-12 h-12 text-blue-500" />
                            <div>
                              <p className="text-lg font-medium text-gray-900">Click to upload file</p>
                              <p className="text-sm text-gray-500">Supports TXT, DOC, DOCX, PDF files</p>
                            </div>
                          </button>
                          {importData.file && (
                            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                              <p className="text-sm text-blue-800">
                                Selected: {importData.file.name} ({(importData.file.size / 1024).toFixed(1)} KB)
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {importMethod === 'url' && (
                      <div className="space-y-4">
                        <input
                          type="url"
                          placeholder="Enter URL to import content from..."
                          value={importData.url}
                          onChange={(e) => setImportData({ ...importData, url: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                        <p className="text-sm text-gray-500">
                          Enter a URL to import content. The system will attempt to extract text content from the webpage.
                        </p>
                      </div>
                    )}

                    {importMethod === 'text' && (
                      <div className="space-y-4">
                        <textarea
                          placeholder="Paste or type your content here..."
                          value={importData.text}
                          onChange={(e) => setImportData({ ...importData, text: e.target.value })}
                          rows={6}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-none"
                        />
                        <p className="text-sm text-gray-500">
                          Paste your content here. The system will automatically split it into content blocks.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleImportContent}
                      disabled={importing || (
                        (importMethod === 'file' && !importData.file) ||
                        (importMethod === 'url' && !importData.url) ||
                        (importMethod === 'text' && !importData.text)
                      )}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {importing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Importing...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Import Content
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsImportingContent(false);
                        setImportData({ file: null, url: '', text: '' });
                        setImportMethod('file');
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}

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
                    <textarea
                      placeholder="Block content"
                      value={newBlock.content}
                      onChange={(e) => setNewBlock({ ...newBlock, content: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white resize-none"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={addNewBlock}
                        className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
                      >
                        <Check className="w-4 h-4" />
                        Add Block
                      </button>
                      <button
                        onClick={() => setIsAddingBlock(false)}
                        className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
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
                            {block.id.startsWith('custom-') && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // TODO: Implement edit functionality
                                  }}
                                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteBlock(block.id);
                                  }}
                                  className="p-1.5 text-white/80 hover:text-white hover:bg-red-500/30 rounded-lg transition-all duration-200"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
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
                        <h4 className={`font-semibold text-lg mb-3 transition-colors duration-300 ${
                          block.isSelected ? 'text-primary-900' : 'text-gray-900 group-hover:text-primary-700'
                        }`}>
                          {block.title}
                        </h4>
                        <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                          block.isSelected ? 'text-primary-700' : 'text-gray-600 group-hover:text-gray-700'
                        }`}>
                          {block.formattedContent ? 
                            renderFormattedContent(block.formattedContent, viewMode === 'grid' ? 150 : 300) :
                            block.content.substring(0, viewMode === 'grid' ? 150 : 300) + (block.content.length > (viewMode === 'grid' ? 150 : 300) ? '...' : '')
                          }
                        </p>
                        
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
                            {block.formattedContent ? 
                              renderFormattedContent(block.formattedContent, 100) :
                              block.content.substring(0, 100) + (block.content.length > 100 ? '...' : '')
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