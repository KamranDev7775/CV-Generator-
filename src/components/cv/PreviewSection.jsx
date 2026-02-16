import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import CVDocument from './CVDocument';
import { Loader2, Download, Copy, Check, Edit2, Save } from "lucide-react";
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { jsPDF } from 'jspdf';
import { useIsMounted } from '@/hooks/useIsMounted';

export default function PreviewSection({ cvData, onCvDataChange, onPayment, onSubscribe, isProcessingPayment }) {
  const [hasSubscription, setHasSubscription] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isEditingCoverLetter, setIsEditingCoverLetter] = useState(false);
  const [editedCoverLetter, setEditedCoverLetter] = useState(cvData?.cover_letter || '');
  const isMountedRef = useIsMounted();
  const copyTimeoutRef = useRef(null);

  useEffect(() => {
    checkSubscription();
    
    // Cleanup timeout on unmount
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const checkSubscription = async () => {
    try {
      const user = await base44.auth.me();
      if (user && isMountedRef.current) {
        const subs = await base44.entities.Subscription.filter({ user_email: user.email });
        const activeSub = subs.find(s => s.status === 'active' || s.status === 'trialing');
        if (isMountedRef.current) {
          setHasSubscription(!!activeSub);
        }
      }
    } catch (e) {
      // Not logged in or error
    } finally {
      if (isMountedRef.current) {
        setCheckingSubscription(false);
      }
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
    
    // Clear any existing timeout
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    
    copyTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setCopied(false);
      }
    }, 2000);
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
               Your CV is Ready!
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              You have an active subscription. Download or copy your CV below.
            </p>
          </div>

          {/* CV Preview - No watermark for subscribers */}
          <div className="bg-white rounded-2xl shadow-2xl p-4 mb-12">
            <div className="cv-preview-container border-2 border-gray-200 rounded-xl" style={{ width: '100%', minHeight: '1123px', height: 'auto' }}>
              <CVDocument data={cvData} showWatermark={false} />
            </div>
          </div>

          {/* Cover Letter Preview (if generated) - Editable for subscribers */}
          {cvData?.cover_letter && (
            <div className="mb-12">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    📄 Cover Letter
                  </h3>
                  {!isEditingCoverLetter ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditedCoverLetter(cvData.cover_letter);
                        setIsEditingCoverLetter(true);
                      }}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg px-4 py-2 font-medium"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
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
                      className="border-green-200 text-green-600 hover:bg-green-50 rounded-lg px-4 py-2 font-medium"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  )}
                </div>
                {isEditingCoverLetter ? (
                  <Textarea
                    value={editedCoverLetter}
                    onChange={(e) => setEditedCoverLetter(e.target.value)}
                    className="min-h-[300px] border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl text-base p-4"
                    placeholder="Edit your cover letter..."
                  />
                ) : (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 border-2 border-gray-200 rounded-xl">
                    <div className="whitespace-pre-line text-gray-800 leading-relaxed text-base">
                      {cvData.cover_letter}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Download Your CV</h3>
            <div className="flex flex-col sm:flex-row gap-6">
              <Button 
                onClick={downloadPDF}
                disabled={isGeneratingPDF}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 py-6 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                {isGeneratingPDF ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" />Generating PDF...</> : <><Download className="mr-3 h-5 w-5" />Download PDF</>}
              </Button>
              <Button 
                onClick={copyText}
                variant="outline"
                className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 py-6 text-lg font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                {copied ? <><Check className="mr-3 h-5 w-5 text-green-600" />Copied!</> : <><Copy className="mr-3 h-5 w-5" />Copy Text</>}
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // User does not have subscription - show payment options
  return (
    <section className="px-6 md:px-12 lg:px-24 py-20" id="preview">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
             Your CV is Ready!
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Review your generated CV below. Choose a plan to unlock PDF download and text copy.
          </p>
        </div>

        {/* CV Preview */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-12">
          <div className="cv-preview-container border-2 border-gray-200 rounded-xl overflow-hidden">
            <CVDocument data={cvData} showWatermark={true} />
          </div>
        </div>

        {/* Cover Letter Preview (if generated) */}
        {cvData?.cover_letter && (
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  📄 Cover Letter
                </h3>
                {!isEditingCoverLetter ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditedCoverLetter(cvData.cover_letter);
                      setIsEditingCoverLetter(true);
                    }}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg px-4 py-2 font-medium"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
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
                    className="border-green-200 text-green-600 hover:bg-green-50 rounded-lg px-4 py-2 font-medium"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                )}
              </div>
              {isEditingCoverLetter ? (
                <Textarea
                  value={editedCoverLetter}
                  onChange={(e) => setEditedCoverLetter(e.target.value)}
                  className="min-h-[300px] border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl text-base p-4"
                  placeholder="Edit your cover letter..."
                />
              ) : (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 border-2 border-gray-200 rounded-xl relative">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="transform -rotate-45 text-gray-300 text-2xl font-bold opacity-50">
                      🔒 Unlock for €1.99
                    </div>
                  </div>
                  <div className="whitespace-pre-line text-gray-800 leading-relaxed text-base blur-sm select-none">
                    {cvData.cover_letter}
                  </div>
                </div>
              )}
              <p className="text-sm text-gray-600 mt-4 flex items-center">
                {isEditingCoverLetter ? '💡 Make your edits and click Save' : '🔓 Full cover letter available after payment'}
              </p>
            </div>
          </div>
        )}

        {/* Pricing Options */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
             Choose Your Plan
          </h3>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* One-time purchase */}
            <div className="p-8 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                 Popular
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">One-Time Purchase</h4>
              <p className="text-4xl font-bold text-blue-600 mb-4">€1.99</p>
              <p className="text-gray-700 mb-6 leading-relaxed">14 days access to download & edit this CV</p>
              <Button 
                onClick={onPayment}
                disabled={isProcessingPayment}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Get CV for €1.99'
                )}
              </Button>
            </div>

            {/* Monthly subscription */}
            <div className="p-8 border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              <h4 className="text-2xl font-bold text-gray-900 mb-3">Monthly Subscription</h4>
              <p className="text-4xl font-bold text-gray-700 mb-4">€6.99<span className="text-lg text-gray-500">/month</span></p>
              <p className="text-gray-700 mb-6 leading-relaxed">Unlimited CVs, edits & downloads</p>
              <Link to={createPageUrl('Pricing')}>
                <Button 
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Subscribe Monthly
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}