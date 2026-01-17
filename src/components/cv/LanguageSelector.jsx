import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";

const LANGUAGE_LEVELS = [
  { value: 'A1', label: 'A1 (Beginner)' },
  { value: 'A2', label: 'A2 (Elementary)' },
  { value: 'B1', label: 'B1 (Intermediate)' },
  { value: 'B2', label: 'B2 (Upper Intermediate)' },
  { value: 'C1', label: 'C1 (Advanced)' },
  { value: 'C2', label: 'C2 (Proficient)' },
  { value: 'Native', label: 'Native' }
];

const COMMON_LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
  'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi'
];

export default function LanguageSelector({ languages, onChange }) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customLanguage, setCustomLanguage] = useState('');

  const addLanguage = (languageName) => {
    const newLanguage = { language: languageName, level: 'B2' };
    onChange([...languages, newLanguage]);
    setShowCustomInput(false);
    setCustomLanguage('');
  };

  const removeLanguage = (index) => {
    onChange(languages.filter((_, i) => i !== index));
  };

  const updateLanguageLevel = (index, level) => {
    const updated = [...languages];
    updated[index] = { ...updated[index], level };
    onChange(updated);
  };

  const addedLanguageNames = languages.map(l => l.language.toLowerCase());
  const availableLanguages = COMMON_LANGUAGES.filter(
    lang => !addedLanguageNames.includes(lang.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Added Languages */}
      {languages.map((lang, index) => (
        <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
          <div className="flex-1">
            <span className="font-medium text-gray-900">{lang.language}</span>
          </div>
          <Select
            value={lang.level}
            onValueChange={(value) => updateLanguageLevel(index, value)}
          >
            <SelectTrigger className="w-48 border-gray-300 focus:ring-blue-500 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_LEVELS.map(level => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeLanguage(index)}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {/* Add Language Section */}
      {!showCustomInput ? (
        <div className="space-y-3">
          {availableLanguages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {availableLanguages.map(lang => (
                <Button
                  key={lang}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addLanguage(lang)}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-full"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {lang}
                </Button>
              ))}
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowCustomInput(true)}
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add custom language
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            value={customLanguage}
            onChange={(e) => setCustomLanguage(e.target.value)}
            placeholder="Enter language name"
            className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customLanguage.trim()) {
                e.preventDefault();
                addLanguage(customLanguage.trim());
              }
            }}
          />
          <Button
            type="button"
            onClick={() => customLanguage.trim() && addLanguage(customLanguage.trim())}
            disabled={!customLanguage.trim()}
            className="bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Add
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowCustomInput(false);
              setCustomLanguage('');
            }}
            className="border-gray-300 rounded-lg"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}