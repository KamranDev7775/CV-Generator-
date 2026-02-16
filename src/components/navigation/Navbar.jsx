import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { FaArrowRight } from 'react-icons/fa';

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 w-full px-4 sm:px-6 pt-4 sm:pt-6 bg-gradient-to-b from-[#F3F1FF] to-transparent pb-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/90 backdrop-blur-md rounded-full px-4 sm:px-6 py-3 sm:py-3.5 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <span className="cursor-pointer hover:opacity-90 transition-opacity duration-300 px-2 sm:px-4 py-2 rounded-lg text-lg sm:text-xl md:text-2xl font-bold" style={{ fontFamily: 'Helvetica Neue, sans-serif', letterSpacing: '0px', textAlign: 'center', color: '#9333EA' }} onClick={() => navigate(createPageUrl('Home'))}>CV Generator</span>

        <div className="hidden lg:flex gap-6 lg:gap-8 text-gray-600 text-sm lg:text-base" style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, letterSpacing: '0%' }}>
          <a className="cursor-pointer hover:text-purple-600 transition-colors duration-300" onClick={() => navigate(createPageUrl('Home'))}>Home</a>
          <a className="cursor-pointer hover:text-purple-600 transition-colors duration-300" onClick={() => navigate(createPageUrl('Dashboard'))}>Dashboard</a>
          <a className="cursor-pointer hover:text-purple-600 transition-colors duration-300" onClick={() => navigate(createPageUrl('CVBuilder'))}>Templates</a>
          <a className="cursor-pointer hover:text-purple-600 transition-colors duration-300" onClick={() => navigate(createPageUrl('Pricing'))}>Pricing</a>
          <a className="cursor-pointer hover:text-purple-600 transition-colors duration-300">FAQ</a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button className="hidden sm:block hover:opacity-80 transition-opacity duration-300 text-xs sm:text-sm" style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, letterSpacing: '0%', color: '#222222', textDecoration: 'underline', textDecorationStyle: 'solid' }}>Sign in</button>
          <button onClick={() => navigate(createPageUrl('CVBuilder'))} className="hidden lg:flex bg-gradient-to-r from-[#2563EB] to-[#9333EA] px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-xs sm:text-sm md:text-base font-medium items-center gap-2" style={{ fontFamily: 'Helvetica Neue, sans-serif', letterSpacing: '0%', color: '#FFFFFF' }}>
            Try for free <FaArrowRight />
          </button>
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden ml-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 w-full bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block h-0.5 w-full bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-full bg-gray-600 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      <div className={`lg:hidden max-w-7xl mx-auto mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col p-4 space-y-3">
          <a className="cursor-pointer text-gray-600 hover:text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-50 transition-all duration-300" onClick={() => { navigate(createPageUrl('Home')); setIsMenuOpen(false); }}>Home</a>
          <a className="cursor-pointer text-gray-600 hover:text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-50 transition-all duration-300" onClick={() => { navigate(createPageUrl('Dashboard')); setIsMenuOpen(false); }}>Dashboard</a>
          <a className="cursor-pointer text-gray-600 hover:text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-50 transition-all duration-300" onClick={() => { navigate(createPageUrl('CVBuilder')); setIsMenuOpen(false); }}>Templates</a>
          <a className="cursor-pointer text-gray-600 hover:text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-50 transition-all duration-300" onClick={() => { navigate(createPageUrl('Pricing')); setIsMenuOpen(false); }}>Pricing</a>
          <a className="cursor-pointer text-gray-600 hover:text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-50 transition-all duration-300" onClick={() => setIsMenuOpen(false)}>FAQ</a>
          <button className="text-gray-600 hover:text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-50 transition-all duration-300 text-left font-semibold">Sign in</button>
        </div>
      </div>
    </div>
  );
}
