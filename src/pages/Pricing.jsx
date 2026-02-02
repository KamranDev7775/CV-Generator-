import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [cancellingSubscription, setCancellingSubscription] = useState(false);

  useEffect(() => {
    const loadUserAndSubscription = async () => {
      try {
        const user = await base44.auth.me();
        setUserEmail(user?.email);
        
        if (user?.email) {
          const subs = await base44.entities.Subscription.filter({ user_email: user.email });
          const activeSub = subs.find(s => s.status === 'active' || s.status === 'trialing');
          setSubscription(activeSub || null);
        }
      } catch (e) {
        // User not logged in
      } finally {
        setLoadingSubscription(false);
      }
    };
    loadUserAndSubscription();
  }, []);

  const handleCancelSubscription = async () => {
    if (!subscription) return;
    
    const confirmed = window.confirm('Are you sure you want to cancel your subscription? You will lose access at the end of your current billing period.');
    if (!confirmed) return;

    setCancellingSubscription(true);
    try {
      await base44.entities.Subscription.update(subscription.id, {
        status: 'canceled',
        canceled_at: new Date().toISOString()
      });
      setSubscription({ ...subscription, status: 'canceled', canceled_at: new Date().toISOString() });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setCancellingSubscription(false);
    }
  };

  const handleSubscribe = async (planType) => {
    if (window.self !== window.top) {
      alert('Payment checkout is only available in the published app. Please open the app in a new tab to complete your purchase.');
      return;
    }

    setLoadingPlan(planType);

    try {
      const response = await base44.functions.invoke('createSubscriptionCheckout', {
        planType,
        customerEmail: userEmail,
        successUrl: `${window.location.origin}${createPageUrl('PaymentSuccess')}?type=${planType}&session_id=SESSION_PLACEHOLDER`,
        cancelUrl: window.location.href
      });

      // Replace placeholder with actual session ID in the redirect URL
      const redirectUrl = response.data.url;
      window.location.href = redirectUrl;
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

          {/* Active Subscription Banner */}
          {subscription && subscription.status === 'active' && (
            <div className="mb-8 p-6 border border-green-200 bg-green-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-green-800 mb-1">
                    You have an active {subscription.plan_type === 'monthly' ? 'Monthly' : 'Trial'} subscription
                  </h3>
                  <p className="text-sm text-green-700">
                    {subscription.plan_type === 'monthly' ? 'Renews' : 'Access until'}: {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelSubscription}
                  disabled={cancellingSubscription}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  {cancellingSubscription ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Cancel Subscription'
                  )}
                </Button>
              </div>
            </div>
          )}

          {subscription && subscription.status === 'canceled' && (
            <div className="mb-8 p-6 border border-yellow-200 bg-yellow-50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-medium text-yellow-800 mb-1">
                    Subscription Cancelled
                  </h3>
                  <p className="text-sm text-yellow-700">
                    Your access will end on {new Date(subscription.current_period_end).toLocaleDateString()}. You can resubscribe anytime.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* One-Time Purchase */}
            <div className="relative border-2 border-black p-8 md:p-10 bg-white hover:shadow-2xl transition-shadow">
              <div className="absolute top-0 right-0 bg-black text-white text-xs px-3 py-1 font-medium">
                Most popular
              </div>
              
              <h2 className="text-2xl font-semibold text-black mb-2">One-Time Purchase</h2>
              <div className="mb-6">
                <span className="text-5xl font-bold text-black">€1.99</span>
                <span className="text-gray-600 ml-2 text-lg">one-time</span>
              </div>
              
              <Button
                onClick={() => handleSubscribe('trial')}
                disabled={loadingPlan !== null || (subscription?.status === 'active')}
                className="w-full bg-black text-white hover:bg-gray-900 py-7 text-lg font-semibold rounded-lg mb-8 disabled:opacity-50"
              >
                {loadingPlan === 'trial' ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : subscription?.status === 'active' ? (
                  'Already Purchased'
                ) : (
                  'Get your CV for €1.99'
                )}
              </Button>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-black mb-1">5</div>
                  <div className="text-xs text-gray-700 font-medium">Days Access</div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-black mb-1">∞</div>
                  <div className="text-xs text-gray-700 font-medium">Edits & Downloads</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-green-700">30-day money-back guarantee</span>
                </div>
                <p className="text-xs text-gray-600 ml-7">
                  Not satisfied? Get your money back, no questions asked.
                </p>
                <p className="text-xs text-gray-500 ml-0 mt-3">
                  ℹ️ No auto-renewal. One-time payment, permanent ownership.
                </p>
              </div>
            </div>

            {/* Quarterly Plan */}
            <div className="border-2 border-gray-300 p-8 md:p-10 bg-white hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-black mb-2">Billed Quarterly</h2>
              <div className="mb-6">
                <span className="text-5xl font-bold text-black">€24.95</span>
                <span className="text-gray-600 ml-2 text-lg">/ quarter</span>
              </div>
              
              <p className="text-sm text-gray-700 mb-6 leading-relaxed font-medium">
                Ongoing access with quarterly billing
              </p>

              <Button
                onClick={() => handleSubscribe('monthly')}
                disabled={loadingPlan !== null || (subscription?.status === 'active' && subscription?.plan_type === 'monthly')}
                className="w-full border-2 border-black bg-white text-black hover:bg-black hover:text-white py-7 text-lg font-semibold rounded-lg mb-8 disabled:opacity-50 transition-colors"
              >
                {loadingPlan === 'monthly' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : subscription?.status === 'active' && subscription?.plan_type === 'monthly' ? (
                  'Currently Subscribed'
                ) : (
                  'Subscribe for €24.95/quarter'
                )}
              </Button>

              <div className="space-y-3 mb-6">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-green-700">30-day money-back guarantee</span>
                </div>
                <p className="text-xs text-gray-600 ml-7">
                  Not satisfied? Get a full refund within 30 days.
                </p>
                <p className="text-xs text-gray-500 ml-0 mt-3">
                  ℹ️ Auto-renews every 3 months for €24.95 EUR unless cancelled
                </p>
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