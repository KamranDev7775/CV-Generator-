import React from 'react';

export default function CVDocument({ data, showWatermark = false }) {
  const { 
    full_name, 
    target_position, 
    email, 
    phone, 
    linkedin_url, 
    location,
    experiences = [],
    education = [],
    skills = [],
    languages = [],
    tools_tech = [],
    additional_info
  } = data;

  const contactParts = [email, phone, linkedin_url, location].filter(Boolean);

  return (
    <div className="relative bg-white p-12 font-sans" id="cv-document" style={{ maxWidth: '210mm' }}>
      {showWatermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="transform -rotate-45 text-gray-200 text-3xl font-bold text-center leading-relaxed whitespace-nowrap opacity-50">
            Unlock PDF for €2.99
          </div>
        </div>
      )}
      
      <div className={showWatermark ? 'select-none' : ''}>
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
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

        {/* Work Experience */}
        {experiences.length > 0 && experiences.some(e => e.job_title || e.company) && (
          <section className="mb-10">
            <h2 className="text-base font-bold text-gray-900 mb-5 pb-2 border-b-2 border-gray-900 uppercase tracking-wide">
              Work Experience
            </h2>
            <div className="space-y-6">
              {experiences.filter(e => e.job_title || e.company).map((exp, idx) => (
                <div key={idx}>
                  <div className="mb-2">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-900 text-base">{exp.job_title || 'Position'}</h3>
                      {(exp.start_date || exp.end_date) && (
                        <span className="text-sm text-gray-600 font-medium">
                          {exp.start_date} {exp.start_date && exp.end_date && '—'} {exp.end_date || (exp.start_date && 'Present')}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-700">
                      {exp.company && <span className="font-medium">{exp.company}</span>}
                      {exp.location && exp.company && <span className="text-gray-500"> • </span>}
                      {exp.location && <span className="text-gray-600">{exp.location}</span>}
                    </div>
                  </div>
                  {exp.achievements && (
                    <ul className="list-disc list-outside ml-5 space-y-1.5 text-sm text-gray-700 leading-relaxed">
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
            <h2 className="text-base font-bold text-gray-900 mb-5 pb-2 border-b-2 border-gray-900 uppercase tracking-wide">
              Education
            </h2>
            <div className="space-y-4">
              {education.filter(e => e.degree || e.university).map((edu, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900 text-base">{edu.degree || 'Degree'}</h3>
                    {(edu.start_date || edu.end_date) && (
                      <span className="text-sm text-gray-600 font-medium">
                        {edu.start_date} {edu.start_date && edu.end_date && '—'} {edu.end_date}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-700">
                    {edu.university && <span className="font-medium">{edu.university}</span>}
                    {edu.location && edu.university && <span className="text-gray-500"> • </span>}
                    {edu.location && <span className="text-gray-600">{edu.location}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Additional */}
        {(skills?.length > 0 || languages?.length > 0 || tools_tech?.length > 0 || additional_info) && (
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-5 pb-2 border-b-2 border-gray-900 uppercase tracking-wide">
              Additional
            </h2>
            <div className="space-y-4">
              {/* Skills */}
              {skills?.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Skills</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {skills.join(', ')}
                  </p>
                </div>
              )}

              {/* Languages */}
              {languages?.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Languages</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {languages.map(l => `${l.language} (${l.level})`).join(', ')}
                  </p>
                </div>
              )}

              {/* Tools & Tech */}
              {tools_tech?.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Tools & Tech</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {tools_tech.join(', ')}
                  </p>
                </div>
              )}

              {/* Additional Information */}
              {additional_info && (
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Additional Information</h3>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {additional_info}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}