import React from 'react';
import { Download, FileText, Eye, Settings, Star, Award, Shield } from 'lucide-react';
import { ProjectInfo, TextBlock } from '../types';

interface DocumentPreviewProps {
  projectInfo: ProjectInfo;
  selectedBlocks: TextBlock[];
  documentType: string;
  onExport: (format: string) => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  projectInfo,
  selectedBlocks,
  documentType,
  onExport
}) => {
  const formatContent = (content: string) => {
    return content.replace(/\n/g, '<br/>');
  };

  const groupedBlocks = selectedBlocks.reduce((acc, block) => {
    if (!acc[block.category]) {
      acc[block.category] = [];
    }
    acc[block.category].push(block);
    return acc;
  }, {} as Record<string, TextBlock[]>);

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative mb-12 overflow-hidden rounded-2xl">
        <div 
          className="h-64 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center relative"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(79, 70, 229, 0.9), rgba(147, 51, 234, 0.9)), url('https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="text-center text-white z-10">
            <h2 className="text-4xl font-bold mb-4">Document Preview & Export</h2>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-6">
              Review your professionally crafted document and export it in your preferred format.
            </p>
            <div className="flex items-center justify-center space-x-8 text-indigo-100">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                  <Star className="w-4 h-4" />
                </div>
                <span>Professional Quality</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                  <Award className="w-4 h-4" />
                </div>
                <span>Industry Standard</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                  <Shield className="w-4 h-4" />
                </div>
                <span>Export Ready</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Export Options Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-6 overflow-hidden">
            <div 
              className="p-6 border-b border-gray-200 bg-gradient-to-br from-emerald-500 to-teal-600"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(20, 184, 166, 0.9)), url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <h3 className="text-lg font-semibold text-white flex items-center mb-2">
                <Download className="w-5 h-5 mr-2" />
                Export Options
              </h3>
              <p className="text-emerald-100 text-sm">Choose your preferred format</p>
            </div>
            
            <div className="p-6 space-y-4">
              <button
                onClick={() => onExport('docx')}
                className="w-full group relative overflow-hidden px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Export to Word</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
              
              <button
                onClick={() => onExport('pdf')}
                className="w-full group relative overflow-hidden px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Export to PDF</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
              
              <button
                onClick={() => onExport('gdocs')}
                className="w-full group relative overflow-hidden px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Google Docs</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>

              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Document Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <span className="text-sm text-gray-600">Document Type:</span>
                    <span className="text-sm font-medium text-blue-700 capitalize">{documentType}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                    <span className="text-sm text-gray-600">Content Blocks:</span>
                    <span className="text-sm font-medium text-emerald-700">{selectedBlocks.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <span className="text-sm text-gray-600">Customer:</span>
                    <span className="text-sm font-medium text-purple-700 truncate max-w-24" title={projectInfo.customerName}>
                      {projectInfo.customerName || 'Not set'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document Preview */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div 
              className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50 flex items-center justify-between"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(249, 250, 251, 0.9)), url('https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center mb-1">
                  <Eye className="w-6 h-6 mr-2 text-primary-600" />
                  Document Preview
                </h3>
                <p className="text-sm text-gray-600">Live preview of your document</p>
              </div>
              <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white">
                <Settings className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 bg-gradient-to-br from-gray-50 to-slate-50 max-h-[800px] overflow-y-auto">
              <div className="bg-white p-12 shadow-xl border border-gray-200 min-h-full rounded-lg">
                {/* Document Header */}
                <div className="text-center mb-12 pb-8 border-b-2 border-gray-200 relative">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    {documentType.toUpperCase().replace('-', ' ')}
                  </h1>
                  {projectInfo.customerName && (
                    <h2 className="text-2xl text-gray-700 mb-3 font-semibold">
                      {projectInfo.customerName}
                    </h2>
                  )}
                  {projectInfo.projectName && (
                    <h3 className="text-xl text-gray-600 mb-4">
                      {projectInfo.projectName}
                    </h3>
                  )}
                  {projectInfo.startDate && (
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200">
                      <span className="text-sm text-blue-700 font-medium">
                        Project Start Date: {new Date(projectInfo.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Project Overview */}
                {projectInfo.projectOverview && (
                  <div className="mb-10">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Project Overview</h3>
                    </div>
                    <div className="prose prose-lg prose-gray max-w-none pl-11">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500">
                        <p className="text-gray-700 leading-relaxed m-0">{projectInfo.projectOverview}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Technical Overview */}
                {projectInfo.technicalOverview && (
                  <div className="mb-10">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Technical Overview</h3>
                    </div>
                    <div className="prose prose-lg prose-gray max-w-none pl-11">
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border-l-4 border-emerald-500">
                        <p className="text-gray-700 leading-relaxed m-0">{projectInfo.technicalOverview}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Blocks by Category */}
                {Object.entries(groupedBlocks).map(([category, blocks], categoryIndex) => (
                  <div key={category} className="mb-10">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">{categoryIndex + 3}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{category}</h3>
                    </div>
                    <div className="space-y-6 pl-11">
                      {blocks.map((block, blockIndex) => (
                        <div key={block.id} className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <div className="w-6 h-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mr-2 text-xs text-white font-bold">
                              {blockIndex + 1}
                            </div>
                            {block.title}
                          </h4>
                          <div 
                            className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: formatContent(block.content) }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Pricing and Components */}
                {(projectInfo.hardwareComponents || projectInfo.servicesComponents || projectInfo.pricingTable) && (
                  <div className="mb-10">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">$</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Pricing & Components</h3>
                    </div>
                    
                    <div className="space-y-6 pl-11">
                      {projectInfo.hardwareComponents && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500">
                          <h4 className="text-lg font-semibold text-blue-800 mb-3">Hardware Components</h4>
                          <p className="text-gray-700 leading-relaxed">{projectInfo.hardwareComponents}</p>
                        </div>
                      )}

                      {projectInfo.servicesComponents && (
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border-l-4 border-emerald-500">
                          <h4 className="text-lg font-semibold text-emerald-800 mb-3">Services Components</h4>
                          <p className="text-gray-700 leading-relaxed">{projectInfo.servicesComponents}</p>
                        </div>
                      )}

                      {projectInfo.pricingTable && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border-l-4 border-amber-500">
                          <h4 className="text-lg font-semibold text-amber-800 mb-3">Pricing Structure</h4>
                          <p className="text-gray-700 leading-relaxed">{projectInfo.pricingTable}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="text-center pt-12 border-t-2 border-gray-200 relative">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></div>
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200">
                    <p className="text-gray-600 font-medium mb-2">This document is confidential and proprietary</p>
                    <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};