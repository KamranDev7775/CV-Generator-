import React from 'react';

export default function SocialProofSection() {
  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <h3 className="text-center text-sm uppercase tracking-widest text-gray-400 mb-12">
          Used by applicants targeting companies like:
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-12">
          <div className="text-3xl font-bold text-gray-800">Siemens</div>
          <div className="text-3xl font-bold text-gray-800">BMW</div>
          <div className="text-3xl font-bold text-gray-800">SAP</div>
          <div className="text-3xl font-bold text-gray-800">Lufthansa</div>
          <div className="text-3xl font-bold text-gray-800">Deutsche Bank</div>
        </div>
        <p className="text-xs text-gray-400 text-center leading-relaxed max-w-4xl mx-auto">
          *The names and logos of the companies mentioned above are registered trademarks belonging to their respective owners. Unless otherwise noted, these references in no way aim to suggest an affiliation or association with Makemycv.
        </p>
      </div>
    </section>
  );
}