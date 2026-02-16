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
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-3 sm:mb-4">
            Transparent Pricing
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
            No tricks. No hidden fees. Just honest pricing.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx}
                className={`${feature.bg} rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 hover:shadow-lg transition-all duration-300 group cursor-default`}
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 sm:mb-5 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
        
        <p className="text-xs sm:text-sm text-gray-500 text-center mt-8 sm:mt-12 leading-relaxed px-4">
          No auto-renewal, no surprise charges. Final price shown before checkout.
        </p>
      </div>
    </section>
  );
}