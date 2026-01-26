import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ExperienceEntry from './ExperienceEntry';
import EducationEntry from './EducationEntry';
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Validation functions
const validateEmail = (email) => {
  if (!email) return { valid: false, message: 'Email is required' };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  return { valid: true };
};

const validateURL = (url) => {
  if (!url) return { valid: true }; // Optional field
  try {
    const urlToTest = url.startsWith('http') ? url : `https://${url}`;
    new URL(urlToTest);
    return { valid: true };
  } catch {
    return { valid: false, message: 'Please enter a valid URL (e.g., linkedin.com/in/yourname)' };
  }
};

const validatePhone = (phone) => {
  if (!phone) return { valid: true }; // Optional field
  // Basic phone validation - allows numbers, spaces, +, -, (, )
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  const digitsOnly = phone.replace(/\D/g, '');
  if (!phoneRegex.test(phone) || digitsOnly.length < 7) {
    return { valid: false, message: 'Please enter a valid phone number' };
  }
  return { valid: true };
};

const validateDate = (date) => {
  if (!date) return { valid: true }; // Optional field
  // Accept formats: YYYY-MM, YYYY-MM-DD, MM/YYYY, MM/DD/YYYY, or text like "Jan 2020", "Present"
  const trimmedDate = date.trim();
  if (trimmedDate.toLowerCase() === 'present' || trimmedDate.toLowerCase() === 'current') {
    return { valid: true };
  }
  // Check for common date formats
  const dateRegex = /^(\d{4}-\d{2}(-\d{2})?|\d{1,2}\/\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|[A-Za-z]{3}\s+\d{4})$/;
  if (!dateRegex.test(trimmedDate)) {
    return { valid: false, message: 'Invalid date format (use YYYY-MM, MM/YYYY, or "Jan 2020")' };
  }
  return { valid: true };
};

