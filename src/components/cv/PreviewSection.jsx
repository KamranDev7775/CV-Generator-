import React from 'react';
import { Button } from "@/components/ui/button";
import CVDocument from './CVDocument';
import { Loader2 } from "lucide-react";

export default function PreviewSection({ cvData, onPayment, isProcessingPayment }) {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-20" id="preview">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-light text-black mb-4">
          Your CV is ready
        </h2>
        <p className="text-gray-500 mb-12">
          Review your generated CV below. Pay to unlock PDF download and text copy.
        </p>

        {/* CV Preview */}
        <div className="border border-gray-200 shadow-sm mb-12">
          <CVDocument data={cvData} showWatermark={true} />
        </div>

        {/* Features */}
        <div className="mb-12">
          <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">What you get</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-gray-300 mr-4">—</span>
              <span className="text-gray-700">Clean, ATS-optimized PDF download</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-300 mr-4">—</span>
              <span className="text-gray-700">Copyable plain text for online applications</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-300 mr-4">—</span>
              <span className="text-gray-700">No tables, icons, or graphics that break ATS</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-300 mr-4">—</span>
              <span className="text-gray-700">Professional structure for Big4 & corporate roles</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
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
            'Pay €3.99 and Download CV'
          )}
        </Button>
      </div>
    </section>
  );
}