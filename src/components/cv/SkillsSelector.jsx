import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COMMON_SKILLS = [
  'Project Management', 'Strategic Planning', 'Business Analysis', 'Financial Analysis',
  'Risk Management', 'Process Improvement', 'Change Management', 'Stakeholder Management',
  'Data Analysis', 'Team Leadership', 'Budget Management', 'Contract Negotiation',
  'Regulatory Compliance', 'IT Audit', 'SOX', 'Quality Assurance'
];

export default function SkillsSelector({ skills = [], onChange }) {
  const [customSkill, setCustomSkill] = useState('');

  const addSkill = (skill) => {
    if (skill && !skills.includes(skill)) {
      onChange([...skills, skill]);
    }
  };

  const removeSkill = (skillToRemove) => {
    onChange(skills.filter(s => s !== skillToRemove));
  };

  const handleAddCustom = () => {
    if (customSkill.trim()) {
      addSkill(customSkill.trim());
      setCustomSkill('');
    }
  };

  const availableSkills = COMMON_SKILLS.filter(s => !skills.includes(s));

  return (
    <div className="space-y-3">
      {/* Selected Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <div key={idx} className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm">
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:bg-blue-100 rounded p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add from Common Skills */}
      {availableSkills.length > 0 && (
        <Select onValueChange={(value) => { addSkill(value); }}>
          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
            <SelectValue placeholder="Select common skills..." />
          </SelectTrigger>
          <SelectContent>
            {availableSkills.map(skill => (
              <SelectItem key={skill} value={skill}>{skill}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Add Custom Skill */}
      <div className="flex gap-2">
        <Input
          value={customSkill}
          onChange={(e) => setCustomSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustom())}
          placeholder="Or add custom skill..."
          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAddCustom}
          className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}