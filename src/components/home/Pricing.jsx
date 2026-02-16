import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const features = [
  "ATS-friendly CV builder",
  "Clean single-column corporate formatting",
  "Unlimited edits & regenerations",
  "PDF export",
  "Copyable plain text export",
  "Email support",
  "30-day money-back guarantee",
];

export default function Pricing() {
  const navigate = useNavigate();

  const handleGetCV = () => {
    navigate(createPageUrl("CVBuilder"));
  };

  return (
    <section className="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-[#FAF9F7] to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">

        {/* TOP LABEL */}
        <div className="flex justify-center items-center gap-3 mb-5">
          <div className="w-[2px] h-5 bg-gradient-to-b from-gray-400 to-purple-400"/>
          <span className="text-xs tracking-widest text-gray-500 uppercase font-semibold">
            Pricing
          </span>
        </div>

        <h2 className="text-gray-900 mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-5xl" style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, letterSpacing: '0px', textAlign: 'center', verticalAlign: 'middle' }}>
          Simple, transparent pricing
        </h2>

        <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto mb-12 sm:mb-16 leading-relaxed px-4">
          Choose the plan that works best for you, based on your goals,
          needs, and level of professional experience.
        </p>

        {/* PRICING CARD */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-6 sm:p-8 md:p-10 grid md:grid-cols-3 gap-6 sm:gap-8 text-left hover:shadow-2xl transition-shadow duration-300">

          {/* FEATURES COLUMN */}
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 flex-wrap">
              <h3 className="text-2xl sm:text-3xl" style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, letterSpacing: '0px', textAlign: 'center', verticalAlign: 'middle' }}>Compare plans</h3>
              <span className="text-xs bg-gradient-to-r from-orange-400 to-red-400 text-white px-3 py-1.5 rounded-full font-bold shadow-md">
                40% Off
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-10">
              Find the plan designed for your goals, needs, and career level.
            </p>

            <div className="space-y-4 sm:space-y-6 text-gray-700 text-sm sm:text-base" style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, letterSpacing: '0px', verticalAlign: 'middle' }}>
              {features.map((f, i) => (
                <div key={i}>{f}</div>
              ))}
            </div>
          </div>

          {/* POPULAR PLAN */}
          <div className="border-2 border-purple-500 rounded-2xl p-5 sm:p-7 relative text-center bg-gradient-to-b from-purple-50 to-white hover:scale-105 transition-transform duration-300 shadow-lg">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2
            bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-4 py-1.5 rounded-full font-bold shadow-lg">
              ⭐ Popular
            </span>

            <p className="text-gray-500 text-base sm:text-lg md:text-xl" style={{ fontFamily: 'Geist, sans-serif', fontWeight: 400, letterSpacing: '0px', textAlign: 'center' }}>One time purchase</p>

            <h3 className="mt-3 text-3xl sm:text-4xl" style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 500, letterSpacing: '0px', textAlign: 'center' }}>
              €1.99 <span className="text-xs sm:text-sm text-gray-500 font-normal">/one-time</span>
            </h3>

            <p className="text-gray-500 mt-2 mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, letterSpacing: '0%', textAlign: 'center', verticalAlign: 'middle' }}>
              5 days access & unlimited edits & downloads
            </p>

            <div className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
              {features.map((_, i) => (
                <div key={i} className="flex justify-center">
                  <Check className="text-purple-600 w-5 h-5"/>
                </div>
              ))}
            </div>

            <button 
              onClick={handleGetCV}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600
            text-white py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
              Get your CV for €1.99
            </button>
          </div>

          {/* SECOND PLAN */}
          <div className="text-center border-2 border-gray-200 rounded-2xl p-5 sm:p-7 hover:border-purple-300 hover:scale-105 transition-all duration-300">
            <p className="text-gray-500 text-base sm:text-lg md:text-xl" style={{ fontFamily: 'Geist, sans-serif', fontWeight: 400, letterSpacing: '0px', textAlign: 'center' }}>Billed quarterly</p>

            <h3 className="mt-3 text-3xl sm:text-4xl" style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 500, letterSpacing: '0px', textAlign: 'center' }}>
              €24.95 <span className="text-xs sm:text-sm text-gray-500 font-normal">/quarterly</span>
            </h3>

            <p className="text-gray-500 mt-2 mb-6 sm:mb-8 text-sm sm:text-base" style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, letterSpacing: '0%', textAlign: 'center', verticalAlign: 'middle' }}>
              Ongoing access with quarterly billing
            </p>

            <div className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
              {features.map((_, i) => (
                <div key={i} className="flex justify-center">
                  <Check className="text-purple-600 w-5 h-5"/>
                </div>
              ))}
            </div>

            <button 
              onClick={handleGetCV}
              className="border-2 border-purple-500 text-purple-600
            py-3 sm:py-3.5 px-4 sm:px-6 rounded-full hover:bg-purple-50 hover:scale-105 transition-all duration-300 w-full text-sm sm:text-base font-medium"
            >
              Subscribe for €24.95/quarter
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
