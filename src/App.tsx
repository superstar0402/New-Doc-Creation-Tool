import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { WizardProgress } from './components/WizardProgress';
import { DocumentTypeSelector } from './components/DocumentTypeSelector';
import { ProjectInfoForm } from './components/ProjectInfoForm';
import { TextBlockSelector } from './components/TextBlockSelector';
import { DocumentPreview } from './components/DocumentPreview';
import { documentTypes, textBlocks as initialTextBlocks } from './data/mockData';
import { ProjectInfo, TextBlock, WizardStep } from './types';

const wizardSteps: WizardStep[] = [
  { id: 1, title: 'Document Type', description: 'Choose template', completed: false },
  { id: 2, title: 'Project Info', description: 'Enter details', completed: false },
  { id: 3, title: 'Content Blocks', description: 'Select content', completed: false },
  { id: 4, title: 'Preview & Export', description: 'Generate document', completed: false }
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    customerName: '',
    projectName: '',
    startDate: '',
    projectOverview: '',
    technicalOverview: '',
    pricingTable: '',
    hardwareComponents: '',
    servicesComponents: ''
  });
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>(initialTextBlocks);

  const selectedBlocks = textBlocks.filter(block => block.isSelected);

  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedDocumentType !== '';
      case 1:
        return projectInfo.customerName && projectInfo.projectName;
      case 2:
        return selectedBlocks.length > 0;
      default:
        return true;
    }
  };

  const handleExport = (format: string) => {
    // Simulate export functionality
    alert(`Exporting document as ${format.toUpperCase()}...`);
    console.log('Export data:', {
      documentType: selectedDocumentType,
      projectInfo,
      selectedBlocks,
      format
    });
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <DocumentTypeSelector
            documentTypes={documentTypes}
            selectedType={selectedDocumentType}
            onTypeSelect={setSelectedDocumentType}
          />
        );
      case 1:
        return (
          <ProjectInfoForm
            projectInfo={projectInfo}
            onInfoChange={setProjectInfo}
          />
        );
      case 2:
        return (
          <TextBlockSelector
            textBlocks={textBlocks}
            onBlocksChange={setTextBlocks}
          />
        );
      case 3:
        return (
          <DocumentPreview
            projectInfo={projectInfo}
            selectedBlocks={selectedBlocks}
            documentType={selectedDocumentType}
            onExport={handleExport}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Document Creation Tool
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Create professional proposals and statements of work with ease
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500 bg-white/60 px-4 py-2 rounded-full border border-gray-200">
                Step {currentStep + 1} of {wizardSteps.length}
              </div>
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep + 1) / wizardSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <WizardProgress steps={wizardSteps} currentStep={currentStep} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="min-h-[600px]">
          {renderCurrentStep()}
        </div>
      </main>

      {/* Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-white/20 px-4 py-6 sm:px-6 lg:px-8 sticky bottom-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`group flex items-center px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl border border-gray-200 hover:-translate-y-0.5'
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Previous
          </button>

          <div className="flex items-center space-x-2">
            {wizardSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep
                    ? 'bg-primary-500 shadow-lg'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentStep < wizardSteps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`group flex items-center px-8 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                canProceed()
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          ) : (
            <div className="flex items-center text-emerald-600 font-medium bg-emerald-50 px-6 py-3 rounded-xl border border-emerald-200">
              <Sparkles className="w-4 h-4 mr-2" />
              Ready to export!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;