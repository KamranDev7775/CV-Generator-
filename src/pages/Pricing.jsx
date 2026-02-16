import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import Navbar from '@/components/navigation/Navbar';

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
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #F3F1FF 0%, #FFFFFF 83.1%)' }}>
      <Navbar />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <section className="relative flex-1 px-4 sm:px-6 md:px-12 lg:px-24 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              Flexible Pricing Plans
            </div>
            
            <h1 className="text-3xl sm:text-4xl pb-6 md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight px-4">
              Simple, transparent pricing
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Choose the plan that works best for you
            </p>
          </div>

          {subscription && subscription.status === 'active' && (
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 border border-green-200 bg-green-50/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-green-800 mb-1">
                    You have an active {subscription.plan_type === 'monthly' ? 'Monthly' : 'Trial'} subscription
                  </h3>
                  <p className="text-xs sm:text-sm text-green-700">
                    {subscription.plan_type === 'monthly' ? 'Renews' : 'Access until'}: {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelSubscription}
                  disabled={cancellingSubscription}
                  className="border-red-300 text-red-600 hover:bg-red-50 w-full sm:w-auto text-xs sm:text-sm"
                >
                  {cancellingSubscription ? (
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  ) : (
                    'Cancel Subscription'
                  )}
                </Button>
              </div>
            </div>
          )}

          {subscription && subscription.status === 'canceled' && (
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 border border-yellow-200 bg-yellow-50/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-yellow-800 mb-1">
                    Subscription Cancelled
                  </h3>
                  <p className="text-xs sm:text-sm text-yellow-700">
                    Your access will end on {new Date(subscription.current_period_end).toLocaleDateString()}. You can resubscribe anytime.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12 md:items-stretch">
            <div className="group relative transform transition-all duration-500 md:hover:scale-105 flex">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
              <div className="relative border-2 border-gray-200 p-6 sm:p-8 md:p-10 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all flex flex-col w-full">
                <div className="absolute -top-3 right-4 sm:right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium shadow-lg">
                  Most popular
                </div>
                
                <h2 className="text-xl sm:text-2xl font-semibold text-black mb-2 mt-2">One-Time Purchase</h2>
                <div className="mb-6">
                  <span className="text-4xl sm:text-5xl font-bold text-black">€1.99</span>
                  <span className="text-gray-600 ml-2 text-base sm:text-lg">one-time</span>
                </div>
                
                <Button
                  onClick={() => handleSubscribe('trial')}
                  disabled={loadingPlan !== null || (subscription?.status === 'active')}
                  className="w-full bg-black text-white hover:bg-gray-900 py-6 sm:py-7 text-base sm:text-lg font-semibold rounded-lg mb-8 disabled:opacity-50"
                >
                  {loadingPlan === 'trial' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      Processing...
                    </>
                  ) : subscription?.status === 'active' ? (
                    'Already Purchased'
                  ) : (
                    'Get your CV for €1.99'
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-8">
                  <div className="bg-gray-100 p-3 sm:p-4 rounded-lg text-center">
                    <div className="text-xl sm:text-2xl font-bold text-black mb-1">5</div>
                    <div className="text-[10px] sm:text-xs text-gray-700 font-medium">Days Access</div>
                  </div>
                  <div className="bg-gray-100 p-3 sm:p-4 rounded-lg text-center">
                    <div className="text-xl sm:text-2xl font-bold text-black mb-1">∞</div>
                    <div className="text-[10px] sm:text-xs text-gray-700 font-medium">Edits & Downloads</div>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3 mb-6 flex-grow">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-black flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-3 sm:pt-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-green-700">30-day money-back guarantee</span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-600 ml-6 sm:ml-7">
                    Not satisfied? Get your money back, no questions asked.
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 ml-0 mt-3">
                    ℹ️ No auto-renewal. One-time payment, permanent ownership.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative transform transition-all duration-500 md:hover:scale-105 flex">
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-400 to-gray-500 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500" />
              <div className="relative border-2 border-gray-200 p-6 sm:p-8 md:p-10 bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all flex flex-col w-full">
                <h2 className="text-xl sm:text-2xl font-semibold text-black mb-2">Billed Quarterly</h2>
                <div className="mb-6">
                  <span className="text-4xl sm:text-5xl font-bold text-black">€24.95</span>
                  <span className="text-gray-600 ml-2 text-base sm:text-lg">/ quarter</span>
                </div>
                
                <div className="h-[52px] mb-8">
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                    Ongoing access with quarterly billing
                  </p>
                </div>

                <Button
                  onClick={() => handleSubscribe('monthly')}
                  disabled={loadingPlan !== null || (subscription?.status === 'active' && subscription?.plan_type === 'monthly')}
                  className="w-full border-2 border-black bg-white text-black hover:bg-black hover:text-white py-6 sm:py-7 text-base sm:text-lg font-semibold rounded-lg mb-8 disabled:opacity-50 transition-colors"
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

                <div className="space-y-2 sm:space-y-3 mb-6 flex-grow">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-black flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-3 sm:pt-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-green-700">30-day money-back guarantee</span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-600 ml-6 sm:ml-7">
                    Not satisfied? Get a full refund within 30 days.
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 ml-0 mt-3">
                    ℹ️ Auto-renews every 3 months for €24.95 EUR unless cancelled
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-6 sm:mt-8">
            <Link 
              to={createPageUrl('Home')}
              className="inline-flex items-center text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors group"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
