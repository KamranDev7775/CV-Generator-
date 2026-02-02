import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { toast } from "sonner";

export const useCVImport = () => {
  const [importError, setImportError] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleImportCV = async (file, onSuccess) => {
    console.log('[CV Import] Starting import process', {
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size,
      timestamp: new Date().toISOString()
    });

    setImportError(null);
    setIsImporting(true);

    try {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
        console.error('[CV Import] Invalid file type:', file.type);
        const error = 'Invalid file type. Please upload a PDF, Word document, or text file.';
        setImportError(error);
        toast.error(error);
        setIsImporting(false);
        return { success: false, error };
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        console.error('[CV Import] File too large:', file.size);
        const error = 'File is too large. Please upload a file smaller than 10MB.';
        setImportError(error);
        toast.error(error);
        setIsImporting(false);
        return { success: false, error };
      }

      if (file.size === 0) {
        console.error('[CV Import] File is empty');
        const error = 'File is empty. Please upload a valid file.';
        setImportError(error);
        toast.error(error);
        setIsImporting(false);
        return { success: false, error };
      }

      console.log('[CV Import] File validation passed');
      toast.loading('Uploading and processing your CV...');

      console.log('[CV Import] Calling UploadFile API');
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      console.log('[CV Import] UploadFile success, file_url:', file_url);

      console.log('[CV Import] Calling ExtractDataFromUploadedFile API');
      const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            full_name: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            linkedin_url: { type: "string" },
            location: { type: "string" },
            target_position: { type: "string" },
            summary: { type: "string" },
            skills: { type: "string" },
            experiences: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  job_title: { type: "string" },
                  company: { type: "string" },
                  location: { type: "string" },
                  start_date: { type: "string" },
                  end_date: { type: "string" },
                  achievements: { type: "string" }
                }
              }
            },
            education: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  degree: { type: "string" },
                  university: { type: "string" },
                  location: { type: "string" },
                  start_date: { type: "string" },
                  end_date: { type: "string" }
                }
              }
            },
            languages: { type: "string" }
          }
        }
      });

      console.log('[CV Import] ExtractDataFromUploadedFile result:', result);

      if (result.status === 'error') {
        console.error('[CV Import] API returned error status');
        const error = 'Could not read this file. Please try another one.';
        setImportError(error);
        toast.error(error);
        setIsImporting(false);
        return { success: false, error };
      }

      const extractedData = result.output || {};
      console.log('[CV Import] Extracted data:', extractedData);

      const importData = {
        full_name: extractedData.full_name || '',
        target_position: extractedData.target_position || '',
        location: extractedData.location || '',
        email: extractedData.email || '',
        phone: extractedData.phone || '',
        linkedin_url: extractedData.linkedin_url || '',
        summary: extractedData.summary || '',
        auto_generate_summary: false,
        skills: extractedData.skills || '',
        experiences: (extractedData.experiences && extractedData.experiences.length > 0)
          ? extractedData.experiences
          : [{ job_title: '', company: '', location: '', start_date: '', end_date: '', achievements: '' }],
        education: (extractedData.education && extractedData.education.length > 0)
          ? extractedData.education
          : [{ degree: '', university: '', location: '', start_date: '', end_date: '' }],
        languages: extractedData.languages || '',
        languagesList: []
      };

      console.log('[CV Import] Import completed successfully');
      toast.success('CV imported successfully! Review and edit your information.');

      if (onSuccess) {
        onSuccess(importData);
      }

      setIsImporting(false);
      return { success: true, data: importData };

    } catch (error) {
      console.error('[CV Import] Import error:', error);
      const errorMessage = error.message || 'Could not read this file. Please try another one.';
      setImportError(errorMessage);
      toast.error(errorMessage);
      setIsImporting(false);
      return { success: false, error: errorMessage };
    }
  };

  return {
    handleImportCV,
    importError,
    isImporting,
    setImportError
  };
};

export default useCVImport;
