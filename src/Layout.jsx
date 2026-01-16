import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} ATS CV Generator
            </div>
            <nav className="flex flex-wrap justify-center gap-6 text-sm">
              <Link 
                to={createPageUrl('Home')} 
                className="text-gray-500 hover:text-gray-900 transition-colors hover:underline"
              >
                Home
              </Link>
              <Link 
                to={createPageUrl('Pricing')} 
                className="text-gray-500 hover:text-gray-900 transition-colors hover:underline"
              >
                Pricing
              </Link>
              <Link 
                to={createPageUrl('Dashboard')} 
                className="text-gray-500 hover:text-gray-900 transition-colors hover:underline"
              >
                Dashboard
              </Link>
              <Link 
                to={createPageUrl('PrivacyPolicy')} 
                className="text-gray-500 hover:text-gray-900 transition-colors hover:underline"
              >
                Privacy Policy
              </Link>
              <Link 
                to={createPageUrl('TermsConditions')} 
                className="text-gray-500 hover:text-gray-900 transition-colors hover:underline"
              >
                Terms & Conditions
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}