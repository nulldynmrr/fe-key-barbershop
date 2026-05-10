"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { ScanFace, Sparkles, Upload, Camera, Loader2 } from "lucide-react";
import SeparatorKey from "../../../components/SeparatorKey";
import SiteFooter from "../../../components/SiteFooter";
import SiteNavbar from "../../../components/SiteNavbar";
import { aiScanService } from "../../../services/aiScanService";
import { useToast } from "../../../contexts/ToastContext";
import { saveUserAuth } from "../../../utils/request";
import Cookies from "js-cookie";

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
        <span
          className="absolute -top-2 -right-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#FBF7F3] font-bold text-[#4A1A1A]"
          style={{ fontFamily: "var(--font-noto-serif)" }}
        >
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
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleCameraClick = () => {
    router.push("/ai/camera");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast("Only JPG, PNG, or WEBP images are allowed.", "error");
      return;
    }

    setIsAnalyzing(true);

    try {
      await ensureAuth();

      const featureRes = await aiScanService.getFeatures();
      const featuresData = featureRes.data?.data || {};

      const activeFeatures = Object.keys(featuresData).filter(
        (key) => featuresData[key].available
      );

      // Save base64 image so the result page can display it (since backend doesn't store file)
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          sessionStorage.setItem("aiOriginalImage", reader.result);
          
          const formData = new FormData();
          formData.append("foto", file);
          
          if (activeFeatures.length === 0) {
            formData.append("requestedFeatures", JSON.stringify(["STANDARD_SCAN"]));
          } else {
            formData.append("requestedFeatures", JSON.stringify(activeFeatures));
          }

          const analysisRes = await aiScanService.analyzeFace(formData);
          sessionStorage.setItem("aiAnalysisResult", JSON.stringify(analysisRes.data?.data));

          showToast("Analysis complete!", "success");
          router.push("/ai/result?mode=upload");
        } catch (err) {
          console.error(err);
          showToast(err.response?.data?.message || err.message || "Failed to analyze photo", "error");
          setIsAnalyzing(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };
      reader.readAsDataURL(file);

    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || err.message || "Failed to analyze photo", "error");
      setIsAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FBF7F3] text-[#2B1D19] scroll-smooth">
      <SiteNavbar activeLabel="AI Feature" />

      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#2b1d19]/80 backdrop-blur-sm">
          <ScanFace className="h-16 w-16 text-[#C59B8F] animate-pulse mb-6" />
          <p className="text-[#F3E8DE] text-lg font-serif tracking-wider mb-3">Analyzing your photo...</p>
          <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C59B8F] rounded-full"
              style={{ width: "60%", animation: "scanBar 1.8s ease-in-out infinite" }}
            />
          </div>
          <p className="mt-4 text-xs text-white/40 uppercase tracking-[0.2em] animate-pulse">Running AI Model</p>
          <style>{`
            @keyframes scanBar {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(250%); }
            }
          `}</style>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <section className="relative mx-auto max-w-6xl px-6 pb-16 pt-16 lg:px-10">
        <div className="text-center">
          <h1
            className="text-4xl font-semibold leading-tight tracking-tight text-[#2b1d19] sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            AI-Powered Hair Recommendation
          </h1>
          <p
            className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#6e5851]"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Leverage our proprietary artisanal algorithm to find the cut that best complements your facial structure and personal style.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-8">
          <div className="rounded-[40px] border border-[#e6d1c7] bg-[#f7f1ea] p-8 lg:p-12">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d8c8bc] bg-white shadow-sm">
                <Upload className="h-8 w-8 text-[#4a1a1a]" />
              </div>

              <h2
                className="mt-8 text-3xl leading-tight text-[#2b1d19] sm:text-4xl"
                style={{ fontFamily: "var(--font-noto-serif)" }}
              >
                Ready to find your ideal hairstyle?
              </h2>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {featurePills.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-[#e6d1c7] bg-[#ede8e0] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#6e5851]"
                    style={{ fontFamily: "var(--font-be-vietnam)" }}
                  >
                    {pill}
                  </span>
                ))}
              </div>

              <div
                className="mt-7 flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.34em] text-[#c57e7b]"
                style={{ fontFamily: "var(--font-be-vietnam)" }}
              >
                <Sparkles className="h-4 w-4" />
                150 Credits
              </div>

              <button
                type="button"
                onClick={handleUploadClick}
                disabled={isAnalyzing}
                className="mt-8 inline-flex items-center justify-center gap-2 bg-[#4a1a1a] px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#fbf7f3] transition hover:bg-[#2b1d19] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ fontFamily: "var(--font-be-vietnam)" }}
              >
                {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload my photo &amp; get recommendations
              </button>

              <p
                className="mt-4 text-[0.7rem] uppercase tracking-[0.34em] text-[#8b6f66]"
                style={{ fontFamily: "var(--font-be-vietnam)" }}
              >
                Privacy first: your photos are never stored on our servers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-[#c57e7b]" />
            <span
              className="text-xs uppercase tracking-[0.34em] text-[#8b6f66]"
              style={{ fontFamily: "var(--font-be-vietnam)" }}
            >
              OR
            </span>
            <div className="flex-1 border-t border-[#c57e7b]" />
          </div>

          <button
            type="button"
            onClick={handleCameraClick}
            className="flex items-center justify-center gap-3 border-2 border-[#8b6f66] px-6 py-10 text-xs font-semibold uppercase tracking-[0.3em] text-[#8b6f66] transition hover:bg-[#f7f1ea]"
            style={{ fontFamily: "var(--font-be-vietnam)" }}
          >
            <Camera className="h-5 w-5" />
            Use camera instead
          </button>
        </div>
      </section>

      <SeparatorKey />
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

      <SiteFooter />
    </main>
  );
}
