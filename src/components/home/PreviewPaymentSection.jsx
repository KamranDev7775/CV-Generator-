import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye } from 'lucide-react';

export default function PreviewPaymentSection({ onStart }) {
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
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
          <div className="relative inline-block mb-8">
            <div className="w-48 h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-md blur-sm"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Eye className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-light text-black mb-4">
            Preview before payment
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            You can preview your full CV before you pay. No surprises.
          </p>
          <Button 
            onClick={handleStart}
            disabled={isLoading}
            className="bg-black text-white hover:bg-gray-900 px-8 py-6 text-base font-normal rounded-none disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Get your CV now'}
          </Button>
        </div>
      </div>
    </section>
  );
}