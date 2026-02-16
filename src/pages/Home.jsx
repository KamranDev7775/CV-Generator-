import React from 'react';
import Navbar from '@/components/navigation/Navbar';
import Hero from '@/components/home/Hero';
import TrustedBy from '@/components/home/TrustedBy';
import Features from '@/components/home/Features';
import Templates from '@/components/home/Templates';
import Professional, { SuitableForSection } from '@/components/home/Professional';
import IncludedSection from '@/components/home/IncludedSection';
import Pricing from '@/components/home/Pricing';
import FooterCTASection from '@/components/home/FooterCTASection';
import FAQSection from '@/components/home/FAQSection';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F3F1FF 0%, #FFFFFF 83.1%)' }}>
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <Templates />
      <Professional />
      <SuitableForSection />
      <IncludedSection />
      <Pricing />
      <FAQSection />
      <FooterCTASection />
    </div>
  );
}
