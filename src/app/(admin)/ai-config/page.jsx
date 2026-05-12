"use client";

import React, { useState, useEffect } from "react";
import {
  Globe,
  Wallet,
  Activity,
  Loader2,
  Bot,
  X,
  CheckCircle2,
  AlertCircle,
  SquarePen,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { aiConfigService } from "@/services/aiConfigService";
import { useToast } from "@/contexts/ToastContext";

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

export default function AiConfigPage() {
  const { showToast, showConfirm } = useToast();
  const [routers, setRouters] = useState([]);
  const [exchange, setExchange] = useState({
    globalMultiplier: 1.35,
    baseRateUsdIdr: 17332,
    inflationBuffer: 0.05,
  });
  const [logsData, setLogsData] = useState([]);
  const [logsPagination, setLogsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });
  const [isLogsLoading, setIsLogsLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingAPI, setIsEditingAPI] = useState(false);
  const [editingAPIId, setEditingAPIId] = useState(null);
  const [formData, setFormData] = useState({
    namaRouter: "",
    baseUrl: "",
    modelName: "",
    apiKey: "",
    typeAi: "LLM",
    pricingUnit: "1M_TOKENS",
    hargaInput1M: "",
    hargaOutput1M: "",
    hargaPerImage: "",
    maxBudget: "",
    rpmLimit: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [exchangeForm, setExchangeForm] = useState({
    globalMultiplierDisplay: 35,
    baseRateUsdIdr: 17332,
    inflationBufferDisplay: 5,
  });
  const [isExchangeSubmitting, setIsExchangeSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [modelsRes, exchangeRes, logsRes] = await Promise.all([
        aiConfigService.getModels(),
        aiConfigService.getExchangeSettings(),
        aiConfigService.getLogs(1, 10),
      ]);

      if (modelsRes.data.success) {
        setRouters(modelsRes.data.data || []);
      }

      if (exchangeRes.data.success && exchangeRes.data.data) {
        setExchange(exchangeRes.data.data);
      }

      if (logsRes.data.success) {
        setLogsData(logsRes.data.data || []);
        if (logsRes.data.meta) {
          setLogsPagination({
            currentPage: Number(logsRes.data.meta.page),
            totalPages: Number(logsRes.data.meta.totalPages),
            totalItems: Number(logsRes.data.meta.total),
            limit: Number(logsRes.data.meta.limit),
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch AI Config data:", err);
      setError("Gagal memuat data konfigurasi AI");
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (page = 1) => {
    console.log("Fetching logs for page:", page);
    setIsLogsLoading(true);
    try {
      const res = await aiConfigService.getLogs(page, logsPagination.limit);
      console.log("Logs response:", res.data);
      if (res.data.success) {
        setLogsData(res.data.data || []);
        if (res.data.meta) {
          setLogsPagination({
            currentPage: Number(res.data.meta.page),
            totalPages: Number(res.data.meta.totalPages),
            totalItems: Number(res.data.meta.total),
            limit: Number(res.data.meta.limit),
          });
        }
        // Scroll ke tabel logs agar user tahu data berubah
        const tableHeader = document.getElementById("logs-section");
        if (tableHeader) {
          tableHeader.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    } catch (err) {
      console.error("Failed to fetch logs:", err);
      showToast("Gagal memuat log penggunaan", "error");
    } finally {
      setIsLogsLoading(false);
    }
  };

  const toggleRouter = async (id, currentStatus) => {
    setTogglingId(id);
    try {
      const newStatus = !currentStatus;
      const res = await aiConfigService.toggleModelStatus(id, newStatus);
      if (res.data.success) {
        setRouters(
          routers.map((router) =>
            router._id === id || router.id === id
              ? { ...router, isActive: newStatus }
              : router,
          ),
        );
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
      showToast("Gagal mengubah status router", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestConnection = async () => {
    if (!formData.baseUrl || !formData.apiKey) {
      setTestResult({
        success: false,
        message: "Base URL dan API KEY harus diisi untuk test koneksi",
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await aiConfigService.testConnection({
        baseUrl: formData.baseUrl,
        apiKey: formData.apiKey,
      });
      if (res.data.success) {
        setTestResult({ success: true, message: "Koneksi berhasil" });
      } else {
        setTestResult({
          success: false,
          message: res.data.message || "Koneksi gagal",
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: err?.response?.data?.message || "Koneksi gagal",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleOpenAddModal = () => {
    setIsEditingAPI(false);
    setEditingAPIId(null);
    setFormData({
      namaRouter: "",
      baseUrl: "",
      modelName: "",
      apiKey: "",
      typeAi: "LLM",
      pricingUnit: "1M_TOKENS",
      hargaInput1M: "",
      hargaOutput1M: "",
      hargaPerImage: "",
      maxBudget: "",
      rpmLimit: "",
    });
    setTestResult(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (router) => {
    setIsEditingAPI(true);
    setEditingAPIId(router._id || router.id);
    setFormData({
      namaRouter: router.namaRouter || "",
      baseUrl: router.baseUrl || "",
      modelName: router.modelName || "",
      apiKey: router.apiKey || "",
      typeAi: router.typeAi || "LLM",
      pricingUnit:
        router.pricingUnit ||
        (router.typeAi === "IMAGE_GEN" ? "IMAGE" : "1M_TOKENS"),
      hargaInput1M: router.hargaInput1M || "",
      hargaOutput1M: router.hargaOutput1M || "",
      hargaPerImage: router.hargaPerImage || "",
      maxBudget: router.maxBudget || "",
      rpmLimit: router.rpmLimit || "",
    });
    setTestResult(null);
    setIsModalOpen(true);
  };

  const handleDeleteAPI = async (id) => {
    showConfirm(
      "Hapus API Model",
      "Apakah Anda yakin ingin menghapus model API ini?",
      async () => {
        try {
          const res = await aiConfigService.deleteModel(id);
          if (res.data.success) {
            showToast("Model API berhasil dihapus!", "success");
            fetchData();
          }
        } catch (err) {
          showToast(err?.response?.data?.message || "Gagal menghapus model API", "error");
        }
      }
    );
  };

  const handleSaveAPI = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        hargaInput1M: Number(formData.hargaInput1M) || 0,
        hargaOutput1M:
          formData.typeAi === "LLM" ? Number(formData.hargaOutput1M) || 0 : 0,
        hargaPerImage:
          formData.typeAi === "IMAGE_GEN"
            ? Number(formData.hargaPerImage) || 0
            : 0,
        maxBudget: Number(formData.maxBudget) || 0,
        rpmLimit: Number(formData.rpmLimit) || 0,
        isActive: true,
      };

      let res;
      if (isEditingAPI) {
        res = await aiConfigService.updateModel(editingAPIId, payload);
      } else {
        res = await aiConfigService.createModel(payload);
      }

      if (res.data.success) {
        showToast(`API berhasil ${isEditingAPI ? "diupdate" : "disimpan"}!`, "success");
        setIsModalOpen(false);
        fetchData();
      } else {
        showToast(res.data.message || "Gagal menyimpan API", "error");
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Gagal menyimpan API", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenExchangeModal = () => {
    setExchangeForm({
      globalMultiplierDisplay: Math.round(
        (exchange.globalMultiplier - 1) * 100,
      ),
      baseRateUsdIdr: exchange.baseRateUsdIdr,
      inflationBufferDisplay: Math.round(exchange.inflationBuffer * 100),
    });
    setIsExchangeModalOpen(true);
  };

  const handleExchangeInputChange = (e) => {
    const { name, value } = e.target;
    setExchangeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveExchange = async () => {
    setIsExchangeSubmitting(true);
    try {
      const payload = {
        globalMultiplier:
          1 + Number(exchangeForm.globalMultiplierDisplay) / 100,
        baseRateUsdIdr: Number(exchangeForm.baseRateUsdIdr),
        inflationBuffer: Number(exchangeForm.inflationBufferDisplay) / 100,
      };

      const res = await aiConfigService.updateExchangeSettings(payload);
      if (res.data.success) {
        showToast("Master Exchange Setting berhasil diupdate!", "success");
        setIsExchangeModalOpen(false);
        fetchData();
      } else {
        showToast(res.data.message || "Gagal menyimpan setting", "error");
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Gagal menyimpan setting", "error");
    } finally {
      setIsExchangeSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#4a1a1a]" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-md">{error}</div>;
  }

  const effectiveRate =
    exchange.baseRateUsdIdr * (1 + exchange.inflationBuffer);

  return (
    <div className="space-y-12 pb-12 relative">
      {/* Konfigurasi Model Aktif */}
      <section>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2
              className="text-xl font-bold text-[#4a1a1a]"
              style={{ fontFamily: "var(--font-noto-serif)" }}
            >
              Konfigurasi Model Aktif
            </h2>
            <p
              className="text-sm text-[#8b6f66] mt-1"
              style={{ fontFamily: "var(--font-plus-jakarta)" }}
            >
              Konfigurasikan dan kelola rute model AI serta koneksi API
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="bg-[#4a1a1a] hover:bg-[#2b1d19] text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Tambah API
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {routers.length > 0 ? (
            routers.map((router) => (
              <div
                key={router._id || router.id}
                className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#f0e2d9]"
              >
                <div className="flex justify-between items-center mb-5">
                  <h3
                    className="font-bold text-[#2b1d19] tracking-wide uppercase flex items-center gap-2"
                    style={{ fontFamily: "var(--font-plus-jakarta)" }}
                  >
                    {router.namaRouter}
                    {router.isWarning && (
                      <span className="bg-red-100 text-red-600 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        LIMIT &lt; 20%
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleOpenEditModal(router)}
                      className="text-[#4a1a1a] hover:text-[#8b6f66] transition-colors"
                      title="Edit"
                    >
                      <SquarePen className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAPI(router._id || router.id)}
                      className="text-[#ef4444] hover:text-[#b91c1c] transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-gray-200 mx-1"></div>
                    <ToggleSwitch
                      checked={router.isActive}
                      disabled={togglingId === (router._id || router.id)}
                      onChange={() =>
                        toggleRouter(router._id || router.id, router.isActive)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-[10px] font-bold text-[#2b1d19] uppercase tracking-wider mb-2"
                      style={{ fontFamily: "var(--font-be-vietnam)" }}
                    >
                      Model
                    </label>
                    <input
                      type="text"
                      value={router.modelName}
                      readOnly
                      className="w-full text-sm text-[#524342] px-3 py-2 rounded border border-[#e6d1c7] bg-white focus:outline-none"
                      style={{ fontFamily: "var(--font-plus-jakarta)" }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-[10px] font-bold text-[#2b1d19] uppercase tracking-wider mb-2"
                      style={{ fontFamily: "var(--font-be-vietnam)" }}
                    >
                      API KEY
                    </label>
                    <input
                      type="password"
                      value={router.apiKey || "***************************"}
                      readOnly
                      className="w-full text-sm text-[#524342] px-3 py-2 rounded border border-[#e6d1c7] bg-white focus:outline-none"
                      style={{ fontFamily: "var(--font-plus-jakarta)" }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500 text-sm">
              Belum ada model AI yang dikonfigurasi.
            </div>
          )}
        </div>
      </section>

      {/* Master Exchange Setting */}
      <section>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2
              className="text-xl font-bold text-[#4a1a1a]"
              style={{ fontFamily: "var(--font-noto-serif)" }}
            >
              Master Exchange Setting
            </h2>
            <p
              className="text-sm text-[#8b6f66] mt-1"
              style={{ fontFamily: "var(--font-plus-jakarta)" }}
            >
              Kelola kurs mata uang, margin profit, dan buffer inflasi
            </p>
          </div>
          <button
            onClick={handleOpenExchangeModal}
            className="bg-[#4a1a1a] hover:bg-[#2b1d19] text-white text-xs font-semibold px-6 py-2 rounded-md transition-colors"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#f0e2d9] flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#fdf2f0] flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-[#4a1a1a]" />
            </div>
            <div>
              <p
                className="text-[10px] font-semibold text-[#8b6f66] mb-1"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                Global Multiplier
              </p>
              <h3
                className="text-2xl font-bold text-[#2b1d19]"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                {exchange.globalMultiplier}{" "}
                <span className="text-xs font-normal text-[#524342] ml-1">
                  ({(exchange.globalMultiplier - 1) * 100}%)
                </span>
              </h3>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#f0e2d9] flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#fdf2f0] flex items-center justify-center flex-shrink-0">
              <Wallet className="w-5 h-5 text-[#4a1a1a]" />
            </div>
            <div>
              <p
                className="text-[10px] font-semibold text-[#8b6f66] mb-1"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                Base Rate (USD/IDR)
              </p>
              <h3
                className="text-2xl font-bold text-[#2b1d19] mb-1"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                Rp{exchange.baseRateUsdIdr?.toLocaleString("id-ID")}
              </h3>
              <p
                className="text-[9px] text-[#2b1d19] font-medium"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                Kurs Mentah, samakan di web router
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#f0e2d9] flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#fdf2f0] flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5 text-[#4a1a1a]" />
            </div>
            <div>
              <p
                className="text-[10px] font-semibold text-[#8b6f66] mb-1"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                Inflation Buffer
              </p>
              <h3
                className="text-2xl font-bold text-[#2b1d19] mb-1"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                {exchange.inflationBuffer * 100}%
              </h3>
              <p
                className="text-[9px] font-medium"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                <span className="text-[#2b1d19]">Effective Rate: </span>
                <span className="text-[#b91c1c]">
                  Rp {Math.round(effectiveRate).toLocaleString("id-ID")}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Usage Logs */}
      <section id="logs-section">
        <div className="mb-6">
          <h2
            className="text-xl font-bold text-[#4a1a1a]"
            style={{ fontFamily: "var(--font-noto-serif)" }}
          >
            AI Usage Logs
          </h2>
          <p
            className="text-sm text-[#8b6f66] mt-1"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Monitor riwayat token, biaya modal, dan laba transaksi
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#f0e2d9] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e6d1c7] bg-white">
                  <th className="py-4 pl-6 w-12">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-[#4a1a1a] focus:ring-[#4a1a1a]"
                    />
                  </th>
                  <th
                    className="py-4 px-4 text-[11px] font-bold text-[#2b1d19] uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-plus-jakarta)" }}
                  >
                    Timestamp
                  </th>
                  <th
                    className="py-4 px-4 text-[11px] font-bold text-[#2b1d19] uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-plus-jakarta)" }}
                  >
                    Email User
                  </th>
                  <th
                    className="py-4 px-4 text-[11px] font-bold text-[#2b1d19] uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-plus-jakarta)" }}
                  >
                    Membership
                  </th>
                  <th
                    className="py-4 px-4 text-[11px] font-bold text-[#2b1d19] uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-plus-jakarta)" }}
                  >
                    Tokens (In/Out)
                  </th>
                  <th
                    className="py-4 px-4 text-[11px] font-bold text-[#2b1d19] uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-plus-jakarta)" }}
                  >
                    Modal API ($)
                  </th>
                  <th
                    className="py-4 px-4 text-[11px] font-bold text-[#2b1d19] uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-plus-jakarta)" }}
                  >
                    Charge User ($)
                  </th>
                  <th
                    className="py-4 px-4 text-[11px] font-bold text-[#2b1d19] uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-plus-jakarta)" }}
                  >
                    Profit ($)
                  </th>
                </tr>
              </thead>
              <tbody>
                {logsData.length > 0 ? (
                  logsData.map((row) => (
                    <tr
                      key={row._id || row.id}
                      className="border-b border-[#f5ebe6] last:border-none hover:bg-[#fafafa] transition-colors"
                    >
                      <td className="py-5 pl-6">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-[#4a1a1a] focus:ring-[#4a1a1a]"
                        />
                      </td>
                      <td
                        className="py-5 px-4 text-xs text-[#2b1d19] font-medium"
                        style={{ fontFamily: "var(--font-plus-jakarta)" }}
                      >
                        {new Date(row.createdAt).toLocaleString("id-ID")}
                      </td>
                      <td
                        className="py-5 px-4 text-xs text-[#524342]"
                        style={{ fontFamily: "var(--font-plus-jakarta)" }}
                      >
                        {row.userEmail || row.email}
                      </td>
                      <td className="py-5 px-4">
                        <span
                          className={`px-3 py-1 rounded-md text-[10px] font-bold border ${
                            row.userStatus !== "FREE"
                              ? "bg-[#fdf2f0] border-[#e6d1c7] text-[#4a1a1a]"
                              : "bg-white border-gray-100 text-[#8b6f66]"
                          }`}
                          style={{ fontFamily: "var(--font-plus-jakarta)" }}
                        >
                          {row.userStatus || "FREE"}
                        </span>
                      </td>
                      <td
                        className="py-5 px-4 text-xs text-[#524342]"
                        style={{ fontFamily: "var(--font-plus-jakarta)" }}
                      >
                        {row.promptTokens} / {row.completionTokens}
                      </td>
                      <td className="py-5 px-4">
                        <span
                          className="inline-flex items-center px-3 py-1 rounded border border-[#e6d1c7] bg-white text-[10px] font-medium text-[#524342]"
                          style={{ fontFamily: "var(--font-plus-jakarta)" }}
                        >
                          ${row.modalApi || "0.00000"}
                        </span>
                      </td>
                      <td className="py-5 px-4">
                        <span
                          className="inline-flex items-center px-3 py-1 rounded border border-[#e6d1c7] bg-white text-[10px] font-medium text-[#524342]"
                          style={{ fontFamily: "var(--font-plus-jakarta)" }}
                        >
                          ${row.chargeUser || "0.00000"}
                        </span>
                      </td>
                      <td className="py-5 px-4">
                        <span
                          className="inline-flex items-center px-3 py-1 rounded border border-[#e6d1c7] bg-[#fdf2f0] text-[10px] font-semibold text-[#8b1a1a]"
                          style={{ fontFamily: "var(--font-plus-jakarta)" }}
                        >
                          +${row.profit || "0.00000"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-8 text-center text-gray-500 text-sm"
                    >
                      Belum ada log penggunaan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination UI */}
          {logsPagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-[#f0e2d9] bg-[#fafafa] flex items-center justify-between">
              <p
                className="text-xs text-[#8b6f66]"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                Menampilkan{" "}
                <span className="font-bold text-[#2b1d19]">
                  {(logsPagination.currentPage - 1) * logsPagination.limit + 1}
                </span>{" "}
                sampai{" "}
                <span className="font-bold text-[#2b1d19]">
                  {Math.min(
                    logsPagination.currentPage * logsPagination.limit,
                    logsPagination.totalItems,
                  )}
                </span>{" "}
                dari{" "}
                <span className="font-bold text-[#2b1d19]">
                  {logsPagination.totalItems}
                </span>{" "}
                log
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchLogs(logsPagination.currentPage - 1)}
                  disabled={logsPagination.currentPage === 1 || isLogsLoading}
                  className="p-1.5 rounded-md border border-[#e6d1c7] bg-white text-[#4a1a1a] hover:bg-[#fdf2f0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(logsPagination.totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    // Tampilkan halaman pertama, terakhir, dan sekitar halaman aktif
                    if (
                      pageNum === 1 ||
                      pageNum === logsPagination.totalPages ||
                      (pageNum >= logsPagination.currentPage - 1 &&
                        pageNum <= logsPagination.currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => fetchLogs(pageNum)}
                          disabled={isLogsLoading}
                          className={`min-w-[28px] h-7 text-[11px] font-bold rounded-md border transition-all ${
                            logsPagination.currentPage === pageNum
                              ? "bg-[#4a1a1a] border-[#4a1a1a] text-white"
                              : "bg-white border-[#e6d1c7] text-[#8b6f66] hover:border-[#4a1a1a] hover:text-[#4a1a1a]"
                          }`}
                          style={{ fontFamily: "var(--font-plus-jakarta)" }}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === 2 ||
                      pageNum === logsPagination.totalPages - 1
                    ) {
                      return (
                        <span key={pageNum} className="text-[#8b6f66] px-1">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                <button
                  onClick={() => fetchLogs(logsPagination.currentPage + 1)}
                  disabled={
                    logsPagination.currentPage === logsPagination.totalPages ||
                    isLogsLoading
                  }
                  className="p-1.5 rounded-md border border-[#e6d1c7] bg-white text-[#4a1a1a] hover:bg-[#fdf2f0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modal Tambah/Edit API */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl w-full max-w-3xl shadow-xl max-h-[90vh] overflow-y-auto"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-[#2b1d19]">
                  {isEditingAPI ? "Edit Model API" : "Model API"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Input Basic (Nama Router & URL) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                      Nama Router
                    </label>
                    <input
                      type="text"
                      name="namaRouter"
                      value={formData.namaRouter}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm"
                      placeholder="gemini-1.5 flash"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                      Base Url
                    </label>
                    <input
                      type="text"
                      name="baseUrl"
                      value={formData.baseUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm"
                      placeholder="https://api.maiarouter.ai/v1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                    Model
                  </label>
                  <input
                    type="text"
                    name="modelName"
                    value={formData.modelName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm"
                    placeholder="gemini-1.5 flash"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                    API KEY
                  </label>
                  <textarea
                    name="apiKey"
                    value={formData.apiKey}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm min-h-[100px] resize-y"
                    placeholder="****************************************************"
                  />
                </div>

                {/* Pemilihan Tipe AI */}
                <div>
                  <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                    Tipe AI
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          typeAi: "LLM",
                          pricingUnit: "1M_TOKENS",
                        })
                      }
                      className={`px-4 py-3 rounded-lg border text-sm font-medium text-left transition-all ${
                        formData.typeAi === "LLM"
                          ? "border-[#4a1a1a] bg-[#fafafa] text-[#2b1d19]"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      LLM (Analisis Wajah)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          typeAi: "IMAGE_GEN",
                          pricingUnit: "IMAGE",
                        })
                      }
                      className={`px-4 py-3 rounded-lg border text-sm font-medium text-left transition-all ${
                        formData.typeAi === "IMAGE_GEN"
                          ? "border-[#4a1a1a] bg-[#fafafa] text-[#2b1d19]"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      Generate Image
                    </button>
                  </div>
                </div>

                {/* Input Harga (Disesuaikan berdasarkan Tipe) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Harga Input (1M Tokens) - SELALU MUNCUL DI KEDUA TIPE AI */}
                  <div>
                    <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                      Harga Input
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        name="hargaInput1M"
                        value={formData.hargaInput1M}
                        onChange={handleInputChange}
                        step="0.01"
                        className="w-full pl-8 pr-20 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm"
                        placeholder="0.07"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        /1M tokens
                      </span>
                    </div>
                  </div>

                  {/* Harga Output - BERUBAH TERGANTUNG TIPE AI */}
                  {formData.typeAi === "LLM" ? (
                    <div>
                      <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                        Harga Output
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          name="hargaOutput1M"
                          value={formData.hargaOutput1M}
                          onChange={handleInputChange}
                          step="0.01"
                          className="w-full pl-8 pr-20 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm"
                          placeholder="0.30"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                          /1M tokens
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                        Harga Output (Per Image)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          name="hargaPerImage"
                          value={formData.hargaPerImage}
                          onChange={handleInputChange}
                          step="0.01"
                          className="w-full pl-8 pr-20 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm"
                          placeholder="0.04"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                          /Image
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                      Max Budget
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        name="maxBudget"
                        value={formData.maxBudget}
                        onChange={handleInputChange}
                        className="w-full pl-8 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm"
                        placeholder="1.000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                      RPM Limit
                    </label>
                    <input
                      type="number"
                      name="rpmLimit"
                      value={formData.rpmLimit}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm"
                      placeholder="100"
                    />
                  </div>
                </div>

                <p className="text-xs italic text-gray-500 mt-2">
                  *Wajib harus sama sesuai di Website Router
                </p>

                {testResult && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-lg text-sm ${testResult.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <span>{testResult.message}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#274c35] hover:bg-[#1a3323] text-white text-sm font-semibold transition-colors disabled:opacity-70 flex-1 sm:flex-none"
                  >
                    {isTesting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                    <span>Test Koneksi API</span>
                  </button>
                  <button
                    onClick={handleSaveAPI}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-[#4a1a1a] hover:bg-[#2b1d19] text-white text-sm font-semibold transition-colors disabled:opacity-70 flex-1 sm:flex-none"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : null}
                    <span>Simpan API</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Master Exchange */}
      {isExchangeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl w-full max-w-2xl shadow-xl"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-[#2b1d19]">
                  Master Exchange Setting
                </h2>
                <button
                  onClick={() => setIsExchangeModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                      Global Multiplier
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="globalMultiplierDisplay"
                        value={exchangeForm.globalMultiplierDisplay}
                        onChange={handleExchangeInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm"
                        placeholder="35"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        %
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                      Base Rate (USD/IDR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        Rp
                      </span>
                      <input
                        type="number"
                        name="baseRateUsdIdr"
                        value={exchangeForm.baseRateUsdIdr}
                        onChange={handleExchangeInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm"
                        placeholder="17332"
                      />
                    </div>
                    <p className="text-[10px] italic text-gray-400 mt-2">
                      *Kurs Mentah, samakan di web router
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#2b1d19] mb-2">
                    Inflation Buffer
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="inflationBufferDisplay"
                      value={exchangeForm.inflationBufferDisplay}
                      onChange={handleExchangeInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all text-sm"
                      placeholder="5"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      %
                    </span>
                  </div>
                  <p className="text-[10px] italic text-gray-400 mt-2">
                    *Inflasi Buffer samakan di web router
                  </p>
                </div>

                <div className="pt-6">
                  <button
                    onClick={handleSaveExchange}
                    disabled={isExchangeSubmitting}
                    className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-[#3a201b] hover:bg-[#2b1d19] text-white text-sm font-semibold transition-colors disabled:opacity-70"
                  >
                    {isExchangeSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : null}
                    <span>Simpan Master Exchange Setting</span>
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
