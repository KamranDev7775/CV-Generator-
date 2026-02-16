import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#1a002b] to-[#0c0018] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/70">
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 md:gap-6">
            <Link to={createPageUrl('Home')} className="hover:text-white transition">
              Home
            </Link>
            <Link to={createPageUrl('Dashboard')} className="hover:text-white transition">
              Dashboard
            </Link>
            <Link to={createPageUrl('CVBuilder')} className="hover:text-white transition">
              Templates
            </Link>
            <Link to={createPageUrl('Pricing')} className="hover:text-white transition">
              Pricing
            </Link>
          </div>
          
          <div className="text-xs text-white/30">
            © {new Date().getFullYear()} ATS CV Generator. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
