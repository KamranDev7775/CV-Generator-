import React from 'react';

export default function CVDocument({ data, showWatermark = false }) {
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
    languages,
    tools_tech,
    additional_info
  } = data;

  const contactParts = [email, phone, linkedin_url, location].filter(Boolean);

  // Check if Additional section has any content
  const hasAdditionalContent = skills || languages || tools_tech || additional_info;

  return (
    <div className="relative bg-white p-12 md:p-16 font-serif max-w-[21cm] mx-auto" id="cv-document" style={{ lineHeight: '1.6' }}>
      {showWatermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="transform -rotate-45 text-gray-200 text-2xl md:text-4xl font-sans font-bold text-center leading-relaxed whitespace-nowrap opacity-60">
            Unlock PDF for €2.99
          </div>
        </div>
      )}
      
      <div className={showWatermark ? 'select-none' : ''}>
        {/* Header */}
        <header className="mb-10 pb-4 border-b-2 border-gray-900">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2 tracking-tight">
            {full_name || 'Your Name'}
          </h1>
          {target_position && (
            <p className="text-base text-gray-700 mb-3 font-medium">{target_position}</p>
          )}
          {contactParts.length > 0 && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {contactParts.join(' • ')}
            </p>
          )}
        </header>

        {/* Professional Summary */}
        {summary && (
          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-[0.15em] text-gray-900 mb-4 font-sans font-bold border-b border-gray-300 pb-2">
              Professional Summary
            </h2>
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {experiences.length > 0 && experiences.some(e => e.job_title || e.company) && (
          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-[0.15em] text-gray-900 mb-4 font-sans font-bold border-b border-gray-300 pb-2">
              Work Experience
            </h2>
            <div className="space-y-5">
              {experiences.filter(e => e.job_title || e.company).map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <div className="font-bold text-sm text-black">{exp.job_title}</div>
                      {exp.company && <div className="text-sm text-gray-700 font-medium">{exp.company}{exp.location && `, ${exp.location}`}</div>}
                    </div>
                    {(exp.start_date || exp.end_date) && (
                      <div className="text-xs text-gray-600 whitespace-nowrap ml-4 font-medium">
                        {exp.start_date} – {exp.end_date || 'Present'}
                      </div>
                    )}
                  </div>
                  {exp.achievements && (
                    <ul className="list-disc list-outside ml-5 mt-2 space-y-1 text-sm text-gray-700">
                      {exp.achievements.split('\n').filter(a => a.trim()).map((achievement, aidx) => (
                        <li key={aidx} className="leading-relaxed">{achievement.trim()}</li>
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
            <h2 className="text-xs uppercase tracking-[0.15em] text-gray-900 mb-4 font-sans font-bold border-b border-gray-300 pb-2">
              Education
            </h2>
            <div className="space-y-3">
              {education.filter(e => e.degree || e.university).map((edu, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-bold text-sm text-black">{edu.degree}</div>
                    {edu.university && <div className="text-sm text-gray-700">{edu.university}{edu.location && `, ${edu.location}`}</div>}
                  </div>
                  {(edu.start_date || edu.end_date) && (
                    <div className="text-xs text-gray-600 whitespace-nowrap ml-4 font-medium">
                      {edu.start_date} – {edu.end_date}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Additional Section */}
        {hasAdditionalContent && (
          <section>
            <h2 className="text-xs uppercase tracking-[0.15em] text-gray-900 mb-4 font-sans font-bold border-b border-gray-300 pb-2">
              Additional
            </h2>
            <div className="space-y-4">
              {skills && (
                <div>
                  <h3 className="text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Skills</h3>
                  <p className="text-sm text-gray-800 leading-relaxed">{skills}</p>
                </div>
              )}
              {languages && (
                <div>
                  <h3 className="text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Languages</h3>
                  <p className="text-sm text-gray-800 leading-relaxed">{languages}</p>
                </div>
              )}
              {tools_tech && (
                <div>
                  <h3 className="text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Tools & Tech</h3>
                  <p className="text-sm text-gray-800 leading-relaxed">{tools_tech}</p>
                </div>
              )}
              {additional_info && (
                <div>
                  <h3 className="text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Other</h3>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{additional_info}</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}