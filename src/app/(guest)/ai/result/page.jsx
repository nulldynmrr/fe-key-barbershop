"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ScanFace, Sparkles, Upload } from "lucide-react";
import SiteFooter from "../../../../components/SiteFooter";
import SiteNavbar from "../../../../components/SiteNavbar";
import SeparatorKey from "@/components/SeparatorKey";
import Link from "next/link";

const aiNavItems = [
  { label: "Home", href: "/home" },
  { label: "AI Feature", href: "#ai-feature", active: true },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
];

const recommendationStats = [
  { label: "Gender", value: "Male" },
  { label: "Face Shape", value: "Oval" },
  { label: "Hair Type", value: "Straight" },
  { label: "Structure", value: "Thick & Straight" },
  { label: "Forehead", value: "Proportional" },
];

const featurePills = [
  "Face Shape Analysis",
  "Texture Matching",
  "Artisanal Curation",
];

const stepItems = [
  {
    number: "01",
    title: "Upload Foto",
    description: "Take or upload a clear front-facing photo",
    icon: Upload,
  },
  {
    number: "02",
    title: "AI Analysis",
    description: "Our AI detects your face shape and features",
    icon: ScanFace,
  },
  {
    number: "03",
    title: "Get Recommendations",
    description: "Receive personalized hairstyle suggestions",
    icon: Sparkles,
  },
];

function StepCard({ number, title, description, icon: Icon }) {
  return (
    <article className="flex flex-col items-center text-center">
      <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[#4a1a1a] shadow-lg">
        <Icon className="h-12 w-12 text-[#fbf7f3]" />
        <span
          className="absolute -top-2 -right-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#E6E2DD] text-xs font-semibold text-[#4A1A1A]"
          style={{ fontFamily: "var(--font-be-vietnam)" }}
        >
          {number}
        </span>
      </div>
      <h3
        className="mt-6 text-3xl text-[#4a1a1a]"
        style={{ fontFamily: "var(--font-noto-serif)" }}
      >
        {title}
      </h3>
      <p
        className="mt-3 max-w-xs text-base leading-7 text-[#6e5851]"
        style={{ fontFamily: "var(--font-plus-jakarta)" }}
      >
        {description}
      </p>
    </article>
  );
}

const recommendations = [
  {
    title: "Top Recommendation",
    style: "Textured Quiff",
    match: "95% Match",
    tone: "from-[#6b4f3d] via-[#9b6f49] to-[#d7b08a]",
  },
  {
    title: "Alternative",
    style: "Mid Taper Fade",
    match: "92% Match",
    tone: "from-[#8c6a39] via-[#b89256] to-[#e0c18c]",
  },
];

function ResultPortrait() {
  return (
    <div className="relative h-full min-h-104 overflow-hidden bg-[linear-gradient(180deg,#1c1a1a_0%,#40312c_35%,#8b6f59_72%,#d2bfa7_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.18),transparent_24%),radial-gradient(circle_at_50%_55%,rgba(0,0,0,0.18),transparent_42%)]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(0,0,0,0.56),transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,rgba(46,17,17,0.58),transparent)]" />
      <div className="absolute inset-0 flex items-end justify-center p-5">
        <div className="h-[110%] w-[88%] rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_50%_38%,#f4d8bf_0%,#d6a47d_18%,#7f5a42_30%,#3b2a23_46%,#1b1718_62%,#111010_100%)] opacity-95 shadow-[0_20px_50px_rgba(0,0,0,0.45)]" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.18)_100%)]" />
      <div
        className="absolute bottom-5 left-5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[0.64rem] uppercase tracking-[0.42em] text-[#f3e8de] backdrop-blur-sm"
        style={{ fontFamily: "var(--font-be-vietnam)" }}
      >
        Original Reference
      </div>
    </div>
  );
}

