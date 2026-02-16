import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useCVImport } from "@/hooks/useCVImport";
import { FiUpload } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";
import { MdStars } from "react-icons/md";

export default function Hero() {
  const navigate = useNavigate();
  const { handleImportCV, isImporting } = useCVImport();

  const handleStart = () => {
    navigate(createPageUrl("CVBuilder"));
  };

  const handleImport = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.docx";
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        await handleImportCV(file, (importData) => {
          sessionStorage.setItem("cv_import_data", JSON.stringify(importData));
          navigate(`${createPageUrl("CVBuilder")}?step=form&import=success`);
        });
      }
    };
    input.click();
  };

  return (
    <section className="mt-6 sm:mt-10 mx-4 sm:mx-6 py-12 sm:py-20 text-center relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #F3F1FF 0%, #FFFFFF 83.1%)' }}>
      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <span className="inline-flex items-center gap-2 bg-white text-black px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm mb-6 sm:mb-8 font-medium shadow-sm hover:shadow-md transition-shadow">
          <MdStars className="text-lg text-blue-600" /> 1200+ trusted customers
        </span>
      </div>

      <h1 className="font-bold text-black leading-tight mb-4 sm:mb-6 px-4 animate-fade-in-up text-3xl sm:text-5xl md:text-6xl lg:text-7xl" style={{ animationDelay: '0.2s', fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, letterSpacing: '0%', textAlign: 'center' }}>
        Land your dream job with an <br className="hidden sm:block" />
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ATS-optimized CV
        </span>
      </h1>

      <p className="max-w-2xl mx-auto mt-4 sm:mt-6 px-4 animate-fade-in-up text-sm sm:text-base" style={{ animationDelay: '0.3s', fontFamily: 'Geist, sans-serif', fontWeight: 400, letterSpacing: '0%', textAlign: 'center', color: '#6B7280' }}>
        Create a professional, ATS-friendly resume in minutes—no design skills required. Build a polished, job-ready CV that meets hiring standards and impresses recruiters.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 px-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <button
          onClick={handleStart}
          className="bg-gradient-to-r from-[#2563EB] to-[#9333EA] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 text-sm sm:text-base font-medium"
        >
          <span className="flex items-center gap-2">
            Get your CV now <FaArrowRight />
          </span>
        </button>
        <button
          onClick={handleImport}
          disabled={isImporting}
          className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium"
          style={{
            background: '#ffff',
            color: '#9333EA',
            border: '1px solid transparent',
            backgroundImage: 'linear-gradient(white, white), linear-gradient(90deg, #2849D7 0%, #7824CF 100%)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box'
          }}
        >
          {isImporting ? "Importing..." : (
            <span className="flex items-center gap-2">
              Upload CV <FiUpload />
            </span>
          )}
        </button>
      </div>

     <div className="relative mt-12 sm:mt-20 flex justify-center items-end h-[360px] sm:h-[450px] md:h-[540px] overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
  
  {/* Center CV */}
  <img
    src="/templates/cv2.png"
    className="w-[240px] sm:w-[300px] md:w-[379px] h-auto rounded-[12px] sm:rounded-[19.94px] z-20 object-contain transition-transform duration-500 hover:scale-105"
  />

  {/* Left CV - Desktop only */}
  <img
    src="/templates/cv1.png"
    className="hidden lg:block w-[340px] h-[426px] rounded-[19.94px] shadow-xl absolute left-[calc(50%-430px)] bottom-0 rotate-[-7.86deg] z-10 object-cover transition-transform duration-500 hover:scale-105 hover:rotate-[-5deg]"
  />

  {/* Right CV - Desktop only */}
  <img
    src="/templates/cv3.png"
    className="hidden lg:block w-[340px] h-[426px] rounded-[19.94px] shadow-xl absolute right-[calc(50%-430px)] bottom-0 rotate-[7.86deg] z-10 object-cover transition-transform duration-500 hover:scale-105 hover:rotate-[5deg]"
  />

  {/* Bottom Fade - Enhanced */}
  <div className="pointer-events-none absolute bottom-0 left-0 w-full h-48 sm:h-56
    bg-gradient-to-t from-white via-white/95 via-white/70 to-transparent z-30"/>
</div>
    </section>
  );
}
