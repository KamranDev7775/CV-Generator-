import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import LandingSection from '@/components/cv/LandingSection';
import CVForm from '@/components/cv/CVForm';
import PreviewSection from '@/components/cv/PreviewSection';

const STORAGE_KEY = 'ats_cv_form_data';
const SUBMISSION_KEY = 'ats_cv_submission_id';

export default function Home() {
  const [step, setStep] = useState('landing'); // landing, form, preview
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

  // Load saved form data on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        // If we have generated CV data, go to preview
        if (parsed.generated_cv) {
          setGeneratedCV(parsed);
          setStep('preview');
        }
      } catch (e) {
        console.log('Could not parse saved data');
      }
    }
  }, []);

  // Save form data on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const scrollToForm = () => {
    setStep('form');
    setTimeout(() => {
      document.getElementById('cv-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const generateCV = async () => {
    setIsGenerating(true);
    
    try {
      let summary = formData.summary;
      
      // Auto-generate summary if requested
      if (formData.auto_generate_summary) {
        const experienceText = formData.experiences
          .filter(e => e.job_title || e.company)
          .map(e => `${e.job_title} at ${e.company}`)
          .join(', ');
        
        const prompt = `Generate a professional summary (3-5 sentences) for a CV. 
          Name: ${formData.full_name}
          Target Position: ${formData.target_position || 'Not specified'}
          Target Country: ${formData.target_country}
          Seniority: ${formData.seniority_level}
          Skills: ${formData.skills || 'Not specified'}
          Experience: ${experienceText || 'Not specified'}
          ${formData.job_description ? `Job Description to tailor for: ${formData.job_description}` : ''}
          
          Write in a professional tone suitable for Big4 and corporate applications in Europe. 
          Focus on quantifiable achievements and key competencies.
          Do NOT use first person pronouns.`;
        
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
      
      // Save to database
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
      // Still show preview with entered data
      setGeneratedCV(formData);
      setStep('preview');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePayment = async () => {
    // Check if running in iframe
    if (window.self !== window.top) {
      alert('Payment checkout is only available in the published app. Please open the app in a new tab to complete your purchase.');
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
          
          {/* Company Logos Section */}
          <section className="px-6 md:px-12 lg:px-24 py-16 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h3 className="text-center text-sm uppercase tracking-widest text-gray-400 mb-8">
                Trusted by applicants targeting companies like:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
                <div className="text-2xl font-light text-gray-300">Deloitte</div>
                <div className="text-2xl font-light text-gray-300">Lufthansa</div>
                <div className="text-2xl font-light text-gray-300">PwC</div>
                <div className="text-2xl font-light text-gray-300">BMW</div>
                <div className="text-2xl font-light text-gray-300">SAP</div>
              </div>
              <p className="text-xs text-gray-400 text-center mt-8 leading-relaxed max-w-3xl mx-auto">
                *The names and logos of the companies mentioned above are registered trademarks belonging to their respective owners. Unless otherwise noted, these references in no way aim to suggest an affiliation or association with Makemycv.
              </p>
            </div>
          </section>
        </>
      )}
      
      {step === 'form' && (
        <>
          <div className="px-6 md:px-12 lg:px-24 py-8 border-b border-gray-100">
            <button 
              onClick={() => setStep('landing')}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Back
            </button>
          </div>
          <CVForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={generateCV}
            isGenerating={isGenerating}
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