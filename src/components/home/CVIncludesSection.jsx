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
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            What your CV includes
          </h2>
          <p className="text-xl text-gray-600">
            All the essential sections to showcase your professional profile
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: CV Preview */}
          <div className="relative">
            <div className="aspect-[8.5/11] bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 overflow-hidden">
              {/* CV Header */}
              <div className="space-y-2 mb-6 pb-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Andrew Jason</h1>
                <p className="text-sm text-gray-600">Senior Product Manager</p>
                <p className="text-xs text-gray-500">San Francisco, CA | andrew.jason@email.com | +1 (555) 123-4567 | linkedin.com/in/andrewjason</p>
              </div>

              {/* Professional Summary */}
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Professional Summary</h2>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Results-driven Product Manager with 8+ years of experience leading cross-functional teams at Meta and Google. Expertise in building scalable consumer products that serve millions of users globally.
                </p>
              </div>

              {/* Skills */}
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Skills</h2>
                <p className="text-xs text-gray-600">Product Strategy, Agile, Data Analysis, A/B Testing, User Research, SQL, Figma</p>
              </div>

              {/* Experience */}
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">Professional Experience</h2>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-xs font-semibold text-gray-900">Senior Product Manager</p>
                        <p className="text-xs text-gray-600">Meta, Menlo Park, CA</p>
                      </div>
                      <p className="text-xs text-gray-500">2020 — Present</p>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1 ml-3">
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
                        <p className="text-xs font-semibold text-gray-900">Product Manager</p>
                        <p className="text-xs text-gray-600">Google, Mountain View, CA</p>
                      </div>
                      <p className="text-xs text-gray-500">2017 — 2020</p>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1 ml-3">
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
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Education</h2>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-gray-900">MBA, Business Administration</p>
                    <p className="text-xs text-gray-600">Stanford University, Stanford, CA</p>
                  </div>
                  <p className="text-xs text-gray-500">2015 — 2017</p>
                </div>
              </div>

              {/* Languages */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Languages</h2>
                <p className="text-xs text-gray-600">English (Native), Spanish (C1), Mandarin (B2)</p>
              </div>
            </div>
          </div>

          {/* Right: Sections List */}
          <div className="space-y-6">
            {sections.map((section, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-4 p-6 rounded-2xl bg-white hover:shadow-lg transition-all duration-300 cursor-default group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {section}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500 text-center mt-12">
          All sections professionally formatted and optimized for ATS systems
        </p>
      </div>
    </section>
  );
}