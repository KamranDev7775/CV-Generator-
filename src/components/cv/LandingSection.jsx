import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { ArrowRight, CheckCircle2, Upload } from 'lucide-react';

export default function LandingSection({ onStart, onImport }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleStart = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await onStart();
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (isImporting) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.docx';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        setIsImporting(true);
        try {
          await onImport(file);
        } finally {
          setIsImporting(false);
        }
      }
    };
    input.click();
  };

  const testimonials = [
    { name: 'Sarah M.', role: 'Senior Consultant, McKinsey', text: 'Got 3 interviews in 2 weeks' },
    { name: 'Michael K.', role: 'Manager, Deloitte', text: 'Finally passed ATS screening' },
    { name: 'Anna L.', role: 'Analyst, Goldman Sachs', text: 'Professional and polished' }
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 py-20 bg-white">
      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded text-xs mb-6 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Trusted by 10,000+ professionals
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Land your dream job with a professional, ATS-ready CV
            </h1>
            
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Corporate-standard CV format trusted by consultants, analysts, and executives at Fortune 500 companies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleStart}
                disabled={isLoading || isImporting}
                className="bg-gray-900 text-white hover:bg-gray-800 px-10 py-6 text-base font-semibold rounded shadow-sm hover:shadow transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Get your CV now'}
                {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </Button>
              
              <Button 
                onClick={handleImport}
                disabled={isLoading || isImporting}
                variant="outline"
                className="border-2 border-gray-300 text-gray-900 hover:bg-gray-50 px-10 py-6 text-base font-semibold rounded shadow-sm transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isImporting ? 'Importing...' : 'Import existing CV'}
                {!isImporting && <Upload className="ml-2 w-5 h-5" />}
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              No credit card required to preview
            </p>
          </div>

          {/* Right Column - Trust Elements */}
          <div className="space-y-8">
            {/* Testimonials */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">What our users say</h3>
              <div className="space-y-4">
                {testimonials.map((testimonial, idx) => (
                  <div key={idx} className="border-l-2 border-gray-300 pl-4">
                    <p className="text-sm text-gray-700 mb-2">"{testimonial.text}"</p>
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold">{testimonial.name}</span>
                      <span className="text-gray-400"> • </span>
                      <span>{testimonial.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CV Preview Thumbnails */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Professional format</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="aspect-[8.5/11] bg-white rounded border border-gray-300 shadow-sm p-2">
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-1.5 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-1 bg-gray-200 rounded w-full mt-2"></div>
                    <div className="h-1 bg-gray-200 rounded w-full"></div>
                    <div className="h-1 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="aspect-[8.5/11] bg-white rounded border border-gray-300 shadow-sm p-2">
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-1.5 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-1 bg-gray-200 rounded w-full mt-2"></div>
                    <div className="h-1 bg-gray-200 rounded w-full"></div>
                    <div className="h-1 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">Clean, structured, corporate-ready</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}