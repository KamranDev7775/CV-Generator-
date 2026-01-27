import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
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

  const handleStart = () => {
    // Navigate to CVBuilder template selection
    navigate(createPageUrl('CVBuilder'));
  };

  const handleImport = async (file) => {
    // Store file temporarily for CVBuilder to process
    // Convert file to base64 and store in sessionStorage
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result;
        const fileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64
        };
        sessionStorage.setItem('pending_cv_import', JSON.stringify(fileData));
        // Navigate to CVBuilder - it will process the import
        navigate(`${createPageUrl('CVBuilder')}?step=form&import=true`);
      };
      reader.onerror = () => {
        console.error('Error reading file');
        navigate(`${createPageUrl('CVBuilder')}?step=form`);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Import error:', error);
      navigate(`${createPageUrl('CVBuilder')}?step=form`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <LandingSection onStart={handleStart} onImport={handleImport} />
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
