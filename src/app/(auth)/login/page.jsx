"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="flex w-full min-h-screen items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 border-[40px] border-[#f0e2d9] rounded-full opacity-50 blur-sm pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] border-[60px] border-[#f0e2d9] rounded-full opacity-50 blur-sm pointer-events-none"></div>
            <div className="absolute bottom-10 right-20 w-16 h-16 bg-[#f0e2d9] rounded-full opacity-50 blur-sm pointer-events-none"></div>

            <div className="w-full max-w-md bg-[#ffffff] p-8 sm:p-12 rounded-[8px] shadow-[0_20px_60px_-15px_rgba(74,26,26,0.05)] relative z-10 text-[#2B1D19]">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 relative mb-5 flex justify-center">
                        <Image src="/images/logo.png" alt="Key Barber Logo" width={64} height={64} className="object-contain" />
                    </div>
                    <h1 className="text-[#4a1a1a] text-lg tracking-[0.15em] uppercase mb-1" style={{ fontFamily: "var(--font-playfair)" }}>Key Barber</h1>
                    <p className="text-[9px] tracking-[0.25em] text-[#8b6f66] font-normal uppercase" style={{ fontFamily: "var(--font-be-vietnam)" }}>Established in Tradition</p>
                </div>

                {/* Welcome Section */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl text-[#2b1d19] mb-3" style={{ fontFamily: "var(--font-noto-serif)" }}>Welcome to Key Barber</h2>
                    <p className="text-sm text-[#524342] leading-relaxed px-4" style={{ fontFamily: "lato" }}>
                        Sign in to access the AI hairstyle
                        <br /> recommendation feature.
                    </p>
                </div>

                {/* Google Button */}
                <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[#e6d1c7] bg-white rounded-md hover:bg-[#ede8e0] transition-colors mb-6">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="text-xs font-semibold text-[#4a1a1a] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-be-vietnam)" }}>Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="relative flex items-center mb-6">
                    <div className="flex-grow border-t border-[#e6d1c7]"></div>
                    <span className="flex-shrink-0 mx-4 text-[10px] text-[#8b6f66] font-normal tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-be-vietnam)" }}>OR</span>
                    <div className="flex-grow border-t border-[#e6d1c7]"></div>
                </div>

                {/* Form */}
                <form>
                    <div className="mb-6">
                        <label className="block text-[10px] font-normal text-[#201A1A] uppercase tracking-[0.2em] mb-2" style={{ fontFamily: "var(--font-be-vietnam)" }}>Email Address</label>
                        <input type="email" placeholder="Enter your email" className="w-full pb-2 border-b border-[#e6d1c7] bg-transparent focus:border-[#4a1a1a] focus:outline-none transition-colors text-sm placeholder:text-[#d8c8bc] text-[#2b1d19]" style={{ fontFamily: "var(--font-plus-jakarta)" }} />
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-[10px] font-normal text-[#201A1A] uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-be-vietnam)" }}>Password</label>
                            <Link href="#" className="text-[10px] font-normal text-[#c57e7b] hover:text-[#4a1a1a] tracking-[0.2em] uppercase transition-colors" style={{ fontFamily: "var(--font-be-vietnam)" }}>
                                FORGOT?
                            </Link>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter Password"
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

                    <button type="submit" className="w-full bg-[#4a1a1a] hover:bg-[#2b1d19] text-[#fbf7f3] py-4 rounded-md text-xs font-semibold tracking-[0.3em] uppercase transition-colors shadow-sm" style={{ fontFamily: "var(--font-be-vietnam)" }}>
                        Sign In
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-[#4C2222] mb-6" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                        Don't have an account?{" "}
                        <Link href="/registration" className="font-semibold text-[#4C2222] hover:text-[#4a1a1a] underline underline-offset-4 transition-colors" style={{ fontFamily: "var(--font-be-vietnam)" }}>
                            SIGN UP
                        </Link>
                    </p>
                    <p className="text-[9px] text-[#8b6f66] leading-[1.6] italic max-w-[280px] mx-auto" style={{ fontFamily: "var(--font-be-vietnam)" }}>By signing in, you agree to our Terms of Service and Privacy Policy concerning AI processing.</p>
                </div>
            </div>

            {/* Absolute Footer */}
            <div className="absolute bottom-6 w-full text-center text-[10px] font-bold tracking-[0.42em] uppercase text-[#8b6f66] z-0" style={{ fontFamily: "var(--font-be-vietnam)" }}>© 2026 KEY BARBER</div>
        </div>
    );
}
