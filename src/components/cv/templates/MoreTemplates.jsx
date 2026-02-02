// Cards, Nordic, BoldContrast, Infographic, Luxury, TechStartup, Terracotta, Newspaper, Portfolio, SplitHeader, SidebarRight
export function CardsTemplate({ data, showWatermark }) {
  const { full_name, target_position, email, phone, location, summary, skills, experiences = [], education = [], languages } = data;
  return (
    <div className={`relative bg-gray-50 p-8 min-h-[297mm] ${showWatermark ? 'select-none' : ''}`} id="cv-document">
      {showWatermark && <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"><div className="transform -rotate-45 text-gray-300 text-3xl font-bold opacity-50 border-4 border-gray-300 px-8 py-4">Unlock PDF for €1.99</div></div>}
      <header className="mb-8 text-center bg-white rounded-lg shadow-md p-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{full_name}</h1>
        <p className="text-lg text-gray-600">{target_position}</p>
        <p className="text-sm text-gray-500 mt-2">{[email, phone, location].filter(Boolean).join(' • ')}</p>
      </header>
      {summary && <div className="bg-white rounded-lg shadow-md p-6 mb-6"><p>{summary}</p></div>}
      {experiences.length > 0 && <div className="bg-white rounded-lg shadow-md p-6 mb-6"><h2 className="text-lg font-bold mb-4">Experience</h2>{experiences.map((e,i) => <div key={i} className="mb-4"><h3 className="font-semibold">{e.job_title}</h3><p className="text-sm text-gray-600">{e.company}</p></div>)}</div>}
      <div className="grid grid-cols-2 gap-6">
        {education.length > 0 && <div className="bg-white rounded-lg shadow-md p-6"><h2 className="text-lg font-bold mb-4">Education</h2>{education.map((e,i) => <div key={i}><p className="font-semibold">{e.degree}</p><p className="text-sm text-gray-600">{e.university}</p></div>)}</div>}
        {skills && <div className="bg-white rounded-lg shadow-md p-6"><h2 className="text-lg font-bold mb-4">Skills</h2><p className="text-sm">{skills}</p></div>}
      </div>
    </div>
  );
}
