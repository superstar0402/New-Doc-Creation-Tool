import React from 'react';
import { Check } from 'lucide-react';
import { WizardStep } from '../types';

interface WizardProgressProps {
  steps: WizardStep[];
  currentStep: number;
}

export const WizardProgress: React.FC<WizardProgressProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-6 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <li key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                    ${index < currentStep 
                      ? 'bg-primary-600 border-primary-600 text-white' 
                      : index === currentStep
                        ? 'border-primary-600 bg-white text-primary-600'
                        : 'border-gray-300 bg-white text-gray-500'
                    }
                  `}>
                    {index < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="ml-4 min-w-0 flex flex-col">
                    <span className={`text-sm font-medium ${
                      index <= currentStep ? 'text-primary-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                    <span className="text-xs text-gray-500">{step.description}</span>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 ml-8 ${
                    index < currentStep ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};