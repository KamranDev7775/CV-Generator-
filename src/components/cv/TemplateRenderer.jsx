import React from 'react';
import {
  renderSection
} from './TemplateSections';

/* ----------------------------------
   Watermark
---------------------------------- */
const Watermark = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
    <div className="transform -rotate-45 text-gray-200 text-3xl font-bold opacity-60">
      Unlock PDF for €1.99
    </div>
  </div>
);

/* ----------------------------------
   Section Renderer
---------------------------------- */
function renderSectionByConfig(sectionConfig, data, styles) {
  const { type, config = {} } = sectionConfig;
  return renderSection(type, data, config, styles);
}

/* ----------------------------------
   Dynamic Layout Engine with A4 Paging
---------------------------------- */
function DynamicLayout({ data, config, showWatermark, styles }) {
  const { layout = 'single', sections = [], containerClass = '' } = config;

  const safeData = data || {};

  /* -------- Single Column with A4 Pages -------- */
  if (layout === 'single') {
    return (
      <div className="cv-preview-container">
        <div className="cv-page relative" id="cv-document">
          {showWatermark && <Watermark />}
          <div className={`${containerClass} text-justify h-full`}>
            {sections.map((section, i) => (
              <div key={i} className={section.className || 'mb-6'}>
                {renderSectionByConfig(section, safeData, styles)}
              </div>
            ))}
          </div>
        </div>
        {/* Add more pages if content overflows */}
        {safeData.experiences?.length > 3 && (
          <>
            <div className="page-break">Page Break</div>
            <div className="cv-page relative">
              <div className={`${containerClass} text-justify h-full`}>
                <div className="mb-6">
                  {renderSectionByConfig({ type: 'experience', config: { title: 'Professional Experience (Continued)' } }, safeData, styles)}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  /* -------- Two Column with A4 Pages -------- */
  if (layout === 'two-column') {
    const { sidebar = {}, content = {}, sidebarClass = '', contentClass = '' } = config;

    return (
      <div className="cv-preview-container">
        <div className="cv-page relative" id="cv-document">
          {showWatermark && <Watermark />}
          <div className={`${containerClass} text-justify h-full`}>
            <div className="flex h-full">
              <div className={sidebarClass}>
                {(sidebar.sections || []).map((s, i) => (
                  <div key={i} className={s.className || 'mb-6'}>
                    {renderSectionByConfig(s, safeData, styles)}
                  </div>
                ))}
              </div>
              <div className={contentClass}>
                {(content.sections || []).map((s, i) => (
                  <div key={i} className={s.className || 'mb-6'}>
                    {renderSectionByConfig(s, safeData, styles)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------- Two Column With Header and A4 Pages -------- */
  if (layout === 'two-column-with-header') {
    const { header, sidebar, content, sidebarClass, contentClass } = config;

    return (
      <div className="cv-preview-container">
        <div className="cv-page relative" id="cv-document">
          {showWatermark && <Watermark />}
          <div className={`${containerClass} text-justify flex flex-col`}>
            {header && (
              <div className={header.className || 'mb-0'}>
                {renderSectionByConfig(header, safeData, styles)}
              </div>
            )}

            <div className="flex flex-1">
              <div className={`${sidebarClass} flex-shrink-0`}>
                {(sidebar.sections || []).map((s, i) => (
                  <div key={i} className={s.className || 'mb-4'}>
                    {renderSectionByConfig(s, safeData, styles)}
                  </div>
                ))}
              </div>
              <div className={`${contentClass} flex-1`}>
                {(content.sections || []).map((s, i) => (
                  <div key={i} className={s.className || 'mb-4'}>
                    {renderSectionByConfig(s, safeData, styles)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/* ----------------------------------
   Legacy Layouts
---------------------------------- */
function PhotoSingleColumnLayout({ data, showWatermark, styles }) {
  const config = {
    layout: 'single',
    containerClass: 'bg-white p-8 text-sm text-justify',
    sections: [
      { type: 'header', config: { layout: 'horizontal', showPhoto: true } },
      { type: 'summary' },
      { type: 'experience' },
      { type: 'education' },
      { type: 'skills' }
    ]
  };

  return <DynamicLayout data={data} config={config} showWatermark={showWatermark} styles={styles} />;
}

function SidebarModernLayout({ data, showWatermark, styles }) {
  const config = {
    layout: 'two-column',
    containerClass: 'bg-white text-sm text-justify',
    sidebarClass: 'w-1/3 bg-gray-100 p-6',
    contentClass: 'w-2/3 p-8',
    sidebar: {
      sections: [
        { type: 'photo', config: { size: 'large' } },
        { type: 'header', config: { layout: 'vertical' } },
        { type: 'contact' },
        { type: 'skills' }
      ]
    },
    content: {
      sections: [
        { type: 'summary' },
        { type: 'experience', config: { layout: 'timeline' } },
        { type: 'education' }
      ]
    }
  };

  return <DynamicLayout data={data} config={config} showWatermark={showWatermark} styles={styles} />;
}

function DarkSidebarTimelineLayout({ data, showWatermark, styles }) {
  const config = {
    layout: 'two-column-with-header',
    containerClass: 'bg-white text-sm text-justify',
    header: {
      type: 'header',
      config: { layout: 'dark', showPhoto: true }
    },
    sidebarClass: 'w-1/3 bg-gray-200 p-6 pt-12',
    contentClass: 'w-2/3 p-8',
    sidebar: {
      sections: [
        { type: 'contact' },
        { type: 'skills' },
        { type: 'languages' }
      ]
    },
    content: {
      sections: [
        { type: 'summary' },
        { type: 'experience', config: { layout: 'timeline' } },
        { type: 'education' }
      ]
    }
  };

  return <DynamicLayout data={data} config={config} showWatermark={showWatermark} styles={styles} />;
}

/* ----------------------------------
   Main Template Renderer
---------------------------------- */
export default function TemplateRenderer({
  templateConfig,
  data,
  showWatermark = false,
  preview = false
}) {
  if (!templateConfig) {
    return <div className="p-6 text-red-600">Template config missing</div>;
  }

  const styles = { ...templateConfig.styles, preview };

  if (templateConfig.dynamicLayout) {
    return (
      <DynamicLayout
        data={data}
        config={templateConfig.dynamicLayout}
        showWatermark={showWatermark}
        styles={styles}
      />
    );
  }

  const layoutMap = {
    'photo-single-column': PhotoSingleColumnLayout,
    'sidebar-modern': SidebarModernLayout,
    'dark-sidebar-timeline': DarkSidebarTimelineLayout
  };

  const Layout = layoutMap[templateConfig.layout] || PhotoSingleColumnLayout;

  return <Layout data={data} showWatermark={showWatermark} styles={styles} />;
}

export { DynamicLayout, renderSectionByConfig };
