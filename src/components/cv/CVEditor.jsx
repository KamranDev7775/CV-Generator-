import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, ArrowRight } from "lucide-react";
import CVForm from './CVForm';
import CVPreview from './CVPreview';

export default function CVEditor({ 
  formData, 
  setFormData, 
  showPreview,
  setShowPreview,
  onGenerate, 
  onPayment,
  isGenerating,
  isProcessingPayment 
}) {
  const [showImportModal, setShowImportModal] = useState(false);

  if (showPreview) {
    return (
      <CVPreview 
        cvData={formData}
        onPayment={onPayment}
        onEdit={() => setShowPreview(false)}
        isProcessingPayment={isProcessingPayment}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Create your CV</h1>
              <p className="text-sm text-gray-600 mt-1">Fill in your details and see your CV update in real-time</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowImportModal(true)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import existing CV
            </Button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <CVForm 
          formData={formData}
          setFormData={setFormData}
          onSubmit={onGenerate}
          isGenerating={isGenerating}
        />
      </div>

      {/* Import Modal Placeholder */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Import CV</h3>
            <p className="text-gray-600 mb-6">
              Upload your existing CV (PDF or DOCX) and we'll automatically fill in your details.
            </p>
            <input 
              type="file" 
              accept=".pdf,.docx"
              className="mb-6 w-full"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  // TODO: Implement CV parsing logic
                  alert('CV import feature coming soon!');
                  setShowImportModal(false);
                }
              }}
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowImportModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button className="flex-1">
                Import
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}