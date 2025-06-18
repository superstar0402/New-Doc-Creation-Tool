import React from 'react';
import { FileText, Briefcase, Presentation as PresentationChart, FileCheck } from 'lucide-react';
import { DocumentType } from '../types';

interface DocumentTypeSelectorProps {
  documentTypes: DocumentType[];
  selectedType: string;
  onTypeSelect: (typeId: string) => void;
}

const iconMap = {
  FileText,
  Briefcase,
  PresentationChart,
  FileSignature: FileCheck
};

const backgroundImages = {
  rfp: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
  sow: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
  proposal: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
  contract: 'https://images.pexels.com/photos/4427430/pexels-photo-4427430.jpeg?auto=compress&cs=tinysrgb&w=800'
};

export const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({
  documentTypes,
  selectedType,
  onTypeSelect
}) => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative mb-12 overflow-hidden rounded-2xl">
        <div 
          className="h-64 bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-800 flex items-center justify-center relative"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(37, 99, 235, 0.9), rgba(67, 56, 202, 0.9)), url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="text-center text-white z-10">
            <h2 className="text-4xl font-bold mb-4">Choose Your Document Type</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Select from our professionally crafted templates, each optimized for specific business needs and industry standards.
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {documentTypes.map((type) => {
          const IconComponent = iconMap[type.icon as keyof typeof iconMap] || FileText;
          const isSelected = selectedType === type.id;
          const bgImage = backgroundImages[type.id as keyof typeof backgroundImages];
          
          return (
            <div
              key={type.id}
              onClick={() => onTypeSelect(type.id)}
              className={`
                group relative overflow-hidden bg-white rounded-2xl shadow-lg cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 transform
                ${isSelected 
                  ? 'ring-4 ring-primary-500 shadow-2xl scale-105' 
                  : 'hover:ring-2 hover:ring-primary-300'
                }
              `}
            >
              {/* Background Image */}
              <div 
                className="h-48 bg-gradient-to-br from-primary-500 to-primary-700 relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(37, 99, 235, 0.8), rgba(67, 56, 202, 0.8)), url('${bgImage}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  {isSelected && (
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className={`
                    p-3 rounded-full backdrop-blur-sm transition-all duration-300 group-hover:scale-110
                    ${isSelected ? 'bg-white/20 shadow-lg' : 'bg-white/10'}
                  `}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                  isSelected ? 'text-primary-900' : 'text-gray-900 group-hover:text-primary-700'
                }`}>
                  {type.name}
                </h3>
                <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                  isSelected ? 'text-primary-700' : 'text-gray-600 group-hover:text-gray-700'
                }`}>
                  {type.description}
                </p>
                
                {/* Progress indicator */}
                <div className="mt-4 flex items-center justify-between">
                  <div className={`text-xs font-medium transition-colors duration-300 ${
                    isSelected ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'
                  }`}>
                    Professional Template
                  </div>
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isSelected ? 'bg-primary-500 shadow-lg' : 'bg-gray-300 group-hover:bg-primary-400'
                  }`}></div>
                </div>
              </div>

              {/* Hover overlay */}
              <div className={`
                absolute inset-0 bg-gradient-to-t from-primary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
                ${isSelected ? 'opacity-100' : ''}
              `}></div>
            </div>
          );
        })}
      </div>

      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Professional Templates</h4>
          <p className="text-sm text-gray-600">Industry-standard templates designed for maximum impact and compliance</p>
        </div>
        
        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Modular Content</h4>
          <p className="text-sm text-gray-600">Pre-built content blocks that can be mixed and matched for any project</p>
        </div>
        
        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <PresentationChart className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Export Ready</h4>
          <p className="text-sm text-gray-600">Generate Word, PDF, and Google Docs formats with professional formatting</p>
        </div>
      </div>
    </div>
  );
};