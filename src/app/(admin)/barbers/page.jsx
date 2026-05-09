"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader2, Plus, X, UploadCloud, User, Briefcase, Award } from "lucide-react";
import { barberService } from "@/services/barberService";
import Image from "next/image";

export default function BarbersPage() {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    nama_kapster: "",
    spesialisasi: "",
    pengalaman: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    setLoading(true);
    try {
      const res = await barberService.getBarbers();
      if (res.data.success) {
        setBarbers(res.data.data);
      }
    } catch (err) {
      console.error("Gagal memuat kapster:", err);
      setError("Gagal memuat data kapster");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
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

  const openAddModal = () => {
    setFormData({ nama_kapster: "", spesialisasi: "", pengalaman: "" });
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleSaveBarber = async () => {
    if (!formData.nama_kapster) {
      alert("Nama Kapster wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const formPayload = new FormData();
      formPayload.append("nama_kapster", formData.nama_kapster);
      formPayload.append("spesialisasi", formData.spesialisasi || "");
      formPayload.append("pengalaman", formData.pengalaman || 0);
      if (imageFile) {
        formPayload.append("image", imageFile);
      }

      const res = await barberService.createBarber(formPayload);
      if (res.data.success) {
        alert("Kapster berhasil ditambahkan!");
        setIsModalOpen(false);
        fetchBarbers();
      } else {
        alert(res.data.message || "Gagal menambahkan kapster");
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Terjadi kesalahan saat menambahkan kapster");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace(/\/api\/v1\/?$/, "");
    return `${baseUrl}${url}`;
  };

  return (
    <div className="space-y-8 pb-12 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#4a1a1a]" style={{ fontFamily: "var(--font-noto-serif)" }}>Tim Barber / Kapster</h2>
          <p className="text-sm text-[#8b6f66] mt-1" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
            Kelola data dan profil kapster ahli di Key Barber
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#4a1a1a] hover:bg-[#2b1d19] text-white text-xs font-semibold px-5 py-2.5 rounded-md transition-colors shadow-sm" 
          style={{ fontFamily: "var(--font-plus-jakarta)" }}
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kapster</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#4a1a1a]" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {barbers.length > 0 ? barbers.map((barber) => (
            <div key={barber.id} className="bg-white rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#f0e2d9] transition-all hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-1">
              <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden group">
                {barber.url_foto_upload ? (
                  <img 
                    src={getImageUrl(barber.url_foto_upload)} 
                    alt={barber.nama_kapster} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#fdf2f0]">
                    <User className="w-16 h-16 text-[#e6d1c7]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                    {barber.nama_kapster}
                  </h3>
                </div>
              </div>
              <div className="p-4 space-y-3 bg-white">
                <div className="flex items-start gap-2">
                  <Briefcase className="w-4 h-4 text-[#8b6f66] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider" style={{ fontFamily: "var(--font-be-vietnam)" }}>Spesialisasi</p>
                    <p className="text-sm font-medium text-[#2b1d19]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>{barber.spesialisasi || "Umum"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-[#8b6f66] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider" style={{ fontFamily: "var(--font-be-vietnam)" }}>Pengalaman</p>
                    <p className="text-sm font-medium text-[#2b1d19]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>{barber.pengalaman || 0} Tahun</p>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-[#2b1d19] mb-1">Belum Ada Kapster</h3>
              <p className="text-sm text-gray-500 max-w-md">Data tim barber Anda masih kosong. Tambahkan kapster pertama Anda untuk menampilkannya di sini.</p>
              <button 
                onClick={openAddModal}
                className="mt-6 bg-[#4a1a1a] hover:bg-[#2b1d19] text-white text-sm font-semibold px-6 py-2.5 rounded-md transition-colors shadow-sm"
              >
                Tambah Kapster Pertama
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal Tambah Kapster */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl max-h-[90vh] overflow-y-auto" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-[#2b1d19]">Tambah Kapster Baru</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#2b1d19] mb-2">Foto Kapster</label>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-[#fdf2f0] border-2 border-dashed border-[#e6d1c7] flex items-center justify-center overflow-hidden shrink-0 relative">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-[#e6d1c7]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label 
                        htmlFor="image-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <UploadCloud className="w-4 h-4" />
                        Pilih Foto
                      </label>
                      <p className="mt-2 text-xs text-gray-500">Format: JPG, PNG, WEBP. Ukuran maks 2MB.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2b1d19] mb-2">Nama Kapster</label>
                  <input 
                    type="text" 
                    name="nama_kapster"
                    value={formData.nama_kapster}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm"
                    placeholder="Budi Santoso"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#2b1d19] mb-2">Spesialisasi</label>
                    <input 
                      type="text" 
                      name="spesialisasi"
                      value={formData.spesialisasi}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm"
                      placeholder="Fade & Undercut"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#2b1d19] mb-2">Pengalaman (Tahun)</label>
                    <input 
                      type="number" 
                      name="pengalaman"
                      value={formData.pengalaman}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm"
                      placeholder="5"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <button 
                    onClick={handleSaveBarber}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-[#4a1a1a] hover:bg-[#2b1d19] text-white text-sm font-semibold transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                    <span>Simpan Kapster Baru</span>
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
