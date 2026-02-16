import React from 'react';

export default function SuitableForSection() {
  const roles = [
    'Consulting', 'Finance', 'Banking', 'Technology', 
    'Engineering', 'Aviation', 'Automotive', 'Pharma', 
    'Retail', 'Energy', 'Startups', 'Public Sector'
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-3 sm:mb-4">
            Suitable for roles in
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
            Our format works across all major industries and career levels
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          {roles.map((role, idx) => (
            <div 
              key={idx}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-full text-gray-900 font-medium hover:shadow-md transition-all duration-300 cursor-default text-sm sm:text-base"
            >
              {role}
            </div>
          ))}
        </div>
        
        <p className="text-xs sm:text-sm text-gray-500 text-center px-4">
          Works perfectly for entry-level to executive positions
        </p>
      </div>
    </section>
  );
}