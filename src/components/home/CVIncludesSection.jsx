import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function CVIncludesSection() {
  const sections = [
    'Header (contacts + links)',
    'Professional Summary',
    'Skills',
    'Experience (achievement bullet points)',
    'Education',
    'Languages'
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-3 sm:mb-4">
            What your CV includes
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
            All the essential sections to showcase your professional profile
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          {/* Left: CV Preview */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[8.5/11] bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border border-gray-100 p-4 sm:p-6 md:p-8 overflow-hidden">
              {/* CV Header */}
              <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Andrew Jason</h1>
                <p className="text-xs sm:text-sm text-gray-600">Senior Product Manager</p>
                <p className="text-[10px] sm:text-xs text-gray-500">San Francisco, CA | andrew.jason@email.com | +1 (555) 123-4567 | linkedin.com/in/andrewjason</p>
              </div>

              {/* Professional Summary */}
              <div className="mb-3 sm:mb-5">
                <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 sm:mb-2">Professional Summary</h2>
                <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed">
                  Results-driven Product Manager with 8+ years of experience leading cross-functional teams at Meta and Google. Expertise in building scalable consumer products that serve millions of users globally.
                </p>
              </div>

              {/* Skills */}
              <div className="mb-3 sm:mb-5">
                <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 sm:mb-2">Skills</h2>
                <p className="text-[10px] sm:text-xs text-gray-600">Product Strategy, Agile, Data Analysis, A/B Testing, User Research, SQL, Figma</p>
              </div>

              {/* Experience */}
              <div className="mb-3 sm:mb-5">
                <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 sm:mb-3">Professional Experience</h2>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-[10px] sm:text-xs font-semibold text-gray-900">Senior Product Manager</p>
                        <p className="text-[10px] sm:text-xs text-gray-600">Meta, Menlo Park, CA</p>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500">2020 — Present</p>
                    </div>
                    <ul className="text-[10px] sm:text-xs text-gray-600 space-y-1 ml-2 sm:ml-3">
                      <li className="flex items-start gap-1">
                        <span className="mt-1">•</span>
                        <span>Led development of messaging features used by 50M+ monthly active users</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <span className="mt-1">•</span>
                        <span>Increased user engagement by 35% through data-driven product iterations</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-[10px] sm:text-xs font-semibold text-gray-900">Product Manager</p>
                        <p className="text-[10px] sm:text-xs text-gray-600">Google, Mountain View, CA</p>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500">2017 — 2020</p>
                    </div>
                    <ul className="text-[10px] sm:text-xs text-gray-600 space-y-1 ml-2 sm:ml-3">
                      <li className="flex items-start gap-1">
                        <span className="mt-1">•</span>
                        <span>Launched Google Workspace integrations reaching 10M+ users</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <span className="mt-1">•</span>
                        <span>Managed cross-functional team of 12 engineers and designers</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="mb-3 sm:mb-5">
                <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 sm:mb-2">Education</h2>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-900">MBA, Business Administration</p>
                    <p className="text-[10px] sm:text-xs text-gray-600">Stanford University, Stanford, CA</p>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-500">2015 — 2017</p>
                </div>
              </div>

              {/* Languages */}
              <div>
                <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-700 mb-1 sm:mb-2">Languages</h2>
                <p className="text-[10px] sm:text-xs text-gray-600">English (Native), Spanish (C1), Mandarin (B2)</p>
              </div>
            </div>
          </div>

          {/* Right: Sections List */}
          <div className="space-y-3 sm:space-y-4 order-1 lg:order-2">
            {sections.map((section, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-3 py-1"
              >
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0" strokeWidth={2} />
                <p className="text-sm sm:text-base md:text-lg text-gray-700">
                  {section}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 text-center mt-8 sm:mt-12 px-4">
          All sections professionally formatted and optimized for ATS systems
        </p>
      </div>
    </section>
  );
}