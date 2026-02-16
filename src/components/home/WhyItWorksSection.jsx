import React from 'react';
import { Check, FileCheck, List, Zap, User, FileText } from 'lucide-react';

export default function WhyItWorksSection() {
  const features = [
    {
      icon: FileCheck,
      title: 'ATS readable',
      description: 'Compatible with all major Applicant Tracking Systems'
    },
    {
      icon: FileText,
      title: 'Machine-parsable PDF',
      description: 'Clean structure that hiring software can easily parse'
    },
    {
      icon: Zap,
      title: 'No design noise',
      description: 'Minimalist formatting without distracting graphics'
    },
    {
      icon: List,
      title: 'Clear section hierarchy',
      description: 'Logical organization recruiters expect to see'
    },
    {
      icon: User,
      title: 'Recruiter-friendly length',
      description: 'Optimal format for quick screening and review'
    },
    {
      icon: Check,
      title: 'Standardized headings',
      description: 'Industry-standard sections and terminology'
    }
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3 sm:mb-4">
            Why this format works
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Designed to pass ATS systems and impress recruiters
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="group bg-gradient-to-br from-blue-50 to-purple-50 p-6 sm:p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-black mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}