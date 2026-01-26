import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function EducationEntry({ education, index, onChange, onRemove, canRemove, errors = {}, onErrorClear }) {
  const handleChange = (field, value) => {
    onChange(index, { ...education, [field]: value });
    // Clear error when user starts typing
    if (onErrorClear && (field === 'start_date' || field === 'end_date')) {
      onErrorClear(field);
    }
  };

  return (
    <div className="border-b border-gray-100 pb-8 mb-8 last:border-0 last:pb-0 last:mb-0">
      <div className="flex justify-between items-start mb-6">
        <span className="text-xs uppercase tracking-widest text-gray-400">Education {index + 1}</span>
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
            <label className="block text-sm text-gray-600 mb-2">Degree</label>
            <Input
              value={education.degree || ''}
              onChange={(e) => handleChange('degree', e.target.value)}
              placeholder="M.Sc. Business Administration"
              className="border-gray-200 focus:border-gray-400 focus:ring-0"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">University</label>
            <Input
              value={education.university || ''}
              onChange={(e) => handleChange('university', e.target.value)}
              placeholder="Ludwig Maximilian University"
              className="border-gray-200 focus:border-gray-400 focus:ring-0"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Location</label>
            <Input
              value={education.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Munich, Germany"
              className="border-gray-200 focus:border-gray-400 focus:ring-0"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Start Date</label>
            <Input
              value={education.start_date || ''}
              onChange={(e) => handleChange('start_date', e.target.value)}
              placeholder="Oct 2015"
              className={`border-gray-200 focus:border-gray-400 focus:ring-0 ${errors.start_date ? 'border-red-300' : ''}`}
            />
            {errors.start_date && <p className="text-xs text-red-500 mt-1">{errors.start_date}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">End Date</label>
            <Input
              value={education.end_date || ''}
              onChange={(e) => handleChange('end_date', e.target.value)}
              placeholder="Sep 2017"
              className={`border-gray-200 focus:border-gray-400 focus:ring-0 ${errors.end_date ? 'border-red-300' : ''}`}
            />
            {errors.end_date && <p className="text-xs text-red-500 mt-1">{errors.end_date}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}