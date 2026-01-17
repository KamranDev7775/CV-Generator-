import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import CVDocument from './CVDocument';

export default function CVForm({ formData, setFormData, onSubmit, isGenerating }) {
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experiences: [...prev.experiences, { 
        job_title: '', company: '', location: '', 
        start_date: '', end_date: '', achievements: '' 
      }]
    }));
  };

  const updateExperience = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index) => {
    if (formData.experiences.length > 1) {
      setFormData(prev => ({
        ...prev,
        experiences: prev.experiences.filter((_, i) => i !== index)
      }));
    }
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { 
        degree: '', university: '', location: '', 
        start_date: '', end_date: '' 
      }]
    }));
  };

  const updateEducation = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index) => {
    if (formData.education.length > 1) {
      setFormData(prev => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index)
      }));
    }
  };

  const DatePickerField = ({ value, onChange, placeholder }) => {
    const date = value ? new Date(value) : null;
    
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-gray-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "MMM yyyy") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => onChange(newDate ? format(newDate, "yyyy-MM-dd") : '')}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Form - Left */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 h-fit">
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-8">
          
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Full Name *</label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => updateField('full_name', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Target Position</label>
                <Input
                  value={formData.target_position}
                  onChange={(e) => updateField('target_position', e.target.value)}
                  placeholder="e.g., Senior Consultant"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Phone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">LinkedIn URL</label>
                  <Input
                    value={formData.linkedin_url}
                    onChange={(e) => updateField('linkedin_url', e.target.value)}
                    placeholder="linkedin.com/in/yourname"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Professional Summary</h3>
            <Textarea
              value={formData.summary}
              onChange={(e) => updateField('summary', e.target.value)}
              placeholder="Brief professional summary (3-5 sentences)..."
              rows={4}
              disabled={formData.auto_generate_summary}
              className="resize-none disabled:bg-gray-50"
            />
            <div className="flex items-center space-x-2 mt-3">
              <Checkbox
                id="auto-summary"
                checked={formData.auto_generate_summary}
                onCheckedChange={(checked) => updateField('auto_generate_summary', checked)}
              />
              <label htmlFor="auto-summary" className="text-sm text-gray-700 cursor-pointer">
                Auto-generate summary with AI
              </label>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Skills</h3>
            <Textarea
              value={formData.skills}
              onChange={(e) => updateField('skills', e.target.value)}
              placeholder="e.g., Project Management, Data Analysis, Excel, SQL"
              rows={2}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">Comma-separated list</p>
          </div>

          {/* Professional Experience */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Professional Experience</h3>
            <div className="space-y-6">
              {formData.experiences.map((exp, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                  {formData.experiences.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <div className="space-y-3">
                    <Input
                      placeholder="Job Title *"
                      value={exp.job_title}
                      onChange={(e) => updateExperience(index, 'job_title', e.target.value)}
                    />
                    <Input
                      placeholder="Company *"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    />
                    <Input
                      placeholder="Location"
                      value={exp.location}
                      onChange={(e) => updateExperience(index, 'location', e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                        <DatePickerField
                          value={exp.start_date}
                          onChange={(date) => updateExperience(index, 'start_date', date)}
                          placeholder="Select date"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">End Date</label>
                        <DatePickerField
                          value={exp.end_date}
                          onChange={(date) => updateExperience(index, 'end_date', date)}
                          placeholder="Present"
                        />
                      </div>
                    </div>
                    <Textarea
                      placeholder="Key achievements (one per line)..."
                      value={exp.achievements}
                      onChange={(e) => updateExperience(index, 'achievements', e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={addExperience}
              className="mt-4 w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Education</h3>
            <div className="space-y-6">
              {formData.education.map((edu, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                  {formData.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <div className="space-y-3">
                    <Input
                      placeholder="Degree *"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    />
                    <Input
                      placeholder="University *"
                      value={edu.university}
                      onChange={(e) => updateEducation(index, 'university', e.target.value)}
                    />
                    <Input
                      placeholder="Location"
                      value={edu.location}
                      onChange={(e) => updateEducation(index, 'location', e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                        <DatePickerField
                          value={edu.start_date}
                          onChange={(date) => updateEducation(index, 'start_date', date)}
                          placeholder="Select date"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">End Date</label>
                        <DatePickerField
                          value={edu.end_date}
                          onChange={(date) => updateEducation(index, 'end_date', date)}
                          placeholder="Present"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={addEducation}
              className="mt-4 w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>

          {/* Languages */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Languages</h3>
            <Textarea
              value={formData.languages}
              onChange={(e) => updateField('languages', e.target.value)}
              placeholder="e.g., English — C1, German — B2, French — A2"
              rows={2}
              className="resize-none"
            />
          </div>

          {/* Submit */}
          <Button 
            type="submit"
            disabled={isGenerating || !formData.full_name || !formData.email}
            className="w-full bg-black text-white hover:bg-gray-800 py-6 text-base"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate CV'
            )}
          </Button>
          <p className="text-xs text-gray-500 text-center">
            No payment required to preview
          </p>
        </form>
      </div>

      {/* Live Preview - Right */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 sticky top-8 h-fit max-h-[calc(100vh-4rem)] overflow-y-auto">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Live Preview</h3>
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <CVDocument data={formData} showWatermark={true} />
        </div>
        <p className="text-xs text-gray-500 text-center mt-4">
          Updates as you type • Final version after payment
        </p>
      </div>
    </div>
  );
}