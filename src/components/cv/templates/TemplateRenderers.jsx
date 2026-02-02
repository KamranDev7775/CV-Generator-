import React from 'react';

const Watermark = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
    <div className="transform -rotate-45 text-gray-300 text-3xl md:text-5xl font-bold text-center leading-relaxed whitespace-nowrap opacity-50 border-4 border-gray-300 px-8 py-4">
      Unlock PDF for €1.99
    </div>
  </div>
);

const formatDate = (start, end) => start ? `${start} — ${end || 'Present'}` : end || '';

// HARVARD - Classic Academic Style
export function HarvardTemplate({ data, showWatermark }) {
  const { full_name, target_position, email, phone, location, summary, skills, experiences = [], education = [], languages } = data;
  
  return (
    <div className="relative bg-white p-12 font-serif min-h-[297mm]" id="cv-document">
      {showWatermark && <Watermark />}
      <div className={showWatermark ? 'select-none' : ''}>
        {/* Centered Header with Border */}
        <header className="text-center mb-10 border-b-2 border-gray-800 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-wide uppercase">{full_name || 'Your Name'}</h1>
          {target_position && <p className="text-lg text-gray-700 italic mb-3">{target_position}</p>}
          <div className="text-sm text-gray-600">
            {[email, phone, location].filter(Boolean).join(' | ')}
          </div>
        </header>

        {/* Education First - Academic Style */}
        {education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-400 pb-1 mb-4">Education</h2>
            {education.map((edu, i) => (
              <div key={i} className="mb-3 flex justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{edu.degree}</p>
                  <p className="text-sm text-gray-700">{edu.university}{edu.location && `, ${edu.location}`}</p>
                </div>
                <span className="text-sm text-gray-600">{formatDate(edu.start_date, edu.end_date)}</span>
              </div>
            ))}
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-400 pb-1 mb-4">Professional Experience</h2>
            {experiences.map((exp, i) => (
              <div key={i} className="mb-5">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-900">{exp.job_title}</span>
                  <span className="text-sm text-gray-600">{formatDate(exp.start_date, exp.end_date)}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{exp.company}{exp.location && `, ${exp.location}`}</p>
                {exp.achievements && (
                  <ul className="list-disc list-outside ml-5 text-sm text-gray-800 space-y-1">
                    {exp.achievements.split('\n').filter(a => a.trim()).map((a, j) => <li key={j}>{a.trim()}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {summary && (
          <section className="mb-8">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-400 pb-1 mb-3">Profile</h2>
            <p className="text-sm text-gray-800 leading-relaxed">{summary}</p>
          </section>
        )}

        {skills && (
          <section className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-400 pb-1 mb-3">Skills</h2>
            <p className="text-sm text-gray-800">{skills}</p>
          </section>
        )}

        {languages && (
          <section>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-400 pb-1 mb-3">Languages</h2>
            <p className="text-sm text-gray-800">{languages}</p>
          </section>
        )}
      </div>
    </div>
  );
}

// BANKING - Wall Street Compact Style
export function BankingTemplate({ data, showWatermark }) {
  const { full_name, target_position, email, phone, location, summary, skills, experiences = [], education = [], languages } = data;
  
  return (
    <div className="relative bg-white p-8 font-sans text-xs min-h-[297mm]" id="cv-document">
      {showWatermark && <Watermark />}
      <div className={showWatermark ? 'select-none' : ''}>
        <header className="mb-4 pb-3 border-b border-black">
          <h1 className="text-2xl font-bold text-black uppercase tracking-tight">{full_name || 'Your Name'}</h1>
          <div className="flex justify-between items-center mt-1">
            <span className="font-semibold text-gray-700">{target_position}</span>
            <span className="text-gray-600">{[email, phone].filter(Boolean).join(' • ')}</span>
          </div>
        </header>

        {summary && <p className="text-xs text-gray-800 leading-relaxed mb-4">{summary}</p>}

        {experiences.length > 0 && (
          <section className="mb-4">
            <h2 className="font-bold text-black uppercase text-xs border-b border-gray-400 pb-0.5 mb-2">Experience</h2>
            {experiences.map((exp, i) => (
              <div key={i} className="mb-3 border-l-2 border-gray-300 pl-2">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">{exp.job_title}</span>
                  <span className="text-gray-600">{formatDate(exp.start_date, exp.end_date)}</span>
                </div>
                <p className="text-gray-700">{exp.company}</p>
                {exp.achievements && (
                  <ul className="list-disc list-outside ml-4 text-gray-800 space-y-0.5 mt-1">
                    {exp.achievements.split('\n').filter(a => a.trim()).slice(0, 2).map((a, j) => <li key={j}>{a.trim()}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className="mb-4">
            <h2 className="font-bold text-black uppercase text-xs border-b border-gray-400 pb-0.5 mb-2">Education</h2>
            {education.map((edu, i) => (
              <div key={i} className="flex justify-between mb-1">
                <span className="font-semibold text-gray-900">{edu.degree}, {edu.university}</span>
                <span className="text-gray-600">{edu.end_date}</span>
              </div>
            ))}
          </section>
        )}

        <div className="grid grid-cols-2 gap-4">
          {skills && (
            <div>
              <h2 className="font-bold text-black uppercase text-xs border-b border-gray-400 pb-0.5 mb-1">Skills</h2>
              <p className="text-gray-800">{skills}</p>
            </div>
          )}
          {languages && (
            <div>
              <h2 className="font-bold text-black uppercase text-xs border-b border-gray-400 pb-0.5 mb-1">Languages</h2>
              <p className="text-gray-800">{languages}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// SWISS - Bold Geometric with Red Accent
export function SwissTemplate({ data, showWatermark }) {
  const { full_name, target_position, email, phone, location, summary, skills, experiences = [], education = [], languages } = data;
  
  return (
    <div className="relative bg-white min-h-[297mm]" id="cv-document">
      {showWatermark && <Watermark />}
      <div className={showWatermark ? 'select-none' : ''}>
        {/* Bold Asymmetric Header with Red Block */}
        <div className="relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-red-600" />
          <header className="relative p-10 pb-16">
            <div className="relative z-10">
              <h1 className="text-5xl font-black text-black leading-none mb-4 uppercase">{full_name || 'Your Name'}</h1>
              <p className="text-xl font-bold text-red-600 uppercase tracking-widest">{target_position}</p>
              <div className="mt-6 text-sm font-mono space-y-1">
                {email && <div>{email}</div>}
                {phone && <div>{phone}</div>}
                {location && <div>{location}</div>}
              </div>
            </div>
          </header>
        </div>

        <div className="px-10 pb-10">
          {summary && (
            <section className="mb-8 border-l-8 border-red-600 pl-6 py-4">
              <h2 className="text-xs font-black uppercase tracking-widest mb-3 text-red-600">Profile</h2>
              <p className="text-sm leading-relaxed">{summary}</p>
            </section>
          )}

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
              {experiences.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xs font-black uppercase tracking-widest mb-4 pb-2 border-b-4 border-black">Experience</h2>
                  {experiences.map((exp, i) => (
                    <div key={i} className="relative pl-6 border-l-2 border-red-600 mb-6">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-red-600 rounded-full" />
                      <div className="mb-1">
                        <span className="font-bold text-lg">{exp.job_title}</span>
                        <span className="text-red-600 font-bold ml-2">/ {exp.company}</span>
                      </div>
                      <div className="text-xs font-mono text-gray-500 mb-2">{formatDate(exp.start_date, exp.end_date)}</div>
                      {exp.achievements && <p className="text-sm text-gray-700">{exp.achievements.split('\n').filter(a => a.trim()).join(' • ')}</p>}
                    </div>
                  ))}
                </section>
              )}
            </div>

            <div className="col-span-4 bg-gray-100 p-4">
              {education.length > 0 && (
                <section className="mb-6">
                  <h2 className="text-xs font-black uppercase tracking-widest mb-3 pb-1 border-b-2 border-black">Education</h2>
                  {education.map((edu, i) => (
                    <div key={i} className="mb-3">
                      <p className="font-bold text-sm">{edu.degree}</p>
                      <p className="text-xs text-gray-600">{edu.university}</p>
                      <p className="text-xs font-mono text-red-600">{edu.end_date}</p>
                    </div>
                  ))}
                </section>
              )}

              {skills && (
                <section className="mb-6">
                  <h2 className="text-xs font-black uppercase tracking-widest mb-3 pb-1 border-b-2 border-black">Skills</h2>
                  <div className="flex flex-wrap gap-1">
                    {skills.split(',').map((s, i) => <span key={i} className="bg-black text-white px-2 py-0.5 text-xs font-bold">{s.trim()}</span>)}
                  </div>
                </section>
              )}

              {languages && (
                <section>
                  <h2 className="text-xs font-black uppercase tracking-widest mb-3 pb-1 border-b-2 border-black">Languages</h2>
                  <p className="text-sm">{languages}</p>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// SIDEBAR LEFT - Bold colored sidebar
export function SidebarLeftTemplate({ data, showWatermark }) {
  const { full_name, target_position, email, phone, location, summary, skills, experiences = [], education = [], languages } = data;
  
  return (
    <div className="relative bg-white flex min-h-[297mm]" id="cv-document">
      {showWatermark && <Watermark />}
      <div className={`flex w-full ${showWatermark ? 'select-none' : ''}`}>
        {/* Left Sidebar */}
        <div className="w-1/3 bg-teal-700 text-white p-8">
          <h1 className="text-2xl font-black mb-1">{full_name || 'Your Name'}</h1>
          <p className="text-sm font-semibold text-teal-200 mb-8">{target_position}</p>
          
          <div className="space-y-4 text-sm">
            {email && <p>✉ {email}</p>}
            {phone && <p>☎ {phone}</p>}
            {location && <p>📍 {location}</p>}
          </div>

          {skills && (
            <div className="mt-8">
              <h3 className="text-xs uppercase tracking-widest font-bold mb-3 text-teal-200">Skills</h3>
              <p className="text-sm leading-relaxed">{skills}</p>
            </div>
          )}

          {languages && (
            <div className="mt-8">
              <h3 className="text-xs uppercase tracking-widest font-bold mb-3 text-teal-200">Languages</h3>
              <p className="text-sm">{languages}</p>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-8">
          {summary && (
            <section className="mb-8">
              <h2 className="text-xs uppercase tracking-widest font-black text-gray-900 mb-3">Summary</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
            </section>
          )}

          {experiences.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs uppercase tracking-widest font-black text-gray-900 mb-4">Experience</h2>
              {experiences.map((exp, i) => (
                <div key={i} className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-1">{exp.job_title}</h3>
                  <p className="text-sm text-teal-700 mb-1">{exp.company}</p>
                  <p className="text-xs text-gray-500 mb-2">{formatDate(exp.start_date, exp.end_date)}</p>
                  {exp.achievements && (
                    <ul className="list-disc list-outside ml-5 text-sm text-gray-800 space-y-1">
                      {exp.achievements.split('\n').filter(a => a.trim()).map((a, j) => <li key={j}>{a.trim()}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-widest font-black text-gray-900 mb-4">Education</h2>
              {education.map((edu, i) => (
                <div key={i} className="mb-4">
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-sm text-gray-700">{edu.university}</p>
                  <p className="text-xs text-gray-500">{formatDate(edu.start_date, edu.end_date)}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
