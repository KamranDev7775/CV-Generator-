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
    <div className="group relative w-full max-w-sm mx-auto">
      {/* Template Card Container */}
      <div
        className={`relative bg-white rounded-3xl overflow-hidden aspect-[3/4] cursor-pointer
          transition-all duration-700 ease-out transform-gpu
          ${isSelected 
            ? 'ring-4 ring-blue-500 ring-opacity-60 shadow-2xl scale-[1.02] bg-gradient-to-br from-blue-50 to-white' 
            : 'shadow-xl hover:shadow-2xl border border-gray-100'
          }
          ${isHovered ? 'scale-[1.05] -translate-y-3 shadow-3xl' : ''}
          before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/30 before:via-black/5 before:to-transparent before:opacity-0 before:transition-all before:duration-500
          ${isHovered ? 'before:opacity-100' : ''}
        `}
        tabIndex={0}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleSelect}
        role="button"
        aria-label={`Select ${template.name} template`}
      >
        {/* Template Preview */}
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex items-center justify-center relative">
          {template.previewImageUrl ? (
            <img 
              src={template.previewImageUrl} 
              alt={`${template.name} template preview`}
              className={`w-full h-full object-cover object-top transition-all duration-700 ease-out
                ${isHovered ? 'scale-110 brightness-110' : 'scale-100'}
              `}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full transform scale-75">
              <CVDocument
                data={sampleData}
                showWatermark={false}
                preview={true}
              />
            </div>
          )}
          
          {/* Shimmer Effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
            transition-all duration-1000 ease-out transform
            ${isHovered ? 'translate-x-full' : '-translate-x-full'}
          `} style={{ width: '200%', left: '-100%' }} />
        </div>

        {/* Hover Actions */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center z-20
          transition-all duration-500 ease-out
          ${isHovered ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 pointer-events-none'}
        `}>
          {/* Select Button */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleSelect();
            }}
            className={`
              font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full shadow-2xl backdrop-blur-md
              transition-all duration-500 ease-out transform text-sm sm:text-base
              ${isHovered ? 'translate-y-0 scale-100' : 'translate-y-6 scale-90'}
              ${isSelected 
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-2 border-green-400 shadow-green-500/25' 
                : 'bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-white text-gray-900 border-2 border-white/80 hover:border-blue-200'
              }
            `}
          >
            {isSelected ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="hidden sm:inline">Selected</span>
                <span className="sm:hidden">✓</span>
              </span>
            ) : (
              <span>
                <span className="hidden sm:inline">Use This Template</span>
                <span className="sm:hidden">Select</span>
              </span>
            )}
          </Button>
        </div>

        {/* Selected Badge */}
        {isSelected && (
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-30">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-bounce-in">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20">
          <span className="px-2 sm:px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/20">
            {template.category}
          </span>
        </div>

        {/* Premium Badge (if applicable) */}
        {template.isPremium && (
          <div className="absolute top-3 sm:top-4 left-1/2 transform -translate-x-1/2 z-20">
            <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
              ⭐ Premium
            </span>
          </div>
        )}
      </div>

      {/* Template Info */}
      <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 px-2">
        <div className="text-center">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 capitalize mb-1 sm:mb-2">
            {template.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed px-1 sm:px-2 line-clamp-2">
            {template.description}
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
          {template.features?.slice(0, 3).map((feature, idx) => (
            <span
              key={idx}
              className="text-xs px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full border border-blue-200 font-medium transition-all duration-300 hover:from-blue-100 hover:to-indigo-100 hover:scale-105"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Ideal For */}
        {template.idealFor && template.idealFor.length > 0 && (
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Perfect for:</p>
            <p className="text-xs font-medium text-gray-700 line-clamp-1">
              {template.idealFor.slice(0, 2).join(', ')}
            </p>
          </div>
        )}

        {/* Rating/Popularity (if available) */}
        {template.rating && (
          <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(template.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-1">({template.rating})</span>
          </div>
        )}
      </div>
    </div>
  );
}
