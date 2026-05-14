"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { aiScanService } from "@/services/aiScanService";
import { useToast } from "@/contexts/ToastContext";
import SiteNavbar from "@/components/SiteNavbar";
import {
  History,
  ChevronLeft,
  Calendar,
  Scan,
  ArrowRight,
  Loader2,
  Image as ImageIcon
} from "lucide-react";

export default function AiHistoryPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const baseUrl = apiUrl.split("/api/v1")[0];

  useEffect(() => {
    fetchHistory();
  }, []);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${baseUrl}${url}`;
  };

  const fetchHistory = async () => {
    try {
      const res = await aiScanService.getHistory();
      setHistory(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch AI history:", err);
      showToast("Gagal memuat riwayat analisis.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (item) => {
    // Format data to match what the result page expects
    let activeFeaturesUsed = [];
    if (item.features_used) {
      try {
        activeFeaturesUsed = typeof item.features_used === 'string' 
          ? JSON.parse(item.features_used) 
          : item.features_used;
      } catch (e) {
        console.warn("Failed to parse features_used:", e);
      }
    }

    const formattedResult = {
      hasil_analisis: item.hasil_analisis,
      url_foto_upload: getImageUrl(item.url_foto_upload),
      url_hasil_img: Array.isArray(item.url_hasil_img) 
        ? item.url_hasil_img.map(url => getImageUrl(url))
        : item.url_hasil_img 
          ? [getImageUrl(item.url_hasil_img)] 
          : [],
      tgl_generate: item.tgl_generate,
      active_features: activeFeaturesUsed.length > 0 ? activeFeaturesUsed : null 
    };

    sessionStorage.setItem("aiAnalysisResult", JSON.stringify(formattedResult));
    router.push("/ai/result");
  };

  return (
    <main className="min-h-screen bg-[#fcf9f7] text-[#2b1d19]">
      <SiteNavbar />

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/ai")}
              className="p-2 rounded-full bg-white shadow-sm border border-[#f0e2d9] hover:bg-[#fcf9f7] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                AI Analysis History
              </h1>
              <p className="text-[#524342] text-sm mt-1">Review your past hairstyles and facial analysis</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#f0e2d9]/30 rounded-full border border-[#f0e2d9]">
            <History className="w-4 h-4 text-[#8a7a74]" />
            <span className="text-sm font-semibold text-[#8a7a74]">{history.length} Records</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#d97706] animate-spin mb-4" />
            <p className="text-[#8a7a74] font-medium">Retrieving your history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#f0e2d9] shadow-sm">
            <div className="w-20 h-20 bg-[#fcf9f7] rounded-full flex items-center justify-center mx-auto mb-6">
              <History className="w-10 h-10 text-[#f0e2d9]" />
            </div>
            <h2 className="text-xl font-bold mb-2">No History Found</h2>
            <p className="text-[#8a7a74] max-w-md mx-auto mb-8">
              You haven't performed any AI hair analysis yet. Start your journey now!
            </p>
            <button
              onClick={() => router.push("/ai")}
              className="px-8 py-3 bg-[#2b1d19] text-white rounded-xl font-bold hover:bg-[#45312b] transition-all shadow-md"
            >
              Try AI Feature Now
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => handleViewDetail(item)}
                className="group bg-white rounded-2xl p-4 border border-[#f0e2d9] shadow-sm hover:shadow-md hover:border-[#d97706]/30 transition-all cursor-pointer flex items-center gap-6"
              >
                {/* Image Preview */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {(() => {
                    const resultUrl = Array.isArray(item.url_hasil_img)
                      ? item.url_hasil_img[0]
                      : item.url_hasil_img;

                    const displayUrl = resultUrl || item.url_foto_upload;

                    if (displayUrl) {
                      return (
                        <img
                          src={getImageUrl(displayUrl)}
                          alt="Analysis Result"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      );
                    }
                    return (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-[#f0e2d9]" />
                      </div>
                    );
                  })()}
                  {item.url_hasil_img && (Array.isArray(item.url_hasil_img) ? item.url_hasil_img.length > 0 : !!item.url_hasil_img) && (
                    <div className="absolute bottom-1 right-1 bg-[#d97706] text-white p-1 rounded-md shadow-sm">
                      <Scan className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#8a7a74]" />
                    <span className="text-xs font-medium text-[#8a7a74]">
                      {new Date(item.tgl_generate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#2b1d19]">
                    {item.hasil_analisis?.kualitas_foto_ok === false
                      ? "Analysis Warning"
                      : (item.hasil_analisis?.bentuk_wajah || "Facial Analysis")}
                  </h3>
                  <p className="text-xs text-[#8a7a74] line-clamp-1 italic">
                    {item.hasil_analisis?.kualitas_foto_ok === false
                      ? item.hasil_analisis?.alasan_kualitas
                      : (item.hasil_analisis?.rekomendasi_gaya?.[0]?.nama_gaya || "No styles recommended")}
                  </p>
                </div>

                {/* Status/Action */}
                <div className="flex flex-col items-end gap-2">
                  <div className="px-3 py-1 rounded-full bg-[#fcf9f7] border border-[#f0e2d9] text-[10px] font-bold text-[#8a7a74] uppercase tracking-wider">
                    {item.harga_credit_terpakai} Credits
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#fcf9f7] flex items-center justify-center group-hover:bg-[#2b1d19] group-hover:text-white transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        :root {
          --font-plus-jakarta: 'Plus Jakarta Sans', sans-serif;
        }
      `}</style>
    </main>
  );
}
