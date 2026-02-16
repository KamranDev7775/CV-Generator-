import {
  FileText,
  Zap,
  Layout,
  AlignLeft,
  Clock,
  Type,
  Sparkles,
  File,
  Bolt,
} from "lucide-react";
import { MdOutlineAutoAwesome } from "react-icons/md";

const items = [
  {
    icon: FileText,
    title: "ATS readable",
    desc: "Fully compatible with all leading Applicant Tracking Systems ensuring seamless integration and smooth workflow.",
  },
  {
    icon: Layout,
    title: "Machine-parsable PDF",
    desc: "Designed with a clean structure that allows any hiring software or Applicant Tracking System to easily read and process your data without errors.",
  },
  {
    icon: Zap,
    title: "No Design noise",
    desc: "Minimalist formatting with a clean layout that avoids distracting graphics.",
  },
  {
    icon: AlignLeft,
    title: "Clear section hierarchy",
    desc: "Logical organization that recruiters naturally expect to see.",
  },
  {
    icon: Clock,
    title: "Recruiter friendly length",
    desc: "Optimized format allowing recruiters to quickly scan important details.",
  },
  {
    icon: Type,
    title: "Standardized headings",
    desc: "Industry-standard sections and terminology aligned with expectations.",
  },
];

export default function Features() {
  return (
    <section className="relative bg-white  py-16 sm:py-24 md:py-32 overflow-hidden">
      
      {/* BIG ELLIPSE BACKGROUND */}
      <div className="absolute mt-14 top-0 left-1/2 -translate-x-1/2 rounded-full" style={{ width: '940.98px', height: '940.98px', background: 'linear-gradient(180deg, #D5E2FF 0%, #FFFFFF 50.09%)', backdropFilter: 'blur(136.52px)', opacity: 1 }}/>

      {/* FLOATING ICONS */}
      <div className="hidden md:block absolute top-22 left-1/2 -translate-x-[335px] bg-white p-3 rounded-xl shadow">
        <Bolt className="text-yellow-500 w-5 h-5"/>
      </div>

      <div className="hidden md:block absolute bg-white rounded-xl shadow" style={{ width: '52px', height: '52px', top: '18px', left: '920px', borderRadius: '6.5px', opacity: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Sparkles className="text-purple-500 w-5 h-5"/>
      </div>

      <div className="hidden md:block absolute top-22 left-1/2 translate-x-[290px] bg-white p-3 rounded-xl shadow">
        <File className="text-blue-500 w-5 h-5"/>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">

        <span className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full text-sm shadow mb-5">
          <MdOutlineAutoAwesome className="text-purple-500" />
          Powerful features
        </span>

        <h2 className="text-gray-900 mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-5xl" style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, letterSpacing: '0px', textAlign: 'center', verticalAlign: 'middle' }}>
          Everything you need for your <br />
          perfect CV
        </h2>

        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-12 sm:mb-16 px-4">
          Designed to pass ATS systems and impress recruiters with a clean,
          professional layout highlighting your skills and experience.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {items.map((i, idx) => {
            const Icon = i.icon;
            return (
              <div
                key={idx}
                className="bg-[#FDFCFF] rounded-2xl p-6 text-left border border-[#e5e7f2]"
              >
                <div className="w-10 h-10 mb-4 rounded-lg bg-[#ebe6ff] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-purple-600"/>
                </div>

                <h3 className="text-gray-900 mb-2 text-lg sm:text-xl" style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, letterSpacing: '0%' }}>
                  {i.title}
                </h3>

                <p className="text-gray-600 text-sm" style={{ fontFamily: 'Geist, sans-serif', fontWeight: 400, letterSpacing: '2%' }}>
                  {i.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
