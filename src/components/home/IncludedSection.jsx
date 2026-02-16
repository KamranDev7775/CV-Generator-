import { Check } from "lucide-react";

export default function IncludedSection() {
  const items = [
    "Experience (achievement bullet points)",
    "Header (contacts + links)",
    "Professional summary",
    "Skills",
    "Education",
    "Languages",
  ];

  return (
    <section className="bg-gradient-to-b from-white to-[#FAF9F7] py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12 md:py-16 grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">

        {/* LEFT IMAGE */}
        <div className="relative group order-2 md:order-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl sm:rounded-[24px] blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <img
            src="/templates/image.jpg"
            className="relative w-full h-auto max-w-[588px] object-cover rounded-2xl sm:rounded-[24px] shadow-xl sm:shadow-2xl group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="order-1 md:order-2">

          {/* LABEL */}
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="w-[2px] h-5 bg-gradient-to-b from-gray-400 to-purple-400"/>
            <span className="text-xs sm:text-sm tracking-widest text-gray-500 uppercase font-semibold">
              Included
            </span>
          </div>

          {/* HEADING */}
          <h2 className="leading-tight mb-4 sm:mb-5 md:mb-6" style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, fontSize: '48px', lineHeight: '56px', letterSpacing: '0px', verticalAlign: 'middle' }}>
            <span className="text-gray-900">What your</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              CV includes
            </span>
          </h2>

          {/* DESCRIPTION */}
          <p className="text-gray-600 max-w-md mb-8 sm:mb-10 md:mb-12" style={{ fontFamily: 'Geist, sans-serif', fontWeight: 400, fontSize: '16px', lineHeight: '20px', letterSpacing: '2%', verticalAlign: 'middle' }}>
            Includes all the essential sections needed to clearly showcase your
            professional profile, skills, and experience in a structured and
            effective way.
          </p>

          {/* CHECKLIST */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 sm:gap-4 group hover:translate-x-2 transition-transform duration-300">
                <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#e9edff] to-[#d5e2ff] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm flex-shrink-0">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"/>
                </div>
                <span className="text-gray-800" style={{ fontFamily: 'Geist, sans-serif', fontWeight: 400, fontSize: '16px', lineHeight: '20px', letterSpacing: '0%' }}>{item}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
