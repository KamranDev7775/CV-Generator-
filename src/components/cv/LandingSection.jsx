import React from 'react';
import { Button } from "@/components/ui/button";

export default function LandingSection({ onStart }) {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 py-20">
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-black leading-tight mb-6">
          Generate an ATS-friendly CV in 2 minutes for €3.99
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 mb-12 font-light">
          Clean structure, corporate-friendly formatting, optimized for Europe.
        </p>
        
        <ul className="space-y-4 mb-12">
          <li className="flex items-start">
            <span className="text-gray-300 mr-4">—</span>
            <span className="text-gray-700">Perfect for Big4 & corporate applications</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-300 mr-4">—</span>
            <span className="text-gray-700">ATS-friendly (no tables, icons, or graphics)</span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-300 mr-4">—</span>
            <span className="text-gray-700">PDF + copyable text after purchase</span>
          </li>
        </ul>
        
        <Button 
          onClick={onStart}
          className="bg-black text-white hover:bg-gray-900 px-8 py-6 text-base font-normal rounded-none"
        >
          Start now
        </Button>
      </div>
    </section>
  );
}