import React from 'react';
import Link from 'next/link';
import { KeyRound } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFBF9] bg-pattern relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
            {/* Background Decorative Elements (optional, if bg-pattern is not enough) */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 border-[40px] border-[#F5EFEA] rounded-full opacity-50 blur-sm pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] border-[60px] border-[#F5EFEA] rounded-full opacity-50 blur-sm pointer-events-none"></div>
            <div className="absolute bottom-10 right-20 w-16 h-16 bg-[#F5EFEA] rounded-full opacity-50 blur-sm pointer-events-none"></div>

            <div className="w-full max-w-md bg-white p-8 sm:p-12 rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative z-10">

                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 relative mb-5">
                        <Image
                            src="/images/logo.png"
                            alt="Key Barber Logo"
                            width={64}
                            height={64}
                            className="object-contain"
                        />
                    </div>
                    <h1 className="font-serif text-[#4C2222] text-lg tracking-[0.15em] uppercase mb-1">
                        Key Barber
                    </h1>
                    <p className="text-[9px] tracking-[0.25em] text-[#857372] font-normal uppercase">
                        Established in Tradition
                    </p>
                </div>

                {/* Welcome Section */}
                <div className="text-center mb-8">
                    <h2 className="font-serif text-2xl text-gray-900 mb-3">
                        Welcome to Key Barber
                    </h2>
                    <p className="text-sm text-[#524342] leading-relaxed px-4">
                        Sign in to access the AI hairstyle<br /> recommendation feature.
                    </p>
                </div>

                {/* Google Button */}
                <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors mb-6">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    <span className="text-xs font-bold text-gray-600 tracking-wide">CONTINUE WITH GOOGLE</span>
                </button>

                {/* Divider */}
                <div className="relative flex items-center mb-6">
                    <div className="flex-grow border-t border-[#857372]"></div>
                    <span className="flex-shrink-0 mx-4 text-[10px] text-[#857372] font-normal tracking-wider">
                        OR
                    </span>
                    <div className="flex-grow border-t border-[#857372]"></div>
                </div>

                {/* Form */}
                <form>
                    <div className="mb-6">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full pb-2 border-b border-gray-200 focus:border-[#4A2C2A] focus:outline-none transition-colors text-sm placeholder:text-gray-300"
                        />
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                Password
                            </label>
                            <Link href="#" className="text-[10px] font-normal text-[#8B4545] hover:text-[#4A2C2A] tracking-wider transition-colors">
                                FORGOT?
                            </Link>
                        </div>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="w-full pb-2 border-b border-gray-200 focus:border-[#4A2C2A] focus:outline-none transition-colors text-xl tracking-widest placeholder:text-gray-300 placeholder:text-sm placeholder:tracking-normal"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#4C2222] hover:bg-[#3A2220] text-white py-3.5 rounded-[4px] text-xs font-boldtracking-[0.2em] uppercase transition-colors shadow-md"
                    >
                        Sign In
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-[#524342] mb-6">
                        Don't have an account?{' '}
                        <Link href="/register" className="font-bold text-[#8B4545] hover:text-[#4A2C2A] underline underline-offset-2 transition-colors">
                            SIGN UP
                        </Link>
                    </p>
                    <p className="text-[9px] text-[#D7C2C0] leading-[1.6] font-normal italic max-w-[280px] mx-auto">
                        By signing in, you agree to our Terms of Service and Privacy Policy concerning AI processing.
                    </p>
                </div>
            </div>

            {/* Absolute Footer */}
            <div className="absolute bottom-6 w-full text-center text-[10px] font-bold tracking-[0.2em] text-[#A89F95] z-0">
                © 2026 KEY BARBER
            </div>
        </div>
    );
}