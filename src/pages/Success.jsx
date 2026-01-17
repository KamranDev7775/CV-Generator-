import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import CVDocument from '@/components/cv/CVDocument';
import { Check, Copy, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = 'ats_cv_form_data';

export default function Success() {
  const [cvData, setCvData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const cvRef = useRef(null);

  useEffect(() => {
    loadCVData();
  }, []);

  const loadCVData = async () => {
    try {
      // Get submission ID from URL
      const urlParams = new URLSearchParams(window.location.search);
      const submissionId = urlParams.get('submission_id');

      if (!submissionId) {
        setAccessDenied(true);
        setIsLoading(false);
        return;
      }

      // Check if payment was completed
      const submission = await base44.entities.CVSubmission.filter({ id: submissionId });
      if (!submission || submission.length === 0 || submission[0].payment_status !== 'completed') {
        setAccessDenied(true);
        setIsLoading(false);
        return;
      }

      // Update payment status
      await base44.entities.CVSubmission.update(submissionId, {
        payment_status: 'completed'
      });

      // Load from localStorage
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCvData(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading CV data:', error);
      setAccessDenied(true);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCVText = () => {
    if (!cvData) return '';

    const lines = [];
    
    // Header
    lines.push(cvData.full_name || '');
    if (cvData.target_position) lines.push(cvData.target_position);
    
    const contactParts = [cvData.email, cvData.phone, cvData.linkedin_url, cvData.location].filter(Boolean);
    if (contactParts.length) lines.push(contactParts.join(' | '));
    lines.push('');

    // Summary
    if (cvData.summary) {
      lines.push('PROFESSIONAL SUMMARY');
      lines.push(cvData.summary);
      lines.push('');
    }

    // Skills
    if (cvData.skills) {
      lines.push('SKILLS');
      lines.push(cvData.skills);
      lines.push('');
    }

    // Experience
    if (cvData.experiences?.length && cvData.experiences.some(e => e.job_title || e.company)) {
      lines.push('PROFESSIONAL EXPERIENCE');
      cvData.experiences
        .filter(e => e.job_title || e.company)
        .forEach(exp => {
          const datePart = exp.start_date || exp.end_date 
            ? ` (${exp.start_date} - ${exp.end_date || 'Present'})` 
            : '';
          lines.push(`${exp.job_title}, ${exp.company}, ${exp.location}${datePart}`);
          if (exp.achievements) {
            exp.achievements.split('\n').filter(a => a.trim()).forEach(a => {
              lines.push(`• ${a.trim()}`);
            });
          }
          lines.push('');
        });
    }

    // Education
    if (cvData.education?.length && cvData.education.some(e => e.degree || e.university)) {
      lines.push('EDUCATION');
      cvData.education
        .filter(e => e.degree || e.university)
        .forEach(edu => {
          const datePart = edu.start_date || edu.end_date 
            ? ` (${edu.start_date} - ${edu.end_date})` 
            : '';
          lines.push(`${edu.degree}, ${edu.university}, ${edu.location}${datePart}`);
        });
      lines.push('');
    }

    // Languages
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
      // Create a printable version
      const printWindow = window.open('', '_blank');
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${cvData.full_name} - CV</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Times New Roman', Times, serif;
              font-size: 11pt;
              line-height: 1.4;
              color: #000;
              background: #fff;
              padding: 40px 50px;
            }
            header {
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 1px solid #ccc;
            }
            h1 {
              font-size: 18pt;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .position {
              font-size: 12pt;
              color: #333;
              margin-bottom: 8px;
            }
            .contact {
              font-size: 10pt;
              color: #555;
            }
            section {
              margin-bottom: 18px;
            }
            h2 {
              font-size: 10pt;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #555;
              margin-bottom: 8px;
              font-family: Arial, sans-serif;
            }
            p {
              margin-bottom: 8px;
            }
            .experience-item {
              margin-bottom: 12px;
            }
            .experience-header {
              margin-bottom: 5px;
            }
            .job-title {
              font-weight: bold;
            }
            .dates {
              float: right;
              font-size: 10pt;
              color: #555;
            }
            ul {
              margin-left: 20px;
            }
            li {
              margin-bottom: 3px;
            }
            .education-item {
              margin-bottom: 8px;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <header>
            <h1>${cvData.full_name || ''}</h1>
            ${cvData.target_position ? `<div class="position">${cvData.target_position}</div>` : ''}
            <div class="contact">${[cvData.email, cvData.phone, cvData.linkedin_url, cvData.location].filter(Boolean).join(' | ')}</div>
          </header>

          ${cvData.summary ? `
          <section>
            <h2>Professional Summary</h2>
            <p>${cvData.summary}</p>
          </section>
          ` : ''}

          ${cvData.skills ? `
          <section>
            <h2>Skills</h2>
            <p>${cvData.skills}</p>
          </section>
          ` : ''}

          ${cvData.experiences?.length && cvData.experiences.some(e => e.job_title || e.company) ? `
          <section>
            <h2>Professional Experience</h2>
            ${cvData.experiences.filter(e => e.job_title || e.company).map(exp => `
              <div class="experience-item">
                <div class="experience-header">
                  ${exp.start_date || exp.end_date ? `<span class="dates">${exp.start_date} — ${exp.end_date || 'Present'}</span>` : ''}
                  <span class="job-title">${exp.job_title}</span>${exp.company ? `, ${exp.company}` : ''}${exp.location ? `, ${exp.location}` : ''}
                </div>
                ${exp.achievements ? `
                <ul>
                  ${exp.achievements.split('\n').filter(a => a.trim()).map(a => `<li>${a.trim()}</li>`).join('')}
                </ul>
                ` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${cvData.education?.length && cvData.education.some(e => e.degree || e.university) ? `
          <section>
            <h2>Education</h2>
            ${cvData.education.filter(e => e.degree || e.university).map(edu => `
              <div class="education-item">
                ${edu.start_date || edu.end_date ? `<span class="dates">${edu.start_date} — ${edu.end_date}</span>` : ''}
                <span class="job-title">${edu.degree}</span>${edu.university ? `, ${edu.university}` : ''}${edu.location ? `, ${edu.location}` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${cvData.languages ? `
          <section>
            <h2>Languages</h2>
            <p>${cvData.languages}</p>
          </section>
          ` : ''}
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load then trigger print
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (accessDenied || !cvData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-light text-black mb-4">Access Denied</h1>
          <p className="text-gray-500 mb-8">This page is only accessible after successful payment.</p>
          <a href="/" className="text-black underline hover:no-underline">
            Go back to start
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="px-6 md:px-12 lg:px-24 py-20">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
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
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button 
              onClick={downloadPDF}
              disabled={isGeneratingPDF}
              className="flex-1 bg-black text-white hover:bg-gray-900 py-6 text-base font-normal rounded-none"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </>
              )}
            </Button>
            <Button 
              onClick={copyText}
              variant="outline"
              className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 py-6 text-base font-normal rounded-none"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy CV Text
                </>
              )}
            </Button>
          </div>

          {/* CV Preview */}
          <div className="border border-gray-200 shadow-sm" ref={cvRef}>
            <CVDocument data={cvData} showWatermark={false} />
          </div>

          {/* Back link */}
          <div className="mt-12 text-center">
            <a 
              href="/" 
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Generate another CV
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}