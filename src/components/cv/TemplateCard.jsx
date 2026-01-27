import React from 'react';
import { Button } from "@/components/ui/button";
import CVDocument from './CVDocument';
import { getSampleDataForTemplate } from '@/utils/sampleData';

export default function TemplateCard({ template, onSelect, isSelected = false }) {
  const sampleData = getSampleDataForTemplate(template.id);

  const handleSelect = () => {
    if (onSelect) {
      onSelect(template.id);
    }
  };

  return (
    <div 
      className={`group relative bg-white border-2 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
        isSelected 
          ? 'border-black shadow-lg' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Template Preview */}
      <div className="relative bg-gray-50 p-2 md:p-4 h-[300px] md:h-[400px] overflow-hidden">
        <div className="transform scale-[0.6] md:scale-75 origin-top-left w-[167%] md:w-[133%] h-[167%] md:h-[133%] pointer-events-none">
          <CVDocument 
            data={sampleData} 
            showWatermark={false}
          />
        </div>
        {/* Overlay gradient for better card appearance */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Template Info */}
      <div className="p-4 md:p-6 border-t border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-base md:text-lg font-semibold text-black mb-1">
              {template.name}
            </h3>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              {template.description}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {template.features?.slice(0, 3).map((feature, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Select Button */}
        <Button
          onClick={handleSelect}
          className={`w-full ${
            isSelected
              ? 'bg-black text-white hover:bg-gray-900'
              : 'bg-gray-900 text-white hover:bg-black'
          }`}
        >
          {isSelected ? 'Selected' : 'Select Template'}
        </Button>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

