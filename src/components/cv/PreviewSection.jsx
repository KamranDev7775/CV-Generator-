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

        {/* Unlock info */}
        <div className="mb-12 p-6 border border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-700 mb-4">
            <strong>Preview state:</strong> Full CV is visible above with watermark overlay. 
            PDF export and copy features are disabled until you subscribe.
          </p>
          <p className="text-sm text-gray-600">
            Subscribe to unlock PDF download and copyable text output.
          </p>
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
            'Unlock PDF for €2.99'
          )}
        </Button>
        <p className="text-xs text-gray-500 text-center mt-4">
          Or subscribe for unlimited access at €6.99/month
        </p>
      </div>
    </section>
  );
}