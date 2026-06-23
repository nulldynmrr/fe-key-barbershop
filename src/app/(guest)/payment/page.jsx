"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight, Landmark, Check, Store, QrCode } from "lucide-react";
import SiteNavbar from "../../../components/SiteNavbar";
import api from "@/utils/request";

// Map UI method strings to DOKU API expected payment method types
const getDokuPaymentMethod = (selectedMethod) => {
  const methodMap = {
    // QRIS
    QRIS: "QRIS",
    // Virtual Accounts
    BNI: "VIRTUAL_ACCOUNT_BNI",
    BRI: "VIRTUAL_ACCOUNT_BRI",
    BSI: "VIRTUAL_ACCOUNT_BANK_SYARIAH_MANDIRI",
    CIMB: "VIRTUAL_ACCOUNT_BANK_CIMB",
    Danamon: "VIRTUAL_ACCOUNT_BANK_DANAMON",
    Maybank: "VIRTUAL_ACCOUNT_MAYBANK",
    Permata: "VIRTUAL_ACCOUNT_BANK_PERMATA",
    BNC: "VIRTUAL_ACCOUNT_BNC",
    BTN: "VIRTUAL_ACCOUNT_BTN",
    Sinarmas: "VIRTUAL_ACCOUNT_SINARMAS",
    // Convenience Stores
    Alfamart: "ONLINE_TO_OFFLINE_ALFA",
    Indomaret: "ONLINE_TO_OFFLINE_INDOMARET",
  };
  return methodMap[selectedMethod] || null;
};

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isProcessingLoading, setIsProcessingLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCloseModal = () => {
    if (invoiceNumber) {
      router.push(`/payment/callback?invoice=${invoiceNumber}`);
    } else {
      setShowModal(false);
    }
  };

  const plan = searchParams.get("plan") || "Master's Collection";
  const price = searchParams.get("price") || "Rp 550.000";
  const tier = searchParams.get("tier") || "Premium Member";
  const type = searchParams.get("type");
  const packageId = searchParams.get("package_id");
  const amountStr = searchParams.get("amount") || "0";
  const amount = parseInt(amountStr, 10);

  const handlePayment = async () => {
    if (!selectedMethod) return;
    setIsProcessingLoading(true);

    try {
      if (type === "package" && packageId) {
        // Call Backend to Create Package Transaction using Axios API Client
        const response = await api.post("/payments/create-transaction", {
          package_id: packageId,
          amount: amount,
          nama_paket: plan,
          doku_payment_method: getDokuPaymentMethod(selectedMethod),
        });

        if (response.data && response.data.success && response.data.data?.payment_url) {
          setPaymentUrl(response.data.data.payment_url);
          setInvoiceNumber(response.data.data.invoice_number);
          setShowModal(true);
          setIsProcessingLoading(false);
        } else {
          console.error("Failed to generate payment link for package", response.data);
          setIsProcessingLoading(false);
        }
      } else {
        // 1. Call Backend to Create DOKU Checkout Link for haircut bookings
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/create-payment`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              plan,
              price,
              tier,
              method: selectedMethod,
              doku_payment_method: getDokuPaymentMethod(selectedMethod),
            }),
          },
        );

        const result = await response.json();

        // 2. Redirect to DOKU Payment Page
        if (result?.data?.payment_url) {
          setPaymentUrl(result.data.payment_url);
          const invFromUrl = result.data.payment_url.split("/").pop();
          setInvoiceNumber(result.data.invoice_number || invFromUrl || `INV-${Date.now()}`);
          setShowModal(true);
          setIsProcessingLoading(false);
        } else {
          console.error("Failed to generate payment link", result);
          setIsProcessingLoading(false);
        }
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      setIsProcessingLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-2 lg:py-3 flex-grow flex flex-col justify-between lg:overflow-hidden animate-fade-in min-h-0">
      {/* Header (Highly Compact) */}
      <div className="text-center mb-1.5 flex-shrink-0">
        <p
          className="text-[9px] tracking-[0.4em] uppercase text-[#8b6f66] mb-0.5"
          style={{ fontFamily: "var(--font-be-vietnam)" }}
        >
          Checkout
        </p>
        <h1
          className="text-xl sm:text-2xl lg:text-3xl text-[#3a221c] mb-0.5"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Finalize Your Ritual
        </h1>
        <p
          className="max-w-2xl mx-auto text-[11px] text-[#5f463d] leading-relaxed opacity-85"
          style={{ fontFamily: "var(--font-plus-jakarta)" }}
        >
          Complete your payment to secure your artisanal grooming session at Key Barber.
        </p>
      </div>

      {/* Stepper (Compact & Clean) */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 mb-2.5 text-[8px] sm:text-[9px] tracking-[0.2em] uppercase font-semibold flex-shrink-0">
        <div className="flex items-center gap-2 text-[#3a221c]">
          <span className="w-4 h-4 rounded-full border border-[#3a221c] flex items-center justify-center text-[7px] font-bold">
            01
          </span>
          <span>Payment Method</span>
        </div>
        <div className="h-px w-8 sm:w-12 bg-[#e6d1c7]"></div>
        <div className="flex items-center gap-2 text-[#8b6f66]/50">
          <span className="w-4 h-4 rounded-full border border-[#8b6f66]/30 flex items-center justify-center text-[7px] font-bold">
            02
          </span>
          <span>Processing</span>
        </div>
        <div className="h-px w-8 sm:w-12 bg-[#e6d1c7]"></div>
        <div className="flex items-center gap-2 text-[#8b6f66]/50">
          <span className="w-4 h-4 rounded-full border border-[#8b6f66]/30 flex items-center justify-center text-[7px] font-bold">
            03
          </span>
          <span>Confirmation</span>
        </div>
      </div>

      <div 
        className="flex flex-col lg:flex-row gap-6 items-stretch flex-grow lg:min-h-0 lg:overflow-hidden min-h-0"
        style={isDesktop ? { height: "calc(100vh - 235px)" } : undefined}
      >
        {/* Left Panel: Reservation Details (Compact) */}
        <div className="w-full lg:w-[38%] bg-[#ede8e0]/80 backdrop-blur-sm border border-[#e6d1c7] p-4 lg:p-5 rounded-2xl shadow-md flex flex-col justify-between flex-shrink-0 lg:max-h-full min-h-0">
          <div>
            <h2
              className="text-base lg:text-lg text-[#3a221c] mb-3 font-semibold"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Reservation Details
            </h2>

            <div className="space-y-2.5">
              <div className="flex justify-between items-start pt-2.5 border-t border-[#e6d1c7]/50">
                <span className="text-[9px] tracking-[0.2em] uppercase text-[#8b6f66]">
                  {type === "package" ? "Package" : "Service"}
                </span>
                <div className="text-right">
                  <p className="text-xs font-semibold text-[#3a221c]">{plan}</p>
                  {type !== "package" && <p className="text-[9px] text-[#8b6f66] mt-0.5">{tier}</p>}
                </div>
              </div>

              {type === "package" ? (
                <div className="flex justify-between items-center py-2.5 border-t border-[#e6d1c7]/50">
                  <span className="text-[9px] tracking-[0.2em] uppercase text-[#8b6f66]">
                    Delivery
                  </span>
                  <span className="text-xs font-semibold text-[#3a221c]">
                    Instant Activation
                  </span>
                </div>
              ) : (
                <div className="flex justify-between items-center py-2.5 border-t border-[#e6d1c7]/50">
                  <span className="text-[9px] tracking-[0.2em] uppercase text-[#8b6f66]">
                    Date & Time
                  </span>
                  <span className="text-xs font-semibold text-[#3a221c]">
                    Oct 24, 2025 • 14:00
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-[#3a221c]/20 mt-3">
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#8b6f66]">
              Total Amount
            </span>
            <p
              className="text-xl lg:text-2xl text-[#3a221c] mt-0.5 font-semibold"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {price}
            </p>
          </div>
        </div>

        {/* Right Panel: Payment Methods (Scroll-Controlled on Desktop) */}
        <div className="w-full lg:w-[62%] flex flex-col justify-between lg:overflow-hidden min-h-0 space-y-3">
          <div className="space-y-3 lg:overflow-y-auto lg:flex-grow pr-1.5 min-h-0">
            {/* QRIS / E-Wallet */}
            <section>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-0.5 h-3 bg-[#3a221c]"></div>
                <h3 className="text-[9px] tracking-[0.2em] uppercase font-bold text-[#3a221c]">
                  QRIS
                </h3>
              </div>
              <button
                key="QRIS"
                onClick={() => !isProcessingLoading && setSelectedMethod("QRIS")}
                className={`w-full flex items-center gap-3 border p-3 transition-all duration-300 text-left relative overflow-hidden rounded-xl cursor-pointer ${selectedMethod === "QRIS" ? "bg-[#3a221c] border-[#3a221c] text-[#f8f1ea] shadow-md" : "bg-[#ede8e0] border-[#e6d1c7] text-[#3a221c] hover:bg-[#e6d1c7]/30"}`}
              >
                <QrCode
                  className={`w-4 h-4 ${selectedMethod === "QRIS" ? "text-[#f8f1ea]" : "text-[#3a221c]"}`}
                  strokeWidth={1.5}
                />
                <span className="text-[11px] font-semibold tracking-wide">
                  QRIS
                </span>
                {selectedMethod === "QRIS" && (
                  <div className="absolute top-1.5 right-1.5">
                    <Check className="w-2.5 h-2.5 text-[#f8f1ea]" strokeWidth={3} />
                  </div>
                )}
              </button>
            </section>

            {/* Virtual Account */}
            <section>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-0.5 h-3 bg-[#3a221c]"></div>
                <h3 className="text-[9px] tracking-[0.2em] uppercase font-bold text-[#3a221c]">
                  Virtual Account
                </h3>
              </div>
              {/* Grid container (No inner scrollbar) */}
              <div className="border border-[#e6d1c7]/40 bg-[#ede8e0]/20 p-2.5 rounded-xl">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
                  {["BNI", "BRI", "BSI", "CIMB", "Danamon", "Maybank", "Permata", "BNC", "BTN", "Sinarmas"].map((bank) => (
                    <button
                      key={bank}
                      onClick={() => !isProcessingLoading && setSelectedMethod(bank)}
                      className={`flex items-center gap-2 border p-2.5 transition-all duration-300 text-left relative rounded-lg cursor-pointer ${selectedMethod === bank ? "bg-[#3a221c] border-[#3a221c] text-[#f8f1ea] shadow-md" : "bg-[#ede8e0] border-[#e6d1c7] text-[#3a221c] hover:bg-[#e6d1c7]/30"}`}
                    >
                      <Landmark
                        className={`w-3.5 h-3.5 ${selectedMethod === bank ? "text-[#f8f1ea]" : "text-[#3a221c]"}`}
                        strokeWidth={1.5}
                      />
                      <span className="text-[10px] font-semibold tracking-wider">
                        {bank}
                      </span>
                      {selectedMethod === bank && (
                        <div className="absolute top-1.5 right-1.5 animate-fade-in">
                          <Check className="w-2.5 h-2.5 text-[#f8f1ea]" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Convenience Store */}
            <section>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-0.5 h-3 bg-[#3a221c]"></div>
                <h3 className="text-[9px] tracking-[0.2em] uppercase font-bold text-[#3a221c]">
                  Convenience Store (O2O)
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {["Alfamart", "Indomaret"].map((store) => (
                  <button
                    key={store}
                    onClick={() => !isProcessingLoading && setSelectedMethod(store)}
                    className={`flex items-center gap-2 border p-3 transition-all duration-300 text-left relative rounded-lg cursor-pointer ${selectedMethod === store ? "bg-[#3a221c] border-[#3a221c] text-[#f8f1ea] shadow-md" : "bg-[#ede8e0] border-[#e6d1c7] text-[#3a221c] hover:bg-[#e6d1c7]/30"}`}
                  >
                    <Store
                      className={`w-3.5 h-3.5 ${selectedMethod === store ? "text-[#f8f1ea]" : "text-[#3a221c]"}`}
                      strokeWidth={1.5}
                    />
                    <span className="text-[11px] font-semibold tracking-wider">
                      {store}
                    </span>
                    {selectedMethod === store && (
                      <div className="absolute top-1.5 right-1.5 animate-fade-in">
                        <Check className="w-2.5 h-2.5 text-[#f8f1ea]" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Pay Button */}
          <div className="pt-3 border-t border-[#e6d1c7]/40 flex-shrink-0">
            <button
              disabled={!selectedMethod || isProcessingLoading}
              onClick={handlePayment}
              className={`w-full py-3.5 flex items-center justify-center text-xs font-semibold uppercase tracking-[0.3em] transition-all duration-500 rounded-xl shadow-md cursor-pointer ${selectedMethod ? "bg-[#4a1a1a] text-[#f8f1ea] hover:bg-[#3a221c] hover:scale-[1.01]" : "bg-[#8b6f66]/20 text-[#8b6f66] cursor-not-allowed"}`}
              style={{ fontFamily: "var(--font-be-vietnam)" }}
            >
              {isProcessingLoading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : selectedMethod ? (
                "Complete Transaction"
              ) : (
                "Select Payment Method"
              )}
            </button>
            <p className="text-center text-[8px] text-[#8b6f66] mt-1.5 tracking-wider uppercase opacity-60">
              Secured by Key Barber Payment Gateway
            </p>
          </div>
        </div>
      </div>

      {/* Embedded Iframe Modal */}
      {showModal && paymentUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-10 animate-fade-in">
          <div className="relative w-full max-w-5xl h-[85vh] bg-[#ede8e0] border border-[#e6d1c7] rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-[#3a221c] text-[#f8f1ea] border-b border-[#e6d1c7]/20">
              <div>
                <h3 className="font-semibold text-xs sm:text-sm tracking-wider uppercase" style={{ fontFamily: "var(--font-be-vietnam)" }}>
                  Secure Checkout
                </h3>
                <p className="text-[9px] sm:text-[10px] opacity-75 mt-1 font-mono">Invoice: {invoiceNumber}</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-[#f8f1ea] text-[#3a221c] hover:bg-[#ede8e0] rounded-lg transition-all font-bold text-[10px] tracking-widest uppercase shadow cursor-pointer"
              >
                Tutup / Cek Status
              </button>
            </div>
            {/* Iframe container */}
            <div className="flex-grow w-full relative bg-white">
              <iframe
                src={paymentUrl}
                className="w-full h-full border-0"
                title="Doku Payment Checkout"
                allow="payment"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentPage() {
  return (
    <main className="min-h-screen lg:h-screen lg:min-h-0 lg:overflow-hidden bg-[#E1D5C9] text-[#2B1D19] relative flex flex-col justify-between">
      <SiteNavbar />
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
      <div className="flex-grow flex flex-col justify-center lg:overflow-hidden min-h-0">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-[#3a221c]/10 border-t-[#3a221c] rounded-full animate-spin"></div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#8b6f66]">
                  Initializing Checkout...
                </p>
              </div>
            </div>
          }
        >
          <PaymentContent />
        </Suspense>
      </div>
    </main>
  );
}
