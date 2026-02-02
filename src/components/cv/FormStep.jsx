import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import CVFormWithPreview from './CVFormWithPreview';

export default function FormStep({ 
  formData, 
  setFormData, 
  onSubmit, 
  isGenerating, 
  user, 
  remainingAIRequests, 
  selectedTemplate,
  onImport,
  onBackToTemplates
}) {
  return (
    <div className="bg-white min-h-screen">
      <div className="px-4 md:px-6 lg:px-8 py-4 border-b border-gray-200">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onBackToTemplates}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to templates
        </Button>
      </div>
      
      <CVFormWithPreview 
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isGenerating={isGenerating}
        user={user}
        remainingAIRequests={remainingAIRequests}
        selectedTemplate={selectedTemplate}
        onImport={onImport}
      />
    </div>
  );
}
