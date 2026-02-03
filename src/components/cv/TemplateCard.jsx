import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import CVDocument from './CVDocument';
import { getSampleDataForTemplate } from '@/utils/sampleData';

export default function TemplateCard({ template, onSelect, isSelected = false, onPreview }) {
  const [isHovered, setIsHovered] = useState(false);
  const sampleData = getSampleDataForTemplate(template.id);

  const handleSelect = () => {
    if (onSelect) {
      onSelect(template.id);
    }
  };

  const handlePreview = (e) => {
    e.stopPropagation();
    if (onPreview) {
      onPreview(template);
    }
  };

  return (
    <div className="flex flex-col group">
      {/* Template Card Container */}
      <div
        className={`relative bg-white border-2 rounded-lg overflow-hidden aspect-[1/1.414] cursor-pointer
          transition-all duration-300 ease-out
          ${isSelected ? 'border-black shadow-lg' : 'border-gray-200'}
          ${isHovered ? 'scale-[1.02] shadow-xl' : 'shadow-sm'}
        `}
        tabIndex={0}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleSelect}
      >
        {/* Template Preview - Static Image */}
        <div className="w-full h-full bg-white overflow-hidden flex items-center justify-center">
          {template.previewImageUrl ? (
            <img 
              src={template.previewImageUrl} 
              alt={template.name}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full">
              <CVDocument
                data={sampleData}
                showWatermark={false}
                preview={true}
              />
            </div>
          )}
        </div>

        {/* Hover Overlay with Actions */}
        <div 
          className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-end pb-8
            transition-all duration-300 ease-out
            ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
        >
          {/* Preview Button - Top Right */}
          {onPreview && (
            <button
              onClick={handlePreview}
              className={`absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg
                transition-all duration-300 ease-out hover:bg-gray-100 hover:scale-110
                ${isHovered ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
              `}
              title="Preview full size"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          )}

          {/* Select This Template Button - Bottom Center */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleSelect();
            }}
            className={`
              bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg
              transition-all duration-300 ease-out transform
              ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
              ${isSelected ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
            `}
          >
            {isSelected ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                Selected
              </span>
            ) : (
              'Select This Template'
            )}
          </Button>
        </div>

        {/* Selected Indicator (always visible when selected) */}
        {isSelected && (
          <div className="absolute top-4 right-4 z-10">
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

      {/* Info Section (ALWAYS VISIBLE) */}
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
        </div>
      </div>
    </div>
  );
}
