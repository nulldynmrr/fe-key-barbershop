"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Sparkles, Check, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const analysisSteps = [
  {
    id: "billingNode",
    label: "Cek koin dulu yah",
  },
  {
    id: "llmNode",
    label: "Ngulik struktur wajah",
  },
  {
    id: "imageGenNode",
    label: "Milihin hairstyle yang paling kece!",
  },
  {
    id: "dbTransactionNode",
    label: "Siapin hasil rekomendasi terbaik",
  },
];

const stepDetails = {
  billingNode: {
    title: "Mengecek Akses...",
    desc: "Sedang memverifikasi koin dan paket langganan Anda untuk memulai analisis premium."
  },
  llmNode: {
    title: "Analisis Struktur Wajah...",
    desc: "AI kami sedang memetakan titik-titik landmark wajah Anda untuk menentukan proporsi yang ideal."
  },
  imageGenNode: {
    title: "Kurasi Gaya Rambut...",
    desc: "Mencocokkan struktur tulang dan fitur wajah Anda dengan ribuan referensi gaya rambut artisanal."
  },
  dbTransactionNode: {
    title: "Finalisasi Hasil...",
    desc: "Menyusun rekomendasi personal dan instruksi khusus barber untuk hasil potongan terbaik.",
    substeps: [
      "Mengamankan data hasil analisis...",
      "Sinkronisasi saldo koin terbaru...",
      "Menyiapkan galeri gaya rambut...",
      "Menyusun instruksi khusus barber..."
    ]
  }
};

export default function AILoadingModal({ isOpen, onClose, onComplete, currentStatus = "" }) {
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [substepIndex, setSubstepIndex] = useState(0);
  const [dots, setDots] = useState(".");

  // Cycle dots animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? "." : prev + "."));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  const currentDetail = stepDetails[currentStatus] || {
    title: "Memulai Analisis...",
    desc: "Menyiapkan mesin AI Stylist untuk menganalisis foto Anda secara mendalam."
  };

  // Cycle substeps for the last node to reduce "badmood"
  useEffect(() => {
    if (currentStatus === "dbTransactionNode" && currentDetail.substeps) {
      const interval = setInterval(() => {
        setSubstepIndex(prev => (prev + 1) % currentDetail.substeps.length);
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setSubstepIndex(0);
    }
  }, [currentStatus, currentDetail.substeps]);

  useEffect(() => {
    if (!isOpen) {
      setActiveStepIndex(-1);
      return;
    }

    const index = analysisSteps.findIndex(s => s.id === currentStatus);
    if (index !== -1) {
      setActiveStepIndex(index);

      // Auto complete trigger if last step
      if (currentStatus === "dbTransactionNode") {
        const timer = setTimeout(() => {
          onComplete?.();
        }, 3000); // Beri waktu user baca step terakhir
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, currentStatus, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md border border-[#d8c8bc] bg-[#F8F3EE] p-8 pt-4 shadow-2xl">
        <div className="w-full border-b border-[#D7C2C0]/30 pb-4 mb-8">
          {/* Close Button */}
          <button onClick={onClose} className="absolute right-6 top-3 flex h-8 w-8 items-center justify-center rounded text-[#8b6f66] transition hover:bg-[#ede8e0]" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>

          {/* Title */}
          <div className="mb-4 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-[#c57e7b]" />
            <h2 className="text-md uppercase  text-[#4a1a1a]" style={{ fontFamily: "var(--font-noto-serif)" }}>
              AI Stylist Analysis
            </h2>
          </div>
        </div>

        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative m-5">
            {/* blurred glow behind the box - keeps border visible */}
            <div className="absolute -inset-2 rounded-3xl blur-2xl bg-[#934B19]/10" aria-hidden="true" />

            <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl border-4 border-[#422522] bg-[#934B19]/5 shadow-[#934B19] shadow-2xl/10 z-10">
              <Image src="/images/key.png" alt="Key illustration" width={30} height={30} className="object-contain" />
            </div>
          </div>
        </div>

        {/* Status Text - Dynamic */}
        <div className="mb-8 text-center min-h-[140px] flex flex-col justify-center">
          <h3 className="text-xl text-[#2b1d19]" style={{ fontFamily: "var(--font-noto-serif)" }}>
            {currentDetail.title}
          </h3>
          <div className="mt-3 min-h-[60px] flex items-center justify-center">
            {currentStatus === "dbTransactionNode" && currentDetail.substeps ? (
              <div className="flex items-center gap-2 text-[#c57e7b] font-bold text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c57e7b] animate-pulse" />
                {currentDetail.substeps[substepIndex]}
              </div>
            ) : (
              <p className="text-sm leading-6 text-[#6e5851]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                {currentDetail.desc}
              </p>
            )}
          </div>
        </div>

        <div className="mb-8 space-y-4">
          {analysisSteps.map((step, index) => {
            const isCompleted = index < activeStepIndex;
            const isCurrent = index === activeStepIndex;

            if (index > activeStepIndex) return null;

            return (
              <div key={step.id} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex h-4 w-4 items-center justify-center rounded-full bg-[#c57e7b]"
                    >
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </motion.div>
                  ) : isCurrent ? (
                    <div className="animate-pulse">
                      <Circle className="h-4 w-4 fill-[#4a1a1a] text-[#4a1a1a]" />
                    </div>
                  ) : (
                    <Circle className="h-4 w-4 text-[#d8c8bc]" />
                  )}
                </div>
                <div className="relative overflow-hidden flex-1">
                  <motion.span
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className={`text-sm tracking-wide relative z-10 block ${
                      isCurrent ? "font-bold text-[#4a1a1a]" : isCompleted ? "text-[#4a1a1a]" : "text-[#c0b5ad]"
                    }`}
                    style={{ fontFamily: "var(--font-be-vietnam)" }}
                  >
                    {step.label}
                    {isCurrent && (
                      <span className="inline-block min-w-[20px] ml-1 font-bold text-[#c57e7b]">
                        {dots}
                      </span>
                    )}
                  </motion.span>

                  {/* Shimmer / Glint Overlay */}
                  {isCurrent && (
                    <motion.div
                      initial={{ x: "-150%" }}
                      animate={{ x: "200%" }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear",
                        repeatDelay: 0.5
                      }}
                      className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Indicator Dots */}
        <div className="flex justify-center gap-2">
          {analysisSteps.map((_, index) => (
            <div key={index} className={`h-2 w-2 rounded-full transition-all ${index < activeStepIndex ? "bg-[#c57e7b]" : index === activeStepIndex ? "bg-[#4a1a1a]" : "bg-[#d8c8bc]"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
