import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Check, X, Filter, Grid, List, Star } from 'lucide-react';
import { TextBlock } from '../types';

interface TextBlockSelectorProps {
  textBlocks: TextBlock[];
  onBlocksChange: (blocks: TextBlock[]) => void;
}

export const TextBlockSelector: React.FC<TextBlockSelectorProps> = ({
  textBlocks,
  onBlocksChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [newBlock, setNewBlock] = useState({ title: '', content: '', category: 'Custom' });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
                <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-blue-600" />
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
                                    setEditingBlock(block.id);
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
                          {block.content.substring(0, viewMode === 'grid' ? 150 : 300)}
                          {block.content.length > (viewMode === 'grid' ? 150 : 300) && '...'}
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
                          <div className="text-xs text-gray-400">
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