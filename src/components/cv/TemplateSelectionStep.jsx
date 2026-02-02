import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import TemplateCard from './TemplateCard';
import { getAllTemplates, getTemplatesByCategory, getAllCategories } from '@/config/templates';

export default function TemplateSelectionStep({ 
  onTemplateSelect, 
  onBackToHome, 
  selectedCategory, 
  onCategoryChange, 
  selectedTemplateId,
  importError
}) {
  const allTemplates = useMemo(() => {
    return getAllTemplates();
  }, []);

  const categories = useMemo(() => {
    return ['All Templates', ...getAllCategories()];
  }, []);

  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'All Templates') {
      return allTemplates;
    }
    return getTemplatesByCategory(selectedCategory);
  }, [selectedCategory, allTemplates]);

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="w-full px-4 md:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="icon"
            onClick={onBackToHome}
            className="rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-3xl md:text-4xl font-bold text-black">Choose your CV template</h2>
        </div>

        <p className="text-lg text-gray-600 mb-8">
          Select a professional template that matches your style
        </p>

        {importError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {importError}
          </div>
        )}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplateId === template.id}
              onSelect={() => onTemplateSelect(template.id)}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No templates found in this category</p>
          </div>
        )}
      </div>
    </section>
  );
}
