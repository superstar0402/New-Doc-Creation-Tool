import React from 'react';
import { Upload, Calendar, User, Briefcase, Building, MapPin, Phone, Mail } from 'lucide-react';
import { ProjectInfo } from '../types';

interface ProjectInfoFormProps {
  projectInfo: ProjectInfo;
  onInfoChange: (info: ProjectInfo) => void;
}

export const ProjectInfoForm: React.FC<ProjectInfoFormProps> = ({
  projectInfo,
  onInfoChange
}) => {
  const handleInputChange = (field: keyof ProjectInfo, value: string) => {
    onInfoChange({
      ...projectInfo,
      [field]: value
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onInfoChange({
        ...projectInfo,
        customerLogo: file
      });
    }
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="relative mb-12 overflow-hidden rounded-2xl">
        <div 
          className="h-48 bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 flex items-center justify-center relative"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(6, 182, 212, 0.9)), url('https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="text-center text-white z-10">
            <h2 className="text-4xl font-bold mb-4">Project Information</h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Provide the essential details that will personalize and structure your professional document.
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Information Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div 
              className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 relative"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8)), url('https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute bottom-4 left-6">
                <div className="flex items-center text-white">
                  <User className="w-6 h-6 mr-2" />
                  <h3 className="text-lg font-semibold">Customer Details</h3>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={projectInfo.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Enter customer name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Logo
                </label>
                <div className="relative">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 hover:from-primary-50 hover:to-primary-100 hover:border-primary-300 transition-all duration-300 group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm text-gray-600 font-medium">
                        {projectInfo.customerLogo ? projectInfo.customerLogo.name : 'Click to upload logo'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Details Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div 
              className="h-32 bg-gradient-to-br from-emerald-500 to-teal-600 relative"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(16, 185, 129, 0.8), rgba(20, 184, 166, 0.8)), url('https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute bottom-4 left-6">
                <div className="flex items-center text-white">
                  <Briefcase className="w-6 h-6 mr-2" />
                  <h3 className="text-lg font-semibold">Project Information</h3>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={projectInfo.projectName}
                      onChange={(e) => handleInputChange('projectName', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                      placeholder="Enter project name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={projectInfo.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Overview
                </label>
                <textarea
                  value={projectInfo.projectOverview}
                  onChange={(e) => handleInputChange('projectOverview', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                  placeholder="Describe the project scope, objectives, and key deliverables..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technical Overview
                </label>
                <textarea
                  value={projectInfo.technicalOverview}
                  onChange={(e) => handleInputChange('technicalOverview', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                  placeholder="Provide technical details, approach, and implementation strategy..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Components & Pricing Section */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div 
          className="h-24 bg-gradient-to-br from-violet-500 to-purple-600 relative flex items-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(147, 51, 234, 0.8)), url('https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=800')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="px-6">
            <h3 className="text-lg font-semibold text-white">Components & Pricing</h3>
            <p className="text-violet-100 text-sm">Define project components and pricing structure</p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hardware Components
              </label>
              <textarea
                value={projectInfo.hardwareComponents}
                onChange={(e) => handleInputChange('hardwareComponents', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                placeholder="List hardware requirements, specifications, and quantities..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Services Components
              </label>
              <textarea
                value={projectInfo.servicesComponents}
                onChange={(e) => handleInputChange('servicesComponents', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                placeholder="List service offerings, consulting hours, and support packages..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pricing Table
            </label>
            <textarea
              value={projectInfo.pricingTable}
              onChange={(e) => handleInputChange('pricingTable', e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
              placeholder="Provide detailed pricing structure, payment terms, and cost breakdown..."
            />
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white text-center">
          <div className="text-2xl font-bold">01</div>
          <div className="text-sm opacity-90">Customer Info</div>
        </div>
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-4 text-white text-center">
          <div className="text-2xl font-bold">02</div>
          <div className="text-sm opacity-90">Project Details</div>
        </div>
        <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl p-4 text-white text-center">
          <div className="text-2xl font-bold">03</div>
          <div className="text-sm opacity-90">Components</div>
        </div>
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-4 text-white text-center">
          <div className="text-2xl font-bold">04</div>
          <div className="text-sm opacity-90">Pricing</div>
        </div>
      </div>
    </div>
  );
};