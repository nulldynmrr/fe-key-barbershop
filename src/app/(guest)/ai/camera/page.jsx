"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, X, RefreshCw, Loader2 } from "lucide-react";

import { aiScanService } from "@/services/aiScanService";
import { useToast } from "@/contexts/ToastContext";

import Cookies from "js-cookie";
import { saveUserAuth } from "@/utils/request";
import { fetchHasActivePurchaseablePackage } from "@/utils/packageAvailability";
import AILoadingModal from "@/components/AILoadingModal";

export default function AiCameraPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [packageGateOk, setPackageGateOk] = useState(null);
  const [stream, setStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApiDone, setIsApiDone] = useState(false);
  const [isAnimationDone, setIsAnimationDone] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isApiDone && isAnimationDone) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      router.push("/ai/result?mode=camera");
    }
  }, [isApiDone, isAnimationDone, router, stream]);

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
    if (packageGateOk !== true) return;

    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setErrorMsg("Camera access denied or unavailable.");
      }
    }
    setupCamera();

    return () => {
      setStream((prev) => {
        if (prev) {
          prev.getTracks().forEach((track) => track.stop());
        }
        return null;
      });
    };
  }, [packageGateOk]);

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    router.push("/ai");
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
      const body = res.data;
      const { data } = body;
      saveUserAuth(data.token, data.user);
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;

    setIsCapturing(true);
    setIsProcessing(true);
    setCurrentStatus("");

    try {
      await ensureAuth();

      const featureRes = await aiScanService.getFeatures();
      const featuresData = featureRes.data?.data || {};
      const activeFeatures = Object.keys(featuresData).filter(k => featuresData[k].available);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.filter = 'contrast(1.1) brightness(1.05) saturate(1.1)';
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.filter = 'none';

      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      try {
        sessionStorage.setItem("aiOriginalImage", dataUrl);
      } catch (e) {
        console.warn("Session storage quota exceeded.");
      }

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
      if (!blob) throw new Error("Failed to capture image");

      const formData = new FormData();
      formData.append("foto", blob, "face-scan.jpg");
      formData.append("source", "camera");

      if (activeFeatures.length === 0) {
        const allGloballyActive = Object.keys(featuresData).filter(k => featuresData[k].globallyActive);
        formData.append("requestedFeatures", JSON.stringify(allGloballyActive.length > 0 ? allGloballyActive : ["STANDARD_SCAN"]));
      } else {
        formData.append("requestedFeatures", JSON.stringify(activeFeatures));
      }

      const token = Cookies.get("user_token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/analyze-face`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
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
        buffer = lines.pop();

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
      sessionStorage.setItem("aiAnalysisResult", JSON.stringify(finalData));

      // Sync credit
      const newCredit = resultData.usage_info?.credit_after;
      if (typeof newCredit === "number") {
        try {
          const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
          savedUser.sisa_credit = newCredit;
          localStorage.setItem("user", JSON.stringify(savedUser));
        } catch (e) {}
      }

      showToast("Analysis complete!", "success");
      setIsApiDone(true);
    } catch (err) {
      console.error(err);
      const errCode = err.response?.data?.errorCode;
      if (errCode === "SERVICE_UNAVAILABLE" || err.response?.status === 503 || err.response?.status === 429) {
        router.push("/ai/busy");
        return;
      }
      showToast(err.response?.data?.message || err.message || "Failed to analyze face", "error");
      setIsCapturing(false);
      setIsProcessing(false);
    }
  };

  const handleLoadingComplete = () => {
    setIsAnimationDone(true);
  };

  const handleModalClose = () => {
    setIsProcessing(false);
    setIsApiDone(false);
    setIsAnimationDone(false);
    setIsCapturing(false);
    setCurrentStatus("");
  };

  if (packageGateOk !== true) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
      </main>
    );
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-white">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`h-full w-full object-cover transition-opacity duration-1000 ${isCapturing ? "opacity-30" : "opacity-100"}`}
        style={{ transform: "scaleX(-1)" }}
      />
      <canvas ref={canvasRef} className="hidden" />

      <button
        onClick={handleClose}
        className="absolute top-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition hover:bg-white/20"
      >
        <X className="h-6 w-6 text-white" />
      </button>

      {!isCapturing && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-6">
          <div className="relative flex h-[400px] w-[300px] items-center justify-center">
            <svg className="absolute inset-0 h-full w-full drop-shadow-2xl" viewBox="0 0 300 400">
              <ellipse
                cx="150"
                cy="200"
                rx="120"
                ry="160"
                fill="none"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="2"
                strokeDasharray="8 8"
              />
              <path
                d="M150 20 L150 40 M150 380 L150 360 M30 200 L50 200 M270 200 L250 200"
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth="2"
              />
            </svg>

            <div className="absolute top-0 left-0 h-8 w-8 border-t-4 border-l-4 border-white"></div>
            <div className="absolute top-0 right-0 h-8 w-8 border-t-4 border-r-4 border-white"></div>
            <div className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-white"></div>
            <div className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-white"></div>
          </div>
          <p className="mt-8 text-center text-sm font-medium tracking-widest text-white/80 uppercase">
            Align your face within the frame
          </p>
        </div>
      )}

      <AILoadingModal
        isOpen={isProcessing}
        onClose={handleModalClose}
        onComplete={handleLoadingComplete}
        currentStatus={currentStatus}
      />

      {errorMsg && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500/20 text-red-100 border border-red-500 px-6 py-4 rounded-md backdrop-blur-md text-center max-w-sm">
          <p>{errorMsg}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-500/40 hover:bg-red-500/60 transition rounded text-sm">
            Try Again
          </button>
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-10 pb-16 flex justify-center z-50">
        <button
          onClick={handleCapture}
          disabled={!stream || isProcessing || errorMsg}
          className="group relative flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          <div className="absolute h-16 w-16 rounded-full bg-white transition-all group-hover:scale-95"></div>
          {isProcessing ? (
            <RefreshCw className="h-6 w-6 text-black animate-spin z-10" />
          ) : (
            <Camera className="h-6 w-6 text-black z-10 opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </button>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </main>
  );
}
