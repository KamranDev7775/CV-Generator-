import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleSubscribe = async (planType) => {
    if (window.self !== window.top) {
      alert('Payment checkout is only available in the published app. Please open the app in a new tab to complete your purchase.');
      return;
    }

    setLoadingPlan(planType);

    try {
      const response = await base44.functions.invoke('createSubscriptionCheckout', {
        planType,
        successUrl: `${window.location.origin}${createPageUrl('Home')}`,
        cancelUrl: window.location.href
      });

      window.location.href = response.data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      setLoadingPlan(null);
    }
  };

  const features = [
    'ATS-friendly CV builder',
    'Clean single-column corporate formatting',
    'Unlimited edits & regenerations',
    'PDF export',
    'Copyable plain text export',
    'Email support'
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="px-6 md:px-12 lg:px-24 py-20">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-gray-500">
              Choose the plan that works best for you
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Trial Plan */}
            <div className="relative border border-gray-200 p-8 md:p-10 bg-white">
              <div className="absolute top-0 right-0 bg-black text-white text-xs px-3 py-1 font-medium">
                Most popular
              </div>
              
              <h2 className="text-2xl font-light text-black mb-2">One-Time Purchase</h2>
              <div className="mb-6">
                <span className="text-5xl font-light text-black">€1.99</span>
                <span className="text-gray-500 ml-2">one-time</span>
              </div>
              
              <Button
                onClick={() => handleSubscribe('trial')}
                disabled={loadingPlan !== null}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 py-7 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all mb-8"
              >
                {loadingPlan === 'trial' ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Get your CV for €1.99'
                )}
              </Button>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">14</div>
                  <div className="text-xs text-gray-600">Days Access</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">∞</div>
                  <div className="text-xs text-gray-600">Edits & Downloads</div>
                </div>
              </div>

              <div className="space-y-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed group-hover:text-black transition-colors">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Plan */}
            <div className="border border-gray-200 p-8 md:p-10 bg-white">
              <h2 className="text-2xl font-light text-black mb-2">Monthly Access</h2>
              <div className="mb-6">
                <span className="text-4xl font-light text-black">€6.99</span>
                <span className="text-gray-500 ml-2">/ month</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Recurring subscription. Cancel anytime.
              </p>

              <Button
                onClick={() => handleSubscribe('monthly')}
                disabled={loadingPlan !== null}
                variant="outline"
                className="w-full border-gray-200 text-black hover:bg-gray-50 py-6 text-base font-normal rounded-none mb-8"
              >
                {loadingPlan === 'monthly' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Subscribe for €6.99/month'
                )}
              </Button>

              <div className="space-y-3">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Back link */}
          <div className="text-center">
            <Link 
              to={createPageUrl('Home')}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}