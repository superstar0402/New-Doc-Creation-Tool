import React, { useState } from 'react';
import { Bold, Italic, Underline, Plus, Trash2, List } from 'lucide-react';
import { FormattedContent } from '../types';

interface PricingComponentsProps {
  hardwareComponents: FormattedContent[];
  servicesComponents: FormattedContent[];
  onHardwareComponentsChange: (components: FormattedContent[]) => void;
  onServicesComponentsChange: (components: FormattedContent[]) => void;
}

interface TextFormatting {
  fontFamily: string;
  fontSize: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color?: string;
}

const fontFamilies = [
  'Arial',
  'Times New Roman',
  'Calibri',
  // 'Georgia',
  // 'Verdana',
  // 'Helvetica',
  // 'Courier New',
  // 'Tahoma'
];

const fontSizes = [
  { label: 'Extra Small', value: 'xs' },
  { label: 'Small', value: 'sm' },
  { label: 'Base', value: 'base' },
  { label: 'Large', value: 'lg' },
  { label: 'Extra Large', value: 'xl' },
  { label: '2XL', value: '2xl' },
  { label: '3XL', value: '3xl' }
];

const fontSizeMap = {
  'xs': '0.75rem',
  'sm': '0.875rem',
  'base': '1rem',
  'lg': '1.125rem',
  'xl': '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem'
};

