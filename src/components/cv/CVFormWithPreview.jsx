import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ExperienceEntry from './ExperienceEntry';
import EducationEntry from './EducationEntry';
import CVDocument from './CVDocument';
import LanguageSelector from './LanguageSelector';
import ProgressBar from './ProgressBar';
import TemplateSwitcher from './TemplateSwitcher';
import { Loader2, Eye } from "lucide-react";
import { toast } from "sonner";
import { mergeDataForPreview, hasUserData } from '@/utils/sampleData';

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
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  const digitsOnly = phone.replace(/\D/g, '');
  if (!phoneRegex.test(phone) || digitsOnly.length < 7) {
    return { valid: false, message: 'Please enter a valid phone number' };
  }
  return { valid: true };
};

const validateDate = (date) => {
  if (!date) return { valid: true }; // Optional field
  const trimmedDate = date.trim();
  
  // Accept "Present" or "Current"
  if (trimmedDate.toLowerCase() === 'present' || trimmedDate.toLowerCase() === 'current') {
    return { valid: true };
  }
  
  // Very flexible date validation - accept almost any reasonable date format
  // Examples: "Oct-2024", "Oct 2024", "2024-10", "10/2024", "10-2024", "2024", "October 2024", etc.
  // Pattern matches:
  // - YYYY-MM, YYYY-MM-DD, YYYY
  // - MM/YYYY, MM/DD/YYYY, DD/MM/YYYY
  // - MM-YYYY, DD-MM-YYYY
  // - MMM-YYYY, MMMM-YYYY (Oct-2024, October-2024)
  // - MMM YYYY, MMMM YYYY (Oct 2024, October 2024)
  // - MMM DD, YYYY (Oct 15, 2024)
  // - Any combination with spaces, hyphens, or slashes
  const dateRegex = /^(\d{4}([-\/]\d{1,2}([-\/]\d{1,2})?)?|\d{1,2}[-\/]\d{1,2}[-\/]\d{4}|\d{1,2}[-\/]\d{4}|\d{4}|[A-Za-z]{3,9}[-\s]\d{4}|[A-Za-z]{3,9}[-\s]\d{1,2}[,\s]?\d{4}|[A-Za-z]{3,9}[-\s]\d{1,2})$/i;
  
  // If it doesn't match the regex, still accept it if it looks like a date (has numbers and possibly month names)
  // This makes validation very permissive - only reject obviously invalid entries
  const hasNumbers = /\d/.test(trimmedDate);
  const hasMonthName = /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)/i.test(trimmedDate);
  const isTooShort = trimmedDate.length < 2;
  const isTooLong = trimmedDate.length > 50;
  
  // Reject only if it's clearly not a date
  if (isTooShort || isTooLong || (!hasNumbers && !hasMonthName)) {
    return { valid: false, message: 'Please enter a valid date (e.g., "Oct-2024", "2024-10", "Present")' };
  }
  
  return { valid: true };
};

