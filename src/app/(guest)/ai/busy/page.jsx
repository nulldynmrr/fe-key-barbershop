"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Send, Loader2, MessageSquare, AlertCircle } from "lucide-react";
import SiteNavbar from "../../../../components/SiteNavbar";
import { useToast } from "../../../../contexts/ToastContext";
import { waitlistService } from "../../../../services/waitlistService";
import { aiScanService } from "../../../../services/aiScanService";
import { saveUserAuth } from "../../../../utils/request";
import Cookies from "js-cookie";

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

  const ensureAuth = async () => {
    const token = Cookies.get("user_token");
    if (!token) {
      let deviceId = Cookies.get("device_cookie");
      if (!deviceId) {
        deviceId = "dev_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        Cookies.set("device_cookie", deviceId, { expires: 365 });
      }
      const res = await aiScanService.guestLogin({ device_cookie: deviceId });
      const { data } = res.data;
      saveUserAuth(data.token, data.user);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await ensureAuth();
      await waitlistService.submitWaitlist(formData);

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
    <main className="h-dvh max-h-dvh w-full overflow-hidden bg-white flex flex-col">
      <div className="shrink-0">
        <SiteNavbar activeLabel="AI Feature" />
      </div>

      <div className="flex-1 flex w-full relative z-10 min-h-0">
        <div className="w-full grid lg:grid-cols-2 gap-0 min-h-0 flex-1">

          {/* Left Panel: Illustration & Branding */}
          <div className="hidden lg:flex flex-col bg-[#2B1D19] relative overflow-hidden min-h-0">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            {/* Illustration — anchor bottom, fill available height */}
            <div className="flex-1 min-h-0 flex items-end justify-center p-6 lg:p-8 relative z-10">
              <div className="relative w-full h-full max-h-[min(58dvh,100%)] max-w-[min(100%,42rem)] aspect-4/3 animate-in fade-in zoom-in duration-1000">
                <Image
                  src="/images/ILUSTRASI BUSY.png"
                  alt="Barber Busy Illustration"
                  fill
                  className="object-contain object-bottom-left"
                  priority
                />
              </div>
            </div>

            {/* Info Text */}
            <div className="shrink-0 px-8 pb-8 pt-2 lg:px-12 lg:pb-10 relative z-10 space-y-3">
              <div>
                <h1 className="text-[clamp(1.75rem,3.2vw,3rem)] font-semibold leading-tight mb-2 text-[#FBF7F3]" style={{ fontFamily: "var(--font-playfair)" }}>
                  Antrian <br />
                  <span className="text-[#c57e7b]">Sedang Penuh.</span>
                </h1>
                <p className="text-sm lg:text-base text-[#FBF7F3]/40 leading-snug max-w-xl" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                  Barber AI kami sedang melayani banyak permintaan analisis morfologi. Tim kami segera kembali normal secepat kilat.
                </p>
              </div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#FBF7F3]/20" style={{ fontFamily: "var(--font-be-vietnam)" }}>
                © 2026 Key Barber AI Experience
              </p>
            </div>
          </div>
          {/* Right Panel: Interactive Form */}
          <div className="flex flex-col min-h-0 h-full overflow-hidden bg-[#FBF7F3] px-4 py-4 sm:px-6 sm:py-5 md:px-10 md:py-8">
            {!isSuccess ? (
              <div className="w-full max-w-sm mx-auto flex flex-col flex-1 min-h-0 justify-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="lg:hidden text-center shrink-0 space-y-1">
                  <div className="relative h-[clamp(4.5rem,18dvh,7.5rem)] w-[clamp(4.5rem,18dvh,7.5rem)] mx-auto">
                    <Image
                      src="/images/ILUSTRASI BUSY.png"
                      alt="Barber Busy Illustration"
                      fill
                      className="object-contain object-bottom"
                    />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#2b1d19]" style={{ fontFamily: "var(--font-playfair)" }}>Antrian Penuh</h2>
                  <p className="text-[11px] sm:text-xs text-[#6e5851] leading-snug px-1" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                    Barber AI kami sedang melayani banyak permintaan. Tim kami segera kembali normal secepat kilat.
                  </p>
                </div>

                {/* Keamanan Kredit */}
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-white border border-[#e6d1c7] shadow-sm shrink-0">
                  <AlertCircle className="h-4 w-4 text-[#8b1a1a] shrink-0 mt-0.5" />
                  <p className="text-[10px] text-[#6e5851] leading-normal" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                    <span className="text-[#2b1d19] font-bold block mb-0.5 uppercase tracking-wider text-[8px]">Keamanan Kredit</span>
                    Kredit Anda tetap aman dan tidak terpotong sama sekali selama sesi ini berlangsung.
                  </p>
                </div>

                <div className="space-y-0.5 shrink-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <MessageSquare className="h-4 w-4 text-[#8b1a1a] shrink-0" />
                    <h3 className="text-base sm:text-lg font-medium text-[#2b1d19]" style={{ fontFamily: "var(--font-noto-serif)" }}>Tinggalkan Pesan</h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#6e5851] leading-snug" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                    Master Barber kami akan segera meninjau pesan Anda secara personal.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 gap-2 sm:gap-3">
                  <div className="flex flex-col flex-1 min-h-0 gap-1.5 sm:gap-2">
                    <label htmlFor="pesan" className="block text-[9px] font-bold tracking-[0.25em] text-[#8b1a1a] uppercase ml-1 shrink-0" style={{ fontFamily: "var(--font-be-vietnam)" }}>
                      Detail Konsultasi
                    </label>
                    <textarea
                      id="pesan"
                      name="pesan"
                      required
                      rows={3}
                      value={formData.pesan}
                      onChange={handleChange}
                      className="w-full flex-1 min-h-17 max-h-[min(28dvh,12rem)] sm:max-h-[min(32dvh,14rem)] bg-white border-2 border-[#e6d1c7] rounded-xl px-4 py-3 sm:px-5 sm:py-4 text-xs focus:outline-none focus:border-[#c57e7b] transition-all resize-none shadow-sm placeholder:text-[#2b1d19]/20"
                      placeholder="Ceritakan gaya rambut impian Anda..."
                      style={{ fontFamily: "var(--font-plus-jakarta)" }}
                    />
                  </div>

                  <div className="shrink-0 flex flex-col gap-2 pt-0.5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-3 bg-[#2b1d19] px-6 py-3 sm:px-8 sm:py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#fbf7f3] transition hover:bg-[#8b1a1a] active:scale-[0.98] rounded-lg shadow-lg disabled:opacity-70"
                      style={{ fontFamily: "var(--font-be-vietnam)" }}
                    >
                      {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                      Kirim Sekarang
                    </button>
                  </div>
                </form>

                <div className="lg:hidden text-center shrink-0 pt-1">
                  <p className="text-[8px] uppercase tracking-[0.4em] text-[#2b1d19]/20" style={{ fontFamily: "var(--font-be-vietnam)" }}>
                    © 2026 Key Barber AI Experience
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-sm mx-auto flex flex-col flex-1 min-h-0 justify-center items-center text-center gap-3 sm:gap-4 px-2 animate-in fade-in zoom-in duration-500">
                <div className="relative flex flex-col items-center shrink-0">
                  <div className="inline-flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-white border-4 border-[#f0f9f4] shadow-xl relative z-10">
                    <Send className="h-5 w-5 sm:h-6 sm:w-6 text-[#2e8b57] ml-0.5" />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#2e8b57]/5 rounded-full blur-2xl -z-10" />
                </div>

                <div className="space-y-1 sm:space-y-1.5 shrink-0">
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#1e5c3a]" style={{ fontFamily: "var(--font-playfair)" }}>Terima Kasih</h2>
                  <p className="text-[#3b7a57] text-[10px] sm:text-[11px] leading-relaxed px-2 sm:px-6" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                    Pesan Anda telah kami terima dan akan segera diproses oleh tim Master Barber kami.
                  </p>
                </div>

                <div className="w-full shrink-0 pt-1">
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="w-full inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-3.5 bg-[#2e8b57] text-white text-[9px] font-bold uppercase tracking-[0.3em] rounded-lg hover:bg-[#1e5c3a] transition-all shadow-lg hover:shadow-[#2e8b57]/20 active:scale-[0.98]"
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
