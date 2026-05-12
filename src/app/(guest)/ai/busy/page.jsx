"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

      <div className="flex-1 flex w-full h-full relative z-10">
        <div className="w-full h-full grid lg:grid-cols-2 gap-0 overflow-hidden">

          {/* Left Panel: Brand & Info */}
          <div className="hidden lg:flex flex-col justify-between p-16 bg-[#2B1D19] text-[#FBF7F3] relative overflow-hidden">
            {/* Texture overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[#FBF7F3]/10 border border-[#FBF7F3]/20 mb-10">
                <Scissors className="h-8 w-8 text-[#FBF7F3]" strokeWidth={1.5} />
              </div>

              <h1 className="text-6xl font-semibold leading-[1.1] mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
                Antrian <br />
                <span className="text-[#c57e7b]">Penuh.</span>
              </h1>

              <p className="text-xl text-[#FBF7F3]/70 leading-relaxed max-w-sm" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                Barber AI kami sedang melayani banyak permintaan. Silakan tinggalkan pesan untuk Master Barber kami.
              </p>
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-[#FBF7F3]/5 border border-[#FBF7F3]/10 max-w-md">
                <AlertCircle className="h-6 w-6 text-[#c57e7b] shrink-0 mt-0.5" />
                <p className="text-sm text-[#FBF7F3]/60 leading-normal" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                  <span className="text-[#FBF7F3] font-bold block mb-1 uppercase tracking-wider text-xs">Keamanan Kredit</span>
                  Kredit Anda tetap aman dan tidak terpotong sama sekali selama sesi ini berlangsung.
                </p>
              </div>
              <p className="text-[10px] uppercase tracking-[0.5em] text-[#FBF7F3]/20" style={{ fontFamily: "var(--font-be-vietnam)" }}>
                © 2026 Key Barber AI Experience
              </p>
            </div>
          </div>

          {/* Right Panel: Interactive Form */}
          <div className="flex flex-col p-8 md:p-24 justify-center bg-[#FBF7F3]">
            {!isSuccess ? (
              <div className="w-full max-w-md mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="lg:hidden text-center mb-8">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#8b1a1a]/5 mb-6">
                    <Scissors className="h-7 w-7 text-[#8b1a1a]" />
                  </div>
                  <h2 className="text-4xl font-semibold text-[#2b1d19]" style={{ fontFamily: "var(--font-playfair)" }}>Antrian Penuh</h2>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-6 w-6 text-[#8b1a1a]" />
                    <h3 className="text-2xl font-medium text-[#2b1d19]" style={{ fontFamily: "var(--font-noto-serif)" }}>Tinggalkan Pesan</h3>
                  </div>
                  <p className="text-base text-[#6e5851]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                    Master Barber kami akan segera meninjau pesan Anda secara personal.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <label htmlFor="pesan" className="block text-[11px] font-bold tracking-[0.3em] text-[#8b1a1a] uppercase ml-1" style={{ fontFamily: "var(--font-be-vietnam)" }}>
                      Detail Konsultasi
                    </label>
                    <textarea
                      id="pesan"
                      name="pesan"
                      required
                      rows="7"
                      value={formData.pesan}
                      onChange={handleChange}
                      className="w-full bg-white border-2 border-[#e6d1c7] rounded-3xl px-8 py-7 text-base focus:outline-none focus:border-[#c57e7b] transition-all resize-none shadow-sm placeholder:text-[#2b1d19]/20"
                      placeholder="Ceritakan gaya rambut impian Anda..."
                      style={{ fontFamily: "var(--font-plus-jakarta)" }}
                    />
                  </div>

                  <div className="flex flex-col gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-4 bg-[#2b1d19] px-10 py-6 text-xs font-bold uppercase tracking-[0.3em] text-[#fbf7f3] transition hover:bg-[#8b1a1a] active:scale-[0.98] rounded-2xl shadow-xl disabled:opacity-70"
                      style={{ fontFamily: "var(--font-be-vietnam)" }}
                    >
                      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                      Kirim Sekarang
                    </button>

                    <button
                      type="button"
                      onClick={() => router.push("/ai")}
                      className="w-full inline-flex items-center justify-center gap-2 bg-transparent border-2 border-[#e6d1c7] px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] text-[#2b1d19] transition hover:bg-white rounded-2xl"
                      style={{ fontFamily: "var(--font-be-vietnam)" }}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Kembali ke Menu AI
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="w-full max-w-md mx-auto text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="inline-flex items-center justify-center h-32 w-32 rounded-full bg-white border-8 border-[#f0f9f4] shadow-2xl mb-4">
                  <Send className="h-14 w-14 text-[#2e8b57] ml-2" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-4xl text-[#1e5c3a]" style={{ fontFamily: "var(--font-noto-serif)" }}>Terima Kasih</h2>
                  <p className="text-[#3b7a57] text-lg leading-relaxed" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                    Pesan Anda telah kami terima dan akan segera diproses oleh tim Master Barber kami.
                  </p>
                </div>
                <button
                  onClick={() => router.push("/")}
                  className="w-full inline-flex items-center justify-center px-10 py-6 bg-[#2e8b57] text-white text-xs font-bold uppercase tracking-[0.3em] rounded-2xl hover:bg-[#1e5c3a] transition-all shadow-xl active:scale-[0.98]"
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
