import React from 'react';

// Modern Template: Clean, contemporary design with subtle color accents
// ATS-friendly: Single column, standard fonts, clear hierarchy
export default function ModernTemplate({ data, showWatermark = false }) {
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
    <div className={`relative bg-white p-8 md:p-12 font-sans ${showWatermark ? 'select-none' : ''}`} id="cv-document">
      {showWatermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="transform -rotate-45 text-gray-200 text-2xl md:text-4xl font-sans font-bold text-center leading-relaxed whitespace-nowrap opacity-60">
            Unlock PDF for €1.99
          </div>
        </div>
      )}
      
      {/* Header with accent bar */}
      <header className="mb-8 border-l-4 border-blue-600 pl-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {full_name || 'Your Name'}
        </h1>
        {target_position && (
          <p className="text-lg text-gray-700 mb-3 font-medium">{target_position}</p>
        )}
        {contactParts.length > 0 && (
          <p className="text-sm text-gray-600 space-x-2">
            {contactParts.map((part, idx) => (
              <span key={idx}>{part}{idx < contactParts.length - 1 ? ' • ' : ''}</span>
            ))}
          </p>
        )}
      </header>

      {/* Professional Summary */}
      {summary && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-3 border-b-2 border-gray-200 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">{summary}</p>
        </section>
      )}

      {/* Skills */}
      {skills && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-3 border-b-2 border-gray-200 pb-1">
            Core Competencies
          </h2>
          <p className="text-gray-700 text-sm">{skills}</p>
        </section>
      )}

      {/* Professional Experience */}
      {experiences.length > 0 && experiences.some(e => e.job_title || e.company) && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-4 border-b-2 border-gray-200 pb-1">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {experiences.filter(e => e.job_title || e.company).map((exp, idx) => (
              <div key={idx} className="border-l-2 border-gray-200 pl-4">
                <div className="flex flex-wrap justify-between items-start mb-2">
                  <div className="flex-1">
                    <span className="font-bold text-gray-900 text-sm">{exp.job_title}</span>
                    {exp.company && <span className="text-gray-700 text-sm"> • {exp.company}</span>}
                    {exp.location && <span className="text-gray-500 text-sm"> • {exp.location}</span>}
                  </div>
                  {(exp.start_date || exp.end_date) && (
                    <span className="text-xs text-gray-500 font-medium">
                      {exp.start_date} — {exp.end_date || 'Present'}
                    </span>
                  )}
                </div>
                {exp.achievements && (
                  <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700 text-sm mt-2">
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
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-4 border-b-2 border-gray-200 pb-1">
            Education
          </h2>
          <div className="space-y-4">
            {education.filter(e => e.degree || e.university).map((edu, idx) => (
              <div key={idx} className="flex flex-wrap justify-between items-baseline border-l-2 border-gray-200 pl-4">
                <div>
                  <span className="font-bold text-gray-900 text-sm">{edu.degree}</span>
                  {edu.university && <span className="text-gray-700 text-sm"> • {edu.university}</span>}
                  {edu.location && <span className="text-gray-500 text-sm"> • {edu.location}</span>}
                </div>
                {(edu.start_date || edu.end_date) && (
                  <span className="text-xs text-gray-500 font-medium">
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
          <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-3 border-b-2 border-gray-200 pb-1">
            Languages
          </h2>
          <p className="text-gray-700 text-sm">{languages}</p>
        </section>
      )}
    </div>
  );
}

