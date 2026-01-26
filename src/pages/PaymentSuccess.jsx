import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { getSecureStorage, removeSecureStorage } from '../utils/storage';
import CVDocument from '@/components/cv/CVDocument';
import { Check, Copy, Download, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from 'jspdf';

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
          // Verify user owns the submission
          let currentUser = null;
          try {
            currentUser = await base44.auth.me();
          } catch (authError) {
            console.error('Authentication error:', authError);
            break;
          }
          
          const submissions = await base44.entities.CVSubmission.filter({ 
            id: submissionId,
            created_by: currentUser.email 
          });
          
          if (submissions?.length > 0 && submissions[0].payment_status === 'completed') {
            setVerificationStatus('success');
            // Load from database (primary source)
            const submission = submissions[0];
            const cvDataFromDb = {
              full_name: submission.full_name,
              target_position: submission.target_position,
              location: submission.location,
              email: submission.email,
              phone: submission.phone,
              linkedin_url: submission.linkedin_url,
              summary: submission.summary || submission.generated_cv,
              skills: submission.skills,
              experiences: submission.experiences || [],
              education: submission.education || [],
              languages: submission.languages,
              cover_letter: submission.cover_letter || null,
              template: submission.template || 'classic'
            };
            setCvData(cvDataFromDb);
            // Clear encrypted localStorage after successful payment
            removeSecureStorage('form_data');
            removeSecureStorage('submission_id');
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
      
      // Still show CV but mark as pending - try to load from database, fallback to encrypted localStorage
      setVerificationStatus('pending');
      try {
        // Verify user owns the submission
        let currentUser = null;
        try {
          currentUser = await base44.auth.me();
        } catch (authError) {
          console.error('Authentication error:', authError);
        }
        
        if (currentUser) {
          const submissions = await base44.entities.CVSubmission.filter({ 
            id: submissionId,
            created_by: currentUser.email 
          });
          if (submissions?.length > 0) {
            const submission = submissions[0];
            const cvDataFromDb = {
              full_name: submission.full_name,
              target_position: submission.target_position,
              location: submission.location,
              email: submission.email,
              phone: submission.phone,
              linkedin_url: submission.linkedin_url,
              summary: submission.summary || submission.generated_cv,
              skills: submission.skills,
              experiences: submission.experiences || [],
              education: submission.education || [],
              languages: submission.languages,
              cover_letter: submission.cover_letter || null,
              template: submission.template || 'classic'
            };
            setCvData(cvDataFromDb);
          }
        }
        
        // Fallback to encrypted localStorage if database unavailable or user not authenticated
        if (!cvData) {
          // Fallback to encrypted localStorage if database unavailable
          const saved = getSecureStorage('form_data');
          if (saved) {
            setCvData(saved);
          }
        }
      } catch (e) {
        console.error('Error loading CV from database:', e);
        // Fallback to encrypted localStorage if database unavailable
        const saved = getSecureStorage('form_data');
        if (saved) {
          setCvData(saved);
        }
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
    if (isGeneratingPDF) return; // Prevent double-clicks
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let y = 20;

      const addText = (text, fontSize, isBold = false, color = [0, 0, 0]) => {
        doc.setFontSize(fontSize);
        doc.setFont('times', isBold ? 'bold' : 'normal');
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text, contentWidth);
        lines.forEach(line => {
          if (y > 280) { doc.addPage(); y = 20; }
          doc.text(line, margin, y);
          y += fontSize * 0.4;
        });
      };

      const addSection = (title) => {
        y += 4;
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text(title.toUpperCase(), margin, y);
        y += 6;
      };

      // Header
      doc.setFontSize(18);
      doc.setFont('times', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(cvData?.full_name || '', margin, y);
      y += 7;

      if (cvData?.target_position) {
        doc.setFontSize(12);
        doc.setFont('times', 'normal');
        doc.setTextColor(60, 60, 60);
        doc.text(cvData.target_position, margin, y);
        y += 5;
      }

      const contactParts = [cvData?.email, cvData?.phone, cvData?.linkedin_url, cvData?.location].filter(Boolean);
      if (contactParts.length) {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(contactParts.join(' | '), margin, y);
        y += 4;
      }

      y += 2;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;

      if (cvData?.summary) {
        addSection('Professional Summary');
        addText(cvData.summary, 10);
      }

      if (cvData?.skills) {
        addSection('Skills');
        addText(cvData.skills, 10);
      }

      if (cvData?.experiences?.length && cvData.experiences.some(e => e.job_title || e.company)) {
        addSection('Professional Experience');
        cvData.experiences.filter(e => e.job_title || e.company).forEach(exp => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.setFontSize(10);
          doc.setFont('times', 'bold');
          doc.setTextColor(0, 0, 0);
          const title = `${exp.job_title || ''}${exp.company ? `, ${exp.company}` : ''}${exp.location ? `, ${exp.location}` : ''}`;
          doc.text(title, margin, y);
          if (exp.start_date || exp.end_date) {
            const dates = `${exp.start_date || ''} — ${exp.end_date || 'Present'}`;
            doc.setFont('times', 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text(dates, pageWidth - margin - doc.getTextWidth(dates), y);
          }
          y += 5;
          if (exp.achievements) {
            doc.setFont('times', 'normal');
            doc.setTextColor(0, 0, 0);
            exp.achievements.split('\n').filter(a => a.trim()).forEach(a => {
              if (y > 280) { doc.addPage(); y = 20; }
              const bulletLines = doc.splitTextToSize(`• ${a.trim()}`, contentWidth - 5);
              bulletLines.forEach(line => {
                doc.text(line, margin + 3, y);
                y += 4;
              });
            });
          }
          y += 2;
        });
      }

      if (cvData?.education?.length && cvData.education.some(e => e.degree || e.university)) {
        addSection('Education');
        cvData.education.filter(e => e.degree || e.university).forEach(edu => {
          if (y > 280) { doc.addPage(); y = 20; }
          doc.setFontSize(10);
          doc.setFont('times', 'bold');
          doc.setTextColor(0, 0, 0);
          const title = `${edu.degree || ''}${edu.university ? `, ${edu.university}` : ''}${edu.location ? `, ${edu.location}` : ''}`;
          doc.text(title, margin, y);
          if (edu.start_date || edu.end_date) {
            const dates = `${edu.start_date || ''} — ${edu.end_date || ''}`;
            doc.setFont('times', 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text(dates, pageWidth - margin - doc.getTextWidth(dates), y);
          }
          y += 6;
        });
      }

      if (cvData?.languages) {
        addSection('Languages');
        addText(cvData.languages, 10);
      }

      doc.save(`${cvData?.full_name || 'CV'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error generating PDF. Please try again.');
    } finally {
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