export default function CVFormWithPreview({ formData, setFormData, onSubmit, isGenerating, generateCoverLetter, setGenerateCoverLetter, user, remainingAIRequests, selectedTemplate = 'classic', onImport = null }) {
  const [errors, setErrors] = useState({});

  // Determine preview data: use sample data if form is empty, otherwise use form data
  const previewData = useMemo(() => {
    const hasData = hasUserData(formData, selectedTemplate);
    if (hasData) {
      return formData;
    }
    return mergeDataForPreview(formData || {}, selectedTemplate);
  }, [formData, selectedTemplate]);

  // Check if currently showing sample data
  const isShowingSampleData = useMemo(() => {
    return !hasUserData(formData, selectedTemplate);
  }, [formData, selectedTemplate]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Real-time validation for individual fields
  const validateField = (field, value) => {
    let error = null;
    
    switch (field) {
      case 'full_name':
        if (!value || value.trim() === '') {
          error = 'Full name is required';
        }
        break;
      case 'email':
        const emailValidation = validateEmail(value);
        if (!emailValidation.valid) {
          error = emailValidation.message;
        }
        break;
      case 'phone':
        if (value && value.trim() !== '') {
          const phoneValidation = validatePhone(value);
          if (!phoneValidation.valid) {
            error = phoneValidation.message;
          }
        }
        break;
      case 'linkedin_url':
        if (value && value.trim() !== '') {
          const urlValidation = validateURL(value);
          if (!urlValidation.valid) {
            error = urlValidation.message;
          }
        }
        break;
      default:
        break;
    }
    
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    return !error;
  };

  // Validate experience/education date fields
  const validateDateField = (type, index, field, value) => {
    const fieldKey = `${type}_${index}_${field}`;
    if (value && value.trim() !== '') {
      const dateValidation = validateDate(value);
      if (!dateValidation.valid) {
        setErrors(prev => ({ ...prev, [fieldKey]: dateValidation.message }));
        return false;
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldKey];
          return newErrors;
        });
        return true;
      }
    } else {
      // Clear error if field is empty (optional field)
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
      return true;
    }
  };

  const onErrorClear = (fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate required fields
    if (!formData.full_name || formData.full_name.trim() === '') {
      newErrors.full_name = 'Full name is required';
    }
    
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
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submit triggered', { 
      isGenerating, 
      full_name: formData.full_name, 
      email: formData.email,
      disabled: isGenerating || !formData.full_name || !formData.email
    });
    
    const { isValid, errors: validationErrors } = validateForm();
    console.log('Validation result', { isValid, errors: validationErrors });
    
    if (isValid) {
      console.log('Calling onSubmit');
      onSubmit();
    } else {
      console.log('Validation failed', validationErrors);
      const firstErrorKey = Object.keys(validationErrors)[0];
      const firstError = validationErrors[firstErrorKey];
      
      // Show specific error message
      toast.error(firstError || 'Please fix the validation errors before submitting', {
        description: `Error in: ${firstErrorKey.replace(/_/g, ' ')}`
      });
      
      // Scroll to first error - try multiple selectors
      setTimeout(() => {
        if (firstErrorKey) {
          // Try to find the input field by name attribute (we added these to ExperienceEntry and EducationEntry)
          let element = document.querySelector(`[name="${firstErrorKey}"]`);
          
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
            // Highlight the field
            element.classList.add('border-red-500', 'ring-2', 'ring-red-200');
            setTimeout(() => {
              element.classList.remove('border-red-500', 'ring-2', 'ring-red-200');
            }, 3000);
          } else {
            // Fallback: scroll to form section
            document.getElementById('cv-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 100);
    }
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

  return (
    <section className="bg-gradient-to-b from-white to-gray-50" id="cv-form">
      {/* Progress Bar */}
      <ProgressBar formData={formData} />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
            Create your professional CV
          </h2>
          <p className="text-lg text-gray-600">
            Fill in your details and see your CV update in real-time
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section - Left Side */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:h-[calc(100vh-12rem)] lg:overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Basic Information */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-4">
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <Input
                      name="full_name"
                      value={formData.full_name || ''}
                      onChange={(e) => {
                        updateField('full_name', e.target.value);
                        // Clear error as user types
                        if (errors.full_name && e.target.value.trim()) {
                          validateField('full_name', e.target.value);
                        }
                      }}
                      onBlur={(e) => validateField('full_name', e.target.value)}
                      required
                      className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors ${
                        errors.full_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                    />
                    {errors.full_name && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <span>⚠️</span>
                        <span>{errors.full_name}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Position</label>
                    <Input
                      value={formData.target_position || ''}
                      onChange={(e) => updateField('target_position', e.target.value)}
                      placeholder="e.g., Senior Consultant"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <Input
                        value={formData.location || ''}
                        onChange={(e) => updateField('location', e.target.value)}
                        placeholder="Munich, Germany"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => {
                          updateField('email', e.target.value);
                          // Real-time validation - clear error as user types valid email
                          if (errors.email && e.target.value.trim()) {
                            const emailValidation = validateEmail(e.target.value);
                            if (emailValidation.valid) {
                              validateField('email', e.target.value);
                            }
                          }
                        }}
                        onBlur={(e) => validateField('email', e.target.value)}
                        required
                        className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors ${
                          errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <span>⚠️</span>
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <Input
                        name="phone"
                        value={formData.phone || ''}
                        onChange={(e) => {
                          updateField('phone', e.target.value);
                          // Clear error as user types
                          if (errors.phone && e.target.value.trim()) {
                            const phoneValidation = validatePhone(e.target.value);
                            if (phoneValidation.valid) {
                              validateField('phone', e.target.value);
                            }
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value.trim()) {
                            validateField('phone', e.target.value);
                          } else {
                            // Clear error if field is empty (optional)
                            setErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors.phone;
                              return newErrors;
                            });
                          }
                        }}
                        placeholder="+49 123 456 7890"
                        className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors ${
                          errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <span>⚠️</span>
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                      <Input
                        name="linkedin_url"
                        value={formData.linkedin_url || ''}
                        onChange={(e) => {
                          updateField('linkedin_url', e.target.value);
                          // Clear error as user types
                          if (errors.linkedin_url && e.target.value.trim()) {
                            const urlValidation = validateURL(e.target.value);
                            if (urlValidation.valid) {
                              validateField('linkedin_url', e.target.value);
                            }
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value.trim()) {
                            validateField('linkedin_url', e.target.value);
                          } else {
                            // Clear error if field is empty (optional)
                            setErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors.linkedin_url;
                              return newErrors;
                            });
                          }
                        }}
                        placeholder="linkedin.com/in/yourname"
                        className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors ${
                          errors.linkedin_url ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                        }`}
                      />
                      {errors.linkedin_url && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <span>⚠️</span>
                          <span>{errors.linkedin_url}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Summary */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-4">
                  Professional Summary
                </h3>
                <div className="space-y-3">
                  <Textarea
                    value={formData.summary || ''}
                    onChange={(e) => updateField('summary', e.target.value)}
                    placeholder="Brief professional summary (3-5 sentences)..."
                    rows={4}
                    disabled={formData.auto_generate_summary}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg resize-none disabled:bg-gray-100"
                  />
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="auto-summary"
                      checked={formData.auto_generate_summary || false}
                      onCheckedChange={(checked) => updateField('auto_generate_summary', checked)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor="auto-summary" className="text-sm text-gray-700 cursor-pointer block">
                        Auto-generate summary with AI
                      </label>
                      {!user && remainingAIRequests !== null && (
                        <p className="text-xs text-gray-500 mt-1">
                          {remainingAIRequests > 0 
                            ? `${remainingAIRequests} AI request(s) remaining this hour. Log in for unlimited access.`
                            : 'Rate limit reached. Please log in for unlimited AI generation.'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-4">Skills</h3>
                <Textarea
                  value={formData.skills || ''}
                  onChange={(e) => updateField('skills', e.target.value)}
                  placeholder="IT Audit, SOX, SAP, SQL, Excel, Power BI"
                  rows={2}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">Comma-separated list</p>
              </div>

              {/* Professional Experience */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-4">
                  Professional Experience
                </h3>
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
                      onErrorClear={onErrorClear}
                      onValidateDate={validateDateField}
                    />
                  ))}
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addExperience}
                  className="mt-4 border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  + Add another experience
                </Button>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-4">Education</h3>
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
                      onErrorClear={onErrorClear}
                      onValidateDate={validateDateField}
                    />
                  ))}
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addEducation}
                  className="mt-4 border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  + Add another education
                </Button>
              </div>

              {/* Languages */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-4">Languages</h3>
                <LanguageSelector 
                  languages={formData.languagesList || []}
                  onChange={(langs) => {
                    const languagesString = langs
                      .map(l => `${l.language} — ${l.level}`)
                      .join('; ');
                    updateField('languages', languagesString);
                    updateField('languagesList', langs);
                  }}
                />
              </div>

              {/* Template Selection - Switcher */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-4">CV Template</h3>
                <TemplateSwitcher
                  selectedTemplate={formData.template || selectedTemplate}
                  onTemplateChange={(newTemplate) => {
                    updateField('template', newTemplate);
                    // Update preview with new template's sample data if form is empty
                    if (isShowingSampleData) {
                      // Preview will automatically update via useMemo
                    }
                  }}
                />
                <p className="text-xs text-gray-400 mt-2">You can switch templates anytime before payment</p>
              </div>

              {/* Style Selection */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-4">CV Style</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'professional', name: 'Professional', desc: 'Serif, Classic' },
                    { id: 'elegant', name: 'Elegant', desc: 'Sans-serif, Slate' },
                    { id: 'bold', name: 'Bold', desc: 'Sans-serif, Strong' }
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => updateField('style', style.id)}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        (formData.style || 'professional') === style.id
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900 text-sm">{style.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{style.desc}</div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">All combinations of templates and styles are ATS-friendly</p>
              </div>

              {/* Cover Letter Option - Prominent */}
              <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50 p-5 rounded-xl border-2 border-purple-300 shadow-md">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="cover-letter-preview"
                    checked={generateCoverLetter || false}
                    onCheckedChange={setGenerateCoverLetter}
                    className="mt-1 border-purple-400 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <div className="flex-1">
                    <label htmlFor="cover-letter-preview" className="text-base font-bold text-gray-900 cursor-pointer block flex items-center gap-2">
                      <span className="text-xl">✉️</span>
                      <span>Generate a matching cover letter</span>
                    </label>
                    <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                      AI will create a professional cover letter tailored to your experience and target position. You can edit it before finalizing.
                    </p>
                    {!user && remainingAIRequests !== null && (
                      <p className="text-xs text-amber-600 mt-2 font-medium">
                        {remainingAIRequests > 0 
                          ? `⚠️ ${remainingAIRequests} AI request(s) remaining this hour. Log in for unlimited access.`
                          : '⚠️ Rate limit reached. Please log in for unlimited AI generation.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 sticky bottom-0 bg-white pb-4 z-10">
                <Button 
                  type="submit"
                  disabled={isGenerating || !formData?.full_name?.trim() || !formData?.email?.trim()}
                  onClick={(e) => {
                    const isDisabled = isGenerating || !formData?.full_name?.trim() || !formData?.email?.trim();
                    console.log('Button clicked', { 
                      isGenerating, 
                      full_name: formData?.full_name, 
                      email: formData?.email,
                      full_name_trimmed: formData?.full_name?.trim(),
                      email_trimmed: formData?.email?.trim(),
                      disabled: isDisabled
                    });
                    if (isDisabled) {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!formData?.full_name?.trim()) {
                        toast.error('Please enter your full name');
                      } else if (!formData?.email?.trim()) {
                        toast.error('Please enter your email address');
                      }
                      return false;
                    }
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 py-6 text-lg font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ pointerEvents: (isGenerating || !formData?.full_name?.trim() || !formData?.email?.trim()) ? 'none' : 'auto' }}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating your CV...
                    </>
                  ) : (
                    'Generate CV'
                  )}
                </Button>
                {(!formData?.full_name?.trim() || !formData?.email?.trim()) && (
                  <p className="text-xs text-red-500 mt-2 text-center">
                    {!formData?.full_name?.trim() && !formData?.email?.trim() 
                      ? 'Please enter your name and email to continue'
                      : !formData?.full_name?.trim() 
                        ? 'Please enter your full name'
                        : 'Please enter your email address'}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Live Preview - Right Side */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:h-[calc(100vh-12rem)] lg:overflow-y-auto lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
              </div>
              {isShowingSampleData && (
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                  Sample Data
                </span>
              )}
            </div>
            <div className="border border-gray-200 rounded-lg p-2 md:p-6 bg-gray-50 overflow-x-auto">
              <div className="min-w-[600px] md:min-w-0">
                <CVDocument data={previewData} showWatermark={true} />
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              {isShowingSampleData 
                ? 'Preview shows sample data • Start typing to see your CV'
                : 'Preview updates as you type • Final version available after payment'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}