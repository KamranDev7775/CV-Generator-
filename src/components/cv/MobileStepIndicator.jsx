import React from 'react';

const steps = [
  { id: 'templates', name: 'Template', icon: '📄' },
  { id: 'form', name: 'Details', icon: '✏️' },
  { id: 'preview', name: 'Preview', icon: '👁️' }
];

export default function MobileStepIndicator({ currentStep, onStepClick }) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200 px-4 py-3 sm:hidden">
      <div className="flex items-center justify-between max-w-sm mx-auto">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = index < currentStepIndex;
          const isClickable = index <= currentStepIndex;

          return (
            <button
              key={step.id}
              onClick={() => isClickable && onStepClick && onStepClick(step.id)}
              disabled={!isClickable}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-blue-100 text-blue-600 scale-110'
                  : isCompleted
                  ? 'text-green-600 hover:bg-green-50'
                  : 'text-gray-400'
              } ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                isActive
                  ? 'bg-blue-500 text-white shadow-lg'
                  : isCompleted
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200'
              }`}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.icon
                )}
              </div>
              <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>
                {step.name}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Progress Bar */}
      <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
        <div 
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-1 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}