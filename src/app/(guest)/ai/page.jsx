"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ScanFace, Sparkles, Upload } from "lucide-react";
import SeparatorKey from "../../../components/SeparatorKey";
import SiteFooter from "../../../components/SiteFooter";
import SiteNavbar from "../../../components/SiteNavbar";
import AILoadingModal from "../../../components/AILoadingModal";

const aiNavItems = [
  { label: "Home", href: "/home" },
  { label: "AI Feature", href: "#ai-feature", active: true },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
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

const featurePills = ["Face Shape Analysis", "Texture Matching", "Artisanal Curation"];

function StepCard({ number, title, description, icon: Icon }) {
  return (
    <article className="flex flex-col items-center text-center">
      <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[#4a1a1a] shadow-lg">
        <Icon className="h-12 w-12 text-[#fbf7f3]" />
        <span className="absolute -top-2 -right-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#E6E2DD] text-xs font-semibold text-[#4A1A1A]" style={{ fontFamily: "var(--font-be-vietnam)" }}>
          {number}
        </span>
      </div>
      <h3 className="mt-6 text-3xl text-[#4a1a1a]" style={{ fontFamily: "var(--font-noto-serif)" }}>
        {title}
      </h3>
      <p className="mt-3 max-w-xs text-base leading-7 text-[#6e5851]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
        {description}
      </p>
    </article>
  );
}

export default function AiPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoadingOpen, setIsLoadingOpen] = useState(false);
  const [isPreviewDismissed, setIsPreviewDismissed] = useState(false);
  const isPreviewLoading = searchParams.get("previewLoading") === "1";
  const isModalOpen = isLoadingOpen || (isPreviewLoading && !isPreviewDismissed);

  const handleUploadClick = () => {
    setIsLoadingOpen(true);
  };

  const handleLoadingComplete = () => {
    if (isPreviewLoading) {
      return;
    }

    setIsLoadingOpen(false);
    sessionStorage.setItem(
      "aiResultAccess",
      JSON.stringify({
        grantedAt: Date.now(),
      }),
    );
    router.push("/ai/result");
  };

  const handleCloseModal = () => {
    setIsLoadingOpen(false);
    if (isPreviewLoading) {
      setIsPreviewDismissed(true);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FBF7F3] text-[#2B1D19] scroll-smooth">
      <AILoadingModal isOpen={isModalOpen} onClose={handleCloseModal} onComplete={handleLoadingComplete} disableAutoProgress={isPreviewLoading} previewStep={1} />
      <SiteNavbar activeLabel="AI Feature" />

      <section className="mx-auto max-w-7xl px-6 pb-14 pt-24 lg:px-10 lg:pt-32">
        <div className="text-center">
          <p className="text-[0.72rem] uppercase tracking-[0.42em] text-[#c57e7b]" style={{ fontFamily: "var(--font-be-vietnam)" }}>
            Future men&apos;s grooming
          </p>
          <h2 className="mt-3 text-4xl font-light text-[#4a1a1a] sm:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-playfair)" }}>
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-[#6e5851]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
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
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[#2b1d19] sm:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-playfair)" }}>
            AI-Powered Hair Recommendation
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#6e5851]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
            Leverage our proprietary artisanal algorithm to find the cut that best complements your facial structure and personal style.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-8">
          <div className="rounded-[40px] border border-[#e6d1c7] bg-[#f7f1ea] p-8 lg:p-12">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d8c8bc] bg-white shadow-sm">
                <Upload className="h-8 w-8 text-[#4a1a1a]" />
              </div>

              <h2 className="mt-8 text-3xl leading-tight text-[#2b1d19] sm:text-4xl" style={{ fontFamily: "var(--font-noto-serif)" }}>
                Ready to find your ideal hairstyle?
              </h2>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {featurePills.map((pill) => (
                  <span key={pill} className="rounded-full border border-[#e6d1c7] bg-[#ede8e0] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#6e5851]" style={{ fontFamily: "var(--font-be-vietnam)" }}>
                    {pill}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.34em] text-[#c57e7b]" style={{ fontFamily: "var(--font-be-vietnam)" }}>
                <Sparkles className="h-4 w-4" />
                150 Credits
              </div>

              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleUploadClick();
                }}
                className="mt-8 inline-flex w-50% items-center justify-center bg-[#4a1a1a] px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#fbf7f3] transition hover:bg-[#2b1d19]"
                style={{ fontFamily: "var(--font-be-vietnam)" }}
              >
                Upload my photo & get recommendations
              </Link>

              <p className="mt-4 text-[0.7rem] uppercase tracking-[0.34em] text-[#8b6f66]" style={{ fontFamily: "var(--font-be-vietnam)" }}>
                Privacy first: your photos are never stored on our servers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-[#c57e7b]" />
            <span className="text-xs uppercase tracking-[0.34em] text-[#8b6f66]" style={{ fontFamily: "var(--font-be-vietnam)" }}>
              OR
            </span>
            <div className="flex-1 border-t border-[#c57e7b]" />
          </div>

          <button
            type="button"
            className="flex items-center justify-center border-2 border-[#8b6f66] px-6 py-10 text-xs font-semibold uppercase tracking-[0.3em] text-[#8b6f66] transition hover:bg-[#f7f1ea]"
            style={{ fontFamily: "var(--font-be-vietnam)" }}
          >
            Use camera instead
          </button>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
