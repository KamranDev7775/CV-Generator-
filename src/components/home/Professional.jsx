import { FileText, Building2, Globe, Headphones, DollarSign, Landmark, Cpu, Wrench, Plane, Car, Pill, ShoppingCart, Zap, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Professional() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(createPageUrl("CVBuilder"));
  };
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-28 grid md:grid-cols-2 gap-10 sm:gap-16 md:gap-20 items-center">

      {/* LEFT SIDE */}
      <div className="space-y-4 sm:space-y-6">
        <span className="text-gray-400" style={{ fontFamily: 'Geist, sans-serif', fontWeight: 400, fontSize: '16px', lineHeight: '20px', letterSpacing: '0px', verticalAlign: 'middle', textTransform: 'uppercase' }}>
          Professional ready CV
        </span>

        <h2 className="mt-3 leading-tight" style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, fontSize: '48px', lineHeight: '56px', letterSpacing: '0px', verticalAlign: 'middle' }}>
          <span className="text-gray-900">Designed for</span> <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            professional roles
          </span>
        </h2>

        <p className="text-base sm:text-lg text-gray-600 mt-4 sm:mt-5 max-w-md leading-relaxed">
          A clean, recruiter-friendly CV designed to help you stand out within
          seconds, clearly highlight your strengths, and make a strong first
          impression on hiring managers.
        </p>

        {/* FEATURES */}
        <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-6">
          <div className="flex gap-3 sm:gap-4 items-start group hover:translate-x-2 transition-transform duration-300">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"/>
            </div>
            <div>
              <h4 className="text-gray-900" style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, fontSize: '20px', lineHeight: '100%', letterSpacing: '0%' }}>Single column format</h4>
              <p className="text-sm text-gray-600 mt-1">
                Easy to read. Works well with screening tools.
              </p>
            </div>
          </div>

          <div className="flex gap-3 sm:gap-4 items-start group hover:translate-x-2 transition-transform duration-300">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600"/>
            </div>
            <div>
              <h4 className="text-gray-900" style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, fontSize: '20px', lineHeight: '100%', letterSpacing: '0%' }}>Professional design</h4>
              <p className="text-sm text-gray-600 mt-1">
                Clean layout and fonts — suitable for any role.
              </p>
            </div>
          </div>

          <div className="flex gap-3 sm:gap-4 items-start group hover:translate-x-2 transition-transform duration-300">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600"/>
            </div>
            <div>
              <h4 className="text-gray-900" style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, fontSize: '20px', lineHeight: '100%', letterSpacing: '0%' }}>
                Globally recognized format
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Meets global standards and passes ATS systems.
              </p>
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <button 
          onClick={handleStart}
          className="mt-8 sm:mt-12 bg-gradient-to-r from-blue-600 to-purple-600
        hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4
        rounded-full font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 text-sm sm:text-base">
          Get your CV now →
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative flex justify-center mt-8 md:mt-0">
        <div className="bg-gradient-to-br from-[#f3f4f8] to-[#e8eaf0] rounded-3xl p-6 sm:p-8 md:p-10 w-full max-w-[520px] h-[320px] sm:h-[380px] md:h-[420px] flex items-center justify-center relative shadow-xl">

          {/* Resume Image */}
          <img
            src="/templates/cv2.png"
            className="w-[180px] sm:w-[220px] md:w-[260px] h-auto rounded-xl shadow-2xl z-0 transition-transform duration-500 hover:scale-105"
          />

          {/* Chart Overlay */}
          <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 right-4 sm:right-6 bg-white rounded-2xl shadow-2xl p-3 sm:p-4 md:p-5 w-[140px] sm:w-[170px] md:w-[200px] z-20 hover:scale-105 transition-transform duration-300">
            <img src="/templates/chart.png" alt="chart" className="w-full h-auto"/>
            <p className="text-xs text-gray-500 mt-2 sm:mt-3">
              <span className="text-blue-600 font-bold text-sm">800k+</span>{" "}
              People got hired
            </p>
          </div>

        </div>
      </div>

    </section>
  );
}

const roles = [
  { name: "Consulting", icon: Headphones },
  { name: "Finance", icon: DollarSign },
  { name: "Banking", icon: Landmark },
  { name: "Technology", icon: Cpu },
  { name: "Engineering", icon: Wrench },
  { name: "Public sector", icon: Building2 },
  { name: "Aviation", icon: Plane },
  { name: "Automotive", icon: Car },
  { name: "Pharma", icon: Pill },
  { name: "Retail", icon: ShoppingCart },
  { name: "Energy", icon: Zap },
  { name: "Startups", icon: Rocket },
];

export function SuitableForSection() {
  return (
    <section className="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-[#FAF9F7] to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">

        {/* TOP LABEL */}
        <div className="flex items-center justify-center gap-3 mb-5 sm:mb-6">
          <div className="w-[2px] h-5 bg-gradient-to-b from-gray-400 to-purple-400"/>
          <span className="text-xs sm:text-sm tracking-widest text-gray-500 uppercase font-semibold">
            Industries
          </span>
        </div>

        {/* HEADING */}
        <h2 className="mb-4 sm:mb-5" style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, fontSize: '48px', lineHeight: '56px', letterSpacing: '0px', textAlign: 'center', verticalAlign: 'middle' }}>
          <span className="text-gray-900">Suitable for</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            all roles
          </span>
        </h2>

        {/* SUBTITLE */}
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-12 sm:mb-16 leading-relaxed px-4">
          Our format works seamlessly across all major industries and career
          levels, adapting easily to different roles and experience stages.
        </p>

        {/* PILLS */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {roles.map((role, idx) => {
            const Icon = role.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full
                border-2 border-[#cfd7ff] bg-white text-gray-800
                shadow-sm hover:shadow-lg hover:scale-105 hover:border-purple-400 transition-all duration-300 group"
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-purple-600 transition-colors duration-300"/>
                <span style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 300, fontSize: '20px', lineHeight: '24px', letterSpacing: '0%', verticalAlign: 'middle' }}>{role.name}</span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
