"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight, Landmark, Check, Store } from "lucide-react";
import SiteNavbar from "../../../components/SiteNavbar";
import SiteFooter from "../../../components/SiteFooter";
import api from "@/utils/request";

// Map UI method strings to DOKU API expected payment method types
const getDokuPaymentMethod = (selectedMethod) => {
  const methodMap = {
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
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:px-10 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <p
          className="text-[10px] tracking-[0.4em] uppercase text-[#8b6f66] mb-4"
          style={{ fontFamily: "var(--font-be-vietnam)" }}
        >
          Checkout
        </p>
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl text-[#3a221c] mb-6"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Finalize Your Ritual
        </h1>
        <p
          className="max-w-2xl mx-auto text-sm sm:text-base text-[#5f463d] leading-relaxed"
          style={{ fontFamily: "var(--font-plus-jakarta)" }}
        >
          Complete your payment to secure your artisanal grooming session at Key
          Barber.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 mb-16 text-[10px] sm:text-xs tracking-[0.25em] uppercase font-semibold">
        <div className="flex items-center gap-3 text-[#3a221c]">
          <span className="w-6 h-6 rounded-full border border-[#3a221c] flex items-center justify-center text-[8px] font-bold">
            01
          </span>
          <span>Payment Method</span>
        </div>
        <div className="h-px w-12 sm:w-20 bg-[#e6d1c7]"></div>
        <div className="flex items-center gap-3 text-[#8b6f66]/50">
          <span className="w-6 h-6 rounded-full border border-[#8b6f66]/30 flex items-center justify-center text-[8px] font-bold">
            02
          </span>
          <span>Processing</span>
        </div>
        <div className="h-px w-12 sm:w-20 bg-[#e6d1c7]"></div>
        <div className="flex items-center gap-3 text-[#8b6f66]/50">
          <span className="w-6 h-6 rounded-full border border-[#8b6f66]/30 flex items-center justify-center text-[8px] font-bold">
            03
          </span>
          <span>Confirmation</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[0.4fr_0.6fr] gap-12 items-start">
        {/* Left Panel: Reservation Details */}
        <div className="bg-[#ede8e0]/80 backdrop-blur-sm border border-[#e6d1c7] p-8 sm:p-10 rounded-sm shadow-[0_30px_60px_-15px_rgba(57,28,22,0.1)] sticky top-32 transition-all hover:shadow-[0_40px_80px_-15px_rgba(57,28,22,0.15)]">
          <h2
            className="text-2xl text-[#3a221c] mb-8"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Reservation Details
          </h2>

          <div className="space-y-6">
            <div className="flex justify-between items-start pt-6 border-t border-[#e6d1c7]/50">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#8b6f66]">
                {type === "package" ? "Package" : "Service"}
              </span>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#3a221c]">{plan}</p>
                {type !== "package" && <p className="text-[10px] text-[#8b6f66] mt-1">{tier}</p>}
              </div>
            </div>

            {type === "package" ? (
              <div className="flex justify-between items-center py-6 border-t border-[#e6d1c7]/50">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#8b6f66]">
                  Delivery
                </span>
                <span className="text-sm font-semibold text-[#3a221c]">
                  Instant Activation
                </span>
              </div>
            ) : (
              <div className="flex justify-between items-center py-6 border-t border-[#e6d1c7]/50">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#8b6f66]">
                  Date & Time
                </span>
                <span className="text-sm font-semibold text-[#3a221c]">
                  Oct 24, 2025 • 14:00
                </span>
              </div>
            )}

            <div className="pt-8 border-t border-[#3a221c]/20">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#8b6f66]">
                Total Amount
              </span>
              <p
                className="text-3xl sm:text-4xl text-[#3a221c] mt-2"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {price}
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Payment Methods */}
        <div className="space-y-10 pb-20">
          {/* Virtual Account */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-0.5 h-4 bg-[#3a221c]"></div>
              <h3 className="text-[11px] tracking-[0.3em] uppercase font-bold text-[#3a221c]">
                Virtual Account
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {["BNI", "BRI", "BSI", "CIMB", "Danamon", "Maybank", "Permata", "BNC", "BTN", "Sinarmas"].map((bank) => (
                <button
                  key={bank}
                  onClick={() =>
                    !isProcessingLoading && setSelectedMethod(bank)
                  }
                  className={`flex items-center gap-4 border p-5 transition-all duration-300 text-left relative overflow-hidden group ${selectedMethod === bank ? "bg-[#3a221c] border-[#3a221c] text-[#f8f1ea] shadow-lg scale-[1.02]" : "bg-[#ede8e0] border-[#e6d1c7] text-[#3a221c] hover:bg-[#e6d1c7]/50 hover:border-[#3a221c]/30"}`}
                >
                  <Landmark
                    className={`w-5 h-5 ${selectedMethod === bank ? "text-[#f8f1ea]" : "text-[#3a221c]"}`}
                    strokeWidth={1.5}
                  />
                  <span className="text-xs font-semibold tracking-wider">
                    {bank}
                  </span>
                  {selectedMethod === bank && (
                    <div className="absolute top-2 right-2 animate-fade-in">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Convenience Store */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-0.5 h-4 bg-[#3a221c]"></div>
              <h3 className="text-[11px] tracking-[0.3em] uppercase font-bold text-[#3a221c]">
                Convenience Store (O2O)
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {["Alfamart", "Indomaret"].map((store) => (
                <button
                  key={store}
                  onClick={() =>
                    !isProcessingLoading && setSelectedMethod(store)
                  }
                  className={`flex items-center gap-4 border p-5 transition-all duration-300 text-left relative overflow-hidden group ${selectedMethod === store ? "bg-[#3a221c] border-[#3a221c] text-[#f8f1ea] shadow-lg scale-[1.02]" : "bg-[#ede8e0] border-[#e6d1c7] text-[#3a221c] hover:bg-[#e6d1c7]/50 hover:border-[#3a221c]/30"}`}
                >
                  <Store
                    className={`w-5 h-5 ${selectedMethod === store ? "text-[#f8f1ea]" : "text-[#3a221c]"}`}
                    strokeWidth={1.5}
                  />
                  <span className="text-xs font-semibold tracking-wider">
                    {store}
                  </span>
                  {selectedMethod === store && (
                    <div className="absolute top-2 right-2 animate-fade-in">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Pay Button */}
          <div className="pt-6">
            <button
              disabled={!selectedMethod || isProcessingLoading}
              onClick={handlePayment}
              className={`w-full py-6 flex items-center justify-center text-sm font-semibold uppercase tracking-[0.4em] transition-all duration-500 rounded-sm shadow-xl ${selectedMethod ? "bg-[#4a1a1a] text-[#f8f1ea] hover:bg-[#3a221c] hover:scale-[1.02] active:scale-[0.98]" : "bg-[#8b6f66]/20 text-[#8b6f66] cursor-not-allowed"}`}
              style={{ fontFamily: "var(--font-be-vietnam)" }}
            >
              {isProcessingLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : selectedMethod ? (
                "Complete Transaction"
              ) : (
                "Select Payment Method"
              )}
            </button>
            <p className="text-center text-[9px] text-[#8b6f66] mt-4 tracking-wider uppercase opacity-60">
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
                className="px-4 py-2 bg-[#f8f1ea] text-[#3a221c] hover:bg-[#ede8e0] rounded-lg transition-all font-bold text-[10px] tracking-widest uppercase shadow"
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
    <main className="min-h-screen bg-[#E1D5C9] text-[#2B1D19] relative overflow-hidden flex flex-col">
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
      <div className="flex-grow">
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
      <SiteFooter />
    </main>
  );
}
