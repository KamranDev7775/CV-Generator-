import React from 'react';
import { X, Check } from 'lucide-react';

export default function TransparentPricingSection() {
  const comparisons = [
    {
      traditional: 'Hidden subscriptions',
      ours: 'No hidden subscriptions'
    },
    {
      traditional: 'Trial turning into subscription',
      ours: 'Flat €1.99'
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
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-light text-black mb-3 text-center">
          Transparent Pricing
        </h2>
        <p className="text-gray-500 text-center mb-16">
          No tricks. No hidden fees. Just honest pricing.
        </p>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8 border-r border-gray-200">
              <h3 className="text-base font-medium text-gray-500 text-center">
                Generic CV platforms
              </h3>
            </div>
            <div className="p-8 bg-gray-50">
              <h3 className="text-base font-medium text-black text-center">
                This CV Generator
              </h3>
            </div>
          </div>
          
          {comparisons.map((item, idx) => (
            <div key={idx} className="grid md:grid-cols-2 border-t border-gray-200">
              <div className="p-6 flex items-start gap-4 border-r border-gray-200">
                <X className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 leading-relaxed">{item.traditional}</span>
              </div>
              <div className="p-6 flex items-start gap-4 bg-gray-50">
                <Check className="h-5 w-5 text-black flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-900 leading-relaxed">{item.ours}</span>
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-gray-400 text-center mt-8 leading-relaxed">
          No auto-renewal, no surprise charges. Final price shown before checkout.
        </p>
      </div>
    </section>
  );
}