"use client";

import React, { useState, useEffect } from "react";
import { Scissors, Sparkles, Heart, Palette, Check, X, Loader2 } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";
import SeparatorKey from "@/components/SeparatorKey";
import { Separator } from "@/components/ui/separator";
import api from "@/utils/request";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";

const servicesNavItems = [
  { label: "Home", href: "/home" },
  { label: "Services", href: "#services", active: true },
  { label: "AI Feature", href: "/ai" },
  { label: "Gallery", href: "#gallery" },
];

const services = [
  {
    icon: Scissors,
    title: "Classic Haircut",
    description: "Precision cuts tailored to your features, delivering a clean and timeless finish.",
    price: "IDR 100K",
  },
  {
    icon: Sparkles,
    title: "Perming",
    description: "Natural texture and volume designed to enhance movement and overall style.",
    price: "IDR 90K - 550K",
  },
  {
    icon: Heart,
    title: "Keratin Treatment",
    description: "Smoothing treatment that reduces frizz and improves control for a polished look.",
    price: "IDR 500K",
  },
  {
    icon: Palette,
    title: "Coloring",
    description: "Custom color work to enhance depth, tone, and personal style.",
    price: "IDR 200K - 700K",
  },
];

function ServiceCard({ icon: Icon, title, description, price }) {
  return (
    <article className="flex flex-col border border-[#8b6f59]/30 bg-[#FFFFFF]/3 p-6 text-left transition hover:border-[#b89256]/50">
      <div className="mb-4 flex justify-left">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-[#fff]/10 bg-[#FFFFFF]/3">
          <Icon className="h-7 w-7 text-[#c57e7b]" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-[#f7e7d8]" style={{ fontFamily: "var(--font-noto-serif)" }}>
        {title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-[#d8b9b1]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
        {description}
      </p>
      <br />
      <Separator className={"bg-[#8b6f59]/30"}></Separator>
      <p className="mt-4 text-sm font-light" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
        {price}
      </p>
    </article>
  );
}

function PricingCard({ pkg }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isBuying, setIsBuying] = useState(false);

  const handleBuy = async () => {
    const token = Cookies.get("user_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setIsBuying(true);
      const res = await api.post("/payments/buy-package", { package_id: pkg.id });
      if (res.data && res.data.success) {
        showToast("Paket berhasil dibeli dan diaktifkan!", "success");
        router.push("/ai");
      }
    } catch (err) {
      console.error("Gagal membeli paket:", err);
      showToast(err.response?.data?.message || "Gagal membeli paket", "error");
    } finally {
      setIsBuying(false);
    }
  };
  const allFeatures = [
    { key: "featStandardScan", label: "Standard Face Shape Detection" },
    { key: "featSymmetry", label: "Facial Symmetry Scoring" },
    { key: "featAdvMapping", label: "Advanced Feature Mapping" },
    { key: "featFaceHeatmap", label: "Face Heatmap Analysis" },
    { key: "featHairAnalysis", label: "Hair & Scalp Analysis" },
    { key: "featRiskAnalysis", label: "Risk Analysis Scoring" },
    { key: "featBarberInstructions", label: "Barber Instructions" },
    { key: "featVirtualTryOn", label: "Virtual Try-on Generation" },
    { key: "featHistory", label: "Extended History Storage" },
    { key: "featTrendAnalysis", label: "Hairstyle Trend Analysis" },
  ];

  const isFeatureActive = (val) =>
    val === 1 || val === "1" || val === true || String(val).toLowerCase() === "true";

  const activeFeats = allFeatures.filter((f) => isFeatureActive(pkg[f.key]));
  const inactiveFeats = allFeatures.filter((f) => !isFeatureActive(pkg[f.key]));
  const displayedFeats = [...activeFeats, ...inactiveFeats.slice(0, 2)];

  return (
    <article className={`relative flex flex-col border p-8 transition bg-[#FFFFFF]/3 h-full w-full ${pkg.is_promo ? "border-[#EDE8E0]/30 md:scale-[1.04] md:-translate-y-1 md:shadow-2xl md:shadow-black/15" : "border-[#8b6f59]/30"}`}>
      {pkg.is_promo && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#934B19] px-3 py-1 text-xs uppercase tracking-wider font-light" style={{ fontFamily: "var(--font-be-vietnam)" }}>
          Promo Active
        </div>
      )}

      <p className="text-xs uppercase tracking-wider text-[#d8b9b1]" style={{ fontFamily: "var(--font-be-vietnam)" }}>
        {pkg.tipe || pkg.typeValue}
      </p>

      <h3 className="mt-2 text-2xl font-semibold text-[#f7e7d8]" style={{ fontFamily: "var(--font-noto-serif)" }}>
        {pkg.nama || pkg.namaPaket}
      </h3>

      <div className="mt-3 flex items-baseline gap-2 text-[#f7e7d8]" style={{ fontFamily: "var(--font-noto-serif)" }}>
        <span className="text-3xl font-bold">{pkg.koin || pkg.jumlahKoin}</span>
        <span className="text-sm font-medium opacity-80">Credits</span>
      </div>

      {pkg.durasi_text && (
        <p className="mt-1 text-xs text-[#c57e7b]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
          Valid for: {pkg.durasi_text}
        </p>
      )}

      <ul className="mt-6 flex-1 space-y-3">
        {displayedFeats.map((feat, idx) => {
          const active = isFeatureActive(pkg[feat.key]);
          return (
            <li key={idx} className="flex items-start gap-3">
              {active ? (
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#EDE8E0]" />
              ) : (
                <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400/50" />
              )}
              <span
                className={`text-sm transition-opacity ${active ? "text-[#d8b9b1]" : "text-[#d8b9b1]/40 line-through"}`}
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                {feat.label}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 space-y-4">
        <div>
          {pkg.is_promo && pkg.harga_asli ? (
            <div className="flex flex-col">
              <span className="text-sm text-[#c57e7b] line-through">IDR {pkg.harga_asli.toLocaleString('id-ID')}</span>
              <span className="text-xl font-light" style={{ fontFamily: "var(--font-plus-jakarta)" }}>IDR {pkg.harga_bayar?.toLocaleString('id-ID')}</span>
            </div>
          ) : (
            <span className="text-xl font-light" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
              IDR {pkg.harga_bayar?.toLocaleString('id-ID') || (pkg.hargaNominal?.toLocaleString('id-ID'))}
            </span>
          )}
        </div>

        <button
          onClick={handleBuy}
          disabled={isBuying}
          className={`w-full flex justify-center items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition ${pkg.is_promo ? "bg-[#f7f1ea] text-[#2b1d19] hover:bg-[#ede8e0]" : "border border-[#8b6f59] text-[#f7e7d8] hover:bg-[#5d1818]"} disabled:opacity-50`}
          style={{ fontFamily: "var(--font-be-vietnam)" }}
        >
          {isBuying ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Buy Now
        </Link>
      </div>
    </article>
  );
}

export default function ServicesPage() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  const fetchPricingPlans = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/packages", { page: 1, limit: 10 });
      if (res.data && res.data.success) {
        const allPackages = [
          ...(res.data.data.topup_koin || []),
          ...(res.data.data.langganan_premium || [])
        ];

        allPackages.sort((a, b) => (a.harga_bayar || a.hargaNominal) - (b.harga_bayar || b.hargaNominal));

        setPackages(allPackages);
      }
    } catch (err) {
      console.error("Failed to fetch packages:", err);
      setError("Unable to load pricing packages at this moment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#4A1A1A] text-[#f7f1ea] scroll-smooth">
      <SiteNavbar activeLabel="Services" />
      <div className="bg-radial from-black/0 to-black/40">
        {/* Header Section */}
        <section className="mx-auto max-w-7xl px-6 pb-20 pt-24 lg:px-10 lg:pt-32">
          <div className="text-center">
            <p className="text-xl uppercase tracking-[0.5em] text-[#C57E7B]" style={{ fontFamily: "var(--font-be-vietnam)" }}>
              The Art of Grooming
            </p>
            <h1 className="mt-4 text-xl font-light text-[#f7f1ea] sm:text-2xl lg:text-3xl" style={{ fontFamily: "var(--font-playfair)" }}>
              Premium Grooming for the Modern Gentleman
            </h1>
          </div>
        </section>

        <SeparatorKey></SeparatorKey>

        {/* Services Grid (Salon Services) */}
        <section className="mx-auto max-w-6xl px-6 pb-20 lg:px-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, idx) => (
              <ServiceCard key={idx} {...service} />
            ))}
          </div>
        </section>

        {/* AI Enhanced Section (Pricing API Integration) */}
        <section className="mx-auto max-w-6xl px-6 pb-20 lg:px-10">
          <div className="text-center">
            <p className="text-xl uppercase tracking-[0.5em] text-[#C57E7B]" style={{ fontFamily: "var(--font-be-vietnam)" }}>
              AI-Enhanced Experience
            </p>
            <h2 className="mt-4 text-3xl font-light text-[#f7f1ea] sm:text-4xl" style={{ fontFamily: "var(--font-playfair)" }}>
              Digital Ritual Credits
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#d8b9b1]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
              Fuel your AI style exploration with our credit packages. Use credits for high-definition facial mapping and style simulations.
            </p>
          </div>

          {/* Pricing Cards Rendering */}
          <div className="mt-16">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#c57e7b]" />
                <p className="mt-4 text-sm text-[#d8b9b1]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>Loading available packages...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 border border-[#8b6f59]/30 bg-[#FFFFFF]/3 rounded-lg">
                <p className="text-[#c57e7b]">{error}</p>
              </div>
            ) : packages.length === 0 ? (
              <div className="text-center py-12 border border-[#8b6f59]/30 bg-[#FFFFFF]/3 rounded-lg">
                <p className="text-[#d8b9b1]">No packages available at the moment. Please check back later.</p>
              </div>
            ) : (

              <div className={
                packages.length === 1
                  ? "flex justify-center"
                  : "grid grid-cols-1 gap-8 md:grid-cols-3 items-stretch"
              }>
                {packages.map((pkg, idx) => (
                  <div key={pkg.id || idx} className={packages.length === 1 ? "w-full max-w-sm" : "w-full"}>
                    <PricingCard pkg={pkg} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}