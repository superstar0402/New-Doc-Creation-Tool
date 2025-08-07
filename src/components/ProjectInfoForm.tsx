import React from 'react';
import { Upload, Calendar, User, Briefcase, Building, MapPin, Phone, Mail, Plus, Trash2 } from 'lucide-react';
import { ProjectInfo, PricingItem } from '../types';

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

  const handlePricingItemChange = (id: string, field: keyof PricingItem, value: string | number) => {
    const updatedPricingTable = projectInfo.pricingTable.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Calculate extended price
        if (field === 'quantity' || field === 'price') {
          updatedItem.extendedPrice = updatedItem.quantity * updatedItem.price;
        }
        return updatedItem;
      }
      return item;
    });

    onInfoChange({
      ...projectInfo,
      pricingTable: updatedPricingTable
    });
  };

  const addPricingItem = () => {
    const newItem: PricingItem = {
      id: `item-${Date.now()}`,
      item: '',
      quantity: 1,
      description: '',
      price: 0,
      extendedPrice: 0
    };

    onInfoChange({
      ...projectInfo,
      pricingTable: [...projectInfo.pricingTable, newItem]
    });
  };

  const removePricingItem = (id: string) => {
    const updatedPricingTable = projectInfo.pricingTable.filter(item => item.id !== id);
    onInfoChange({
      ...projectInfo,
      pricingTable: updatedPricingTable
    });
  };

  const calculateTotal = () => {
    return projectInfo.pricingTable.reduce((total, item) => total + item.extendedPrice, 0);
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
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Pricing Table
              </label>
              <button
                type="button"
                onClick={addPricingItem}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:from-violet-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <thead className="bg-gradient-to-r from-violet-50 to-purple-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Item</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Price ($)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Extended Price ($)</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {projectInfo.pricingTable.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 py-3 border-b border-gray-100">
                        <input
                          type="text"
                          value={item.item}
                          onChange={(e) => handlePricingItemChange(item.id, 'item', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300"
                          placeholder={`Item ${index + 1}`}
                        />
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handlePricingItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300"
                        />
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handlePricingItemChange(item.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300"
                          placeholder="Description"
                        />
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handlePricingItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300"
                        />
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100">
                        <div className="px-3 py-2 bg-gray-50 rounded-lg font-medium text-gray-700">
                          ${item.extendedPrice.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-4 py-3 border-b border-gray-100 text-center">
                        <button
                          type="button"
                          onClick={() => removePricingItem(item.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {projectInfo.pricingTable.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No pricing items added yet. Click "Add Item" to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
                {projectInfo.pricingTable.length > 0 && (
                  <tfoot className="bg-gradient-to-r from-violet-50 to-purple-50">
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-right font-semibold text-gray-700">
                        Total:
                      </td>
                      <td className="px-4 py-3 font-bold text-lg text-violet-700">
                        ${calculateTotal().toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
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