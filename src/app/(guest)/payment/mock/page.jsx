"use client";

import React, { useState, Suspense, useEffect } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, X, ShieldAlert, CreditCard, Loader2, ArrowLeft, Copy, Smartphone, Landmark, QrCode } from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";
import api from "@/utils/request";
import { useToast } from "@/contexts/ToastContext";

function MockPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'SUCCESS' | 'FAILED' | null
  const [copied, setCopied] = useState(false);
  const [vaNumber, setVaNumber] = useState("");

  const invoice = searchParams.get("invoice") || `INV-${Date.now()}`;
  const amountStr = searchParams.get("amount") || "0";
  const amount = parseInt(amountStr, 10);
  const namaPaket = searchParams.get("nama_paket") || "Credit Package";
  const packageId = searchParams.get("package_id") || "";
  const paymentMethodType = searchParams.get("method") || "";

  const isQris = paymentMethodType === "QRIS" || paymentMethodType.startsWith("EMONEY_");
  const isVa = paymentMethodType.startsWith("VIRTUAL_ACCOUNT_");

  // Get human readable bank name and generate dynamic VA
  let bankName = "Virtual Account";
  let bankCode = "";
  if (paymentMethodType.includes("BCA")) {
    bankName = "BCA Virtual Account";
    bankCode = "BCA";
  } else if (paymentMethodType.includes("MANDIRI")) {
    bankName = "Mandiri Virtual Account";
    bankCode = "MANDIRI";
  } else if (paymentMethodType.includes("BRI")) {
    bankName = "BRI Virtual Account (BRIVA)";
    bankCode = "BRI";
  } else if (paymentMethodType.includes("BNI")) {
    bankName = "BNI Virtual Account";
    bankCode = "BNI";
  }

  useEffect(() => {
    // Generate static but realistic VA based on invoice and bank code
    let prefix = "88990";
    if (bankCode === "BCA") prefix = "8001208";
    else if (bankCode === "MANDIRI") prefix = "89508";
    else if (bankCode === "BRI") prefix = "80777";
    else if (bankCode === "BNI") prefix = "8277";

    // Hash invoice name to some numbers
    let hash = 0;
    for (let i = 0; i < invoice.length; i++) {
      hash = invoice.charCodeAt(i) + ((hash << 5) - hash);
    }
    const suffix = Math.abs(hash % 100000000).toString().padStart(8, "3");
    setVaNumber(prefix + suffix);
  }, [invoice, bankCode]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(vaNumber);
    setCopied(true);
    showToast("Nomor Virtual Account berhasil disalin", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = async (status) => {
    setIsProcessing(true);
    try {
      const response = await api.post("/payments/callback", {
        order_id: invoice,
        invoice_number: invoice,
        status: status,
        reference_id: `MOCK-REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      });

      if (response.data && response.data.success) {
        setPaymentStatus(status);
        if (status === "SUCCESS") {
          showToast("Pembayaran berhasil diverifikasi!", "success");
          setTimeout(() => {
            router.push("/home");
          }, 3000);
        } else {
          showToast("Transaksi dibatalkan.", "info");
          setTimeout(() => {
            router.push("/service");
          }, 3000);
        }
      } else {
        showToast(response.data?.message || "Gagal memproses status transaksi", "error");
      }
    } catch (error) {
      console.error("Callback Error:", error);
      showToast(error.response?.data?.message || "Koneksi ke billing server terputus", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentStatus === "SUCCESS") {
    return (
      <div className="w-full max-w-xl bg-[#ede8e0]/95 backdrop-blur-md border border-[#e6d1c7] p-12 sm:p-16 rounded-sm shadow-2xl text-center relative overflow-hidden animate-fade-in mx-auto mt-12 mb-20">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-[#3a221c] rounded-full flex items-center justify-center mb-8 shadow-lg">
            <Check className="w-10 h-10 text-[#f8f1ea]" strokeWidth={3} />
          </div>
          <h2 className="text-3xl text-[#3a221c] mb-4 font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>
            Pembayaran Berhasil
          </h2>
          <p className="text-sm text-[#5f463d] leading-relaxed max-w-md mx-auto mb-8">
            Pembayaran untuk paket <strong>{namaPaket}</strong> telah berhasil diproses. Koin/kredit Anda telah diaktifkan.
          </p>
          <div className="w-5 h-5 border-2 border-[#3a221c]/20 border-t-[#3a221c] rounded-full animate-spin mb-4"></div>
          <p className="text-xs text-[#8b6f66] uppercase tracking-widest">
            Mengalihkan ke beranda...
          </p>
        </div>
      </div>
    );
  }

  if (paymentStatus === "FAILED") {
    return (
      <div className="w-full max-w-xl bg-[#ede8e0]/95 backdrop-blur-md border border-[#e6d1c7] p-12 sm:p-16 rounded-sm shadow-2xl text-center relative overflow-hidden animate-fade-in mx-auto mt-12 mb-20">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-red-800 rounded-full flex items-center justify-center mb-8 shadow-lg">
            <X className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
          <h2 className="text-3xl text-[#3a221c] mb-4 font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>
            Pembayaran Dibatalkan
          </h2>
          <p className="text-sm text-[#5f463d] leading-relaxed max-w-md mx-auto mb-8">
            Transaksi Anda telah dibatalkan. Tidak ada penambahan saldo koin pada akun Anda.
          </p>
          <div className="w-5 h-5 border-2 border-red-800/20 border-t-red-800 rounded-full animate-spin mb-4"></div>
          <p className="text-xs text-[#8b6f66] uppercase tracking-widest">
            Mengalihkan ke halaman layanan...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-6 py-12 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-yellow-600/30 bg-yellow-500/10 text-yellow-800 text-[10px] uppercase tracking-widest font-semibold mb-4">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Local Development Sandbox</span>
        </div>
        <h1 className="text-4xl text-[#3a221c] mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
          {isQris ? "QRIS Payment Portal" : isVa ? "Virtual Account Portal" : "Mock Checkout Portal"}
        </h1>
        <p className="text-xs text-[#5f463d]">
          Selesaikan pembayaran menggunakan data di bawah. Halaman ini mensimulasikan gerbang pembayaran DOKU.
        </p>
      </div>

      <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-stretch mb-8">
        {/* Left Card: Method specific payment info */}
        <div className="bg-[#ede8e0]/90 border border-[#e6d1c7] p-8 rounded-sm shadow-xl flex flex-col justify-between">
          {isQris ? (
            /* QRIS Flow */
            <div className="flex flex-col items-center text-center flex-grow justify-center">
              <div className="w-full bg-[#1e272e] py-2 px-4 rounded-sm flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-white tracking-widest uppercase">QRIS GPN</span>
                <span className="text-[8px] font-semibold text-gray-400">Merchant: KEY BARBER</span>
              </div>
              
              {/* Beautiful Mock QR Code SVG */}
              <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-sm mb-6">
                <svg className="w-44 h-44 text-black" viewBox="0 0 100 100" fill="currentColor">
                  {/* Outer Frame */}
                  <rect x="0" y="0" width="100" height="100" fill="white" />
                  {/* Top-Left Finder */}
                  <rect x="5" y="5" width="25" height="25" fill="black" />
                  <rect x="10" y="10" width="15" height="15" fill="white" />
                  <rect x="13" y="13" width="9" height="9" fill="black" />
                  {/* Top-Right Finder */}
                  <rect x="70" y="5" width="25" height="25" fill="black" />
                  <rect x="75" y="10" width="15" height="15" fill="white" />
                  <rect x="78" y="13" width="9" height="9" fill="black" />
                  {/* Bottom-Left Finder */}
                  <rect x="5" y="70" width="25" height="25" fill="black" />
                  <rect x="10" y="75" width="15" height="15" fill="white" />
                  <rect x="13" y="78" width="9" height="9" fill="black" />
                  {/* Mock QR data pixels */}
                  <rect x="35" y="10" width="5" height="5" />
                  <rect x="45" y="5" width="10" height="5" />
                  <rect x="60" y="15" width="5" height="15" />
                  <rect x="40" y="25" width="15" height="5" />
                  <rect x="10" y="35" width="15" height="5" />
                  <rect x="30" y="35" width="5" height="20" />
                  <rect x="40" y="40" width="15" height="10" />
                  <rect x="60" y="35" width="25" height="5" />
                  <rect x="70" y="45" width="5" height="15" />
                  <rect x="80" y="40" width="10" height="5" />
                  <rect x="15" y="45" width="5" height="10" />
                  <rect x="10" y="60" width="15" height="5" />
                  <rect x="35" y="60" width="15" height="5" />
                  <rect x="55" y="50" width="10" height="15" />
                  <rect x="45" y="70" width="5" height="10" />
                  <rect x="35" y="80" width="10" height="5" />
                  <rect x="55" y="75" width="15" height="5" />
                  <rect x="75" y="70" width="5" height="10" />
                  <rect x="85" y="80" width="10" height="5" />
                  <rect x="75" y="85" width="10" height="5" />
                  {/* Middle decoration logo */}
                  <rect x="43" y="43" width="14" height="14" fill="white" />
                  <circle cx="50" cy="50" r="5" fill="#3a221c" />
                </svg>
              </div>

              <div className="text-left w-full space-y-2 text-[11px] text-[#5f463d] border-t border-[#e6d1c7] pt-4 leading-relaxed">
                <p className="font-bold text-[#3a221c] mb-1">Petunjuk Pembayaran:</p>
                <p>1. Buka aplikasi e-wallet (OVO, GoPay, Dana, ShopeePay) atau mobile banking Anda.</p>
                <p>2. Pilih menu scan/bayar QRIS.</p>
                <p>3. Arahkan kamera ponsel Anda ke kode QR di atas.</p>
                <p>4. Setelah nominal transaksi sesuai terdeteksi, lakukan pembayaran.</p>
              </div>
            </div>
          ) : isVa ? (
            /* Virtual Account Flow */
            <div className="flex flex-col flex-grow justify-between">
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-[#e6d1c7] mb-6">
                  <Landmark className="w-5 h-5 text-[#3a221c]" />
                  <span className="text-xs tracking-wider font-bold text-[#3a221c] uppercase">
                    {bankName}
                  </span>
                </div>

                <div className="space-y-1 mb-6">
                  <span className="text-[10px] text-[#8b6f66] uppercase tracking-wider block">Nomor Virtual Account</span>
                  <div className="flex items-center justify-between bg-white border border-[#e6d1c7] px-4 py-3 rounded-sm shadow-inner">
                    <span className="font-mono font-bold text-lg text-[#3a221c] tracking-widest">{vaNumber}</span>
                    <button
                      onClick={handleCopyToClipboard}
                      className="p-1.5 hover:bg-gray-100 transition-colors rounded-sm text-[#8b6f66] hover:text-[#3a221c]"
                      title="Salin Nomor VA"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-700" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-left w-full space-y-2 text-[11px] text-[#5f463d] border-t border-[#e6d1c7] pt-4 leading-relaxed">
                <p className="font-bold text-[#3a221c] mb-1">Petunjuk Pembayaran:</p>
                <p>1. Gunakan ATM, Mobile Banking, atau Internet Banking Anda.</p>
                <p>2. Pilih menu **Transfer** &gt; **Virtual Account** (atau Transfer Antar Bank).</p>
                <p>3. Masukkan nomor Virtual Account di atas.</p>
                <p>4. Pastikan nominal pembayaran sama persis dengan tagihan.</p>
              </div>
            </div>
          ) : (
            /* Default Mock Flow */
            <div className="flex flex-col flex-grow justify-between">
              <div className="text-center py-6 flex flex-col items-center">
                <Smartphone className="w-12 h-12 text-[#8b6f66] mb-4" />
                <p className="text-sm font-semibold text-[#3a221c]">Metode Pembayaran Umum</p>
                <p className="text-xs text-[#8b6f66] mt-2">Buka aplikasi billing merchant Anda untuk melanjutkan proses transfer.</p>
              </div>
              <div className="text-left text-[11px] text-[#5f463d] border-t border-[#e6d1c7] pt-4 leading-relaxed">
                <p className="font-bold text-[#3a221c]">Petunjuk:</p>
                <p>Silakan selesaikan pembayaran sesuai tagihan invoice, kemudian tekan tombol konfirmasi di sebelah kanan.</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Card: Summary & Action */}
        <div className="bg-[#ede8e0]/90 border border-[#e6d1c7] p-8 rounded-sm shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-[#e6d1c7] mb-6">
              <CreditCard className="w-5 h-5 text-[#3a221c]" />
              <h2 className="text-xs tracking-[0.2em] uppercase font-bold text-[#3a221c]">
                Rincian Tagihan
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[9px] text-[#8b6f66] uppercase tracking-wider block">No. Invoice</span>
                <span className="font-mono text-xs font-bold text-[#3a221c]">{invoice}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#8b6f66] uppercase tracking-wider block">Item</span>
                <span className="text-xs font-bold text-[#3a221c]">{namaPaket}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#8b6f66] uppercase tracking-wider block">Total Pembayaran</span>
                <span className="text-2xl text-[#3a221c] font-semibold block mt-1" style={{ fontFamily: "var(--font-playfair)" }}>
                  IDR {amount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-4 border-t border-[#e6d1c7]/50 mt-6">
            <button
              disabled={isProcessing}
              onClick={() => handleConfirmPayment("SUCCESS")}
              className="w-full py-4 bg-[#3a221c] text-[#f8f1ea] hover:bg-[#1a1110] text-xs font-bold uppercase tracking-[0.3em] transition-all duration-300 rounded-sm shadow-md flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Saya Sudah Bayar
            </button>
            
            <button
              disabled={isProcessing}
              onClick={() => handleConfirmPayment("FAILED")}
              className="w-full py-3 border border-red-800/30 text-red-900 hover:bg-red-500/10 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 rounded-sm flex justify-center items-center gap-2 disabled:opacity-50"
            >
              Batalkan Transaksi
            </button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => router.push("/service")}
          className="inline-flex items-center gap-2 text-xs text-[#8b6f66] hover:text-[#3a221c] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Layanan</span>
        </button>
      </div>
    </div>
  );
}

export default function MockPaymentPage() {
  return (
    <main className="min-h-screen bg-[#E1D5C9] text-[#2B1D19] relative overflow-hidden flex flex-col justify-between">
      <SiteNavbar />
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] overflow-hidden">
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
      <div className="flex-grow flex items-center justify-center">
        <Suspense
          fallback={
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-[#3a221c]/10 border-t-[#3a221c] rounded-full animate-spin"></div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#8b6f66]">
                Memuat Halaman Simulasi...
              </p>
            </div>
          }
        >
          <MockPaymentContent />
        </Suspense>
      </div>
      <SiteFooter />
    </main>
  );
}
