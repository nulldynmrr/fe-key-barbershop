"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, ChevronRight, Share2, Download } from "lucide-react";
import SiteNavbar from "../../../../components/SiteNavbar";
import SiteFooter from "../../../../components/SiteFooter";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "Master's Collection";
  const price = searchParams.get("price") || "Rp 550.000";
  const tier = searchParams.get("tier") || "Premium Member";
  const method = searchParams.get("method") || "Digital Wallet (OVO)";

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:px-10 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-[10px] tracking-[0.4em] uppercase text-[#8b6f66] mb-4">Checkout</p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl text-[#3a221c] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>Finalize Your Ritual</h1>
        <p className="max-w-2xl mx-auto text-sm text-[#5f463d] leading-relaxed">Complete your payment to secure your artisanal grooming session at Key Barber.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 mb-16 text-[10px] sm:text-xs tracking-[0.25em] uppercase font-semibold">
        <div className="flex items-center gap-3 text-[#8b6f66]/50">
          <span className="w-6 h-6 rounded-full border border-[#8b6f66]/30 flex items-center justify-center text-[8px] font-bold">01</span>
          <span>Payment Method</span>
        </div>
        <div className="h-px w-12 sm:w-20 bg-[#e6d1c7]"></div>
        <div className="flex items-center gap-3 text-[#8b6f66]/50">
          <span className="w-6 h-6 rounded-full border border-[#8b6f66]/30 flex items-center justify-center text-[8px] font-bold">02</span>
          <span>Processing</span>
        </div>
        <div className="h-px w-12 sm:w-20 bg-[#3a221c]"></div>
        <div className="flex items-center gap-3 text-[#3a221c]">
          <span className="w-6 h-6 rounded-full border border-[#3a221c] flex items-center justify-center text-[8px] font-bold">03</span>
          <span>Confirmation</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[0.4fr_0.6fr] gap-12 items-start">
        {/* Left Panel: Reservation Details */}
        <div className="bg-[#ede8e0]/80 backdrop-blur-sm border border-[#e6d1c7] p-8 sm:p-10 rounded-sm shadow-xl opacity-60">
          <h2 className="text-2xl text-[#3a221c] mb-8" style={{ fontFamily: "var(--font-playfair)" }}>Reservation Details</h2>
          <div className="space-y-6">
            <div className="flex justify-between items-start pt-6 border-t border-[#e6d1c7]/50">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#8b6f66]">Service</span>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#3a221c]">{plan}</p>
                <p className="text-[10px] text-[#8b6f66] mt-1">{tier}</p>
              </div>
            </div>
            <div className="flex justify-between items-center py-6 border-t border-[#e6d1c7]/50">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#8b6f66]">Date & Time</span>
              <span className="text-sm font-semibold text-[#3a221c]">Oct 24, 2025 • 14:00</span>
            </div>
            <div className="pt-8 border-t border-[#3a221c]/20">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#8b6f66]">Total Amount</span>
              <p className="text-3xl text-[#3a221c] mt-2" style={{ fontFamily: "var(--font-playfair)" }}>{price}</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Success Card */}
        <div className="bg-[#ede8e0] border border-[#e6d1c7] p-10 sm:p-16 rounded-sm shadow-2xl relative animate-fade-up">
           <div className="absolute top-10 right-10 flex gap-4">
              <button className="p-2 border border-[#e6d1c7] hover:bg-white/50 transition-colors rounded-sm"><Share2 className="w-4 h-4 text-[#8b6f66]" /></button>
              <button className="p-2 border border-[#e6d1c7] hover:bg-white/50 transition-colors rounded-sm"><Download className="w-4 h-4 text-[#8b6f66]" /></button>
           </div>

           <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#3a221c] rounded-2xl flex items-center justify-center mb-8 shadow-[0_20px_40px_rgba(58,34,28,0.2)] animate-fade-in">
                <Check className="w-10 h-10 text-[#f8f1ea]" strokeWidth={3} />
              </div>
              
              <h2 className="text-4xl sm:text-5xl text-[#3a221c] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>Payment Successful</h2>
              <p className="text-sm text-[#5f463d] leading-relaxed max-w-md mx-auto mb-8">
                Your appointment is confirmed. We look forward to providing you with the ultimate grooming ritual.
              </p>
              
              <div className="bg-white/50 border border-[#e6d1c7] px-6 py-3 rounded-sm mb-12 flex items-center gap-3">
                 <div className="w-4 h-4 relative"><Image src="/images/key.png" alt="Key" fill className="object-contain" /></div>
                 <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#3a221c]">Unlimited Style Exploration</span>
              </div>
              
              <div className="w-full space-y-4 mb-12">
                 {[
                   { label: "Order ID", val: "KB-99284-BDO" },
                   { label: "Amount Paid", val: price },
                   { label: "Payment Method", val: method },
                   { label: "Date & Time", val: "Oct 24, 2025 • 14:30 PM" },
                 ].map((item, idx) => (
                   <div key={idx} className="flex justify-between items-center py-4 border-b border-[#e6d1c7]/50 text-[10px] sm:text-xs">
                      <span className="tracking-[0.1em] uppercase text-[#8b6f66]">{item.label}</span>
                      <span className="font-bold text-[#3a221c]">{item.val}</span>
                   </div>
                 ))}
              </div>
              
              <Link href="/home" className="w-full py-5 bg-[#3a221c] text-[#f8f1ea] text-xs font-bold tracking-[0.4em] uppercase transition-all hover:bg-[#1a1110] flex items-center justify-center gap-4 group rounded-sm shadow-lg">
                Return to Home
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-[#E1D5C9] text-[#2B1D19] relative overflow-hidden flex flex-col">
      <SiteNavbar />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] flex items-center justify-center">
          <Image src="/images/logo-transparent.png" alt="Key Pattern" fill className="object-contain" priority />
        </div>
      </div>
      <div className="flex-grow">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-[#3a221c]/20 border-t-[#3a221c] rounded-full animate-spin"></div></div>}>
          <ConfirmationContent />
        </Suspense>
      </div>
      <SiteFooter />
    </main>
  );
}
