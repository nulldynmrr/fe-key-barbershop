"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";

import api from "@/utils/request";

export default function MeetOurCapster() {
  const [capsters, setCapsters] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [loadingBarbers, setLoadingBarbers] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);

  useEffect(() => {
    api
      .get("/barbers")
      .then((res) => {
        const data = res.data?.data ?? res.data ?? [];
        setCapsters(Array.isArray(data) ? data : []);
      })
      .catch(() => setCapsters([]))
      .finally(() => setLoadingBarbers(false));

    api
      .get("/gallery")
      .then((res) => {
        const data = res.data?.data ?? res.data ?? [];
        setGalleries(Array.isArray(data) ? data : []);
      })
      .catch(() => setGalleries([]))
      .finally(() => setLoadingGallery(false));
  }, []);

  const hasBarbers = capsters.length > 0;
  const hasGallery = galleries.length > 0;



  const getImageUrl = (url) => {
    if (!url) return "/images/card.jpg";

    if (/^https?:\/\//i.test(url)) {
      return url;
    }

    if (url.startsWith("/images")) {
      return url;
    }

    const baseUrl = (
      process.env.NEXT_PUBLIC_API_URL
    ).replace(/\/api\/v1\/?$/, "");

    return `${baseUrl}${url}`;
  };



  return (
    <main className="min-h-screen bg-[#F5F0EB] font-sans overflow-hidden">
      <SiteNavbar activeLabel="The Cut Room" />

      {!loadingBarbers && hasBarbers && (
        <section className="hidden md:block relative">
          <div className="absolute top-0 left-0 w-full z-0 overflow-hidden">
            <Image
              src="/images/background-capster.webp"
              alt="Barbershop Illustration"
              width={1920}
              height={900}
              className="w-full h-auto max-w-full"
              priority
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[300px]">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-3">
                <div className="w-10 h-[1.5px] bg-[#3B1516]"></div>

                <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-[#3B1516] uppercase font-bold">
                  Meet Our Capster
                </h2>

                <div className="w-10 h-[1.5px] bg-[#3B1516]"></div>
              </div>

              <p className="italic font-serif text-[#3B1516] text-lg">
                The Haircut Gallery
              </p>
            </div>

            <div className={`grid gap-8 ${capsters.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' : capsters.length === 2 ? 'grid-cols-2 max-w-2xl mx-auto' : capsters.length === 3 ? 'grid-cols-3 max-w-4xl mx-auto' : 'grid-cols-4'}`}>
              {capsters.map((capster) => (
                <div
                  key={capster.id}
                  className="group relative w-full aspect-[3/4] cursor-pointer"
                  style={{ perspective: "1000px" }}
                >
                  <div
                    className="relative w-full h-full transition-all duration-700 rounded-2xl shadow-xl"
                    style={{ transformStyle: "preserve-3d" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "rotateY(180deg)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "rotateY(0deg)";
                    }}
                  >
                    <div
                      className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-white"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <Image
                        src={getImageUrl(capster.url_foto_upload)}
                        alt={capster.nama_kapster}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover"
                      />
                    </div>

                    <div
                      className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-white shadow-inner"
                      style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <Image
                        src="/images/back card.png"
                        alt="Back Card Background"
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover opacity-90 z-0"
                      />

                      <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 text-[#411C1C]">
                        <div className="mt-4 text-left">
                          <p className="italic font-serif text-xs text-gray-600 mb-1">
                            Pengalaman
                          </p>

                          <h3 className="text-xl md:text-2xl font-serif font-bold leading-tight">
                            {capster.pengalaman} Tahun
                          </h3>
                        </div>

                        <div className="mb-4 text-left">
                          <p className="italic font-serif text-xs text-gray-600 mb-1">
                            Spesialisasi
                          </p>

                          <h3 className="text-base md:text-lg font-serif font-bold leading-snug">
                            {capster.spesialisasi}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="invisible w-full pointer-events-none"
            aria-hidden="true"
          >
            <Image
              src="/images/backgorund Capster.png"
              alt=""
              width={1920}
              height={900}
              className="w-full h-auto"
            />
          </div>
        </section>
      )}

      {!loadingBarbers && hasBarbers && (
        <section className="block md:hidden px-4 pt-24 pb-12">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="w-8 h-[1.5px] bg-[#3B1516]"></div>

              <h2 className="text-2xl font-serif tracking-widest text-[#3B1516] uppercase font-bold">
                Meet Our Capster
              </h2>

              <div className="w-8 h-[1.5px] bg-[#3B1516]"></div>
            </div>

            <p className="italic font-serif text-[#3B1516] text-base">
              The Haircut Gallery
            </p>
          </div>

          <div className={`flex flex-col gap-8 ${capsters.length === 1 ? 'items-center' : ''}`}>
            {capsters.map((capster) => (
              <div key={capster.id} className={`flex gap-4 items-stretch ${capsters.length === 1 ? 'max-w-sm w-full' : 'w-full'}`}>
                <div className="relative w-[140px] flex-shrink-0 rounded-2xl overflow-hidden shadow-lg aspect-[3/4]">
                  <Image
                    src={getImageUrl(capster.url_foto_upload)}
                    alt={capster.nama_kapster}
                    fill
                    sizes="140px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col justify-center gap-2 flex-1 bg-white rounded-2xl shadow-md px-5 py-5 border border-[#e8ddd5]">
                  <div>
                    <p className="italic font-serif text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">
                      Nama
                    </p>

                    <h3 className="text-xl font-serif font-bold text-[#3B1516] leading-tight">
                      {capster.nama_kapster}
                    </h3>
                  </div>

                  <div className="w-full h-[1px] bg-[#e8ddd5] my-1" />

                  <div>
                    <p className="italic font-serif text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">
                      Pengalaman
                    </p>

                    <p className="text-sm font-serif font-semibold text-[#411C1C]">
                      {capster.pengalaman} Tahun
                    </p>
                  </div>

                  <div>
                    <p className="italic font-serif text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">
                      Spesialisasi
                    </p>

                    <p className="text-sm font-serif font-semibold text-[#411C1C]">
                      {capster.spesialisasi}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!loadingGallery && hasGallery && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 md:mt-[-50%] mt-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="w-10 h-[1.5px] bg-[#3B1516]"></div>

              <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-[#3B1516] uppercase font-bold">
                Our Work
              </h2>

              <div className="w-10 h-[1.5px] bg-[#3B1516]"></div>
            </div>

            <p className="italic font-serif text-[#3B1516] text-lg">
              The Haircut Gallery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="flex flex-col gap-10">
              <div>
                <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">
                  {galleries[0]?.kategori ?? "The Classic"}
                </p>

                <p className="text-[10px] text-gray-400 uppercase mb-4">
                  Key Barber
                </p>

                <div className="bg-white p-4 shadow-sm w-full aspect-square relative overflow-hidden border border-gray-200">
                  {galleries[0] && (
                    <Image
                      src={getImageUrl(galleries[0].url_foto_upload)}
                      alt={galleries[0].kategori}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading="lazy"
                      className="object-cover"
                    />
                  )}
                </div>
              </div>

              {galleries[1] && (
                <div className="bg-white p-4 shadow-sm w-[80%] mx-auto aspect-square relative overflow-hidden border border-gray-200 transform -rotate-3">
                  <Image
                    src={getImageUrl(galleries[1].url_foto_upload)}
                    alt={galleries[1].kategori}
                    fill
                    sizes="(max-width: 768px) 80vw, 26vw"
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-10 justify-center">
              {galleries[2] && (
                <div className="bg-white p-4 shadow-sm w-full h-[400px] relative overflow-hidden border border-gray-200">
                  <Image
                    src={getImageUrl(galleries[2].url_foto_upload)}
                    alt={galleries[2].kategori}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
              )}

              {galleries[3] && (
                <div className="bg-white p-4 shadow-sm w-[80%] mx-auto aspect-square relative overflow-hidden border border-gray-200">
                  <Image
                    src={getImageUrl(galleries[3].url_foto_upload)}
                    alt={galleries[3].kategori}
                    fill
                    sizes="(max-width: 768px) 80vw, 26vw"
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-10">
              <div>
                {galleries[4] && (
                  <div className="bg-white p-4 shadow-sm w-full h-[500px] relative overflow-hidden border border-gray-200">
                    <Image
                      src={getImageUrl(galleries[4].url_foto_upload)}
                      alt={galleries[4].kategori}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="text-right mt-4">
                  <p className="text-xs tracking-widest text-gray-500 uppercase mb-1">
                    {galleries[4]?.kategori ?? "Modern Edge"}
                  </p>

                  <p className="text-[10px] text-gray-400 uppercase">
                    Signature Style
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 shadow-sm border border-gray-200">
                <p className="font-serif italic text-gray-700 text-center text-lg">
                  "Tradition is not the worship of ashes, but the preservation
                  of fire."
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
