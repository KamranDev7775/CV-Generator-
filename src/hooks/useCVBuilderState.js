import { useState, useEffect, useCallback } from 'react';
import { setSecureStorage, getSecureStorage, removeSecureStorage } from '@/utils/storage';
import { getTemplateById, templateExists } from '@/config/templates';
import { calculateFormProgress } from '@/utils/progressCalculator';

const STORAGE_KEY_FORM = 'form_data';
const STORAGE_KEY_TEMPLATE = 'selected_template';
const STORAGE_KEY_SUBMISSION = 'submission_id';

const DEFAULT_FORM_DATA = {
  full_name: '',
  target_position: '',
  location: '',
  email: '',
  phone: '',
  linkedin_url: '',
  summary: '',
  auto_generate_summary: false,
  skills: '',
  experiences: [{ job_title: '', company: '', location: '', start_date: '', end_date: '', achievements: '' }],
  education: [{ degree: '', university: '', location: '', start_date: '', end_date: '' }],
  languages: '',
  languagesList: [],
  target_country: 'Germany',
  seniority_level: 'Mid',
  job_description: '',
  template: 'classic',
  style: 'professional'
};

/**
 * Custom hook for CV builder state management
 * Handles form data, template selection, and progress tracking
 */
export function useCVBuilderState(initialTemplate = null) {
  // Load initial state from storage or use defaults
  const [formData, setFormDataState] = useState(() => {
    const saved = getSecureStorage(STORAGE_KEY_FORM);
    const savedTemplate = getSecureStorage(STORAGE_KEY_TEMPLATE);
    const template = initialTemplate || savedTemplate || 'classic';
    const validTemplate = templateExists(template) ? template : 'classic';
    
    if (saved) {
      return {
        ...DEFAULT_FORM_DATA,
        ...saved,
        template: validTemplate
      };
    }
    
    return {
      ...DEFAULT_FORM_DATA,
      template: validTemplate
    };
  });

  const [selectedTemplate, setSelectedTemplateState] = useState(() => {
    const savedTemplate = getSecureStorage(STORAGE_KEY_TEMPLATE);
    const template = initialTemplate || savedTemplate || 'classic';
    return templateExists(template) ? template : 'classic';
  });

  const [submissionId, setSubmissionIdState] = useState(() => {
    return getSecureStorage(STORAGE_KEY_SUBMISSION) || null;
  });

  // Calculate progress
  const progress = calculateFormProgress(formData);

  // Update form data and persist to storage
  const updateFormData = useCallback((updates) => {
    setFormDataState(prev => {
      const newData = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates };
      // Persist to storage
      setSecureStorage(STORAGE_KEY_FORM, newData);
      return newData;
    });
  }, []);

  // Select template and update form data
  const selectTemplate = useCallback((templateId) => {
    if (!templateExists(templateId)) {
      console.warn(`Template ${templateId} does not exist, using classic`);
      templateId = 'classic';
    }
    
    setSelectedTemplateState(templateId);
    setSecureStorage(STORAGE_KEY_TEMPLATE, templateId);
    
    // Update template in form data
    updateFormData({ template: templateId });
  }, [updateFormData]);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    const template = selectedTemplate || 'classic';
    const newData = {
      ...DEFAULT_FORM_DATA,
      template
    };
    setFormDataState(newData);
    setSecureStorage(STORAGE_KEY_FORM, newData);
  }, [selectedTemplate]);

  // Load saved state from storage
  const loadSavedState = useCallback(() => {
    const saved = getSecureStorage(STORAGE_KEY_FORM);
    const savedTemplate = getSecureStorage(STORAGE_KEY_TEMPLATE);
    
    if (saved) {
      const template = savedTemplate || saved.template || 'classic';
      const validTemplate = templateExists(template) ? template : 'classic';
      
      setFormDataState({
        ...DEFAULT_FORM_DATA,
        ...saved,
        template: validTemplate
      });
      
      if (savedTemplate) {
        setSelectedTemplateState(validTemplate);
      }
    }
  }, []);

  // Clear all saved state (e.g., after successful payment)
  const clearSavedState = useCallback(() => {
    removeSecureStorage(STORAGE_KEY_FORM);
    removeSecureStorage(STORAGE_KEY_TEMPLATE);
    removeSecureStorage(STORAGE_KEY_SUBMISSION);
    setFormDataState({
      ...DEFAULT_FORM_DATA,
      template: selectedTemplate || 'classic'
    });
    setSubmissionIdState(null);
  }, [selectedTemplate]);

  // Set submission ID
  const setSubmissionId = useCallback((id) => {
    setSubmissionIdState(id);
    if (id) {
      setSecureStorage(STORAGE_KEY_SUBMISSION, id);
    } else {
      removeSecureStorage(STORAGE_KEY_SUBMISSION);
    }
  }, []);

  // Sync formData.template with selectedTemplate
  useEffect(() => {
    if (formData.template !== selectedTemplate) {
      setFormDataState(prev => ({
        ...prev,
        template: selectedTemplate
      }));
    }
  }, [selectedTemplate, formData.template]);

  // Auto-save form data on changes
  useEffect(() => {
    if (formData) {
      setSecureStorage(STORAGE_KEY_FORM, formData);
    }
  }, [formData]);

  return {
    formData,
    selectedTemplate,
    submissionId,
    progress,
    updateFormData,
    selectTemplate,
    resetForm,
    loadSavedState,
    clearSavedState,
    setSubmissionId
  };
}

export default useCVBuilderState;

