"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowUp, ArrowDown, Focus, Sparkles } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";
import { aiScanService } from "@/services/aiScanService";

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



function ResultPortrait({ url_foto_upload, ai_image_url }) {
  return (
    <div className="relative h-full min-h-[600px] lg:min-h-full w-full overflow-hidden bg-[linear-gradient(180deg,#1c1a1a_0%,#40312c_35%,#8b6f59_72%,#d2bfa7_100%)] shadow-2xl group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.18),transparent_24%),radial-gradient(circle_at_50%_55%,rgba(0,0,0,0.18),transparent_42%)]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(0,0,0,0.56),transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,rgba(46,17,17,0.8),transparent)]" />

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C59B8F] to-transparent shadow-[0_0_15px_rgba(197,155,143,0.8)] animate-scan-line z-20" />

      {(ai_image_url || url_foto_upload) ? (
        <img 
          src={(ai_image_url || url_foto_upload).startsWith("data:") || (ai_image_url || url_foto_upload).startsWith("http") ? (ai_image_url || url_foto_upload) : `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace("/api/v1", "")}${ai_image_url || url_foto_upload}`} 
          className="absolute inset-0 w-full h-full object-cover opacity-80 transition-opacity duration-500" 
          alt={ai_image_url ? "AI Generated Style" : "Original Reference"} 
        />
      ) : null}

      {ai_image_url && (
        <div className="absolute bottom-6 left-6 z-30">
          <div className="bg-black/60 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-[#f3e8de] backdrop-blur-md border border-white/10 w-fit">
            AI Enhanced
          </div>
        </div>
      )}

      <div className="absolute inset-0 flex items-end justify-center p-5 pointer-events-none">
        <div className="h-[105%] w-[95%] rounded-[1.75rem] border border-white/5 bg-[radial-gradient(circle_at_50%_38%,#f4d8bf_0%,#d6a47d_18%,#7f5a42_30%,#3b2a23_46%,#1b1718_62%,#111010_100%)] opacity-30 shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-all duration-700 group-hover:scale-[1.03]" />
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
  const [analysisData, setAnalysisData] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [historyItems, setHistoryItems] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const targetScrollRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("aiAnalysisResult");
    if (stored && stored !== "undefined") {
      try {
        const parsedData = JSON.parse(stored);
        if (parsedData) {
          setAnalysisData(parsedData);
          const savedImage = sessionStorage.getItem("aiOriginalImage");
          setOriginalImage(savedImage || parsedData.record?.url_foto_upload);

          const activeFeats = parsedData.active_features || parsedData.activeFeatures || [];
          if (activeFeats.includes("HISTORY")) {
            fetchHistory();
          }
        } else {
          router.push("/ai");
        }
      } catch (e) {
        console.error("Error parsing analysis result:", e);
        router.push("/ai");
      }
    } else {
      router.push("/ai");
    }

    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);

    const scrollTimer = setTimeout(() => {
      if (targetScrollRef.current) {
        targetScrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 1200);

    return () => {
      clearTimeout(timer);
      clearTimeout(scrollTimer);
    };
  }, [router]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await aiScanService.getHistory();
      if (res.data?.success) {
        setHistoryItems(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const clamp = (val) => {
    if (val == null) return 0;
    const num = Number(val);
    return isNaN(num) ? 0 : Math.min(99, Math.max(0, Math.round(num)));
  };

  if (!analysisData) return null;

  const data = analysisData.hasil_analisis || {};
  const activeFeatures = analysisData.active_features || analysisData.activeFeatures || [];
  const styles = data.rekomendasi_gaya || [];
  const topStyle = styles[0] || {};
  const altStyle = styles[1] || {};

  let aiImageUrl = null;
  if (analysisData.record?.url_hasil_img) {
    try {
      const parsedUrls = typeof analysisData.record.url_hasil_img === 'string'
        ? JSON.parse(analysisData.record.url_hasil_img)
        : analysisData.record.url_hasil_img;
      if (Array.isArray(parsedUrls) && parsedUrls.length > 0) aiImageUrl = parsedUrls[0];
    } catch (e) { /* ignore */ }
  }

  const dynamicStats = [
    { label: "GENDER", value: data.gender || "-" },
    { label: "FACE SHAPE", value: data.bentuk_wajah || "-" },
    { label: "HAIR TYPE", value: data.jenis_rambut || "-" },
    { label: "STRUCTURE", value: data.ketebalan_rambut || "-" },
    { label: "CONFIDENCE", value: `${clamp(data.ai_confidence)}%` },
  ];

  console.log("=== Image Debugging ===");
  console.log("Original Image:", typeof originalImage === "string" ? originalImage.substring(0, 50) + "..." : originalImage);
  console.log("AI Image URL:", aiImageUrl);
  console.log("Backend record url_foto_upload:", analysisData.record?.url_foto_upload);
  console.log("Backend record url_hasil_img:", analysisData.record?.url_hasil_img);
  console.log("=======================");

  return (
    <main className="min-h-screen bg-[#351C1C] text-[#2B1D19] overflow-x-clip">

      <div className="fixed top-0 left-0 w-full z-50 bg-[#351C1C]">
        <SiteNavbar activeLabel="AI Feature" />
      </div>

      <div className="flex flex-col lg:flex-row w-full min-h-screen pt-[80px] relative">

        <div className="w-full lg:w-1/3 lg:sticky lg:top-[80px] lg:h-[calc(100vh-80px)] z-40 bg-[#1c1a1a]">
          <InteractiveCard className="h-full w-full">
            <ResultPortrait url_foto_upload={originalImage} ai_image_url={aiImageUrl} />
          </InteractiveCard>
        </div>

        <div className="w-full lg:w-2/3 flex flex-col pb-20">

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

          <div className="w-full border-y border-[#3A1E1E] bg-[#2E1616]">
            <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-6 px-6 py-4 lg:px-10">
              {dynamicStats.map((stat, idx) => (
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

                {topStyle.nama_gaya && (
                  <div className="bg-[#2B1615] rounded-sm border border-[#3A1E1E] flex flex-col justify-end relative h-[450px] overflow-hidden group hover:border-[#C59B8F] transition-all duration-500 hover:shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#2B1615]/10 via-[#2B1615]/80 to-[#1F0D0D] z-0"></div>

                    <div className="relative z-10 p-8 flex flex-col h-full justify-end transition-transform duration-500 group-hover:-translate-y-2">
                      <div className="flex justify-between items-end border-b border-[#3A1E1E] pb-4 mb-4">
                        <div>
                          <p className="text-[0.55rem] uppercase tracking-widest text-[#C59B8F] mb-1">TOP RECOMMENDATION</p>
                          <h3 className="text-3xl text-[#F3E8DE] font-serif font-medium">{topStyle.nama_gaya}</h3>
                        </div>
                        <div className="bg-[#592D2D] rounded-sm flex flex-col items-center justify-center px-4 py-2 shadow-lg">
                          <span className="text-xl font-bold text-[#F3E8DE]">{topStyle.match_score}%</span>
                          <span className="text-[0.45rem] uppercase tracking-widest text-[#D2C3BD]">MATCH</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[0.6rem] uppercase tracking-widest text-[#A68A82]">WHY IT WORKS</p>
                        <p className="text-[0.8rem] text-[#D2C3BD] leading-relaxed">
                          {topStyle.alasan || "Perfect for your face shape and natural features."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {altStyle.nama_gaya && (
                  <div className="bg-[#2B1615] rounded-sm border border-[#3A1E1E] flex flex-col justify-end relative h-[450px] overflow-hidden group hover:border-[#C59B8F] transition-all duration-500 hover:shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#2B1615]/10 via-[#2B1615]/80 to-[#1F0D0D] z-0"></div>

                    <div className="relative z-10 p-8 flex flex-col h-full justify-end transition-transform duration-500 group-hover:-translate-y-2">
                      <div className="flex justify-between items-end border-b border-[#3A1E1E] pb-4 mb-4">
                        <div>
                          <p className="text-[0.55rem] uppercase tracking-widest text-[#C59B8F] mb-1">ALTERNATIVE</p>
                          <h3 className="text-3xl text-[#F3E8DE] font-serif font-medium">{altStyle.nama_gaya}</h3>
                        </div>
                        <div className="bg-[#592D2D] rounded-sm flex flex-col items-center justify-center px-4 py-2 shadow-lg">
                          <span className="text-xl font-bold text-[#F3E8DE]">{altStyle.match_score ? `${altStyle.match_score}%` : "-"}</span>
                          <span className="text-[0.45rem] uppercase tracking-widest text-[#D2C3BD]">MATCH</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[0.6rem] uppercase tracking-widest text-[#A68A82]">WHY IT WORKS</p>
                        <p className="text-[0.8rem] text-[#D2C3BD] leading-relaxed">
                          {altStyle.alasan || "A versatile alternative that compliments your features."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              <div className="flex flex-col items-center pt-4 pb-8 space-y-4">
                {activeFeatures.includes("VIRTUAL_TRY_ON") ? (
                  <button className="bg-[#D9D0C6] px-8 py-3 text-xs font-bold tracking-widest text-[#2B1D19] transition-all hover:scale-105 rounded-sm">
                    TRY NEXT STYLE (VIRTUAL TRY-ON)
                  </button>
                ) : (
                  <div className="bg-[#2A1616] border border-[#3A1E1E] px-8 py-3 rounded-sm flex items-center gap-2">
                    <Focus className="w-4 h-4 text-[#C59B8F]/30" />
                    <span className="text-[0.6rem] text-[#A68A82] uppercase tracking-widest">Virtual Try-On Locked</span>
                  </div>
                )}
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-[#A68A82]">{activeFeatures.includes("VIRTUAL_TRY_ON") ? "Premium Feature: Virtual Try-On Active" : "Upgrade your package to unlock Virtual Try-On"}</p>
              </div>
            </div>

            <div className="bg-[#211111] border border-[#3A1E1E] rounded-md p-6 lg:p-8 flex flex-col space-y-8 shadow-2xl">

              <div>
                <h2 className="text-[0.7rem] uppercase tracking-widest text-[#A68A82] mb-6 font-bold flex items-center">
                  FACIAL ANALYSIS <span className="text-[#C59B8F] ml-1">OVERVIEW</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                  <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm p-5">
                    <p className="text-xs text-[#A68A82] mb-1">Face Shape</p>
                    <h3 className="text-xl text-[#F3E8DE] font-semibold mb-4">{data.bentuk_wajah || "-"}</h3>
                    <div className="flex items-center gap-4">
                      <svg width="40" height="50" viewBox="0 0 40 50">
                        <ellipse cx="20" cy="25" rx="16" ry="22" fill="none" stroke="#C59B8F" strokeWidth="1.5" strokeDasharray="3 3" />
                      </svg>
                      <p className="text-[0.65rem] text-[#D2C3BD] leading-tight flex-1">
                        {data.deskripsi_bentuk_wajah || `${data.bentuk_wajah || "-"} face shape.`}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm p-5 flex flex-col justify-center space-y-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="w-1/2">
                        <p className="text-xs text-[#A68A82] mb-1">Symmetry Score</p>
                        {activeFeatures.includes("SYMMETRY") ? (
                          <>
                            <h3 className="text-3xl text-[#F3E8DE] font-light">{clamp(data.skor_simetri)}%</h3>
                            <p className="text-xs text-[#F3E8DE] mb-2">{data.level_simetri || "-"}</p>
                            <div className="h-1 w-full bg-[#3A1E1E] rounded-full overflow-hidden mt-2">
                              <div className="h-full bg-[#8A9A5B]" style={{ width: `${clamp(data.skor_simetri)}%` }}></div>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 mt-2">
                            <Focus className="w-4 h-4 text-[#C59B8F]/30" />
                            <span className="text-[0.6rem] text-[#A68A82] uppercase tracking-widest">Locked</span>
                          </div>
                        )}
                      </div>
                      <div className="w-1/2">
                        <p className="text-xs text-[#A68A82] mb-1">AI Confidence</p>
                        <h3 className="text-3xl text-[#F3E8DE] font-light">{clamp(data.ai_confidence)}%</h3>
                        <p className="text-xs text-[#F3E8DE] mb-2">{data.ai_confidence >= 90 ? "Very High" : data.ai_confidence >= 70 ? "High" : data.ai_confidence >= 50 ? "Medium" : "-"}</p>
                        <div className="h-1 w-full bg-[#3A1E1E] rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-[#6B8E6B]" style={{ width: `${clamp(data.ai_confidence)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm p-4 flex gap-4">
                    {!activeFeatures.includes("FACE_HEATMAP") ? (
                      <div className="flex-1 flex flex-col items-center justify-center bg-[#1C0D0D] border border-[#3A1E1E] rounded-sm p-6 text-center">
                        <Focus className="w-8 h-8 text-[#C59B8F]/30 mb-2" />
                        <p className="text-[0.65rem] text-[#A68A82] uppercase tracking-widest mb-1">Feature Locked</p>
                        <p className="text-[0.55rem] text-[#D2C3BD]">Face Heatmap requires a premium package.</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 flex flex-col">
                          <p className="text-xs text-[#A68A82] mb-3">Face Heatmap</p>
                          <div className="space-y-2">
                            {[
                              { zone: "Dahi", val: data.heatmap_wajah?.dahi },
                              { zone: "Pelipis", val: data.heatmap_wajah?.pelipis },
                              { zone: "Pipi", val: data.heatmap_wajah?.pipi },
                              { zone: "Rahang", val: data.heatmap_wajah?.rahang },
                              { zone: "Dagu", val: data.heatmap_wajah?.dagu },
                            ].map((item, i) => (
                              <div key={i} className="flex justify-between items-center text-[0.65rem]">
                                <span className="text-[#A68A82]">{item.zone}</span>
                                <span className={`px-2 py-0.5 rounded-sm text-[0.55rem] ${item.val === "High Suitability" ? "bg-[#FF4500]/20 text-[#FF6347]" : item.val === "Medium" ? "bg-[#FFD700]/20 text-[#FFD700]" : "bg-[#00BFFF]/20 text-[#00BFFF]"}`}>{item.val || "-"}</span>
                              </div>
                            ))}
                          </div>
                          {data.heatmap_wajah?.zona_terbaik && (
                            <p className="text-[0.55rem] text-[#D2C3BD] mt-3">Best Zone: <span className="text-[#C59B8F]">{data.heatmap_wajah.zona_terbaik}</span></p>
                          )}
                          {data.heatmap_wajah?.zona_fokus && (
                            <p className="text-[0.55rem] text-[#D2C3BD] mt-1">Focus Zone: <span className="text-[#C59B8F]">{data.heatmap_wajah.zona_fokus}</span></p>
                          )}
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
                        </div>
                      </>
                    )}
                  </div>

                </div>
              </div>

              <div>
                <h2 className="text-[0.7rem] uppercase tracking-widest text-[#A68A82] mb-6 font-bold">
                  DETAILED FACIAL ANALYSIS
                </h2>
                <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#3A1E1E]">

                  <div className="p-6 flex flex-col relative h-[250px] justify-center items-center">
                    <p className="absolute top-6 left-6 text-xs text-[#A68A82]">Facial Proportion</p>
                    {!activeFeatures.includes("ADV_MAPPING") ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Focus className="w-8 h-8 text-[#C59B8F]/30 mb-2" />
                        <p className="text-[0.65rem] text-[#A68A82] uppercase tracking-widest mb-1">Feature Locked</p>
                        <p className="text-[0.55rem] text-[#D2C3BD]">Advanced Mapping required.</p>
                      </div>
                    ) : (
                      <>
                    <svg viewBox="0 0 120 120" className="w-48 h-48 mt-4">
                      <polygon points="60,10 105,45 85,105 35,105 15,45" fill="none" stroke="#4A2626" strokeWidth="0.5" />
                      <polygon points="60,30 90,55 75,90 45,90 30,55" fill="none" stroke="#4A2626" strokeWidth="0.5" strokeDasharray="2,2" />
                      <polygon points="60,18 100,48 80,100 40,95 20,48" fill="rgba(197,155,143,0.1)" stroke="#D15C5C" strokeWidth="1" />
                      <circle cx="60" cy="18" r="1.5" fill="#D15C5C" />
                      <circle cx="100" cy="48" r="1.5" fill="#D15C5C" />
                      <circle cx="80" cy="100" r="1.5" fill="#D15C5C" />
                      <circle cx="40" cy="95" r="1.5" fill="#D15C5C" />
                      <circle cx="20" cy="48" r="1.5" fill="#D15C5C" />
                    </svg>
                    <span className="absolute top-10 text-[0.55rem] text-[#D2C3BD] text-center">Forehead<br />{clamp(data.peta_proporsi?.dahi)}%</span>
                    <span className="absolute right-12 top-[40%] text-[0.55rem] text-[#D2C3BD] text-center">Cheekbones<br />{clamp(((data.peta_proporsi?.pipi_kiri || 0) + (data.peta_proporsi?.pipi_kanan || 0)) / 2)}%</span>
                    <span className="absolute right-20 bottom-12 text-[0.55rem] text-[#D2C3BD] text-center">Jawline<br />{clamp(data.peta_proporsi?.rahang)}%</span>
                    <span className="absolute left-20 bottom-12 text-[0.55rem] text-[#D2C3BD] text-center">Chin<br />{clamp(data.peta_proporsi?.dagu)}%</span>
                    <span className="absolute left-12 top-[40%] text-[0.55rem] text-[#D2C3BD] text-center">Face Width<br />{clamp(data.pengukuran_fitur?.lebar_wajah)}%</span>
                    <div className="absolute bottom-4 flex items-center gap-6 text-[0.55rem] text-[#A68A82]">
                      <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-[#D15C5C]"></div> You</div>
                      <div className="flex items-center gap-2"><div className="w-3 h-0.5 border-t border-dashed border-[#A68A82]"></div> Ideal</div>
                    </div>
                      </>
                    )}
                  </div>

                  <div className="p-6 flex flex-col justify-between">
                    <p className="text-xs text-[#A68A82] mb-4">Feature Measurements</p>

                    {!activeFeatures.includes("ADV_MAPPING") ? (
                      <div className="flex-1 flex flex-col items-center justify-center bg-[#1C0D0D] border border-[#3A1E1E] rounded-sm p-4 text-center">
                        <Focus className="w-8 h-8 text-[#C59B8F]/30 mb-2" />
                        <p className="text-[0.65rem] text-[#A68A82] uppercase tracking-widest mb-1">Feature Locked</p>
                        <p className="text-[0.55rem] text-[#D2C3BD]">Advanced Mapping is required for this data.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 flex-1">
                        {[
                          { label: "Face Length", val: data.pengukuran_fitur?.panjang_wajah },
                          { label: "Face Width", val: data.pengukuran_fitur?.lebar_wajah },
                          { label: "Jawline Strength", val: data.pengukuran_fitur?.kekuatan_rahang },
                          { label: "Cheekbone Width", val: data.pengukuran_fitur?.lebar_tulang_pipi },
                          { label: "Forehead Width", val: data.pengukuran_fitur?.lebar_dahi },
                        ].map((item, i) => {
                          const clampedVal = item.val != null ? clamp(item.val) : null;
                          return (
                            <div key={i}>
                              <div className="flex justify-between text-[0.65rem] text-[#D2C3BD] mb-1">
                                <span>{item.label}</span>
                                <span>{clampedVal != null ? `${clampedVal}%` : "-"}</span>
                              </div>
                              <div className="h-[2px] w-full bg-[#3A1E1E]">
                                <div className="h-full bg-[#D15C5C]" style={{ width: clampedVal != null ? `${clampedVal}%` : '0%' }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col justify-between">
                    <p className="text-xs text-[#A68A82] mb-4">Facial Balance</p>

                    {!activeFeatures.includes("ADV_MAPPING") ? (
                      <div className="flex-1 flex flex-col items-center justify-center bg-[#1C0D0D] border border-[#3A1E1E] rounded-sm p-4 text-center">
                        <Focus className="w-8 h-8 text-[#C59B8F]/30 mb-2" />
                        <p className="text-[0.65rem] text-[#A68A82] uppercase tracking-widest mb-1">Feature Locked</p>
                        <p className="text-[0.55rem] text-[#D2C3BD]">Advanced Mapping is required for this data.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 flex-1">
                        {[
                          { label: "Left Eye vs Right Eye", val: data.keseimbangan_wajah?.mata_kiri_kanan || "-" },
                          { label: "Left Brow vs Right Brow", val: data.keseimbangan_wajah?.alis_kiri_kanan || "-" },
                          { label: "Nose Centering", val: data.keseimbangan_wajah?.pemusatan_hidung || "-" },
                          { label: "Mouth Alignment", val: data.keseimbangan_wajah?.kelurusan_mulut || "-" },
                          { label: "Chin Balance", val: data.keseimbangan_wajah?.keseimbangan_dagu || "-" },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center text-[0.7rem]">
                            <span className="text-[#A68A82]">{item.label}</span>
                            <span className={`text-${item.val === 'Good' || item.val === 'Average' ? '[#C59B8F]' : '[#F3E8DE]'}`}>{item.val}</span>
                          </div>
                        ))}
                      </div>
                    )}


                  </div>

                </div>
              </div>

              <div>
                <h2 className="text-[0.7rem] uppercase tracking-widest text-[#A68A82] mb-6 font-bold">
                  HAIR ANALYSIS & SCALP HEALTH
                </h2>
                {!activeFeatures.includes("HAIR_ANALYSIS") ? (
                  <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm p-8 flex flex-col items-center justify-center text-center h-48">
                    <Focus className="w-8 h-8 text-[#C59B8F]/30 mb-3" />
                    <p className="text-xs text-[#A68A82] uppercase tracking-widest mb-1">Feature Locked</p>
                    <p className="text-[0.65rem] text-[#D2C3BD]">Hair Analysis is a premium feature. Upgrade your package.</p>
                  </div>
                ) : (
                <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#3A1E1E] p-6">

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
                          <p className="text-lg text-[#F3E8DE] font-semibold">{data.ketebalan_rambut || "-"}</p>
                          <p className="text-[0.65rem] text-[#D2C3BD]">{data.ketebalan_rambut_mm ? `${data.ketebalan_rambut_mm} mm` : ""}</p>
                          {data.kondisi_rambut && (
                            <div className="mt-1 bg-[#1C0D0D] px-2 py-0.5 inline-block text-[0.55rem] text-[#A68A82] rounded-sm border border-[#3A1E1E]">
                              {data.kondisi_rambut}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col pl-6">
                      <p className="text-xs text-[#A68A82] mb-2">Hair Density</p>
                      <CircularProgress percentage={data.kepadatan_rambut || 0} color="#8A9A5B" label={data.kepadatan_rambut && data.kepadatan_rambut > 80 ? "High Density" : "Medium Density"} subLabel="Your hair density is evaluated by AI." />
                    </div>

                    <div className="flex flex-col pl-6">
                      <p className="text-xs text-[#A68A82] mb-2">Scalp Health</p>
                      <CircularProgress percentage={clamp(data.kesehatan_kulit_kepala)} color="#3CB371" label={data.kesehatan_kulit_kepala && data.kesehatan_kulit_kepala > 80 ? "Excellent" : "Good"} subLabel={data.rekomendasi_perawatan || ""} />
                    </div>
                  </div>

                  <div className="border-t border-[#3A1E1E] p-4 px-6 flex items-center bg-[#251313]">
                    <div className="flex items-center gap-3 w-1/3">
                      <div className="w-4 h-6 rounded-full border border-[#8A9A5B] bg-[#8A9A5B]/20"></div>
                      <div>
                        <p className="text-[0.65rem] text-[#A68A82]">Hair Growth Potential</p>
                        <p className="text-sm text-[#F3E8DE] font-semibold">{data.potensi_pertumbuhan && data.potensi_pertumbuhan > 80 ? "High" : "Medium"}</p>
                      </div>
                    </div>
                    <div className="w-2/3 flex flex-col justify-center pl-4 border-l border-[#3A1E1E]">
                      <p className="text-[0.65rem] text-[#D2C3BD] mb-2 flex justify-between">
                        <span>You have great potential for various hairstyles.</span>
                        <span>{data.potensi_pertumbuhan != null ? `${clamp(data.potensi_pertumbuhan)}%` : "-"}</span>
                      </p>
                      <div className="h-[3px] w-full bg-[#3A1E1E] rounded-full overflow-hidden">
                        <div className="h-full bg-[#8A9A5B]" style={{ width: `${clamp(data.potensi_pertumbuhan)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                )}
              </div>

              <div>
                <h2 className="text-[0.7rem] uppercase tracking-widest text-[#A68A82] mb-6 font-bold">
                  RISK ANALYSIS
                </h2>
                {!activeFeatures.includes("RISK_ANALYSIS") ? (
                  <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm p-8 flex flex-col items-center justify-center text-center h-48">
                    <Focus className="w-8 h-8 text-[#C59B8F]/30 mb-3" />
                    <p className="text-xs text-[#A68A82] uppercase tracking-widest mb-1">Feature Locked</p>
                    <p className="text-[0.65rem] text-[#D2C3BD]">Risk Analysis requires a premium package.</p>
                  </div>
                ) : (
                  <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm p-6">
                    <div className="flex items-center gap-6">
                      <CircularProgress
                        percentage={clamp(data.risiko_gaya?.persentase_risiko)}
                        color={data.risiko_gaya?.persentase_risiko > 60 ? "#D15C5C" : data.risiko_gaya?.persentase_risiko > 30 ? "#FFD700" : "#8A9A5B"}
                        size={80}
                        label={data.risiko_gaya?.level_risiko || "-"}
                        subLabel="Style Risk Level"
                      />
                      <div className="flex-1">
                        <p className="text-[0.7rem] text-[#D2C3BD] leading-relaxed mb-3">{data.risiko_gaya?.deskripsi_risiko || "-"}</p>
                        {data.risiko_gaya?.faktor_risiko && data.risiko_gaya.faktor_risiko.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {data.risiko_gaya.faktor_risiko.map((f, i) => (
                              <span key={i} className="bg-[#1C0D0D] border border-[#3A1E1E] px-2 py-1 text-[0.55rem] text-[#A68A82] rounded-sm">{f}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-[0.7rem] uppercase tracking-widest text-[#A68A82] mb-6 font-bold">
                  BARBER INSTRUCTIONS
                </h2>
                {!activeFeatures.includes("BARBER_INSTRUCTIONS") ? (
                  <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm p-8 flex flex-col items-center justify-center text-center h-48">
                    <Focus className="w-8 h-8 text-[#C59B8F]/30 mb-3" />
                    <p className="text-xs text-[#A68A82] uppercase tracking-widest mb-1">Feature Locked</p>
                    <p className="text-[0.65rem] text-[#D2C3BD]">Barber Instructions requires a premium package.</p>
                  </div>
                ) : (
                  <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm p-6">
                    {data.instruksi_barber_detail ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          { label: "Cutting Technique", val: data.instruksi_barber_detail.teknik_potong },
                          { label: "Side Length", val: data.instruksi_barber_detail.panjang_sisi },
                          { label: "Top Length", val: data.instruksi_barber_detail.panjang_atas },
                          { label: "Finishing Technique", val: data.instruksi_barber_detail.teknik_finishing },
                          { label: "Suggested Products", val: data.instruksi_barber_detail.produk_saran },
                          { label: "Estimated Time", val: data.instruksi_barber_detail.estimasi_waktu },
                        ].map((item, i) => (
                          <div key={i} className="bg-[#1C0D0D] border border-[#3A1E1E] rounded-sm p-3">
                            <p className="text-[0.55rem] text-[#A68A82] uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-[0.7rem] text-[#F3E8DE] leading-relaxed">{item.val || "-"}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[0.7rem] text-[#D2C3BD] leading-relaxed">{data.instruksi_barber || "-"}</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-[0.7rem] uppercase tracking-widest text-[#A68A82] mb-6 font-bold">
                  TREND ANALYTICS
                </h2>
                <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#3A1E1E] p-6">

                  {!activeFeatures.includes("TREND_ANALYSIS") ? (
                    <div className="col-span-3 flex-1 flex flex-col items-center justify-center bg-[#1C0D0D] border border-[#3A1E1E] rounded-sm p-8 text-center h-48">
                      <Focus className="w-8 h-8 text-[#C59B8F]/30 mb-3" />
                      <p className="text-xs text-[#A68A82] uppercase tracking-widest mb-1">Feature Locked</p>
                      <p className="text-[0.65rem] text-[#D2C3BD]">Trend Analytics is a premium feature included in higher-tier packages.</p>
                    </div>
                  ) : (
                    <>
                      <div className="pr-6">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-xs text-[#A68A82]">Popularity Over Time</p>
                          <span className="text-[0.55rem] text-[#D2C3BD] bg-[#1C0D0D] px-2 py-1 rounded-sm border border-[#3A1E1E]">6 Months v</span>
                        </div>
                        <div className="h-24 w-full relative">
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

                      <div className="px-6">
                        <p className="text-xs text-[#A68A82] mb-4">Trending Styles for You</p>
                        <ul className="space-y-3">
                          {(data.trending_styles || []).slice(0, 4).map((item, i) => {
                            const isUp = !item.delta.startsWith("-");
                            return (
                              <li key={i} className="flex justify-between items-center text-[0.65rem]">
                                <div className="flex items-center gap-3">
                                  <span className="text-[#A68A82]">{i + 1}</span>
                                  <span className="text-[#F3E8DE]">{item.nama}</span>
                                </div>
                                <div className={`flex items-center gap-1 ${isUp ? 'text-[#8A9A5B]' : 'text-[#D15C5C]'}`}>
                                  {isUp ? <ArrowUp className="w-2 h-2" /> : <ArrowDown className="w-2 h-2" />}
                                  <span>{item.delta}</span>
                                </div>
                              </li>
                            );
                          })}
                          {(!data.trending_styles || data.trending_styles.length === 0) && (
                            <p className="text-[0.6rem] text-[#A68A82] text-center pt-2">No trending data available.</p>
                          )}
                        </ul>
                      </div>

                      <div className="pl-6">
                        <p className="text-xs text-[#A68A82] mb-2">Your Style Compatibility</p>
                        <div className="mt-4">
                          <CircularProgress percentage={clamp(data.kompatibilitas_gaya)} color="#D15C5C" size={70} label="Trend Match" subLabel="Based on your facial structure." />
                        </div>
                      </div>
                    </>
                  )}

                </div>
              </div>

              {activeFeatures.includes("HISTORY") && (
                <div className="mt-12 mb-8">
                  <h2 className="text-[0.7rem] uppercase tracking-widest text-[#A68A82] mb-6 font-bold">
                    SCANNING HISTORY
                  </h2>
                  <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm p-6">
                    {loadingHistory ? (
                      <div className="flex justify-center items-center h-24">
                        <div className="w-6 h-6 border-2 border-[#D15C5C] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : historyItems.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-[0.65rem] text-[#D2C3BD]">No past scanning history found.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {historyItems.map((item) => {
                          const result = item.hasil_analisis || {};
                          return (
                            <div key={item.id} className="flex gap-4 p-4 border border-[#3A1E1E] bg-[#1C0D0D] rounded-sm group/item hover:border-[#4a2a2a] transition-all">
                              <div className="flex gap-2 shrink-0">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#2A1616] relative overflow-hidden border border-white/5">
                                  {item.url_foto_upload ? (
                                    <img 
                                      src={item.url_foto_upload.startsWith("http") ? item.url_foto_upload : `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace("/api/v1", "")}${item.url_foto_upload}`} 
                                      alt="Before" 
                                      className="object-cover w-full h-full opacity-60 group-hover/item:opacity-80 transition-opacity"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Focus className="w-5 h-5 text-[#A68A82]/30" />
                                    </div>
                                  )}
                                  <div className="absolute top-0 left-0 bg-black/40 px-1 text-[0.4rem] text-white uppercase">Before</div>
                                </div>

                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#2A1616] relative overflow-hidden border border-[#D15C5C]/20">
                                  {(() => {
                                    let historyAiUrl = null;
                                    if (item.url_hasil_img) {
                                      try {
                                        const p = typeof item.url_hasil_img === 'string' ? JSON.parse(item.url_hasil_img) : item.url_hasil_img;
                                        if (Array.isArray(p) && p.length > 0) historyAiUrl = p[0];
                                      } catch (e) {}
                                    }
                                    return historyAiUrl ? (
                                      <img 
                                        src={historyAiUrl.startsWith("http") ? historyAiUrl : `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace("/api/v1", "")}${historyAiUrl}`} 
                                        alt="After" 
                                        className="object-cover w-full h-full opacity-90 group-hover/item:opacity-100 transition-opacity"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-[#D15C5C]/30" />
                                      </div>
                                    );
                                  })()}
                                  <div className="absolute top-0 right-0 bg-[#4a1a1a]/80 px-1 text-[0.4rem] text-white uppercase">After</div>
                                </div>
                              </div>
                              <div className="flex flex-col justify-center">
                                <span className="text-[0.6rem] text-[#A68A82] mb-1">
                                  {new Date(item.tgl_generate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className="text-sm text-[#F3E8DE] font-medium">{result.rekomendasi_gaya?.[0]?.nama_gaya || "Unknown Style"}</span>
                                <div className="flex gap-3 mt-1.5">
                                  <span className="text-[0.65rem] text-[#D2C3BD]">Match: {result.rekomendasi_gaya?.[0]?.match_score || 0}%</span>
                                  <span className="text-[0.65rem] text-[#D2C3BD]">Face: {result.bentuk_wajah || "-"}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

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
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(400px); opacity: 0; }
        }
        .animate-scan-line {
          animation: scan-line 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </main>
  );
}