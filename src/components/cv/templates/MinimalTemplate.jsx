import React from 'react';

// Minimal Template: Ultra-clean, minimalist design with maximum whitespace
// ATS-friendly: Single column, simple fonts, maximum readability
export default function MinimalTemplate({ data, showWatermark = false }) {
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
    <div className={`relative bg-white p-10 md:p-16 font-sans ${showWatermark ? 'select-none' : ''}`} id="cv-document">
      {showWatermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="transform -rotate-45 text-gray-200 text-2xl md:text-4xl font-sans font-bold text-center leading-relaxed whitespace-nowrap opacity-60">
            Unlock PDF for €1.99
          </div>
        </div>
      )}
      
      {/* Header - Minimal spacing */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-3 tracking-tight">
          {full_name || 'Your Name'}
        </h1>
        {target_position && (
          <p className="text-lg text-gray-600 mb-4 font-light">{target_position}</p>
        )}
        {contactParts.length > 0 && (
          <p className="text-sm text-gray-500 space-x-3">
            {contactParts.map((part, idx) => (
              <span key={idx}>{part}</span>
            ))}
          </p>
        )}
      </header>

      {/* Professional Summary */}
      {summary && (
        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-medium">
            Summary
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm font-light">{summary}</p>
        </section>
      )}

      {/* Skills */}
      {skills && (
        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-medium">
            Skills
          </h2>
          <p className="text-gray-700 text-sm font-light">{skills}</p>
        </section>
      )}

      {/* Professional Experience */}
      {experiences.length > 0 && experiences.some(e => e.job_title || e.company) && (
        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-6 font-medium">
            Experience
          </h2>
          <div className="space-y-8">
            {experiences.filter(e => e.job_title || e.company).map((exp, idx) => (
              <div key={idx}>
                <div className="flex flex-wrap justify-between items-start mb-3">
                  <div>
                    <span className="font-medium text-gray-900 text-sm">{exp.job_title}</span>
                    {exp.company && <span className="text-gray-600 text-sm"> at {exp.company}</span>}
                    {exp.location && <span className="text-gray-500 text-sm">, {exp.location}</span>}
                  </div>
                  {(exp.start_date || exp.end_date) && (
                    <span className="text-xs text-gray-400">
                      {exp.start_date} — {exp.end_date || 'Present'}
                    </span>
                  )}
                </div>
                {exp.achievements && (
                  <ul className="list-none space-y-2 text-gray-700 text-sm font-light ml-0">
                    {exp.achievements.split('\n').filter(a => a.trim()).map((achievement, aidx) => (
                      <li key={aidx} className="leading-relaxed before:content-['•'] before:mr-2 before:text-gray-400">
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
          <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-6 font-medium">
            Education
          </h2>
          <div className="space-y-5">
            {education.filter(e => e.degree || e.university).map((edu, idx) => (
              <div key={idx} className="flex flex-wrap justify-between items-baseline">
                <div>
                  <span className="font-medium text-gray-900 text-sm">{edu.degree}</span>
                  {edu.university && <span className="text-gray-600 text-sm">, {edu.university}</span>}
                  {edu.location && <span className="text-gray-500 text-sm">, {edu.location}</span>}
                </div>
                {(edu.start_date || edu.end_date) && (
                  <span className="text-xs text-gray-400">
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
          <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-medium">
            Languages
          </h2>
          <p className="text-gray-700 text-sm font-light">{languages}</p>
        </section>
      )}
    </div>
  );
}

