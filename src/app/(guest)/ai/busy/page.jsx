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
    <main className="min-h-screen lg:h-[100dvh] w-full lg:overflow-hidden bg-white flex flex-col relative overflow-y-auto">
      <SiteNavbar activeLabel="AI Feature" />

      <div className="flex-1 flex w-full relative z-10">
        <div className="w-full grid lg:grid-cols-2 gap-0">

          {/* Left Panel: Illustration & Branding */}
          <div className="hidden lg:flex flex-col bg-[#2B1D19] relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            {/* Illustration */}
            <div className="flex-1 flex items-center justify-center p-8 relative z-10 min-h-0">
              <div className="relative w-full h-full max-h-[70%] aspect-square animate-in fade-in zoom-in duration-1000">
                <Image
                  src="/images/ILUSTRASI BUSY.png"
                  alt="Barber Busy Illustration"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Info Text */}
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
          <div className="flex flex-col p-8 md:p-12 justify-center bg-[#FBF7F3]">
            {!isSuccess ? (
              <div className="w-full max-w-sm mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 py-4">
                <div className="lg:hidden text-center mb-2">
                  <div className="relative w-40 h-40 mx-auto mb-2">
                    <Image
                      src="/images/ILUSTRASI BUSY.png"
                      alt="Barber Busy Illustration"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h2 className="text-3xl font-semibold text-[#2b1d19] mb-1" style={{ fontFamily: "var(--font-playfair)" }}>Antrian Penuh</h2>
                  <p className="text-xs text-[#6e5851] leading-relaxed mb-4 px-4" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                    Barber AI kami sedang melayani banyak permintaan. Tim kami segera kembali normal secepat kilat.
                  </p>
                </div>

                {/* Keamanan Kredit */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#e6d1c7] shadow-sm">
                  <AlertCircle className="h-4 w-4 text-[#8b1a1a] shrink-0 mt-0.5" />
                  <p className="text-[10px] text-[#6e5851] leading-normal" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                    <span className="text-[#2b1d19] font-bold block mb-0.5 uppercase tracking-wider text-[8px]">Keamanan Kredit</span>
                    Kredit Anda tetap aman dan tidak terpotong sama sekali selama sesi ini berlangsung.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-[#8b1a1a]" />
                    <h3 className="text-lg font-medium text-[#2b1d19]" style={{ fontFamily: "var(--font-noto-serif)" }}>Tinggalkan Pesan</h3>
                  </div>
                  <p className="text-xs text-[#6e5851] leading-relaxed" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                    Master Barber kami akan segera meninjau pesan Anda secara personal.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="pesan" className="block text-[9px] font-bold tracking-[0.25em] text-[#8b1a1a] uppercase ml-1" style={{ fontFamily: "var(--font-be-vietnam)" }}>
                      Detail Konsultasi
                    </label>
                    <textarea
                      id="pesan"
                      name="pesan"
                      required
                      rows="4"
                      value={formData.pesan}
                      onChange={handleChange}
                      className="w-full bg-white border-2 border-[#e6d1c7] rounded-xl px-5 py-4 text-xs focus:outline-none focus:border-[#c57e7b] transition-all resize-none shadow-sm placeholder:text-[#2b1d19]/20"
                      placeholder="Ceritakan gaya rambut impian Anda..."
                      style={{ fontFamily: "var(--font-plus-jakarta)" }}
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-3 bg-[#2b1d19] px-8 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#fbf7f3] transition hover:bg-[#8b1a1a] active:scale-[0.98] rounded-lg shadow-lg disabled:opacity-70"
                      style={{ fontFamily: "var(--font-be-vietnam)" }}
                    >
                      {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                      Kirim Sekarang
                    </button>
                  </div>
                </form>

                <div className="lg:hidden text-center pt-2">
                  <p className="text-[8px] uppercase tracking-[0.4em] text-[#2b1d19]/20" style={{ fontFamily: "var(--font-be-vietnam)" }}>
                    © 2026 Key Barber AI Experience
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-sm mx-auto text-center space-y-4 animate-in fade-in zoom-in duration-500 py-2 -translate-y-12">
                <div className="relative flex flex-col items-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white border-4 border-[#f0f9f4] shadow-xl relative z-10">
                    <Send className="h-6 w-6 text-[#2e8b57] ml-0.5" />
                  </div>
                  {/* Decorative element */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#2e8b57]/5 rounded-full blur-2xl -z-10" />
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-2xl font-semibold text-[#1e5c3a]" style={{ fontFamily: "var(--font-playfair)" }}>Terima Kasih</h2>
                  <p className="text-[#3b7a57] text-[11px] leading-relaxed px-6" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                    Pesan Anda telah kami terima and akan segera diproses oleh tim Master Barber kami.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => router.push("/")}
                    className="w-full inline-flex items-center justify-center px-8 py-3.5 bg-[#2e8b57] text-white text-[9px] font-bold uppercase tracking-[0.3em] rounded-lg hover:bg-[#1e5c3a] transition-all shadow-lg hover:shadow-[#2e8b57]/20 active:scale-[0.98]"
                    style={{ fontFamily: "var(--font-be-vietnam)" }}
                  >
                    Selesai
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
