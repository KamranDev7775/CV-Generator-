import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import LandingSection from '@/components/cv/LandingSection';
import CVFormWithPreview from '@/components/cv/CVFormWithPreview';
import PreviewSection from '@/components/cv/PreviewSection';
import SocialProofSection from '@/components/home/SocialProofSection';
import CorporateDesignSection from '@/components/home/CorporateDesignSection';
import WhyItWorksSection from '@/components/home/WhyItWorksSection';
import TransparentPricingSection from '@/components/home/TransparentPricingSection';
import CVIncludesSection from '@/components/home/CVIncludesSection';
import PreviewPaymentSection from '@/components/home/PreviewPaymentSection';
import SuitableForSection from '@/components/home/SuitableForSection';
import FooterCTASection from '@/components/home/FooterCTASection';
import FAQSection from '@/components/home/FAQSection';

const STORAGE_KEY = 'ats_cv_form_data';
const SUBMISSION_KEY = 'ats_cv_submission_id';

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
    target_country: 'Germany',
    seniority_level: 'Mid',
    job_description: ''
  });
  const [generatedCV, setGeneratedCV] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [generateCoverLetter, setGenerateCoverLetter] = useState(false);

  // Load user and saved form data on mount
  useEffect(() => {
    loadUser();
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        // Don't auto-navigate to preview on refresh - let user stay on landing
      } catch (e) {
        console.log('Could not parse saved data');
      }
    }
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

  // Save form data on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const scrollToForm = async () => {
    // Don't require login at start - let users fill the form first
    setStep('form');
    setTimeout(() => {
      document.getElementById('cv-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
      
      // Auto-generate HIGH QUALITY summary if requested
      if (formData.auto_generate_summary) {
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
      }

      const cvData = { ...formData, summary, generated_cv: summary };
      
      // Save to database only if user is authenticated
      const submission = await base44.entities.CVSubmission.create({
        ...cvData,
        payment_status: 'pending'
      });
      
      localStorage.setItem(SUBMISSION_KEY, submission.id);
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
    if (isProcessingPayment) return; // Prevent double-clicks

    // Check if running in iframe
    if (window.self !== window.top) {
      alert('Payment checkout is only available in the published app. Please open the app in a new tab to complete your purchase.');
      return;
    }

    // Ensure user is logged in before payment
    if (!user) {
      await base44.auth.redirectToLogin(window.location.href);
      return;
    }

    setIsProcessingPayment(true);
    
    try {
      const submissionId = localStorage.getItem(SUBMISSION_KEY);
      
      // Create Stripe checkout session via backend function
      const response = await base44.functions.invoke('createCheckout', {
        submissionId,
        successUrl: `${window.location.origin}/Success?submission_id=${submissionId}`,
        cancelUrl: window.location.href
      });
      
      // Redirect to Stripe checkout
      window.location.href = response.data.url;
      
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {step === 'landing' && (
        <>
          <LandingSection onStart={scrollToForm} />
          <SocialProofSection />
          <CorporateDesignSection onStart={scrollToForm} />
          <WhyItWorksSection />
          <TransparentPricingSection />
          <CVIncludesSection />
          <PreviewPaymentSection onStart={scrollToForm} />
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