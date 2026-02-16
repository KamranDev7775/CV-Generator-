import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllTemplates, getTemplateById } from '@/config/templates';

export default function TemplateSwitcher({ selectedTemplate, onTemplateChange, className = '' }) {
  const templates = getAllTemplates();
  const currentTemplate = getTemplateById(selectedTemplate);

  const handleTemplateChange = (newTemplateId) => {
    if (onTemplateChange && newTemplateId !== selectedTemplate) {
      onTemplateChange(newTemplateId);
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        CV Template
      </label>
      <Select
        value={selectedTemplate || 'minimal'}
        onValueChange={handleTemplateChange}
      >
        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
          <SelectValue>
            {currentTemplate ? currentTemplate.name : 'Minimal'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              <div className="flex flex-col">
                <span className="font-medium">{template.name}</span>
                <span className="text-xs text-gray-500">{template.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {currentTemplate && (
        <p className="text-xs text-gray-500 mt-1">
          {currentTemplate.description}
        </p>
      )}
    </div>
  );
}

