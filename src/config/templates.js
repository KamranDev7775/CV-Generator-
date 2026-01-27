// Template registry and metadata configuration
// This file defines all available CV templates, their metadata, and categories

export const TEMPLATE_CATEGORIES = {
  SIMPLE: 'Simple',
  MODERN: 'Modern',
  CREATIVE: 'Creative',
  PROFESSIONAL: 'Professional'
};

export const TEMPLATES = {
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional single-column layout with clean typography. Perfect for conservative industries.',
    category: TEMPLATE_CATEGORIES.SIMPLE,
    componentName: 'ClassicTemplate',
    previewImage: null, // Can be added later
    features: ['Single column', 'Traditional layout', 'ATS-friendly']
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Centered layout with elegant typography. Great for creative and tech roles.',
    category: TEMPLATE_CATEGORIES.MODERN,
    componentName: 'ModernTemplate',
    previewImage: null,
    features: ['Centered design', 'Elegant typography', 'Modern aesthetic']
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean design with maximum white space. Ideal for design and creative fields.',
    category: TEMPLATE_CATEGORIES.SIMPLE,
    componentName: 'MinimalTemplate',
    previewImage: null,
    features: ['Ultra-clean', 'Maximum white space', 'Minimal design']
  },
  executive: {
    id: 'executive',
    name: 'Executive',
    description: 'Strong presence for senior professionals. Bold sections and clear hierarchy.',
    category: TEMPLATE_CATEGORIES.PROFESSIONAL,
    componentName: 'ExecutiveTemplate',
    previewImage: null,
    features: ['Bold sections', 'Executive presence', 'Senior professional']
  },
  compact: {
    id: 'compact',
    name: 'Compact',
    description: 'Dense layout optimized for space. Perfect for experienced professionals.',
    category: TEMPLATE_CATEGORIES.SIMPLE,
    componentName: 'CompactTemplate',
    previewImage: null,
    features: ['Space-efficient', 'Dense layout', 'Information-rich']
  },
  sidebar: {
    id: 'sidebar',
    name: 'Sidebar',
    description: 'Two-column layout with sidebar. Professional and modern design without photo requirement.',
    category: TEMPLATE_CATEGORIES.MODERN,
    componentName: 'SidebarTemplate',
    previewImage: null,
    features: ['Sidebar layout', 'Two-column design', 'Professional layout']
  },
  // mercury: {
  //   id: 'mercury',
  //   name: 'Mercury',
  //   description: 'Two-column layout with sidebar and photo. Professional and modern design.',
  //   category: TEMPLATE_CATEGORIES.MODERN,
  //   componentName: 'MercuryTemplate',
  //   previewImage: null,
  //   features: ['Sidebar layout', 'Photo support', 'Two-column design']
  // },
  finance: {
    id: 'finance',
    name: 'Finance',
    description: 'Single-column minimalist design. Clean and professional for finance and consulting.',
    category: TEMPLATE_CATEGORIES.PROFESSIONAL,
    componentName: 'FinanceTemplate',
    previewImage: null,
    features: ['Minimalist', 'Professional', 'Finance-focused']
  },
  steadyForm: {
    id: 'steadyForm',
    name: 'Steady Form',
    description: 'Two-column layout with dates on left. Chronological and organized presentation.',
    category: TEMPLATE_CATEGORIES.PROFESSIONAL,
    componentName: 'SteadyFormTemplate',
    previewImage: null,
    features: ['Chronological', 'Date-focused', 'Organized layout']
  }
};

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
  return TEMPLATES[templateId] || TEMPLATES.classic;
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

