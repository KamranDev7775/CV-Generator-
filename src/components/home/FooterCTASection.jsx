import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function FooterCTASection({ onStart }) {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (onStart) {
        await onStart();
      } else {
        navigate(createPageUrl("CVBuilder"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 sm:px-6 md:px-12 py-12 sm:py-16 bg-gradient-to-b from-[#FAF9F7] to-white overflow-x-hidden">
      <div className="relative max-w-6xl mx-auto overflow-hidden p-6 sm:p-8 md:p-10 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-12 shadow-xl sm:shadow-2xl hover:shadow-3xl transition-shadow duration-500 rounded-[20px]" style={{ background: '#EEE9FF', border: '1px solid #8D74E180' }}>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-gradient-to-tr from-pink-400 to-purple-400 rounded-full blur-3xl opacity-20"></div>

        {/* LEFT CONTENT */}
        <div className="max-w-xl text-left relative z-10 w-full md:w-auto">
          <h2 className="text-gray-900 mb-3 sm:mb-4 md:mb-5 leading-tight" style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, fontSize: 'clamp(24px, 5vw, 44px)', lineHeight: 'clamp(28px, 5.5vw, 48px)', letterSpacing: '0px', verticalAlign: 'middle' }}>
            Start building your professional 👋 <br />
            resume
          </h2>

          <p className="text-gray-700 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 leading-relaxed">
            AI-powered CV improvements, rewriting & job matching platform
            designed to help you land your dream job
          </p>

          <Button
            onClick={handleClick}
            disabled={loading}
            style={{ background: 'linear-gradient(90deg, #2563EB 0%, #9333EA 100%)' }}
            className="text-white px-5 sm:px-7 md:px-9 py-4 sm:py-5 md:py-7 text-sm sm:text-base md:text-lg rounded-full shadow-lg sm:shadow-xl flex items-center gap-2 sm:gap-3 hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full sm:w-auto justify-center"
          >
            {loading ? "Loading..." : "Get your CV now"}
            <ArrowRight size={18} className="sm:w-5 sm:h-5" />
          </Button>
        </div>

        {/* RIGHT SIDE RESUME STACK */}
        <div className="relative hidden md:flex items-end justify-center w-full md:w-[320px] lg:w-[420px] h-[200px] sm:h-[240px] z-10 flex-shrink-0">
          
          <img
            src="/templates/cv1.png"
            alt="resume"
            className="absolute w-28 md:w-32 lg:w-40 rounded-lg shadow-2xl rotate-[-8deg] left-2 md:left-4 lg:left-6 bottom-0 hover:rotate-[-5deg] hover:scale-105 transition-all duration-300"
          />

          <img
            src="/templates/cv2.png"
            alt="resume"
            className="absolute w-32 md:w-36 lg:w-44 rounded-lg shadow-3xl z-10 bottom-0 hover:scale-110 transition-all duration-300"
          />

          <img
            src="/templates/cv3.png"
            alt="resume"
            className="absolute w-28 md:w-32 lg:w-40 rounded-lg shadow-2xl rotate-[8deg] right-2 md:right-4 lg:right-6 bottom-0 hover:rotate-[5deg] hover:scale-105 transition-all duration-300"
          />

          {/* Floating icons */}
          <div className="absolute top-0 right-10 text-2xl sm:text-3xl animate-float">✨</div>
          <div className="absolute top-8 right-0 text-xl sm:text-2xl animate-float" style={{ animationDelay: '0.5s' }}>⭐</div>
        </div>

      </div>
    </section>
  );
}
