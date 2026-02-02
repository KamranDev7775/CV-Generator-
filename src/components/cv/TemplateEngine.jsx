import React from 'react';
import { TEMPLATE_STYLES } from './templateStyles';

// Reusable Components
const Watermark = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
    <div className="transform -rotate-45 text-gray-300 text-3xl md:text-5xl font-bold text-center leading-relaxed whitespace-nowrap opacity-50 border-4 border-gray-300 px-8 py-4">
      Unlock PDF for €1.99
    </div>
  </div>
);

const formatDateRange = (start, end) => start ? `${start} — ${end || 'Present'}` : end || '';

// Header Renderers
const renderCenteredHeader = (data, style) => (
  <header className={`text-center mb-8 pb-6 border-b-2 border-${style.colors.primary}`}>
    <h1 className={`text-3xl font-bold text-${style.colors.primary} mb-2 tracking-wide`}>{data.full_name || 'Your Name'}</h1>
    {data.target_position && <p className={`text-lg text-${style.colors.secondary} italic mb-3`}>{data.target_position}</p>}
    <div className={`text-sm text-${style.colors.accent} space-x-2`}>
      {[data.email, data.phone, data.location].filter(Boolean).join(' | ')}
    </div>
  </header>
);

const renderCompactHeader = (data, style) => (
  <header className={`mb-6 pb-4 border-b border-${style.colors.primary}`}>
    <h1 className={`text-2xl font-bold text-${style.colors.primary} mb-1 uppercase tracking-tight`}>{data.full_name || 'Your Name'}</h1>
    <div className="flex justify-between items-center text-xs">
      <span className="font-semibold">{data.target_position}</span>
      <span>{[data.email, data.phone].filter(Boolean).join(' • ')}</span>
    </div>
  </header>
);

const renderColoredBarHeader = (data, style) => (
  <header className={`${style.headerColor} text-white p-8`}>
    <h1 className="text-3xl font-bold mb-2">{data.full_name || 'Your Name'}</h1>
    <p className="text-blue-200 text-lg">{data.target_position}</p>
    <div className="mt-4 text-sm text-blue-100 flex flex-wrap gap-4">
      {data.email && <span>✉ {data.email}</span>}
      {data.phone && <span>☎ {data.phone}</span>}
      {data.location && <span>📍 {data.location}</span>}
    </div>
  </header>
);

const renderAsymmetricHeader = (data, style) => (
  <div className="relative">
    <div className={`absolute top-0 right-0 w-1/3 h-full bg-${style.accentColor}`} />
    <header className="relative p-10 pb-16">
      <div className="relative z-10">
        <h1 className={`text-5xl font-black text-${style.colors.primary} leading-none mb-4`}>{data.full_name || 'YOUR NAME'}</h1>
        <p className={`text-xl font-bold text-${style.accentColor} uppercase tracking-widest`}>{data.target_position}</p>
      </div>
    </header>
  </div>
);

const renderSidebarHeader = (data, style) => (
  <div className={`${style.sidebarColor} text-white p-8`}>
    <h1 className="text-2xl font-black mb-1">{data.full_name || 'Your Name'}</h1>
    <p className="text-sm font-semibold mb-8">{data.target_position}</p>
    {data.email && <p className="text-xs mb-2">{data.email}</p>}
    {data.phone && <p className="text-xs mb-2">{data.phone}</p>}
    {data.location && <p className="text-xs">{data.location}</p>}
  </div>
);

// Section Renderers
const renderSection = (title, children, style, variant = 'default') => {
  const variants = {
    default: `text-sm font-bold text-${style.colors.primary} mb-3`,
    underline: `text-sm font-bold text-${style.colors.primary} mb-3 pb-1 border-b border-gray-400`,
    border: `text-xs font-bold uppercase tracking-widest text-${style.colors.primary} mb-4 pb-2 border-b-2 border-${style.colors.primary}`
  };
  
  return (
    <section className="mb-6">
      <h2 className={variants[variant] || variants.default}>{title}</h2>
      {children}
    </section>
  );
};

const renderExperience = (exp, style) => (
  <div key={exp.job_title} className="mb-4">
    <div className="flex justify-between items-start mb-1">
      <div className="flex-1">
        <p className={`font-semibold text-${style.colors.primary}`}>{exp.job_title}</p>
        <p className={`text-sm text-${style.colors.secondary}`}>{exp.company}{exp.location && ` — ${exp.location}`}</p>
      </div>
      {exp.start_date && <p className={`text-sm text-${style.colors.accent} text-right`}>{formatDateRange(exp.start_date, exp.end_date)}</p>}
    </div>
    {exp.achievements && (
      <ul className="list-disc list-outside ml-5 mt-2 text-sm space-y-1">
        {exp.achievements.split('\n').filter(a => a.trim()).map((a, i) => <li key={i} className={`text-${style.colors.secondary}`}>{a.trim()}</li>)}
      </ul>
    )}
  </div>
);

