import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { ArrowRight, CheckCircle2, Upload, Star } from 'lucide-react';

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

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 py-20 bg-gradient-to-b from-white to-gray-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative max-w-4xl">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm mb-8 font-medium">
          <CheckCircle2 className="w-4 h-4" />
          Trusted by 10,000+ professionals
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-[1.1] mb-6 tracking-tight">
          Land your dream job with an{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ATS-optimized CV
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-12 font-normal leading-relaxed max-w-2xl">
          Create a professional, ATS-friendly resume in minutes. No design skills needed. 
          <span className="block mt-2 text-gray-500">Ready in minutes</span>
        </p>
        
        <div className="grid sm:grid-cols-3 gap-6 mb-12 max-w-2xl">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-1 h-12 bg-blue-600 rounded-full" />
            <div>
              <div className="font-semibold text-black mb-1">ATS-Optimized</div>
              <div className="text-sm text-gray-600">Pass automated screening systems</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-1 h-12 bg-purple-600 rounded-full" />
            <div>
              <div className="font-semibold text-black mb-1">Corporate Ready</div>
              <div className="text-sm text-gray-600">Perfect for top companies & consulting</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-1 h-12 bg-pink-600 rounded-full" />
            <div>
              <div className="font-semibold text-black mb-1">Instant Download</div>
              <div className="text-sm text-gray-600">PDF + copyable text format</div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={handleStart}
            disabled={isLoading || isImporting}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-14 py-7 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Get your CV now'}
            {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </Button>
          
          <Button 
            onClick={handleImport}
            disabled={isLoading || isImporting}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-14 py-7 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isImporting ? 'Importing...' : 'Import CV'}
            {!isImporting && <Upload className="ml-2 w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />}
          </Button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          No credit card required to preview
        </p>
      </div>
    </section>
  );
}