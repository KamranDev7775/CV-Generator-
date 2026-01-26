import React from 'react';

// Style configurations (visual appearance)
const styles = {
  professional: {
    name: 'Professional',
    headerBorder: 'border-gray-200',
    headerBg: '',
    nameColor: 'text-black',
    positionColor: 'text-gray-700',
    contactColor: 'text-gray-600',
    sectionTitleColor: 'text-gray-500',
    bodyTextColor: 'text-gray-800',
    subtleTextColor: 'text-gray-500',
    accentColor: 'text-gray-700',
    fontFamily: 'font-serif'
  },
  elegant: {
    name: 'Elegant',
    headerBorder: 'border-slate-300',
    headerBg: '',
    nameColor: 'text-slate-900',
    positionColor: 'text-slate-600',
    contactColor: 'text-slate-500',
    sectionTitleColor: 'text-slate-400',
    bodyTextColor: 'text-slate-700',
    subtleTextColor: 'text-slate-400',
    accentColor: 'text-slate-600',
    fontFamily: 'font-sans'
  },
  bold: {
    name: 'Bold',
    headerBorder: 'border-gray-900',
    headerBg: '',
    nameColor: 'text-gray-900',
    positionColor: 'text-gray-800',
    contactColor: 'text-gray-600',
    sectionTitleColor: 'text-gray-900',
    bodyTextColor: 'text-gray-700',
    subtleTextColor: 'text-gray-500',
    accentColor: 'text-gray-900',
    fontFamily: 'font-sans'
  }
};

// Watermark component
const Watermark = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className="transform -rotate-45 text-gray-200 text-2xl md:text-4xl font-sans font-bold text-center leading-relaxed whitespace-nowrap opacity-60">
      Unlock PDF for €1.99
    </div>
  </div>
);

