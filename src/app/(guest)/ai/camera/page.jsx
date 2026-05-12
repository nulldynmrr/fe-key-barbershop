"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, X, RefreshCw } from "lucide-react";

import { aiScanService } from "@/services/aiScanService";
import { useToast } from "@/contexts/ToastContext";

import Cookies from "js-cookie";
import { saveUserAuth } from "@/utils/request";
import AILoadingModal from "@/components/AILoadingModal";

export default function AiCameraPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApiDone, setIsApiDone] = useState(false);
  const [isAnimationDone, setIsAnimationDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isApiDone && isAnimationDone) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      router.push("/ai/result?mode=camera");
    }
  }, [isApiDone, isAnimationDone, router, stream]);

  // Request camera access on mount
  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" }, // Use front camera
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

    // Cleanup stream on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    router.push("/ai");
  };

  const ensureAuth = async () => {
    const token = Cookies.get("user_token");
    if (!token) {
      // Generate a unique device ID if none exists
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

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;
    
    setIsCapturing(true);
    setIsProcessing(true);

    try {
      // 0. Ensure user is authenticated (guest login if no token)
      await ensureAuth();

      // 1. Check AI Features global status + user package
      const featureRes = await aiScanService.getFeatures();
      const featuresData = featureRes.data?.data || {};
      
      const activeFeatures = Object.keys(featuresData).filter(
        (key) => featuresData[key].available
      );

      // 2. Capture image from video stream
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      
      // Optional: mirror the image on canvas if video is mirrored
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Save base64 image so the result page can display it
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      sessionStorage.setItem("aiOriginalImage", dataUrl);

      // Convert canvas to blob for upload
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
      if (!blob) throw new Error("Failed to capture image");

      // 3. Send to analysis API
      const formData = new FormData();
      formData.append("foto", blob, "face-scan.jpg");
      
      if (activeFeatures.length === 0) {
        // Default to ALL globally active features for guests instead of just STANDARD_SCAN
        const allGloballyActive = Object.keys(featuresData).filter(
          (key) => featuresData[key].globallyActive
        );
        formData.append("requestedFeatures", JSON.stringify(allGloballyActive.length > 0 ? allGloballyActive : ["STANDARD_SCAN"]));
      } else {
        formData.append("requestedFeatures", JSON.stringify(activeFeatures));
      }

      const analysisRes = await aiScanService.analyzeFace(formData);
      
      // Store result to display on the Result page
      sessionStorage.setItem("aiAnalysisResult", JSON.stringify(analysisRes.data?.data));

      showToast("Analysis complete!", "success");
      setIsApiDone(true);
    } catch (err) {
      console.error(err);
      const errCode = err.response?.data?.errorCode;
      if (errCode === "SERVICE_UNAVAILABLE" || err.response?.status === 503) {
        router.push("/ai/busy");
        return;
      } else {
        showToast(err.response?.data?.message || err.message || "Failed to analyze face", "error");
      }
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
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-white">
      {/* Video Stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`h-full w-full object-cover transition-opacity duration-1000 ${isCapturing ? "opacity-30" : "opacity-100"}`}
        style={{ transform: "scaleX(-1)" }} // Mirror view for front camera
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition hover:bg-white/20"
      >
        <X className="h-6 w-6 text-white" />
      </button>

      {/* Face Guide Overlay */}
      {!isCapturing && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-6">
          <div className="relative flex h-[400px] w-[300px] items-center justify-center">
            {/* SVG Ellipse representing a face shape */}
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
            
            {/* Animated Corners */}
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

      {/* Processing Animation */}
      <AILoadingModal
        isOpen={isProcessing}
        onClose={handleModalClose}
        onComplete={handleLoadingComplete}
      />

      {/* Error Message */}
      {errorMsg && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500/20 text-red-100 border border-red-500 px-6 py-4 rounded-md backdrop-blur-md text-center max-w-sm">
          <p>{errorMsg}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-500/40 hover:bg-red-500/60 transition rounded text-sm">
            Try Again
          </button>
        </div>
      )}

      {/* Capture Button Area */}
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
