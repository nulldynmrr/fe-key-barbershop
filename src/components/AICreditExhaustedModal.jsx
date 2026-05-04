"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Sparkles } from "lucide-react";

export default function AICreditExhaustedModal({ isOpen, onClose, loginHref = "/auth/login", pricingHref = "/user/price-list" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="relative w-full max-w-lg border border-[#d8c8bc] bg-[#F8F3EE] p-8 pt-4 shadow-2xl">
        <div className="w-full border-b-1 border-[#D7C2C0]/20">
          {/* Close Button */}
          <button onClick={onClose} className="absolute right-6 top-3 flex h-8 w-8 items-center justify-center rounded text-[#8b6f66] transition hover:bg-[#ede8e0]" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>

          {/* Title */}
          <div className="mb-4 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-[#c57e7b]" />
            <h2 className="text-md uppercase  text-[#4a1a1a]" style={{ fontFamily: "var(--font-noto-serif)" }}>
              Subscription Update
            </h2>
          </div>
        </div>

        <div className="mb-8 mt-8 flex justify-center">
          <div className="relative">
            {/* blurred glow behind the box - keeps border visible */}
            <div className="absolute -inset-2 rounded-3xl blur-2xl bg-[#934B19]/10" aria-hidden="true" />

            <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl border-4 border-[#422522] bg-[#934B19]/5 shadow-[#934B19] shadow-2xl/10 z-10">
              <Image src="/images/key.png" alt="Key illustration" width={30} height={30} className="object-contain" />
            </div>
          </div>
        </div>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 h-px w-10 bg-[#e2d3ca]" />
          <h3 className="text-3xl text-[#4a1a1a]" style={{ fontFamily: "var(--font-noto-serif)" }}>
            The Ritual Continues
          </h3>
          <p className="mt-3 text-lg text-[#b86f3d]" style={{ fontFamily: "var(--font-noto-serif)" }}>
            Your complimentary simulations have concluded.
          </p>
          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#5f514c]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
            Log in to your account to top up your credits and continue your journey with our artisanal AI styling suite.
          </p>
          <div className="mx-auto mt-6 h-px w-10 bg-[#e2d3ca]" />
        </div>

        <div className="space-y-4">
          <Link
            href={pricingHref}
            className="flex w-full items-center justify-center bg-[#5d1818] px-6 py-4 text-xs font-light uppercase tracking-[0.28em] text-[#f7f1ea] transition hover:bg-[#4a1a1a]"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Sign in / Log in
          </Link>

          <button
            onClick={onClose}
            className="flex w-full items-center justify-center border border-[#c8b4aa] bg-transparent px-6 py-4 text-xs font-light uppercase tracking-[0.28em] text-[#4a1a1a] transition hover:bg-[#f0e8df]"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            View Pricing Plan
          </button>
        </div>
      </div>
    </div>
  );
}
