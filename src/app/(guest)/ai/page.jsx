"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Sparkles, Upload, Camera, Loader2, Search, History } from "lucide-react";


import SeparatorKey from "../../../components/SeparatorKey";
import SiteFooter from "../../../components/SiteFooter";
import SiteNavbar from "../../../components/SiteNavbar";
import { aiScanService } from "../../../services/aiScanService";
import { useToast } from "../../../contexts/ToastContext";
import { saveUserAuth } from "../../../utils/request";
import { fetchHasActivePurchaseablePackage } from "../../../utils/packageAvailability";
import Cookies from "js-cookie";
import AILoadingModal from "../../../components/AILoadingModal";
import AICreditExhaustedModal from "../../../components/AICreditExhaustedModal";

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
    icon: Search,
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
  const [packageGateOk, setPackageGateOk] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApiDone, setIsApiDone] = useState(false);
  const [isAnimationDone, setIsAnimationDone] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isExhaustedModalOpen, setIsExhaustedModalOpen] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [hasHistoryAccess, setHasHistoryAccess] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");

  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 2000);
  };

  useEffect(() => {
    if (isApiDone && isAnimationDone) {
      router.push("/ai/result?mode=upload");
    }
  }, [isApiDone, isAnimationDone, router]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await fetchHasActivePurchaseablePackage();
      if (cancelled) return;
      if (!ok) {
        router.replace("/ai/busy");
        return;
      }
      setPackageGateOk(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    const checkHistoryAccess = async () => {
      const token = Cookies.get("user_token");
      if (!token) return;
      try {
        const res = await aiScanService.getFeatures();
        const features = res.data?.data || {};
        if (features.HISTORY?.available) {
          setHasHistoryAccess(true);
        }
      } catch (err) {
        console.error("Failed to check history access:", err);
      }
    };
    checkHistoryAccess();
  }, []);

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

      try {
        const res = await aiScanService.guestLogin({ device_cookie: deviceId });
        const body = res.data;
        const { token: authToken, user } = body.data || {};

        if (authToken && user) {
          saveUserAuth(authToken, user);
        } else {
          throw new Error("Gagal menginisialisasi sesi tamu.");
        }
      } catch (err) {
        setIsExhaustedModalOpen(true);
        if (err.response?.data?.errorCode === "TRIAL_EXHAUSTED") {
          throw new Error("TRIAL_EXHAUSTED");
        }
        throw new Error("GUEST_AUTH_FAILED");
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addRipple(e);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const compressForStorage = (base64Str, maxWidth = 800) => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = () => resolve(base64Str);
    });
  };

  const processFile = async (file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast("Only JPG, PNG, or WEBP images are allowed.", "error");
      return;
    }

    setIsAnalyzing(true);

    // [PRE-VALIDATION] Check for basic image quality to save tokens/credits
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(bitmap, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let brightness = 0;
      for (let i = 0; i < data.length; i += 4) {
        brightness += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      }
      brightness /= (data.length / 4);

      if (brightness < 30) {
        showToast("Foto terlalu gelap. Silakan gunakan pencahayaan yang lebih baik.", "error");
        setIsAnalyzing(false);
        return;
      }
      if (brightness > 235) {
        showToast("Foto terlalu terang (overexposed). Silakan coba lagi.", "error");
        setIsAnalyzing(false);
        return;
      }

      // Experimental Native Face Detection (Chrome/Edge only)
      if (window.FaceDetector) {
        try {
          const detector = new window.FaceDetector();
          const faces = await detector.detect(bitmap);
          if (faces.length === 0) {
            const confirmAnyway = window.confirm("Wajah tidak terdeteksi dengan jelas. Tetap lanjutkan analisis? (Dapat menghabiskan koin/credit)");
            if (!confirmAnyway) {
              setIsAnalyzing(false);
              return;
            }
          }
        } catch (faceErr) {
          console.warn("Native face detection failed:", faceErr);
        }
      }
    } catch (qualityErr) {
      console.warn("Image pre-validation failed:", qualityErr);
    }

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
          const compressed = await compressForStorage(reader.result);
          try {
            sessionStorage.setItem("aiOriginalImage", compressed);
          } catch (storageErr) {
            console.warn("Session storage quota exceeded even after compression.");
          }

          const formData = new FormData();
          formData.append("foto", file);
          formData.append("source", "file");

          if (activeFeatures.length === 0) {
            // Default to ALL globally active features for guests instead of just STANDARD_SCAN
            const allGloballyActive = Object.keys(featuresData).filter(
              (key) => featuresData[key].globallyActive
            );
            formData.append("requestedFeatures", JSON.stringify(allGloballyActive.length > 0 ? allGloballyActive : ["STANDARD_SCAN"]));
          } else {
            formData.append("requestedFeatures", JSON.stringify(activeFeatures));
          }

          // Gunakan fetch untuk membaca stream NDJSON dari backend
          const token = Cookies.get("user_token");
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/analyze-face`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`
            },
            body: formData
          });

          if (!response.ok) {
            const errBody = await response.json().catch(() => ({}));
            throw { response: { data: errBody, status: response.status } };
          }

          const streamReader = response.body.getReader();
          const decoder = new TextDecoder();
          let resultData = null;
          let buffer = "";

          while (true) {
            const { done, value } = await streamReader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop(); // Simpan sisa chunk yang belum lengkap

            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const chunk = JSON.parse(line);
                if (chunk.type === "status") {
                  setCurrentStatus(chunk.node);
                } else if (chunk.type === "final") {
                  resultData = chunk;
                } else if (chunk.type === "error") {
                  throw { isApiError: true, response: { data: chunk, status: chunk.statusCode || 500 } };
                }
              } catch (e) {
                if (e.isApiError) throw e;
                console.error("Gagal parse chunk:", e);
              }
            }
          }

          if (!resultData) throw new Error("Gagal menerima hasil akhir dari AI.");

          const finalData = resultData.data;
          const isBadQuality = finalData?.hasil_analisis?.kualitas_foto_ok === false;
          const hasImages = finalData?.record?.url_hasil_img && finalData.record.url_hasil_img.length > 0;

          // Only block and show toast if it's bad quality AND no images were produced.
          // If images exist, we must show them even if quality was flagged.
          if (isBadQuality && !hasImages) {
            const reason = resultData?.hasil_analisis?.alasan_kualitas || "Kualitas foto kurang baik untuk analisis.";
            showToast(
              `Analisis Terhenti: ${reason}. Biaya evaluasi AI tetap terpotong, namun proses pembuatan gambar dibatalkan otomatis untuk menghemat koin Anda.`,
              "error",
              10000
            );
            setIsAnalyzing(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }

          try {
            sessionStorage.setItem("aiAnalysisResult", JSON.stringify(finalData));
          } catch (storageErr) {
            // If saving result fails, try clearing the preview image to make room
            sessionStorage.removeItem("aiOriginalImage");
            try {
              sessionStorage.setItem("aiAnalysisResult", JSON.stringify(finalData));
            } catch (finalErr) {
              console.error("Critical: Cannot save analysis result to session storage.");
            }
          }

          // Sync credit to localStorage
          const newCredit = resultData.usage_info?.credit_after;
          if (typeof newCredit === "number") {
            try {
              const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
              savedUser.sisa_credit = newCredit;
              localStorage.setItem("user", JSON.stringify(savedUser));
            } catch (e) {
              console.error("Failed to sync credit:", e);
            }
          }

          showToast("Analysis complete!", "success");
          setIsApiDone(true);
        } catch (err) {
          console.error(err);
          const errCode = err.response?.data?.errorCode;
          const message = err.response?.data?.message || err.message || "";

          if (errCode === "NO_ACTIVE_PACKAGE" || errCode === "INSUFFICIENT_CREDITS") {
            showToast(message, "error", 5000);
            setTimeout(() => {
              router.push("/service#ai-pricing");
            }, 2000);
            return;
          }

          if (errCode === "SERVICE_UNAVAILABLE" || err.response?.status === 503 || err.response?.status === 429) {
            router.push("/ai/busy");
            return;
          } else {
            if (
              message.toLowerCase().includes("credit") ||
              message.toLowerCase().includes("koin") ||
              errCode === "TRIAL_EXHAUSTED"
            ) {
              setIsExhaustedModalOpen(true);
            } else {
              showToast(message || "Failed to analyze photo", "error");
            }
          }
          setIsAnalyzing(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };
      reader.readAsDataURL(file);

    } catch (err) {
      console.error(err);
      const errCode = err.response?.data?.errorCode;
      const message = err.response?.data?.message || err.message || "";

      if (errCode === "NO_ACTIVE_PACKAGE" || errCode === "INSUFFICIENT_CREDITS") {
        showToast(message, "error", 5000);
        setTimeout(() => {
          router.push("/service");
        }, 2000);
        return;
      }

      if (err.message === "TRIAL_EXHAUSTED" || err.message === "GUEST_AUTH_FAILED") {
        setIsAnalyzing(false);
        return;
      }

      if (errCode === "SERVICE_UNAVAILABLE" || err.response?.status === 503 || err.response?.status === 429) {
        router.push("/ai/busy");
        return;
      }

      if (
        message.toLowerCase().includes("credit") ||
        message.toLowerCase().includes("koin") ||
        errCode === "TRIAL_EXHAUSTED"
      ) {
        setIsExhaustedModalOpen(true);
      } else {
        showToast(message || "Failed to analyze photo", "error");
      }
      setIsAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleLoadingComplete = () => {
    setIsAnimationDone(true);
  };

  const handleModalClose = () => {
    setIsAnalyzing(false);
    setIsApiDone(false);
    setIsAnimationDone(false);
    setCurrentStatus("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (packageGateOk !== true) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[#FBF7F3] text-[#2B1D19]">
        <SiteNavbar activeLabel="AI Feature" />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6">
          <Loader2 className="h-8 w-8 animate-spin text-[#4a1a1a]" aria-hidden />
          <p className="text-sm text-[#6e5851]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
            Loading…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FBF7F3] text-[#2B1D19] scroll-smooth">
      <SiteNavbar activeLabel="AI Feature" />

      <AILoadingModal
        isOpen={isAnalyzing}
        onClose={handleModalClose}
        onComplete={handleLoadingComplete}
        currentStatus={currentStatus}
      />

      <AICreditExhaustedModal
        isOpen={isExhaustedModalOpen}
        onClose={() => setIsExhaustedModalOpen(false)}
      />

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
          <div
            onClick={handleUploadClick}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`relative rounded-[40px] border-2 transition-all duration-300 cursor-pointer overflow-hidden ${isDragging
              ? "border-[#c57e7b] bg-[#fdfcfb] scale-[1.01] shadow-2xl shadow-[#c57e7b]/10"
              : "border-[#e6d1c7] bg-[#f7f1ea] hover:border-[#d8c8bc] hover:shadow-xl"
              }`}
          >
            {/* Luxury Wave Effects Container */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[40px]">
              {ripples.map((ripple) => (
                <div key={ripple.id} className="absolute inset-0">
                  {/* Primary Wave */}
                  <div
                    className="absolute rounded-full border border-[#c57e7b]/40 shadow-[0_0_20px_rgba(197,126,123,0.3)]"
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                      width: '0px',
                      height: '0px',
                      transform: 'translate(-50%, -50%)',
                      animation: 'luxuryWave 2.2s cubic-bezier(0.165, 0.84, 0.44, 1) forwards'
                    }}
                  />
                  {/* Secondary Delayed Wave */}
                  <div
                    className="absolute rounded-full border border-[#c57e7b]/20"
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                      width: '0px',
                      height: '0px',
                      transform: 'translate(-50%, -50%)',
                      animation: 'luxuryWave 2.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0.3s forwards'
                    }}
                  />
                  {/* Central Puddle Expansion */}
                  <div
                    className="absolute rounded-full bg-gradient-to-br from-[#c57e7b]/5 to-transparent blur-2xl"
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                      width: '0px',
                      height: '0px',
                      transform: 'translate(-50%, -50%)',
                      animation: 'puddleExpand 1.8s ease-out forwards'
                    }}
                  />
                </div>
              ))}
            </div>

            <style jsx global>{`
              @keyframes luxuryWave {
                0% {
                  width: 0;
                  height: 0;
                  opacity: 0.8;
                  border-width: 3px;
                }
                100% {
                  width: 250%;
                  height: 250%;
                  opacity: 0;
                  border-width: 0.5px;
                }
              }
              @keyframes puddleExpand {
                0% {
                  width: 0;
                  height: 0;
                  opacity: 0.6;
                }
                50% {
                  opacity: 0.3;
                }
                100% {
                  width: 150%;
                  height: 150%;
                  opacity: 0;
                }
              }
            `}</style>

            <div className="flex flex-col items-center text-center p-8 lg:p-12 relative z-10">
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

      {/* Floating History Button */}
      {hasHistoryAccess && (
        <button
          onClick={() => router.push("/ai/history")}
          className="fixed bottom-6 right-6 z-[90] flex items-center gap-2 bg-[#4a1a1a] text-white px-4 py-3 rounded-2xl shadow-2xl hover:bg-[#45312b] transition-all hover:scale-105 active:scale-95 border border-[#f0e2d9]/20"
          style={{ fontFamily: "var(--font-be-vietnam)" }}
        >
          <History className="w-5 h-5" />
          <span className="text-[0.7rem] uppercase tracking-[0.2em] font-bold">History</span>
        </button>
      )}
    </main>
  );
}
