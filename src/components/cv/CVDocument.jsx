import React from 'react';
import TemplateRenderer from './TemplateRenderer';
import templateConfig from '@/config/templateConfig.json';

/**
 * CVDocument Component
 * Now uses a configuration-driven system for rendering templates
 * All template definitions are in templateConfig.json
 * Layout rendering is handled by TemplateRenderer.jsx
 * 
 * This eliminates code duplication and makes templates easily extensible
 * by simply updating the JSON configuration file.
 */
export default function CVDocument({ data, showWatermark = false, preview = false }) {
  const templateId = data.template || 'minimal';
  
  // Find the template configuration by ID
  const currentTemplateConfig = templateConfig.templates.find(t => t.id === templateId);
  
  // Fallback to minimal template if not found
  const config = currentTemplateConfig || templateConfig.templates.find(t => t.id === 'minimal');
  
  if (!config) {
    return <div className="p-8 text-center text-red-600">No templates found in configuration</div>;
  }

  return (
    <TemplateRenderer 
      templateConfig={config} 
      data={data} 
      showWatermark={showWatermark} 
      preview={preview}
    />
  );
}
