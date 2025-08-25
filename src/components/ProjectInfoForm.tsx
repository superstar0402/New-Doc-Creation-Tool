import React, { useState, useEffect, useRef } from 'react';
import { Upload, Calendar, User, Briefcase, Building, MapPin, Phone, Mail, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProjectInfo, PricingItem, FormattedContent } from '../types';
import { PricingComponents } from './PricingComponents';

// Utility function to format date consistently in MM/DD/YYYY format
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${month}/${day}/${year}`;
};

// Utility function to convert MM/DD/YYYY to YYYY-MM-DD for storage
const parseDateInput = (inputValue: string): string => {
  if (!inputValue) return '';
  
  // Remove any non-numeric characters except slashes
  const cleaned = inputValue.replace(/[^\d/]/g, '');
  
  // Check if it matches MM/DD/YYYY pattern
  const datePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const match = cleaned.match(datePattern);
  
  if (match) {
    const [, month, day, year] = match;
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    const yearNum = parseInt(year, 10);
    
    // Basic validation
    if (monthNum < 1 || monthNum > 12) return '';
    if (dayNum < 1 || dayNum > 31) return '';
    if (yearNum < 1900 || yearNum > 2100) return '';
    
    // Validate date using Date object
    const date = new Date(yearNum, monthNum - 1, dayNum);
    if (date.getFullYear() === yearNum && 
        date.getMonth() === monthNum - 1 && 
        date.getDate() === dayNum) {
      return `${yearNum}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }
  
  return '';
};

