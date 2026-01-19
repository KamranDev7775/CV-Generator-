import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";

const COMMON_SKILLS = [
  'Data Analysis', 'Project Management', 'Financial Modeling', 'Strategy Consulting',
  'Process Optimization', 'Stakeholder Management', 'Change Management', 'Business Intelligence',
  'Risk Management', 'Compliance', 'Audit', 'Due Diligence', 'M&A', 'Valuation',
  'Leadership', 'Team Management', 'Communication', 'Presentation Skills'
];

const COMMON_TOOLS = [
  'Excel', 'PowerPoint', 'Word', 'SAP', 'Tableau', 'Power BI', 'SQL', 'Python',
  'R', 'SPSS', 'Salesforce', 'Oracle', 'Microsoft Dynamics', 'Jira', 'Confluence',
  'Bloomberg Terminal', 'Adobe Analytics', 'Google Analytics'
];

const LANGUAGE_LEVELS = [
  'Native', 'C2 - Proficient', 'C1 - Advanced', 'B2 - Upper Intermediate',
  'B1 - Intermediate', 'A2 - Elementary', 'A1 - Beginner'
];

export default function AdditionalSection({ formData, updateField }) {
  const [newSkill, setNewSkill] = useState('');
  const [newTool, setNewTool] = useState('');
  const [newLanguage, setNewLanguage] = useState({ language: '', level: '' });

  const skills = formData.skills || [];
  const tools_tech = formData.tools_tech || [];
  const languages = formData.languages || [];

  const addSkill = (skill) => {
    if (skill && !skills.includes(skill)) {
      updateField('skills', [...skills, skill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    updateField('skills', skills.filter(s => s !== skillToRemove));
  };

  const addTool = (tool) => {
    if (tool && !tools_tech.includes(tool)) {
      updateField('tools_tech', [...tools_tech, tool]);
      setNewTool('');
    }
  };

  const removeTool = (toolToRemove) => {
    updateField('tools_tech', tools_tech.filter(t => t !== toolToRemove));
  };

  const addLanguage = () => {
    if (newLanguage.language && newLanguage.level && 
        !languages.some(l => l.language === newLanguage.language)) {
      updateField('languages', [...languages, newLanguage]);
      setNewLanguage({ language: '', level: '' });
    }
  };

  const removeLanguage = (languageToRemove) => {
    updateField('languages', languages.filter(l => l.language !== languageToRemove));
  };

  return (
    <div className="space-y-6">
      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Skills</label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Select value={newSkill} onValueChange={(value) => addSkill(value)}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                <SelectValue placeholder="Select a skill..." />
              </SelectTrigger>
              <SelectContent>
                {COMMON_SKILLS.map((skill) => (
                  <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill(newSkill);
                }
              }}
              placeholder="Or type a custom skill..."
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addSkill(newSkill)}
              disabled={!newSkill}
              className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:bg-blue-100 rounded-full p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Languages */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Languages</label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={newLanguage.language}
              onChange={(e) => setNewLanguage({ ...newLanguage, language: e.target.value })}
              placeholder="Language (e.g., German)"
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            />
            <Select
              value={newLanguage.level}
              onValueChange={(value) => setNewLanguage({ ...newLanguage, level: value })}
            >
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              onClick={addLanguage}
              disabled={!newLanguage.language || !newLanguage.level}
              className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {languages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {languages.map((lang, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-sm"
                >
                  <span>{lang.language} ({lang.level})</span>
                  <button
                    type="button"
                    onClick={() => removeLanguage(lang.language)}
                    className="hover:bg-purple-100 rounded-full p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tools & Tech */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Tools & Tech</label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Select value={newTool} onValueChange={(value) => addTool(value)}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                <SelectValue placeholder="Select a tool..." />
              </SelectTrigger>
              <SelectContent>
                {COMMON_TOOLS.map((tool) => (
                  <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Input
              value={newTool}
              onChange={(e) => setNewTool(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTool(newTool);
                }
              }}
              placeholder="Or type a custom tool..."
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addTool(newTool)}
              disabled={!newTool}
              className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {tools_tech.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tools_tech.map((tool, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm"
                >
                  <span>{tool}</span>
                  <button
                    type="button"
                    onClick={() => removeTool(tool)}
                    className="hover:bg-green-100 rounded-full p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Information <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <Textarea
          value={formData.additional_info || ''}
          onChange={(e) => updateField('additional_info', e.target.value)}
          placeholder="Any other relevant information (certifications, publications, awards, etc.)"
          rows={3}
          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg resize-none"
        />
      </div>
    </div>
  );
}