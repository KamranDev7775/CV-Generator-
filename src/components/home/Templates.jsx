import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Templates() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Classic");
  const navigate = useNavigate();

  const templates = [
    "/templates/cv1.png",
    "/templates/cv2.png",
    "/templates/cv3.png",
    "/templates/cv4.png",
  ];

  const tabs = ["Classic", "Modern", "Minimal", "Executive", "Creative"];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(createPageUrl("CVBuilder"));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % templates.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const getVisibleTemplates = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) {
      visible.push(templates[(currentIndex + i) % templates.length]);
    }
    return visible;
  };

  const visibleTemplates = getVisibleTemplates();
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FAF9F7] flex flex-col items-center px-4 sm:px-6 pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-16">
      
      {/* Badge */}
      <span className="text-gray-500 mb-5" style={{ fontFamily: 'Geist, sans-serif', fontWeight: 400, fontSize: '16px', lineHeight: '20px', letterSpacing: '0px', verticalAlign: 'middle', textTransform: 'uppercase' }}>
        Templates
      </span>

      {/* Heading */}
      <h1 className="text-gray-900 text-center max-w-4xl px-4 text-3xl sm:text-4xl md:text-5xl" style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, letterSpacing: '0px', textAlign: 'center', verticalAlign: 'middle' }}>
        <span className="hidden md:inline">Explore professional resume templates</span>
        <span className="md:hidden">Explore professional <span className="inline-block">👋</span> templates</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-4 sm:mt-5 text-gray-600 text-center max-w-2xl px-4 text-sm sm:text-base" style={{ fontFamily: 'Geist, sans-serif', fontWeight: 400, letterSpacing: '2%', textAlign: 'center', verticalAlign: 'middle' }}>
        Browse a variety of expertly designed resume templates tailored for
        different industries and career levels
      </p>

      {/* Tabs */}
      <div className="mt-8 sm:mt-10 flex flex-wrap gap-1 shadow-inner max-w-full overflow-x-auto mx-auto" style={{ maxWidth: '608px', minHeight: '48px', borderRadius: '8px', opacity: 1, padding: '4px', background: '#F2F2F2' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
              activeTab === tab
                ? "text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg px-4 sm:px-6 py-2 sm:py-2.5"
            }`}
            style={activeTab === tab ? {
              minWidth: '100px',
              height: '40px',
              borderRadius: '8px',
              opacity: 1,
              gap: '8px',
              paddingTop: '12px',
              paddingRight: '16px',
              paddingBottom: '12px',
              paddingLeft: '16px',
              background: 'linear-gradient(90deg, #2563EB 0%, #9333EA 100%)',
              fontFamily: 'Helvetica Neue, sans-serif',
              fontWeight: 500,
              fontSize: '12px',
              lineHeight: '16px',
              letterSpacing: '0%'
            } : {
              fontFamily: 'Helvetica Neue, sans-serif',
              fontWeight: 500,
              fontSize: '12px',
              lineHeight: '16px',
              letterSpacing: '0%',
              paddingTop: '12px',
              paddingRight: '16px',
              paddingBottom: '12px',
              paddingLeft: '16px'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="mt-16 pt-4 sm:mt-20 md:mt-24 flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 md:gap-10 relative overflow-x-auto pb-4">
        
        {/* Card Left */}
        <div className="hidden sm:block w-[180px] md:w-[220px] h-[240px] md:h-[300px] bg-white rounded-2xl shadow-lg overflow-hidden relative transition-all duration-500 hover:scale-105 hover:shadow-2xl flex-shrink-0">
          <img 
            src={visibleTemplates[0]} 
            alt="CV Template" 
            className="w-full h-full object-cover transition-opacity duration-500"
            style={{ maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)" }}
          />
        </div>

        {/* Main Card */}
        <div className="w-[240px] sm:w-[260px] md:w-[280px] h-[320px] sm:h-[350px] md:h-[380px] bg-white rounded-2xl shadow-2xl overflow-hidden relative transition-all duration-500 hover:scale-105 hover:shadow-3xl ring-2 ring-purple-200 flex-shrink-0">
          <img 
            src={visibleTemplates[1]} 
            alt="CV Template" 
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
            Featured
          </div>
        </div>

        {/* Card Right */}
        <div className="hidden sm:block w-[180px] md:w-[220px] h-[240px] md:h-[300px] bg-white rounded-2xl shadow-lg overflow-hidden relative transition-all duration-500 hover:scale-105 hover:shadow-2xl flex-shrink-0">
          <img 
            src={visibleTemplates[2]} 
            alt="CV Template" 
            className="w-full h-full object-cover transition-opacity duration-500"
            style={{ maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)" }}
          />
        </div>

        {/* Extra Card - Hidden below 1024px */}
        <div className="hidden lg:block w-[220px] h-[300px] bg-white rounded-2xl shadow-lg overflow-hidden relative transition-all duration-500 hover:scale-105 hover:shadow-2xl flex-shrink-0">
          <img 
            src={visibleTemplates[3]} 
            alt="CV Template" 
            className="w-full h-full object-cover transition-opacity duration-500"
            style={{ maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)" }}
          />
        </div>
      </div>
    </div>
  );
}
