import React from 'react';
import { X, Check } from 'lucide-react';

export default function TransparentPricingSection() {
  const comparisons = [
    {
      traditional: 'Hidden subscriptions',
      ours: 'No hidden subscriptions'
    },
    {
      traditional: '€1.95 trials → €25/month',
      ours: 'Flat €2.99'
    },
    {
      traditional: 'Pay before preview',
      ours: 'Preview before payment'
    },
    {
      traditional: 'Complex cancellation',
      ours: 'Cancel anytime'
    },
    {
      traditional: 'Surprise charges',
      ours: 'Final price shown upfront'
    }
  ];

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-light text-white mb-4 text-center">
          Transparent Pricing
        </h2>
        <p className="text-gray-400 text-center mb-12">
          No tricks. No hidden fees. Just honest pricing.
        </p>
        
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-6 border-r border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
                Traditional CV builders
              </h3>
            </div>
            <div className="p-6 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
                ATS CV Generator
              </h3>
            </div>
          </div>
          
          {comparisons.map((item, idx) => (
            <div key={idx} className="grid md:grid-cols-2 border-t border-gray-200">
              <div className="p-4 flex items-center gap-3 border-r border-gray-200">
                <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-600">{item.traditional}</span>
              </div>
              <div className="p-4 flex items-center gap-3 bg-gray-50">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-900 font-medium">{item.ours}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}