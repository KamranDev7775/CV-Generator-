import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';

export default function FooterCTASection({ onStart }) {
  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4">
          Get your ATS-friendly CV in minutes
        </h2>
        <p className="text-lg text-gray-400 mb-12">
          Transparent pricing. No hidden subscriptions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={onStart}
            className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-base font-normal rounded-none"
          >
            Start now
          </Button>
          <Link to={createPageUrl('Pricing')}>
            <Button 
              variant="outline"
              className="w-full border-white text-white hover:bg-white hover:text-black px-8 py-6 text-base font-normal rounded-none"
            >
              See pricing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}