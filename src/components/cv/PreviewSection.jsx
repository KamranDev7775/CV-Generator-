import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import CVDocument from './CVDocument';
import { Loader2 } from "lucide-react";
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';

export default function PreviewSection({ cvData, onPayment, onSubscribe, isProcessingPayment }) {
  const [hasSubscription, setHasSubscription] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const user = await base44.auth.me();
      if (user) {
        const subs = await base44.entities.Subscription.filter({ user_email: user.email });
        const activeSub = subs.find(s => s.status === 'active' || s.status === 'trialing');
        setHasSubscription(!!activeSub);
      }
    } catch (e) {
      // Not logged in or error
    } finally {
      setCheckingSubscription(false);
    }
  };

  if (checkingSubscription) {
    return (
      <section className="px-6 md:px-12 lg:px-24 py-20" id="preview">
        <div className="max-w-3xl mx-auto flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </section>
    );
  }

  // User has active subscription - show unlocked view
  if (hasSubscription) {
    return (
      <section className="px-6 md:px-12 lg:px-24 py-20" id="preview">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light text-black mb-4">
            Your CV is ready
          </h2>
          <p className="text-gray-500 mb-12">
            You have an active subscription. Proceed to download your CV.
          </p>

          {/* CV Preview - No watermark for subscribers */}
          <div className="border border-gray-200 shadow-sm mb-12">
            <CVDocument data={cvData} showWatermark={false} />
          </div>

          {/* Action buttons */}
          <Button 
            onClick={onPayment}
            disabled={isProcessingPayment}
            className="w-full bg-black text-white hover:bg-gray-900 py-6 text-base font-normal rounded-none"
          >
            {isProcessingPayment ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Download PDF & Copy Text'
            )}
          </Button>
        </div>
      </section>
    );
  }

  // User does not have subscription - show payment options
  return (
    <section className="px-6 md:px-12 lg:px-24 py-20" id="preview">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-light text-black mb-4">
          Your CV is ready
        </h2>
        <p className="text-gray-500 mb-12">
          Review your generated CV below. Choose a plan to unlock PDF download and text copy.
        </p>

        {/* CV Preview */}
        <div className="border border-gray-200 shadow-sm mb-12">
          <CVDocument data={cvData} showWatermark={true} />
        </div>

        {/* Pricing Options */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* One-time purchase */}
          <div className="p-6 border border-gray-200 bg-white">
            <h3 className="text-lg font-medium text-black mb-2">One-Time Purchase</h3>
            <p className="text-3xl font-light text-black mb-4">€1.99</p>
            <p className="text-sm text-gray-600 mb-4">14 days access to download & edit this CV</p>
            <Button 
              onClick={onPayment}
              disabled={isProcessingPayment}
              className="w-full bg-black text-white hover:bg-gray-900 py-4 text-base font-normal rounded-none"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Get CV for €1.99'
              )}
            </Button>
          </div>

          {/* Monthly subscription */}
          <div className="p-6 border border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-black mb-2">Monthly Subscription</h3>
            <p className="text-3xl font-light text-black mb-4">€6.99<span className="text-sm text-gray-500">/month</span></p>
            <p className="text-sm text-gray-600 mb-4">Unlimited CVs, edits & downloads</p>
            <Link to={createPageUrl('Pricing')}>
              <Button 
                variant="outline"
                className="w-full border-gray-300 text-black hover:bg-gray-100 py-4 text-base font-normal rounded-none"
              >
                Subscribe Monthly
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}