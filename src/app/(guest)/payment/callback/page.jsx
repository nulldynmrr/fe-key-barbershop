"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, X, Loader2, RefreshCw, ChevronRight } from "lucide-react";
import SiteNavbar from "../../../../components/SiteNavbar";
import SiteFooter from "../../../../components/SiteFooter";
import api from "@/utils/request";

const POLL_INTERVAL_MS = 3000; // Polling setiap 3 detik
const MAX_POLLS = 40;          // Maksimal 40 x 3s = 2 menit polling

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invoice = searchParams.get("invoice");

  const [status, setStatus] = useState("POLLING"); // POLLING | SUCCESS | FAILED | PENDING | ERROR
  const [pollCount, setPollCount] = useState(0);
  const [transactionData, setTransactionData] = useState(null);
  const [dots, setDots] = useState("");

  // Animasi titik
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = useCallback(async () => {
    if (!invoice) {
      setStatus("ERROR");
      return;
    }

    try {
      const res = await api.get(`/payments/status/${invoice}`);
      if (res.data?.success && res.data?.data) {
        const txStatus = res.data.data.status;
        setTransactionData(res.data.data);

        if (txStatus === "SUCCESS") {
          setStatus("SUCCESS");
          return true; // Stop polling
        } else if (txStatus === "FAILED") {
          setStatus("FAILED");
          return true; // Stop polling
        }
        // Masih PENDING → lanjut polling
      }
    } catch (err) {
      console.error("Error checking payment status:", err);
    }
    return false; // Terus polling
  }, [invoice]);

  useEffect(() => {
    if (!invoice) {
      setStatus("ERROR");
      return;
    }

    let pollCount = 0;
    let intervalId;

    const poll = async () => {
      if (pollCount >= MAX_POLLS) {
        clearInterval(intervalId);
        setStatus("PENDING");
        return;
      }

      pollCount++;
      setPollCount(pollCount);

      const shouldStop = await checkStatus();
      if (shouldStop) {
        clearInterval(intervalId);
      }
    };

    // Cek segera, lalu mulai interval
    poll();
    intervalId = setInterval(poll, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [invoice, checkStatus]);

  // Status: POLLING
  if (status === "POLLING") {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-32 px-6 animate-fade-in">
        <div className="w-full max-w-lg bg-[#ede8e0]/90 backdrop-blur-md border border-[#e6d1c7] p-12 sm:p-20 rounded-[40px] shadow-2xl text-center relative overflow-hidden">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 relative mb-8 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-[#3a221c]/10 border-t-[#3a221c] rounded-full animate-spin" />
              <div className="w-10 h-10 relative">
                <Image src="/images/key.png" alt="Key" fill className="object-contain" />
              </div>
            </div>

            <h2
              className="text-3xl sm:text-4xl text-[#3a221c] mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Menunggu Pembayaran{dots}
            </h2>
            <p className="text-sm text-[#5f463d] leading-relaxed max-w-sm mx-auto mb-8">
              Kami sedang memverifikasi pembayaran Anda. Sistem akan otomatis update setelah pembayaran dikonfirmasi.
            </p>

            <div className="bg-[#3a221c]/5 border border-[#e6d1c7] rounded-lg px-6 py-4 w-full mb-8 text-left space-y-2">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#8b6f66]">Invoice</p>
              <p className="text-sm font-mono font-bold text-[#3a221c]">{invoice}</p>
            </div>

            <div className="flex items-center gap-2 text-[10px] tracking-wider uppercase text-[#8b6f66]">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Memeriksa status ({pollCount}/{MAX_POLLS})</span>
            </div>
          </div>
        </div>

        <p className="mt-8 text-[10px] tracking-wider text-[#8b6f66] text-center max-w-xs">
          Jika Anda baru saja melakukan scan QRIS atau transfer VA, harap tunggu beberapa saat. Status akan update otomatis.
        </p>
      </div>
    );
  }

  // Status: SUCCESS
  if (status === "SUCCESS") {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 px-6 animate-fade-in">
        <div className="w-full max-w-lg bg-[#ede8e0] border border-[#e6d1c7] p-10 sm:p-16 rounded-[40px] shadow-2xl text-center">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-[#3a221c] rounded-2xl flex items-center justify-center mb-8 shadow-[0_20px_40px_rgba(58,34,28,0.2)]">
              <Check className="w-10 h-10 text-[#f8f1ea]" strokeWidth={3} />
            </div>

            <h2
              className="text-4xl sm:text-5xl text-[#3a221c] mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Pembayaran Berhasil!
            </h2>
            <p className="text-sm text-[#5f463d] leading-relaxed max-w-md mx-auto mb-8">
              Paket Anda telah aktif. Selamat menikmati fitur premium Key Barber!
            </p>

            <div className="bg-[#3a221c]/5 border border-[#e6d1c7] rounded-lg px-6 py-4 w-full mb-8 text-left space-y-3">
              {transactionData?.package_name && (
                <div className="flex justify-between items-center">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#8b6f66]">Paket</span>
                  <span className="text-sm font-bold text-[#3a221c]">{transactionData.package_name}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#8b6f66]">Invoice</span>
                <span className="text-xs font-mono text-[#3a221c]">{invoice}</span>
              </div>
              {transactionData?.nominal && (
                <div className="flex justify-between items-center">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#8b6f66]">Nominal</span>
                  <span className="text-sm font-bold text-[#3a221c]">
                    Rp {Number(transactionData.nominal).toLocaleString("id-ID")}
                  </span>
                </div>
              )}
            </div>

            <Link
              href="/home"
              className="w-full py-5 bg-[#3a221c] text-[#f8f1ea] text-xs font-bold tracking-[0.4em] uppercase transition-all hover:bg-[#1a1110] flex items-center justify-center gap-4 group rounded-lg shadow-lg"
            >
              Kembali ke Beranda
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Status: FAILED
  if (status === "FAILED") {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 px-6 animate-fade-in">
        <div className="w-full max-w-lg bg-[#ede8e0] border border-[#e6d1c7] p-10 sm:p-16 rounded-[40px] shadow-2xl text-center">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-red-800 rounded-2xl flex items-center justify-center mb-8 shadow-[0_20px_40px_rgba(120,0,0,0.2)]">
              <X className="w-10 h-10 text-white" strokeWidth={3} />
            </div>

            <h2
              className="text-4xl sm:text-5xl text-[#3a221c] mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Pembayaran Gagal
            </h2>
            <p className="text-sm text-[#5f463d] leading-relaxed max-w-md mx-auto mb-8">
              Maaf, pembayaran Anda tidak dapat diproses. Silakan coba lagi atau pilih metode pembayaran lain.
            </p>

            <div className="bg-[#3a221c]/5 border border-[#e6d1c7] rounded-lg px-6 py-4 w-full mb-8 text-left">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#8b6f66]">Invoice</p>
              <p className="text-sm font-mono font-bold text-[#3a221c]">{invoice}</p>
            </div>

            <Link
              href="/service"
              className="w-full py-5 bg-[#3a221c] text-[#f8f1ea] text-xs font-bold tracking-[0.4em] uppercase transition-all hover:bg-[#1a1110] flex items-center justify-center gap-4 group rounded-lg shadow-lg"
            >
              Coba Lagi
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Status: PENDING (timeout polling)
  if (status === "PENDING") {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 px-6 animate-fade-in">
        <div className="w-full max-w-lg bg-[#ede8e0] border border-[#e6d1c7] p-10 sm:p-16 rounded-[40px] shadow-2xl text-center">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-amber-700 rounded-2xl flex items-center justify-center mb-8">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>

            <h2
              className="text-3xl sm:text-4xl text-[#3a221c] mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Pembayaran Sedang Diverifikasi
            </h2>
            <p className="text-sm text-[#5f463d] leading-relaxed max-w-md mx-auto mb-8">
              Pembayaran Anda sedang diproses. Jika sudah berhasil bayar, paket akan aktif secara otomatis dalam beberapa menit. Anda bisa cek kembali nanti.
            </p>

            <div className="bg-[#3a221c]/5 border border-[#e6d1c7] rounded-lg px-6 py-4 w-full mb-8 text-left">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#8b6f66]">Invoice</p>
              <p className="text-sm font-mono font-bold text-[#3a221c]">{invoice}</p>
            </div>

            <div className="flex gap-4 w-full">
              <button
                onClick={() => { setStatus("POLLING"); setPollCount(0); }}
                className="flex-1 py-4 border border-[#3a221c] text-[#3a221c] text-xs font-bold tracking-[0.3em] uppercase hover:bg-[#3a221c]/10 transition-all rounded-lg flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3 h-3" />
                Cek Ulang
              </button>
              <Link
                href="/home"
                className="flex-1 py-4 bg-[#3a221c] text-[#f8f1ea] text-xs font-bold tracking-[0.3em] uppercase hover:bg-[#1a1110] transition-all rounded-lg flex items-center justify-center gap-2"
              >
                Kembali ke Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Status: ERROR
  return (
    <div className="flex-grow flex flex-col items-center justify-center py-20 px-6">
      <div className="w-full max-w-lg bg-[#ede8e0] border border-[#e6d1c7] p-10 rounded-[40px] shadow-2xl text-center">
        <p className="text-[#5f463d]">Terjadi kesalahan. Invoice tidak ditemukan.</p>
        <Link href="/service" className="mt-6 inline-block px-6 py-3 bg-[#3a221c] text-[#f8f1ea] rounded-lg text-sm">
          Kembali ke Layanan
        </Link>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <main className="min-h-screen bg-[#E1D5C9] text-[#2B1D19] relative overflow-hidden flex flex-col">
      <SiteNavbar />
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] flex items-center justify-center">
          <Image
            src="/images/logo-transparent.png"
            alt="Key Pattern"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex-grow flex items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 border-2 border-[#3a221c]/10 border-t-[#3a221c] rounded-full animate-spin" />
          </div>
        }
      >
        <PaymentCallbackContent />
      </Suspense>

      <SiteFooter />
    </main>
  );
}
