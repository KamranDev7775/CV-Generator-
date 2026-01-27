import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { setSecureStorage, getSecureStorage, removeSecureStorage } from '../utils/storage';
import { toast } from "sonner";
import { getAllTemplates, getTemplatesByCategory, TEMPLATE_CATEGORIES, getAllCategories, getTemplateById, templateExists } from '@/config/templates';
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
  
  // Get step from URL params
  const urlParams = new URLSearchParams(location.search);
  const step = urlParams.get('step') || 'templates'; // templates, form, preview
  
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
    style: 'professional'
  });
  const [generatedCV, setGeneratedCV] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [generateCoverLetter, setGenerateCoverLetter] = useState(false);
  const [importError, setImportError] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [remainingAIRequests, setRemainingAIRequests] = useState(null);
  const [authCheckAttempts, setAuthCheckAttempts] = useState(0);
  const lastAuthCheckRef = useRef(0);
  const pendingImportRef = useRef(null);

  // Load user and saved form data on mount
  useEffect(() => {
    loadUser();
    
    // Check for pending CV import - store in ref to process after handleImportCV is defined
    const pendingImport = sessionStorage.getItem('pending_cv_import');
    if (pendingImport && urlParams.get('import') === 'true') {
      try {
        const fileData = JSON.parse(pendingImport);
        // Convert base64 back to File object
        const byteCharacters = atob(fileData.data.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const file = new File([byteArray], fileData.name, { type: fileData.type });
        
        // Store in ref to process after handleImportCV is defined
        pendingImportRef.current = file;
        sessionStorage.removeItem('pending_cv_import');
      } catch (error) {
        console.error('Error processing pending import:', error);
        sessionStorage.removeItem('pending_cv_import');
      }
    }
    
    // Load template from URL or storage
    const templateParam = urlParams.get('template');
    const savedTemplate = getSecureStorage(STORAGE_KEY_TEMPLATE);
    const templateId = templateParam || savedTemplate || 'classic';
    const validTemplate = templateExists(templateId) ? templateId : 'classic';
    
    setSelectedTemplateId(validTemplate);
    
    const saved = getSecureStorage(STORAGE_KEY);
    if (saved) {
      try {
        setFormData({
          ...saved,
          template: validTemplate
        });
      } catch (e) {
        console.log('Could not parse saved data');
      }
    } else {
      setFormData(prev => ({
        ...prev,
        template: validTemplate
      }));
    }
    
    if (validTemplate !== 'classic') {
      setSecureStorage(STORAGE_KEY_TEMPLATE, validTemplate);
    }
    
    setRemainingAIRequests(getRemainingRequests());
  }, []);

  // Generate CSRF token on mount
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

  // Get filtered templates
  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'All Templates') {
      return getAllTemplates();
    }
    return getTemplatesByCategory(selectedCategory);
  }, [selectedCategory]);

  // Get available categories
  const categories = useMemo(() => {
    return ['All Templates', ...getAllCategories()];
  }, []);

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplateId(templateId);
    setSecureStorage(STORAGE_KEY_TEMPLATE, templateId);
    
    // Navigate to form step
    updateStep('form', templateId);
  };

  const handleBackToHome = () => {
    navigate(createPageUrl('Home'));
  };

  // Sanitize string input - remove dangerous characters and trim
  const sanitizeString = (str) => {
    if (!str || typeof str !== 'string') return '';
    // Remove null bytes, control characters, and excessive whitespace
    return str
      .replace(/\0/g, '')
      .replace(/[\x00-\x1F\x7F]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 10000); // Max length limit
  };

  // Sanitize array of objects
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

  // Import CV functionality with validation and sanitization
  const handleImportCV = async (file) => {
    setImportError(null);
    
    try {
      // Validation: File type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
        setImportError('Invalid file type. Please upload a PDF, Word document, or text file.');
        toast.error('Invalid file type. Please upload a PDF, Word document, or text file.');
        return;
      }
      
      // Validation: File size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setImportError('File is too large. Please upload a file smaller than 10MB.');
        toast.error('File is too large. Please upload a file smaller than 10MB.');
        return;
      }
      
      // Validation: Empty file
      if (file.size === 0) {
        setImportError('File is empty. Please upload a valid file.');
        toast.error('File is empty. Please upload a valid file.');
        return;
      }
      
      // Show loading toast
      toast.loading('Uploading and processing your CV...');
      
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
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

      if (result && typeof result === 'object' && 'status' in result && result.status === 'error') {
        setImportError('Could not read this file. Please try another one.');
        toast.error('Could not read this file. Please try another one.');
        return;
      }

      const extractedDataRaw = (result && typeof result === 'object' && 'output' in result) ? result.output : (result || {});
      const extractedData = extractedDataRaw && typeof extractedDataRaw === 'object' ? extractedDataRaw : {};
      
      // Sanitize all extracted data with proper type checking
      const sanitizedData = {
        full_name: sanitizeString(extractedData && 'full_name' in extractedData ? String(extractedData.full_name) : ''),
        target_position: sanitizeString(extractedData && 'target_position' in extractedData ? String(extractedData.target_position) : ''),
        location: sanitizeString(extractedData && 'location' in extractedData ? String(extractedData.location) : ''),
        email: sanitizeString(extractedData && 'email' in extractedData ? String(extractedData.email) : '').toLowerCase(), // Normalize email
        phone: sanitizeString(extractedData && 'phone' in extractedData ? String(extractedData.phone) : ''),
        linkedin_url: sanitizeString(extractedData && 'linkedin_url' in extractedData ? String(extractedData.linkedin_url) : ''),
        summary: sanitizeString(extractedData && 'summary' in extractedData ? String(extractedData.summary) : ''),
        skills: sanitizeString(extractedData && 'skills' in extractedData ? String(extractedData.skills) : ''),
        experiences: sanitizeArray(extractedData && 'experiences' in extractedData && Array.isArray(extractedData.experiences) ? extractedData.experiences : [], 10),
        education: sanitizeArray(extractedData && 'education' in extractedData && Array.isArray(extractedData.education) ? extractedData.education : [], 10),
        languages: sanitizeString(extractedData && 'languages' in extractedData ? String(extractedData.languages) : '')
      };
      
      // Ensure experiences and education arrays have proper structure
      const sanitizedExperiences = sanitizedData.experiences.length > 0
        ? sanitizedData.experiences.map(exp => {
            const expObj = exp && typeof exp === 'object' ? exp : {};
            return {
              job_title: sanitizeString('job_title' in expObj ? String(expObj.job_title) : ''),
              company: sanitizeString('company' in expObj ? String(expObj.company) : ''),
              location: sanitizeString('location' in expObj ? String(expObj.location) : ''),
              start_date: sanitizeString('start_date' in expObj ? String(expObj.start_date) : ''),
              end_date: sanitizeString('end_date' in expObj ? String(expObj.end_date) : ''),
              achievements: sanitizeString('achievements' in expObj ? String(expObj.achievements) : '')
            };
          })
        : [{ job_title: '', company: '', location: '', start_date: '', end_date: '', achievements: '' }];
      
      const sanitizedEducation = sanitizedData.education.length > 0
        ? sanitizedData.education.map(edu => {
            const eduObj = edu && typeof edu === 'object' ? edu : {};
            return {
              degree: sanitizeString('degree' in eduObj ? String(eduObj.degree) : ''),
              university: sanitizeString('university' in eduObj ? String(eduObj.university) : ''),
              location: sanitizeString('location' in eduObj ? String(eduObj.location) : ''),
              start_date: sanitizeString('start_date' in eduObj ? String(eduObj.start_date) : ''),
              end_date: sanitizeString('end_date' in eduObj ? String(eduObj.end_date) : '')
            };
          })
        : [{ degree: '', university: '', location: '', start_date: '', end_date: '' }];

      const newFormData = {
        ...formData,
        full_name: sanitizedData.full_name,
        target_position: sanitizedData.target_position,
        location: sanitizedData.location,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        linkedin_url: sanitizedData.linkedin_url,
        summary: sanitizedData.summary,
        auto_generate_summary: false,
        skills: sanitizedData.skills,
        experiences: sanitizedExperiences,
        education: sanitizedEducation,
        languages: sanitizedData.languages,
        languagesList: [],
        target_country: formData.target_country || 'Germany',
        seniority_level: formData.seniority_level || 'Mid',
        job_description: '',
        template: formData.template || 'classic',
        style: formData.style || 'professional'
      };

      setFormData(newFormData);
      setSecureStorage(STORAGE_KEY, newFormData);
      updateStep('form', newFormData.template);
      
      toast.success('CV imported successfully! Review and edit your information.');
      
    } catch (error) {
      console.error('Import error:', error);
      const errorMessage = error.message || 'Could not read this file. Please try another one.';
      setImportError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Process pending import after handleImportCV is defined
  useEffect(() => {
    if (pendingImportRef.current) {
      const file = pendingImportRef.current;
      pendingImportRef.current = null;
      handleImportCV(file).catch(err => {
        console.error('Error processing pending import:', err);
        toast.error('Error processing imported file. Please try again.');
      });
    }
  }, []);

  // Generate CV function (moved from Home.jsx)
  const generateCV = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    
    try {
      let summary = formData.summary;
      let coverLetter = null;
      
      const needsAI = formData.auto_generate_summary || generateCoverLetter;
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

      if (generateCoverLetter) {
        try {
          const experienceText = formData.experiences
            .filter(e => e.job_title || e.company)
            .map(e => `${e.job_title} at ${e.company} (${e.start_date} - ${e.end_date || 'Present'}): ${e.achievements || 'No details provided'}`)
            .join('\n\n');
          
          const prompt = `You are an expert cover letter writer for top consulting firms, tech companies, and Fortune 500 applications.

Write a professional cover letter (3-4 paragraphs, ~300-400 words) for this candidate.

CANDIDATE INFORMATION:
Name: ${formData.full_name}
Target Position: ${formData.target_position || 'Professional role'}
Target Country: ${formData.target_country}
Email: ${formData.email}
Phone: ${formData.phone}
Location: ${formData.location}

PROFESSIONAL SUMMARY:
${formData.summary || 'Experienced professional'}

CORE SKILLS:
${formData.skills || 'General business skills'}

PROFESSIONAL EXPERIENCE:
${experienceText || 'Entry-level professional'}

${formData.job_description ? `TARGET JOB DESCRIPTION:\n${formData.job_description}` : ''}

REQUIREMENTS:
- Write in first person ("I", "my", "me")
- Start with a strong opening that captures attention
- Connect candidate's experience to the target role
- Highlight 2-3 key achievements or strengths
- Show enthusiasm and cultural fit
- End with a strong call to action
- Professional but personable tone
- Tailored to the target position and company type
- ATS-friendly language

Generate a compelling cover letter that will make recruiters want to interview this candidate.`;
          
          const result = await base44.integrations.Core.InvokeLLM({
            prompt,
            response_json_schema: {
              type: "object",
              properties: {
                cover_letter: { type: "string" }
              }
            }
          });
          
          coverLetter = (result && typeof result === 'object' && 'cover_letter' in result && typeof result.cover_letter === 'string')
            ? result.cover_letter
            : null;
          
          if (!user) {
            recordAIRequest();
            setRemainingAIRequests(getRemainingRequests());
          }
        } catch (aiError) {
          console.error('AI cover letter generation failed:', aiError);
          toast.error('AI cover letter generation failed. You can write your own cover letter.');
        }
      }

      const cvData = { ...formData, summary, generated_cv: summary, cover_letter: coverLetter };
      
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

  // Render based on step
  if (step === 'templates') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
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

        {/* Filter Buttons */}
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

          {/* Template Grid */}
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

          {/* Info Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-black mb-2">
              All templates are ATS-friendly
            </h3>
            <p className="text-sm text-gray-600">
              Every template is optimized for Applicant Tracking Systems (ATS) to ensure your CV gets past automated screening. You can preview your CV with sample data before filling in your information.
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
          generateCoverLetter={generateCoverLetter}
          setGenerateCoverLetter={setGenerateCoverLetter}
          user={user}
          remainingAIRequests={remainingAIRequests}
          selectedTemplate={formData.template || 'classic'}
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
          onSubscribe={() => {}} // Not used in CV flow
          isProcessingPayment={isProcessingPayment}
        />
      </div>
    );
  }

  return null;
}
