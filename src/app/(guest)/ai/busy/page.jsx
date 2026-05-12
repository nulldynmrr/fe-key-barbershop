"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Scissors, Send, ArrowLeft, Loader2, MessageSquare, AlertCircle } from "lucide-react";
import SiteNavbar from "../../../../components/SiteNavbar";
import { useToast } from "../../../../contexts/ToastContext";
import api from "../../../../utils/request";

export default function AiBusyPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    pesan: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check if already submitted on mount to prevent spam
  useEffect(() => {
    const hasSubmitted = localStorage.getItem("has_submitted_waitlist");
    if (hasSubmitted) {
      setIsSuccess(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await api.post("/waitlist", formData);

      localStorage.setItem("has_submitted_waitlist", "true");
      setIsSuccess(true);
      showToast("Pesan berhasil dikirim!", "success");
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Gagal mengirim pesan";
      showToast(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="h-[100dvh] w-full overflow-hidden bg-white flex flex-col relative">
      <SiteNavbar activeLabel="AI Feature" />

      <div className="flex-1 flex w-full h-full relative z-10 overflow-hidden">
        <div className="w-full h-full grid lg:grid-cols-2 gap-0 overflow-hidden">

          {/* Left Panel: Illustration & Branding */}
          <div className="hidden lg:flex flex-col bg-[#2B1D19] relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            {/* Illustration */}
            <div className="flex-1 flex items-center justify-center p-8 pb-0 relative z-10 min-h-0">
              <div className="relative w-full h-full max-h-[110%] aspect-square animate-in fade-in zoom-in duration-1000">
                <Image
                  src="/images/ILUSTRASI BUSY.png"
                  alt="Barber Busy Illustration"
                  fill
                  className="object-contain "
                  priority
                />
              </div>
            </div>

            {/* Info Text - Compacted */}
            <div className="p-12 pb-14 pt-4 relative z-10 space-y-5">
              <div>
                <h1 className="text-5xl font-semibold leading-tight mb-3 text-[#FBF7F3]" style={{ fontFamily: "var(--font-playfair)" }}>
                  Antrian <br />
                  <span className="text-[#c57e7b]">Sedang Penuh.</span>
                </h1>
                <p className="text-base text-[#FBF7F3]/40 leading-relaxed max-w-xl" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                  Barber AI kami sedang melayani banyak permintaan analisis morfologi.<br />
                  Tim kami segera kembali normal secepat kilat.
                </p>
              </div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#FBF7F3]/20" style={{ fontFamily: "var(--font-be-vietnam)" }}>
                © 2026 Key Barber AI Experience
              </p>
            </div>
          </div>

          {/* Right Panel: Interactive Form */}
          <div className="flex flex-col p-8 md:p-16 justify-center bg-[#FBF7F3] overflow-hidden">
            {!isSuccess ? (
              <div className="w-full max-w-sm mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="lg:hidden text-center mb-4">
                  <div className="relative w-36 h-36 mx-auto mb-2">
                    <Image
                      src="/images/ILUSTRASI BUSY.png"
                      alt="Barber Busy Illustration"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h2 className="text-3xl font-semibold text-[#2b1d19]" style={{ fontFamily: "var(--font-playfair)" }}>Antrian Penuh</h2>
                </div>

                {/* Keamanan Kredit - Moved here */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#e6d1c7] shadow-sm">
                  <AlertCircle className="h-5 w-5 text-[#8b1a1a] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#6e5851] leading-normal" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                    <span className="text-[#2b1d19] font-bold block mb-0.5 uppercase tracking-wider text-[9px]">Keamanan Kredit</span>
                    Kredit Anda tetap aman dan tidak terpotong sama sekali selama sesi ini berlangsung.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-[#8b1a1a]" />
                    <h3 className="text-xl font-medium text-[#2b1d19]" style={{ fontFamily: "var(--font-noto-serif)" }}>Tinggalkan Pesan</h3>
                  </div>
                  <p className="text-sm text-[#6e5851] leading-relaxed" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                    Master Barber kami akan segera meninjau pesan Anda secara personal.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2.5">
                    <label htmlFor="pesan" className="block text-[10px] font-bold tracking-[0.25em] text-[#8b1a1a] uppercase ml-1" style={{ fontFamily: "var(--font-be-vietnam)" }}>
                      Detail Konsultasi
                    </label>
                    <textarea
                      id="pesan"
                      name="pesan"
                      required
                      rows="5"
                      value={formData.pesan}
                      onChange={handleChange}
                      className="w-full bg-white border-2 border-[#e6d1c7] rounded-xl px-6 py-5 text-sm focus:outline-none focus:border-[#c57e7b] transition-all resize-none shadow-sm placeholder:text-[#2b1d19]/20"
                      placeholder="Ceritakan gaya rambut impian Anda..."
                      style={{ fontFamily: "var(--font-plus-jakarta)" }}
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-3 bg-[#2b1d19] px-8 py-5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#fbf7f3] transition hover:bg-[#8b1a1a] active:scale-[0.98] rounded-lg shadow-lg disabled:opacity-70"
                      style={{ fontFamily: "var(--font-be-vietnam)" }}
                    >
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Kirim Sekarang
                    </button>


                  </div>
                </form>
              </div>
            ) : (
              <div className="w-full max-w-sm mx-auto text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-white border-4 border-[#f0f9f4] shadow-xl mb-1">
                  <Send className="h-10 w-10 text-[#2e8b57] ml-1.5" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl text-[#1e5c3a]" style={{ fontFamily: "var(--font-noto-serif)" }}>Terima Kasih</h2>
                  <p className="text-[#3b7a57] text-sm leading-relaxed" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                    Pesan Anda telah kami terima dan akan segera diproses oleh tim Master Barber kami.
                  </p>
                </div>
                <button
                  onClick={() => router.push("/")}
                  className="w-full inline-flex items-center justify-center px-8 py-5 bg-[#2e8b57] text-white text-[10px] font-bold uppercase tracking-[0.25em] rounded-lg hover:bg-[#1e5c3a] transition-all shadow-lg active:scale-[0.98]"
                  style={{ fontFamily: "var(--font-be-vietnam)" }}
                >
                  Selesai
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
