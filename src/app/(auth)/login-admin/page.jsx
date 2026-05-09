"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";
import api from "@/utils/request";

export default function LoginAdminPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post(
        "/auth/admin/login",
        { email, password },
        {},
        true,
      );
      const data = res.data;

      if (!data.success) {
        setError(
          data.message || "Login gagal. Periksa email dan password Anda.",
        );
        return;
      }

      Cookies.set("admin_token", data.token, { expires: 1 });
      localStorage.setItem("admin", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message;
      setError(
        msg ||
          "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.",
      );
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
          <div className="w-16 h-16 relative mb-5 flex justify-center">
            <Image
              src="/images/logo.png"
              alt="Key Barber Logo"
              width={64}
              height={64}
              className="object-contain"
            />
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
            Admin Login
          </h2>
          <p
            className="text-sm text-[#524342] leading-relaxed px-4"
            style={{ fontFamily: "lato" }}
          >
            Sign in to access the Key Barber
            <br /> administrative dashboard.
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
          <div className="mb-6">
            <label
              className="block text-[10px] font-normal text-[#201A1A] uppercase tracking-[0.2em] mb-2"
              style={{ fontFamily: "var(--font-be-vietnam)" }}
            >
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pb-2 border-b border-[#e6d1c7] bg-transparent focus:border-[#4a1a1a] focus:outline-none transition-colors text-sm placeholder:text-[#d8c8bc] text-[#2b1d19]"
              style={{ fontFamily: "var(--font-plus-jakarta)" }}
            />
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <label
                className="block text-[10px] font-normal text-[#201A1A] uppercase tracking-[0.2em]"
                style={{ fontFamily: "var(--font-be-vietnam)" }}
              >
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full pb-2 pr-8 border-b border-[#e6d1c7] bg-transparent focus:border-[#4a1a1a] focus:outline-none transition-colors text-sm placeholder:text-[#d8c8bc] placeholder:text-sm placeholder:tracking-normal text-[#2b1d19] ${showPassword ? "tracking-normal" : "tracking-widest"}`}
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-2 text-[#8b6f66] hover:text-[#4a1a1a] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4a1a1a] hover:bg-[#2b1d19] disabled:opacity-50 disabled:cursor-not-allowed text-[#fbf7f3] py-4 rounded-md text-xs font-semibold tracking-[0.3em] uppercase transition-colors shadow-sm"
            style={{ fontFamily: "var(--font-be-vietnam)" }}
          >
            {loading ? "Signing In..." : "Sign In Admin"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p
            className="text-xs text-[#4C2222] mb-6"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            <Link
              href="/login"
              className="font-semibold text-[#4C2222] hover:text-[#4a1a1a] underline underline-offset-4 transition-colors"
              style={{ fontFamily: "var(--font-be-vietnam)" }}
            >
              BACK TO USER LOGIN
            </Link>
          </p>
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
