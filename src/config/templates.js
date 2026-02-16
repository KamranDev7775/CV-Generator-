// Template registry and metadata configuration
// This file now serves as a bridge to the JSON-based templateConfig.json
// All template definitions are stored in JSON format for scalability and flexibility

import templateConfigJSON from './templateConfig.json';

export const TEMPLATE_CATEGORIES = {
  CLASSIC: 'Classic',
  MODERN: 'modern',
  MINIMAL: 'Minimal',
  EXECUTIVE: 'executive',
  CREATIVE: 'creative'
};

// Build TEMPLATES object from JSON configuration for backwards compatibility
export const TEMPLATES = {};
templateConfigJSON.templates.forEach(template => {
  TEMPLATES[template.id] = {
    id: template.id,
    name: template.name,
    description: template.description,
    category: template.category,
    componentName: template.layout,
    previewImage: template.previewImageUrl || template.previewImage || null,
    previewImageUrl: template.previewImageUrl || template.previewImage || null,
    features: template.features || [],
    idealFor: template.idealFor || []
  };
});

// Get all templates
export function getAllTemplates() {
  return Object.values(TEMPLATES);
}

// Get templates by category
export function getTemplatesByCategory(category) {
  return getAllTemplates().filter(template => template.category === category);
}

// Get template by ID
export function getTemplateById(templateId) {
  return TEMPLATES[templateId] || TEMPLATES.minimal;
}

// Get template component name
export function getTemplateComponentName(templateId) {
  const template = getTemplateById(templateId);
  return template.componentName;
}

// Check if template exists
export function templateExists(templateId) {
  return templateId in TEMPLATES;
}

// Get all categories
export function getAllCategories() {
  return Object.values(TEMPLATE_CATEGORIES);
}

// Get unique categories from available templates
export function getAvailableCategories() {
  const categories = new Set();
  getAllTemplates().forEach(template => {
    categories.add(template.category);
  });
  return Array.from(categories);
}
