import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ExperienceEntry from './ExperienceEntry';
import EducationEntry from './EducationEntry';
import CVDocument from './CVDocument';
import LanguageSelector from './LanguageSelector';
import { Loader2, Eye } from "lucide-react";

export default function CVFormWithPreview({ formData, setFormData, onSubmit, isGenerating, generateCoverLetter, setGenerateCoverLetter }) {
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

  return (
    <section className="bg-gradient-to-b from-white to-gray-50" id="cv-form">
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
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-10">
              
              {/* Basic Information */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-4">
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <Input
                      value={formData.full_name || ''}
                      onChange={(e) => updateField('full_name', e.target.value)}
                      required
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    />
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
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => updateField('email', e.target.value)}
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <Input
                        value={formData.phone || ''}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="+49 123 456 7890"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                      <Input
                        value={formData.linkedin_url || ''}
                        onChange={(e) => updateField('linkedin_url', e.target.value)}
                        placeholder="linkedin.com/in/yourname"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      />
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
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="auto-summary"
                      checked={formData.auto_generate_summary || false}
                      onCheckedChange={(checked) => updateField('auto_generate_summary', checked)}
                    />
                    <label htmlFor="auto-summary" className="text-sm text-gray-700 cursor-pointer">
                      Auto-generate summary with AI
                    </label>
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

              {/* Template Selection */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-4">CV Template</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'classic', name: 'Classic', desc: 'Traditional Layout' },
                    { id: 'modern', name: 'Modern', desc: 'Centered Layout' },
                    { id: 'minimal', name: 'Minimal', desc: 'Clean Layout' }
                  ].map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => updateField('template', template.id)}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        (formData.template || 'classic') === template.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900 text-sm">{template.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{template.desc}</div>
                    </button>
                  ))}
                </div>
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
                <p className="text-xs text-gray-400 mt-3 text-center">All 9 combinations (3 templates × 3 styles) are ATS-friendly</p>
              </div>

              {/* Submit */}
              <div className="pt-4 sticky bottom-0 bg-white pb-4">
                <Button 
                  type="submit"
                  disabled={isGenerating || !formData.full_name || !formData.email}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 py-6 text-lg font-semibold rounded-xl shadow-lg disabled:opacity-50"
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
              </div>
            </form>
          </div>

          {/* Live Preview - Right Side */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:h-[calc(100vh-12rem)] lg:overflow-y-auto lg:sticky lg:top-24">
            <div className="flex items-center gap-2 mb-6">
              <Eye className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <CVDocument data={formData} showWatermark={true} />
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              Preview updates as you type • Final version available after payment
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}