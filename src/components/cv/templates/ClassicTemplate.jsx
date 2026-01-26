import React from 'react';

// Classic Template: Traditional, professional design with strong typography
// ATS-friendly: Single column, serif fonts, clear section headers
export default function ClassicTemplate({ data, showWatermark = false }) {
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
    <div className={`relative bg-white p-8 md:p-12 font-serif ${showWatermark ? 'select-none' : ''}`} id="cv-document">
      {showWatermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="transform -rotate-45 text-gray-200 text-2xl md:text-4xl font-sans font-bold text-center leading-relaxed whitespace-nowrap opacity-60">
            Unlock PDF for €1.99
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="mb-8 border-b-2 border-gray-800 pb-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-2 tracking-tight">
          {full_name || 'Your Name'}
        </h1>
        {target_position && (
          <p className="text-lg text-gray-700 mb-2 italic">{target_position}</p>
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
          <h2 className="text-sm uppercase tracking-widest text-gray-800 mb-3 font-sans font-bold border-b border-gray-300 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-800 leading-relaxed whitespace-pre-line text-sm">{summary}</p>
        </section>
      )}

      {/* Skills */}
      {skills && (
        <section className="mb-8">
          <h2 className="text-sm uppercase tracking-widest text-gray-800 mb-3 font-sans font-bold border-b border-gray-300 pb-1">
            Skills
          </h2>
          <p className="text-gray-800 text-sm">{skills}</p>
        </section>
      )}

      {/* Professional Experience */}
      {experiences.length > 0 && experiences.some(e => e.job_title || e.company) && (
        <section className="mb-8">
          <h2 className="text-sm uppercase tracking-widest text-gray-800 mb-4 font-sans font-bold border-b border-gray-300 pb-1">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {experiences.filter(e => e.job_title || e.company).map((exp, idx) => (
              <div key={idx}>
                <div className="flex flex-wrap justify-between items-baseline mb-2">
                  <div>
                    <span className="font-bold text-black text-sm">{exp.job_title}</span>
                    {exp.company && <span className="text-gray-700 text-sm">, {exp.company}</span>}
                    {exp.location && <span className="text-gray-500 text-sm">, {exp.location}</span>}
                  </div>
                  {(exp.start_date || exp.end_date) && (
                    <span className="text-xs text-gray-600 italic">
                      {exp.start_date} — {exp.end_date || 'Present'}
                    </span>
                  )}
                </div>
                {exp.achievements && (
                  <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700 text-sm">
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
          <h2 className="text-sm uppercase tracking-widest text-gray-800 mb-4 font-sans font-bold border-b border-gray-300 pb-1">
            Education
          </h2>
          <div className="space-y-4">
            {education.filter(e => e.degree || e.university).map((edu, idx) => (
              <div key={idx} className="flex flex-wrap justify-between items-baseline">
                <div>
                  <span className="font-bold text-black text-sm">{edu.degree}</span>
                  {edu.university && <span className="text-gray-700 text-sm">, {edu.university}</span>}
                  {edu.location && <span className="text-gray-500 text-sm">, {edu.location}</span>}
                </div>
                {(edu.start_date || edu.end_date) && (
                  <span className="text-xs text-gray-600 italic">
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
          <h2 className="text-sm uppercase tracking-widest text-gray-800 mb-3 font-sans font-bold border-b border-gray-300 pb-1">
            Languages
          </h2>
          <p className="text-gray-800 text-sm">{languages}</p>
        </section>
      )}
    </div>
  );
}

