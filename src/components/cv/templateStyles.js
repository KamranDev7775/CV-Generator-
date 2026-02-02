// Template Styles Configuration - 20 distinct CV template styles
// Each style defines: layout, colors, typography, and section ordering

export const TEMPLATE_STYLES = {
  // === CATEGORY 1: CLASSIC & TRADITIONAL ===
  harvard: {
    id: 'harvard',
    name: 'Harvard Standard',
    pageClass: 'bg-white p-10 md:p-14 font-serif',
    header: 'centered',
    headerBorder: true,
    educationFirst: true,
    sectionStyle: 'border-bottom',
    colors: { primary: 'gray-900', secondary: 'gray-700', accent: 'gray-600' }
  },
  banking: {
    id: 'banking',
    name: 'Banking Formal',
    pageClass: 'bg-white p-8 font-sans text-sm',
    header: 'compact',
    tightSpacing: true,
    monochrome: true,
    sectionStyle: 'border-left',
    colors: { primary: 'black', secondary: 'gray-700', accent: 'gray-600' }
  },
  legal: {
    id: 'legal',
    name: 'Legal Document',
    pageClass: 'bg-white p-10 font-mono text-xs',
    header: 'boxed',
    boxedSections: true,
    monospace: true,
    sectionStyle: 'boxed',
    colors: { primary: 'black', secondary: 'gray-700', accent: 'gray-600' }
  },
  medical: {
    id: 'medical',
    name: 'Medical Professional',
    pageClass: 'bg-white min-h-[297mm]',
    header: 'colored-bar',
    headerColor: 'bg-blue-800',
    badges: true,
    cardSections: true,
    sectionStyle: 'cards',
    colors: { primary: 'blue-800', secondary: 'blue-700', accent: 'blue-600' }
  },
  
  // === CATEGORY 2: MODERN & CREATIVE ===
  swiss: {
    id: 'swiss',
    name: 'Swiss Design',
    pageClass: 'bg-white min-h-[297mm]',
    header: 'asymmetric',
    accentColor: 'red-600',
    gridLayout: true,
    geometric: true,
    sectionStyle: 'grid',
    colors: { primary: 'black', secondary: 'red-600', accent: 'gray-500' }
  },
  magazine: {
    id: 'magazine',
    name: 'Magazine Editorial',
    pageClass: 'bg-white p-10 font-serif',
    header: 'editorial',
    twoColumn: true,
    largeHeadings: true,
    sectionStyle: 'editorial',
    colors: { primary: 'black', secondary: 'gray-600', accent: 'gray-400' }
  },
  infographic: {
    id: 'infographic',
    name: 'Infographic Style',
    pageClass: 'bg-white p-8',
    header: 'centered',
    skillBars: true,
    timelineDots: true,
    visualElements: true,
    sectionStyle: 'visual',
    colors: { primary: 'teal-700', secondary: 'teal-600', accent: 'orange-500' }
  },
  darkmode: {
    id: 'darkmode',
    name: 'Dark Mode',
    pageClass: 'bg-gray-900 text-white p-10 min-h-[297mm]',
    header: 'centered',
    darkTheme: true,
    amberAccents: true,
    sectionStyle: 'dark',
    colors: { primary: 'white', secondary: 'gray-300', accent: 'amber-400' }
  },
  
  // === CATEGORY 3: SIDEBAR LAYOUTS ===
  sidebarLeft: {
    id: 'sidebarLeft',
    name: 'Left Sidebar Bold',
    pageClass: 'bg-white flex min-h-[297mm]',
    sidebar: 'left',
    sidebarWidth: 'w-1/3',
    sidebarColor: 'bg-teal-700',
    mainContent: 'w-2/3',
    sectionStyle: 'sidebar-left',
    colors: { primary: 'teal-700', secondary: 'white', accent: 'teal-600' }
  },
  sidebarRight: {
    id: 'sidebarRight',
    name: 'Right Sidebar Minimal',
    pageClass: 'bg-white flex min-h-[297mm]',
    sidebar: 'right',
    sidebarWidth: 'w-1/3',
    minimal: true,
    mainContent: 'w-2/3',
    sectionStyle: 'sidebar-right',
    colors: { primary: 'gray-900', secondary: 'gray-600', accent: 'gray-400' }
  },
  splitHeader: {
    id: 'splitHeader',
    name: 'Split Header',
    pageClass: 'bg-white min-h-[297mm]',
    header: 'split-50-50',
    boldStatement: true,
    contemporary: true,
    sectionStyle: 'split',
    colors: { primary: 'black', secondary: 'gray-700', accent: 'gray-500' }
  },
  
  // === CATEGORY 4: UNIQUE LAYOUTS ===
  timeline: {
    id: 'timeline',
    name: 'Vertical Timeline',
    pageClass: 'bg-white p-10 min-h-[297mm]',
    layout: 'timeline',
    centralLine: true,
    alternating: true,
    sectionStyle: 'timeline',
    colors: { primary: 'gray-900', secondary: 'gray-600', accent: 'blue-500' }
  },
  cards: {
    id: 'cards',
    name: 'Card-Based',
    pageClass: 'bg-gray-50 p-8 min-h-[297mm]',
    layout: 'cards',
    floatingCards: true,
    shadows: true,
    sectionStyle: 'floating-cards',
    colors: { primary: 'gray-900', secondary: 'gray-700', accent: 'white' }
  },
  newspaper: {
    id: 'newspaper',
    name: 'Newspaper Columns',
    pageClass: 'bg-white p-6 text-xs',
    layout: '3-column',
    compact: true,
    justified: true,
    sectionStyle: 'columns',
    colors: { primary: 'black', secondary: 'gray-800', accent: 'gray-600' }
  },
  portfolio: {
    id: 'portfolio',
    name: 'Portfolio Hybrid',
    pageClass: 'bg-white p-10 min-h-[297mm]',
    layout: 'grid',
    projectSpace: true,
    visual: true,
    sectionStyle: 'portfolio-grid',
    colors: { primary: 'gray-900', secondary: 'gray-700', accent: 'purple-600' }
  },
  
  // === CATEGORY 5: COLOR & STYLE VARIATIONS ===
  terracotta: {
    id: 'terracotta',
    name: 'Warm Terracotta',
    pageClass: 'bg-orange-50 p-10 min-h-[297mm]',
    earthTones: true,
    roundedCorners: true,
    organic: true,
    sectionStyle: 'organic',
    colors: { primary: 'orange-800', secondary: 'orange-700', accent: 'orange-600' }
  },
  techStartup: {
    id: 'techStartup',
    name: 'Tech Startup',
    pageClass: 'bg-white p-10 min-h-[297mm]',
    gradient: true,
    skillPills: true,
    saasStyle: true,
    sectionStyle: 'gradient-pills',
    colors: { primary: 'indigo-600', secondary: 'purple-600', accent: 'pink-500' }
  },
  luxury: {
    id: 'luxury',
    name: 'Luxury Gold',
    pageClass: 'bg-amber-50 p-10 min-h-[297mm]',
    creamBackground: true,
    goldAccents: true,
    elegant: true,
    sectionStyle: 'luxury',
    colors: { primary: 'amber-800', secondary: 'yellow-600', accent: 'amber-400' }
  },
  nordic: {
    id: 'nordic',
    name: 'Nordic Minimal',
    pageClass: 'bg-gray-50 p-16 min-h-[297mm]',
    lightGrey: true,
    muted: true,
    spacious: true,
    hygge: true,
    sectionStyle: 'minimal-spacious',
    colors: { primary: 'gray-800', secondary: 'gray-600', accent: 'gray-400' }
  },
  boldContrast: {
    id: 'boldContrast',
    name: 'Bold Contrast',
    pageClass: 'bg-black text-white p-10 min-h-[297mm]',
    highContrast: true,
    yellowAccent: true,
    statement: true,
    sectionStyle: 'high-contrast',
    colors: { primary: 'white', secondary: 'yellow-400', accent: 'black' }
  }
};

// Helper to get style by ID
export const getTemplateStyle = (id) => TEMPLATE_STYLES[id] || TEMPLATE_STYLES.harvard;

// All template IDs for iteration
export const TEMPLATE_IDS = Object.keys(TEMPLATE_STYLES);
