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
    languages
  } = data;

  const contactParts = [email, phone, linkedin_url, location].filter(Boolean);

  return (
    <div className="relative bg-white p-8 md:p-12 font-serif" id="cv-document">
      {showWatermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="transform -rotate-45 text-gray-200 text-2xl md:text-4xl font-sans font-bold text-center leading-relaxed whitespace-nowrap opacity-60">
            Unlock PDF for €2.99
          </div>
        </div>
      )}
      
      <div className={showWatermark ? 'select-none' : ''}>
        {/* Header */}
        <header className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-1">
            {full_name || 'Your Name'}
          </h1>
          {target_position && (
            <p className="text-lg text-gray-700 mb-3">{target_position}</p>
          )}
          {contactParts.length > 0 && (
            <p className="text-sm text-gray-600">
              {contactParts.join(' | ')}
            </p>
          )}
        </header>

        {/* Professional Summary */}
        {summary && (
          <section className="mb-8">
            <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-3 font-sans font-semibold">
              Professional Summary
            </h2>
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">{summary}</p>
          </section>
        )}

        {/* Skills */}
        {skills && (
          <section className="mb-8">
            <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-3 font-sans font-semibold">
              Skills
            </h2>
            <p className="text-gray-800">{skills}</p>
          </section>
        )}

        {/* Professional Experience */}
        {experiences.length > 0 && experiences.some(e => e.job_title || e.company) && (
          <section className="mb-8">
            <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-4 font-sans font-semibold">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {experiences.filter(e => e.job_title || e.company).map((exp, idx) => (
                <div key={idx}>
                  <div className="flex flex-wrap justify-between items-baseline mb-2">
                    <div>
                      <span className="font-semibold text-black">{exp.job_title}</span>
                      {exp.company && <span className="text-gray-700">, {exp.company}</span>}
                      {exp.location && <span className="text-gray-500">, {exp.location}</span>}
                    </div>
                    {(exp.start_date || exp.end_date) && (
                      <span className="text-sm text-gray-500">
                        {exp.start_date} — {exp.end_date || 'Present'}
                      </span>
                    )}
                  </div>
                  {exp.achievements && (
                    <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700">
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
            <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-4 font-sans font-semibold">
              Education
            </h2>
            <div className="space-y-4">
              {education.filter(e => e.degree || e.university).map((edu, idx) => (
                <div key={idx} className="flex flex-wrap justify-between items-baseline">
                  <div>
                    <span className="font-semibold text-black">{edu.degree}</span>
                    {edu.university && <span className="text-gray-700">, {edu.university}</span>}
                    {edu.location && <span className="text-gray-500">, {edu.location}</span>}
                  </div>
                  {(edu.start_date || edu.end_date) && (
                    <span className="text-sm text-gray-500">
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
            <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-3 font-sans font-semibold">
              Languages
            </h2>
            <p className="text-gray-800">{languages}</p>
          </section>
        )}
      </div>
    </div>
  );
}