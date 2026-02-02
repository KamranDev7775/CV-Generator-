import { HarvardTemplate, BankingTemplate, SwissTemplate, SidebarLeftTemplate } from './TemplateRenderers';
import { CardsTemplate } from './MoreTemplates';

// Simplified implementations for remaining templates
function LegalTemplate({ data, showWatermark }) {
  const { full_name, target_position, email, phone, location, summary, skills, experiences = [], education = [], languages } = data;
  const fmt = (s, e) => s ? `${s} — ${e || 'Present'}` : e || '';
  return (
    <div className={`relative bg-white p-10 font-mono text-xs min-h-[297mm] ${showWatermark ? 'select-none' : ''}`} id="cv-document">
      {showWatermark && <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"><div className="transform -rotate-45 text-gray-300 text-3xl font-bold opacity-50 border-4 border-gray-300 px-8 py-4">Unlock PDF for €1.99</div></div>}
      <header className="mb-8 text-center border-2 border-black p-4">
        <h1 className="text-xl font-bold uppercase tracking-widest mb-2">{full_name || 'YOUR NAME'}</h1>
        <p className="uppercase">{target_position}</p>
        <div className="mt-2 text-xs">{[email, phone, location].filter(Boolean).join(' | ')}</div>
      </header>
      {summary && <section className="mb-6 border border-black p-3"><h2 className="font-bold uppercase mb-2 border-b border-black pb-1">[ PROFILE ]</h2><p className="leading-relaxed">{summary}</p></section>}
      {experiences.length > 0 && <section className="mb-6"><h2 className="font-bold uppercase mb-3 border-b-2 border-black pb-1">[ EXPERIENCE ]</h2>{experiences.map((exp, i) => <div key={i} className="border-l-4 border-black pl-3 py-2 bg-gray-50 mb-4"><div className="flex justify-between font-bold"><span>{exp.job_title}</span><span>{fmt(exp.start_date, exp.end_date)}</span></div><p className="text-gray-700 mb-1">{exp.company}</p>{exp.achievements && <ul className="list-none space-y-1">{exp.achievements.split('\n').filter(a => a.trim()).map((a, j) => <li key={j}>&gt; {a.trim()}</li>)}</ul>}</div>)}</section>}
      {education.length > 0 && <section className="mb-6 border border-black p-3"><h2 className="font-bold uppercase mb-2 border-b border-black pb-1">[ EDUCATION ]</h2>{education.map((edu, i) => <div key={i} className="flex justify-between mb-2"><span>{edu.degree} — {edu.university}</span><span>{edu.end_date}</span></div>)}</section>}
      <div className="grid grid-cols-2 gap-4">{skills && <div className="border border-black p-3"><h2 className="font-bold uppercase mb-2 border-b border-black pb-1">[ SKILLS ]</h2><p>{skills}</p></div>}{languages && <div className="border border-black p-3"><h2 className="font-bold uppercase mb-2 border-b border-black pb-1">[ LANGUAGES ]</h2><p>{languages}</p></div>}</div>
    </div>
  );
}

function MedicalTemplate({ data, showWatermark }) {
  const { full_name, target_position, email, phone, location, summary, skills, experiences = [], education = [], languages } = data;
  const fmt = (s, e) => s ? `${s} — ${e || 'Present'}` : e || '';
  return (
    <div className={`relative bg-white min-h-[297mm] ${showWatermark ? 'select-none' : ''}`} id="cv-document">
      {showWatermark && <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"><div className="transform -rotate-45 text-gray-300 text-3xl font-bold opacity-50 border-4 border-gray-300 px-8 py-4">Unlock PDF for €1.99</div></div>}
      <header className="bg-blue-800 text-white p-8"><h1 className="text-3xl font-bold mb-2">{full_name || 'Your Name'}</h1><p className="text-blue-200 text-lg">{target_position}</p><div className="mt-4 text-sm text-blue-100 flex flex-wrap gap-4">{email && <span>✉ {email}</span>}{phone && <span>☎ {phone}</span>}{location && <span>📍 {location}</span>}</div></header>
      <div className="p-8">
        <div className="mb-6 flex flex-wrap gap-2">{['Board Certified', 'Licensed', 'ACLS', 'BLS'].map((cert, i) => <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">{cert}</span>)}</div>
        {summary && <section className="mb-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600"><h2 className="text-blue-800 font-bold uppercase text-sm mb-2">Professional Summary</h2><p className="text-gray-700 leading-relaxed">{summary}</p></section>}
        {experiences.length > 0 && <section className="mb-6"><h2 className="text-blue-800 font-bold uppercase text-sm mb-4 pb-2 border-b-2 border-blue-200">Clinical Experience</h2>{experiences.map((exp, i) => <div key={i} className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm mb-4"><div className="flex justify-between items-start mb-2"><div><h3 className="font-bold text-gray-900">{exp.job_title}</h3><p className="text-blue-700">{exp.company}</p></div><span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{fmt(exp.start_date, exp.end_date)}</span></div>{exp.achievements && <ul className="list-disc list-outside ml-5 text-sm text-gray-700 space-y-1">{exp.achievements.split('\n').filter(a => a.trim()).map((a, j) => <li key={j}>{a.trim()}</li>)}</ul>}</div>)}</section>}
        {education.length > 0 && <section className="mb-6"><h2 className="text-blue-800 font-bold uppercase text-sm mb-4 pb-2 border-b-2 border-blue-200">Education</h2>{education.map((edu, i) => <div key={i} className="flex justify-between items-center py-2 border-b border-blue-100"><div><p className="font-semibold text-gray-900">{edu.degree}</p><p className="text-sm text-gray-600">{edu.university}</p></div><span className="text-sm text-blue-600 font-medium">{edu.end_date}</span></div>)}</section>}
        {skills && <section className="mb-6"><h2 className="text-blue-800 font-bold uppercase text-sm mb-3 pb-2 border-b-2 border-blue-200">Clinical Skills</h2><div className="flex flex-wrap gap-2">{skills.split(',').map((s, i) => <span key={i} className="bg-blue-50 text-blue-800 px-3 py-1 rounded border border-blue-200 text-sm">{s.trim()}</span>)}</div></section>}
        {languages && <section><h2 className="text-blue-800 font-bold uppercase text-sm mb-3 pb-2 border-b-2 border-blue-200">Languages</h2><p className="text-gray-700">{languages}</p></section>}
      </div>
    </div>
  );
}

function DarkModeTemplate({ data, showWatermark }) {
  const { full_name, target_position, email, phone, location, summary, skills, experiences = [], education = [], languages } = data;
  const fmt = (s, e) => s ? `${s} — ${e || 'Present'}` : e || '';
  return (
    <div className={`relative bg-gray-900 text-white p-10 min-h-[297mm] ${showWatermark ? 'select-none' : ''}`} id="cv-document">
      {showWatermark && <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"><div className="transform -rotate-45 text-gray-300 text-3xl font-bold opacity-50 border-4 border-gray-300 px-8 py-4">Unlock PDF for €1.99</div></div>}
      <header className="text-center mb-10 border-b-2 border-amber-400 pb-6"><h1 className="text-4xl font-bold text-white mb-2 uppercase tracking-widest">{full_name || 'Your Name'}</h1><p className="text-lg text-amber-400 font-mono">{target_position}</p><div className="mt-4 text-sm text-gray-400 font-mono space-x-4">{email && <span>{email}</span>}{phone && <span>{phone}</span>}{location && <span>{location}</span>}</div></header>
      <div className="grid grid-cols-2 gap-8">
        <div>{experiences.length > 0 && <section className="mb-8"><h2 className="text-amber-400 text-sm uppercase tracking-widest font-bold mb-4">Experience</h2>{experiences.map((exp, i) => <div key={i} className="mb-6 border-l-2 border-amber-400 pl-4"><h3 className="font-bold text-white">{exp.job_title}</h3><p className="text-gray-400 text-sm">{exp.company}</p><p className="text-amber-400 text-xs font-mono">{fmt(exp.start_date, exp.end_date)}</p>{exp.achievements && <ul className="mt-2 text-sm text-gray-300 space-y-1">{exp.achievements.split('\n').filter(a => a.trim()).map((a, j) => <li key={j}>{a.trim()}</li>)}</ul>}</div>)}</section>}</div>
        <div>{education.length > 0 && <section className="mb-8"><h2 className="text-amber-400 text-sm uppercase tracking-widest font-bold mb-4">Education</h2>{education.map((edu, i) => <div key={i} className="mb-4"><h3 className="font-bold text-white">{edu.degree}</h3><p className="text-gray-400 text-sm">{edu.university}</p><p className="text-amber-400 text-xs font-mono">{fmt(edu.start_date, edu.end_date)}</p></div>)}</section>}{skills && <section className="mb-8"><h2 className="text-amber-400 text-sm uppercase tracking-widest font-bold mb-4">Skills</h2><div className="flex flex-wrap gap-2">{skills.split(',').map((s, i) => <span key={i} className="bg-amber-400 text-black px-2 py-1 text-xs font-bold">{s.trim()}</span>)}</div></section>}{languages && <section><h2 className="text-amber-400 text-sm uppercase tracking-widest font-bold mb-4">Languages</h2><p className="text-gray-300">{languages}</p></section>}</div>
      </div>
      {summary && <section className="mt-8 border-t-2 border-amber-400 pt-6"><h2 className="text-amber-400 text-sm uppercase tracking-widest font-bold mb-3">Profile</h2><p className="text-gray-300 leading-relaxed">{summary}</p></section>}
    </div>
  );
}

function MagazineTemplate({ data, showWatermark }) {
  const { full_name, target_position, email, phone, location, summary, skills, experiences = [], education = [], languages } = data;
  const fmt = (s, e) => s ? `${s} — ${e || 'Present'}` : e || '';
  return (
    <div className={`relative bg-white p-10 font-serif min-h-[297mm] ${showWatermark ? 'select-none' : ''}`} id="cv-document">
      {showWatermark && <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"><div className="transform -rotate-45 text-gray-300 text-3xl font-bold opacity-50 border-4 border-gray-300 px-8 py-4">Unlock PDF for €1.99</div></div>}
      <header className="mb-8 border-b-4 border-black pb-6"><h1 className="text-5xl font-black text-black mb-2 tracking-tight">{full_name}</h1><p className="text-xl italic text-gray-600">{target_position}</p><p className="text-sm mt-3">{[email, phone, location].filter(Boolean).join(' • ')}</p></header>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">{summary && <p className="text-lg leading-relaxed font-light">{summary}</p>}{experiences.length > 0 && <section><h2 className="text-sm uppercase tracking-widest font-bold text-gray-900 mb-4 pb-2 border-b-2 border-black">Experience</h2>{experiences.map((exp, i) => <div key={i} className="mb-6"><h3 className="font-bold text-lg">{exp.job_title}</h3><p className="text-gray-600 italic">{exp.company}</p><p className="text-sm text-gray-500">{fmt(exp.start_date, exp.end_date)}</p>{exp.achievements && <p className="mt-2 text-sm">{exp.achievements.split('\n').filter(a => a.trim()).join(' • ')}</p>}</div>)}</section>}</div>
        <div className="bg-gray-100 p-4">{education.length > 0 && <section className="mb-6"><h2 className="text-sm uppercase tracking-widest font-bold mb-3">Education</h2>{education.map((edu, i) => <div key={i} className="mb-3"><p className="font-semibold">{edu.degree}</p><p className="text-xs text-gray-600">{edu.university}</p><p className="text-xs text-gray-500">{edu.end_date}</p></div>)}</section>}{skills && <section className="mb-6"><h2 className="text-sm uppercase tracking-widest font-bold mb-3">Skills</h2><p className="text-sm">{skills}</p></section>}{languages && <section><h2 className="text-sm uppercase tracking-widest font-bold mb-3">Languages</h2><p className="text-sm">{languages}</p></section>}</div>
      </div>
    </div>
  );
}

// Re-export all templates
export { HarvardTemplate, BankingTemplate, SwissTemplate, SidebarLeftTemplate, CardsTemplate };
export { LegalTemplate, MedicalTemplate, DarkModeTemplate, MagazineTemplate };

// Aliases for remaining templates
const TimelineTemplate = MagazineTemplate;
const SidebarRightTemplate = SidebarLeftTemplate;
const SplitHeaderTemplate = SwissTemplate;
const NewspaperTemplate = BankingTemplate;
const PortfolioTemplate = MagazineTemplate;
const TerracottaTemplate = MedicalTemplate;
const TechStartupTemplate = SidebarLeftTemplate;
const LuxuryTemplate = HarvardTemplate;
const NordicTemplate = BankingTemplate;
const BoldContrastTemplate = DarkModeTemplate;
const InfographicTemplate = SwissTemplate;

export { TimelineTemplate, SidebarRightTemplate, SplitHeaderTemplate, NewspaperTemplate, PortfolioTemplate, TerracottaTemplate, TechStartupTemplate, LuxuryTemplate, NordicTemplate, BoldContrastTemplate, InfographicTemplate };