export const PricingComponents: React.FC<PricingComponentsProps> = ({
  hardwareComponents,
  servicesComponents,
  onHardwareComponentsChange,
  onServicesComponentsChange
}) => {
  const [activeTab, setActiveTab] = useState<'hardware' | 'services'>('hardware');
  const [selectedFormatting, setSelectedFormatting] = useState<TextFormatting>({
    fontFamily: 'Arial',
    fontSize: 'base',
    bold: false,
    italic: false,
    underline: false,
    color: undefined
  });

  const addBulletPoint = (type: 'hardware' | 'services') => {
    const newBullet: FormattedContent = {
      text: '• New bullet point',
      style: {
        bold: selectedFormatting.bold,
        italic: selectedFormatting.italic,
        underline: selectedFormatting.underline,
        fontSize: selectedFormatting.fontSize as any,
        color: selectedFormatting.color,
        fontFamily: selectedFormatting.fontFamily
      }
    };

    if (type === 'hardware') {
      onHardwareComponentsChange([...hardwareComponents, newBullet]);
    } else {
      onServicesComponentsChange([...servicesComponents, newBullet]);
    }
  };

  const updateBulletPoint = (type: 'hardware' | 'services', index: number, text: string) => {
    const components = type === 'hardware' ? hardwareComponents : servicesComponents;
    const updatedComponents = [...components];
    updatedComponents[index] = {
      ...updatedComponents[index],
      text
    };

    if (type === 'hardware') {
      onHardwareComponentsChange(updatedComponents);
    } else {
      onServicesComponentsChange(updatedComponents);
    }
  };

  const updateBulletFormatting = (type: 'hardware' | 'services', index: number, formatting: Partial<TextFormatting>) => {
    const components = type === 'hardware' ? hardwareComponents : servicesComponents;
    const updatedComponents = [...components];
    updatedComponents[index] = {
      ...updatedComponents[index],
      style: {
        ...updatedComponents[index].style,
        ...Object.fromEntries(
          Object.entries(formatting).map(([key, value]) => {
            if (key === 'fontSize' && typeof value === 'string') {
              // Only allow valid fontSize values
              const allowedFontSizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'];
              return ['fontSize', allowedFontSizes.includes(value) ? value : undefined];
            }
            return [key, value];
          })
        )
      }
    };

    if (type === 'hardware') {
      onHardwareComponentsChange(updatedComponents);
    } else {
      onServicesComponentsChange(updatedComponents);
    }
  };

  const removeBulletPoint = (type: 'hardware' | 'services', index: number) => {
    const components = type === 'hardware' ? hardwareComponents : servicesComponents;
    const updatedComponents = components.filter((_, i) => i !== index);

    if (type === 'hardware') {
      onHardwareComponentsChange(updatedComponents);
    } else {
      onServicesComponentsChange(updatedComponents);
    }
  };

  const renderBulletPoint = (item: FormattedContent, index: number, type: 'hardware' | 'services') => {
    const style: React.CSSProperties = {
      fontFamily: item.style?.fontFamily || 'Arial',
      fontSize: item.style?.fontSize ? fontSizeMap[item.style.fontSize] : '1rem',
      fontWeight: item.style?.bold ? 'bold' : 'normal',
      fontStyle: item.style?.italic ? 'italic' : 'normal',
      textDecoration: item.style?.underline ? 'underline' : 'none'
    };

    return (
      <div key={index} className="flex items-start space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
        <div className="flex-1">
          <input
            type="text"
            value={item.text}
            onChange={(e) => updateBulletPoint(type, index, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300"
            style={style}
          />
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => updateBulletFormatting(type, index, { bold: !item.style?.bold })}
            className={`p-2 rounded ${item.style?.bold ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600'} hover:bg-violet-200 transition-colors`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => updateBulletFormatting(type, index, { italic: !item.style?.italic })}
            className={`p-2 rounded ${item.style?.italic ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600'} hover:bg-violet-200 transition-colors`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => updateBulletFormatting(type, index, { underline: !item.style?.underline })}
            className={`p-2 rounded ${item.style?.underline ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600'} hover:bg-violet-200 transition-colors`}
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>
          
          <select
            value={item.style?.fontFamily || 'Arial'}
            onChange={(e) => updateBulletFormatting(type, index, { fontFamily: e.target.value })}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          >
            {fontFamilies.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
          
          <select
            value={item.style?.fontSize || 'base'}
            onChange={(e) => updateBulletFormatting(type, index, { fontSize: e.target.value })}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          >
            {fontSizes.map(size => (
              <option key={size.value} value={size.value}>{size.label}</option>
            ))}
          </select>
          

          
          <button
            onClick={() => removeBulletPoint(type, index)}
            className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
            title="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('hardware')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-300 ${
            activeTab === 'hardware'
              ? 'bg-white text-violet-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Hardware Components
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-300 ${
            activeTab === 'services'
              ? 'bg-white text-violet-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Services Components
        </button>
      </div>

      {/* Formatting Toolbar */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Default Formatting for New Items</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Font:</label>
            <select
              value={selectedFormatting.fontFamily}
              onChange={(e) => setSelectedFormatting({ ...selectedFormatting, fontFamily: e.target.value })}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            >
              {fontFamilies.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Size:</label>
            <select
              value={selectedFormatting.fontSize}
              onChange={(e) => setSelectedFormatting({ ...selectedFormatting, fontSize: e.target.value })}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            >
              {fontSizes.map(size => (
                <option key={size.value} value={size.value}>{size.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setSelectedFormatting({ ...selectedFormatting, bold: !selectedFormatting.bold })}
              className={`p-2 rounded ${selectedFormatting.bold ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600'} hover:bg-violet-200 transition-colors`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setSelectedFormatting({ ...selectedFormatting, italic: !selectedFormatting.italic })}
              className={`p-2 rounded ${selectedFormatting.italic ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600'} hover:bg-violet-200 transition-colors`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setSelectedFormatting({ ...selectedFormatting, underline: !selectedFormatting.underline })}
              className={`p-2 rounded ${selectedFormatting.underline ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600'} hover:bg-violet-200 transition-colors`}
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Color:</label>
            <div className="flex gap-1">
              <button
                onClick={() => setSelectedFormatting({ ...selectedFormatting, color: '#000000' })}
                className={`w-6 h-6 rounded border-2 transition-all ${
                  selectedFormatting.color === '#000000'
                    ? 'bg-black border-blue-500' 
                    : 'bg-black border-gray-300 hover:border-gray-400'
                }`}
                title="Black"
              />
              <button
                onClick={() => setSelectedFormatting({ ...selectedFormatting, color: '#ffffff' })}
                className={`w-6 h-6 rounded border-2 transition-all ${
                  selectedFormatting.color === '#ffffff'
                    ? 'bg-white border-blue-500' 
                    : 'bg-white border-gray-300 hover:border-gray-400'
                }`}
                title="White"
              />
              <button
                onClick={() => setSelectedFormatting({ ...selectedFormatting, color: '#dc2626' })}
                className={`w-6 h-6 rounded border-2 transition-all ${
                  selectedFormatting.color === '#dc2626'
                    ? 'bg-red-600 border-blue-500' 
                    : 'bg-red-600 border-gray-300 hover:border-gray-400'
                }`}
                title="Red"
              />
              <button
                onClick={() => setSelectedFormatting({ ...selectedFormatting, color: '#6b7280' })}
                className={`w-6 h-6 rounded border-2 transition-all ${
                  selectedFormatting.color === '#6b7280'
                    ? 'bg-gray-500 border-blue-500' 
                    : 'bg-gray-500 border-gray-300 hover:border-gray-400'
                }`}
                title="Gray"
              />
              <button
                onClick={() => setSelectedFormatting({ ...selectedFormatting, color: undefined })}
                className={`px-2 py-1 text-xs rounded border transition-all ${
                  !selectedFormatting.color
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                }`}
                title="Default"
              >
                D
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-4">
        {activeTab === 'hardware' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Hardware Components</h3>
              <button
                onClick={() => addBulletPoint('hardware')}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:from-violet-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Hardware Item
              </button>
            </div>
            
            <div className="space-y-2">
              {hardwareComponents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <List className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No hardware components added yet.</p>
                  <p className="text-sm">Click "Add Hardware Item" to get started.</p>
                </div>
              ) : (
                hardwareComponents.map((item, index) => renderBulletPoint(item, index, 'hardware'))
              )}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Services Components</h3>
              <button
                onClick={() => addBulletPoint('services')}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:from-violet-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Service Item
              </button>
            </div>
            
            <div className="space-y-2">
              {servicesComponents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <List className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No services components added yet.</p>
                  <p className="text-sm">Click "Add Service Item" to get started.</p>
                </div>
              ) : (
                servicesComponents.map((item, index) => renderBulletPoint(item, index, 'services'))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 