function StyleCard({ title, style, match, tone }) {
  return (
    <article className="overflow-hidden bg-[#5d1818] shadow-[0_18px_35px_rgba(0,0,0,0.18)]">
      <div className={`relative aspect-square bg-linear-to-br ${tone}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.18),transparent_25%),linear-gradient(180deg,transparent,rgba(0,0,0,0.1))]" />
        <div
          className="absolute right-3 top-3 rounded-sm bg-[#d9d0c6]/90 px-2 py-1 text-[0.6rem] uppercase tracking-[0.28em] text-[#4a1a1a]"
          style={{ fontFamily: "var(--font-be-vietnam)" }}
        >
          {match}
        </div>
      </div>
      <div className="px-4 pb-5 pt-3 text-[#f3e8de]">
        <p
          className="text-[0.72rem] uppercase tracking-[0.34em] text-[#d8b9b1]"
          style={{ fontFamily: "var(--font-be-vietnam)" }}
        >
          {title}
        </p>
        <h3
          className="mt-2 text-lg text-[#f7e7d8]"
          style={{ fontFamily: "var(--font-noto-serif)" }}
        >
          {style}
        </h3>
      </div>
    </article>
  );
}

export default function AiResultPage() {
  const router = useRouter();

  useEffect(() => {
    const access = sessionStorage.getItem("aiResultAccess");
    if (!access) {
      router.replace("/ai");
    }
  }, [router]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FBF7F3] text-[#2B1D19] scroll-smooth">
      <SiteNavbar activeLabel="AI Feature" />

      <section className="mx-auto max-w-7xl px-6 pb-14 pt-24 lg:px-10 lg:pt-32">
        <div className="text-center">
          <p
            className="text-[0.72rem] uppercase tracking-[0.42em] text-[#c57e7b]"
            style={{ fontFamily: "var(--font-be-vietnam)" }}
          >
            Future men&apos;s grooming
          </p>
          <h2
            className="mt-3 text-4xl font-light text-[#4a1a1a] sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            How It Works
          </h2>
          <p
            className="mx-auto mt-4 max-w-3xl text-base leading-8 text-[#6e5851]"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Our AI-powered recommendation system in three simple steps.
          </p>
        </div>

        <div className="relative mt-16 flex flex-col items-center lg:flex-row lg:items-center lg:justify-center lg:gap-12">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 lg:gap-16">
            {stepItems.map((step) => (
              <StepCard key={step.number} {...step} />
            ))}
          </div>
        </div>
      </section>

      <SeparatorKey />

      <section className="relative mx-auto max-w-6xl px-6 pb-16 pt-16 lg:px-10">
        <div className="text-center">
          <h1
            className="text-4xl font-semibold leading-tight tracking-tight text-[#2b1d19] sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            AI-Powered Hair Results
          </h1>
          <p
            className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#6e5851]"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Curated based on your facial structure, hair texture, and preferred
            maintenance level.
          </p>
        </div>
      </section>

      {/* Results Section */}
      <section className="bg-[#5d1818] mx-auto w-full px-6 pb-20 pt-12 lg:px-10">
        {/* Stats Grid */}
        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-6 rounded-lg bg-[#5d1818] p-6 md:p-8">
          {recommendationStats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <p
                className="text-xs uppercase tracking-wider text-[#d8b9b1]"
                style={{ fontFamily: "var(--font-be-vietnam)" }}
              >
                {stat.label}
              </p>
              <p
                className="mt-2 text-lg font-semibold text-[#f7e7d8] md:text-xl"
                style={{ fontFamily: "var(--font-noto-serif)" }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Main Results Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left: Portrait */}
          <div className="lg:col-span-1">
            <ResultPortrait />
          </div>

          {/* Right: Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stylist Notes */}
            <div className="rounded-lg bg-[#5d1818] p-6 md:p-8">
              <div className="mx-auto w-full max-w-6xl py-6">
                <div className="separator flex items-center justify-center gap-6">
                  <div className="grow border-t border-[#c57e7b]"></div>
                  <div className="sep-img-wrapper" aria-hidden="true">
                    <p
                      className="border-[#8b6f59] py-3  uppercase tracking-wider text-[#d8b9b1]"
                      style={{ fontFamily: "var(--font-be-vietnam)" }}
                    >
                      Stylist Notes: Modern Textured Quiff
                    </p>
                  </div>
                  <div className="grow border-t border-[#c57e7b]"></div>
                </div>
              </div>

              <p
                className="mt-4 text-center italic text-sm leading-relaxed text-[#f3e8de]"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                Adding volume on the top provides a balanced facial illusion.
                Point cut techniques are recommended for modern texture without
                losing side definition.
              </p>
            </div>

            {/* Recommendations Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {recommendations.map((rec, idx) => (
                <StyleCard key={idx} {...rec} />
              ))}
            </div>

            {/* Try Next Style Button */}
            <div className="flex justify-center pt-4">
              <button
                className="rounded-lg bg-[#d9d0c6] px-8 py-3 text-center text-sm font-medium text-[#4a1a1a] transition-all hover:bg-[#e8e2d9]"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                Try Next Style (100/150 Free Tokens Left)
              </button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
