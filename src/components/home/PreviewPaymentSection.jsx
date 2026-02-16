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
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-12 text-center">
          <div className="relative inline-block mb-6 sm:mb-8">
            <div className="w-32 h-44 sm:w-40 sm:h-56 md:w-48 md:h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-md blur-sm"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Eye className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-black mb-3 sm:mb-4 px-4">
            Preview before payment
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            You can preview your full CV before you pay. No surprises.
          </p>
          <Button 
            onClick={handleStart}
            disabled={isLoading}
            style={{ background: 'linear-gradient(90deg, #2563EB 0%, #9333EA 100%)' }}
            className="text-white px-6 sm:px-8 py-4 sm:py-5 md:py-6 text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-90 w-full sm:w-auto"
          >
            {isLoading ? 'Loading...' : 'Get your CV now'}
          </Button>
        </div>
      </div>
    </section>
  );
}