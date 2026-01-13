import React from 'react';
import { Check } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-20 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Designed for corporate */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-light text-black mb-8">
            Designed for corporate & consulting roles
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-gray-300 mr-4">—</span>
              <span className="text-gray-700">One clean, single-column format</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-300 mr-4">—</span>
              <span className="text-gray-700">Corporate-appropriate fonts & layout</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-300 mr-4">—</span>
              <span className="text-gray-700">No icons, tables or multi-column designs</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-300 mr-4">—</span>
              <span className="text-gray-700">Optimized for EU/UK hiring and ATS systems</span>
            </li>
          </ul>
        </div>

        {/* Why this format works */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-light text-black mb-8">
            Why this format works
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'ATS readable',
              'Machine-parsable PDF',
              'No design noise',
              'Clear section hierarchy',
              'Recruiter-friendly length',
              'Standardized headings'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-black flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transparent pricing */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-light text-black mb-8">
            Transparent pricing
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-gray-300 mr-4">—</span>
              <span className="text-gray-700">No hidden subscriptions</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-300 mr-4">—</span>
              <span className="text-gray-700">No €1.95 trials turning into €25/month</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-300 mr-4">—</span>
              <span className="text-gray-700">Final price shown before download</span>
            </li>
          </ul>
        </div>

        {/* What your CV includes */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-light text-black mb-8">
            What your CV includes
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-gray-300 mr-4">—</span>
              <span>Header (contacts + links)</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-300 mr-4">—</span>
              <span>Summary</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-300 mr-4">—</span>
              <span>Skills</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-300 mr-4">—</span>
              <span>Experience (achievement bullet points)</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-300 mr-4">—</span>
              <span>Education</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-300 mr-4">—</span>
              <span>Certifications / Languages</span>
            </li>
          </ul>
        </div>

        {/* Preview before payment */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-light text-black mb-6">
            Preview before payment
          </h2>
          <p className="text-lg text-gray-700">
            You can preview your full CV before you pay. No surprises.
          </p>
        </div>

        {/* Suitable for */}
        <div>
          <h2 className="text-2xl md:text-3xl font-light text-black mb-8">
            Suitable for
          </h2>
          <ul className="space-y-4">
            {['Consulting', 'Finance', 'Tech', 'Corporate roles in EU/UK'].map((item, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-gray-300 mr-4">—</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}