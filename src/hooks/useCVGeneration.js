import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { canMakeAIRequest, recordAIRequest, getRemainingRequests } from '@/utils/rateLimiter';
import { setSecureStorage } from '@/utils/storage';
import { toast } from "@/components/ui/use-toast";

const SUBMISSION_KEY = 'submission_id';

export const useCVGeneration = (user, formData, setFormData, submissionKey = SUBMISSION_KEY) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [remainingAIRequests, setRemainingAIRequests] = useState(null);

  const generateCV = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    
    try {
      let summary = formData.summary;
      
      // Check AI permissions
      const needsAI = formData.auto_generate_summary;
      if (!user && needsAI) {
        const rateLimitCheck = canMakeAIRequest();
        if (!rateLimitCheck) {
          toast({ 
            title: 'Error', 
            description: 'Rate limit exceeded. Please log in for unlimited AI generation.', 
            variant: 'destructive' 
          });
          setIsGenerating(false);
          setRemainingAIRequests(getRemainingRequests());
          return;
        }
      }
      
      // Generate AI summary if requested
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
- Tailor to consulting, tech, and corporate roles in Europe`;
          
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
          toast({ title: 'Error', description: 'AI summary generation failed. Using your original summary.', variant: 'destructive' });
        }
      }

      // Save and prepare CV data
      const cvData = { ...formData, summary };
      
      if (user) {
        try {
          const submission = await base44.entities.CVSubmission.create({
            ...cvData,
            payment_status: 'pending'
          });
          setSecureStorage(submissionKey, submission.id);
        } catch (error) {
          console.error('Error saving to database:', error);
        }
      }
      
      setFormData(cvData);
      return cvData;
      
    } catch (error) {
      console.error('Error generating CV:', error);
      if (error.message?.includes('auth') || error.message?.includes('login')) {
        await base44.auth.redirectToLogin(window.location.href);
      }
      return formData;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateCV, isGenerating, remainingAIRequests };
};
