import React from 'react';
import { 
  renderSection, 
  PhotoSection, 
  HeaderSection,
  ContactSection,
  SummarySection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  LanguagesSection
} from './TemplateSections';

// Tailwind safelist for dynamic classes referenced in JSON configs
// (keeps purge from stripping these utility classes)
const DYNAMIC_CLASS_SAFELIST = `
bg-white p-8 font-sans text-sm
px-12 py-10 font-serif text-[11px] leading-tight
p-10
text-center mb-6 mb-8
border-b-2 border-gray-800 border-gray-900 pb-2 mb-4
text-sm font-bold uppercase tracking-wider
bg-gray-100 bg-gray-200 bg-slate-700 text-white
w-1/3 w-2/3 p-6 p-8
text-[10px] text-[11px]
`;

const Watermark = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
    <div className="transform -rotate-45 text-gray-200 text-2xl md:text-4xl font-sans font-bold text-center leading-relaxed whitespace-nowrap opacity-60">
      Unlock PDF for €1.99
    </div>
  </div>
);

/**
 * Fully Dynamic Template Renderer
 * Renders CV templates based on JSON configuration with dynamic sections
 */

/**
 * Render a single section based on configuration
 */
function renderSectionByConfig(sectionConfig, data, styles) {
  const { type, config = {} } = sectionConfig;
  return renderSection(type, data, config, styles);
}

/**
 * Dynamic Layout Component
 * Renders sections based on column layout configuration
 */
