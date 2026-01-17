import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Lock } from "lucide-react";
import CVDocument from './CVDocument';

export default function CVPreview({ cvData, onPayment, onEdit, isProcessingPayment }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <button 
            onClick={onEdit}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Edit CV
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Preview your CV</h1>
          <p className="text-sm text-gray-600 mt-1">
            Final version available immediately after payment
          </p>
        </div>
      </div>

      {/* Preview */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <CVDocument data={cvData} showWatermark={true} />
        </div>

        {/* Payment CTA */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Get your final CV
            </h2>
            <p className="text-gray-600 mb-8">
              Download your professional CV in PDF format and copyable text. Ready to use for job applications.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                <span>Clean, ATS-friendly PDF</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                <span>Copyable text format</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                <span>Instant download</span>
              </div>
            </div>
            <Button 
              onClick={onPayment}
              disabled={isProcessingPayment}
              className="w-full bg-black text-white hover:bg-gray-800 py-6 text-lg"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Get CV for €1.99'
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-4">
              One-time payment • Secure checkout via Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}