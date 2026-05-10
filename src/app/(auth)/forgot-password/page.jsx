"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/utils/request";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email }, {}, true);
      const data = res.data;
      
      if (!data.success) {
        setError(data.message || "Gagal mengirim link reset password.");
        return;
      }
      
      // Navigate to OTP page on success
      router.push("/otp?email=" + encodeURIComponent(email));
    } catch (err) {
      const msg = err?.response?.data?.message;
      setError(msg || "Gagal mengirim link reset password. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 border-[40px] border-[#f0e2d9] rounded-full opacity-50 blur-sm pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] border-[60px] border-[#f0e2d9] rounded-full opacity-50 blur-sm pointer-events-none"></div>
      <div className="absolute bottom-10 right-20 w-16 h-16 bg-[#f0e2d9] rounded-full opacity-50 blur-sm pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#ffffff] p-8 sm:p-12 rounded-[8px] shadow-[0_20px_60px_-15px_rgba(74,26,26,0.05)] relative z-10 text-[#2B1D19]">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-4 mb-6 w-full">
            <div className="h-px grow bg-[#e6d1c7]"></div>
            <div className="w-10 h-10 relative">
              <Image
                src="/images/key.png"
                alt="Key Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="h-px grow bg-[#e6d1c7]"></div>
          </div>
          <h1
            className="text-[#4a1a1a] text-lg tracking-[0.15em] uppercase mb-1"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Key Barber
          </h1>
          <p
            className="text-[9px] tracking-[0.25em] text-[#8b6f66] font-normal uppercase"
            style={{ fontFamily: "var(--font-be-vietnam)" }}
          >
            Established in Tradition
          </p>
        </div>

        <div className="text-center mb-8">
          <h2
            className="text-2xl text-[#2b1d19] mb-3"
            style={{ fontFamily: "var(--font-noto-serif)" }}
          >
            Forgot Password
          </h2>
          <p
            className="text-xs text-[#524342] leading-relaxed px-2"
            style={{ fontFamily: "lato" }}
          >
            Enter your email address and we'll send you
            <br /> a link to reset your password
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p
              className="text-xs text-red-600 text-center"
              style={{ fontFamily: "var(--font-be-vietnam)" }}
            >
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label
              className="block text-[10px] font-normal text-[#201A1A] uppercase tracking-[0.2em] mb-2"
              style={{ fontFamily: "var(--font-be-vietnam)" }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pb-2 border-b border-[#e6d1c7] bg-transparent focus:border-[#4a1a1a] focus:outline-none transition-colors text-sm text-[#2b1d19]"
              style={{ fontFamily: "var(--font-plus-jakarta)" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4a1a1a] hover:bg-[#2b1d19] disabled:opacity-50 disabled:cursor-not-allowed text-[#fbf7f3] py-4 rounded-md text-xs font-semibold tracking-[0.3em] uppercase transition-colors shadow-sm mb-8"
            style={{ fontFamily: "var(--font-be-vietnam)" }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 border-t border-[#e6d1c7]"></div>
          <div className="mx-4 w-5 h-5 relative">
            <Image
              src="/images/key.png"
              alt="Key Icon"
              fill
              className="object-contain opacity-60"
            />
          </div>
          <div className="w-16 border-t border-[#e6d1c7]"></div>
        </div>

        <div className="text-center">
          <Link
            href="/login"
            className="text-[10px] font-semibold text-[#4C2222] hover:text-[#4a1a1a] uppercase tracking-[0.1em] transition-colors"
            style={{ fontFamily: "var(--font-be-vietnam)" }}
          >
            RETURN TO LOGIN
          </Link>
        </div>
      </div>

      <div
        className="absolute bottom-6 w-full text-center text-[10px] font-bold tracking-[0.42em] uppercase text-[#8b6f66] z-0"
        style={{ fontFamily: "var(--font-be-vietnam)" }}
      >
        © 2026 KEY BARBER
      </div>
    </div>
  );
}
