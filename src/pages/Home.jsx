import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { toast } from "sonner";
import { setSecureStorage, getSecureStorage, removeSecureStorage } from '../utils/storage';
import LandingSection from '@/components/cv/LandingSection';
import CVFormWithPreview from '@/components/cv/CVFormWithPreview';
import PreviewSection from '@/components/cv/PreviewSection';
import SocialProofSection from '@/components/home/SocialProofSection';
import CorporateDesignSection from '@/components/home/CorporateDesignSection';
import WhyItWorksSection from '@/components/home/WhyItWorksSection';
import CVIncludesSection from '@/components/home/CVIncludesSection';
import SuitableForSection from '@/components/home/SuitableForSection';
import FooterCTASection from '@/components/home/FooterCTASection';
import FAQSection from '@/components/home/FAQSection';

const STORAGE_KEY = 'form_data';
const SUBMISSION_KEY = 'submission_id';

export default function Home() {
  const navigate = useNavigate();
  const [step, setStep] = useState('landing'); // landing, form, preview
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
    template: 'classic'
  });
  const [generatedCV, setGeneratedCV] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [generateCoverLetter, setGenerateCoverLetter] = useState(false);
  const [importError, setImportError] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');

  // Load user and saved form data on mount
  useEffect(() => {
    loadUser();
    const saved = getSecureStorage(STORAGE_KEY);
    if (saved) {
      try {
        setFormData(saved);
        // Don't auto-navigate to preview on refresh - let user stay on landing
      } catch (e) {
        console.log('Could not parse saved data');
      }
    }
  }, []);

  // Generate CSRF token on mount
  useEffect(() => {
    const generateCsrfToken = () => {
      if (crypto.randomUUID) {
        return crypto.randomUUID();
      }
      // Fallback for browsers without crypto.randomUUID
      return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    };
    
    const token = generateCsrfToken();
    setCsrfToken(token);
    // Store in sessionStorage for verification
    sessionStorage.setItem('csrf_token', token);
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      // User not logged in
      setUser(null);
    }
  };

  // Save form data on change (encrypted)
  useEffect(() => {
    setSecureStorage(STORAGE_KEY, formData);
  }, [formData]);

  const scrollToForm = async () => {
    // Don't require login at start - let users fill the form first
    setStep('form');
    setTimeout(() => {
      document.getElementById('cv-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleImportCV = async (file) => {
    setImportError(null);
    
    try {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
        setImportError('Invalid file type. Please upload a PDF, Word document, or text file.');
        return;
      }
      
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setImportError('File is too large. Please upload a file smaller than 10MB.');
        return;
      }
      
      if (file.size === 0) {
        setImportError('File is empty. Please upload a valid file.');
        return;
      }
      
      // Upload the file first
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      // Extract data from the uploaded CV
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

      if (result.status === 'error') {
        setImportError('Could not read this file. Please try another one.');
        return;
      }

      // Merge extracted data with default form structure
      const extractedData = result.output || {};
      const newFormData = {
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
        target_country: 'Germany',
        seniority_level: 'Mid',
        job_description: '',
        template: extractedData.template || 'classic'
      };

      setFormData(newFormData);
      setStep('form');
      setTimeout(() => {
        document.getElementById('cv-form')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error('Import error:', error);
      setImportError('Could not read this file. Please try another one.');
    }
  };

  const generateCV = async () => {
    if (isGenerating) return; // Prevent double-clicks
    setIsGenerating(true);
    
    try {
      // Check if user is logged in, if not - prompt login
      if (!user) {
        await base44.auth.redirectToLogin(window.location.href);
        return;
      }

      let summary = formData.summary;
      let coverLetter = null;
      
      // Auto-generate HIGH QUALITY summary if requested
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
          
          summary = result.summary;
        } catch (aiError) {
          console.error('AI summary generation failed:', aiError);
          toast.error('AI summary generation failed. Using your original summary instead.');
          // summary remains as formData.summary (original)
        }
      }

      // Generate cover letter if requested
      if (generateCoverLetter) {
        try {
          const experienceText = formData.experiences
            .filter(e => e.job_title || e.company)
            .map(e => `${e.job_title} at ${e.company}: ${e.achievements || 'No details provided'}`)
            .join('\n');
          
          const educationText = formData.education
            .filter(e => e.degree || e.university)
            .map(e => `${e.degree} from ${e.university}`)
            .join(', ');
          
          const coverLetterPrompt = `You are an expert cover letter writer specializing in top consulting firms, tech companies, and Fortune 500 applications.

Write a professional, compelling cover letter (3-4 paragraphs, ~250-300 words) that matches the candidate's CV and the target position.

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
- Write in first person (use "I", "my", "me")
- Start with a strong opening paragraph that captures attention
- Second paragraph: Highlight 2-3 key achievements or experiences relevant to the role
- Third paragraph: Explain why you're interested in this specific position/company
- Closing paragraph: Express enthusiasm and request an interview
- Match tone to target role and seniority level
- Use active, powerful verbs
- Keep it professional but personable
- Tailor to consulting, tech, and corporate roles in Europe
- Address the hiring manager (use "Dear Hiring Manager" if no name available)

Generate a cover letter that will make recruiters want to interview this candidate.`;
          
          const coverLetterResult = await base44.integrations.Core.InvokeLLM({
            prompt: coverLetterPrompt,
            response_json_schema: {
              type: "object",
              properties: {
                cover_letter: { type: "string" }
              }
            }
          });
          
          coverLetter = coverLetterResult.cover_letter;
        } catch (coverLetterError) {
          console.error('Cover letter generation failed:', coverLetterError);
          toast.error('Cover letter generation failed. You can still proceed without it.');
          // Continue without cover letter
        }
      }

      const cvData = { ...formData, summary, generated_cv: summary, cover_letter: coverLetter };
      
      // Save to database only if user is authenticated
      const submission = await base44.entities.CVSubmission.create({
        ...cvData,
        payment_status: 'pending'
      });
      
      setSecureStorage(SUBMISSION_KEY, submission.id);
      setFormData(cvData);
      setGeneratedCV(cvData);
      setStep('preview');
      
      setTimeout(() => {
        document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error('Error generating CV:', error);
      if (error.message?.includes('auth') || error.message?.includes('login')) {
        await base44.auth.redirectToLogin(window.location.href);
      } else {
        // Still show preview with entered data
        setGeneratedCV(formData);
        setStep('preview');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePayment = async () => {
    // Better protection: check flag and disable immediately
    if (isProcessingPayment) return;
    
    // Set flag immediately before any async operations
    setIsProcessingPayment(true);

    // Check if running in iframe
    if (window.self !== window.top) {
      setIsProcessingPayment(false);
      alert('Payment checkout is only available in the published app. Please open the app in a new tab to complete your purchase.');
      return;
    }

    // Ensure user is logged in before payment
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
      
      // Create Stripe checkout session via backend function
      const response = await base44.functions.invoke('createCheckout', {
        submissionId,
        customerEmail: formData.email || user?.email,
        successUrl: `${window.location.origin}${createPageUrl('PaymentSuccess')}?type=cv&submission_id=${submissionId}`,
        cancelUrl: window.location.href,
        csrfToken: csrfToken
      });
      
      // Redirect to Stripe checkout
      window.location.href = response.data.url;
      
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessingPayment(false);
      const errorMessage = error.message || 'Payment failed. Please try again or use a different payment method.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {step === 'landing' && (
        <>
          <LandingSection onStart={scrollToForm} onImport={handleImportCV} />
          {importError && (
            <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-24 -mt-12 mb-8">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {importError}
              </div>
            </div>
          )}
          <SocialProofSection />
          <CorporateDesignSection onStart={scrollToForm} />
          <WhyItWorksSection />
          <CVIncludesSection />
          <SuitableForSection />
          <FAQSection />
          <FooterCTASection onStart={scrollToForm} />
        </>
      )}
      
      {step === 'form' && (
        <>
          <div className="px-6 md:px-12 py-8 bg-white border-b border-gray-100">
            <button 
              onClick={() => setStep('landing')}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
            >
              ← Back to Home
            </button>
          </div>
          <CVFormWithPreview 
            formData={formData}
            setFormData={setFormData}
            onSubmit={generateCV}
            isGenerating={isGenerating}
            generateCoverLetter={generateCoverLetter}
            setGenerateCoverLetter={setGenerateCoverLetter}
          />
        </>
      )}
      
      {step === 'preview' && (
        <>
          <div className="px-6 md:px-12 lg:px-24 py-8 border-b border-gray-100">
            <button 
              onClick={() => setStep('form')}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Edit CV
            </button>
          </div>
          <PreviewSection 
            cvData={generatedCV}
            onPayment={handlePayment}
            isProcessingPayment={isProcessingPayment}
          />
        </>
      )}
    </div>
  );
}