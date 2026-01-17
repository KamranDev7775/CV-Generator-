import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

export default function CorporateDesignSection({ onStart }) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleStart = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await onStart();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-black leading-tight tracking-tight">
                Designed for{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Professional Roles
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Метiculously crafted to meet the highest industry standards, ensuring your application stands out.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-5">
              <div className="group flex items-start gap-5 p-5 rounded-2xl hover:bg-white transition-all duration-300 hover:shadow-lg cursor-default">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    Single-Column Format
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Maximizes readability and ATS compatibility, presenting your information with perfect clarity.
                  </p>
                </div>
              </div>

              <div className="group flex items-start gap-5 p-5 rounded-2xl hover:bg-white transition-all duration-300 hover:shadow-lg cursor-default">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                    Corporate-Appropriate Design
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Professional fonts and layout suitable for top-tier consulting firms and Fortune 500 companies.
                  </p>
                </div>
              </div>

              <div className="group flex items-start gap-5 p-5 rounded-2xl hover:bg-white transition-all duration-300 hover:shadow-lg cursor-default">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors">
                    EU/UK Optimized
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Crafted to meet European recruitment standards and pass ATS screening systems effortlessly.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Button 
                onClick={handleStart}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-10 py-7 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Get your CV now'}
                {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                No credit card required • Ready in 2 minutes
              </p>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative lg:block hidden">
            <div className="relative">
              {/* Decorative gradient orbs */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-3xl" />
              
              {/* CV Preview Card */}
              <div className="relative aspect-[8.5/11] bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 overflow-hidden">
                {/* CV Content Mock */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="h-8 bg-gradient-to-r from-gray-900 to-gray-700 rounded-lg w-2/3" />
                    <div className="h-5 bg-gray-200 rounded-lg w-1/2" />
                  </div>
                  
                  <div className="h-px bg-gray-200" />
                  
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-full" />
                    <div className="h-4 bg-gray-300 rounded w-full" />
                    <div className="h-4 bg-gray-300 rounded w-4/5" />
                  </div>
                  
                  <div className="h-px bg-gray-200" />
                  
                  <div className="space-y-4">
                    <div className="h-5 bg-gray-800 rounded w-1/3" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-300 rounded w-full" />
                      <div className="h-3 bg-gray-300 rounded w-5/6" />
                      <div className="h-3 bg-gray-300 rounded w-4/5" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-5 bg-gray-800 rounded w-1/3" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-300 rounded w-full" />
                      <div className="h-3 bg-gray-300 rounded w-4/5" />
                    </div>
                  </div>
                </div>
                
                {/* Overlay badge */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-white/95 via-white/80 to-transparent backdrop-blur-[2px]">
                  <div className="bg-white shadow-2xl px-8 py-4 rounded-2xl border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">Single-column CV</p>
                    <p className="text-xs text-gray-500 mt-1">ATS-friendly format</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}