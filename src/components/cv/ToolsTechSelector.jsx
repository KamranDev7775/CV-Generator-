import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COMMON_TOOLS = [
  'Excel', 'SAP', 'SQL', 'Power BI', 'Tableau', 'Python', 'R',
  'JIRA', 'Confluence', 'Salesforce', 'Microsoft Office', 'Google Workspace',
  'Adobe Creative Suite', 'Figma', 'Sketch', 'AutoCAD', 'MATLAB'
];

export default function ToolsTechSelector({ tools = [], onChange }) {
  const [customTool, setCustomTool] = useState('');

  const addTool = (tool) => {
    if (tool && !tools.includes(tool)) {
      onChange([...tools, tool]);
    }
  };

  const removeTool = (toolToRemove) => {
    onChange(tools.filter(t => t !== toolToRemove));
  };

  const handleAddCustom = () => {
    if (customTool.trim()) {
      addTool(customTool.trim());
      setCustomTool('');
    }
  };

  const availableTools = COMMON_TOOLS.filter(t => !tools.includes(t));

  return (
    <div className="space-y-3">
      {/* Selected Tools */}
      {tools.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tools.map((tool, idx) => (
            <div key={idx} className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm">
              <span>{tool}</span>
              <button
                type="button"
                onClick={() => removeTool(tool)}
                className="hover:bg-blue-100 rounded p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add from Common Tools */}
      {availableTools.length > 0 && (
        <Select onValueChange={(value) => { addTool(value); }}>
          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
            <SelectValue placeholder="Select common tools..." />
          </SelectTrigger>
          <SelectContent>
            {availableTools.map(tool => (
              <SelectItem key={tool} value={tool}>{tool}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Add Custom Tool */}
      <div className="flex gap-2">
        <Input
          value={customTool}
          onChange={(e) => setCustomTool(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustom())}
          placeholder="Or add custom tool..."
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