import React from 'react';
import { Button } from "@/components/ui/button";

export default function CorporateDesignSection({ onStart }) {
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
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-light text-black mb-8">
              Designed for professional roles
            </h2>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-gray-300 mr-4">—</span>
                <span className="text-gray-700">One clean, single-column format</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-300 mr-4">—</span>
                <span className="text-gray-700">Corporate-appropriate fonts & layout</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-300 mr-4">—</span>
                <span className="text-gray-700">No icons, tables or multi-column designs</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-300 mr-4">—</span>
                <span className="text-gray-700">Optimized for EU/UK hiring and ATS systems</span>
              </li>
            </ul>
            <Button 
              onClick={handleStart}
              disabled={isLoading}
              className="bg-black text-white hover:bg-gray-900 px-8 py-6 text-base font-normal rounded-none disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : 'Get your CV now'}
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-[8.5/11] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-lg p-8 blur-sm">
              <div className="space-y-4">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-px bg-gray-300 my-6"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 rounded w-4/5"></div>
                </div>
                <div className="h-px bg-gray-300 my-6"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm text-gray-500 bg-white px-4 py-2 rounded shadow">
                Single-column CV
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}