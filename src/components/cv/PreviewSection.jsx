import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import CVDocument from './CVDocument';
import { Loader2, Download, Copy, Check, Edit2, Save } from "lucide-react";
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { jsPDF } from 'jspdf';

export default function PreviewSection({ cvData, onCvDataChange, onPayment, onSubscribe, isProcessingPayment }) {
  const [hasSubscription, setHasSubscription] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isEditingCoverLetter, setIsEditingCoverLetter] = useState(false);
  const [editedCoverLetter, setEditedCoverLetter] = useState(cvData?.cover_letter || '');

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
    if (isGeneratingPDF) return; // Prevent double-clicks
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let y = 20;

      // Helper to add text with word wrap
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

      // Line separator
      y += 2;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;

      // Summary
      if (cvData?.summary) {
        addSection('Professional Summary');
        addText(cvData.summary, 10);
      }

      // Skills
      if (cvData?.skills) {
        addSection('Skills');
        addText(cvData.skills, 10);
      }

      // Experience
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

      // Education
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

      // Languages
      if (cvData?.languages) {
        addSection('Languages');
        addText(cvData.languages, 10);
      }

      doc.save(`${cvData?.full_name || 'CV'}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
    } finally {
      setIsGeneratingPDF(false);
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

  // User has active subscription - show unlocked view
  if (hasSubscription) {
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
          <div className="border border-gray-200 shadow-sm mb-8">
            <CVDocument data={cvData} showWatermark={false} />
          </div>

          {/* Cover Letter Preview (if generated) - Editable for subscribers */}
          {cvData?.cover_letter && (
            <div className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-black">Cover Letter</h3>
                {!isEditingCoverLetter ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditedCoverLetter(cvData.cover_letter);
                      setIsEditingCoverLetter(true);
                    }}
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-none"
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (onCvDataChange) {
                        onCvDataChange({ ...cvData, cover_letter: editedCoverLetter });
                      }
                      setIsEditingCoverLetter(false);
                    }}
                    className="border-green-200 text-green-600 hover:bg-green-50 rounded-none"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                )}
              </div>
              {isEditingCoverLetter ? (
                <Textarea
                  value={editedCoverLetter}
                  onChange={(e) => setEditedCoverLetter(e.target.value)}
                  className="min-h-[300px] border-gray-200 focus:ring-0 rounded-none text-sm"
                  placeholder="Edit your cover letter..."
                />
              ) : (
                <div className="border border-gray-200 bg-gray-50 p-6">
                  <div className="whitespace-pre-line text-gray-800 leading-relaxed text-sm">
                    {cvData.cover_letter}
                  </div>
                </div>
              )}
            </div>
          )}

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
        <div className="border border-gray-200 shadow-sm mb-8">
          <CVDocument data={cvData} showWatermark={true} />
        </div>

        {/* Cover Letter Preview (if generated) */}
        {cvData?.cover_letter && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-black">Cover Letter</h3>
              {!isEditingCoverLetter ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditedCoverLetter(cvData.cover_letter);
                    setIsEditingCoverLetter(true);
                  }}
                  className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-none"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (onCvDataChange) {
                      onCvDataChange({ ...cvData, cover_letter: editedCoverLetter });
                    }
                    setIsEditingCoverLetter(false);
                  }}
                  className="border-green-200 text-green-600 hover:bg-green-50 rounded-none"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              )}
            </div>
            {isEditingCoverLetter ? (
              <Textarea
                value={editedCoverLetter}
                onChange={(e) => setEditedCoverLetter(e.target.value)}
                className="min-h-[300px] border-gray-200 focus:ring-0 rounded-none text-sm"
                placeholder="Edit your cover letter..."
              />
            ) : (
              <div className="border border-gray-200 bg-gray-50 p-6 relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="transform -rotate-45 text-gray-200 text-xl font-bold opacity-60">
                    Unlock for €1.99
                  </div>
                </div>
                <div className="whitespace-pre-line text-gray-800 leading-relaxed text-sm blur-sm select-none">
                  {cvData.cover_letter}
                </div>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              {isEditingCoverLetter ? 'Make your edits and click Save' : 'Full cover letter available after payment'}
            </p>
          </div>
        )}

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