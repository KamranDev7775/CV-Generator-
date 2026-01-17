import React from 'react';

export default function SuitableForSection() {
  const roles = [
    { title: 'Consulting', gradient: 'from-blue-500 to-blue-600' },
    { title: 'Finance', gradient: 'from-purple-500 to-purple-600' },
    { title: 'Banking', gradient: 'from-pink-500 to-pink-600' },
    { title: 'Technology', gradient: 'from-indigo-500 to-indigo-600' },
    { title: 'Engineering', gradient: 'from-cyan-500 to-cyan-600' },
    { title: 'Aviation', gradient: 'from-blue-600 to-blue-700' },
    { title: 'Automotive', gradient: 'from-purple-600 to-purple-700' },
    { title: 'Pharma', gradient: 'from-pink-600 to-pink-700' },
    { title: 'Retail', gradient: 'from-indigo-600 to-indigo-700' },
    { title: 'Energy', gradient: 'from-green-500 to-green-600' },
    { title: 'Startups', gradient: 'from-orange-500 to-orange-600' },
    { title: 'Public Sector', gradient: 'from-gray-600 to-gray-700' }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Suitable for roles in
          </h2>
          <p className="text-xl text-gray-600">
            Our format works across all major industries and career levels
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {roles.map((role, idx) => (
            <div 
              key={idx}
              className="group relative overflow-hidden rounded-2xl p-8 bg-white hover:shadow-xl transition-all duration-300 cursor-default"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <h3 className="relative text-lg font-semibold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${role.gradient} transition-all text-center">
                {role.title}
              </h3>
            </div>
          ))}
        </div>
        
        <p className="text-sm text-gray-500 text-center mt-12">
          Works perfectly for entry-level to executive positions
        </p>
      </div>
    </section>
  );
}