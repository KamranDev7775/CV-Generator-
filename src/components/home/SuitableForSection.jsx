import React from 'react';
import { Badge } from "@/components/ui/badge";

export default function SuitableForSection() {
  const roles = [
    'Consulting',
    'Finance',
    'Banking',
    'Technology',
    'Engineering',
    'Aviation',
    'Automotive',
    'Pharma',
    'Retail',
    'Energy',
    'Startups',
    'Public Sector'
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <h2 className="text-2xl md:text-3xl font-light text-black mb-8 text-center">
          Suitable for roles in:
        </h2>
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {roles.map((role, idx) => (
            <Badge 
              key={idx} 
              variant="outline" 
              className="px-4 py-2 text-sm border-gray-300 text-gray-700 rounded-full"
            >
              {role}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-gray-500 text-center">
          Common industries where applicants use ATS-friendly CVs in Europe.
        </p>
      </div>
    </section>
  );
}