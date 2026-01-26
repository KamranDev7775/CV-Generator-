import React from 'react';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import MinimalTemplate from './templates/MinimalTemplate';

export default function CVDocument({ data, showWatermark = false }) {
  const template = data.template || 'classic'; // Default to classic (original design)
  
  const templateComponents = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    minimal: MinimalTemplate
  };
  
  const SelectedTemplate = templateComponents[template] || ClassicTemplate;
  
  return <SelectedTemplate data={data} showWatermark={showWatermark} />;
}