import React from 'react';

/**
 * Dynamic Template Renderer
 * Renders CV templates based on configuration matching the 5 reference designs
 */

const Watermark = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
    <div className="transform -rotate-45 text-gray-200 text-2xl md:text-4xl font-sans font-bold text-center leading-relaxed whitespace-nowrap opacity-60">
      Unlock PDF for €1.99
    </div>
  </div>
);

const PhotoPlaceholder = ({ circular = false, size = "large", photoUrl }) => {
  const sizeClasses = {
    large: circular ? "w-32 h-32" : "w-24 h-32",
    medium: circular ? "w-24 h-24" : "w-20 h-24",
    small: circular ? "w-16 h-16" : "w-14 h-18"
  };
  
  const shapeClass = circular ? "rounded-full" : "rounded-lg";
  
  if (photoUrl) {
    return (
      <div className={`${sizeClasses[size]} ${shapeClass} overflow-hidden bg-gray-100`}>
        <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
      </div>
    );
  }
  
  return (
    <div className={`${sizeClasses[size]} ${shapeClass} bg-gray-300 flex items-center justify-center overflow-hidden`}>
      <svg className="w-1/2 h-1/2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    </div>
  );
};

/**
 * Template 1: Professional with Photo (Edward Smith style)
 * Photo + Single column with clear professional sections
 */
