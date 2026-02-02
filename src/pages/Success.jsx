import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import CVDocument from '@/components/cv/CVDocument';
import { Check, Copy, Download, Loader2, Edit2, Save } from "lucide-react";
import { toast } from "sonner";
import { removeSecureStorage, getSecureStorage } from '../utils/storage';
import { useIsMounted } from '@/hooks/useIsMounted';

// HTML escaping function to prevent XSS
const escapeHtml = (text) => {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export default function Success() {
  const [cvData, setCvData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [paymentPending, setPaymentPending] = useState(false);
  const [isEditingCoverLetter, setIsEditingCoverLetter] = useState(false);
  const [editedCoverLetter, setEditedCoverLetter] = useState('');
  const [isSavingCoverLetter, setIsSavingCoverLetter] = useState(false);
  const cvRef = useRef(null);
  const isMountedRef = useIsMounted();
  const copyTimeoutRef = useRef(null);

  useEffect(() => {
    loadCVData();
    
    // Cleanup timeout on unmount
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const loadCVData = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const submissionId = urlParams.get('submission_id');

      if (!submissionId) {
        setIsLoading(false);
        return;
      }

      // Verify user authentication and ownership
      let currentUser = null;
      try {
        currentUser = await base44.auth.me();
      } catch (authError) {
        console.error('Authentication error:', authError);
        setIsLoading(false);
        return;
      }

      // Poll for payment completion (webhook updates the status)
      let attempts = 0;
      const maxAttempts = 10;
      
      while (attempts < maxAttempts && isMountedRef.current) {
        // Verify ownership: filter by both ID and created_by
        const submissions = await base44.entities.CVSubmission.filter({ 
          id: submissionId,
          created_by: currentUser.email 
        });
        
        if (submissions?.length > 0 && isMountedRef.current) {
          const submission = submissions[0];
          
          if (submission.payment_status === 'completed') {
            // Payment confirmed by webhook - load CV data from database
            // Extract CV data from submission (all form fields are stored in submission)
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
            // Clear encrypted localStorage after successful payment (data is now in database)
            removeSecureStorage('form_data');
            removeSecureStorage('submission_id');
            setIsLoading(false);
            return;
          }
        }
        
        attempts++;
        if (attempts < maxAttempts && isMountedRef.current) {
          await new Promise(resolve => setTimeout(resolve, 1500)); // Wait 1.5s between checks
        }
      }
      
      // Payment not yet confirmed after polling - try to load from database anyway
      // Verify ownership: filter by both ID and created_by
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
        setPaymentPending(true);
      } else {
        // Database load failed - fallback to encrypted localStorage
        const saved = getSecureStorage('form_data');
        if (saved) {
          setCvData(saved);
          setPaymentPending(true);
        }
      }
    } catch (error) {
      console.error('Error loading CV data:', error);
      // Database load failed - fallback to encrypted localStorage
      const saved = getSecureStorage('form_data');
      if (saved) {
        setCvData(saved);
        setPaymentPending(true);
      }
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

  const downloadCoverLetterPDF = async () => {
    if (!cvData.cover_letter) return;
    
    setIsGeneratingPDF(true);
    
    try {
      const printWindow = window.open('', '_blank');
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${escapeHtml(cvData.full_name || 'CV')} - Cover Letter</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Times New Roman', Times, serif;
              font-size: 11pt;
              line-height: 1.6;
              color: #000;
              background: #fff;
              padding: 40px 50px;
            }
            .header {
              margin-bottom: 30px;
            }
            .contact-info {
              font-size: 10pt;
              color: #555;
              margin-bottom: 20px;
            }
            .date {
              margin-bottom: 20px;
            }
            .content {
              white-space: pre-line;
              margin-bottom: 20px;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="contact-info">
              ${escapeHtml(cvData.full_name || '')}<br>
              ${cvData.email ? escapeHtml(cvData.email) : ''}${cvData.phone ? ' | ' + escapeHtml(cvData.phone) : ''}${cvData.location ? ' | ' + escapeHtml(cvData.location) : ''}
            </div>
            <div class="date">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <div class="content">${escapeHtml(cvData.cover_letter)}</div>
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
      console.error('Error generating cover letter PDF:', error);
      toast.error('Error generating cover letter PDF. Please try again.');
      setIsGeneratingPDF(false);
    }
  };

  const downloadPDF = async () => {
    if (isGeneratingPDF) return; // Prevent double-clicks
    setIsGeneratingPDF(true);
    
    try {
      // Create a printable version
      const printWindow = window.open('', '_blank');
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${escapeHtml(cvData.full_name || 'CV')} - CV</title>
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
            <h1>${escapeHtml(cvData.full_name || '')}</h1>
            ${cvData.target_position ? `<div class="position">${escapeHtml(cvData.target_position)}</div>` : ''}
            <div class="contact">${[cvData.email, cvData.phone, cvData.linkedin_url, cvData.location].filter(Boolean).map(escapeHtml).join(' | ')}</div>
          </header>

          ${cvData.summary ? `
          <section>
            <h2>Professional Summary</h2>
            <p>${escapeHtml(cvData.summary)}</p>
          </section>
          ` : ''}

          ${cvData.skills ? `
          <section>
            <h2>Skills</h2>
            <p>${escapeHtml(cvData.skills)}</p>
          </section>
          ` : ''}

          ${cvData.experiences?.length && cvData.experiences.some(e => e.job_title || e.company) ? `
          <section>
            <h2>Professional Experience</h2>
            ${cvData.experiences.filter(e => e.job_title || e.company).map(exp => `
              <div class="experience-item">
                <div class="experience-header">
                  ${exp.start_date || exp.end_date ? `<span class="dates">${escapeHtml(exp.start_date)} — ${escapeHtml(exp.end_date || 'Present')}</span>` : ''}
                  <span class="job-title">${escapeHtml(exp.job_title || '')}</span>${exp.company ? `, ${escapeHtml(exp.company)}` : ''}${exp.location ? `, ${escapeHtml(exp.location)}` : ''}
                </div>
                ${exp.achievements ? `
                <ul>
                  ${exp.achievements.split('\n').filter(a => a.trim()).map(a => `<li>${escapeHtml(a.trim())}</li>`).join('')}
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
                ${edu.start_date || edu.end_date ? `<span class="dates">${escapeHtml(edu.start_date || '')} — ${escapeHtml(edu.end_date || '')}</span>` : ''}
                <span class="job-title">${escapeHtml(edu.degree || '')}</span>${edu.university ? `, ${escapeHtml(edu.university)}` : ''}${edu.location ? `, ${escapeHtml(edu.location)}` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${cvData.languages ? `
          <section>
            <h2>Languages</h2>
            <p>${escapeHtml(cvData.languages)}</p>
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

  if (!cvData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-light text-black mb-4">CV Not Found</h1>
          <p className="text-gray-500 mb-2">
            We couldn't load your CV. This may happen if:
          </p>
          <ul className="text-sm text-gray-500 mb-6 text-left list-disc list-inside space-y-1">
            <li>The payment is still processing (please wait a few moments and refresh)</li>
            <li>The submission ID is invalid or expired</li>
            <li>There was a connection issue</li>
            <li>Your browser data was cleared</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/" 
              className="text-black underline hover:no-underline"
            >
              Go back to start
            </a>
            <button
              onClick={() => window.location.reload()}
              className="text-black underline hover:no-underline"
            >
              Refresh page
            </button>
          </div>
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
                  Download CV PDF
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

          {/* Cover Letter Section */}
          {cvData.cover_letter && (
            <div className="mb-12">
              <div className="border-t border-gray-200 pt-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-light text-black">Cover Letter</h2>
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
                      onClick={async () => {
                        setIsSavingCoverLetter(true);
                        try {
                          // Update local state
                          setCvData(prev => ({ ...prev, cover_letter: editedCoverLetter }));
                          
                          // Update in database if we have submission_id
                          const urlParams = new URLSearchParams(window.location.search);
                          const submissionId = urlParams.get('submission_id');
                          if (submissionId) {
                            try {
                              const currentUser = await base44.auth.me();
                              if (currentUser) {
                                const submissions = await base44.entities.CVSubmission.filter({ 
                                  id: submissionId,
                                  created_by: currentUser.email 
                                });
                                if (submissions?.length > 0) {
                                  await base44.entities.CVSubmission.update(submissionId, {
                                    cover_letter: editedCoverLetter
                                  });
                                  toast.success('Cover letter updated successfully');
                                }
                              }
                            } catch (error) {
                              console.error('Error updating cover letter in database:', error);
                              toast.error('Failed to save to database, but changes are saved locally');
                            }
                          }
                          
                          setIsEditingCoverLetter(false);
                        } catch (error) {
                          console.error('Error saving cover letter:', error);
                          toast.error('Failed to save cover letter');
                        } finally {
                          setIsSavingCoverLetter(false);
                        }
                      }}
                      disabled={isSavingCoverLetter}
                      className="border-green-200 text-green-600 hover:bg-green-50 rounded-none"
                    >
                      {isSavingCoverLetter ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </>
                      )}
                    </Button>
                  )}
                </div>
                
                {isEditingCoverLetter ? (
                  <div className="mb-6">
                    <Textarea
                      value={editedCoverLetter}
                      onChange={(e) => setEditedCoverLetter(e.target.value)}
                      className="min-h-[300px] border-gray-200 focus:ring-0 rounded-none text-sm"
                      placeholder="Edit your cover letter..."
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Make your edits and click Save to update your cover letter
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 mb-6 border border-gray-200">
                    <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                      {cvData.cover_letter}
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={downloadCoverLetterPDF}
                  disabled={isGeneratingPDF || isEditingCoverLetter}
                  variant="outline"
                  className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 py-4 text-base font-normal rounded-none"
                >
                  {isGeneratingPDF ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Cover Letter PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

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