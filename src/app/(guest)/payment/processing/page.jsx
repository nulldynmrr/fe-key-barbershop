"use client";

import React, { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import SiteNavbar from "../../../../components/SiteNavbar";
import SiteFooter from "../../../../components/SiteFooter";

function ProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dots, setDots] = useState("");

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    const timer = setTimeout(() => {
      // Pass params to confirmation
      router.push(`/payment/confirmation?${searchParams.toString()}`);
    }, 4000);

    return () => {
      clearInterval(dotsInterval);
      clearTimeout(timer);
    };
  }, [router, searchParams]);

  return (
    <div className="flex-grow flex flex-col items-center pt-20 pb-32 relative z-10 px-6 animate-fade-in">
      <div className="text-center mb-12">
        <p className="text-[10px] tracking-[0.4em] uppercase text-[#8b6f66] mb-4">Checkout</p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl text-[#3a221c] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>Finalize Your Ritual</h1>
        <p className="max-w-2xl mx-auto text-sm text-[#5f463d] leading-relaxed">Complete your payment to secure your artisanal grooming session at Key Barber.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 mb-20 text-[10px] sm:text-xs tracking-[0.25em] uppercase font-semibold">
        <div className="flex items-center gap-3 text-[#8b6f66]/50">
          <span className="w-6 h-6 rounded-full border border-[#8b6f66]/30 flex items-center justify-center text-[8px] font-bold">01</span>
          <span>Payment Method</span>
        </div>
        <div className="h-px w-12 sm:w-20 bg-[#3a221c]"></div>
        <div className="flex items-center gap-3 text-[#3a221c]">
          <span className="w-6 h-6 rounded-full border border-[#3a221c] flex items-center justify-center text-[8px] font-bold">02</span>
          <span>Processing</span>
        </div>
        <div className="h-px w-12 sm:w-20 bg-[#e6d1c7]"></div>
        <div className="flex items-center gap-3 text-[#8b6f66]/50">
          <span className="w-6 h-6 rounded-full border border-[#8b6f66]/30 flex items-center justify-center text-[8px] font-bold">03</span>
          <span>Confirmation</span>
        </div>
      </div>

      {/* Processing Card */}
      <div className="w-full max-w-xl bg-[#ede8e0]/90 backdrop-blur-md border border-[#e6d1c7] p-12 sm:p-20 rounded-[40px] shadow-2xl text-center relative overflow-hidden animate-fade-up">
        <div className="flex flex-col items-center">
           <div className="w-16 h-16 relative mb-8 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-[#3a221c]/10 border-t-[#3a221c] rounded-full animate-spin"></div>
              <div className="w-10 h-10 relative">
                <Image src="/images/key.png" alt="Key" fill className="object-contain" />
              </div>
           </div>
           
           <h2 className="text-3xl sm:text-4xl text-[#3a221c] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>Securing Your Ritual{dots}</h2>
           <p className="text-sm text-[#5f463d] leading-relaxed max-w-sm mx-auto mb-10">
             Our artisanal banking gateway is currently validating your selection. Please do not refresh the ritual chamber.
           </p>
           
           <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full bg-[#3a221c] transition-all duration-300 ${dots.length > i ? "opacity-100 scale-125" : "opacity-20 scale-100"}`}></div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <main className="min-h-screen bg-[#E1D5C9] text-[#2B1D19] relative overflow-hidden flex flex-col">
      {/* Top Timer Bar */}
      <div className="bg-[#1a1110] text-[#f8f1ea] py-3 px-6 flex justify-center items-center gap-6 z-50">
        <span className="text-[10px] tracking-[0.3em] uppercase opacity-80">Complete Payment In</span>
        <div className="flex gap-4">
          {[
            { val: "00", label: "Days" },
            { val: "01", label: "Hours" },
            { val: "59", label: "Minutes" },
            { val: "45", label: "Seconds" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="bg-[#3a221c] w-10 h-10 flex items-center justify-center rounded-sm text-sm font-bold border border-white/10">
                {item.val}
              </div>
              <span className="text-[8px] tracking-[0.2em] uppercase opacity-60">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <SiteNavbar />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] flex items-center justify-center">
          <Image src="/images/logo-transparent.png" alt="Key Pattern" fill className="object-contain" priority />
        </div>
      </div>

      <Suspense fallback={<div className="flex-grow flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-[#3a221c]/20 border-t-[#3a221c] rounded-full animate-spin"></div></div>}>
        <ProcessingContent />
      </Suspense>

      <SiteFooter />
    </main>
  );
}