// Template: Classic (Original - default)
function ClassicTemplate({ data, style, showWatermark }) {
  const { 
    full_name, target_position, email, phone, linkedin_url, location,
    summary, skills, experiences = [], education = [], languages
  } = data;

  const contactParts = [email, phone, linkedin_url, location].filter(Boolean);

  return (
    <div className={`relative bg-white p-8 md:p-12 ${style.fontFamily}`} id="cv-document">
      {showWatermark && <Watermark />}
      
      <div className={showWatermark ? 'select-none' : ''}>
        <header className={`mb-8 border-b ${style.headerBorder} pb-6`}>
          <h1 className={`text-2xl md:text-3xl font-bold ${style.nameColor} mb-1`}>
            {full_name || 'Your Name'}
          </h1>
          {target_position && <p className={`text-lg ${style.positionColor} mb-3`}>{target_position}</p>}
          {contactParts.length > 0 && <p className={`text-sm ${style.contactColor}`}>{contactParts.join(' | ')}</p>}
        </header>

        {summary && (
          <section className="mb-8">
            <h2 className={`text-sm uppercase tracking-widest ${style.sectionTitleColor} mb-3 font-sans font-semibold`}>Professional Summary</h2>
            <p className={`${style.bodyTextColor} leading-relaxed whitespace-pre-line`}>{summary}</p>
          </section>
        )}

        {skills && (
          <section className="mb-8">
            <h2 className={`text-sm uppercase tracking-widest ${style.sectionTitleColor} mb-3 font-sans font-semibold`}>Skills</h2>
            <p className={style.bodyTextColor}>{skills}</p>
          </section>
        )}

        {experiences.length > 0 && experiences.some(e => e.job_title || e.company) && (
          <section className="mb-8">
            <h2 className={`text-sm uppercase tracking-widest ${style.sectionTitleColor} mb-4 font-sans font-semibold`}>Professional Experience</h2>
            <div className="space-y-6">
              {experiences.filter(e => e.job_title || e.company).map((exp, idx) => (
                <div key={idx}>
                  <div className="flex flex-wrap justify-between items-baseline mb-2">
                    <div>
                      <span className={`font-semibold ${style.nameColor}`}>{exp.job_title}</span>
                      {exp.company && <span className={style.accentColor}>, {exp.company}</span>}
                      {exp.location && <span className={style.subtleTextColor}>, {exp.location}</span>}
                    </div>
                    {(exp.start_date || exp.end_date) && (
                      <span className={`text-sm ${style.subtleTextColor}`}>{exp.start_date} — {exp.end_date || 'Present'}</span>
                    )}
                  </div>
                  {exp.achievements && (
                    <ul className={`list-disc list-outside ml-5 space-y-1 ${style.accentColor}`}>
                      {exp.achievements.split('\n').filter(a => a.trim()).map((a, i) => <li key={i}>{a.trim()}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && education.some(e => e.degree || e.university) && (
          <section className="mb-8">
            <h2 className={`text-sm uppercase tracking-widest ${style.sectionTitleColor} mb-4 font-sans font-semibold`}>Education</h2>
            <div className="space-y-4">
              {education.filter(e => e.degree || e.university).map((edu, idx) => (
                <div key={idx} className="flex flex-wrap justify-between items-baseline">
                  <div>
                    <span className={`font-semibold ${style.nameColor}`}>{edu.degree}</span>
                    {edu.university && <span className={style.accentColor}>, {edu.university}</span>}
                    {edu.location && <span className={style.subtleTextColor}>, {edu.location}</span>}
                  </div>
                  {(edu.start_date || edu.end_date) && (
                    <span className={`text-sm ${style.subtleTextColor}`}>{edu.start_date} — {edu.end_date}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {languages && (
          <section>
            <h2 className={`text-sm uppercase tracking-widest ${style.sectionTitleColor} mb-3 font-sans font-semibold`}>Languages</h2>
            <p className={style.bodyTextColor}>{languages}</p>
          </section>
        )}
      </div>
    </div>
  );
}

// Template: Modern (Improved with better typography)
function ModernTemplate({ data, style, showWatermark }) {
  const { 
    full_name, target_position, email, phone, linkedin_url, location,
    summary, skills, experiences = [], education = [], languages
  } = data;

  const contactParts = [email, phone, linkedin_url, location].filter(Boolean);

  return (
    <div className="relative bg-white p-8 md:p-12 font-sans" id="cv-document">
      {showWatermark && <Watermark />}
      
      <div className={showWatermark ? 'select-none' : ''}>
        {/* Header - Centered with elegant typography */}
        <header className="mb-12 text-center">
          <h1 className={`text-3xl md:text-4xl font-extralight ${style.nameColor} mb-3 tracking-wider uppercase`}>
            {full_name || 'Your Name'}
          </h1>
          {target_position && (
            <p className={`text-sm ${style.positionColor} mb-4 tracking-[0.3em] uppercase font-medium`}>{target_position}</p>
          )}
          {contactParts.length > 0 && (
            <p className={`text-xs ${style.contactColor} tracking-wide`}>{contactParts.join('  ·  ')}</p>
          )}
          <div className={`mt-8 border-b ${style.headerBorder} w-16 mx-auto`}></div>
        </header>

        {summary && (
          <section className="mb-10">
            <h2 className={`text-[10px] uppercase tracking-[0.25em] ${style.sectionTitleColor} mb-4 font-semibold text-center`}>Profile</h2>
            <p className={`${style.bodyTextColor} leading-relaxed whitespace-pre-line text-center max-w-2xl mx-auto text-sm`}>{summary}</p>
          </section>
        )}

        {skills && (
          <section className="mb-10">
            <h2 className={`text-[10px] uppercase tracking-[0.25em] ${style.sectionTitleColor} mb-4 font-semibold text-center`}>Expertise</h2>
            <p className={`${style.bodyTextColor} text-center text-sm`}>{skills}</p>
          </section>
        )}

        {experiences.length > 0 && experiences.some(e => e.job_title || e.company) && (
          <section className="mb-10">
            <h2 className={`text-[10px] uppercase tracking-[0.25em] ${style.sectionTitleColor} mb-6 font-semibold text-center`}>Experience</h2>
            <div className="space-y-8">
              {experiences.filter(e => e.job_title || e.company).map((exp, idx) => (
                <div key={idx}>
                  <div className="mb-3 text-center">
                    <div className={`font-semibold ${style.nameColor} text-base tracking-wide`}>{exp.job_title}</div>
                    <div className={`${style.accentColor} text-sm mt-1`}>
                      {exp.company}{exp.location && ` · ${exp.location}`}
                    </div>
                    {(exp.start_date || exp.end_date) && (
                      <div className={`${style.subtleTextColor} text-xs mt-1 tracking-wide`}>
                        {exp.start_date} — {exp.end_date || 'Present'}
                      </div>
                    )}
                  </div>
                  {exp.achievements && (
                    <ul className={`list-none space-y-2 ${style.bodyTextColor} text-sm max-w-xl mx-auto`}>
                      {exp.achievements.split('\n').filter(a => a.trim()).map((a, i) => (
                        <li key={i} className="pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-gray-300">{a.trim()}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && education.some(e => e.degree || e.university) && (
          <section className="mb-10">
            <h2 className={`text-[10px] uppercase tracking-[0.25em] ${style.sectionTitleColor} mb-6 font-semibold text-center`}>Education</h2>
            <div className="space-y-4">
              {education.filter(e => e.degree || e.university).map((edu, idx) => (
                <div key={idx} className="text-center">
                  <div className={`font-semibold ${style.nameColor} text-sm`}>{edu.degree}</div>
                  <div className={`${style.accentColor} text-sm`}>{edu.university}{edu.location && ` · ${edu.location}`}</div>
                  {(edu.start_date || edu.end_date) && (
                    <div className={`${style.subtleTextColor} text-xs mt-1`}>{edu.start_date} — {edu.end_date}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {languages && (
          <section>
            <h2 className={`text-[10px] uppercase tracking-[0.25em] ${style.sectionTitleColor} mb-4 font-semibold text-center`}>Languages</h2>
            <p className={`${style.bodyTextColor} text-center text-sm`}>{languages}</p>
          </section>
        )}
      </div>
    </div>
  );
}

// Template: Minimal (Ultra-clean)
function MinimalTemplate({ data, style, showWatermark }) {
  const { 
    full_name, target_position, email, phone, linkedin_url, location,
    summary, skills, experiences = [], education = [], languages
  } = data;

  const contactParts = [email, phone, linkedin_url, location].filter(Boolean);

  return (
    <div className={`relative bg-white p-10 md:p-16 ${style.fontFamily}`} id="cv-document">
      {showWatermark && <Watermark />}
      
      <div className={showWatermark ? 'select-none' : ''}>
        <header className="mb-12">
          <h1 className={`text-2xl font-normal ${style.nameColor} mb-1`}>{full_name || 'Your Name'}</h1>
          {target_position && <p className={`text-sm ${style.positionColor} mb-2`}>{target_position}</p>}
          {contactParts.length > 0 && <p className={`text-xs ${style.contactColor}`}>{contactParts.join(' / ')}</p>}
        </header>

        {summary && (
          <section className="mb-10">
            <h2 className={`text-xs ${style.sectionTitleColor} mb-2 font-medium`}>Summary</h2>
            <p className={`${style.bodyTextColor} text-sm leading-relaxed whitespace-pre-line`}>{summary}</p>
          </section>
        )}

        {skills && (
          <section className="mb-10">
            <h2 className={`text-xs ${style.sectionTitleColor} mb-2 font-medium`}>Skills</h2>
            <p className={`${style.bodyTextColor} text-sm`}>{skills}</p>
          </section>
        )}

        {experiences.length > 0 && experiences.some(e => e.job_title || e.company) && (
          <section className="mb-10">
            <h2 className={`text-xs ${style.sectionTitleColor} mb-4 font-medium`}>Experience</h2>
            <div className="space-y-6">
              {experiences.filter(e => e.job_title || e.company).map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`font-medium ${style.nameColor} text-sm`}>{exp.job_title}</span>
                    {(exp.start_date || exp.end_date) && (
                      <span className={`text-xs ${style.subtleTextColor}`}>{exp.start_date} — {exp.end_date || 'Present'}</span>
                    )}
                  </div>
                  <div className={`text-xs ${style.accentColor} mb-2`}>{exp.company}{exp.location && `, ${exp.location}`}</div>
                  {exp.achievements && (
                    <ul className={`space-y-1 ${style.bodyTextColor} text-sm`}>
                      {exp.achievements.split('\n').filter(a => a.trim()).map((a, i) => (
                        <li key={i} className="pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-gray-400">{a.trim()}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && education.some(e => e.degree || e.university) && (
          <section className="mb-10">
            <h2 className={`text-xs ${style.sectionTitleColor} mb-4 font-medium`}>Education</h2>
            <div className="space-y-3">
              {education.filter(e => e.degree || e.university).map((edu, idx) => (
                <div key={idx} className="flex justify-between items-baseline">
                  <div>
                    <span className={`font-medium ${style.nameColor} text-sm`}>{edu.degree}</span>
                    {edu.university && <span className={`${style.accentColor} text-sm`}>, {edu.university}</span>}
                  </div>
                  {(edu.start_date || edu.end_date) && (
                    <span className={`text-xs ${style.subtleTextColor}`}>{edu.start_date} — {edu.end_date}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {languages && (
          <section>
            <h2 className={`text-xs ${style.sectionTitleColor} mb-2 font-medium`}>Languages</h2>
            <p className={`${style.bodyTextColor} text-sm`}>{languages}</p>
          </section>
        )}
      </div>
    </div>
  );
}

// Template: Executive (For senior professionals)
function ExecutiveTemplate({ data, style, showWatermark }) {
  const { 
    full_name, target_position, email, phone, linkedin_url, location,
    summary, skills, experiences = [], education = [], languages
  } = data;

  const contactParts = [email, phone, linkedin_url, location].filter(Boolean);

  return (
    <div className="relative bg-white p-8 md:p-12 font-sans" id="cv-document">
      {showWatermark && <Watermark />}
      
      <div className={showWatermark ? 'select-none' : ''}>
        {/* Header - Strong executive presence */}
        <header className={`mb-10 pb-6 border-b-4 ${style.headerBorder}`}>
          <h1 className={`text-3xl md:text-4xl font-bold ${style.nameColor} mb-2 tracking-tight`}>
            {full_name || 'Your Name'}
          </h1>
          {target_position && (
            <p className={`text-xl ${style.positionColor} mb-4 font-light`}>{target_position}</p>
          )}
          {contactParts.length > 0 && (
            <div className="flex flex-wrap gap-4 text-sm">
              {contactParts.map((part, i) => (
                <span key={i} className={style.contactColor}>{part}</span>
              ))}
            </div>
          )}
        </header>

        {/* Executive Summary - Prominent */}
        {summary && (
          <section className="mb-10">
            <h2 className={`text-lg font-bold ${style.sectionTitleColor} mb-4 uppercase tracking-wide border-b ${style.headerBorder} pb-2`}>
              Executive Summary
            </h2>
            <p className={`${style.bodyTextColor} leading-relaxed whitespace-pre-line text-base`}>{summary}</p>
          </section>
        )}

        {/* Key Competencies */}
        {skills && (
          <section className="mb-10">
            <h2 className={`text-lg font-bold ${style.sectionTitleColor} mb-4 uppercase tracking-wide border-b ${style.headerBorder} pb-2`}>
              Key Competencies
            </h2>
            <p className={`${style.bodyTextColor} text-base`}>{skills}</p>
          </section>
        )}

        {/* Professional Experience */}
        {experiences.length > 0 && experiences.some(e => e.job_title || e.company) && (
          <section className="mb-10">
            <h2 className={`text-lg font-bold ${style.sectionTitleColor} mb-6 uppercase tracking-wide border-b ${style.headerBorder} pb-2`}>
              Professional Experience
            </h2>
            <div className="space-y-8">
              {experiences.filter(e => e.job_title || e.company).map((exp, idx) => (
                <div key={idx}>
                  <div className="flex flex-wrap justify-between items-start mb-3">
                    <div>
                      <div className={`font-bold ${style.nameColor} text-lg`}>{exp.job_title}</div>
                      <div className={`${style.accentColor} text-base font-medium`}>{exp.company}</div>
                      {exp.location && <div className={`${style.subtleTextColor} text-sm`}>{exp.location}</div>}
                    </div>
                    {(exp.start_date || exp.end_date) && (
                      <div className={`${style.subtleTextColor} text-sm font-medium bg-gray-100 px-3 py-1`}>
                        {exp.start_date} — {exp.end_date || 'Present'}
                      </div>
                    )}
                  </div>
                  {exp.achievements && (
                    <ul className={`list-disc list-outside ml-5 space-y-2 ${style.bodyTextColor}`}>
                      {exp.achievements.split('\n').filter(a => a.trim()).map((a, i) => <li key={i}>{a.trim()}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && education.some(e => e.degree || e.university) && (
          <section className="mb-10">
            <h2 className={`text-lg font-bold ${style.sectionTitleColor} mb-6 uppercase tracking-wide border-b ${style.headerBorder} pb-2`}>
              Education
            </h2>
            <div className="space-y-4">
              {education.filter(e => e.degree || e.university).map((edu, idx) => (
                <div key={idx} className="flex flex-wrap justify-between items-baseline">
                  <div>
                    <span className={`font-bold ${style.nameColor}`}>{edu.degree}</span>
                    {edu.university && <span className={`${style.accentColor} ml-2`}>— {edu.university}</span>}
                    {edu.location && <span className={`${style.subtleTextColor} ml-2`}>({edu.location})</span>}
                  </div>
                  {(edu.start_date || edu.end_date) && (
                    <span className={`text-sm ${style.subtleTextColor}`}>{edu.start_date} — {edu.end_date}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {languages && (
          <section>
            <h2 className={`text-lg font-bold ${style.sectionTitleColor} mb-4 uppercase tracking-wide border-b ${style.headerBorder} pb-2`}>
              Languages
            </h2>
            <p className={`${style.bodyTextColor} text-base`}>{languages}</p>
          </section>
        )}
      </div>
    </div>
  );
}

// Template: Compact (Dense, space-efficient)
function CompactTemplate({ data, style, showWatermark }) {
  const { 
    full_name, target_position, email, phone, linkedin_url, location,
    summary, skills, experiences = [], education = [], languages
  } = data;

  const contactParts = [email, phone, linkedin_url, location].filter(Boolean);

  return (
    <div className="relative bg-white p-6 md:p-8 font-sans text-sm" id="cv-document">
      {showWatermark && <Watermark />}
      
      <div className={showWatermark ? 'select-none' : ''}>
        {/* Compact Header */}
        <header className={`mb-4 pb-3 border-b ${style.headerBorder}`}>
          <div className="flex flex-wrap justify-between items-start">
            <div>
              <h1 className={`text-xl font-bold ${style.nameColor}`}>{full_name || 'Your Name'}</h1>
              {target_position && <p className={`text-sm ${style.positionColor}`}>{target_position}</p>}
            </div>
            {contactParts.length > 0 && (
              <div className={`text-xs ${style.contactColor} text-right`}>
                {contactParts.map((part, i) => <div key={i}>{part}</div>)}
              </div>
            )}
          </div>
        </header>

        {/* Two-column layout for compact view */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left column - Skills, Education, Languages */}
          <div className="md:col-span-1 space-y-4">
            {skills && (
              <section>
                <h2 className={`text-xs font-bold ${style.sectionTitleColor} uppercase mb-2`}>Skills</h2>
                <p className={`${style.bodyTextColor} text-xs leading-relaxed`}>{skills}</p>
              </section>
            )}

            {education.length > 0 && education.some(e => e.degree || e.university) && (
              <section>
                <h2 className={`text-xs font-bold ${style.sectionTitleColor} uppercase mb-2`}>Education</h2>
                <div className="space-y-2">
                  {education.filter(e => e.degree || e.university).map((edu, idx) => (
                    <div key={idx} className="text-xs">
                      <div className={`font-semibold ${style.nameColor}`}>{edu.degree}</div>
                      <div className={style.accentColor}>{edu.university}</div>
                      {(edu.start_date || edu.end_date) && (
                        <div className={style.subtleTextColor}>{edu.start_date} — {edu.end_date}</div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {languages && (
              <section>
                <h2 className={`text-xs font-bold ${style.sectionTitleColor} uppercase mb-2`}>Languages</h2>
                <p className={`${style.bodyTextColor} text-xs`}>{languages}</p>
              </section>
            )}
          </div>

          {/* Right column - Summary and Experience */}
          <div className="md:col-span-2 space-y-4">
            {summary && (
              <section>
                <h2 className={`text-xs font-bold ${style.sectionTitleColor} uppercase mb-2`}>Profile</h2>
                <p className={`${style.bodyTextColor} text-xs leading-relaxed whitespace-pre-line`}>{summary}</p>
              </section>
            )}

            {experiences.length > 0 && experiences.some(e => e.job_title || e.company) && (
              <section>
                <h2 className={`text-xs font-bold ${style.sectionTitleColor} uppercase mb-2`}>Experience</h2>
                <div className="space-y-3">
                  {experiences.filter(e => e.job_title || e.company).map((exp, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-baseline">
                        <span className={`font-semibold ${style.nameColor} text-xs`}>
                          {exp.job_title} {exp.company && `@ ${exp.company}`}
                        </span>
                        {(exp.start_date || exp.end_date) && (
                          <span className={`${style.subtleTextColor} text-xs`}>{exp.start_date}–{exp.end_date || 'Now'}</span>
                        )}
                      </div>
                      {exp.achievements && (
                        <ul className={`mt-1 space-y-0.5 ${style.bodyTextColor} text-xs`}>
                          {exp.achievements.split('\n').filter(a => a.trim()).slice(0, 3).map((a, i) => (
                            <li key={i} className="pl-2 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                              {a.trim()}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main CVDocument component
export default function CVDocument({ data, showWatermark = false }) {
  const templateName = data.template || 'classic';
  const styleName = data.style || 'professional';
  
  const style = styles[styleName] || styles.professional;
  
  const templates = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    executive: ExecutiveTemplate,
    compact: CompactTemplate
  };
  
  const SelectedTemplate = templates[templateName] || ClassicTemplate;
  
  return <SelectedTemplate data={data} style={style} showWatermark={showWatermark} />;
}

export { styles };
