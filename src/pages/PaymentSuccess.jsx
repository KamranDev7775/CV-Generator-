import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import CVDocument from '@/components/cv/CVDocument';
import { Check, Copy, Download, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = 'ats_cv_form_data';

export default function PaymentSuccess() {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentType, setPaymentType] = useState(null); // 'cv', 'trial', 'monthly'
  const [cvData, setCvData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // verifying, success, pending
  const cvRef = useRef(null);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const submissionId = urlParams.get('submission_id');
    const sessionId = urlParams.get('session_id');
    
    setPaymentType(type);

    if (type === 'cv' && submissionId) {
      // Poll for CV payment completion
      let attempts = 0;
      const maxAttempts = 10;
      
      while (attempts < maxAttempts) {
        try {
          const submissions = await base44.entities.CVSubmission.filter({ id: submissionId });
          
          if (submissions?.length > 0 && submissions[0].payment_status === 'completed') {
            setVerificationStatus('success');
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
              setCvData(JSON.parse(saved));
            }
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error('Error checking payment:', e);
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }
      
      // Still show CV but mark as pending
      setVerificationStatus('pending');
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCvData(JSON.parse(saved));
      }
    } else if (type === 'trial' || type === 'monthly') {
      // For subscriptions, create subscription record from frontend
      try {
        const user = await base44.auth.me();
        if (user && sessionId) {
          // Check if subscription already exists for this user
          const existingSubs = await base44.entities.Subscription.filter({ user_email: user.email });
          const hasActiveSub = existingSubs.some(s => s.status === 'active' || s.status === 'trialing');
          
          if (!hasActiveSub) {
            // Create subscription record
            const periodEnd = new Date();
            if (type === 'trial') {
              periodEnd.setDate(periodEnd.getDate() + 14); // 14 days trial
            } else {
              periodEnd.setMonth(periodEnd.getMonth() + 1); // 1 month subscription
            }
            
            await base44.entities.Subscription.create({
              user_email: user.email,
              stripe_customer_id: sessionId, // Using session ID as reference
              stripe_subscription_id: sessionId,
              plan_type: type,
              status: 'active',
              current_period_start: new Date().toISOString(),
              current_period_end: periodEnd.toISOString()
            });
          }
        }
        setVerificationStatus('success');
      } catch (e) {
        console.error('Error creating subscription:', e);
        setVerificationStatus('success'); // Still show success page
      }
    }
    
    setIsLoading(false);
  };

  const generateCVText = () => {
    if (!cvData) return '';
    const lines = [];
    lines.push(cvData.full_name || '');
    if (cvData.target_position) lines.push(cvData.target_position);
    const contactParts = [cvData.email, cvData.phone, cvData.linkedin_url, cvData.location].filter(Boolean);
    if (contactParts.length) lines.push(contactParts.join(' | '));
    lines.push('');
    if (cvData.summary) {
      lines.push('PROFESSIONAL SUMMARY');
      lines.push(cvData.summary);
      lines.push('');
    }
    if (cvData.skills) {
      lines.push('SKILLS');
      lines.push(cvData.skills);
      lines.push('');
    }
    if (cvData.experiences?.length && cvData.experiences.some(e => e.job_title || e.company)) {
      lines.push('PROFESSIONAL EXPERIENCE');
      cvData.experiences.filter(e => e.job_title || e.company).forEach(exp => {
        const datePart = exp.start_date || exp.end_date ? ` (${exp.start_date} - ${exp.end_date || 'Present'})` : '';
        lines.push(`${exp.job_title}, ${exp.company}, ${exp.location}${datePart}`);
        if (exp.achievements) {
          exp.achievements.split('\n').filter(a => a.trim()).forEach(a => {
            lines.push(`• ${a.trim()}`);
          });
        }
        lines.push('');
      });
    }
    if (cvData.education?.length && cvData.education.some(e => e.degree || e.university)) {
      lines.push('EDUCATION');
      cvData.education.filter(e => e.degree || e.university).forEach(edu => {
        const datePart = edu.start_date || edu.end_date ? ` (${edu.start_date} - ${edu.end_date})` : '';
        lines.push(`${edu.degree}, ${edu.university}, ${edu.location}${datePart}`);
      });
      lines.push('');
    }
    if (cvData.languages) {
      lines.push('LANGUAGES');
      lines.push(cvData.languages);
    }
    return lines.join('\n');
  };

  const copyText = async () => {
    const text = generateCVText();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('CV text copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const printWindow = window.open('', '_blank');
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${cvData.full_name} - CV</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.4; color: #000; background: #fff; padding: 40px 50px; }
            header { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #ccc; }
            h1 { font-size: 18pt; font-weight: bold; margin-bottom: 5px; }
            .position { font-size: 12pt; color: #333; margin-bottom: 8px; }
            .contact { font-size: 10pt; color: #555; }
            section { margin-bottom: 18px; }
            h2 { font-size: 10pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #555; margin-bottom: 8px; font-family: Arial, sans-serif; }
            p { margin-bottom: 8px; }
            .experience-item { margin-bottom: 12px; }
            .experience-header { margin-bottom: 5px; }
            .job-title { font-weight: bold; }
            .dates { float: right; font-size: 10pt; color: #555; }
            ul { margin-left: 20px; }
            li { margin-bottom: 3px; }
            .education-item { margin-bottom: 8px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <header>
            <h1>${cvData.full_name || ''}</h1>
            ${cvData.target_position ? `<div class="position">${cvData.target_position}</div>` : ''}
            <div class="contact">${[cvData.email, cvData.phone, cvData.linkedin_url, cvData.location].filter(Boolean).join(' | ')}</div>
          </header>
          ${cvData.summary ? `<section><h2>Professional Summary</h2><p>${cvData.summary}</p></section>` : ''}
          ${cvData.skills ? `<section><h2>Skills</h2><p>${cvData.skills}</p></section>` : ''}
          ${cvData.experiences?.length && cvData.experiences.some(e => e.job_title || e.company) ? `
          <section>
            <h2>Professional Experience</h2>
            ${cvData.experiences.filter(e => e.job_title || e.company).map(exp => `
              <div class="experience-item">
                <div class="experience-header">
                  ${exp.start_date || exp.end_date ? `<span class="dates">${exp.start_date} — ${exp.end_date || 'Present'}</span>` : ''}
                  <span class="job-title">${exp.job_title}</span>${exp.company ? `, ${exp.company}` : ''}${exp.location ? `, ${exp.location}` : ''}
                </div>
                ${exp.achievements ? `<ul>${exp.achievements.split('\n').filter(a => a.trim()).map(a => `<li>${a.trim()}</li>`).join('')}</ul>` : ''}
              </div>
            `).join('')}
          </section>` : ''}
          ${cvData.education?.length && cvData.education.some(e => e.degree || e.university) ? `
          <section>
            <h2>Education</h2>
            ${cvData.education.filter(e => e.degree || e.university).map(edu => `
              <div class="education-item">
                ${edu.start_date || edu.end_date ? `<span class="dates">${edu.start_date} — ${edu.end_date}</span>` : ''}
                <span class="job-title">${edu.degree}</span>${edu.university ? `, ${edu.university}` : ''}${edu.location ? `, ${edu.location}` : ''}
              </div>
            `).join('')}
          </section>` : ''}
          ${cvData.languages ? `<section><h2>Languages</h2><p>${cvData.languages}</p></section>` : ''}
        </body>
        </html>
      `;
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
        setIsGeneratingPDF(false);
      };
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error generating PDF. Please try again.');
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
        <p className="text-gray-500">Verifying payment...</p>
      </div>
    );
  }

  // Subscription success (trial or monthly)
  if (paymentType === 'trial' || paymentType === 'monthly') {
    return (
      <div className="min-h-screen bg-white">
        <section className="px-6 md:px-12 lg:px-24 py-20">
          <div className="max-w-xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-6">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-light text-black mb-4">
              {paymentType === 'trial' ? 'Trial activated!' : 'Subscription activated!'}
            </h1>
            <p className="text-gray-500 mb-8">
              {paymentType === 'trial' 
                ? 'You now have 14 days of full access to create unlimited CVs.' 
                : 'Your monthly subscription is now active. Enjoy unlimited CV creation!'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('Home')}>
                <Button className="bg-black text-white hover:bg-gray-900 py-6 px-8 text-base font-normal rounded-none">
                  Create your CV now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to={createPageUrl('Dashboard')}>
                <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 py-6 px-8 text-base font-normal rounded-none">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // CV purchase success
  if (!cvData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-light text-black mb-4">No CV data found</h1>
          <p className="text-gray-500 mb-8">Please generate a CV first.</p>
          <Link to={createPageUrl('Home')} className="text-black underline hover:no-underline">
            Go back to start
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="px-6 md:px-12 lg:px-24 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black mb-6">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-light text-black mb-4">
              Payment successful!
            </h1>
            <p className="text-gray-500">
              Your CV is ready. Download as PDF or copy the text.
            </p>
            {verificationStatus === 'pending' && (
              <p className="text-amber-600 text-sm mt-2">
                Payment verification in progress. Your CV is ready to download.
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button 
              onClick={downloadPDF}
              disabled={isGeneratingPDF}
              className="flex-1 bg-black text-white hover:bg-gray-900 py-6 text-base font-normal rounded-none"
            >
              {isGeneratingPDF ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</>
              ) : (
                <><Download className="mr-2 h-4 w-4" />Download PDF</>
              )}
            </Button>
            <Button 
              onClick={copyText}
              variant="outline"
              className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 py-6 text-base font-normal rounded-none"
            >
              {copied ? (
                <><Check className="mr-2 h-4 w-4" />Copied!</>
              ) : (
                <><Copy className="mr-2 h-4 w-4" />Copy CV Text</>
              )}
            </Button>
          </div>

          <div className="border border-gray-200 shadow-sm" ref={cvRef}>
            <CVDocument data={cvData} showWatermark={false} />
          </div>

          <div className="mt-12 text-center">
            <Link to={createPageUrl('Home')} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              ← Generate another CV
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}