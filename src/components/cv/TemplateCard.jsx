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
    <div className="flex flex-col">
      {/* Template Card Container */}
      <div
        className={`relative bg-white border-2 rounded-lg overflow-hidden transition-all duration-200 aspect-[1/1.414] ${
          isSelected
            ? 'border-black shadow-lg'
            : 'border-gray-200'
        }`}
        tabIndex={0}
      >
        {/* Template Preview - Render actual CVDocument in preview mode (thumbnail-optimized) */}
        <div className="w-full h-full bg-white overflow-hidden flex items-center justify-center">
          <div className="w-full h-full">
            <CVDocument
              data={sampleData}
              showWatermark={false}
              preview={true}
            />
          </div>
        </div>

        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute top-4 right-4 z-20">
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

      {/* Info Section (ALWAYS VISIBLE - not hidden on hover) */}
      <div className="mt-3 flex-grow flex flex-col">
        <div className="p-3 rounded-lg border border-gray-200 bg-white flex-grow flex flex-col">
          <div className="flex-grow">
            <h3 className="text-sm md:text-base font-semibold text-black mb-1">
              {template.name}
            </h3>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed line-clamp-2">
              {template.description}
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1 my-3">
            {template.features?.slice(0, 2).map((feature, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Select Button */}
          <Button
            onClick={handleSelect}
            className={`w-full mt-2 text-sm ${
              isSelected
                ? 'bg-black text-white hover:bg-gray-900'
                : 'bg-gray-900 text-white hover:bg-black'
            }`}
          >
            {isSelected ? '✓ Selected' : 'Select'}
          </Button>
        </div>
      </div>
    </div>
  );
}

