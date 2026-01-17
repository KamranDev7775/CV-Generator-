import React from 'react';
import { ShieldCheck, CreditCard, Eye, X as XIcon, DollarSign } from 'lucide-react';

export default function TransparentPricingSection() {
  const features = [
    {
      icon: ShieldCheck,
      title: 'No hidden subscriptions',
      description: 'One-time payment, no recurring charges',
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: CreditCard,
      title: 'Flat €1.99',
      description: 'No trials turning into subscriptions',
      gradient: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50'
    },
    {
      icon: Eye,
      title: 'Preview before payment',
      description: 'See your CV before you pay',
      gradient: 'from-pink-500 to-pink-600',
      bg: 'bg-pink-50'
    },
    {
      icon: XIcon,
      title: 'Cancel anytime',
      description: 'No complex cancellation process',
      gradient: 'from-indigo-500 to-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      icon: DollarSign,
      title: 'Final price shown upfront',
      description: 'No surprise charges or hidden fees',
      gradient: 'from-green-500 to-green-600',
      bg: 'bg-green-50'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600">
            No tricks. No hidden fees. Just honest pricing.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx}
                className={`${feature.bg} rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group cursor-default`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
        
        <p className="text-sm text-gray-500 text-center mt-12 leading-relaxed">
          No auto-renewal, no surprise charges. Final price shown before checkout.
        </p>
      </div>
    </section>
  );
}