// Utility function to convert YYYY-MM-DD to MM/DD/YYYY for display
const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${month}/${day}/${year}`;
};

// Utility function to validate MM/DD/YYYY format
const isValidDate = (dateString: string): boolean => {
  if (!dateString) return false;
  
  const datePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const match = dateString.match(datePattern);
  
  if (!match) return false;
  
  const [, month, day, year] = match;
  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);
  const yearNum = parseInt(year, 10);
  
  // Basic validation
  if (monthNum < 1 || monthNum > 12) return false;
  if (dayNum < 1 || dayNum > 31) return false;
  if (yearNum < 1900 || yearNum > 2100) return false;
  
  // Validate date using Date object
  const date = new Date(yearNum, monthNum - 1, dayNum);
  return date.getFullYear() === yearNum && 
         date.getMonth() === monthNum - 1 && 
         date.getDate() === dayNum;
};

// Calendar component
const CalendarPicker: React.FC<{
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
}> = ({ selectedDate, onDateSelect, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateSelect(selectedDate);
    onClose();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const isSelected = selectedDate && 
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
    
    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        className={`w-8 h-8 rounded-full text-sm font-medium transition-colors duration-200 hover:bg-primary-100 ${
          isSelected 
            ? 'bg-primary-500 text-white hover:bg-primary-600' 
            : 'text-gray-700 hover:text-primary-700'
        }`}
      >
        {day}
      </button>
    );
  }

  return (
    <div 
      ref={calendarRef}
      className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4 min-w-[280px]"
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="text-lg font-semibold text-gray-800">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  );
};

interface ProjectInfoFormProps {
  projectInfo: ProjectInfo;
  onInfoChange: (info: ProjectInfo) => void;
}

export const ProjectInfoForm: React.FC<ProjectInfoFormProps> = ({
  projectInfo,
  onInfoChange
}) => {
  const [dateInputValue, setDateInputValue] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Update date input display when projectInfo.startDate changes
  useEffect(() => {
    setDateInputValue(formatDateForDisplay(projectInfo.startDate));
    if (projectInfo.startDate) {
      setSelectedDate(new Date(projectInfo.startDate));
    }
  }, [projectInfo.startDate]);

  const handleInputChange = (field: keyof ProjectInfo, value: string | FormattedContent[]) => {
    onInfoChange({
      ...projectInfo,
      [field]: value
    });
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDateInputValue(inputValue);
    
    // Allow empty input
    if (!inputValue) {
      handleInputChange('startDate', '');
      setSelectedDate(null);
      return;
    }
    
    // Remove any non-numeric characters except slashes
    const cleaned = inputValue.replace(/[^\d/]/g, '');
    
    // Auto-format as user types
    let formatted = cleaned;
    if (cleaned.length >= 2 && !cleaned.includes('/')) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (formatted.length >= 5 && formatted.split('/').length === 2) {
      formatted = formatted.slice(0, 5) + '/' + formatted.slice(5);
    }
    
    // Limit to MM/DD/YYYY format
    if (formatted.length > 10) {
      formatted = formatted.slice(0, 10);
    }
    
    // Update the input display
    setDateInputValue(formatted);
    
    // Parse and store the date if valid
    if (isValidDate(formatted)) {
      const parsedDate = parseDateInput(formatted);
      handleInputChange('startDate', parsedDate);
      setSelectedDate(new Date(parsedDate));
    }
  };

  const handleCalendarDateSelect = (date: Date) => {
    const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
    setDateInputValue(formattedDate);
    const parsedDate = parseDateInput(formattedDate);
    handleInputChange('startDate', parsedDate);
    setSelectedDate(date);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
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
                  {projectInfo.customerLogo ? (
                    <div className="relative">
                      <div className="w-full h-40 border-2 border-gray-300 rounded-xl overflow-hidden bg-white">
                        <img
                          src={URL.createObjectURL(projectInfo.customerLogo)}
                          alt="Customer Logo"
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => onInfoChange({ ...projectInfo, customerLogo: undefined })}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                        title="Remove logo"
                      >
                        <span className="text-sm font-bold">×</span>
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 hover:from-primary-50 hover:to-primary-100 hover:border-primary-300 transition-all duration-300 group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm text-gray-600 font-medium">Click to upload logo</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
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
                      type="text"
                      value={dateInputValue}
                      onChange={handleDateInputChange}
                      onFocus={toggleDatePicker}
                      className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-gray-50 focus:bg-white ${
                        dateInputValue && !isValidDate(dateInputValue) ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                      }`}
                      placeholder="MM/DD/YYYY"
                      maxLength={10}
                    />
                    <button
                      type="button"
                      onClick={toggleDatePicker}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors duration-200"
                    >
                      <Calendar className="w-5 h-5" />
                    </button>
                    {showDatePicker && (
                      <CalendarPicker
                        selectedDate={selectedDate}
                        onDateSelect={handleCalendarDateSelect}
                        onClose={() => setShowDatePicker(false)}
                      />
                    )}
                  </div>
                  {/* <p className="mt-1 text-xs text-gray-500">
                    Format: MM/DD/YYYY (e.g., 12/25/2024) - Type manually or click calendar icon
                  </p> */}
                  {dateInputValue && !isValidDate(dateInputValue) && (
                    <p className="mt-1 text-xs text-red-500">
                      Please enter a valid date in MM/DD/YYYY format
                    </p>
                  )}
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
                  style={{ textAlign: 'left' }}
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
                  style={{ textAlign: 'left' }}
                />
              </div>

              {/* Header/Footer Options */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Header</label>
                  <textarea
                    value={projectInfo.headerText}
                    onChange={(e) => handleInputChange('headerText', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                    placeholder="e.g., Company Name | Customer | Project Title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Footer</label>
                  <textarea
                    value={projectInfo.footerText}
                    onChange={(e) => handleInputChange('footerText', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                    placeholder="e.g., Company Name | Confidential"
                  />
                </div>
              </div> */}
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
          <PricingComponents
            hardwareComponents={projectInfo.hardwareComponents}
            servicesComponents={projectInfo.servicesComponents}
            onHardwareComponentsChange={(components) => handleInputChange('hardwareComponents', components)}
            onServicesComponentsChange={(components) => handleInputChange('servicesComponents', components)}
          />

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