const renderEducation = (edu, style) => (
  <div key={edu.degree} className="flex justify-between items-start mb-3">
    <div className="flex-1">
      <p className={`font-semibold text-${style.colors.primary}`}>{edu.degree}</p>
      <p className={`text-sm text-${style.colors.secondary}`}>{edu.university}{edu.location && `, ${edu.location}`}</p>
    </div>
    {(edu.start_date || edu.end_date) && <p className={`text-sm text-${style.colors.accent} text-right`}>{formatDateRange(edu.start_date, edu.end_date)}</p>}
  </div>
);

// Main Content Renderer based on style type
const renderContent = (data, style) => {
  const { summary, skills, experiences = [], education = [], languages } = data;
  
  // Sidebar layouts
  if (style.sidebar) {
    const sidebarContent = (
      <div className={`${style.sidebarWidth} ${style.sidebarColor} text-white p-8`}>
        {renderSidebarHeader(data, style)}
        {skills && (
          <div className="mb-8">
            <h3 className="text-xs uppercase tracking-widest font-bold mb-3 opacity-80">Skills</h3>
            <p className="text-xs leading-relaxed">{skills}</p>
          </div>
        )}
        {languages && (
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold mb-3 opacity-80">Languages</h3>
            <p className="text-xs">{languages}</p>
          </div>
        )}
      </div>
    );
    
    const mainContent = (
      <div className={`${style.mainContent} p-8`}>
        {summary && renderSection('Summary', <p className="text-sm leading-relaxed">{summary}</p>, style)}
        {experiences.length > 0 && experiences.some(e => e.job_title) && 
          renderSection('Experience', experiences.filter(e => e.job_title).map(e => renderExperience(e, style)), style)}
        {education.length > 0 && education.some(e => e.degree) && 
          renderSection('Education', education.filter(e => e.degree).map(e => renderEducation(e, style)), style)}
      </div>
    );
    
    return (
      <div className="flex">
        {style.sidebar === 'left' ? sidebarContent : mainContent}
        {style.sidebar === 'left' ? mainContent : sidebarContent}
      </div>
    );
  }
  
  // Standard layouts
  return (
    <div className="p-8">
      {style.educationFirst && education.length > 0 && education.some(e => e.degree) && 
        renderSection('Education', education.filter(e => e.degree).map(e => renderEducation(e, style)), style, 'border')}
      
      {experiences.length > 0 && experiences.some(e => e.job_title) && 
        renderSection('Professional Experience', experiences.filter(e => e.job_title).map(e => renderExperience(e, style)), style, 'border')}
      
      {!style.educationFirst && education.length > 0 && education.some(e => e.degree) && 
        renderSection('Education', education.filter(e => e.degree).map(e => renderEducation(e, style)), style, 'border')}
      
      {summary && renderSection('Profile', <p className="text-sm leading-relaxed">{summary}</p>, style, 'border')}
      
      {skills && renderSection('Skills', <p className="text-sm">{skills}</p>, style, 'border')}
      
      {languages && renderSection('Languages', <p className="text-sm">{languages}</p>, style, 'border')}
    </div>
  );
};

// Template Engine Component
export default function TemplateEngine({ data, showWatermark }) {
  const templateId = data?.template || 'harvard';
  const style = TEMPLATE_STYLES[templateId] || TEMPLATE_STYLES.harvard;
  
  // Select header renderer
  let headerRenderer = renderCenteredHeader;
  if (style.header === 'compact') headerRenderer = renderCompactHeader;
  else if (style.header === 'colored-bar') headerRenderer = renderColoredBarHeader;
  else if (style.header === 'asymmetric') headerRenderer = renderAsymmetricHeader;
  else if (style.header === 'sidebar') headerRenderer = null; // Sidebar handles its own header
  
  return (
    <div className={`relative ${style.pageClass}`} id="cv-document">
      {showWatermark && <Watermark />}
      <div className={showWatermark ? 'select-none' : ''}>
        {headerRenderer && headerRenderer(data, style)}
        {renderContent(data, style)}
      </div>
    </div>
  );
}
