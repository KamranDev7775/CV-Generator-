import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { setSecureStorage, getSecureStorage, removeSecureStorage } from '../utils/storage';
import { toast } from "sonner";
import { getAllTemplates, getTemplatesByCategory, getAllCategories, templateExists } from '@/config/templates';
import { canMakeAIRequest, recordAIRequest, getRemainingRequests } from '../utils/rateLimiter';
import TemplateCard from '@/components/cv/TemplateCard';
import CVFormWithPreview from '@/components/cv/CVFormWithPreview';
import PreviewSection from '@/components/cv/PreviewSection';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

const STORAGE_KEY = 'form_data';
const SUBMISSION_KEY = 'submission_id';
const STORAGE_KEY_TEMPLATE = 'selected_template';

export default function CVBuilder() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const urlParams = new URLSearchParams(location.search);
  const step = urlParams.get('step') || 'templates';
  
  const updateStep = (newStep, template = null) => {
    const params = new URLSearchParams();
    params.set('step', newStep);
    if (template) {
      params.set('template', template);
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };
  
  const [selectedCategory, setSelectedCategory] = useState('All Templates');
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
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
    style: 'professional',
    photo: null
  });
  const [generatedCV, setGeneratedCV] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [importError, setImportError] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [remainingAIRequests, setRemainingAIRequests] = useState(null);
  const [authCheckAttempts, setAuthCheckAttempts] = useState(0);
  const lastAuthCheckRef = useRef(0);

  useEffect(() => {
    console.log('[CV Builder] Mount effect running');
    loadUser();
    
    // Check for imported CV data from Home.jsx
    const importParam = urlParams.get('import');
    const importDataStr = sessionStorage.getItem('cv_import_data');
    
    console.log('[CV Builder] Import check:', {
      importParam: importParam,
      hasImportData: !!importDataStr
    });
    
    if (importParam === 'success' && importDataStr) {
      console.log('[CV Builder] Processing imported CV data');
      try {
        const importData = JSON.parse(importDataStr);
        
        setFormData(prev => ({
          ...prev,
          ...importData,
          template: prev.template || 'classic'
        }));
        
        setSecureStorage(STORAGE_KEY, {
          ...formData,
          ...importData
        });
        
        console.log('[CV Builder] Import data merged into form');
        sessionStorage.removeItem('cv_import_data');
      } catch (error) {
        console.error('[CV Builder] Error processing import data:', error);
      }
    }
    
    const templateParam = urlParams.get('template');
    const savedTemplate = getSecureStorage(STORAGE_KEY_TEMPLATE);
    const templateId = templateParam || savedTemplate || 'classic';
    const validTemplate = templateExists(templateId) ? templateId : 'classic';
    
    console.log('[CV Builder] Template selection:', {
      templateParam,
      savedTemplate,
      selected: validTemplate
    });
    
    setSelectedTemplateId(validTemplate);
    
    const saved = getSecureStorage(STORAGE_KEY);
    if (saved) {
      try {
        console.log('[CV Builder] Loading saved form data from storage');
        setFormData(prev => ({
          ...saved,
          template: validTemplate
        }));
      } catch (e) {
        console.log('[CV Builder] Could not parse saved data');
      }
    } else {
      console.log('[CV Builder] No saved form data found');
      setFormData(prev => ({
        ...prev,
        template: validTemplate
      }));
    }
    
    if (validTemplate !== 'classic') {
      setSecureStorage(STORAGE_KEY_TEMPLATE, validTemplate);
    }
    
    setRemainingAIRequests(getRemainingRequests());
    console.log('[CV Builder] Mount effect completed');
  }, []);

  useEffect(() => {
    const generateCsrfToken = () => {
      if (crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    };
    
    const token = generateCsrfToken();
    setCsrfToken(token);
    sessionStorage.setItem('csrf_token', token);
  }, []);

  const loadUser = async () => {
    const now = Date.now();
    const timeSinceLastCheck = now - lastAuthCheckRef.current;
    const minInterval = 5000;
    
    if (timeSinceLastCheck < minInterval && authCheckAttempts > 0) {
      return;
    }
    
    if (authCheckAttempts >= 3) {
      const backoffTime = Math.min(30000 * Math.pow(2, authCheckAttempts - 3), 300000);
      if (timeSinceLastCheck < backoffTime) {
        return;
      }
    }
    
    lastAuthCheckRef.current = now;
    
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setAuthCheckAttempts(0);
    } catch (error) {
      setAuthCheckAttempts(prev => prev + 1);
      setUser(null);
    }
  };

  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'All Templates') {
      return getAllTemplates();
    }
    return getTemplatesByCategory(selectedCategory);
  }, [selectedCategory]);

  const categories = useMemo(() => {
    return ['All Templates', ...getAllCategories()];
  }, []);

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplateId(templateId);
    setSecureStorage(STORAGE_KEY_TEMPLATE, templateId);
    updateStep('form', templateId);
  };

  const handleBackToHome = () => {
    navigate(createPageUrl('Home'));
  };

  const sanitizeString = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str
      .replace(/\0/g, '')
      .replace(/[\x00-\x1F\x7F]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 10000);
  };

  const sanitizeArray = (arr, maxItems = 10) => {
    if (!Array.isArray(arr)) return [];
    return arr.slice(0, maxItems).map(item => {
      if (typeof item !== 'object' || item === null) return {};
      const sanitized = {};
      Object.keys(item).forEach(key => {
        if (typeof item[key] === 'string') {
          sanitized[key] = sanitizeString(item[key]);
        } else {
          sanitized[key] = item[key];
        }
      });
      return sanitized;
    });
  };

  const handleImportCV = async (file) => {
    console.log('[CV Builder] handleImportCV called', {
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size,
      timestamp: new Date().toISOString()
    });
    
    setImportError(null);
    
    try {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      console.log('[CV Builder] Validating file type:', file.type);
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
        console.error('[CV Builder] Invalid file type:', file.type);
        setImportError('Invalid file type. Please upload a PDF, Word document, or text file.');
        toast.error('Invalid file type. Please upload a PDF, Word document, or text file.');
        return;
      }
      
      const maxSize = 10 * 1024 * 1024;
      console.log('[CV Builder] Validating file size:', file.size, 'max:', maxSize);
      if (file.size > maxSize) {
        console.error('[CV Builder] File too large:', file.size);
        setImportError('File is too large. Please upload a file smaller than 10MB.');
        toast.error('File is too large. Please upload a file smaller than 10MB.');
        return;
      }
      
      if (file.size === 0) {
        console.error('[CV Builder] File is empty');
        setImportError('File is empty. Please upload a valid file.');
        toast.error('File is empty. Please upload a valid file.');
        return;
      }
      
      console.log('[CV Builder] File validation passed, showing loading toast');
      toast.loading('Uploading and processing your CV...');
      
      // Upload the file to base44
      console.log('[CV Builder] Calling UploadFile API');
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      console.log('[CV Builder] UploadFile success, file_url:', file_url);
      
      // Extract data from the uploaded CV
      console.log('[CV Builder] Calling ExtractDataFromUploadedFile API');
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

      console.log('[CV Builder] ExtractDataFromUploadedFile result:', result);

      if (result.status === 'error') {
        console.error('[CV Builder] API returned error status');
        setImportError('Could not read this file. Please try another one.');
        toast.error('Could not read this file. Please try another one.');
        return;
      }

      // Merge extracted data with default form structure
      const extractedData = result.output || {};
      console.log('[CV Builder] Extracted data:', extractedData);
      
      const newFormData = {
        ...formData,
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
        languagesList: [],
        target_country: formData.target_country || 'Germany',
        seniority_level: formData.seniority_level || 'Mid',
        job_description: '',
        template: formData.template || 'classic'
      };

      console.log('[CV Builder] Setting form data');
      setFormData(newFormData);
      setSecureStorage(STORAGE_KEY, newFormData);
      updateStep('form', newFormData.template);
      
      console.log('[CV Builder] Import completed successfully');
      toast.success('CV imported successfully! Review and edit your information.');
      
    } catch (error) {
      console.error('[CV Builder] Import error:', error);
      const errorMessage = error.message || 'Could not read this file. Please try another one.';
      setImportError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const generateCV = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    
    try {
      let summary = formData.summary;
      
      const needsAI = formData.auto_generate_summary;
      if (!user && needsAI) {
        const rateLimitCheck = canMakeAIRequest();
        if (!rateLimitCheck.allowed) {
          toast.error(rateLimitCheck.message || 'Rate limit exceeded. Please log in for unlimited AI generation.');
          setIsGenerating(false);
          setRemainingAIRequests(getRemainingRequests());
          return;
        }
      }
      
      if (formData.auto_generate_summary) {
        try {
          const experienceText = formData.experiences
            .filter(e => e.job_title || e.company)
            .map(e => `${e.job_title} at ${e.company}: ${e.achievements || 'No details provided'}`)
            .join('\n');
          
          const educationText = formData.education
            .filter(e => e.degree || e.university)
            .map(e => `${e.degree} from ${e.university}`)
            .join(', ');
          
          const prompt = `You are an expert CV writer specializing in top consulting firms, tech companies, and Fortune 500 applications.

Generate a compelling professional summary (4-6 sentences, ~100 words) that will impress recruiters and pass ATS systems.

CANDIDATE INFORMATION:
Name: ${formData.full_name}
Target Position: ${formData.target_position || 'Professional role'}
Target Country: ${formData.target_country}
Seniority Level: ${formData.seniority_level}
Core Skills: ${formData.skills || 'General business skills'}
Education: ${educationText || 'Not specified'}

PROFESSIONAL EXPERIENCE:
${experienceText || 'Entry-level professional'}

${formData.job_description ? `TARGET JOB DESCRIPTION:\n${formData.job_description}` : ''}

REQUIREMENTS:
- Write in third person (no "I", "my", etc.)
- Start with years of experience or key expertise area
- Highlight 2-3 quantifiable achievements or key strengths
- Include relevant industry keywords for ATS
- Match tone to target role and seniority
- Make it compelling and confident
- Focus on value proposition and impact
- Use active, powerful verbs
- Keep it concise but impactful
- Tailor to consulting, tech, and corporate roles in Europe

Generate a professional summary that will make recruiters want to interview this candidate.`;
          
          const result = await base44.integrations.Core.InvokeLLM({
            prompt,
            response_json_schema: {
              type: "object",
              properties: {
                summary: { type: "string" }
              }
            }
          });
          
          summary = (result && typeof result === 'object' && 'summary' in result && typeof result.summary === 'string') 
            ? result.summary 
            : summary;
          
          if (!user) {
            recordAIRequest();
            setRemainingAIRequests(getRemainingRequests());
          }
        } catch (aiError) {
          console.error('AI summary generation failed:', aiError);
          toast.error('AI summary generation failed. Using your original summary instead.');
        }
      }

      const cvData = { ...formData, summary, generated_cv: summary };
      
      if (user) {
        try {
          const submission = await base44.entities.CVSubmission.create({
            ...cvData,
            payment_status: 'pending'
          });
          setSecureStorage(SUBMISSION_KEY, submission.id);
        } catch (error) {
          console.error('Error saving to database:', error);
        }
      }
      
      setFormData(cvData);
      setGeneratedCV(cvData);
      updateStep('preview');
      
    } catch (error) {
      console.error('Error generating CV:', error);
      if (error.message?.includes('auth') || error.message?.includes('login')) {
        await base44.auth.redirectToLogin(window.location.href);
      } else {
        setGeneratedCV(formData);
        updateStep('preview');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePayment = async () => {
    if (isProcessingPayment) return;
    setIsProcessingPayment(true);

    if (window.self !== window.top) {
      setIsProcessingPayment(false);
      alert('Payment checkout is only available in the published app. Please open the app in a new tab to complete your purchase.');
      return;
    }

    if (!user) {
      setIsProcessingPayment(false);
      await base44.auth.redirectToLogin(window.location.href);
      return;
    }
    
    try {
      const submissionId = getSecureStorage(SUBMISSION_KEY);
      
      if (!submissionId) {
        setIsProcessingPayment(false);
        toast.error('Please generate your CV first');
        return;
      }
      
      const response = await base44.functions.invoke('createCheckout', {
        submissionId,
        customerEmail: formData.email || user?.email,
        successUrl: `${window.location.origin}${createPageUrl('PaymentSuccess')}?type=cv&submission_id=${submissionId}`,
        cancelUrl: window.location.href,
        csrfToken: csrfToken
      });
      
      window.location.href = response.data.url;
      
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessingPayment(false);
      const errorMessage = error.message || 'Payment failed. Please try again or use a different payment method.';
      toast.error(errorMessage);
    }
  };

  if (step === 'templates') {
    return (
      <div className="min-h-screen bg-white">
        <div className="border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-6">
            <div className="flex items-center justify-between">
              <div>
                <Button
                  variant="ghost"
                  onClick={handleBackToHome}
                  className="text-gray-600 hover:text-gray-900 mb-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
                <h1 className="text-3xl md:text-4xl font-light text-black">
                  Choose Your CV Template
                </h1>
                <p className="text-gray-500 mt-2">
                  Select a design you like. You can customize or switch it later.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-6">
          {importError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {importError}
            </div>
          )}
          
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={handleTemplateSelect}
                  isSelected={selectedTemplateId === template.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No templates found in this category.</p>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-black mb-2">
              All templates are ATS-friendly
            </h3>
            <p className="text-sm text-gray-600">
              Every template is optimized for Applicant Tracking Systems (ATS) to ensure your CV gets past automated screening.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="min-h-screen bg-white">
        <CVFormWithPreview 
          formData={formData}
          setFormData={setFormData}
          onSubmit={generateCV}
          isGenerating={isGenerating}
          user={user}
          remainingAIRequests={remainingAIRequests}
          selectedTemplate={selectedTemplateId || 'classic'}
          onImport={handleImportCV}
        />
      </div>
    );
  }

  if (step === 'preview') {
    return (
      <div className="min-h-screen bg-white">
        <PreviewSection
          cvData={generatedCV || formData}
          onCvDataChange={setGeneratedCV}
          onPayment={handlePayment}
          onSubscribe={() => {}}
          isProcessingPayment={isProcessingPayment}
        />
      </div>
    );
  }

  return null;
}
