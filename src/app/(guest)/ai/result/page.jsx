"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowUp, ArrowDown, Focus, Sparkles } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";

function InteractiveCard({ children, className = "", delay = "0ms" }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const maxRotate = 4;
    const rotateX = ((y - centerY) / centerY) * -maxRotate;
    const rotateY = ((x - centerX) / centerX) * maxRotate;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-all duration-500 ease-out ${className}`}
      style={{
        transform,
        transformStyle: "preserve-3d",
        transitionDelay: delay
      }}
    >
      <div style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </div>
  );
}

const recommendationStats = [
  { label: "GENDER", value: "Male" },
  { label: "FACE SHAPE", value: "Oval" },
  { label: "HAIR TYPE", value: "Straight" },
  { label: "STRUCTURE", value: "Thick & Straight" },
  { label: "FOREHEAD", value: "Proportional" },
];

function ResultPortrait() {
  return (
    <div className="relative h-full min-h-[600px] lg:min-h-full w-full overflow-hidden bg-[linear-gradient(180deg,#1c1a1a_0%,#40312c_35%,#8b6f59_72%,#d2bfa7_100%)] shadow-2xl group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.18),transparent_24%),radial-gradient(circle_at_50%_55%,rgba(0,0,0,0.18),transparent_42%)]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(0,0,0,0.56),transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,rgba(46,17,17,0.8),transparent)]" />

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C59B8F] to-transparent shadow-[0_0_15px_rgba(197,155,143,0.8)] animate-scan-line z-20" />

      <div className="absolute inset-0 flex items-end justify-center p-5">
        <div className="h-[105%] w-[95%] rounded-[1.75rem] border border-white/5 bg-[radial-gradient(circle_at_50%_38%,#f4d8bf_0%,#d6a47d_18%,#7f5a42_30%,#3b2a23_46%,#1b1718_62%,#111010_100%)] opacity-90 shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-all duration-700 group-hover:scale-[1.03]" />
      </div>

      <div
        className="absolute bottom-6 left-6 bg-black/60 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-[#f3e8de] backdrop-blur-md border border-white/10 z-30"
      >
        Original Reference
      </div>

      <div className="absolute top-10 left-10 w-12 h-12 border-t-2 border-l-2 border-white/20 z-10" />
      <div className="absolute top-10 right-10 w-12 h-12 border-t-2 border-r-2 border-white/20 z-10" />
      <div className="absolute bottom-10 left-10 w-12 h-12 border-b-2 border-l-2 border-white/20 z-10" />
      <div className="absolute bottom-10 right-10 w-12 h-12 border-b-2 border-r-2 border-white/20 z-10" />
    </div>
  );
}

// Donut Chart Reusable Component
const CircularProgress = ({ percentage, color, label, subLabel, size = 80 }) => {
  const radius = size / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#3A1E1E" strokeWidth="4" />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            className="transition-all duration-[2s] ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-[#F3E8DE]">{percentage}%</span>
        </div>
      </div>
      {(label || subLabel) && (
        <div className="flex flex-col">
          {label && <span className="text-sm text-[#F3E8DE] font-medium">{label}</span>}
          {subLabel && <span className="text-[0.6rem] text-[#A68A82] mt-0.5">{subLabel}</span>}
        </div>
      )}
    </div>
  );
};

export default function AiResultPage() {
  const [mounted, setMounted] = useState(false);
  const targetScrollRef = useRef(null);

  useEffect(() => {
    // Animasi masuk
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);

    // AUTO SMOOTH SCROLL: Scroll otomatis ke bagian spesifik setelah render
    const scrollTimer = setTimeout(() => {
      if (targetScrollRef.current) {
        targetScrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 1200); // Delay 1.2 detik sebelum auto scroll agar user lihat header sebentar

    return () => {
      clearTimeout(timer);
      clearTimeout(scrollTimer);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#351C1C] text-[#2B1D19] overflow-x-clip">

      {/* Navbar Fixed */}
      <div className="fixed top-0 left-0 w-full z-50 bg-[#351C1C]">
        <SiteNavbar activeLabel="AI Feature" />
      </div>

      <div className="flex flex-col lg:flex-row w-full min-h-screen pt-[80px] relative">

        {/* Left: Original Portrait (Sticky) */}
        <div className="w-full lg:w-1/3 lg:sticky lg:top-[80px] lg:h-[calc(100vh-80px)] z-40 bg-[#1c1a1a]">
          <InteractiveCard className="h-full w-full">
            <ResultPortrait />
          </InteractiveCard>
        </div>

        {/* Right: Scrollable Content */}
        <div className="w-full lg:w-2/3 flex flex-col pb-20">

          {/* Header Section */}
          <section className="px-6 pt-16 pb-12 text-center bg-transparent">
            <div className={`transition-all duration-1000 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="flex justify-center mb-6">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 border border-[#E0D8D5] rounded-full animate-ping opacity-20"></div>
                  <Sparkles className="h-6 w-6 text-[#C59B8F]" />
                </div>
              </div>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[#F3E8DE] sm:text-4xl lg:text-5xl font-serif">
                AI Recommendation Results
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#D2C3BD] font-light">
                Our proprietary engine has synthesized your biometric data to curate hairstyles that optimize your natural proportions.
              </p>
            </div>
          </section>

          {/* Stats Bar */}
          <div className="w-full border-y border-[#3A1E1E] bg-[#2E1616]">
            <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-6 px-6 py-4 lg:px-10">
              {recommendationStats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-start">
                  <span className="text-[0.6rem] uppercase tracking-[0.25em] text-[#A68A82]">{stat.label}</span>
                  <span className="mt-1 text-sm font-medium text-[#F3E8DE]">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-12 lg:px-12 xl:px-16 flex flex-col space-y-12">

            <div ref={targetScrollRef} className="pt-4 flex flex-col space-y-6 scroll-mt-24">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Card 1: Textured Quiff */}
                <div className="bg-[#2B1615] rounded-sm border border-[#3A1E1E] flex flex-col justify-end relative h-[450px] overflow-hidden group hover:border-[#C59B8F] transition-all duration-500 hover:shadow-2xl">
                  {/* Dark Gradient Overlay for the non-image area */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#2B1615]/10 via-[#2B1615]/80 to-[#1F0D0D] z-0"></div>

                  <div className="relative z-10 p-8 flex flex-col h-full justify-end transition-transform duration-500 group-hover:-translate-y-2">
                    <div className="flex justify-between items-end border-b border-[#3A1E1E] pb-4 mb-4">
                      <div>
                        <p className="text-[0.55rem] uppercase tracking-widest text-[#C59B8F] mb-1">TOP RECOMMENDATION</p>
                        <h3 className="text-3xl text-[#F3E8DE] font-serif font-medium">Textured Quiff</h3>
                      </div>
                      <div className="bg-[#592D2D] rounded-sm flex flex-col items-center justify-center px-4 py-2 shadow-lg">
                        <span className="text-xl font-bold text-[#F3E8DE]">95%</span>
                        <span className="text-[0.45rem] uppercase tracking-widest text-[#D2C3BD]">MATCH</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[0.6rem] uppercase tracking-widest text-[#A68A82]">KEY BENEFITS</p>
                      <ul className="space-y-2.5">
                        {["Perfect for your face shape", "Balances your facial proportions", "Enhances your natural features", "Low maintenance, high impact"].map((item, i) => (
                          <li key={i} className="flex items-center text-[0.8rem] text-[#D2C3BD]">
                            <Check className="h-3 w-3 text-[#8A9A5B] mr-3 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Card 2: Mid Taper Fade */}
                <div className="bg-[#2B1615] rounded-sm border border-[#3A1E1E] flex flex-col justify-end relative h-[450px] overflow-hidden group hover:border-[#C59B8F] transition-all duration-500 hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#2B1615]/10 via-[#2B1615]/80 to-[#1F0D0D] z-0"></div>

                  <div className="relative z-10 p-8 flex flex-col h-full justify-end transition-transform duration-500 group-hover:-translate-y-2">
                    <div className="flex justify-between items-end border-b border-[#3A1E1E] pb-4 mb-4">
                      <div>
                        <p className="text-[0.55rem] uppercase tracking-widest text-[#C59B8F] mb-1">ALTERNATIVE</p>
                        <h3 className="text-3xl text-[#F3E8DE] font-serif font-medium">Mid Taper Fade</h3>
                      </div>
                      <div className="bg-[#592D2D] rounded-sm flex flex-col items-center justify-center px-4 py-2 shadow-lg">
                        <span className="text-xl font-bold text-[#F3E8DE]">90%</span>
                        <span className="text-[0.45rem] uppercase tracking-widest text-[#D2C3BD]">MATCH</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[0.6rem] uppercase tracking-widest text-[#A68A82]">KEY BENEFITS</p>
                      <ul className="space-y-2.5">
                        {["Versatile for casual and formal", "Sharp side definition", "Easy styling with pomade", "Growth pattern compatibility"].map((item, i) => (
                          <li key={i} className="flex items-center text-[0.8rem] text-[#D2C3BD]">
                            <Check className="h-3 w-3 text-[#8A9A5B] mr-3 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex flex-col items-center pt-4 pb-8 space-y-4">
                <button className="bg-[#D9D0C6] px-8 py-3 text-xs font-bold tracking-widest text-[#2B1D19] transition-all hover:scale-105 rounded-sm">
                  TRY NEXT STYLE (100 CREDITS LEFT)
                </button>
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-[#A68A82]">Premium Feature: Virtual Try-On Available</p>
              </div>
            </div>

            {/* IDENTICAL DASHBOARD SECTION */}
            <div className="bg-[#211111] border border-[#3A1E1E] rounded-md p-6 lg:p-8 flex flex-col space-y-8 shadow-2xl">

              {/* 1. FACIAL ANALYSIS OVERVIEW */}
              <div>
                <h2 className="text-[0.7rem] uppercase tracking-widest text-[#A68A82] mb-6 font-bold flex items-center">
                  FACIAL ANALYSIS <span className="text-[#C59B8F] ml-1">OVERVIEW</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                  {/* Face Shape */}
                  <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm p-5">
                    <p className="text-xs text-[#A68A82] mb-1">Face Shape</p>
                    <h3 className="text-xl text-[#F3E8DE] font-semibold mb-4">Oval</h3>
                    <div className="flex items-center gap-4">
                      {/* Dotted Oval SVG */}
                      <svg width="40" height="50" viewBox="0 0 40 50">
                        <ellipse cx="20" cy="25" rx="16" ry="22" fill="none" stroke="#C59B8F" strokeWidth="1.5" strokeDasharray="3 3" />
                      </svg>
                      <p className="text-[0.65rem] text-[#D2C3BD] leading-tight flex-1">
                        Oval face shape is considered balanced and versatile.
                      </p>
                    </div>
                    <button className="mt-4 px-4 py-1.5 border border-[#4A2626] text-[#A68A82] text-[0.6rem] rounded-sm hover:bg-[#3A1E1E] transition-colors">
                      Learn More
                    </button>
                  </div>

                  {/* Scores */}
                  <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm p-5 flex flex-col justify-center space-y-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="w-1/2">
                        <p className="text-xs text-[#A68A82] mb-1">Symmetry Score</p>
                        <h3 className="text-3xl text-[#F3E8DE] font-light">92%</h3>
                        <p className="text-xs text-[#F3E8DE] mb-2">Excellent</p>
                        <p className="text-[0.65rem] text-[#D2C3BD] leading-tight mb-3">Your face symmetry is well balanced.</p>
                        <div className="h-1 w-full bg-[#3A1E1E] rounded-full overflow-hidden">
                          <div className="h-full bg-[#8A9A5B] w-[92%]"></div>
                        </div>
                      </div>
                      <div className="w-1/2">
                        <p className="text-xs text-[#A68A82] mb-1">AI Confidence</p>
                        <h3 className="text-3xl text-[#F3E8DE] font-light">95%</h3>
                        <p className="text-xs text-[#F3E8DE] mb-2">Very High</p>
                        <p className="text-[0.65rem] text-[#D2C3BD] leading-tight mb-3">High accuracy in facial feature detection.</p>
                        <div className="h-1 w-full bg-[#3A1E1E] rounded-full overflow-hidden">
                          <div className="h-full bg-[#6B8E6B] w-[95%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Heatmap Placeholder */}
                  <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm p-4 flex gap-4">
                    <div className="flex-1 flex flex-col">
                      <p className="text-xs text-[#A68A82] mb-3">Face Heatmap</p>
                      <div className="w-full h-32 bg-[#1C0D0D] border border-[#3A1E1E] relative overflow-hidden rounded-sm flex items-center justify-center">
                        <Focus className="h-8 w-8 text-[#C59B8F]/30" />
                        {/* Fake thermal gradient overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,50,0,0.3)_0%,rgba(200,200,0,0.2)_40%,transparent_80%)] mix-blend-screen"></div>
                      </div>
                    </div>
                    <div className="w-[100px] flex flex-col justify-center space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-[#FF4500] rounded-sm"></div>
                        <span className="text-[0.55rem] text-[#D2C3BD]">High Suitability</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-[#FFD700] rounded-sm"></div>
                        <span className="text-[0.55rem] text-[#D2C3BD]">Medium</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-[#00BFFF] rounded-sm"></div>
                        <span className="text-[0.55rem] text-[#D2C3BD]">Low</span>
                      </div>
                      <div className="flex items-start gap-2 pt-2 border-t border-[#3A1E1E]">
                        <Check className="w-3 h-3 text-[#A68A82]" />
                        <span className="text-[0.5rem] text-[#A68A82] leading-tight">Best Areas for Volume & Style</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* 2. DETAILED FACIAL ANALYSIS */}
              <div>
                <h2 className="text-[0.7rem] uppercase tracking-widest text-[#A68A82] mb-6 font-bold">
                  DETAILED FACIAL ANALYSIS
                </h2>
                <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#3A1E1E]">

                  {/* Radar Chart */}
                  <div className="p-6 flex flex-col relative h-[250px] justify-center items-center">
                    <p className="absolute top-6 left-6 text-xs text-[#A68A82]">Facial Proportion</p>
                    <svg viewBox="0 0 120 120" className="w-48 h-48 mt-4">
                      {/* Outer polygon */}
                      <polygon points="60,10 105,45 85,105 35,105 15,45" fill="none" stroke="#4A2626" strokeWidth="0.5" />
                      {/* Inner polygon */}
                      <polygon points="60,30 90,55 75,90 45,90 30,55" fill="none" stroke="#4A2626" strokeWidth="0.5" strokeDasharray="2,2" />
                      {/* Data polygon */}
                      <polygon points="60,18 100,48 80,100 40,95 20,48" fill="rgba(197,155,143,0.1)" stroke="#D15C5C" strokeWidth="1" />
                      <circle cx="60" cy="18" r="1.5" fill="#D15C5C" />
                      <circle cx="100" cy="48" r="1.5" fill="#D15C5C" />
                      <circle cx="80" cy="100" r="1.5" fill="#D15C5C" />
                      <circle cx="40" cy="95" r="1.5" fill="#D15C5C" />
                      <circle cx="20" cy="48" r="1.5" fill="#D15C5C" />
                    </svg>
                    {/* Labels */}
                    <span className="absolute top-10 text-[0.55rem] text-[#D2C3BD] text-center">Forehead<br />85%</span>
                    <span className="absolute right-12 top-[40%] text-[0.55rem] text-[#D2C3BD] text-center">Cheekbones<br />88%</span>
                    <span className="absolute right-20 bottom-12 text-[0.55rem] text-[#D2C3BD] text-center">Jawline<br />90%</span>
                    <span className="absolute left-20 bottom-12 text-[0.55rem] text-[#D2C3BD] text-center">Chin<br />84%</span>
                    <span className="absolute left-12 top-[40%] text-[0.55rem] text-[#D2C3BD] text-center">Face Width<br />82%</span>
                    {/* Legend */}
                    <div className="absolute bottom-4 flex items-center gap-6 text-[0.55rem] text-[#A68A82]">
                      <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-[#D15C5C]"></div> You</div>
                      <div className="flex items-center gap-2"><div className="w-3 h-0.5 border-t border-dashed border-[#A68A82]"></div> Ideal Proportion</div>
                    </div>
                  </div>

                  {/* Feature Measurements */}
                  <div className="p-6 flex flex-col justify-between">
                    <p className="text-xs text-[#A68A82] mb-4">Feature Measurements</p>
                    <div className="space-y-4 flex-1">
                      {[
                        { label: "Face Length", val: "86%" },
                        { label: "Face Width", val: "82%" },
                        { label: "Jawline Strength", val: "90%" },
                        { label: "Cheekbone Width", val: "88%" },
                        { label: "Forehead Width", val: "85%" },
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-[0.65rem] text-[#D2C3BD] mb-1">
                            <span>{item.label}</span>
                            <span>{item.val}</span>
                          </div>
                          <div className="h-[2px] w-full bg-[#3A1E1E]">
                            <div className="h-full bg-[#D15C5C]" style={{ width: item.val }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="mt-6 self-start px-4 py-1.5 border border-[#4A2626] text-[#A68A82] text-[0.6rem] rounded-sm hover:bg-[#3A1E1E]">
                      View Full Measurements
                    </button>
                  </div>

                  {/* Facial Balance */}
                  <div className="p-6 flex flex-col justify-between">
                    <p className="text-xs text-[#A68A82] mb-4">Facial Balance</p>
                    <div className="space-y-4 flex-1">
                      {[
                        { label: "Left Eye vs Right Eye", val: "Excellent" },
                        { label: "Left Brow vs Right Brow", val: "Excellent" },
                        { label: "Nose Centering", val: "Excellent" },
                        { label: "Mouth Alignment", val: "Good" },
                        { label: "Chin Balance", val: "Excellent" },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-[0.7rem]">
                          <span className="text-[#A68A82]">{item.label}</span>
                          <span className={`text-${item.val === 'Good' ? '[#C59B8F]' : '[#F3E8DE]'}`}>{item.val}</span>
                        </div>
                      ))}
                    </div>
                    <button className="mt-6 self-start px-4 py-1.5 border border-[#4A2626] text-[#A68A82] text-[0.6rem] rounded-sm hover:bg-[#3A1E1E]">
                      View Details
                    </button>
                  </div>

                </div>
              </div>

              {/* 3. HAIR ANALYSIS & SCALP HEALTH */}
              <div>
                <h2 className="text-[0.7rem] uppercase tracking-widest text-[#A68A82] mb-6 font-bold">
                  HAIR ANALYSIS & SCALP HEALTH
                </h2>
                <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#3A1E1E] p-6">

                    {/* Hair Thickness */}
                    <div className="flex flex-col gap-3 justify-center">
                      <p className="text-xs text-[#A68A82]">Hair Thickness</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="relative w-12 h-12 flex items-center justify-center">
                          <svg viewBox="0 0 40 40" className="w-full h-full opacity-60">
                            <path d="M20,35 C15,35 15,10 30,5" fill="none" stroke="#F3E8DE" strokeWidth="2" />
                            <circle cx="20" cy="35" r="4" fill="#3A1E1E" stroke="#F3E8DE" strokeWidth="1.5" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-lg text-[#F3E8DE] font-semibold">Thick</p>
                          <p className="text-[0.65rem] text-[#D2C3BD]">0.08 - 0.10 mm</p>
                          <div className="mt-1 bg-[#1C0D0D] px-2 py-0.5 inline-block text-[0.55rem] text-[#A68A82] rounded-sm border border-[#3A1E1E]">Ideal for most hairstyles</div>
                        </div>
                      </div>
                    </div>

                    {/* Density */}
                    <div className="flex flex-col pl-6">
                      <p className="text-xs text-[#A68A82] mb-2">Hair Density</p>
                      <CircularProgress percentage={85} color="#8A9A5B" label="High Density" subLabel="Your hair density is above average." />
                    </div>

                    {/* Scalp */}
                    <div className="flex flex-col pl-6">
                      <p className="text-xs text-[#A68A82] mb-2">Scalp Health</p>
                      <CircularProgress percentage={92} color="#3CB371" label="Excellent" subLabel="Your scalp condition is very healthy." />
                    </div>
                  </div>

                  {/* Growth Potential Bar */}
                  <div className="border-t border-[#3A1E1E] p-4 px-6 flex items-center bg-[#251313]">
                    <div className="flex items-center gap-3 w-1/3">
                      <div className="w-4 h-6 rounded-full border border-[#8A9A5B] bg-[#8A9A5B]/20"></div>
                      <div>
                        <p className="text-[0.65rem] text-[#A68A82]">Hair Growth Potential</p>
                        <p className="text-sm text-[#F3E8DE] font-semibold">High</p>
                      </div>
                    </div>
                    <div className="w-2/3 flex flex-col justify-center pl-4 border-l border-[#3A1E1E]">
                      <p className="text-[0.65rem] text-[#D2C3BD] mb-2 flex justify-between">
                        <span>You have great potential for various hairstyles.</span>
                        <span>87%</span>
                      </p>
                      <div className="h-[3px] w-full bg-[#3A1E1E] rounded-full overflow-hidden">
                        <div className="h-full bg-[#8A9A5B] w-[87%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. TREND ANALYTICS */}
              <div>
                <h2 className="text-[0.7rem] uppercase tracking-widest text-[#A68A82] mb-6 font-bold">
                  TREND ANALYTICS
                </h2>
                <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#3A1E1E] p-6">

                  {/* Popularity Chart */}
                  <div className="pr-6">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-xs text-[#A68A82]">Popularity Over Time</p>
                      <span className="text-[0.55rem] text-[#D2C3BD] bg-[#1C0D0D] px-2 py-1 rounded-sm border border-[#3A1E1E]">6 Months v</span>
                    </div>
                    <div className="h-24 w-full relative">
                      {/* Fake Line Chart */}
                      <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible">
                        <path d="M0,40 Q25,50 50,35 T100,25 T150,30 T200,10" fill="none" stroke="#D1A95C" strokeWidth="1.5" />
                        <path d="M0,40 Q25,50 50,35 T100,25 T150,30 T200,10 L200,60 L0,60 Z" fill="url(#grad)" opacity="0.3" />
                        <defs>
                          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#D1A95C" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#2A1616" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {[0, 50, 100, 150, 200].map(x => <circle key={x} cx={x} cy={x === 0 ? 40 : x === 50 ? 35 : x === 100 ? 25 : x === 150 ? 30 : 10} r="1.5" fill="#D1A95C" />)}
                      </svg>
                      <div className="absolute bottom-[-15px] w-full flex justify-between text-[0.45rem] text-[#A68A82]">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                      </div>
                    </div>
                  </div>

                  {/* Trending Styles List */}
                  <div className="px-6">
                    <p className="text-xs text-[#A68A82] mb-4">Trending Styles for You</p>
                    <ul className="space-y-3">
                      {[
                        { no: 1, name: "Textured Quiff", trend: "+ 24%", up: true },
                        { no: 2, name: "Mid Taper Fade", trend: "+ 18%", up: true },
                        { no: 3, name: "Classic Side Part", trend: "+ 15%", up: true },
                        { no: 4, name: "French Crop", trend: "- 5%", up: false },
                      ].map((item) => (
                        <li key={item.no} className="flex justify-between items-center text-[0.65rem]">
                          <div className="flex items-center gap-3">
                            <span className="text-[#A68A82]">{item.no}</span>
                            <span className="text-[#F3E8DE]">{item.name}</span>
                          </div>
                          <div className={`flex items-center gap-1 ${item.up ? 'text-[#8A9A5B]' : 'text-[#D15C5C]'}`}>
                            {item.up ? <ArrowUp className="w-2 h-2" /> : <ArrowDown className="w-2 h-2" />}
                            <span>{item.trend}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Compatibility */}
                  <div className="pl-6">
                    <p className="text-xs text-[#A68A82] mb-2">Your Style Compatibility</p>
                    <div className="mt-4">
                      <CircularProgress percentage={89} color="#D15C5C" size={70} label="High Compatibility" subLabel="You match well with current trends." />
                    </div>
                  </div>

                </div>
              </div>

              <div className="pt-4 text-center pb-2">
                <p className="text-[0.55rem] text-[#A68A82] tracking-widest uppercase opacity-60">© {new Date().getFullYear()} Hair AI Stylist. All rights reserved.</p>
              </div>

            </div>
          </div>
        </div>
      </div>

      <SiteFooter />

      <style jsx global>{`
        @keyframes scan-line {
          0% { top: 0%; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-line {
          animation: scan-line 4s linear infinite;
        }
      `}</style>
    </main>
  );
}