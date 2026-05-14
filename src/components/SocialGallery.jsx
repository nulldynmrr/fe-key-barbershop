"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { socialMediaService } from "@/services/socialMediaService";
import { getEmbedUrl, getThumbnailUrl } from "@/utils/social";

function SocialVideoCard({ item, index, isActive, onSetActive, onClearActive }) {
  const [thumbError, setThumbError] = useState(false);
  const url = item.link;
  const embedUrl = isActive ? `${getEmbedUrl(url)}${url.includes('?') ? '&' : '?'}autoplay=1&mute=1` : null;

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/api\/v1\/?$/, "");
  const thumbnailUrl = item.thumbnail
    ? `${baseUrl}${item.thumbnail}`
    : getThumbnailUrl(url);

  const isInstagram = url.includes("instagram.com");
  const isTikTok = url.includes("tiktok.com");

  const rotations = ["-rotate-6", "rotate-2", "rotate-6"];
  const zIndexes = ["z-10", "z-20", "z-10"];
  const positions = [
    "absolute left-0 sm:left-[5%] origin-bottom-right",
    "absolute z-20",
    "absolute right-0 sm:right-[5%] origin-bottom-left"
  ];



  return (
    <div
      className={`${positions[index] || ""} ${rotations[index] || ""} ${isActive ? "z-30 scale-110 rotate-0 shadow-[0_40px_80px_rgba(74,26,26,0.5)]" : zIndexes[index] || ""} w-48 sm:w-64 aspect-[9/16] transition-all duration-300 rounded-[2rem] overflow-hidden border border-white/20 bg-stone-950 shadow-2xl group cursor-pointer`}
      onMouseEnter={onSetActive}
      onMouseLeave={onClearActive}
    >
      <div className="relative w-full h-full overflow-hidden bg-stone-900">
        {isActive && embedUrl && (
          <div className="absolute inset-0 z-0 bg-black">
            <iframe
              src={embedUrl}
              className={`absolute border-none transition-opacity duration-500
                ${isInstagram ? "w-[140%] h-[140%] top-0 left-[-20%] scale-[1.4] origin-top -translate-y-[18%]" : ""}
                ${isTikTok ? "w-[140%] h-[140%] top-0 left-[-20%] scale-[1.4] origin-top -translate-y-[12%]" : ""}
                ${!isInstagram && !isTikTok ? "top-0 left-0 w-full h-full" : ""}
              `}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              loading="lazy"
            />
          </div>
        )}

        {thumbnailUrl && (
          <div className={`absolute inset-0 z-10 transition-opacity duration-500 pointer-events-none ${isActive ? "opacity-0" : "opacity-100"}`}>
            <Image
              src={thumbError ? getThumbnailUrl(url) : thumbnailUrl}
              alt={item.title || `Gallery ${index}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setThumbError(true)}
            />
          </div>
        )}


        {!embedUrl && !thumbnailUrl && (

          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#4a1a1a]/10 pointer-events-none">
            <Loader2 className="w-6 h-6 animate-spin text-[#4a1a1a]" />
          </div>
        )}

        <div className={`absolute inset-0 z-30 bg-gradient-to-t from-black/80 via-transparent to-black/30 transition-opacity duration-300 pointer-events-none ${isActive ? 'opacity-20' : 'opacity-60'}`} />
      </div>
    </div>
  );
}

export default function SocialGallery() {
  const [socialMedias, setSocialMedias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const res = await socialMediaService.getSocialMedias();
        const body = res.data;
        if (body.success) {
          setSocialMedias(body.data?.slice(0, 3) || []);
        }
      } catch (err) {
        console.error("Error fetching social media:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSocials();
  }, []);

  return (
    <div className="grid gap-12 lg:grid-cols-[0.55fr_0.45fr] items-center">
      <div className="relative h-[450px] sm:h-[650px] w-full flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#4a1a1a]" />
            <p className="text-xs uppercase tracking-widest text-[#8b6f66]">Loading Gallery...</p>
          </div>
        ) : socialMedias.length > 0 ? (
          socialMedias.map((item, index) => (
            <SocialVideoCard
              key={item.id}
              item={item}
              index={index}
              isActive={activeId === item.id}
              onSetActive={() => setActiveId(item.id)}
              onClearActive={() => setActiveId(null)}
            />
          ))
        ) : (
          <div className="text-center opacity-40">
            <p className="text-sm italic text-[#5f463d]">Stay tuned for our latest updates</p>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center px-4 sm:px-8">
        <h2 className="text-[#4a1a1a] flex items-center gap-4 text-4xl sm:text-5xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
          Our Media Social
          <div className="h-12 w-4 sm:h-14 sm:w-5 relative shrink-0">
            <Image src="/images/figma/home/key-icon.png" alt="Key Icon" fill className="object-contain opacity-80" />
          </div>
        </h2>
        <p className="mt-6 max-w-md text-sm sm:text-base italic leading-7 text-[#5f463d]" style={{ fontFamily: "var(--font-be-vietnam)" }}>
          A legacy of craftsmanship refined through modern precision
        </p>

      </div>
    </div>
  );
}
