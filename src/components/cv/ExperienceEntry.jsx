import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function ExperienceEntry({ experience, index, onChange, onRemove, canRemove, errors = {}, onErrorClear, onValidateDate }) {
  const handleChange = (field, value) => {
    onChange(index, { ...experience, [field]: value });
    // Clear error when user starts typing
    if (onErrorClear && (field === 'start_date' || field === 'end_date')) {
      onErrorClear(`exp_${index}_${field}`);
    }
  };

  const handleDateBlur = (field, value) => {
    if (onValidateDate) {
      onValidateDate('exp', index, field, value);
    }
  };

  return (
    <div className="border-b border-gray-100 pb-8 mb-8 last:border-0 last:pb-0 last:mb-0" data-entry-index={index} data-entry-type="experience">
      <div className="flex justify-between items-start mb-6">
        <span className="text-xs uppercase tracking-widest text-gray-400">Experience {index + 1}</span>
        {canRemove && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={() => onRemove(index)}
            className="text-gray-400 hover:text-gray-600 -mt-1"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Job Title</label>
            <Input
              value={experience.job_title || ''}
              onChange={(e) => handleChange('job_title', e.target.value)}
              placeholder="Senior Consultant"
              className="border-gray-200 focus:border-gray-400 focus:ring-0"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Company</label>
            <Input
              value={experience.company || ''}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="Deloitte"
              className="border-gray-200 focus:border-gray-400 focus:ring-0"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Location</label>
            <Input
              value={experience.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Munich, Germany"
              className="border-gray-200 focus:border-gray-400 focus:ring-0"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Start Date</label>
            <Input
              name={`exp_${index}_start_date`}
              value={experience.start_date || ''}
              onChange={(e) => {
                handleChange('start_date', e.target.value);
                // Clear error as user types
                if (errors.start_date && e.target.value.trim()) {
                  onErrorClear(`exp_${index}_start_date`);
                }
              }}
              onBlur={(e) => handleDateBlur('start_date', e.target.value)}
              placeholder="Jan 2020, 2020-01, or 01/2020"
              className={`border-gray-200 focus:border-gray-400 focus:ring-0 transition-colors ${
                errors.start_date ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.start_date && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <span>⚠️</span>
                <span>{errors.start_date}</span>
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">End Date</label>
            <Input
              name={`exp_${index}_end_date`}
              value={experience.end_date || ''}
              onChange={(e) => {
                handleChange('end_date', e.target.value);
                // Clear error as user types
                if (errors.end_date && e.target.value.trim()) {
                  onErrorClear(`exp_${index}_end_date`);
                }
              }}
              onBlur={(e) => handleDateBlur('end_date', e.target.value)}
              placeholder="Present, Jan 2020, 2020-01, or 01/2020"
              className={`border-gray-200 focus:border-gray-400 focus:ring-0 transition-colors ${
                errors.end_date ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.end_date && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <span>⚠️</span>
                <span>{errors.end_date}</span>
              </p>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 mb-2">Achievements / Responsibilities</label>
          <Textarea
            value={experience.achievements || ''}
            onChange={(e) => handleChange('achievements', e.target.value)}
            placeholder="One achievement per line&#10;Led team of 5 consultants on SOX compliance project&#10;Reduced audit cycle time by 30%"
            rows={4}
            className="border-gray-200 focus:border-gray-400 focus:ring-0 resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">One bullet point per line</p>
        </div>
      </div>
    </div>
  );
}