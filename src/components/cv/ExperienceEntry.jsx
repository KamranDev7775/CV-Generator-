import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function ExperienceEntry({ experience, index, onChange, onRemove, canRemove }) {
  const handleChange = (field, value) => {
    onChange(index, { ...experience, [field]: value });
  };

  return (
    <div className="border-b border-gray-100 pb-8 mb-8 last:border-0 last:pb-0 last:mb-0">
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
              value={experience.start_date || ''}
              onChange={(e) => handleChange('start_date', e.target.value)}
              placeholder="Jan 2020"
              className="border-gray-200 focus:border-gray-400 focus:ring-0"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">End Date</label>
            <Input
              value={experience.end_date || ''}
              onChange={(e) => handleChange('end_date', e.target.value)}
              placeholder="Present"
              className="border-gray-200 focus:border-gray-400 focus:ring-0"
            />
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