export default function CVForm({ formData, setFormData, onSubmit, isGenerating, generateCoverLetter, setGenerateCoverLetter }) {
  const [errors, setErrors] = useState({});
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experiences: [...(prev.experiences || []), { 
        job_title: '', company: '', location: '', 
        start_date: '', end_date: '', achievements: '' 
      }]
    }));
  };

  const updateExperience = (index, data) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => i === index ? data : exp)
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...(prev.education || []), { 
        degree: '', university: '', location: '', 
        start_date: '', end_date: '' 
      }]
    }));
  };

  const updateEducation = (index, data) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => i === index ? data : edu)
    }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.message;
    }
    
    // Validate phone
    if (formData.phone) {
      const phoneValidation = validatePhone(formData.phone);
      if (!phoneValidation.valid) {
        newErrors.phone = phoneValidation.message;
      }
    }
    
    // Validate LinkedIn URL
    if (formData.linkedin_url) {
      const urlValidation = validateURL(formData.linkedin_url);
      if (!urlValidation.valid) {
        newErrors.linkedin_url = urlValidation.message;
      }
    }
    
    // Validate experience dates
    formData.experiences?.forEach((exp, idx) => {
      if (exp.start_date) {
        const startDateValidation = validateDate(exp.start_date);
        if (!startDateValidation.valid) {
          newErrors[`exp_${idx}_start_date`] = startDateValidation.message;
        }
      }
      if (exp.end_date) {
        const endDateValidation = validateDate(exp.end_date);
        if (!endDateValidation.valid) {
          newErrors[`exp_${idx}_end_date`] = endDateValidation.message;
        }
      }
    });
    
    // Validate education dates
    formData.education?.forEach((edu, idx) => {
      if (edu.start_date) {
        const startDateValidation = validateDate(edu.start_date);
        if (!startDateValidation.valid) {
          newErrors[`edu_${idx}_start_date`] = startDateValidation.message;
        }
      }
      if (edu.end_date) {
        const endDateValidation = validateDate(edu.end_date);
        if (!endDateValidation.valid) {
          newErrors[`edu_${idx}_end_date`] = endDateValidation.message;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit();
    } else {
      toast.error('Please fix the validation errors before submitting');
    }
  };

  return (
    <section className="px-6 md:px-12 lg:px-24 py-20 bg-gray-50" id="cv-form">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-light text-black mb-12">
          Enter your details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-16">
          
          {/* Section A: Basic Information */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-6">Basic Information</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Full Name *</label>
                <Input
                  value={formData.full_name || ''}
                  onChange={(e) => updateField('full_name', e.target.value)}
                  required
                  className="border-gray-200 focus:border-gray-400 focus:ring-0"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Target Position</label>
                <Input
                  value={formData.target_position || ''}
                  onChange={(e) => updateField('target_position', e.target.value)}
                  placeholder="Senior Consultant IT-Audit"
                  className="border-gray-200 focus:border-gray-400 focus:ring-0"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Location</label>
                  <Input
                    value={formData.location || ''}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="Munich, Germany"
                    className="border-gray-200 focus:border-gray-400 focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Email *</label>
                  <Input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => {
                      updateField('email', e.target.value);
                      if (errors.email) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.email;
                          return newErrors;
                        });
                      }
                    }}
                    required
                    className={`border-gray-200 focus:border-gray-400 focus:ring-0 ${errors.email ? 'border-red-300' : ''}`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Phone</label>
                  <Input
                    value={formData.phone || ''}
                    onChange={(e) => {
                      updateField('phone', e.target.value);
                      if (errors.phone) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.phone;
                          return newErrors;
                        });
                      }
                    }}
                    placeholder="+49 123 456 7890"
                    className={`border-gray-200 focus:border-gray-400 focus:ring-0 ${errors.phone ? 'border-red-300' : ''}`}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">LinkedIn URL</label>
                  <Input
                    value={formData.linkedin_url || ''}
                    onChange={(e) => {
                      updateField('linkedin_url', e.target.value);
                      if (errors.linkedin_url) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.linkedin_url;
                          return newErrors;
                        });
                      }
                    }}
                    placeholder="linkedin.com/in/yourname"
                    className={`border-gray-200 focus:border-gray-400 focus:ring-0 ${errors.linkedin_url ? 'border-red-300' : ''}`}
                  />
                  {errors.linkedin_url && <p className="text-xs text-red-500 mt-1">{errors.linkedin_url}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Summary */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-6">Professional Summary</h3>
            <div className="space-y-4">
              <Textarea
                value={formData.summary || ''}
                onChange={(e) => updateField('summary', e.target.value)}
                placeholder="Brief professional summary (3-5 sentences)..."
                rows={4}
                disabled={formData.auto_generate_summary}
                className="border-gray-200 focus:border-gray-400 focus:ring-0 resize-none disabled:bg-gray-100"
              />
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="auto-summary"
                  checked={formData.auto_generate_summary || false}
                  onCheckedChange={(checked) => updateField('auto_generate_summary', checked)}
                />
                <label htmlFor="auto-summary" className="text-sm text-gray-600 cursor-pointer">
                  Generate summary automatically based on my info
                </label>
              </div>
            </div>
          </div>

          {/* Section C: Skills */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-6">Skills</h3>
            <Textarea
              value={formData.skills || ''}
              onChange={(e) => updateField('skills', e.target.value)}
              placeholder="IT Audit, SOX, SAP, SQL, Excel, Power BI"
              rows={2}
              className="border-gray-200 focus:border-gray-400 focus:ring-0 resize-none"
            />
            <p className="text-xs text-gray-400 mt-2">Comma-separated list</p>
          </div>

          {/* Section D: Professional Experience */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-6">Professional Experience</h3>
            <div className="space-y-0">
              {(formData.experiences || []).map((exp, index) => (
                <ExperienceEntry
                  key={index}
                  experience={exp}
                  index={index}
                  onChange={updateExperience}
                  onRemove={removeExperience}
                  canRemove={(formData.experiences || []).length > 1}
                  errors={{
                    start_date: errors[`exp_${index}_start_date`],
                    end_date: errors[`exp_${index}_end_date`]
                  }}
                  onErrorClear={(field) => {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors[`exp_${index}_${field}`];
                      return newErrors;
                    });
                  }}
                />
              ))}
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={addExperience}
              className="mt-4 border-gray-200 text-gray-600 hover:bg-gray-100 rounded-none"
            >
              + Add another experience
            </Button>
          </div>

          {/* Section E: Education */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-6">Education</h3>
            <div className="space-y-0">
              {(formData.education || []).map((edu, index) => (
                <EducationEntry
                  key={index}
                  education={edu}
                  index={index}
                  onChange={updateEducation}
                  onRemove={removeEducation}
                  canRemove={(formData.education || []).length > 1}
                  errors={{
                    start_date: errors[`edu_${index}_start_date`],
                    end_date: errors[`edu_${index}_end_date`]
                  }}
                  onErrorClear={(field) => {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors[`edu_${index}_${field}`];
                      return newErrors;
                    });
                  }}
                />
              ))}
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={addEducation}
              className="mt-4 border-gray-200 text-gray-600 hover:bg-gray-100 rounded-none"
            >
              + Add another education
            </Button>
          </div>

          {/* Section F: Languages */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-6">Languages</h3>
            <Textarea
              value={formData.languages || ''}
              onChange={(e) => updateField('languages', e.target.value)}
              placeholder="English — C1; German — B2; French — A2"
              rows={2}
              className="border-gray-200 focus:border-gray-400 focus:ring-0 resize-none"
            />
          </div>

          {/* Section G: Generation Settings */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-6">Generation Settings</h3>
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">CV Template</label>
                  <Select
                    value={formData.template || 'classic'}
                    onValueChange={(value) => updateField('template', value)}
                  >
                    <SelectTrigger className="border-gray-200 focus:ring-0 rounded-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">
                        <div className="flex items-center">
                          <span className="font-medium">Classic</span>
                          <span className="ml-2 text-xs text-gray-500">Traditional Layout</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="modern">
                        <div className="flex items-center">
                          <span className="font-medium">Modern</span>
                          <span className="ml-2 text-xs text-gray-500">Centered Layout</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="minimal">
                        <div className="flex items-center">
                          <span className="font-medium">Minimal</span>
                          <span className="ml-2 text-xs text-gray-500">Clean Layout</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">CV Style</label>
                  <Select
                    value={formData.style || 'professional'}
                    onValueChange={(value) => updateField('style', value)}
                  >
                    <SelectTrigger className="border-gray-200 focus:ring-0 rounded-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">
                        <div className="flex items-center">
                          <span className="font-medium">Professional</span>
                          <span className="ml-2 text-xs text-gray-500">Serif, Classic Colors</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="elegant">
                        <div className="flex items-center">
                          <span className="font-medium">Elegant</span>
                          <span className="ml-2 text-xs text-gray-500">Sans-serif, Slate Tones</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="bold">
                        <div className="flex items-center">
                          <span className="font-medium">Bold</span>
                          <span className="ml-2 text-xs text-gray-500">Sans-serif, Strong Contrast</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-xs text-gray-400">All 9 combinations (3 templates × 3 styles) are ATS-friendly and optimized for applicant tracking systems</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Target Country</label>
                  <Select
                    value={formData.target_country || 'Germany'}
                    onValueChange={(value) => updateField('target_country', value)}
                  >
                    <SelectTrigger className="border-gray-200 focus:ring-0 rounded-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="Austria">Austria</SelectItem>
                      <SelectItem value="EU">EU</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Seniority Level</label>
                  <Select
                    value={formData.seniority_level || 'Mid'}
                    onValueChange={(value) => updateField('seniority_level', value)}
                  >
                    <SelectTrigger className="border-gray-200 focus:ring-0 rounded-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Intern">Intern</SelectItem>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Mid">Mid</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Lead">Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Job Description (optional)</label>
                <Textarea
                  value={formData.job_description || ''}
                  onChange={(e) => updateField('job_description', e.target.value)}
                  placeholder="Paste the job description here to tailor your CV..."
                  rows={4}
                  className="border-gray-200 focus:border-gray-400 focus:ring-0 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Cover Letter Option */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-6">Additional Options</h3>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="cover-letter"
                checked={generateCoverLetter || false}
                onCheckedChange={setGenerateCoverLetter}
              />
              <label htmlFor="cover-letter" className="text-sm text-gray-600 cursor-pointer">
                Generate a matching cover letter
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-8">
            <Button 
              type="submit"
              disabled={isGenerating || !formData.full_name || !formData.email}
              className="w-full bg-black text-white hover:bg-gray-900 py-6 text-base font-normal rounded-none disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating your CV...
                </>
              ) : (
                'Generate CV'
              )}
            </Button>
          </div>
          </form>
          </div>
          </section>
          );
          }