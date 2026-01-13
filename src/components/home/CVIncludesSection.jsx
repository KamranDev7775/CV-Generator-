import React from 'react';
import { Check } from 'lucide-react';

export default function CVIncludesSection() {
  const sections = [
    'Header (contacts + links)',
    'Summary',
    'Skills',
    'Experience (achievement bullet points)',
    'Education',
    'Certifications / Languages'
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-light text-black mb-12 text-center">
          What your CV includes
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 md:order-1">
            <div className="aspect-[8.5/11] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-xl p-8 blur-sm">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
                <div className="h-px bg-gray-300"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                </div>
                <div className="h-px bg-gray-300"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-4/5"></div>
                </div>
                <div className="h-px bg-gray-300"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="space-y-4">
              {sections.map((section, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-black flex-shrink-0" />
                  <span className="text-gray-700">{section}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}