function PhotoSingleColumnLayout({ data, showWatermark, styles = {} }) {
  const { full_name, target_position, email, phone, linkedin_url, location, summary, skills, experiences = [], education = [], languages, photo } = data;
  const padding = styles.preview ? styles.previewPadding : styles.padding;
  const fontSize = styles.preview ? 'text-[10px]' : 'text-sm';
  
  return (
    <div className={`relative bg-white ${padding || 'p-8'} font-sans ${fontSize}`} id="cv-document">
      {showWatermark && <Watermark />}
      <div className={showWatermark ? 'select-none' : ''}>
        {/* Header with Photo */}
        <div className="flex gap-4 mb-6 pb-4 border-b-2 border-gray-800">
          <PhotoPlaceholder size={styles.preview ? "small" : "large"} photoUrl={photo} />
          <div className="flex-1">
            <h1 className={`${styles.preview ? 'text-base' : 'text-2xl'} font-bold text-gray-900 mb-1`}>{full_name || 'Your Name'}</h1>
            <p className="text-gray-600 mb-2">{[location, email, phone, linkedin_url].filter(Boolean).join(' | ')}</p>
          </div>
        </div>

        {/* Professional Summary */}
        {summary && (
          <section className="mb-6">
            <h2 className={`${styles.preview ? 'text-xs' : 'text-base'} font-bold border-b border-gray-800 pb-2 mb-3`}>Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Professional Experience */}
        {experiences?.length > 0 && experiences.some(e => e.job_title || e.company) && (
          <section className="mb-6">
            <h2 className={`${styles.preview ? 'text-xs' : 'text-base'} font-bold border-b border-gray-800 pb-2 mb-3`}>Professional Experience</h2>
            <div className="space-y-4">
              {experiences.filter(e => e.job_title || e.company).map((exp, idx) => (
                <div key={idx}>
                  <div className="font-bold text-gray-900">{exp.job_title}, {exp.company}, {exp.location}</div>
                  <div className="text-gray-600 text-xs mb-2">{exp.start_date} — {exp.end_date || 'Present'}</div>
                  {exp.achievements && (
                    <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700">
                      {exp.achievements.split('\n').filter(a => a.trim()).map((a, i) => <li key={i}>{a.trim()}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education?.length > 0 && education.some(e => e.degree || e.university) && (
          <section className="mb-6">
            <h2 className={`${styles.preview ? 'text-xs' : 'text-base'} font-bold border-b border-gray-800 pb-2 mb-3`}>Education</h2>
            <div className="space-y-3">
              {education.filter(e => e.degree || e.university).map((edu, idx) => (
                <div key={idx}>
                  <div className="font-bold text-gray-900">{edu.degree}, {edu.university}</div>
                  <div className="text-gray-600 text-xs">{edu.start_date}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && (
          <section className="mb-6">
            <h2 className={`${styles.preview ? 'text-xs' : 'text-base'} font-bold border-b border-gray-800 pb-2 mb-3`}>Expert-Level Skills</h2>
            <p className="text-gray-700">{skills}</p>
          </section>
        )}
      </div>
    </div>
  );
}

/**
 * Template 2: Centered Traditional (Tim Stewart style)
 * Formal centered layout with skills table and references - EXACT MATCH
 */
function CenteredTraditionalLayout({ data, showWatermark, styles = {} }) {
  const { full_name, target_position, email, phone, linkedin_url, location, summary, skills, experiences = [], education = [], languages, references = [] } = data;
  const padding = styles.preview ? styles.previewPadding : styles.padding;
  const fontSize = styles.preview ? 'text-[9px]' : 'text-[11px]';
  
  return (
    <div className={`relative bg-white ${padding || 'px-12 py-10'} font-serif ${fontSize} leading-tight`} id="cv-document">
      {showWatermark && <Watermark />}
      <div className={showWatermark ? 'select-none' : ''}>
        {/* Centered Header - Name and Position on same line */}
        <div className="text-center mb-6">
          <h1 className={`${styles.preview ? 'text-sm' : 'text-xl'} font-bold text-gray-900 mb-1.5`}>
            {full_name || 'Your Name'}, {target_position || 'Accountant'}
          </h1>
          <p className={`${styles.preview ? 'text-[8px]' : 'text-[10px]'} text-gray-700`}>
            {[location, phone, email].filter(Boolean).join(', ')}
          </p>
        </div>
        
        {/* Horizontal line after header */}
        <div className="border-t border-gray-400 mb-4"></div>

        {/* Profile Section */}
        {summary && (
          <section className="mb-6">
            <h2 className={`${styles.preview ? 'text-[9px]' : 'text-[11px]'} font-bold uppercase tracking-wide mb-3`}>PROFILE</h2>
            <p className="text-gray-700 leading-relaxed text-justify mb-4">{summary}</p>
            <div className="border-t border-gray-400"></div>
          </section>
        )}

        {/* Employment History Section */}
        {experiences?.length > 0 && experiences.some(e => e.job_title || e.company) && (
          <section className="mb-6">
            <h2 className={`${styles.preview ? 'text-[9px]' : 'text-[11px]'} font-bold uppercase tracking-wide mb-3 mt-4`}>EMPLOYMENT HISTORY</h2>
            <div className="space-y-5">
              {experiences.filter(e => e.job_title || e.company).map((exp, idx) => (
                <div key={idx}>
                  {/* Three-column layout: Date | Title, Company | Location */}
                  <div className="grid grid-cols-12 gap-2 mb-2">
                    <div className={`col-span-3 ${styles.preview ? 'text-[8px]' : 'text-[10px]'} text-gray-700`}>
                      {exp.start_date} — {exp.end_date || 'Sep 2019'}
                    </div>
                    <div className="col-span-6">
                      <div className={`font-bold text-gray-900 ${styles.preview ? 'text-[9px]' : 'text-[11px]'}`}>
                        {exp.job_title}, {exp.company}
                      </div>
                    </div>
                    <div className={`col-span-3 text-right ${styles.preview ? 'text-[8px]' : 'text-[10px]'} text-gray-700`}>
                      {exp.location}
                    </div>
                  </div>
                  {/* Bullet points */}
                  {exp.achievements && (
                    <ul className={`list-disc list-outside ml-5 space-y-0.5 text-gray-700 ${styles.preview ? 'text-[8px]' : 'text-[10px]'} leading-relaxed`}>
                      {exp.achievements.split('\n').filter(a => a.trim()).map((a, i) => (
                        <li key={i}>{a.trim().replace(/^[•\-]\s*/, '')}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-gray-400 mt-4"></div>
          </section>
        )}

        {/* Education Section */}
        {education?.length > 0 && education.some(e => e.degree || e.university) && (
          <section className="mb-6">
            <h2 className={`${styles.preview ? 'text-[9px]' : 'text-[11px]'} font-bold uppercase tracking-wide mb-3 mt-4`}>EDUCATION</h2>
            <div className="space-y-4">
              {education.filter(e => e.degree || e.university).map((edu, idx) => (
                <div key={idx}>
                  {/* Three-column layout: Date | Degree, Institution | Location */}
                  <div className="grid grid-cols-12 gap-2 mb-1.5">
                    <div className={`col-span-3 ${styles.preview ? 'text-[8px]' : 'text-[10px]'} text-gray-700`}>
                      {edu.start_date} — {edu.end_date}
                    </div>
                    <div className="col-span-6">
                      <div className={`font-bold text-gray-900 ${styles.preview ? 'text-[9px]' : 'text-[11px]'}`}>
                        {edu.degree}, {edu.university}
                      </div>
                    </div>
                    <div className={`col-span-3 text-right ${styles.preview ? 'text-[8px]' : 'text-[10px]'} text-gray-700`}>
                      {edu.location}
                    </div>
                  </div>
                  {/* Additional details as bullets */}
                  {edu.achievements && (
                    <ul className={`list-disc list-outside ml-5 space-y-0.5 text-gray-700 ${styles.preview ? 'text-[8px]' : 'text-[10px]'}`}>
                      {edu.achievements.split('\n').filter(a => a.trim()).map((a, i) => (
                        <li key={i}>{a.trim().replace(/^[•\-]\s*/, '')}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-gray-400 mt-4"></div>
          </section>
        )}

        {/* Skills Section - Table Layout */}
        {skills && (
          <section className="mb-6">
            <h2 className={`${styles.preview ? 'text-[9px]' : 'text-[11px]'} font-bold uppercase tracking-wide mb-3 mt-4`}>SKILLS</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
              {skills.split(',').slice(0, 6).map((skill, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-2">
                  <span className={`text-gray-900 ${styles.preview ? 'text-[8px]' : 'text-[10px]'}`}>{skill.trim()}</span>
                  <span className={`text-gray-700 ${styles.preview ? 'text-[8px]' : 'text-[10px]'}`}>Expert</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-400 mt-4"></div>
          </section>
        )}

        {/* References Section */}
        {references && references.length > 0 && (
          <section className="mb-4">
            <h2 className={`${styles.preview ? 'text-[9px]' : 'text-[11px]'} font-bold uppercase tracking-wide mb-3 mt-4`}>REFERENCES</h2>
            <div className="space-y-3">
              {references.map((ref, idx) => (
                <div key={idx} className={`${styles.preview ? 'text-[8px]' : 'text-[10px]'} text-gray-700`}>
                  <div className="font-bold text-gray-900">{ref.name} from {ref.company}</div>
                  <div>{ref.email} · {ref.phone}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/**
 * Template 3: Minimal Centered (Lars McLaren style)
 * Clean centered with bold section headers
 */
function MinimalCenteredLayout({ data, showWatermark, styles = {} }) {
  const { full_name, target_position, email, phone, linkedin_url, location, summary, skills, experiences = [], education = [], languages } = data;
  const padding = styles.preview ? styles.previewPadding : styles.padding;
  const fontSize = styles.preview ? 'text-[10px]' : 'text-sm';
  
  return (
    <div className={`relative bg-white ${padding || 'p-10'} font-sans ${fontSize}`} id="cv-document">
      {showWatermark && <Watermark />}
      <div className={showWatermark ? 'select-none' : ''}>
        {/* Centered Header */}
        <div className="text-center mb-8">
          <h1 className={`${styles.preview ? 'text-lg' : 'text-3xl'} font-bold text-gray-900 mb-2`}>{full_name || 'Your Name'}</h1>
          <p className={`${styles.preview ? 'text-xs' : 'text-base'} text-gray-700 mb-3`}>{target_position}</p>
          <div className="flex justify-center gap-4 text-gray-600 text-xs">
            {location && <span>📍 {location}</span>}
            {email && <span>✉ {email}</span>}
            {phone && <span>📞 {phone}</span>}
          </div>
        </div>

        {/* Professional Experience */}
        {experiences?.length > 0 && experiences.some(e => e.job_title || e.company) && (
          <section className="mb-8">
            <h2 className={`${styles.preview ? 'text-xs' : 'text-sm'} font-bold uppercase tracking-wider border-b-2 border-gray-900 pb-2 mb-4`}>PROFESSIONAL EXPERIENCE</h2>
            <div className="space-y-6">
              {experiences.filter(e => e.job_title || e.company).map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <div>
                      <div className="font-bold text-gray-900">{exp.job_title}</div>
                      <div className="italic text-gray-600">{exp.company}</div>
                    </div>
                    <div className="text-gray-600 text-xs">{exp.start_date} – {exp.end_date || 'present'}</div>
                  </div>
                  <div className="text-gray-600 text-xs mb-2">{exp.location}</div>
                  {exp.achievements && (
                    <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700">
                      {exp.achievements.split('\n').filter(a => a.trim()).map((a, i) => <li key={i}>{a.trim()}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education?.length > 0 && education.some(e => e.degree || e.university) && (
          <section className="mb-8">
            <h2 className={`${styles.preview ? 'text-xs' : 'text-sm'} font-bold uppercase tracking-wider border-b-2 border-gray-900 pb-2 mb-4`}>EDUCATION</h2>
            <div className="space-y-4">
              {education.filter(e => e.degree || e.university).map((edu, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>
                    <div className="font-bold text-gray-900">{edu.degree}</div>
                    <div className="italic text-gray-600">{edu.university}</div>
                    {edu.location && <div className="text-gray-600 text-xs">{edu.location}</div>}
                  </div>
                  <div className="text-gray-600 text-xs text-right">
                    {edu.start_date} – {edu.end_date}<br />
                    {edu.location}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/**
 * Template 4: Modern Sidebar (Aron Loeb style)
 * Gray sidebar with photo, white content area
 */
function SidebarModernLayout({ data, showWatermark, styles = {} }) {
  const { full_name, target_position, email, phone, linkedin_url, location, summary, skills, experiences = [], education = [], languages, photo } = data;
  const fontSize = styles.preview ? 'text-[9px]' : 'text-sm';
  
  return (
    <div className={`relative bg-white flex ${fontSize}`} id="cv-document">
      {showWatermark && <Watermark />}
      <div className={`${showWatermark ? 'select-none' : ''} flex w-full`}>
        {/* Left Sidebar */}
        <div className="w-1/3 bg-gray-100 p-6">
          <PhotoPlaceholder circular={false} size={styles.preview ? "small" : "large"} photoUrl={photo} />
          
          <h2 className={`${styles.preview ? 'text-base' : 'text-3xl'} font-bold mt-6 mb-2`}>{full_name || 'Aron Loeb'}</h2>
          <p className={`${styles.preview ? 'text-xs' : 'text-lg'} mb-6`}>{target_position || 'Marketing Manager'}</p>

          {/* Contact */}
          <div className="mb-6">
            <h3 className="font-bold mb-3">Contact</h3>
            <div className="space-y-2 text-xs">
              {phone && <div><strong>Phone</strong><br/>{phone}</div>}
              {email && <div><strong>Email</strong><br/>{email}</div>}
              {location && <div><strong>Address</strong><br/>{location}</div>}
            </div>
          </div>

          {/* Education */}
          {education?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold mb-3">Education</h3>
              {education.slice(0, 2).map((edu, idx) => (
                <div key={idx} className="mb-4">
                  <div className="text-xs font-semibold">{edu.start_date}</div>
                  <div className="font-bold text-sm">{edu.degree}</div>
                  <div className="text-xs">{edu.university}</div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {skills && (
            <div>
              <h3 className="font-bold mb-3">Experience</h3>
              <ul className="space-y-1 text-xs">
                {skills.split(',').slice(0, 5).map((skill, idx) => (
                  <li key={idx}>• {skill.trim()}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="w-2/3 p-8">
          {summary && (
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Experience */}
          {experiences?.length > 0 && (
            <div>
              <h2 className={`${styles.preview ? 'text-sm' : 'text-2xl'} font-bold mb-6`}>Experience</h2>
              {experiences.filter(e => e.job_title || e.company).map((exp, idx) => (
                <div key={idx} className="mb-6 relative pl-4 border-l-2 border-gray-300">
                  <div className="flex justify-between mb-2">
                    <div className="font-bold text-gray-900">{exp.start_date} – {exp.end_date || '2022'}</div>
                  </div>
                  <div className="text-gray-600 mb-1">{exp.company} | {exp.location}</div>
                  <div className="font-bold mb-2">{exp.job_title}</div>
                  {exp.achievements && (
                    <p className="text-gray-700">{exp.achievements.split('\n')[0]}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Template 5: Dark Sidebar Timeline (Richard Sanchez style)
 * Dark header with photo, gray sidebar, timeline design
 */
function DarkSidebarTimelineLayout({ data, showWatermark, styles = {} }) {
  const { full_name, target_position, email, phone, linkedin_url, location, summary, skills, experiences = [], education = [], languages, photo } = data;
  const fontSize = styles.preview ? 'text-[9px]' : 'text-sm';
  
  return (
    <div className={`relative bg-white ${fontSize}`} id="cv-document">
      {showWatermark && <Watermark />}
      <div className={showWatermark ? 'select-none' : ''}>
        {/* Dark Header */}
        <div className="bg-slate-700 text-white p-6 flex items-center gap-6">
          <PhotoPlaceholder circular={true} size={styles.preview ? "small" : "medium"} photoUrl={photo} />
          <div>
            <h1 className={`${styles.preview ? 'text-lg' : 'text-3xl'} font-bold uppercase tracking-wide`}>{full_name || 'Richard Sanchez'}</h1>
            <p className={`${styles.preview ? 'text-xs' : 'text-base'} mt-1`}>{target_position || 'MARKETING MANAGER'}</p>
          </div>
        </div>

        <div className="flex">
          {/* Left Sidebar */}
          <div className="w-1/3 bg-gray-200 p-6">
            {/* Contact */}
            <div className="mb-6">
              <h3 className="font-bold uppercase text-xs mb-4">CONTACT</h3>
              <div className="space-y-3 text-xs">
                {phone && <div className="flex items-start gap-2"><span>📞</span><span>{phone}</span></div>}
                {email && <div className="flex items-start gap-2"><span>✉</span><span className="break-all">{email}</span></div>}
                {location && <div className="flex items-start gap-2"><span>📍</span><span>{location}</span></div>}
                {linkedin_url && <div className="flex items-start gap-2"><span>🌐</span><span className="break-all">{linkedin_url}</span></div>}
              </div>
            </div>

            {/* Skills */}
            {skills && (
              <div className="mb-6">
                <h3 className="font-bold uppercase text-xs mb-4">SKILLS</h3>
                <ul className="space-y-2 text-xs">
                  {skills.split(',').slice(0, 7).map((skill, idx) => (
                    <li key={idx}>• {skill.trim()}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Languages */}
            {languages && (
              <div className="mb-6">
                <h3 className="font-bold uppercase text-xs mb-4">LANGUAGES</h3>
                <div className="space-y-2 text-xs">
                  {languages.split(',').map((lang, idx) => (
                    <div key={idx}>• {lang.trim()}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Content */}
          <div className="w-2/3 p-8">
            {/* Profile */}
            {summary && (
              <section className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-sm">👤</div>
                  <h2 className="font-bold uppercase tracking-wider">PROFILE</h2>
                </div>
                <div className="ml-11 text-gray-700 leading-relaxed">{summary}</div>
              </section>
            )}

            {/* Work Experience with Timeline */}
            {experiences?.length > 0 && (
              <section className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-sm">💼</div>
                  <h2 className="font-bold uppercase tracking-wider">WORK EXPERIENCE</h2>
                </div>
                <div className="ml-11 border-l-2 border-gray-300">
                  {experiences.filter(e => e.job_title || e.company).map((exp, idx) => (
                    <div key={idx} className="relative pl-6 pb-6 -ml-px">
                      <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-slate-700 -ml-1"></div>
                      <div className="font-bold text-gray-900">{exp.company}</div>
                      <div className="text-gray-600 mb-1">{exp.job_title}</div>
                      <div className="text-xs text-gray-500 mb-2">{exp.start_date} - {exp.end_date || 'PRESENT'}</div>
                      {exp.achievements && (
                        <ul className="list-disc list-outside ml-5 space-y-1 text-gray-700 text-xs">
                          {exp.achievements.split('\n').filter(a => a.trim()).slice(0, 3).map((a, i) => <li key={i}>{a.trim()}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education?.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-sm">🎓</div>
                  <h2 className="font-bold uppercase tracking-wider">EDUCATION</h2>
                </div>
                <div className="ml-11">
                  {education.map((edu, idx) => (
                    <div key={idx} className="mb-4">
                      <div className="flex justify-between">
                        <div className="font-bold text-gray-900">{edu.degree}</div>
                        <div className="text-xs text-gray-500">{edu.start_date} - {edu.end_date}</div>
                      </div>
                      <div className="text-gray-600">{edu.university} | {edu.location}</div>
                      <div className="text-xs text-gray-600">GPA: 3.8 / 4.0</div>
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

/**
 * Main Template Renderer Component
 */
export default function TemplateRenderer({ templateConfig, data, showWatermark = false, preview = false }) {
  if (!templateConfig || !data) {
    return <div className="p-8 text-center text-red-600">Template configuration or data missing</div>;
  }

  const styles = { ...templateConfig.styles, preview };
  const layoutType = templateConfig.layout || 'photo-single-column';

  const layoutMap = {
    'photo-single-column': PhotoSingleColumnLayout,
    'centered-traditional': CenteredTraditionalLayout,
    'minimal-centered': MinimalCenteredLayout,
    'sidebar-modern': SidebarModernLayout,
    'dark-sidebar-timeline': DarkSidebarTimelineLayout
  };

  const LayoutComponent = layoutMap[layoutType] || PhotoSingleColumnLayout;

  return <LayoutComponent data={data} showWatermark={showWatermark} styles={styles} />;
}