function DynamicLayout({ data, config, showWatermark, styles }) {
  const { layout = 'single', sections = [], containerClass = '' } = config;
  
  // Use all sections without filtering - sections always show for template structure
  const validSections = sections;

  if (validSections.length === 0) return null;

  // Single column layout
  if (layout === 'single') {
    return (
      <div className={`relative ${containerClass}`} id="cv-document">
        {showWatermark && <Watermark />}
        <div className={showWatermark ? 'select-none' : ''}>
          {validSections.map((section, idx) => (
            <div key={`${section.type}-${idx}`} className={section.className || ''}>
              {renderSectionByConfig(section, data, styles)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Two column layout with header (e.g., dark hero + sidebar/content)
  if (layout === 'two-column-with-header') {
    const { header = null, sidebar = {}, content = {}, sidebarClass = '', contentClass = '', headerClass = '' } = config;
    const sidebarSections = sidebar.sections || [];
    const contentSections = content.sections || [];

    return (
      <div className={`relative ${containerClass}`} id="cv-document">
        {showWatermark && <Watermark />}
        <div className={showWatermark ? 'select-none' : ''}>
          {header && (
            <div className={header.className || headerClass}>
              {renderSectionByConfig(header, data, styles)}
            </div>
          )}
          <div className="flex w-full">
            <div className={sidebarClass}>
              {sidebarSections.map((section, idx) => (
                <div key={`sidebar-${section.type}-${idx}`} className={section.className || 'mb-6'}>
                  {renderSectionByConfig(section, data, styles)}
                </div>
              ))}
            </div>
            <div className={contentClass}>
              {contentSections.map((section, idx) => (
                <div key={`content-${section.type}-${idx}`} className={section.className || 'mb-6'}>
                  {renderSectionByConfig(section, data, styles)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Two column layout (sidebar + content)
  if (layout === 'two-column') {
    const { sidebar = {}, content = {}, sidebarClass = '', contentClass = '' } = config;
    const sidebarSections = sidebar.sections || [];
    const contentSections = content.sections || [];
    
    // Use all sections without filtering
    const validSidebarSections = sidebarSections;
    const validContentSections = contentSections;

    return (
      <div className={`relative flex ${containerClass}`} id="cv-document">
        {showWatermark && <Watermark />}
        <div className={`${showWatermark ? 'select-none' : ''} flex w-full`}>
          {/* Sidebar */}
          <div className={sidebarClass}>
            {validSidebarSections.map((section, idx) => (
              <div key={`sidebar-${section.type}-${idx}`} className={section.className || 'mb-6'}>
                {renderSectionByConfig(section, data, styles)}
              </div>
            ))}
          </div>
          {/* Content */}
          <div className={contentClass}>
            {validContentSections.map((section, idx) => (
              <div key={`content-${section.type}-${idx}`} className={section.className || 'mb-6'}>
                {renderSectionByConfig(section, data, styles)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Three column layout
  if (layout === 'three-column') {
    const { left = {}, center = {}, right = {} } = config;
    
    return (
      <div className={`relative ${containerClass}`} id="cv-document">
        {showWatermark && <Watermark />}
        <div className={showWatermark ? 'select-none' : ''}>
          <div className="grid grid-cols-3 gap-6">
            <div>
              {(left.sections || []).map((section, idx) => (
                <div key={`left-${section.type}-${idx}`} className={section.className || 'mb-6'}>
                  {renderSectionByConfig(section, data, styles)}
                </div>
              ))}
            </div>
            <div>
              {(center.sections || []).map((section, idx) => (
                <div key={`center-${section.type}-${idx}`} className={section.className || 'mb-6'}>
                  {renderSectionByConfig(section, data, styles)}
                </div>
              ))}
            </div>
            <div>
              {(right.sections || []).map((section, idx) => (
                <div key={`right-${section.type}-${idx}`} className={section.className || 'mb-6'}>
                  {renderSectionByConfig(section, data, styles)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/**
 * Legacy Layout Wrappers (for backward compatibility during transition)
 * These map the old hardcoded layouts to the new dynamic system
 */
function PhotoSingleColumnLayout({ data, showWatermark, styles }) {
  const preview = styles?.preview ?? false;
  const previewPadding = styles?.previewPadding ?? 'p-3';
  const padding = styles?.padding ?? 'p-8';
  
  const config = {
    layout: 'single',
    containerClass: `bg-white ${preview ? previewPadding : padding} font-sans ${preview ? 'text-[10px]' : 'text-sm'}`,
    sections: [
      { 
        type: 'header', 
        config: { layout: 'horizontal', showPhoto: true, border: true },
        className: 'mb-6 pb-4'
      },
      { type: 'summary', config: { title: 'Professional Summary' } },
      { type: 'experience', config: { title: 'Professional Experience' } },
      { type: 'education', config: { title: 'Education' } },
      { type: 'skills', config: { title: 'Expert-Level Skills' } }
    ]
  };
  
  return <DynamicLayout data={data} config={config} showWatermark={showWatermark} styles={styles} />;
}

function CenteredTraditionalLayout({ data, showWatermark, styles }) {
  const preview = styles?.preview ?? false;
  const previewPadding = styles?.previewPadding ?? 'px-3';
  const padding = styles?.padding ?? 'px-12 py-10';
  
  const config = {
    layout: 'single',
    containerClass: `bg-white ${preview ? previewPadding : padding} font-serif ${preview ? 'text-[9px]' : 'text-[11px]'} leading-tight`,
    sections: [
      { 
        type: 'header', 
        config: { layout: 'centered', border: false },
        className: 'text-center mb-6'
      },
      { 
        type: 'summary', 
        config: { title: 'PROFILE', border: false },
        className: preview ? 'text-[9px]' : 'text-[11px]'
      },
      { 
        type: 'experience', 
        config: { title: 'EMPLOYMENT HISTORY' },
        className: preview ? 'text-[9px]' : 'text-[11px]'
      },
      { 
        type: 'education', 
        config: { title: 'EDUCATION' },
        className: preview ? 'text-[9px]' : 'text-[11px]'
      },
      { 
        type: 'skills', 
        config: { title: 'SKILLS', layout: 'table', showLevel: true },
        className: preview ? 'text-[9px]' : 'text-[11px]'
      }
    ]
  };
  
  return <DynamicLayout data={data} config={config} showWatermark={showWatermark} styles={styles} />;
}

function MinimalCenteredLayout({ data, showWatermark, styles }) {
  const preview = styles?.preview ?? false;
  const previewPadding = styles?.previewPadding ?? 'p-3';
  const padding = styles?.padding ?? 'p-10';
  
  const config = {
    layout: 'single',
    containerClass: `bg-white ${preview ? previewPadding : padding} font-sans ${preview ? 'text-[10px]' : 'text-sm'}`,
    sections: [
      { 
        type: 'header', 
        config: { layout: 'centered', border: false },
        className: 'text-center mb-8'
      },
      { 
        type: 'experience', 
        config: { 
          title: 'PROFESSIONAL EXPERIENCE',
          sectionHeaderStyle: 'text-sm font-bold uppercase tracking-wider border-b-2 border-gray-900 pb-2 mb-4'
        }
      },
      { 
        type: 'education', 
        config: { 
          title: 'EDUCATION',
          sectionHeaderStyle: 'text-sm font-bold uppercase tracking-wider border-b-2 border-gray-900 pb-2 mb-4'
        }
      }
    ]
  };
  
  return <DynamicLayout data={data} config={config} showWatermark={showWatermark} styles={styles} />;
}

function SidebarModernLayout({ data, showWatermark, styles }) {
  const preview = styles?.preview ?? false;
  
  const config = {
    layout: 'two-column',
    containerClass: `bg-white ${preview ? 'text-[9px]' : 'text-sm'}`,
    sidebar: {
      sections: [
        { type: 'photo', config: { circular: false, size: 'large', showName: false, showTitle: false } },
        { 
          type: 'header', 
          config: { layout: 'vertical', border: false },
          className: 'mt-6 mb-2'
        },
        { 
          type: 'contact', 
          config: { layout: 'list', showLabels: true },
          className: 'mb-6'
        },
        { type: 'education', config: { title: 'Education', maxItems: 2 } },
        { type: 'skills', config: { title: 'Experience', layout: 'list' } }
      ]
    },
    content: {
      sections: [
        { type: 'summary' },
        { type: 'experience', config: { title: 'Experience', layout: 'timeline' } }
      ]
    },
    sidebarClass: 'w-1/3 bg-gray-100 p-6',
    contentClass: 'w-2/3 p-8'
  };
  
  return <DynamicLayout data={data} config={config} showWatermark={showWatermark} styles={styles} />;
}

function DarkSidebarTimelineLayout({ data, showWatermark, styles }) {
  const preview = styles?.preview ?? false;
  
  const config = {
    layout: 'two-column-with-header',
    containerClass: `bg-white ${preview ? 'text-[9px]' : 'text-sm'}`,
    header: {
      type: 'header',
      config: { layout: 'dark', showPhoto: true, border: false }
    },
    sidebar: {
      sections: [
        { 
          type: 'contact', 
          config: { layout: 'list', showLabels: false },
          className: 'mb-6'
        },
        { type: 'skills', config: { title: 'SKILLS', layout: 'list' } },
        { type: 'languages', config: { title: 'LANGUAGES' } }
      ]
    },
    content: {
      sections: [
        { type: 'summary', config: { title: 'PROFILE' } },
        { type: 'experience', config: { title: 'WORK EXPERIENCE', layout: 'timeline' } },
        { type: 'education', config: { title: 'EDUCATION' } }
      ]
    },
    sidebarClass: 'w-1/3 bg-gray-200 p-6',
    contentClass: 'w-2/3 p-8'
  };
  
  // Special handling for two-column-with-header
  return (
    <div className={`relative ${config.containerClass}`} id="cv-document">
      {showWatermark && <Watermark />}
      <div className={showWatermark ? 'select-none' : ''}>
        {config.header && renderSectionByConfig(config.header, data, styles)}
        <div className="flex">
          <div className={config.sidebarClass}>
            {(config.sidebar.sections || []).map((section, idx) => (
              <div key={`sidebar-${section.type}-${idx}`} className={section.className || 'mb-6'}>
                {renderSectionByConfig(section, data, styles)}
              </div>
            ))}
          </div>
          <div className={config.contentClass}>
            {(config.content.sections || []).map((section, idx) => (
              <div key={`content-${section.type}-${idx}`} className={section.className || 'mb-6'}>
                {renderSectionByConfig(section, data, styles)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Main Template Renderer Component
 * Now fully dynamic - reads complete layout configuration from JSON
 */
export default function TemplateRenderer({ templateConfig, data, showWatermark = false, preview = false }) {
  if (!templateConfig || !data) {
    return <div className="p-8 text-center text-red-600">Template configuration or data missing</div>;
  }

  const styles = { ...templateConfig.styles, preview };
  
  // Check if template has new dynamic layout configuration
  if (templateConfig.dynamicLayout) {
    // Use fully dynamic layout
    return (
      <DynamicLayout 
        data={data} 
        config={templateConfig.dynamicLayout} 
        showWatermark={showWatermark} 
        styles={styles} 
      />
    );
  }
  
  // Fallback to legacy layout mapping for backward compatibility
  const layoutType = templateConfig.layout || 'photo-single-column';
  const layoutMap = {
    'photo-single-column': PhotoSingleColumnLayout,
    'centered-traditional': CenteredTraditionalLayout,
    'minimal-centered': MinimalCenteredLayout,
    'sidebar-modern': SidebarModernLayout,
    'dark-sidebar-timeline': DarkSidebarTimelineLayout
  };

  const LayoutComponent = layoutMap[layoutType] || PhotoSingleColumnLayout;
  return <LayoutComponent data={data} showWatermark={showWatermark} styles={styles} />;
}

export { DynamicLayout, renderSectionByConfig };
