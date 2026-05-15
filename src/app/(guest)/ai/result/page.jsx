"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowUp, ArrowDown, Focus, Sparkles, User, Info, Scissors, ShieldCheck, BarChart3, Clock, Lock } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

const CountUp = ({ value, suffix = "%", duration = 2, delay = 0 }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [hasAnimated, setHasAnimated] = useState(false);

  return (
    <motion.span
      onViewportEnter={() => {
        if (!hasAnimated) {
          animate(count, value, { duration, delay, ease: "easeOut" });
          setHasAnimated(true);
        }
      }}
    >
      <motion.span>{rounded}</motion.span>{suffix}
    </motion.span>
  );
};

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
      <div style={{ transform: "translateZ(20px)" }} className="h-full w-full">
        {children}
      </div>
    </div>
  );
}

function ResultPortrait({ url_foto_upload, ai_image_url }) {
  return (
    <div className="relative h-full min-h-[600px] lg:min-h-full w-full overflow-hidden bg-[linear-gradient(180deg,#1c1a1a_0%,#40312c_35%,#8b6f59_72%,#d2bfa7_100%)] shadow-2xl group">
      <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(0,0,0,0.56),transparent)] z-[5]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(0deg,rgba(46,17,17,0.8),transparent)] z-[5]" />

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C59B8F] to-transparent shadow-[0_0_15px_rgba(197,155,143,0.8)] animate-scan-line z-[15]" />

      {url_foto_upload && (
        <img
          src={url_foto_upload.startsWith("data:") || url_foto_upload.startsWith("http") ? url_foto_upload : `${(process.env.NEXT_PUBLIC_API_URL).replace("/api/v1", "")}${url_foto_upload}`}
          className="absolute inset-0 w-full h-full object-cover z-[1]"
          alt="Original Reference"
        />
      )}

      {ai_image_url && (
        <img
          src={ai_image_url.startsWith("data:") || ai_image_url.startsWith("http") ? ai_image_url : `${(process.env.NEXT_PUBLIC_API_URL).replace("/api/v1", "")}${ai_image_url}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0 z-[2]"
          alt="AI Generated Style"
        />
      )}

      {ai_image_url && (
        <div className="absolute bottom-6 left-6 z-[30] transition-opacity duration-700 group-hover:opacity-0">
          <div className="bg-[#D15C5C]/90 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-[#f3e8de] backdrop-blur-md border border-white/20 w-fit shadow-lg flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            Rekomendasi AI
          </div>
        </div>
      )}

      <div className={`absolute bottom-6 left-6 z-[25] transition-opacity duration-700 ${ai_image_url ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
        <div className="bg-black/80 px-4 py-2 text-[0.65rem] uppercase tracking-[0.3em] text-[#f3e8de] backdrop-blur-md border border-white/10 w-fit shadow-lg flex items-center gap-2">
          <Focus className="w-3 h-3" />
          Gambar Asli
        </div>
      </div>

      <div className="absolute top-10 left-10 w-12 h-12 border-t-2 border-l-2 border-white/20 z-[3]" />
      <div className="absolute top-10 right-10 w-12 h-12 border-t-2 border-r-2 border-white/20 z-[3]" />
      <div className="absolute bottom-10 left-10 w-12 h-12 border-b-2 border-l-2 border-white/20 z-[3]" />
      <div className="absolute bottom-10 right-10 w-12 h-12 border-b-2 border-r-2 border-white/20 z-[3]" />
    </div>
  );
}

const CircularProgress = ({ percentage, color, label, subLabel, size = 80 }) => {
  const radius = size / 2 - 4;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex items-center gap-4 group/progress">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#3A1E1E" strokeWidth="4" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-sm font-semibold text-[#F3E8DE] group-hover/progress:scale-110 transition-transform duration-300"
          >
            <CountUp value={percentage} delay={0.2} />
          </motion.span>
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

const getHeatColor = (val) => {
  if (val === "High Suitability") return { color: "#FF4500", opacity: 0.46, label: "High", glow: "rgba(255,69,0,0.6)" };
  if (val === "Mid Suitability") return { color: "#FFD700", opacity: 0.40, label: "Mid", glow: "rgba(255,215,0,0.5)" };
  return { color: "#1C6B8A", opacity: 0.38, label: "Low", glow: "rgba(28,107,138,0.5)" };
};

export default function AiResultPage() {
  const [mounted, setMounted] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [historyItems, setHistoryItems] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedStyleIndex, setSelectedStyleIndex] = useState(0);
  const [hoveredZone, setHoveredZone] = useState(null);
  const targetScrollRef = useRef(null);
  const router = useRouter();

  const loadData = () => {
    const stored = sessionStorage.getItem("aiAnalysisResult");
    if (stored && stored !== "undefined") {
      try {
        const parsedData = JSON.parse(stored);
        if (parsedData) {
          setAnalysisData(parsedData);
          const savedImage = sessionStorage.getItem("aiOriginalImage");
          setOriginalImage(parsedData.url_foto_upload || savedImage || parsedData.record?.url_foto_upload);
          setSelectedStyleIndex(0);

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
  };

  useEffect(() => {
    loadData();

    const timer = setTimeout(() => setMounted(true), 100);

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

  if (!mounted) return null;
  if (!analysisData) return null;

  let data = analysisData.hasil_analisis || {};
  let activeFeatures = analysisData.active_features || analysisData.activeFeatures || [];

  // logic untuk handle jika user tidak upgrade
  if (activeFeatures.length === 0 && analysisData.hasil_analisis) {
    const h = analysisData.hasil_analisis;
    if (h.heatmap_wajah || h.skor_simetri || (h.rekomendasi_gaya && h.rekomendasi_gaya.length > 1)) {
      activeFeatures = ["SYMMETRY", "FACE_HEATMAP", "HAIR_ANALYSIS", "BARBER_INSTRUCTIONS", "VIRTUAL_TRY_ON", "HISTORY"];
    }
  }

  const isPremiumLocked = !activeFeatures.includes("SYMMETRY") && !activeFeatures.includes("FACE_HEATMAP");

  if (isPremiumLocked) {
    data = {
      ...data,
      bentuk_wajah: data.bentuk_wajah || "Diamond",
      deskripsi_bentuk_wajah: data.deskripsi_bentuk_wajah || "Your Diamond face shape provides a strong foundation for the selected styles.",
      skor_simetri: 92,
      level_simetri: "Excellent",
      ai_confidence: data.ai_confidence || 98,
      heatmap_wajah: { dahi: "High Suitability", pipi: "Mid Suitability", rahang: "Low Suitability", dagu: "High Suitability", zona_terbaik: "Dahi" },
      peta_proporsi: { dahi: 32, pipi_kiri: 15, pipi_kanan: 15, rahang: 20, dagu: 18 },
      pengukuran_fitur: { panjang_wajah: 85, kekuatan_rahang: 75, lebar_tulang_pipi: 90, lebar_dahi: 80, lebar_wajah: 100 },
      keseimbangan_wajah: { mata_kiri_kanan: "Symmetric", alis_kiri_kanan: "Aligned", pemusatan_hidung: "Centered", kelurusan_mulut: "Straight" }
    };
  }

  const styles = data.rekomendasi_gaya || [];


  let aiImageUrls = [];
  const rawAiUrls = analysisData.url_hasil_img || analysisData.record?.url_hasil_img;
  if (rawAiUrls) {
    try {
      const parsedUrls = typeof rawAiUrls === 'string'
        ? JSON.parse(rawAiUrls)
        : rawAiUrls;
      if (Array.isArray(parsedUrls)) {
        aiImageUrls = parsedUrls;
      } else if (typeof parsedUrls === 'string') {
        aiImageUrls = [parsedUrls];
      }
    } catch (e) {
      console.warn("Failed to parse AI images:", e);
    }
  }

  const aiImageUrl = aiImageUrls.length > selectedStyleIndex ? aiImageUrls[selectedStyleIndex] : (aiImageUrls.length > 0 ? aiImageUrls[0] : null);

  const dynamicStats = [
    { label: "GENDER", value: data.gender || "-" },
    { label: "FACE SHAPE", value: data.bentuk_wajah || "-" },
    { label: "HAIR TYPE", value: data.jenis_rambut || "-" },
    { label: "STRUCTURE", value: data.ketebalan_rambut || "-" },
    { label: "CONFIDENCE", value: `${clamp(data.ai_confidence)}%` },
  ];


  const heatmapImgSrc = originalImage
    ? (originalImage.startsWith("data:") || originalImage.startsWith("http")
      ? originalImage
      : `${(process.env.NEXT_PUBLIC_API_URL).replace("/api/v1", "")}${originalImage}`)
    : null;


  const heatZones = [
    {
      id: "dahi",
      label: "Dahi",
      val: data.heatmap_wajah?.dahi,
      ellipses: [{ cx: 50, cy: 45, rx: 18, ry: 9 }],
    },
    {
      id: "pipi",
      label: "Pipi",
      val: data.heatmap_wajah?.pipi,
      ellipses: [
        { cx: 34, cy: 78, rx: 12, ry: 13 },
        { cx: 66, cy: 78, rx: 12, ry: 13 },
      ],
    },
    {
      id: "rahang",
      label: "Rahang",
      val: data.heatmap_wajah?.rahang,
      ellipses: [
        { cx: 33, cy: 96, rx: 10, ry: 8 },
        { cx: 67, cy: 96, rx: 10, ry: 8 },
      ],
    },
    {
      id: "dagu",
      label: "Dagu",
      val: data.heatmap_wajah?.dagu,
      ellipses: [{ cx: 50, cy: 106, rx: 12, ry: 7 }],
    },
  ];

  return (
    <main className="min-h-screen bg-[#351C1C] text-[#2B1D19] overflow-x-clip">

      <div className="fixed top-0 left-0 w-full z-[100] bg-[#351C1C]">
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
                {data.kualitas_foto_ok === false && styles.length === 0 ? "Analisis Belum Lengkap" : "Hasil Rekomendasi AI"}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#D2C3BD] font-light">
                {data.kualitas_foto_ok === false
                  ? (styles.length > 0
                    ? "Meskipun kualitas foto kurang optimal, AI kami tetap berusaha memberikan rekomendasi terbaik untuk Anda."
                    : (data.alasan_kualitas || "Wajah tidak terdeteksi dengan jelas. Silakan coba lagi dengan foto yang lebih baik."))
                  : "AI kami telah menganalisis data biometrik Anda untuk merekomendasikan gaya rambut yang paling sesuai dengan proporsi wajah Anda."}
              </p>
              {data.kualitas_foto_ok === false && styles.length === 0 && (
                <button
                  onClick={() => router.push("/ai")}
                  className="mt-8 bg-[#C59B8F] text-[#2B1D19] px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#D4B4A9] transition-colors"
                >
                  Coba Lagi
                </button>
              )}
            </div>
          </section>

          <div className="w-full border-y border-[#3A1E1E] bg-[#2E1616]">
            <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-6 px-6 py-4 lg:px-10">
              {dynamicStats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex flex-col items-start"
                >
                  <span className="text-[0.6rem] uppercase tracking-[0.25em] text-[#A68A82]">{stat.label}</span>
                  <span className="mt-1 text-sm font-medium text-[#F3E8DE]">{stat.value}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="px-6 py-12 lg:px-12 xl:px-16 flex flex-col space-y-12">

            <div ref={targetScrollRef} className="pt-4 flex flex-col space-y-8 scroll-mt-24">
              {(() => {
                const mainCount = aiImageUrls.length > 0 ? Math.min(aiImageUrls.length, 5) : 2;
                const gridClass = mainCount === 1 ? "grid-cols-1" :
                  mainCount === 2 ? "grid-cols-1 md:grid-cols-2" :
                    mainCount === 4 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" :
                      "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
                return (
                  <div className={`grid ${gridClass} gap-6`}>
                    {styles.slice(0, mainCount).map((style, idx) => {
                      const hasImage = idx < aiImageUrls.length;
                      const isSelected = selectedStyleIndex === idx;
                      const isLocked = isPremiumLocked && idx > 0;

                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 40, scale: 0.95 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.8, delay: idx * 0.15, ease: "easeOut" }}
                          onClick={() => {
                            if (isLocked) {
                              router.push('/service');
                              return;
                            }
                            if (hasImage) {
                              setSelectedStyleIndex(idx);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                          className={`bg-[#2B1615] rounded-sm border ${isSelected ? 'border-[#C59B8F] shadow-[0_0_20px_rgba(197,155,143,0.3)]' : 'border-[#3A1E1E]'} flex flex-col relative h-[500px] md:h-[650px] overflow-hidden group hover:border-[#C59B8F] transition-all duration-700 ${isLocked ? 'cursor-pointer' : (hasImage ? 'cursor-pointer' : 'cursor-default opacity-90')}`}
                        >
                          {isLocked && (
                            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#2B1D19]/60 backdrop-blur-md transition-all group-hover:bg-[#2B1D19]/40">
                              <Lock className="w-12 h-12 text-[#C59B8F] mb-3 drop-shadow-lg" />
                              <p className="text-[0.6rem] text-[#F3E8DE] uppercase tracking-[0.2em] font-bold">Premium Style Locked</p>
                              <p className="text-[0.5rem] text-[#D2C3BD] mt-1 uppercase tracking-widest">Upgrade to view</p>
                            </div>
                          )}

                          {hasImage && !isLocked && (
                            <div className="relative h-[60%] w-full shrink-0 overflow-hidden">
                              <img
                                src={aiImageUrls[idx].startsWith("data:") || aiImageUrls[idx].startsWith("http") ? aiImageUrls[idx] : `${(process.env.NEXT_PUBLIC_API_URL || "").replace("/api/v1", "")}${aiImageUrls[idx]}`}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt={style.nama_gaya}
                              />
                              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#1F0D0D] to-transparent z-10 pointer-events-none"></div>
                            </div>
                          )}

                          {(!hasImage || isLocked) && (
                            <div className={`absolute inset-0 bg-gradient-to-b from-[#2B1615]/20 via-[#2B1615]/80 to-[#1F0D0D] z-0 ${isLocked ? 'blur-xl' : ''}`}></div>
                          )}

                          <div className={`relative z-10 p-6 md:px-8 md:pb-8 flex flex-col ${hasImage && !isLocked ? 'flex-1 justify-between bg-[#1F0D0D] pt-2' : 'h-full justify-end'} transition-transform duration-700 ${!isLocked && !hasImage ? 'group-hover:-translate-y-2' : ''} ${isLocked ? 'blur-sm grayscale' : ''}`}>
                            <div className="flex justify-between items-end border-b border-[#3A1E1E] pb-4 mb-4">
                              <div>
                                <p className="text-[0.55rem] md:text-[0.6rem] uppercase tracking-widest text-[#C59B8F] mb-1 font-bold">
                                  {idx === 0 ? "TOP RECOMMENDATION" : `RECOMMENDATION #${idx + 1}`}
                                </p>
                                <h3 className="text-xl md:text-3xl text-[#F3E8DE] font-serif font-medium leading-tight">{style.nama_gaya}</h3>
                              </div>
                              <div className="bg-[#592D2D] rounded-sm flex flex-col items-center justify-center px-3 py-1.5 md:px-4 md:py-2 shadow-lg group-hover:scale-105 transition-transform duration-500">
                                <span className="text-lg md:text-xl font-bold text-[#F3E8DE]">
                                  <CountUp value={style.match_score || 0} delay={idx * 0.2 + 0.5} />
                                </span>
                                <span className="text-[0.4rem] md:text-[0.45rem] uppercase tracking-widest text-[#D2C3BD]">MATCH</span>
                              </div>
                            </div>

                            <div className="space-y-2 flex-1">
                              <p className="text-[0.55rem] md:text-[0.6rem] uppercase tracking-widest text-[#A68A82] font-semibold">WHY IT WORKS</p>
                              <p className="text-[0.7rem] md:text-[0.8rem] text-[#D2C3BD] leading-relaxed line-clamp-3">
                                {style.alasan || "Perfect for your face shape and natural features."}
                              </p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-[#3A1E1E]/50 flex justify-between items-center">
                              <div className="flex items-center gap-1.5 text-[#8A9A5B]">
                                <Sparkles className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
                                <span className="text-[0.55rem] md:text-[0.65rem] font-bold tracking-wider uppercase">Premium Image Available</span>
                              </div>
                              {isSelected ? (
                                <span className="text-[0.55rem] md:text-[0.6rem] border border-[#C59B8F] text-[#C59B8F] px-3 py-1 md:px-4 md:py-1.5 rounded-sm font-bold uppercase tracking-wider bg-[#C59B8F]/10">Viewing</span>
                              ) : (
                                <span className="text-[0.55rem] md:text-[0.6rem] bg-[#C59B8F] text-[#2B1615] px-3 py-1 md:px-4 md:py-1.5 rounded-sm font-bold uppercase tracking-wider group-hover:bg-[#d4b4a9] transition-colors">View Image</span>
                              )}
                            </div>
                          </div>

                        </motion.div>
                      );
                    })}
                  </div>
                );
              })()}

              {(() => {
                const mainCount = aiImageUrls.length > 0 ? Math.min(aiImageUrls.length, 5) : 2;
                if (styles.length <= mainCount) return null;
                return (
                  <div className="bg-[#2A1616]/40 border border-[#3A1E1E] rounded-sm px-4 py-6">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-px flex-1 bg-[#3A1E1E]"></div>
                      <h4 className="text-[0.65rem] uppercase tracking-[0.4em] text-[#A68A82] font-bold">Alternative Selections</h4>
                      <div className="h-px flex-1 bg-[#3A1E1E]"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {styles.slice(mainCount).map((style, idx) => (
                        <div
                          key={idx + mainCount}
                          onClick={() => isPremiumLocked && router.push('/service')}
                          className={`p-6 border border-[#3A1E1E] bg-[#211111] hover:border-[#C59B8F]/30 transition-all duration-500 group/alt relative overflow-hidden ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${isPremiumLocked ? 'cursor-pointer' : ''}`}
                          style={{ transitionDelay: `${idx * 100}ms` }}
                        >
                          {isPremiumLocked && (
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#2B1D19]/70 backdrop-blur-sm">
                              <Lock className="w-6 h-6 text-[#C59B8F] mb-2" />
                              <span className="text-[0.45rem] text-[#D2C3BD] uppercase tracking-widest font-bold">Locked</span>
                            </div>
                          )}
                          <div className={isPremiumLocked ? "blur-md grayscale opacity-40 select-none" : ""}>
                            <div className="flex justify-between items-start mb-4">
                              <span className="text-[0.55rem] text-[#A68A82] font-bold tracking-widest uppercase">RECOMMENDATION #{idx + mainCount + 1}</span>
                              <span className="text-xs font-bold text-[#F3E8DE] bg-[#3A1E1E] px-2 py-1 rounded-sm">
                                <CountUp value={style.match_score || 0} delay={idx * 0.1} />
                              </span>
                            </div>
                            <h5 className="text-lg text-[#F3E8DE] font-serif mb-3 group-hover/alt:text-[#C59B8F] transition-colors">{style.nama_gaya}</h5>
                            <p className="text-[0.7rem] text-[#A68A82] leading-relaxed mb-4 line-clamp-2 italic">"{style.alasan}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div className="flex flex-col items-center pt-4 pb-8 space-y-4">
                {activeFeatures.includes("VIRTUAL_TRY_ON") && !isPremiumLocked ? (
                  <button
                    onClick={() => {
                      const nextIndex = (selectedStyleIndex + 1) % aiImageUrls.length;
                      setSelectedStyleIndex(nextIndex);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-[#D9D0C6] px-10 py-4 text-xs font-bold tracking-[0.2em] text-[#2B1D19] transition-all hover:scale-105 hover:bg-[#F3E8DE] rounded-sm shadow-xl flex items-center gap-3"
                  >
                    <Focus className="w-4 h-4" />
                    TRY NEXT STYLE (VIRTUAL TRY-ON)
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/service')}
                    className="bg-[#2A1616] border border-[#3A1E1E] px-8 py-3 rounded-sm flex items-center gap-3 group hover:border-[#C59B8F]/50 transition-all"
                  >
                    <Lock className="w-4 h-4 text-[#C59B8F] group-hover:scale-110 transition-transform" />
                    <span className="text-[0.6rem] text-[#A68A82] uppercase tracking-widest font-bold">Virtual Try-On Locked</span>
                  </button>
                )}
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-[#A68A82] font-medium">
                  {isPremiumLocked ? "Upgrade your package to unlock Virtual Try-On" : (activeFeatures.includes("VIRTUAL_TRY_ON") ? "Premium Feature: Virtual Try-On Active" : "Feature not available in current session")}
                </p>
              </div>
            </div>



            <div className="relative mt-8">
              {isPremiumLocked && (
                <div
                  className="absolute inset-0 z-50 flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm bg-[#2B1D19]/40 rounded-sm"
                  onClick={() => router.push('/service')}
                >
                  <div className="sticky top-[40vh] flex flex-col items-center justify-center bg-[#2B1D19]/90 p-10 rounded-xl border border-[#C59B8F]/30 shadow-2xl backdrop-blur-xl">
                    <Lock className="w-16 h-16 text-[#C59B8F] mb-4 drop-shadow-lg" />
                    <h3 className="text-2xl text-[#F3E8DE] font-serif mb-3 tracking-wide text-center">Premium Analysis Locked</h3>
                    <p className="text-xs text-[#D2C3BD] mb-8 tracking-wide text-center max-w-xs leading-relaxed opacity-80">
                      Upgrade to unlock detailed facial mapping, personalized hair analysis, and barber instructions.
                    </p>
                    <button className="text-xs text-[#2B1D19] uppercase font-bold tracking-widest bg-[#C59B8F] px-8 py-3 rounded-sm hover:bg-[#D4B4A9] transition-colors shadow-[0_0_20px_rgba(197,155,143,0.3)]">
                      View Pricing
                    </button>
                  </div>
                </div>
              )}

              <div className={isPremiumLocked ? "blur-[8px] pointer-events-none select-none opacity-40 transition-all duration-1000" : ""}>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                  <h2 className="text-[0.75rem] uppercase tracking-[0.3em] text-[#A68A82] mb-8 font-bold flex items-center gap-3">
                    FACIAL ANALYSIS <span className="text-[#C59B8F]">OVERVIEW</span>
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-[62fr_38fr] gap-4">


                    <div className="w-full flex flex-col gap-4">
                      <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm p-6 hover:border-[#C59B8F]/40 transition-colors group">
                        <p className="text-[0.65rem] text-[#A68A82] mb-2 uppercase tracking-widest font-bold">Face Shape</p>
                        <h3 className="text-2xl text-[#F3E8DE] font-serif mb-4">{data.bentuk_wajah || "-"}</h3>
                        <div className="flex items-center gap-5">
                          <div className="shrink-0 group-hover:rotate-12 transition-transform duration-500">
                            <svg width="40" height="50" viewBox="0 0 40 50">
                              <ellipse cx="20" cy="25" rx="16" ry="22" fill="none" stroke="#C59B8F" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
                            </svg>
                          </div>
                          <p className="text-[0.7rem] text-[#D2C3BD] leading-relaxed italic">
                            {data.deskripsi_bentuk_wajah || `Your ${data.bentuk_wajah || "-"} face shape provides a strong foundation for the selected styles.`}
                          </p>
                        </div>
                      </div>

                      <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm p-6 flex flex-col justify-center space-y-4 hover:border-[#C59B8F]/40 transition-colors">
                        <div className="flex flex-col justify-between items-start gap-4">
                          <div className="w-full">
                            <p className="text-[0.6rem] text-[#A68A82] mb-2 uppercase tracking-widest font-bold">Symmetry</p>
                            <>
                              <h3 className="text-3xl text-[#F3E8DE] font-light">
                                <CountUp value={clamp(data.skor_simetri)} delay={0.5} />
                              </h3>
                              <p className="text-[0.6rem] text-[#8A9A5B] font-bold mt-1 uppercase tracking-tighter">{data.level_simetri || "-"}</p>
                              <div className="h-1 w-full bg-[#3A1E1E] rounded-full overflow-hidden mt-3">
                                <motion.div
                                  className="h-full bg-[#8A9A5B]"
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${clamp(data.skor_simetri)}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                                />
                              </div>
                            </>

                          </div>
                          <div className="w-full">
                            <p className="text-[0.6rem] text-[#A68A82] mb-2 uppercase tracking-widest font-bold">AI Conf.</p>
                            <h3 className="text-3xl text-[#F3E8DE] font-light">
                              <CountUp value={clamp(data.ai_confidence)} delay={0.7} />
                            </h3>
                            <p className="text-[0.6rem] text-[#C59B8F] font-bold mt-1 uppercase tracking-tighter">Verified</p>
                            <div className="h-1 w-full bg-[#3A1E1E] rounded-full overflow-hidden mt-3">
                              <motion.div
                                className="h-full bg-[#C59B8F]"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${clamp(data.ai_confidence)}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 2, delay: 0.7, ease: "easeOut" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-[#2A1616] border border-[#3A1E1E] rounded-sm overflow-hidden hover:border-[#C59B8F]/40 transition-colors flex flex-col h-full">
                      <div className="w-full flex flex-col h-full">

                        <style>
                          {`
            @keyframes pulse-soft {
              0%, 100% { transform: scale(1); opacity: 0.8; }
              50% { transform: scale(1.05); opacity: 1; }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-3px); }
            }
            .animate-pulse-soft {
              animation: pulse-soft 3s ease-in-out infinite;
              transform-origin: center;
            }
            .animate-float {
              animation: float 4s ease-in-out infinite;
            }
            .zone-hover {
              transition: all 0.3s ease;
            }
            .zone-hover:hover {
              filter: brightness(1.3);
              cursor: pointer;
            }
          `}
                        </style>

                        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                          <p className="text-[0.6rem] text-[#A68A82] font-bold uppercase tracking-widest">
                            Face Heatmap
                          </p>
                        </div>

                        <div className="relative mx-auto mb-0 overflow-hidden rounded-sm animate-float w-full max-w-[200px] aspect-[3/4] bg-transparent">
                          <div className="absolute inset-5">
                            <img
                              src="/images/face.png"
                              className="w-full h-full object-contain opacity-50 drop-shadow-lg pointer-events-none"
                              alt="Face Reference"
                            />
                            <div className="absolute inset-0 bg-[#1C0D0D]/20 pointer-events-none" />

                            <svg
                              className="absolute inset-0 w-full h-full"
                              viewBox="0 0 100 133"
                              preserveAspectRatio="xMidYMid meet"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <defs>
                                <filter id="heatBlur" x="-50%" y="-50%" width="200%" height="200%">
                                  <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" />
                                </filter>
                                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                  <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                  </feMerge>
                                </filter>
                              </defs>

                              {heatZones.map((zone) => {
                                const { color, opacity } = getHeatColor(zone.val);
                                const isHovered = hoveredZone === zone.id;

                                return zone.ellipses.map((el, ei) => (
                                  <g
                                    key={`${zone.id}-${ei}`}
                                    className="zone-hover"
                                    onMouseEnter={() => setHoveredZone(zone.id)}
                                    onMouseLeave={() => setHoveredZone(null)}
                                    style={{ transformOrigin: `${el.cx}px ${el.cy}px` }}
                                  >
                                    <ellipse
                                      className="animate-pulse-soft"
                                      cx={el.cx}
                                      cy={el.cy}
                                      rx={isHovered ? el.rx * 1.2 : el.rx}
                                      ry={isHovered ? el.ry * 1.2 : el.ry}
                                      fill={color}
                                      fillOpacity={isHovered ? opacity * 1.2 : opacity}
                                      filter="url(#heatBlur)"
                                    />
                                  </g>
                                ));
                              })}

                              {heatZones.map((zone) => {
                                const { color } = getHeatColor(zone.val);
                                const el = zone.ellipses[0];
                                const isHovered = hoveredZone === zone.id;

                                return (
                                  <g key={`dot-${zone.id}`} filter="url(#glow)" className="pointer-events-none">
                                    <circle
                                      cx={el.cx}
                                      cy={el.cy}
                                      r={isHovered ? "3.5" : "2.5"}
                                      fill={color}
                                      fillOpacity="0.95"
                                      style={{ transition: "all 0.3s ease" }}
                                    />
                                    <circle
                                      className="animate-pulse-soft"
                                      cx={el.cx}
                                      cy={el.cy}
                                      r={isHovered ? "6.5" : "4.8"}
                                      fill="none"
                                      stroke={color}
                                      strokeWidth="0.8"
                                      strokeOpacity="0.7"
                                    />
                                  </g>
                                );
                              })}
                            </svg>
                          </div>
                        </div>

                        <div className="px-4 pt-3 pb-2 flex flex-wrap gap-1.5">
                          {heatZones.map((zone) => {
                            const { color, label: lvl } = getHeatColor(zone.val);
                            const isHovered = hoveredZone === zone.id;

                            return (
                              <div
                                key={zone.id}
                                onMouseEnter={() => setHoveredZone(zone.id)}
                                onMouseLeave={() => setHoveredZone(null)}
                                className={`flex items-center gap-1 px-2 py-[3px] rounded-sm border cursor-pointer transition-all duration-300 ${isHovered
                                  ? "bg-black/40 border-[#A68A82] scale-105"
                                  : "bg-black/20 border-[#3A1E1E]"
                                  }`}
                              >
                                <div
                                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                  style={{ background: color, boxShadow: `0 0 4px ${color}` }}
                                />
                                <span className="text-[0.48rem] text-[#A68A82] uppercase tracking-wide">{zone.label}</span>
                                <span className="text-[0.48rem] font-bold uppercase" style={{ color }}>{lvl}</span>
                              </div>
                            );
                          })}
                        </div>

                        {data.heatmap_wajah?.zona_terbaik && (
                          <div className="px-4 pb-4 pt-1 flex items-center justify-between gap-3 border-t border-[#3A1E1E]/50 mt-1">
                            <div className="shrink-0">
                              <span className="text-[0.5rem] text-[#A68A82]">Best Zone: </span>
                              <span className="text-[0.55rem] text-[#C59B8F] font-bold">{data.heatmap_wajah.zona_terbaik}</span>
                            </div>
                            <div className="flex-1 flex flex-col gap-[2px] max-w-[90px]">
                              <div className="h-[3px] w-full rounded-full bg-gradient-to-r from-[#1C6B8A] via-[#FFD700] to-[#FF4500]" />
                              <div className="flex justify-between text-[0.42rem] text-[#A68A82]/50">
                                <span>LOW</span>
                                <span>HIGH</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>







                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className={`mt-12 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                  <h2 className="text-[0.75rem] uppercase tracking-[0.3em] text-[#A68A82] mb-8 font-bold flex items-center gap-3">
                    DETAILED FACIAL ANALYSIS
                  </h2>
                  <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#3A1E1E]">
                    <div className="p-6 flex flex-col relative h-[250px] justify-center items-center">
                      <p className="absolute top-6 left-6 text-xs text-[#A68A82]">Facial Proportion</p>
                      <>

                        <motion.svg
                          viewBox="0 0 120 120"
                          className="w-48 h-48 mt-4"
                          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        >
                          <polygon points="60,10 105,45 85,105 35,105 15,45" fill="none" stroke="#4A2626" strokeWidth="0.5" />
                          <polygon points="60,30 90,55 75,90 45,90 30,55" fill="none" stroke="#4A2626" strokeWidth="0.5" strokeDasharray="2,2" />
                          <motion.polygon
                            points="60,60 60,60 60,60 60,60 60,60"
                            animate={{ points: "60,18 100,48 80,100 40,95 20,48" }}
                            fill="rgba(197,155,143,0.1)"
                            stroke="#D15C5C"
                            strokeWidth="1"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                          />
                          {[
                            { cx: 60, cy: 18 },
                            { cx: 100, cy: 48 },
                            { cx: 80, cy: 100 },
                            { cx: 40, cy: 95 },
                            { cx: 20, cy: 48 }
                          ].map((pt, i) => (
                            <motion.circle
                              key={i}
                              cx={pt.cx} cy={pt.cy} r="1.5" fill="#D15C5C"
                              initial={{ opacity: 0, scale: 0 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 1 + (i * 0.1) }}
                            />
                          ))}
                        </motion.svg>
                        <motion.span
                          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.2 }}
                          className="absolute top-10 text-[0.55rem] text-[#D2C3BD] text-center">Forehead<br /><CountUp value={clamp(data.peta_proporsi?.dahi)} delay={1.2} /></motion.span>
                        <motion.span
                          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.3 }}
                          className="absolute right-12 top-[40%] text-[0.55rem] text-[#D2C3BD] text-center">Cheekbones<br /><CountUp value={clamp(((data.peta_proporsi?.pipi_kiri || 0) + (data.peta_proporsi?.pipi_kanan || 0)) / 2)} delay={1.3} /></motion.span>
                        <motion.span
                          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.4 }}
                          className="absolute right-20 bottom-12 text-[0.55rem] text-[#D2C3BD] text-center">Jawline<br /><CountUp value={clamp(data.peta_proporsi?.rahang)} delay={1.4} /></motion.span>
                        <motion.span
                          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.5 }}
                          className="absolute left-20 bottom-12 text-[0.55rem] text-[#D2C3BD] text-center">Chin<br /><CountUp value={clamp(data.peta_proporsi?.dagu)} delay={1.5} /></motion.span>
                        <motion.span
                          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.6 }}
                          className="absolute left-12 top-[40%] text-[0.55rem] text-[#D2C3BD] text-center">Face Width<br /><CountUp value={clamp(data.pengukuran_fitur?.lebar_wajah)} delay={1.6} /></motion.span>
                        <div className="absolute bottom-4 flex items-center gap-6 text-[0.55rem] text-[#A68A82]">
                          <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-[#D15C5C]"></div> You</div>
                          <div className="flex items-center gap-2"><div className="w-3 h-0.5 border-t border-dashed border-[#A68A82]"></div> Ideal</div>
                        </div>
                      </>
                    </div>


                    <div className="p-8 flex flex-col justify-between">
                      <p className="text-[0.65rem] text-[#A68A82] mb-6 uppercase tracking-widest font-bold">Feature Measurements</p>
                      <div className="space-y-4 flex-1">

                        {[
                          { label: "Face Length", val: data.pengukuran_fitur?.panjang_wajah },
                          { label: "Jawline Strength", val: data.pengukuran_fitur?.kekuatan_rahang },
                          { label: "Cheekbone Width", val: data.pengukuran_fitur?.lebar_tulang_pipi },
                          { label: "Forehead Width", val: data.pengukuran_fitur?.lebar_dahi },
                        ].map((item, i) => (
                          <div key={i} className="group/item">
                            <div className="flex justify-between text-[0.65rem] text-[#D2C3BD] mb-1.5 font-medium">
                              <span className="group-hover/item:text-[#F3E8DE] transition-colors">{item.label}</span>
                              <span className="text-[#C59B8F]"><CountUp value={clamp(item.val)} delay={0.5 + (i * 0.1)} /></span>
                            </div>
                            <div className="h-[2px] w-full bg-[#3A1E1E]">
                              <motion.div
                                className="h-full bg-[#D15C5C]"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${clamp(item.val)}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>



                    <div className="p-8 flex flex-col justify-between">
                      <p className="text-[0.65rem] text-[#A68A82] mb-6 uppercase tracking-widest font-bold">Facial Balance</p>
                      <div className="space-y-4 flex-1">

                        {[
                          { label: "Eye Symmetry", val: data.keseimbangan_wajah?.mata_kiri_kanan || "-" },
                          { label: "Brow Balance", val: data.keseimbangan_wajah?.alis_kiri_kanan || "-" },
                          { label: "Nose Centering", val: data.keseimbangan_wajah?.pemusatan_hidung || "-" },
                          { label: "Mouth Alignment", val: data.keseimbangan_wajah?.kelurusan_mulut || "-" },
                        ].map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 + (i * 0.1) }}
                            className="flex justify-between items-center text-[0.7rem] border-b border-[#3A1E1E]/30 pb-2 hover:border-[#C59B8F]/30 transition-colors"
                          >
                            <span className="text-[#A68A82]">{item.label}</span>
                            <span className="text-[#F3E8DE] font-semibold flex items-center gap-2">
                              <Check className="w-3 h-3 text-[#8A9A5B]" /> {item.val}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className={`mt-12 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                  <h2 className="text-[0.75rem] uppercase tracking-[0.3em] text-[#A68A82] mb-8 font-bold flex items-center gap-3">
                    HAIR ANALYSIS & SCALP HEALTH
                  </h2>
                  {!activeFeatures.includes("HAIR_ANALYSIS") ? (
                    <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm p-12 flex flex-col items-center justify-center text-center opacity-50">
                      <Scissors className="w-10 h-10 text-[#C59B8F]/30 mb-4" />
                      <p className="text-xs text-[#D2C3BD] uppercase tracking-widest font-bold mb-1">Premium Feature Locked</p>
                    </div>
                  ) : (
                    <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#3A1E1E] p-8">
                        <div className="flex flex-col gap-3 justify-center pb-6 md:pb-0">
                          <p className="text-[0.65rem] text-[#A68A82] font-bold uppercase tracking-widest">Hair Thickness</p>
                          <div className="flex items-center gap-6 mt-3 group/hair">
                            <div className="relative w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                              <svg viewBox="0 0 40 40" className="w-full h-full opacity-60">
                                <path d="M20,35 C15,35 15,10 30,5" fill="none" stroke="#F3E8DE" strokeWidth="2.5" className="animate-pulse" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xl text-[#F3E8DE] font-semibold">{data.ketebalan_rambut || "-"}</p>
                              <p className="text-[0.7rem] text-[#C59B8F] font-bold">{data.ketebalan_rambut_mm ? `${data.ketebalan_rambut_mm} mm` : "Normal"}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col pl-0 md:pl-8 py-6 md:py-0">
                          <p className="text-[0.65rem] text-[#A68A82] font-bold uppercase tracking-widest mb-4">Hair Density</p>
                          <CircularProgress percentage={data.kepadatan_rambut || 0} color="#8A9A5B" label={data.kepadatan_rambut > 80 ? "Optimal" : "Healthy"} subLabel="Density Score" />
                        </div>

                        <div className="flex flex-col pl-0 md:pl-8 pt-6 md:pt-0">
                          <p className="text-[0.65rem] text-[#A68A82] font-bold uppercase tracking-widest mb-4">Scalp Health</p>
                          <CircularProgress percentage={clamp(data.kesehatan_kulit_kepala)} color="#3CB371" label="Excellent" subLabel="Condition Score" />
                        </div>
                      </div>
                      <div className="bg-[#251313] border-t border-[#3A1E1E] p-5 px-8 flex flex-col md:flex-row md:items-center gap-6">
                        <div className="flex items-center gap-4 min-w-[200px]">
                          <div className="w-10 h-10 rounded-full bg-[#8A9A5B]/10 border border-[#8A9A5B]/30 flex items-center justify-center">
                            <ArrowUp className="w-5 h-5 text-[#8A9A5B]" />
                          </div>
                          <div>
                            <p className="text-[0.6rem] text-[#A68A82] font-bold uppercase">Growth Potential</p>
                            <p className="text-sm text-[#F3E8DE] font-semibold">{data.potensi_pertumbuhan > 80 ? "High Potential" : "Normal"}</p>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center text-[0.65rem] text-[#D2C3BD] mb-2 italic">
                            <span>Optimal growth detected for thick texture styles.</span>
                            <span className="font-bold text-[#8A9A5B]">{clamp(data.potensi_pertumbuhan)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#1C0D0D] rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-[#8A9A5B]"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${clamp(data.potensi_pertumbuhan)}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className={`mt-12 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                  <h2 className="text-[0.75rem] uppercase tracking-[0.3em] text-[#A68A82] mb-8 font-bold flex items-center gap-3">
                    BARBER INSTRUCTIONS
                  </h2>
                  {!activeFeatures.includes("BARBER_INSTRUCTIONS") ? (
                    <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm p-12 flex flex-col items-center justify-center opacity-50">
                      <Info className="w-10 h-10 text-[#C59B8F]/30 mb-4" />
                      <p className="text-xs text-[#D2C3BD] uppercase tracking-widest font-bold">Feature Locked</p>
                    </div>
                  ) : (
                    <div className="bg-[#2A1616] border border-[#3A1E1E] rounded-sm p-8">
                      {data.instruksi_barber_detail ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                          {[
                            { label: "Cutting Technique", val: data.instruksi_barber_detail.teknik_potong, icon: <Scissors className="w-3 h-3" /> },
                            { label: "Side Length", val: data.instruksi_barber_detail.panjang_sisi, icon: <div className="w-3 h-px bg-current"></div> },
                            { label: "Top Length", val: data.instruksi_barber_detail.panjang_atas, icon: <ArrowUp className="w-3 h-3" /> },
                            { label: "Finishing", val: data.instruksi_barber_detail.teknik_finishing, icon: <Sparkles className="w-3 h-3" /> },
                            { label: "Product Guide", val: data.instruksi_barber_detail.produk_saran, icon: <Check className="w-3 h-3" /> },
                            { label: "Est. Time", val: data.instruksi_barber_detail.estimasi_waktu, icon: <Clock className="w-3 h-3" /> },
                          ].map((item, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, delay: 0.1 * i }}
                              className="bg-[#1C0D0D] border border-[#3A1E1E] rounded-sm p-4 hover:border-[#C59B8F]/30 transition-all group/inst"
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <div className="text-[#C59B8F] group-hover/inst:scale-110 transition-transform">{item.icon}</div>
                                <p className="text-[0.6rem] text-[#A68A82] uppercase tracking-[0.15em] font-bold">{item.label}</p>
                              </div>
                              <p className="text-[0.75rem] text-[#F3E8DE] leading-relaxed font-medium">{item.val || "-"}</p>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[0.8rem] text-[#D2C3BD] leading-relaxed italic border-l-2 border-[#C59B8F] pl-6 py-2">
                          {data.instruksi_barber || "Present these results to your barber for the most accurate implementation of your recommended style."}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>

                {activeFeatures.includes("HISTORY") && historyItems.length > 0 && (
                  <div className="mt-12 border-t border-[#3A1E1E]">
                    <h2 className="text-[0.75rem] uppercase tracking-[0.3em] text-[#A68A82] mb-10 font-bold flex items-center gap-3">
                      SCANNING HISTORY
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {historyItems.slice(0, 4).map((item, i) => {
                        const result = item.hasil_analisis || {};
                        let historyAiUrl = null;
                        if (item.url_hasil_img) {
                          try {
                            const p = typeof item.url_hasil_img === 'string' ? JSON.parse(item.url_hasil_img) : item.url_hasil_img;
                            if (Array.isArray(p) && p.length > 0) historyAiUrl = p[0];
                          } catch (e) { }
                        }

                        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace("/api/v1", "");
                        const getHistoryImg = (url) => {
                          if (!url) return null;
                          if (url.startsWith("http") || url.startsWith("data:")) return url;
                          return `${baseUrl}${url}`;
                        };

                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            onClick={() => {
                              let activeFeaturesUsed = activeFeatures; // Fallback to current
                              if (item.features_used) {
                                try {
                                  activeFeaturesUsed = typeof item.features_used === 'string'
                                    ? JSON.parse(item.features_used)
                                    : item.features_used;
                                } catch (e) { }
                              }

                              const formatted = {
                                hasil_analisis: item.hasil_analisis,
                                url_foto_upload: getHistoryImg(item.url_foto_upload),
                                url_hasil_img: Array.isArray(item.url_hasil_img)
                                  ? item.url_hasil_img.map(u => getHistoryImg(u))
                                  : item.url_hasil_img ? [getHistoryImg(item.url_hasil_img)] : [],
                                tgl_generate: item.tgl_generate,
                                active_features: activeFeaturesUsed
                              };
                              sessionStorage.setItem("aiAnalysisResult", JSON.stringify(formatted));
                              loadData();
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex gap-5 p-5 border border-[#3A1E1E] bg-[#1C0D0D] rounded-sm group/history hover:border-[#C59B8F]/40 transition-all cursor-pointer"
                          >
                            <div className="relative w-24 h-24 shrink-0 overflow-hidden bg-[#2A1616]">
                              <img
                                src={getHistoryImg(item.url_foto_upload)}
                                alt="Scan"
                                className="object-cover w-full h-full opacity-40 group-hover/history:scale-110 transition-transform duration-700"
                              />
                              {historyAiUrl && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                                  <span className="text-[0.45rem] font-bold text-[#C59B8F] uppercase tracking-tighter">AI Result Saved</span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col justify-center">
                              <div className="flex items-center gap-2 mb-1.5">
                                <Clock className="w-3 h-3 text-[#A68A82]" />
                                <span className="text-[0.6rem] text-[#A68A82] font-bold uppercase tracking-widest">
                                  {new Date(item.tgl_generate).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                              <h4 className="text-sm text-[#F3E8DE] font-serif font-medium mb-2 group-hover/history:text-[#C59B8F] transition-colors">{result.rekomendasi_gaya?.[0]?.nama_gaya || "Analysis"}</h4>
                              <div className="flex gap-4">
                                <div className="flex flex-col">
                                  <span className="text-[0.5rem] uppercase text-[#A68A82]">Match</span>
                                  <span className="text-[0.65rem] text-[#F3E8DE] font-bold">
                                    <CountUp value={result.rekomendasi_gaya?.[0]?.match_score || 0} delay={0.3} />
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[0.5rem] uppercase text-[#A68A82]">Face</span>
                                  <span className="text-[0.65rem] text-[#F3E8DE] font-bold">{result.bentuk_wajah || "-"}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            </div>

            <div className="pt-10 text-center border-t border-[#3A1E1E]/50">
              <p className="text-[0.6rem] text-[#A68A82] tracking-[0.4em] uppercase font-bold opacity-40">© 2026 HAIR AI STYLIST • POWERED BY TELKOM UNIVERSITY</p>
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
          100% { transform: translateY(600px); opacity: 0; }
        }
        .animate-scan-line {
          animation: scan-line 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </main>
  );
}