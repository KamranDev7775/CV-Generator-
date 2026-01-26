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

// Template: Classic (Original - default)
function ClassicTemplate({ data, style, showWatermark }) {
  const { 
    full_name, 
    target_position, 
    email, 
    phone, 
    linkedin_url, 
    location,
    summary,
    skills,
    experiences = [],
    education = [],
    languages
  } = data;

  const contactParts = [email, phone, linkedin_url, location].filter(Boolean);

  return (
    <div className={`relative bg-white p-8 md:p-12 ${style.fontFamily}`} id="cv-document">
      {showWatermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="transform -rotate-45 text-gray-200 text-2xl md:text-4xl font-sans font-bold text-center leading-relaxed whitespace-nowrap opacity-60">
            Unlock PDF for €1.99
          </div>
        </div>
      )}
      
      <div className={showWatermark ? 'select-none' : ''}>
        {/* Header */}
        <header className={`mb-8 border-b ${style.headerBorder} pb-6`}>
          <h1 className={`text-2xl md:text-3xl font-bold ${style.nameColor} mb-1`}>
            {full_name || 'Your Name'}
          </h1>
          {target_position && (
            <p className={`text-lg ${style.positionColor} mb-3`}>{target_position}</p>
          )}
          {contactParts.length > 0 && (
            <p className={`text-sm ${style.contactColor}`}>
              {contactParts.join(' | ')}
            </p>
          )}
        </header>

        {/* Professional Summary */}
        {summary && (
          <section className="mb-8">
            <h2 className={`text-sm uppercase tracking-widest ${style.sectionTitleColor} mb-3 font-sans font-semibold`}>
              Professional Summary
            </h2>
            <p className={`${style.bodyTextColor} leading-relaxed whitespace-pre-line`}>{summary}</p>
          </section>
        )}

        {/* Skills */}
        {skills && (
          <section className="mb-8">
            <h2 className={`text-sm uppercase tracking-widest ${style.sectionTitleColor} mb-3 font-sans font-semibold`}>
              Skills
            </h2>
            <p className={style.bodyTextColor}>{skills}</p>
          </section>
        )}

        {/* Professional Experience */}
        {experiences.length > 0 && experiences.some(e => e.job_title || e.company) && (
          <section className="mb-8">
            <h2 className={`text-sm uppercase tracking-widest ${style.sectionTitleColor} mb-4 font-sans font-semibold`}>
              Professional Experience
            </h2>
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
                      <span className={`text-sm ${style.subtleTextColor}`}>
                        {exp.start_date} — {exp.end_date || 'Present'}
                      </span>
                    )}
                  </div>
                  {exp.achievements && (
                    <ul className={`list-disc list-outside ml-5 space-y-1 ${style.accentColor}`}>
                      {exp.achievements.split('\n').filter(a => a.trim()).map((achievement, aidx) => (
                        <li key={aidx}>{achievement.trim()}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && education.some(e => e.degree || e.university) && (
          <section className="mb-8">
            <h2 className={`text-sm uppercase tracking-widest ${style.sectionTitleColor} mb-4 font-sans font-semibold`}>
              Education
            </h2>
            <div className="space-y-4">
              {education.filter(e => e.degree || e.university).map((edu, idx) => (
                <div key={idx} className="flex flex-wrap justify-between items-baseline">
                  <div>
                    <span className={`font-semibold ${style.nameColor}`}>{edu.degree}</span>
                    {edu.university && <span className={style.accentColor}>, {edu.university}</span>}
                    {edu.location && <span className={style.subtleTextColor}>, {edu.location}</span>}
                  </div>
                  {(edu.start_date || edu.end_date) && (
                    <span className={`text-sm ${style.subtleTextColor}`}>
                      {edu.start_date} — {edu.end_date}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages && (
          <section>
            <h2 className={`text-sm uppercase tracking-widest ${style.sectionTitleColor} mb-3 font-sans font-semibold`}>
              Languages
            </h2>
            <p className={style.bodyTextColor}>{languages}</p>
          </section>
        )}
      </div>
    </div>
  );
}

// Template: Modern (Two-column inspired, but ATS-friendly single column)
function ModernTemplate({ data, style, showWatermark }) {
  const { 
    full_name, 
    target_position, 
    email, 
    phone, 
    linkedin_url, 
    location,
    summary,
    skills,
    experiences = [],
    education = [],
    languages
  } = data;

  const contactParts = [email, phone, linkedin_url, location].filter(Boolean);

  return (
    <div className={`relative bg-white p-8 md:p-12 ${style.fontFamily}`} id="cv-document">
      {showWatermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="transform -rotate-45 text-gray-200 text-2xl md:text-4xl font-sans font-bold text-center leading-relaxed whitespace-nowrap opacity-60">
            Unlock PDF for €1.99
          </div>
        </div>
      )}
      
      <div className={showWatermark ? 'select-none' : ''}>
        {/* Header - Centered */}
        <header className="mb-10 text-center pb-6">
          <h1 className={`text-3xl md:text-4xl font-light ${style.nameColor} mb-2 tracking-wide`}>
            {full_name || 'Your Name'}
          </h1>
          {target_position && (
            <p className={`text-base ${style.positionColor} mb-4 uppercase tracking-widest`}>{target_position}</p>
          )}
          {contactParts.length > 0 && (
            <p className={`text-sm ${style.contactColor}`}>
              {contactParts.join('  •  ')}
            </p>
          )}
          <div className={`mt-6 border-b-2 ${style.headerBorder} w-24 mx-auto`}></div>
        </header>

        {/* Professional Summary */}
        {summary && (
          <section className="mb-10">
            <h2 className={`text-xs uppercase tracking-[0.2em] ${style.sectionTitleColor} mb-4 font-semibold text-center`}>
              Profile
            </h2>
            <p className={`${style.bodyTextColor} leading-relaxed whitespace-pre-line text-center max-w-2xl mx-auto`}>{summary}</p>
          </section>
        )}

        {/* Skills */}
        {skills && (
          <section className="mb-10">
            <h2 className={`text-xs uppercase tracking-[0.2em] ${style.sectionTitleColor} mb-4 font-semibold text-center`}>
              Core Competencies
            </h2>
            <p className={`${style.bodyTextColor} text-center`}>{skills}</p>
          </section>
        )}

        {/* Professional Experience */}
        {experiences.length > 0 && experiences.some(e => e.job_title || e.company) && (
          <section className="mb-10">
            <h2 className={`text-xs uppercase tracking-[0.2em] ${style.sectionTitleColor} mb-6 font-semibold text-center`}>
              Experience
            </h2>
            <div className="space-y-8">
              {experiences.filter(e => e.job_title || e.company).map((exp, idx) => (
                <div key={idx}>
                  <div className="mb-2">
                    <div className={`font-semibold ${style.nameColor} text-lg`}>{exp.job_title}</div>
                    <div className={`${style.accentColor} text-sm`}>
                      {exp.company}{exp.location && ` • ${exp.location}`}
                      {(exp.start_date || exp.end_date) && (
                        <span className={`${style.subtleTextColor} ml-2`}>
                          | {exp.start_date} — {exp.end_date || 'Present'}
                        </span>
                      )}
                    </div>
                  </div>
                  {exp.achievements && (
                    <ul className={`list-disc list-outside ml-5 space-y-1 ${style.bodyTextColor} text-sm`}>
                      {exp.achievements.split('\n').filter(a => a.trim()).map((achievement, aidx) => (
                        <li key={aidx}>{achievement.trim()}</li>
                      ))}
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
            <h2 className={`text-xs uppercase tracking-[0.2em] ${style.sectionTitleColor} mb-6 font-semibold text-center`}>
              Education
            </h2>
            <div className="space-y-4">
              {education.filter(e => e.degree || e.university).map((edu, idx) => (
                <div key={idx} className="text-center">
                  <div className={`font-semibold ${style.nameColor}`}>{edu.degree}</div>
                  <div className={`${style.accentColor} text-sm`}>
                    {edu.university}{edu.location && ` • ${edu.location}`}
                    {(edu.start_date || edu.end_date) && (
                      <span className={style.subtleTextColor}> | {edu.start_date} — {edu.end_date}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages && (
          <section>
            <h2 className={`text-xs uppercase tracking-[0.2em] ${style.sectionTitleColor} mb-4 font-semibold text-center`}>
              Languages
            </h2>
            <p className={`${style.bodyTextColor} text-center`}>{languages}</p>
          </section>
        )}
      </div>
    </div>
  );
}

// Template: Minimal (Ultra-clean, maximum whitespace)
function MinimalTemplate({ data, style, showWatermark }) {
  const { 
    full_name, 
    target_position, 
    email, 
    phone, 
    linkedin_url, 
    location,
    summary,
    skills,
    experiences = [],
    education = [],
    languages
  } = data;

  const contactParts = [email, phone, linkedin_url, location].filter(Boolean);

  return (
    <div className={`relative bg-white p-10 md:p-16 ${style.fontFamily}`} id="cv-document">
      {showWatermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="transform -rotate-45 text-gray-200 text-2xl md:text-4xl font-sans font-bold text-center leading-relaxed whitespace-nowrap opacity-60">
            Unlock PDF for €1.99
          </div>
        </div>
      )}
      
      <div className={showWatermark ? 'select-none' : ''}>
        {/* Header - Minimal */}
        <header className="mb-12">
          <h1 className={`text-2xl font-normal ${style.nameColor} mb-1`}>
            {full_name || 'Your Name'}
          </h1>
          {target_position && (
            <p className={`text-sm ${style.positionColor} mb-2`}>{target_position}</p>
          )}
          {contactParts.length > 0 && (
            <p className={`text-xs ${style.contactColor}`}>
              {contactParts.join(' / ')}
            </p>
          )}
        </header>

        {/* Professional Summary */}
        {summary && (
          <section className="mb-10">
            <h2 className={`text-xs ${style.sectionTitleColor} mb-2 font-medium`}>
              Summary
            </h2>
            <p className={`${style.bodyTextColor} text-sm leading-relaxed whitespace-pre-line`}>{summary}</p>
          </section>
        )}

        {/* Skills */}
        {skills && (
          <section className="mb-10">
            <h2 className={`text-xs ${style.sectionTitleColor} mb-2 font-medium`}>
              Skills
            </h2>
            <p className={`${style.bodyTextColor} text-sm`}>{skills}</p>
          </section>
        )}

        {/* Professional Experience */}
        {experiences.length > 0 && experiences.some(e => e.job_title || e.company) && (
          <section className="mb-10">
            <h2 className={`text-xs ${style.sectionTitleColor} mb-4 font-medium`}>
              Experience
            </h2>
            <div className="space-y-6">
              {experiences.filter(e => e.job_title || e.company).map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`font-medium ${style.nameColor} text-sm`}>{exp.job_title}</span>
                    {(exp.start_date || exp.end_date) && (
                      <span className={`text-xs ${style.subtleTextColor}`}>
                        {exp.start_date} — {exp.end_date || 'Present'}
                      </span>
                    )}
                  </div>
                  <div className={`text-xs ${style.accentColor} mb-2`}>
                    {exp.company}{exp.location && `, ${exp.location}`}
                  </div>
                  {exp.achievements && (
                    <ul className={`space-y-1 ${style.bodyTextColor} text-sm`}>
                      {exp.achievements.split('\n').filter(a => a.trim()).map((achievement, aidx) => (
                        <li key={aidx} className="pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-gray-400">
                          {achievement.trim()}
                        </li>
                      ))}
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
            <h2 className={`text-xs ${style.sectionTitleColor} mb-4 font-medium`}>
              Education
            </h2>
            <div className="space-y-3">
              {education.filter(e => e.degree || e.university).map((edu, idx) => (
                <div key={idx} className="flex justify-between items-baseline">
                  <div>
                    <span className={`font-medium ${style.nameColor} text-sm`}>{edu.degree}</span>
                    {edu.university && <span className={`${style.accentColor} text-sm`}>, {edu.university}</span>}
                  </div>
                  {(edu.start_date || edu.end_date) && (
                    <span className={`text-xs ${style.subtleTextColor}`}>
                      {edu.start_date} — {edu.end_date}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages && (
          <section>
            <h2 className={`text-xs ${style.sectionTitleColor} mb-2 font-medium`}>
              Languages
            </h2>
            <p className={`${style.bodyTextColor} text-sm`}>{languages}</p>
          </section>
        )}
      </div>
    </div>
  );
}

// Main CVDocument component
export default function CVDocument({ data, showWatermark = false }) {
  // Default: classic template with professional style (original design)
  const templateName = data.template || 'classic';
  const styleName = data.style || 'professional';
  
  const style = styles[styleName] || styles.professional;
  
  const templates = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    minimal: MinimalTemplate
  };
  
  const SelectedTemplate = templates[templateName] || ClassicTemplate;
  
  return <SelectedTemplate data={data} style={style} showWatermark={showWatermark} />;
}

// Export for use in other components
export { styles };
