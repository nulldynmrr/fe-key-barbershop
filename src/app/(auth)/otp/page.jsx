"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import api, { saveUserAuth } from "@/utils/request";

function OTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes count down
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Allow only one character
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if there's a value
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on Backspace
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    if (/^\d{1,6}$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      // Focus on the next empty input or the last one
      const focusIndex = Math.min(pastedData.length, 5);
      if (inputRefs.current[focusIndex]) {
        inputRefs.current[focusIndex].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    
    if (otpValue.length < 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-otp", { email: emailParam, otp: otpValue }, {}, true);
      const data = res.data;

      if (!data.success) {
        setError(data.message || "Kode OTP salah atau kadaluarsa.");
        return;
      }

      const fromParam = searchParams.get("from");
      if (fromParam === "register") {
        router.push("/login?verified=true");
      } else {
        // Save auth and navigate to home on success
        const { data: authData } = data;
        saveUserAuth(authData.token, authData.user);
        router.push("/home");
      }

    } catch (err) {
      const msg = err?.response?.data?.message;
      setError(msg || "Kode OTP tidak valid. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!emailParam || resending) return;
    
    setError("");
    setResending(true);
    // Set timer immediately to 300 to prevent rapid clicks during the request
    setTimeLeft(300);

    try {
      await api.post("/auth/request-otp", { email: emailParam }, {}, true);
    } catch (err) {
      const msg = err?.response?.data?.message;
      setError(msg || "Gagal mengirim ulang kode. Silakan coba lagi.");
      // Reset timer if it fails so they can try again
      setTimeLeft(0);
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <div className="flex w-full min-h-screen items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 border-[40px] border-[#f0e2d9] rounded-full opacity-50 blur-sm pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] border-[60px] border-[#f0e2d9] rounded-full opacity-50 blur-sm pointer-events-none"></div>
      <div className="absolute bottom-10 right-20 w-16 h-16 bg-[#f0e2d9] rounded-full opacity-50 blur-sm pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#ffffff] p-8 sm:p-12 rounded-[8px] shadow-[0_20px_60px_-15px_rgba(74,26,26,0.05)] relative z-10 text-[#2B1D19]">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 relative mb-6">
            <Image
              src="/images/logo.png"
              alt="Key Barber Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-[#4a1a1a] text-[15px] tracking-[0.35em] uppercase mb-2 font-bold" style={{ fontFamily: "var(--font-playfair)" }}>Key Barber</h1>
          <div className="flex items-center gap-3 w-full">
            <div className="h-[1px] grow bg-[#e6d1c7]/50"></div>
            <p className="text-[8px] tracking-[0.3em] text-[#8b6f66] font-medium uppercase whitespace-nowrap" style={{ fontFamily: "var(--font-be-vietnam)" }}>Established in Tradition</p>
            <div className="h-[1px] grow bg-[#e6d1c7]/50"></div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2
            className="text-2xl text-[#2b1d19] mb-3"
            style={{ fontFamily: "var(--font-noto-serif)" }}
          >
            Verify Your Identity
          </h2>
          <p
            className="text-xs text-[#524342] leading-relaxed px-2"
            style={{ fontFamily: "lato" }}
          >
            We have sent a 6-digit code to your email.
            <br /> Please enter it below to continue
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
          <div className="flex justify-between items-center gap-2 sm:gap-4 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-10 h-12 sm:w-12 sm:h-14 border-b-2 border-[#e6d1c7] bg-transparent focus:border-[#4a1a1a] focus:outline-none text-center text-xl font-medium transition-colors text-[#2b1d19]"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4a1a1a] hover:bg-[#2b1d19] disabled:opacity-50 disabled:cursor-not-allowed text-[#fbf7f3] py-4 rounded-md text-xs font-semibold tracking-[0.3em] uppercase transition-colors shadow-sm mb-8"
            style={{ fontFamily: "var(--font-be-vietnam)" }}
          >
            {loading ? "Verifying..." : "Verify Code"}
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
          <p
            className="text-[10px] text-[#524342] mb-1"
            style={{ fontFamily: "var(--font-be-vietnam)" }}
          >
            Didn't receive the message?
          </p>
          <button
            type="button"
            disabled={timeLeft > 0 || resending}
            onClick={handleResendOTP}
            className={`text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors block mx-auto mb-4 ${
              (timeLeft > 0 || resending) ? "text-[#a89c97] cursor-not-allowed" : "text-[#4C2222] hover:text-[#4a1a1a]"
            }`}
            style={{ fontFamily: "var(--font-be-vietnam)" }}
          >
            {resending ? "SENDING..." : `RESEND CODE ${timeLeft > 0 ? `(${formatTime(timeLeft)})` : ""}`}
          </button>

          <Link
            href="/registration"
            className="text-[10px] font-bold text-[#8b6f66] hover:text-[#4a1a1a] uppercase tracking-widest underline underline-offset-4 transition-colors"
            style={{ fontFamily: "var(--font-be-vietnam)" }}
          >
            Wrong Email? Change Address
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

export default function OTPPage() {
  return (
    <Suspense fallback={<div className="flex w-full min-h-screen items-center justify-center">Loading...</div>}>
      <OTPForm />
    </Suspense>
  );
}
