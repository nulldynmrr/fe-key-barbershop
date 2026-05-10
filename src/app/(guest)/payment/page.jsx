"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight, QrCode, Landmark, Wallet, Check } from "lucide-react";
import SiteNavbar from "../../../components/SiteNavbar";
import SiteFooter from "../../../components/SiteFooter";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState(null);

  const plan = searchParams.get("plan") || "Master's Collection";
  const price = searchParams.get("price") || "Rp 550.000";
  const tier = searchParams.get("tier") || "Premium Member";

  const handlePayment = () => {
    if (!selectedMethod) return;
    // Navigate to processing with current params
    const params = new URLSearchParams(searchParams);
    params.set("method", selectedMethod);
    router.push(`/payment/processing?${params.toString()}`);
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:px-10 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-[10px] tracking-[0.4em] uppercase text-[#8b6f66] mb-4" style={{ fontFamily: "var(--font-be-vietnam)" }}>
          Checkout
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl text-[#3a221c] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
          Finalize Your Ritual
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#5f463d] leading-relaxed" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
          Complete your payment to secure your artisanal grooming session at Key Barber.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 mb-16 text-[10px] sm:text-xs tracking-[0.25em] uppercase font-semibold">
        <div className="flex items-center gap-3 text-[#3a221c]">
          <span className="w-6 h-6 rounded-full border border-[#3a221c] flex items-center justify-center text-[8px] font-bold">01</span>
          <span>Payment Method</span>
        </div>
        <div className="h-px w-12 sm:w-20 bg-[#e6d1c7]"></div>
        <div className="flex items-center gap-3 text-[#8b6f66]/50">
          <span className="w-6 h-6 rounded-full border border-[#8b6f66]/30 flex items-center justify-center text-[8px] font-bold">02</span>
          <span>Processing</span>
        </div>
        <div className="h-px w-12 sm:w-20 bg-[#e6d1c7]"></div>
        <div className="flex items-center gap-3 text-[#8b6f66]/50">
          <span className="w-6 h-6 rounded-full border border-[#8b6f66]/30 flex items-center justify-center text-[8px] font-bold">03</span>
          <span>Confirmation</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[0.4fr_0.6fr] gap-12 items-start">
        {/* Left Panel: Reservation Details */}
        <div className="bg-[#ede8e0]/80 backdrop-blur-sm border border-[#e6d1c7] p-8 sm:p-10 rounded-sm shadow-[0_30px_60px_-15px_rgba(57,28,22,0.1)] sticky top-32 transition-all hover:shadow-[0_40px_80px_-15px_rgba(57,28,22,0.15)]">
          <h2 className="text-2xl text-[#3a221c] mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
            Reservation Details
          </h2>
          
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
              <p className="text-3xl sm:text-4xl text-[#3a221c] mt-2" style={{ fontFamily: "var(--font-playfair)" }}>
                {price}
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Payment Methods */}
        <div className="space-y-10 pb-20">
          {/* Virtual Account */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-0.5 h-4 bg-[#3a221c]"></div>
              <h3 className="text-[11px] tracking-[0.3em] uppercase font-bold text-[#3a221c]">Virtual Account</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {["Mandiri", "BNI", "BRI", "BCA"].map((bank) => (
                <button 
                  key={bank} 
                  onClick={() => setSelectedMethod(bank)}
                  className={`flex items-center gap-4 border p-5 transition-all duration-300 text-left relative overflow-hidden group ${selectedMethod === bank ? "bg-[#3a221c] border-[#3a221c] text-[#f8f1ea] shadow-lg scale-[1.02]" : "bg-[#ede8e0] border-[#e6d1c7] text-[#3a221c] hover:bg-[#e6d1c7]/50 hover:border-[#3a221c]/30"}`}
                >
                  <Landmark className={`w-5 h-5 ${selectedMethod === bank ? "text-[#f8f1ea]" : "text-[#3a221c]"}`} strokeWidth={1.5} />
                  <span className="text-xs font-semibold tracking-wider">{bank}</span>
                  {selectedMethod === bank && (
                    <div className="absolute top-2 right-2 animate-fade-in">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* QR Code */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-0.5 h-4 bg-[#3a221c]"></div>
              <h3 className="text-[11px] tracking-[0.3em] uppercase font-bold text-[#3a221c]">QR Code</h3>
            </div>
            <button 
              onClick={() => setSelectedMethod("QRIS")}
              className={`w-full flex items-center justify-between border p-5 transition-all duration-300 relative group ${selectedMethod === "QRIS" ? "bg-[#3a221c] border-[#3a221c] text-[#f8f1ea] shadow-lg scale-[1.01]" : "bg-[#ede8e0] border-[#e6d1c7] text-[#3a221c] hover:bg-[#e6d1c7]/50 hover:border-[#3a221c]/30"}`}
            >
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 border flex items-center justify-center transition-colors ${selectedMethod === "QRIS" ? "bg-white/10 border-white/20" : "bg-white border-[#e6d1c7]"}`}>
                  <QrCode className={`w-8 h-8 ${selectedMethod === "QRIS" ? "text-white" : "text-[#3a221c]"}`} strokeWidth={1.2} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold tracking-wider uppercase">QRIS</p>
                  <p className={`text-[10px] mt-1.5 leading-relaxed ${selectedMethod === "QRIS" ? "text-[#f8f1ea]/70" : "text-[#8b6f66]"}`}>Pay with any supported E-Wallet or Mobile Banking</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${selectedMethod === "QRIS" ? "text-white" : "text-[#8b6f66]"}`} />
            </button>
          </section>

          {/* E-Wallet */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-0.5 h-4 bg-[#3a221c]"></div>
              <h3 className="text-[11px] tracking-[0.3em] uppercase font-bold text-[#3a221c]">E-Wallet</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {["OVO", "Dana", "ShopeePay"].map((wallet) => (
                <button 
                  key={wallet} 
                  onClick={() => setSelectedMethod(wallet)}
                  className={`flex flex-col items-center justify-center gap-4 border py-8 px-4 transition-all duration-300 relative overflow-hidden group ${selectedMethod === wallet ? "bg-[#3a221c] border-[#3a221c] text-[#f8f1ea] shadow-lg scale-[1.02]" : "bg-[#ede8e0] border-[#e6d1c7] text-[#3a221c] hover:bg-[#e6d1c7]/50 hover:border-[#3a221c]/30"}`}
                >
                  <Wallet className={`w-6 h-6 ${selectedMethod === wallet ? "text-[#f8f1ea]" : "text-[#3a221c]"}`} strokeWidth={1.5} />
                  <span className="text-[10px] font-bold tracking-widest uppercase">{wallet}</span>
                  {selectedMethod === wallet && (
                    <div className="absolute top-2 right-2 animate-fade-in">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Pay Button */}
          <div className="pt-6">
            <button 
              disabled={!selectedMethod}
              onClick={handlePayment}
              className={`w-full py-6 text-sm font-semibold uppercase tracking-[0.4em] transition-all duration-500 rounded-sm shadow-xl ${selectedMethod ? "bg-[#4a1a1a] text-[#f8f1ea] hover:bg-[#3a221c] hover:scale-[1.02] active:scale-[0.98]" : "bg-[#8b6f66]/20 text-[#8b6f66] cursor-not-allowed"}`}
              style={{ fontFamily: "var(--font-be-vietnam)" }}
            >
              {selectedMethod ? `Complete Transaction` : "Select Payment Method"}
            </button>
            <p className="text-center text-[9px] text-[#8b6f66] mt-4 tracking-wider uppercase opacity-60">
              Secured by Key Barber Payment Gateway
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-[#E1D5C9] text-[#2B1D19] relative overflow-hidden flex flex-col">
      <SiteNavbar />
      
      {/* Background Pattern - Subtle Key Logo */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] flex items-center justify-center">
          <Image
            src="/images/logo-transparent.png"
            alt="Key Pattern"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="flex-grow">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-[#3a221c]/10 border-t-[#3a221c] rounded-full animate-spin"></div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#8b6f66]">Initializing Checkout...</p>
            </div>
          </div>
        }>
          <PaymentContent />
        </Suspense>
      </div>

      <SiteFooter />
    </main>
  );
}
