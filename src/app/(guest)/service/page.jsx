"use client";

import Link from "next/link";
import { Scissors, Sparkles, Heart, Palette, Check } from "lucide-react";
import SiteFooter from "../../../components/SiteFooter";
import SiteNavbar from "../../../components/SiteNavbar";
import SeparatorKey from "@/components/SeparatorKey";
import { Separator } from "@/components/ui/separator";

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

const pricingPlans = [
  {
    tier: "Entry Level",
    title: "Starter",
    credits: "50 Credits",
    features: ["Standard Visual Exports", "Style Recommendations", "Priority Processing"],
    price: "IDR 75.000",
    recommended: false,
  },
  {
    tier: "Most Popular",
    title: "Gentleman's Choice",
    credits: "300 Credits",
    features: ["Face Shape Analysis", "Personalised Style Suggestions", "Explore Multiple Styles"],
    price: "IDR 195.000",
    recommended: true,
  },
  {
    tier: "Ultimate Value",
    title: "Master's Collection",
    credits: "Premium Member",
    features: ["Unlimited Style Exploration", "High-Resolution Visual Results", "Priority Processing"],
    price: "IDR 550.000",
    recommended: false,
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

function PricingCard({ tier, title, credits, features, price, recommended }) {
  return (
    <article className={`relative flex flex-col border p-8 transition bg-[#FFFFFF]/3 ${recommended ? "border-[#EDE8E0]/30 md:scale-[1.04] md:-translate-y-1 md:shadow-2xl md:shadow-black/15" : "border-[#8b6f59]/30"}`}>
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#934B19] px-3 py-1 text-xs uppercase tracking-wider font-light" style={{ fontFamily: "var(--font-be-vietnam)" }}>
          Recommended
        </div>
      )}

      <p className="text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-be-vietnam)" }}>
        {tier}
      </p>

      <h3 className="mt-2 text-2xl font-semibold text-[#f7e7d8]" style={{ fontFamily: "var(--font-noto-serif)" }}>
        {title}
      </h3>

      <p className="mt-3 text-3xl font-bold text-[#f7e7d8]" style={{ fontFamily: "var(--font-noto-serif)" }}>
        {credits}
      </p>

      <ul className="mt-6 flex-1 space-y-3">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#EDE8E0]" />
            <span className="text-sm text-[#d8b9b1]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-8 space-y-4">
        <p className="text-lg font-light" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
          {price}
        </p>
        <Link
          href={`/payment?plan=${encodeURIComponent(title)}&price=${encodeURIComponent(price)}&tier=${encodeURIComponent(credits)}`}
          className={`w-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition inline-block text-center ${recommended ? "bg-[#f7f1ea] text-[#2b1d19] hover:bg-[#ede8e0]" : "border border-[#8b6f59] text-[#f7e7d8] hover:bg-[#5d1818]"}`}
          style={{ fontFamily: "var(--font-be-vietnam)" }}
        >
          Buy Now
        </Link>
      </div>
    </article>
  );
}

export default function ServicesPage() {
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

        {/* Services Grid */}
        <section className="mx-auto max-w-6xl px-6 pb-20 lg:px-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, idx) => (
              <ServiceCard key={idx} {...service} />
            ))}
          </div>
        </section>

        {/* AI Enhanced Section */}
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

          {/* Pricing Cards */}
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {pricingPlans.map((plan, idx) => (
              <PricingCard key={idx} {...plan} />
            ))}
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
