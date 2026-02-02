import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { useCVImport } from '@/hooks/useCVImport';
import LandingSection from '@/components/cv/LandingSection';
import SocialProofSection from '@/components/home/SocialProofSection';
import CorporateDesignSection from '@/components/home/CorporateDesignSection';
import WhyItWorksSection from '@/components/home/WhyItWorksSection';
import CVIncludesSection from '@/components/home/CVIncludesSection';
import SuitableForSection from '@/components/home/SuitableForSection';
import FooterCTASection from '@/components/home/FooterCTASection';
import FAQSection from '@/components/home/FAQSection';

export default function Home() {
  const navigate = useNavigate();
  const { handleImportCV, importError, isImporting } = useCVImport();

  const handleStart = () => {
    navigate(createPageUrl('CVBuilder'));
  };

  const handleImport = async (file) => {
    const result = await handleImportCV(file, (importData) => {
      // On success, store data and navigate to CVBuilder
      sessionStorage.setItem('cv_import_data', JSON.stringify(importData));
      navigate(`${createPageUrl('CVBuilder')}?step=form&import=success`);
    });

    if (!result.success) {
      // On error, still navigate but without import data
      navigate(`${createPageUrl('CVBuilder')}?step=form`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <LandingSection 
        onStart={handleStart} 
        onImport={handleImport}
      />
      <SocialProofSection />
      <CorporateDesignSection onStart={handleStart} />
      <WhyItWorksSection />
      <CVIncludesSection />
      <SuitableForSection />
      <FAQSection />
      <FooterCTASection onStart={handleStart} />
    </div>
  );
}
