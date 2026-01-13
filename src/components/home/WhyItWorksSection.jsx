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
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-light text-black mb-12 text-center">
          Why this format works
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <Icon className="h-8 w-8 text-black mb-4" />
                <h3 className="text-lg font-medium text-black mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
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