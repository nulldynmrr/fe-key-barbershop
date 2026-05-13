"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

export default function AICreditExhaustedModal({ 
  isOpen, 
  onClose, 
  loginHref = "/registration", 
  pricingHref = "/service#ai-pricing" 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2b1d19]/60 backdrop-blur-sm px-4 py-6">
      <div className="relative w-full max-w-xl bg-[#fdfbf9] p-10 md:p-16 shadow-[0_20px_50px_rgba(43,29,25,0.2)]">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute right-6 top-6 text-[#8b6f66] transition hover:scale-110" 
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col items-center">
          {/* Icon Container */}
          <div className="relative mb-10">
            <div className="flex h-32 w-32 items-center justify-center rounded-[32px] border border-[#efe2d7] bg-white shadow-[0_10px_30px_-10px_rgba(43,29,25,0.1)]">
              <Image 
                src="/images/logo.png" 
                alt="Key Barber Logo" 
                width={40} 
                height={40} 
                className="object-contain opacity-90" 
              />
            </div>
          </div>

          {/* Subtle Divider */}
          <div className="mb-8 h-px w-8 bg-[#efe2d7]/60" />

          {/* Content */}
          <div className="text-center">
            <h3 
              className="text-4xl md:text-5xl text-[#2b1d19] mb-4 tracking-tight" 
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              The Ritual Continues
            </h3>
            
            <p 
              className="text-lg md:text-xl text-[#c57e7b] mb-6 font-medium italic"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Your complimentary simulations have concluded.
            </p>

            <p 
              className="max-w-md mx-auto text-sm leading-relaxed text-[#8b6f66] mb-8"
              style={{ fontFamily: "var(--font-plus-jakarta)" }}
            >
              Log in to your account to top up your credits and continue your journey with our artisanal AI styling suite.
            </p>
          </div>

          {/* Subtle Divider */}
          <div className="mb-10 h-px w-8 bg-[#efe2d7]/60" />

          {/* Actions */}
          <div className="w-full space-y-4">
            <Link
              href={loginHref}
              className="flex w-full items-center justify-center bg-[#4a1a1a] px-8 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#fbf7f3] transition hover:bg-[#2b1d19]"
              style={{ fontFamily: "var(--font-be-vietnam)" }}
            >
              Sign In / Log In
            </Link>

            <Link
              href={pricingHref}
              onClick={onClose}
              className="flex w-full items-center justify-center border border-[#efe2d7] bg-white px-8 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#4a1a1a] transition hover:bg-[#fdfbf9]"
              style={{ fontFamily: "var(--font-be-vietnam)" }}
            >
              View Pricing Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
