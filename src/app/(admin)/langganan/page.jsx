"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  SquarePen,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
  Settings2,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import { packageService } from "@/services/packageService";
import { aiConfigService } from "@/services/aiConfigService";

const ToggleSwitch = ({ checked, onChange, disabled }) => {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? "bg-[#86efac]" : "bg-[#fca5a5]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      role="switch"
      aria-checked={checked}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default function LanggananPage() {
  const [packages, setPackages] = useState([]);
  const [activeModels, setActiveModels] = useState({ llm: [], image_gen: [] });
  const [exchangeSettings, setExchangeSettings] = useState({
    globalMultiplier: 1.35,
    baseRateUsdIdr: 17332,
    inflationBuffer: 0.05,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    namaPaket: "",
    jumlahKoin: "",
    deskripsi: "",
    llmModelId: "",
    imageModelId: "",
    featStandardScan: true,
    featSymmetry: false,
    featAdvMapping: false,
    featVirtualTryOn: false,
    featHistory: false,
    featHairstyleTrend: false,
    typeValue: "ONTIME",
    durasi_value: "30",
    durasi_unit: "HARI",
    hppIdeal: 0,
    estimasiModalApi: 0,
    hargaNominal: "",
    promoAktif: false,
    hargaDiskon: "",
    diskonMulai: "",
    diskonAkhir: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculatingHpp, setIsCalculatingHpp] = useState(false);

  const [isCalculatingKoin, setIsCalculatingKoin] = useState(false);
  const [estimasiKoinIdeal, setEstimasiKoinIdeal] = useState(0);

  useEffect(() => {
    fetchPackages();
    fetchActiveModels();
    fetchExchangeSettings();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await packageService.getPackages(1, 100);
      if (res.data.success) {
        const combined = [
          ...(res.data.data.topup_koin || []),
          ...(res.data.data.langganan_premium || []),
        ];
        setPackages(combined);
      }
    } catch (err) {
      console.error("Gagal memuat paket:", err);
      setError("Gagal memuat daftar paket harga");
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveModels = async () => {
    try {
      const res = await packageService.getActiveModels();
      if (res.data && res.data.success && res.data.data) {
        setActiveModels({
          llm: res.data.data.llm || [],
          image_gen: res.data.data.image_gen || [],
        });
      }
    } catch (err) {
      console.error("Gagal memuat active models:", err);
    }
  };

  const fetchExchangeSettings = async () => {
    try {
      const res = await aiConfigService.getExchangeSettings();
      if (res.data && res.data.success && res.data.data) {
        setExchangeSettings(res.data.data);
      }
    } catch (err) {
      console.error("Gagal memuat exchange settings:", err);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      const delayDebounce = setTimeout(() => {
        calculateKoinIdeal();
      }, 500);
      return () => clearTimeout(delayDebounce);
    }
  }, [
    isModalOpen,
    formData.featVirtualTryOn,
    formData.featSymmetry,
    formData.featAdvMapping,
    formData.featHistory,
    formData.featHairstyleTrend,
  ]);

  const calculateKoinIdeal = async () => {
    setIsCalculatingKoin(true);
    try {
      const res = await packageService.calculateIdealKoin({
        featVirtualTryOn: formData.featVirtualTryOn,
        featSymmetry: formData.featSymmetry,
        featAdvMapping: formData.featAdvMapping,
        featHistory: formData.featHistory,
        featTrendAnalysis: formData.featHairstyleTrend,
      });
      if (res.data && res.data.success) {
        const responseData = res.data.data;
        const resultVal =
          typeof responseData === "number"
            ? responseData
            : responseData?.total_koin_ideal || 0;

        setEstimasiKoinIdeal(resultVal);
      }
    } catch (err) {
      console.error("Gagal menghitung estimasi koin ideal:", err);
    } finally {
      setIsCalculatingKoin(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      const delayDebounce = setTimeout(() => {
        calculateHPP();
      }, 500);
      return () => clearTimeout(delayDebounce);
    }
  }, [
    formData.jumlahKoin,
    formData.featVirtualTryOn,
    formData.llmModelId,
    formData.imageModelId,
    isModalOpen,
  ]);

  const calculateHPP = async () => {
    const koin = Number(formData.jumlahKoin);

    if (!koin || koin <= 0 || !formData.llmModelId) {
      setFormData((prev) => ({ ...prev, hppIdeal: 0, estimasiModalApi: 0 }));
      return;
    }

    if (formData.featVirtualTryOn && !formData.imageModelId) {
      setFormData((prev) => ({ ...prev, hppIdeal: 0, estimasiModalApi: 0 }));
      return;
    }

    setIsCalculatingHpp(true);
    try {
      const res = await packageService.calculateHpp({
        jumlahKoin: koin,
        featVirtualTryOn: formData.featVirtualTryOn,
        llmModelId: formData.llmModelId,
        imageModelId: formData.featVirtualTryOn ? formData.imageModelId : null,
      });
      if (res.data.success) {
        setFormData((prev) => ({
          ...prev,
          hppIdeal: res.data.data.hppIdeal,
          estimasiModalApi: res.data.data.estimasiModalApi,
        }));
      }
    } catch (err) {
      console.error("Gagal menghitung HPP:", err);
    } finally {
      setIsCalculatingHpp(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData((prev) => {
      const newState = { ...prev, [feature]: !prev[feature] };

      if (feature === "featVirtualTryOn" && !newState.featVirtualTryOn) {
        newState.imageModelId = "";
      } else if (feature === "featVirtualTryOn" && newState.featVirtualTryOn) {
        if (activeModels.image_gen.length === 1) {
          newState.imageModelId =
            activeModels.image_gen[0].id || activeModels.image_gen[0]._id;
        }
      }
      return newState;
    });
  };

  const openAddModal = () => {
    const defaultLlm =
      activeModels.llm.length === 1
        ? activeModels.llm[0].id || activeModels.llm[0]._id
        : "";
    const defaultImage =
      activeModels.image_gen.length === 1
        ? activeModels.image_gen[0].id || activeModels.image_gen[0]._id
        : "";

    setFormData({
      ...initialFormState,
      llmModelId: defaultLlm,
      imageModelId: defaultImage,
    });
    setIsEditing(false);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (pkg) => {
    const defaultLlm =
      activeModels.llm.length === 1
        ? activeModels.llm[0].id || activeModels.llm[0]._id
        : "";
    const defaultImage =
      activeModels.image_gen.length === 1
        ? activeModels.image_gen[0].id || activeModels.image_gen[0]._id
        : "";

    setFormData({
      ...initialFormState,
      namaPaket: pkg.nama,
      typeValue: pkg.tipe,
      jumlahKoin: pkg.koin,
      hargaNominal: pkg.harga_asli,
      promoAktif: pkg.is_promo,
      hargaDiskon: pkg.is_promo ? pkg.harga_bayar : "",
      llmModelId: pkg.llmModelId || defaultLlm,
      imageModelId: pkg.imageModelId || defaultImage,
      featStandardScan: true,
    });
    setEditingId(pkg.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus paket ini?")) {
      try {
        const res = await packageService.deletePackage(id);
        if (res.data.success) {
          fetchPackages();
        }
      } catch (err) {
        alert(err?.response?.data?.message || "Gagal menghapus paket");
      }
    }
  };

  const handleSavePackage = async () => {
    if (!formData.llmModelId) {
      alert("PENTING: Anda wajib memilih Model AI Wajah (LLM).");
      return;
    }
    if (formData.featVirtualTryOn && !formData.imageModelId) {
      alert(
        "PENTING: Fitur Virtual Try-On aktif. Anda wajib memilih Model Image Gen!",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        namaPaket: formData.namaPaket,
        deskripsi: formData.deskripsi,
        typeValue: formData.typeValue,
        jumlahKoin: Number(formData.jumlahKoin),
        llmModelId: formData.llmModelId,
        imageModelId: formData.featVirtualTryOn ? formData.imageModelId : null,
        featStandardScan: formData.featStandardScan,
        featSymmetry: formData.featSymmetry,
        featAdvMapping: formData.featAdvMapping,
        featVirtualTryOn: formData.featVirtualTryOn,
        featHistory: formData.featHistory,
        hppIdeal: Number(formData.hppIdeal),
        hargaNominal: Number(formData.hargaNominal),
        promoAktif: formData.promoAktif,
      };

      if (formData.typeValue === "SUBSCRIPTION") {
        payload.durasi_value = Number(formData.durasi_value);
        payload.durasi_unit = formData.durasi_unit;
      }

      if (formData.promoAktif) {
        payload.hargaDiskon = Number(formData.hargaDiskon);
        payload.diskonMulai = formData.diskonMulai
          ? new Date(formData.diskonMulai).toISOString()
          : null;
        payload.diskonAkhir = formData.diskonAkhir
          ? new Date(formData.diskonAkhir).toISOString()
          : null;
      }

      let res;
      if (isEditing) {
        res = await packageService.updatePackage(editingId, payload);
      } else {
        res = await packageService.createPackage(payload);
      }

      if (res.data.success) {
        alert(`Paket berhasil ${isEditing ? "diupdate" : "disimpan"}!`);
        setIsModalOpen(false);
        fetchPackages();
      } else {
        alert(res.data.message || "Gagal menyimpan paket");
      }
    } catch (err) {
      if (err?.response?.data?.errors) {
        alert(err.response.data.errors[0].message);
      } else {
        alert(err?.response?.data?.message || "Gagal menyimpan paket");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2
            className="text-xl font-bold text-[#4a1a1a]"
            style={{ fontFamily: "var(--font-noto-serif)" }}
          >
            List Paket Harga
          </h2>
          <p className="text-sm text-[#8b6f66] mt-1">
            Atur harga paket, kuota koin, dan status langganan
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#4a1a1a] hover:bg-[#3a1414] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Tambah Paket
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#4a1a1a]" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-md text-center">
          {error}
        </div>
      ) : (
        <div className="bg-white border border-[#e6d1c7] rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[#4a1a1a] border-b border-[#e6d1c7]">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 font-bold text-center sm:text-left"
                  >
                    Nama Paket
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold text-center">
                    Tipe Paket
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold text-center">
                    Koin
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold text-center">
                    Durasi
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold text-center">
                    Harga
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold text-center">
                    Status Promo
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {packages.length > 0 ? (
                  packages.map((pkg) => (
                    <tr
                      key={pkg.id}
                      className="bg-white border-b border-[#e6d1c7] hover:bg-[#fafafa] transition-colors"
                    >
                      <td className="px-6 py-4 text-[#8b6f66] font-medium text-center sm:text-left">
                        {pkg.nama}
                      </td>
                      <td className="px-6 py-4 text-[#8b6f66] text-center">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {pkg.tipe}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#8b6f66] text-center">
                        {pkg.koin}
                      </td>
                      <td className="px-6 py-4 text-[#8b6f66] text-center">
                        {pkg.durasi_text}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {pkg.is_promo && (
                          <div className="text-xs text-[#ef4444] line-through mb-1">
                            Rp{pkg.harga_asli?.toLocaleString("id-ID")}
                          </div>
                        )}
                        <div className="font-bold text-[#4a1a1a]">
                          Rp{pkg.harga_bayar?.toLocaleString("id-ID")}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {pkg.is_promo ? (
                          <span className="bg-[#fef08a] text-yellow-800 text-xs font-bold px-3 py-1 rounded-md">
                            PROMO
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-md">
                            NORMAL
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => openEditModal(pkg)}
                            className="text-[#4a1a1a] hover:text-[#8b6f66] transition-colors"
                            title="Edit"
                          >
                            <SquarePen className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(pkg.id)}
                            className="text-[#ef4444] hover:text-[#b91c1c] transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Belum ada paket yang tersedia
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl w-full max-w-3xl shadow-xl max-h-[90vh] overflow-y-auto"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-[#2b1d19]">
                  {isEditing ? "Edit Harga Langganan" : "Buat Harga Langganan"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                      Nama Paket
                    </label>
                    <input
                      type="text"
                      name="namaPaket"
                      value={formData.namaPaket}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm"
                      placeholder="Starter Pack"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                      Jumlah Koin
                    </label>
                    <input
                      type="number"
                      name="jumlahKoin"
                      value={formData.jumlahKoin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm"
                      placeholder="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm min-h-[80px]"
                    placeholder="Paket hemat untuk memulai analisis wajah Anda dengan kredit yang cukup"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                    Pilih Fitur sesuai kebutuhan
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-semibold text-sm text-[#2b1d19]">
                          Standard Face Shape Detection
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">
                          Analisis dasar untuk menentukan bentuk wajah user.
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={formData.featStandardScan}
                        onChange={() => handleFeatureToggle("featStandardScan")}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-semibold text-sm text-[#2b1d19]">
                          Facial Symmetry Scoring
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">
                          Logika AI untuk menghitung skor persentase simetri
                          wajah.
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={formData.featSymmetry}
                        onChange={() => handleFeatureToggle("featSymmetry")}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-semibold text-sm text-[#2b1d19]">
                          Advanced Feature Mapping
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">
                          Deteksi mendalam area dahi, rahang, dan pipi.
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={formData.featAdvMapping}
                        onChange={() => handleFeatureToggle("featAdvMapping")}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-semibold text-sm text-[#2b1d19]">
                          Virtual Try-on (AI Generation)
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">
                          Fitur premium in-painting gaya rambut menggunakan
                          Image Gen.
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={formData.featVirtualTryOn}
                        onChange={() => handleFeatureToggle("featVirtualTryOn")}
                        disabled={activeModels.image_gen.length === 0}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-semibold text-sm text-[#2b1d19]">
                          Extended History Storage
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">
                          Penyimpanan data hasil analisis di database selamanya.
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={formData.featHistory}
                        onChange={() => handleFeatureToggle("featHistory")}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-semibold text-sm text-[#2b1d19]">
                          Hairstyle Trend Analysis
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">
                          Rekomendasi gaya rambut yang sedang tren.
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={formData.featHairstyleTrend}
                        onChange={() =>
                          handleFeatureToggle("featHairstyleTrend")
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                  <div>
                    <label className="block text-sm font-semibold text-[#2b1d19] mb-3">
                      Model AI Wajah (LLM){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    {activeModels.llm.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center p-5 bg-red-50/50 border border-red-100 rounded-lg border-dashed">
                        <AlertTriangle className="w-6 h-6 text-red-500 mb-2" />
                        <p className="text-xs font-medium text-red-800 mb-3">
                          Model LLM belum tersedia
                        </p>
                        <Link
                          href="/ai-config?action=add-model"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 text-red-700 rounded-md text-[10px] font-bold hover:bg-red-50 transition-colors"
                        >
                          <Settings2 className="w-3 h-3" />
                          Setup AI Config
                        </Link>
                      </div>
                    ) : activeModels.llm.length === 1 ? (
                      <div className="p-4 border-2 border-[#4a1a1a] bg-[#fafafa] rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-sm text-[#2b1d19] uppercase tracking-wide">
                            {activeModels.llm[0].namaRouter}
                          </span>
                          <CheckCircle2 className="w-5 h-5 text-[#4a1a1a]" />
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-medium text-gray-500">
                          <span>
                            <span className="text-[#2b1d19]">Input:</span> $
                            {activeModels.llm[0].hargaInput1M} / 1M Tokens
                          </span>
                          <div className="w-px h-3 bg-gray-300"></div>
                          <span>
                            <span className="text-[#2b1d19]">Output:</span> $
                            {activeModels.llm[0].hargaOutput1M} / 1M Tokens
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                        {activeModels.llm.map((model) => {
                          const isSelected =
                            formData.llmModelId === (model.id || model._id);
                          return (
                            <button
                              type="button"
                              key={model.id || model._id}
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  llmModelId: model.id || model._id,
                                }))
                              }
                              className={`text-left p-4 border-2 rounded-lg transition-all ${
                                isSelected
                                  ? "border-[#4a1a1a] bg-[#fafafa] shadow-sm"
                                  : "border-gray-200 hover:border-gray-300 bg-white"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-sm text-[#2b1d19] uppercase tracking-wide">
                                  {model.namaRouter}
                                </span>
                                {isSelected && (
                                  <CheckCircle2 className="w-5 h-5 text-[#4a1a1a]" />
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-[11px] font-medium text-gray-500">
                                <span>
                                  <span className="text-[#2b1d19]">Input:</span>{" "}
                                  ${model.hargaInput1M} / 1M
                                </span>
                                <div className="w-px h-3 bg-gray-300"></div>
                                <span>
                                  <span className="text-[#2b1d19]">
                                    Output:
                                  </span>{" "}
                                  ${model.hargaOutput1M} / 1M
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#2b1d19] mb-3">
                      Model Image Gen
                    </label>
                    {activeModels.image_gen.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center p-5 bg-amber-50/50 border border-amber-100 rounded-lg border-dashed">
                        <AlertTriangle className="w-6 h-6 text-amber-500 mb-2" />
                        <p className="text-xs font-medium text-amber-800 mb-3">
                          Model Image Gen kosong
                        </p>
                        <Link
                          href="/ai-config?action=add-model"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-200 text-amber-700 rounded-md text-[10px] font-bold hover:bg-amber-50 transition-colors"
                        >
                          <Settings2 className="w-3 h-3" />
                          Setup AI Config
                        </Link>
                      </div>
                    ) : !formData.featVirtualTryOn ? (
                      <div className="flex flex-col items-center justify-center text-center p-5 bg-gray-50 border border-gray-200 rounded-lg h-full opacity-60">
                        <p className="text-xs font-medium text-gray-500">
                          Aktifkan fitur Virtual Try-On di bawah untuk memilih
                          model ini.
                        </p>
                      </div>
                    ) : activeModels.image_gen.length === 1 ? (
                      <div className="p-4 border-2 border-[#4a1a1a] bg-[#fafafa] rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-sm text-[#2b1d19] uppercase tracking-wide">
                            {activeModels.image_gen[0].namaRouter}
                          </span>
                          <CheckCircle2 className="w-5 h-5 text-[#4a1a1a]" />
                        </div>
                        <div className="flex flex-col gap-1 text-[11px] font-medium text-gray-500">
                          <span>
                            <span className="text-[#2b1d19]">Harga:</span> $
                            {activeModels.image_gen[0].hargaPerImage} / Image
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                        {activeModels.image_gen.map((model) => {
                          const isSelected =
                            formData.imageModelId === (model.id || model._id);
                          return (
                            <button
                              type="button"
                              key={model.id || model._id}
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  imageModelId: model.id || model._id,
                                }))
                              }
                              className={`text-left p-4 border-2 rounded-lg transition-all ${
                                isSelected
                                  ? "border-[#4a1a1a] bg-[#fafafa] shadow-sm"
                                  : "border-gray-200 hover:border-gray-300 bg-white"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-sm text-[#2b1d19] uppercase tracking-wide">
                                  {model.namaRouter}
                                </span>
                                {isSelected && (
                                  <CheckCircle2 className="w-5 h-5 text-[#4a1a1a]" />
                                )}
                              </div>
                              <div className="flex flex-col gap-1 text-[11px] font-medium text-gray-500">
                                <span>
                                  <span className="text-[#2b1d19]">Harga:</span>{" "}
                                  ${model.hargaPerImage} / Image
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                    Type and Value
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, typeValue: "ONTIME" })
                      }
                      className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
                        formData.typeValue === "ONTIME"
                          ? "border-[#4a1a1a] shadow-sm bg-[#fafafa]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-6 h-6 shrink-0 mt-0.5">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                            fill="currentColor"
                          />
                          <path
                            d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
                            fill="white"
                          />
                          <path
                            d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-[#2b1d19] text-sm">
                          ONTIME
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Top-up Sekali Pakai
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, typeValue: "SUBSCRIPTION" })
                      }
                      className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
                        formData.typeValue === "SUBSCRIPTION"
                          ? "border-[#4a1a1a] shadow-sm bg-[#fafafa]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-6 h-6 shrink-0 mt-0.5 text-[#2b1d19]">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          ></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-[#2b1d19] text-sm">
                          SUBSCRIPTION
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Langganan Berkala
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {formData.typeValue === "SUBSCRIPTION" && (
                  <div>
                    <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                      Durasi (untuk Subscription)
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="number"
                        name="durasi_value"
                        value={formData.durasi_value}
                        onChange={handleInputChange}
                        className="w-1/2 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm"
                        placeholder="30"
                      />
                      <select
                        name="durasi_unit"
                        value={formData.durasi_unit}
                        onChange={handleInputChange}
                        className="w-1/2 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm bg-white"
                      >
                        <option value="HARI">HARI</option>
                        <option value="BULAN">BULAN</option>
                        <option value="TAHUN">TAHUN</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <div className="bg-[#e2fae8] rounded-lg p-5">
                    <h4 className="font-bold text-[#14532d] text-sm mb-3 flex items-center gap-2">
                      Analisis Profitabilitas
                      {isCalculatingHpp && (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      )}
                    </h4>
                    <div className="space-y-2 text-xs text-[#166534]">
                      <div className="flex justify-between">
                        <span>Estimasi HPP (API + Kurs Buffer)</span>
                        <span className="font-bold">
                          Rp {formData.estimasiModalApi.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimasi Admin Fee (Doku)</span>
                        <span className="font-bold">Rp 4.500 + 0,7%</span>
                      </div>
                      <div className="flex justify-between pt-2 mt-2 border-t border-[#bbf7d0]">
                        <span className="font-bold">
                          HPP Ideal{" "}
                          <span className="font-normal text-[10px]">
                            (Rp
                            {formData.estimasiModalApi.toLocaleString(
                              "id-ID",
                            )}{" "}
                            x {exchangeSettings.globalMultiplier} Multiplier) +
                            Rp4.500
                          </span>
                        </span>
                        <span className="font-bold text-sm">
                          Rp{formData.hppIdeal.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                    {isCalculatingKoin ? (
                      <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                        <span>
                          Mengkalkulasi koin ideal berdasarkan fitur...
                        </span>
                      </div>
                    ) : (
                      <>
                        {isCalculatingKoin ? (
                          <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                            <span>Mengkalkulasi potongan koin...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-full shrink-0">
                                <Lightbulb className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-blue-900">
                                  Estimasi Potongan per 1x Generate
                                </p>
                                <p className="text-[10px] text-blue-700 mt-0.5 leading-relaxed">
                                  Estimasi koin yang akan dipotong dari saldo
                                  user 1x analisis
                                  dengan kombinasi fitur di atas.
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col items-center justify-center bg-white px-4 py-2 rounded-md border border-blue-200 shadow-sm shrink-0">
                              <span className="text-lg font-black text-blue-700 leading-none">
                                {estimasiKoinIdeal}
                              </span>
                              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider mt-1">
                                Koin
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div>
                    <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                      Harga Nominal
                    </label>
                    <input
                      type="number"
                      name="hargaNominal"
                      value={formData.hargaNominal}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm"
                      placeholder="Rp25.000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                      PROMO AKTIF
                    </label>
                    <div className="mt-2">
                      <ToggleSwitch
                        checked={formData.promoAktif}
                        onChange={() => handleFeatureToggle("promoAktif")}
                      />
                    </div>
                  </div>
                </div>

                {formData.promoAktif && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                        Harga Diskon
                      </label>
                      <input
                        type="number"
                        name="hargaDiskon"
                        value={formData.hargaDiskon}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm"
                        placeholder="Rp23.000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                        Diskon Mulai
                      </label>
                      <input
                        type="date"
                        name="diskonMulai"
                        value={formData.diskonMulai}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                        Diskon Akhir
                      </label>
                      <input
                        type="date"
                        name="diskonAkhir"
                        value={formData.diskonAkhir}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    onClick={handleSavePackage}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-[#4a1a1a] hover:bg-[#2b1d19] text-white text-sm font-semibold transition-colors disabled:opacity-70 w-full"
                  >
                    {isSubmitting && (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    )}
                    <span>Simpan Paket</span>
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
