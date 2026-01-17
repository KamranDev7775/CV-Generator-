import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import CVEditor from '@/components/cv/CVEditor';

const STORAGE_KEY = 'cv_form_data';

export default function Home() {
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
    languages: ''
  });
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Load saved form data on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.log('Could not parse saved data');
      }
    }
  }, []);

  // Save form data on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    
    try {
      let summary = formData.summary;
      
      // Auto-generate summary if requested
      if (formData.auto_generate_summary && !summary) {
        const experienceText = formData.experiences
          .filter(e => e.job_title || e.company)
          .map(e => `${e.job_title} at ${e.company}: ${e.achievements || 'No details provided'}`)
          .join('\n');
        
        const educationText = formData.education
          .filter(e => e.degree || e.university)
          .map(e => `${e.degree} from ${e.university}`)
          .join(', ');
        
        const prompt = `You are an expert CV writer.

Generate a compelling professional summary (4-6 sentences, ~100 words) that will help recruiters understand this candidate's value.

CANDIDATE INFORMATION:
Name: ${formData.full_name}
Target Position: ${formData.target_position || 'Professional role'}
Core Skills: ${formData.skills || 'General professional skills'}
Education: ${educationText || 'Not specified'}

PROFESSIONAL EXPERIENCE:
${experienceText || 'Entry-level professional'}

REQUIREMENTS:
- Write in third person (no "I", "my", etc.)
- Start with years of experience or key expertise area
- Highlight 2-3 key strengths or achievements
- Include relevant industry keywords
- Make it compelling and confident
- Focus on value and impact
- Keep it concise but impactful

Generate a professional summary.`;
        
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
        setFormData(prev => ({ ...prev, summary }));
      }
      
      setShowPreview(true);
      
    } catch (error) {
      console.error('Error generating CV:', error);
      setShowPreview(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePayment = async () => {
    if (isProcessingPayment) return;

    // Check if running in iframe
    if (window.self !== window.top) {
      alert('Payment checkout is only available in the published app. Please open the app in a new tab to complete your purchase.');
      return;
    }

    setIsProcessingPayment(true);
    
    try {
      // Create submission without requiring authentication
      const submission = await base44.entities.CVSubmission.create({
        ...formData,
        payment_status: 'pending'
      });
      
      // Create Stripe checkout session
      const response = await base44.functions.invoke('createCheckout', {
        submissionId: submission.id,
        successUrl: `${window.location.origin}${createPageUrl('Success')}?submission_id=${submission.id}`,
        cancelUrl: window.location.href
      });
      
      // Redirect to Stripe checkout
      window.location.href = response.data.url;
      
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessingPayment(false);
      alert('Payment error. Please try again or contact support.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <CVEditor 
        formData={formData}
        setFormData={setFormData}
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        onGenerate={handleGenerate}
        onPayment={handlePayment}
        isGenerating={isGenerating}
        isProcessingPayment={isProcessingPayment}
      />
    </div>
  );
}