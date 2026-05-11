"use client";

import React, { useState, useEffect } from "react";
import {
  Loader2,
  Plus,
  X,
  Link as LinkIcon,
  Video,
  Trash2,
  Camera,
  Globe,
  UploadCloud
} from "lucide-react";
import Image from "next/image";
import { socialMediaService } from "@/services/socialMediaService";
import { useToast } from "@/contexts/ToastContext";
import { getEmbedUrl } from "@/utils/social";



const getSocialIcon = (url) => {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return <Video className="w-4 h-4 text-red-600" />;
  if (url.includes("instagram.com")) return <Camera className="w-4 h-4 text-pink-600" />;
  if (url.includes("tiktok.com")) return <Video className="w-4 h-4 text-black" />;
  return <Globe className="w-4 h-4 text-blue-600" />;
};

export default function MediaSocialPage() {
  const { showToast } = useToast();
  const [socialMedias, setSocialMedias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    link: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = React.useRef(null);


  useEffect(() => {
    fetchSocialMedias();
  }, []);

  const fetchSocialMedias = async () => {
    setLoading(true);
    try {
      const res = await socialMediaService.getSocialMedias();
      if (res.data.success) {
        setSocialMedias(res.data.data);
      }
    } catch (err) {
      console.error("Gagal memuat media sosial:", err);
      setError("Gagal memuat data media sosial");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({ title: "", link: "" });
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus media sosial ini?")) return;
    try {
      const res = await socialMediaService.deleteSocialMedia(id);
      if (res.data.success) {
        showToast("Media sosial berhasil dihapus!", "success");
        fetchSocialMedias();
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Gagal menghapus media sosial", "error");
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.link) {
      showToast("Judul dan Link wajib diisi", "error");
      return;
    }

    if (!imageFile) {
      showToast("Thumbnail wajib diunggah", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("link", formData.link);
      if (imageFile) {
        formDataObj.append("image", imageFile);
      }

      const res = await socialMediaService.createSocialMedia(formDataObj);
      if (res.data.success) {
        showToast("Media sosial berhasil ditambahkan!", "success");
        setIsModalOpen(false);
        fetchSocialMedias();
      }
    } catch (err) {

      showToast(err?.response?.data?.message || "Gagal menambahkan media sosial", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2
            className="text-xl font-bold text-[#4a1a1a]"
            style={{ fontFamily: "var(--font-noto-serif)" }}
          >
            Media Sosial & Video
          </h2>
          <p
            className="text-sm text-[#8b6f66] mt-1"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Kelola konten video dari Instagram, TikTok, atau YouTube untuk ditampilkan di landing page
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#4a1a1a] hover:bg-[#2b1d19] text-white text-xs font-semibold px-5 py-2.5 rounded-md transition-colors shadow-sm"
          style={{ fontFamily: "var(--font-plus-jakarta)" }}
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Konten</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#4a1a1a]" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {socialMedias.length > 0 ? (
            socialMedias.map((item) => {
              const embedUrl = getEmbedUrl(item.link);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.05)] border border-[#f0e2d9] flex flex-col group transition-all hover:shadow-[0_12px_25px_rgba(0,0,0,0.08)] hover:-translate-y-1"
                >
                  <div className="aspect-video bg-black relative">
                    {item.thumbnail ? (
                      <div className="w-full h-full relative">
                        <Image 
                          src={`${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace('/api/v1', '')}${item.thumbnail}`} 
                          alt={item.title} 
                          fill 
                          className="object-cover" 
                        />

                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <Video className="w-10 h-10 text-white opacity-50" />
                        </div>
                      </div>
                    ) : embedUrl ? (
                      <iframe
                        src={embedUrl}
                        className="w-full h-full border-none"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      ></iframe>
                    ) : (

                      <div className="w-full h-full flex flex-col items-center justify-center text-[#8b6f66] bg-[#fdf2f0] p-6 text-center">
                        <Video className="w-10 h-10 mb-2 opacity-20" />
                        <p className="text-xs font-medium">Link tidak dapat di-preview secara langsung</p>
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-3 text-[10px] flex items-center gap-1 text-[#4a1a1a] font-bold hover:underline"
                        >
                          LIHAT DI SOURCE <LinkIcon className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-red-50 text-red-600 rounded-full shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3
                        className="font-bold text-[#2b1d19] leading-tight"
                        style={{ fontFamily: "var(--font-plus-jakarta)" }}
                      >
                        {item.title}
                      </h3>
                      <div className="shrink-0 p-1.5 bg-[#fdf2f0] rounded-lg">
                        {getSocialIcon(item.link)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-[10px] text-[#8b6f66] bg-[#fafafa] p-2 rounded-lg border border-[#f5f5f5]">
                      <LinkIcon className="w-3 h-3 shrink-0" />
                      <span className="truncate flex-1">{item.link}</span>
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-[#4a1a1a]"
                      >
                        <LinkIcon className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-[#fdf2f0] flex items-center justify-center mb-6">
                <Video className="w-10 h-10 text-[#e6d1c7]" />
              </div>
              <h3 className="text-xl font-bold text-[#2b1d19] mb-2">
                Belum Ada Konten Video
              </h3>
              <p className="text-sm text-[#8b6f66] max-w-sm">
                Tambahkan link video dari Instagram, TikTok, atau YouTube untuk mempercantik landing page Anda.
              </p>
              <button
                onClick={openAddModal}
                className="mt-8 bg-[#4a1a1a] hover:bg-[#2b1d19] text-white text-sm font-semibold px-8 py-3 rounded-lg transition-colors shadow-lg"
              >
                Mulai Tambah Konten
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal Tambah Konten */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all">
          <div
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#2b1d19]">
                    Tambah Konten
                  </h2>
                  <p className="text-xs text-[#8b6f66] mt-1">Sematkan video dari platform favorit Anda</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-[#2b1d19] uppercase tracking-wider mb-2">
                    Judul Konten
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#4a1a1a]/10 focus:border-[#4a1a1a] transition-all text-sm placeholder:text-gray-300"
                    placeholder="Contoh: Tutorial Fade Cut"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2b1d19] uppercase tracking-wider mb-2">
                    Link Video / URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-[#4a1a1a]/10 focus:border-[#4a1a1a] transition-all text-sm placeholder:text-gray-300"
                      placeholder="https://www.instagram.com/p/..."
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <LinkIcon className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="mt-2 text-[10px] text-[#8b6f66] flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    Mendukung YouTube, Instagram Reels/Posts, dan TikTok
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2b1d19] uppercase tracking-wider mb-2">
                    Thumbnail (Ukuran Story IG 9:16)
                  </label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative aspect-[9/16] max-h-64 mx-auto rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden
                      ${imagePreview ? 'border-[#4a1a1a] bg-[#fdf2f0]' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
                  >
                    {imagePreview ? (
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-[10px] text-gray-400 font-medium">Klik untuk upload foto</p>
                      </>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                  <p className="mt-2 text-[10px] text-[#8b6f66] text-center italic">
                    Format: JPG, PNG, WebP. Disarankan ukuran 1080x1920
                  </p>
                </div>


                <div className="pt-4">
                  <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#4a1a1a] hover:bg-[#2b1d19] text-white text-sm font-bold transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : <Plus className="w-5 h-5" />}
                    <span>{isSubmitting ? "Sedang Menyimpan..." : "Tambahkan Konten"}</span>
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full mt-3 py-3 text-sm font-semibold text-[#8b6f66] hover:text-[#4a1a1a] transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
