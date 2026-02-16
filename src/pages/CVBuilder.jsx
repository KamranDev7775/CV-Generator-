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
import Navbar from '@/components/navigation/Navbar';

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
    template: 'minimal',
    style: 'minimal',
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
          template: prev.template || 'minimal'
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
    const templateId = templateParam || savedTemplate || 'minimal';
    const validTemplate = templateExists(templateId) ? templateId : 'minimal';
    
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
    
    if (validTemplate !== 'minimal') {
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
    // Update formData.template immediately
    setFormData(prev => ({ ...prev, template: templateId }));
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

      if (result && typeof result === 'object' && 'status' in result && result.status === 'error') {
        console.error('[CV Builder] API returned error status');
        setImportError('Could not read this file. Please try another one.');
        toast.error('Could not read this file. Please try another one.');
        return;
      }

      // Merge extracted data with default form structure
      const extractedData = (result && typeof result === 'object' && 'output' in result) ? result.output : {};
      console.log('[CV Builder] Extracted data:', extractedData);
      
      const newFormData = {
        ...formData,
        full_name: (extractedData && typeof extractedData === 'object' && 'full_name' in extractedData && typeof extractedData.full_name === 'string') ? extractedData.full_name : '',
        target_position: (extractedData && typeof extractedData === 'object' && 'target_position' in extractedData && typeof extractedData.target_position === 'string') ? extractedData.target_position : '',
        location: (extractedData && typeof extractedData === 'object' && 'location' in extractedData && typeof extractedData.location === 'string') ? extractedData.location : '',
        email: (extractedData && typeof extractedData === 'object' && 'email' in extractedData && typeof extractedData.email === 'string') ? extractedData.email : '',
        phone: (extractedData && typeof extractedData === 'object' && 'phone' in extractedData && typeof extractedData.phone === 'string') ? extractedData.phone : '',
        linkedin_url: (extractedData && typeof extractedData === 'object' && 'linkedin_url' in extractedData && typeof extractedData.linkedin_url === 'string') ? extractedData.linkedin_url : '',
        summary: (extractedData && typeof extractedData === 'object' && 'summary' in extractedData && typeof extractedData.summary === 'string') ? extractedData.summary : '',
        auto_generate_summary: false,
        skills: (extractedData && typeof extractedData === 'object' && 'skills' in extractedData && typeof extractedData.skills === 'string') ? extractedData.skills : '',
        experiences: (extractedData && typeof extractedData === 'object' && 'experiences' in extractedData && Array.isArray(extractedData.experiences) && extractedData.experiences.length > 0) 
          ? extractedData.experiences 
          : [{ job_title: '', company: '', location: '', start_date: '', end_date: '', achievements: '' }],
        education: (extractedData && typeof extractedData === 'object' && 'education' in extractedData && Array.isArray(extractedData.education) && extractedData.education.length > 0) 
          ? extractedData.education 
          : [{ degree: '', university: '', location: '', start_date: '', end_date: '' }],
        languages: (extractedData && typeof extractedData === 'object' && 'languages' in extractedData && typeof extractedData.languages === 'string') ? extractedData.languages : '',
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
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #F3F1FF 0%, #FFFFFF 83.1%)' }}>
        <Navbar />
        
        <div className="relative pt-12 pb-16 sm:pt-16 sm:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-medium mb-6">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Professional Templates
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6 leading-tight">
                  Choose Your Perfect
                  <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CV Template</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                  Select from our professionally designed templates. Each one is ATS-optimized and crafted to make you stand out to recruiters and hiring managers.
                </p>
                
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    ATS-Optimized
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Professional Design
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Instant Download
                  </div>
                </div>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {importError && (
            <div className="mb-8 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-6 py-4 rounded-2xl shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{importError}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Category Filter */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Browse by Category</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Find the perfect template that matches your industry and career level</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`group relative px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25'
                      : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-lg border border-gray-200/50 hover:border-blue-200'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="relative z-10 text-sm sm:text-base">{category}</span>
                  {selectedCategory === category && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse opacity-20" />
                  )}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/0 to-indigo-600/0 group-hover:from-blue-600/5 group-hover:to-indigo-600/5 transition-all duration-300" />
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          {filteredTemplates.length > 0 ? (
            <div className="space-y-12">
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-sm font-medium mb-4">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                  {selectedCategory === 'All Templates' ? 'All Templates' : `${selectedCategory} Templates`}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Each template is carefully crafted to help you land your dream job
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                {filteredTemplates.map((template, index) => (
                  <div 
                    key={template.id}
                    className="group transform transition-all duration-500 hover:scale-105"
                    style={{ 
                      animation: 'fadeInUp 0.6s ease-out forwards',
                      animationDelay: `${index * 100}ms`,
                      opacity: 0
                    }}
                  >
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-500" />
                      <div className="relative">
                        <TemplateCard
                          template={template}
                          onSelect={handleTemplateSelect}
                          onPreview={() => {}}
                          isSelected={selectedTemplateId === template.id}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="relative">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-lg">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No templates found</h3>
                <p className="text-gray-500 max-w-md mx-auto">No templates available in the {selectedCategory} category. Try selecting a different category.</p>
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="mt-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl" />
              <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/30 shadow-2xl">
                <div className="text-center mb-12">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Why Choose Our Templates?</h3>
                  <p className="text-gray-600 max-w-2xl mx-auto">Every template is designed with your success in mind</p>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="text-center group">
                    <div className="relative">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">ATS-Optimized</h4>
                    <p className="text-gray-600 leading-relaxed">Every template passes through Applicant Tracking Systems with ease, ensuring your CV reaches human recruiters</p>
                  </div>
                  
                  <div className="text-center group">
                    <div className="relative">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5 9.293 10.793a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Instant Preview</h4>
                    <p className="text-gray-600 leading-relaxed">See exactly how your CV will look in real-time as you fill in your information</p>
                  </div>
                  
                  <div className="text-center group sm:col-span-2 lg:col-span-1">
                    <div className="relative">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                        </svg>
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Professional Design</h4>
                    <p className="text-gray-600 leading-relaxed">Crafted by design experts and tested with hiring managers for maximum impact</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #F3F1FF 0%, #FFFFFF 83.1%)' }}>
        <Navbar />
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
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
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #F3F1FF 0%, #FFFFFF 83.1%)' }}>
        <Navbar />
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
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
