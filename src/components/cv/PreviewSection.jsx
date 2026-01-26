import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import CVDocument from './CVDocument';
import { Loader2 } from "lucide-react";
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';

export default function PreviewSection({ cvData, onPayment, onSubscribe, isProcessingPayment }) {
  const [hasSubscription, setHasSubscription] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const user = await base44.auth.me();
      if (user) {
        const subs = await base44.entities.Subscription.filter({ user_email: user.email });
        const activeSub = subs.find(s => s.status === 'active' || s.status === 'trialing');
        setHasSubscription(!!activeSub);
      }
    } catch (e) {
      // Not logged in or error
    } finally {
      setCheckingSubscription(false);
    }
  };

  if (checkingSubscription) {
    return (
      <section className="px-6 md:px-12 lg:px-24 py-20" id="preview">
        <div className="max-w-3xl mx-auto flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </section>
    );
  }

  const generateCVText = () => {
    if (!cvData) return '';
    const lines = [];
    lines.push(cvData.full_name || '');
    if (cvData.target_position) lines.push(cvData.target_position);
    const contactParts = [cvData.email, cvData.phone, cvData.linkedin_url, cvData.location].filter(Boolean);
    if (contactParts.length) lines.push(contactParts.join(' | '));
    lines.push('');
    if (cvData.summary) { lines.push('PROFESSIONAL SUMMARY'); lines.push(cvData.summary); lines.push(''); }
    if (cvData.skills) { lines.push('SKILLS'); lines.push(cvData.skills); lines.push(''); }
    if (cvData.experiences?.length && cvData.experiences.some(e => e.job_title || e.company)) {
      lines.push('PROFESSIONAL EXPERIENCE');
      cvData.experiences.filter(e => e.job_title || e.company).forEach(exp => {
        const datePart = exp.start_date || exp.end_date ? ` (${exp.start_date} - ${exp.end_date || 'Present'})` : '';
        lines.push(`${exp.job_title}, ${exp.company}, ${exp.location}${datePart}`);
        if (exp.achievements) { exp.achievements.split('\n').filter(a => a.trim()).forEach(a => { lines.push(`• ${a.trim()}`); }); }
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
    if (cvData.languages) { lines.push('LANGUAGES'); lines.push(cvData.languages); }
    return lines.join('\n');
  };

  const copyText = async () => {
    const text = generateCVText();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = async () => {
    setIsGeneratingPDF(true);
    const printWindow = window.open('', '_blank');
    const htmlContent = `<!DOCTYPE html><html><head><title>${cvData?.full_name || 'CV'} - CV</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Times New Roman',Times,serif;font-size:11pt;line-height:1.4;color:#000;background:#fff;padding:40px 50px}header{margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid #ccc}h1{font-size:18pt;font-weight:bold;margin-bottom:5px}.position{font-size:12pt;color:#333;margin-bottom:8px}.contact{font-size:10pt;color:#555}section{margin-bottom:18px}h2{font-size:10pt;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#555;margin-bottom:8px;font-family:Arial,sans-serif}p{margin-bottom:8px}.experience-item{margin-bottom:12px}.experience-header{margin-bottom:5px}.job-title{font-weight:bold}.dates{float:right;font-size:10pt;color:#555}ul{margin-left:20px}li{margin-bottom:3px}.education-item{margin-bottom:8px}@media print{body{padding:0}}</style></head><body><header><h1>${cvData?.full_name || ''}</h1>${cvData?.target_position ? `<div class="position">${cvData.target_position}</div>` : ''}<div class="contact">${[cvData?.email, cvData?.phone, cvData?.linkedin_url, cvData?.location].filter(Boolean).join(' | ')}</div></header>${cvData?.summary ? `<section><h2>Professional Summary</h2><p>${cvData.summary}</p></section>` : ''}${cvData?.skills ? `<section><h2>Skills</h2><p>${cvData.skills}</p></section>` : ''}${cvData?.experiences?.length && cvData.experiences.some(e => e.job_title || e.company) ? `<section><h2>Professional Experience</h2>${cvData.experiences.filter(e => e.job_title || e.company).map(exp => `<div class="experience-item"><div class="experience-header">${exp.start_date || exp.end_date ? `<span class="dates">${exp.start_date} — ${exp.end_date || 'Present'}</span>` : ''}<span class="job-title">${exp.job_title}</span>${exp.company ? `, ${exp.company}` : ''}${exp.location ? `, ${exp.location}` : ''}</div>${exp.achievements ? `<ul>${exp.achievements.split('\n').filter(a => a.trim()).map(a => `<li>${a.trim()}</li>`).join('')}</ul>` : ''}</div>`).join('')}</section>` : ''}${cvData?.education?.length && cvData.education.some(e => e.degree || e.university) ? `<section><h2>Education</h2>${cvData.education.filter(e => e.degree || e.university).map(edu => `<div class="education-item">${edu.start_date || edu.end_date ? `<span class="dates">${edu.start_date} — ${edu.end_date}</span>` : ''}<span class="job-title">${edu.degree}</span>${edu.university ? `, ${edu.university}` : ''}${edu.location ? `, ${edu.location}` : ''}</div>`).join('')}</section>` : ''}${cvData?.languages ? `<section><h2>Languages</h2><p>${cvData.languages}</p></section>` : ''}</body></html>`;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => { printWindow.print(); setIsGeneratingPDF(false); };
  };

  // User has active subscription - show unlocked view
  if (hasSubscription) {
    return (
      if (!cvData) return '';
      const lines = [];
      lines.push(cvData.full_name || '');
      if (cvData.target_position) lines.push(cvData.target_position);
      const contactParts = [cvData.email, cvData.phone, cvData.linkedin_url, cvData.location].filter(Boolean);
      if (contactParts.length) lines.push(contactParts.join(' | '));
      lines.push('');
      if (cvData.summary) { lines.push('PROFESSIONAL SUMMARY'); lines.push(cvData.summary); lines.push(''); }
      if (cvData.skills) { lines.push('SKILLS'); lines.push(cvData.skills); lines.push(''); }
      if (cvData.experiences?.length && cvData.experiences.some(e => e.job_title || e.company)) {
        lines.push('PROFESSIONAL EXPERIENCE');
        cvData.experiences.filter(e => e.job_title || e.company).forEach(exp => {
          const datePart = exp.start_date || exp.end_date ? ` (${exp.start_date} - ${exp.end_date || 'Present'})` : '';
          lines.push(`${exp.job_title}, ${exp.company}, ${exp.location}${datePart}`);
          if (exp.achievements) { exp.achievements.split('\n').filter(a => a.trim()).forEach(a => { lines.push(`• ${a.trim()}`); }); }
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
      if (cvData.languages) { lines.push('LANGUAGES'); lines.push(cvData.languages); }
      return lines.join('\n');
    };

    const copyText = async () => {
      const text = generateCVText();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const downloadPDF = async () => {
      setIsGeneratingPDF(true);
      const printWindow = window.open('', '_blank');
      const htmlContent = `<!DOCTYPE html><html><head><title>${cvData.full_name} - CV</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Times New Roman',Times,serif;font-size:11pt;line-height:1.4;color:#000;background:#fff;padding:40px 50px}header{margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid #ccc}h1{font-size:18pt;font-weight:bold;margin-bottom:5px}.position{font-size:12pt;color:#333;margin-bottom:8px}.contact{font-size:10pt;color:#555}section{margin-bottom:18px}h2{font-size:10pt;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#555;margin-bottom:8px;font-family:Arial,sans-serif}p{margin-bottom:8px}.experience-item{margin-bottom:12px}.experience-header{margin-bottom:5px}.job-title{font-weight:bold}.dates{float:right;font-size:10pt;color:#555}ul{margin-left:20px}li{margin-bottom:3px}.education-item{margin-bottom:8px}@media print{body{padding:0}}</style></head><body><header><h1>${cvData.full_name || ''}</h1>${cvData.target_position ? `<div class="position">${cvData.target_position}</div>` : ''}<div class="contact">${[cvData.email, cvData.phone, cvData.linkedin_url, cvData.location].filter(Boolean).join(' | ')}</div></header>${cvData.summary ? `<section><h2>Professional Summary</h2><p>${cvData.summary}</p></section>` : ''}${cvData.skills ? `<section><h2>Skills</h2><p>${cvData.skills}</p></section>` : ''}${cvData.experiences?.length && cvData.experiences.some(e => e.job_title || e.company) ? `<section><h2>Professional Experience</h2>${cvData.experiences.filter(e => e.job_title || e.company).map(exp => `<div class="experience-item"><div class="experience-header">${exp.start_date || exp.end_date ? `<span class="dates">${exp.start_date} — ${exp.end_date || 'Present'}</span>` : ''}<span class="job-title">${exp.job_title}</span>${exp.company ? `, ${exp.company}` : ''}${exp.location ? `, ${exp.location}` : ''}</div>${exp.achievements ? `<ul>${exp.achievements.split('\n').filter(a => a.trim()).map(a => `<li>${a.trim()}</li>`).join('')}</ul>` : ''}</div>`).join('')}</section>` : ''}${cvData.education?.length && cvData.education.some(e => e.degree || e.university) ? `<section><h2>Education</h2>${cvData.education.filter(e => e.degree || e.university).map(edu => `<div class="education-item">${edu.start_date || edu.end_date ? `<span class="dates">${edu.start_date} — ${edu.end_date}</span>` : ''}<span class="job-title">${edu.degree}</span>${edu.university ? `, ${edu.university}` : ''}${edu.location ? `, ${edu.location}` : ''}</div>`).join('')}</section>` : ''}${cvData.languages ? `<section><h2>Languages</h2><p>${cvData.languages}</p></section>` : ''}</body></html>`;
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.onload = () => { printWindow.print(); setIsGeneratingPDF(false); };
    };

    return (
      <section className="px-6 md:px-12 lg:px-24 py-20" id="preview">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light text-black mb-4">
            Your CV is ready
          </h2>
          <p className="text-gray-500 mb-12">
            You have an active subscription. Download or copy your CV below.
          </p>

          {/* CV Preview - No watermark for subscribers */}
          <div className="border border-gray-200 shadow-sm mb-12">
            <CVDocument data={cvData} showWatermark={false} />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={downloadPDF}
              disabled={isGeneratingPDF}
              className="flex-1 bg-black text-white hover:bg-gray-900 py-6 text-base font-normal rounded-none"
            >
              {isGeneratingPDF ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : 'Download PDF'}
            </Button>
            <Button 
              onClick={copyText}
              variant="outline"
              className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 py-6 text-base font-normal rounded-none"
            >
              {copied ? 'Copied!' : 'Copy CV Text'}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // User does not have subscription - show payment options
  return (
    <section className="px-6 md:px-12 lg:px-24 py-20" id="preview">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-light text-black mb-4">
          Your CV is ready
        </h2>
        <p className="text-gray-500 mb-12">
          Review your generated CV below. Choose a plan to unlock PDF download and text copy.
        </p>

        {/* CV Preview */}
        <div className="border border-gray-200 shadow-sm mb-12">
          <CVDocument data={cvData} showWatermark={true} />
        </div>

        {/* Pricing Options */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* One-time purchase */}
          <div className="p-6 border border-gray-200 bg-white">
            <h3 className="text-lg font-medium text-black mb-2">One-Time Purchase</h3>
            <p className="text-3xl font-light text-black mb-4">€1.99</p>
            <p className="text-sm text-gray-600 mb-4">14 days access to download & edit this CV</p>
            <Button 
              onClick={onPayment}
              disabled={isProcessingPayment}
              className="w-full bg-black text-white hover:bg-gray-900 py-4 text-base font-normal rounded-none"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Get CV for €1.99'
              )}
            </Button>
          </div>

          {/* Monthly subscription */}
          <div className="p-6 border border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-black mb-2">Monthly Subscription</h3>
            <p className="text-3xl font-light text-black mb-4">€6.99<span className="text-sm text-gray-500">/month</span></p>
            <p className="text-sm text-gray-600 mb-4">Unlimited CVs, edits & downloads</p>
            <Link to={createPageUrl('Pricing')}>
              <Button 
                variant="outline"
                className="w-full border-gray-300 text-black hover:bg-gray-100 py-4 text-base font-normal rounded-none"
              >
                Subscribe Monthly
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}