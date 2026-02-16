import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';

export default function Layout({ children, currentPageName }) {
  useEffect(() => {
    const GA_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
    
    if (GA_ID) {
      // Load Google Analytics script
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script1);

      // Initialize gtag
      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}');
      `;
      document.head.appendChild(script2);

      return () => {
        document.head.removeChild(script1);
        document.head.removeChild(script2);
      };
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="mt-auto">
        <div className="bg-gradient-to-b from-[#1a002b] to-[#0c0018] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-10 py-8">

            {/* Top Row */}
            <div className="flex justify-between items-start text-sm text-white/70">

              {/* Left Links */}
              <div className="flex flex-col space-y-2">
                <Link to={createPageUrl('Home')} className="hover:text-white transition">
                  Home
                </Link>
                <Link to={createPageUrl('Dashboard')} className="hover:text-white transition">
                  Dashboard
                </Link>
              </div>

              {/* Center Links */}
              <div className="flex flex-col space-y-2 text-center">
                <Link to={createPageUrl('Templates')} className="hover:text-white transition">
                  Templates
                </Link>
                <Link to={createPageUrl('Pricing')} className="hover:text-white transition">
                  Pricing
                </Link>
              </div>

              {/* Right Links */}
              <div className="flex flex-col space-y-2 text-right">
                <Link to={createPageUrl('FAQs')} className="hover:text-white transition">
                  FAQs
                </Link>
              </div>

              {/* Copyright */}
              <div className="absolute right-10 top-6 text-xs text-white/30">
                © {new Date().getFullYear()} ATS CV Generator. All rights reserved.
              </div>

            </div>

            {/* Divider */}
            <div className="mt-6 border-t border-white/10"></div>

          </div>
        </div>
      </footer>
    </div>
  );
}