"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon,
  Mail,
  Coins,
  Sparkles,
  Edit2,
  Save,
  X,
  Loader2,
  Calendar,
  History,
  CreditCard,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";
import { userService } from "@/services/userService";
import { useToast } from "@/contexts/ToastContext";

export default function ProfilePage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Authentication & Profile States
  const [user, setUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState("ai-history"); // "ai-history" | "transactions"

  // AI History States
  const [aiHistory, setAiHistory] = useState([]);
  const [aiMeta, setAiMeta] = useState({ page: 1, totalPages: 1 });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPage, setAiPage] = useState(1);

  // Transaction States
  const [transactions, setTransactions] = useState([]);
  const [txMeta, setTxMeta] = useState({ page: 1, totalPages: 1 });
  const [txLoading, setTxLoading] = useState(false);
  const [txPage, setTxPage] = useState(1);

  // Switch Package loading state
  const [switchingId, setSwitchingId] = useState(null);

  // Check authentication & load profile on mount
  useEffect(() => {
    const token = Cookies.get("user_token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchUserProfile();
  }, [router]);

  // Load AI History when tab or page changes
  useEffect(() => {
    if (user && activeTab === "ai-history") {
      fetchAiHistory(aiPage);
    }
  }, [user, activeTab, aiPage]);

  // Load Transaction History when tab or page changes
  useEffect(() => {
    if (user && activeTab === "transactions") {
      fetchTransactions(txPage);
    }
  }, [user, activeTab, txPage]);

  const fetchUserProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await userService.getProfile();
      if (res.data && res.data.success) {
        setUser(res.data.data);
        setEditName(res.data.data.nama);
      } else {
        showToast("Gagal memuat profil user.", "error");
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
      showToast("Terjadi kesalahan saat memuat data profil.", "error");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast("Nama tidak boleh kosong", "error");
      return;
    }
    setUpdateLoading(true);
    try {
      const res = await userService.updateProfile({ nama: editName });
      if (res.data && res.data.success) {
        // Sync local storage & state
        const updatedUser = { ...user, nama: res.data.data.nama };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
        showToast("Nama berhasil diperbarui", "success");
        // Dispatch event so the Navbar updates the name immediately
        window.dispatchEvent(new Event("userProfileUpdated"));
      } else {
        showToast(res.data.message || "Gagal memperbarui nama", "error");
      }
    } catch (err) {
      console.error("Update name error:", err);
      showToast("Terjadi kesalahan saat memperbarui nama.", "error");
    } finally {
      setUpdateLoading(false);
    }
  };

  const fetchAiHistory = async (page) => {
    setAiLoading(true);
    try {
      const res = await userService.getAiHistory({ page, limit: 5 });
      if (res.data && res.data.success) {
        setAiHistory(res.data.data);
        setAiMeta(res.data.meta || { page, totalPages: 1 });
      }
    } catch (err) {
      console.error("Fetch AI history error:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const baseUrl = apiUrl.split("/api/v1")[0];
    return `${baseUrl}${url}`;
  };

  const handleViewHistoryDetail = (item) => {
    const formattedResult = {
      hasil_analisis: item.hasil_analisis,
      url_foto_upload: getImageUrl(item.url_foto_upload),
      url_hasil_img: Array.isArray(item.url_hasil_img)
        ? item.url_hasil_img.map((url) => getImageUrl(url))
        : item.url_hasil_img
          ? [getImageUrl(item.url_hasil_img)]
          : [],
      tgl_generate: item.tgl_generate,
      active_features: item.active_features && item.active_features.length > 0 ? item.active_features : null,
    };

    sessionStorage.setItem("aiAnalysisResult", JSON.stringify(formattedResult));
    router.push("/ai/result");
  };

  const fetchTransactions = async (page) => {
    setTxLoading(true);
    try {
      const res = await userService.getTransactions({ page, limit: 5 });
      if (res.data && res.data.success) {
        setTransactions(res.data.data);
        setTxMeta(res.data.meta || { page, totalPages: 1 });
      }
    } catch (err) {
      console.error("Fetch transactions error:", err);
    } finally {
      setTxLoading(false);
    }
  };

  const handleSwitchPackage = async (packageId) => {
    if (switchingId || packageId === user?.active_package_id) return;
    setSwitchingId(packageId);
    try {
      const res = await userService.switchPackage(packageId);
      if (res.data && res.data.success) {
        showToast(res.data.message || "Berhasil berpindah paket koin", "success");
        const updatedUser = {
          ...user,
          active_package_id: packageId,
          active_package: res.data.data.active_package,
          sisa_credit: res.data.data.sisa_credit
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("userProfileUpdated"));
      } else {
        showToast(res.data.message || "Gagal berpindah paket koin", "error");
      }
    } catch (err) {
      console.error("Switch package error:", err);
      showToast("Gagal berpindah paket koin. Coba lagi nanti.", "error");
    } finally {
      setSwitchingId(null);
    }
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatJoinedDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Extract avatar initials
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (profileLoading) {
    return (
      <main className="min-h-screen bg-[#E1D5C9] text-[#2B1D19] relative overflow-hidden flex flex-col">
        <SiteNavbar />
        <div className="flex-grow flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#4a1a1a]" />
            <p className="text-xs uppercase tracking-[0.2em] text-[#8b6f66] font-semibold">
              Memuat Profil Anda...
            </p>
          </div>
        </div>
        <SiteFooter />
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#E1D5C9] text-[#2B1D19] relative overflow-hidden flex flex-col">
      <SiteNavbar />

      {/* Decorative logo background overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] flex items-center justify-center">
          <Image
            src="/images/logo-transparent.png"
            alt="Key Pattern"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="flex-grow relative z-10 max-w-7xl mx-auto px-6 py-12 lg:px-10 w-full">
        {/* Entrance animations using framer-motion */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p
            className="text-[10px] tracking-[0.4em] uppercase text-[#8b6f66] mb-3"
            style={{ fontFamily: "var(--font-be-vietnam)" }}
          >
            My Account
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl text-[#3a221c]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Customer Profile
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
          {/* LEFT COLUMN: Profile info, credit card summary, active balances */}
          <div className="space-y-6">
            {/* Main Profile Details Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#ede8e0]/90 backdrop-blur-sm border border-[#e6d1c7] p-8 rounded-sm shadow-[0_20px_40px_-15px_rgba(57,28,22,0.08)]"
            >
              <div className="flex flex-col items-center text-center">
                {/* Circular Avatar */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#4a1a1a] to-[#8b6f66] text-white flex items-center justify-center text-2xl font-bold tracking-wider shadow-inner mb-4">
                  {getInitials(user.nama)}
                </div>

                {/* Inline Editing for Name */}
                {isEditing ? (
                  <form onSubmit={handleUpdateName} className="w-full mt-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full text-center px-3 py-2 border border-[#8b6f66]/50 bg-white text-sm focus:outline-none focus:border-[#4a1a1a] rounded"
                      disabled={updateLoading}
                      autoFocus
                    />
                    <div className="flex justify-center gap-2 mt-3">
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-[#4a1a1a] hover:bg-[#3a221c] text-white text-xs font-semibold uppercase tracking-wider rounded flex items-center gap-1 disabled:opacity-50"
                        disabled={updateLoading}
                      >
                        {updateLoading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Save className="w-3 h-3" />
                        )}
                        Simpan
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditName(user.nama);
                        }}
                        className="px-3 py-1.5 border border-[#8b6f66] hover:bg-[#ede8e0]/60 text-[#3a221c] text-xs font-semibold uppercase tracking-wider rounded flex items-center gap-1"
                        disabled={updateLoading}
                      >
                        <X className="w-3 h-3" />
                        Batal
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-2 group">
                    <h3 className="text-xl font-bold text-[#3a221c] flex items-center justify-center gap-2">
                      {user.nama}
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-[#8b6f66] hover:text-[#4a1a1a] transition-colors p-1"
                        title="Edit Nama"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </h3>
                  </div>
                )}

                <p className="text-xs text-[#8b6f66] flex items-center gap-1.5 mt-1 font-mono">
                  <Mail className="w-3.5 h-3.5 text-[#8b6f66]" />
                  {user.email || "No email"}
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full border border-[#c57e7b]/30 bg-[#c57e7b]/10 text-[9px] uppercase tracking-widest text-[#5a2725] font-bold">
                    {user.tipe_akun} member
                  </span>
                  {user.role === "admin" && (
                    <span className="px-2.5 py-0.5 rounded-full border border-yellow-600/30 bg-yellow-50 text-[9px] uppercase tracking-widest text-yellow-800 font-bold">
                      Admin
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-[#e6d1c7]/80 mt-6 pt-5 space-y-4 text-xs">
                <div className="flex justify-between items-center text-[#5f463d]">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#8b6f66]" />
                    Joined Since
                  </span>
                  <span className="font-semibold text-[#3a221c]">
                    {formatJoinedDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Credit & Coin Status Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#3a221c] border border-[#3a221c] text-[#f8f1ea] p-8 rounded-sm shadow-[0_20px_40px_-15px_rgba(57,28,22,0.15)]"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#c59b8f] font-bold">
                    Total Balance
                  </h4>
                  <p
                    className="text-4xl font-bold mt-1 text-[#f8f1ea] flex items-center gap-2"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    <Coins className="w-8 h-8 text-[#c59b8f]" />
                    {user.sisa_credit || 0}
                    <span className="text-xs uppercase tracking-widest font-normal text-[#c59b8f]">
                      Coins
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded p-4 mb-6 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#c59b8f]">Active Plan</span>
                  <span className="font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#c59b8f]" />
                    {user.active_package?.namaPaket || (user.purchased_package_ids?.length > 0 ? "Premium Member" : "Free Tier")}
                  </span>
                </div>

                {user.tgl_berakhir_langganan && (
                  <div className="flex justify-between items-center pt-2.5 border-t border-white/10">
                    <span className="text-[#c59b8f]">Expiry Date</span>
                    <span className="font-semibold text-yellow-300">
                      {formatDate(user.tgl_berakhir_langganan)}
                    </span>
                  </div>
                )}
              </div>

              {/* Purchase Breakdown & Switch active package */}
              {user.package_balances && user.package_balances.length > 0 && (
                <div className="border-t border-white/10 pt-5 space-y-3">
                  <h5 className="text-[9px] uppercase tracking-[0.25em] text-[#c59b8f] font-bold mb-2">
                    Package Coin Breakdown
                  </h5>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {user.package_balances
                      .filter((bal) => bal.coins_remaining > 0)
                      .map((bal) => {
                        const isCurrentActive = bal.package_id === user.active_package_id;
                        return (
                          <div
                            key={bal.id}
                            className={`p-2.5 rounded border transition-colors flex items-center justify-between ${isCurrentActive ? "bg-white/10 border-white/20" : "bg-white/5 border-white/5 hover:bg-white/8"}`}
                          >
                            <div>
                              <p className="text-[10px] font-bold text-white truncate max-w-[150px]">
                                {bal.package?.namaPaket || "Custom Package"}
                              </p>
                              <p className="text-[9px] text-[#c59b8f] mt-0.5">
                                Sisa koin: <span className="text-white font-semibold">{bal.coins_remaining}</span>
                              </p>
                            </div>
                            <div>
                              {isCurrentActive ? (
                                <span className="text-[8px] bg-white/20 text-[#f8f1ea] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">
                                  Aktif
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleSwitchPackage(bal.package_id)}
                                  disabled={switchingId !== null}
                                  className="text-[8px] bg-[#f8f1ea] hover:bg-white text-[#3a221c] px-2 py-1 rounded font-semibold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-1"
                                >
                                  {switchingId === bal.package_id ? (
                                    <Loader2 className="w-2 h-2 animate-spin" />
                                  ) : (
                                    "Ganti"
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              <button
                onClick={() => router.push("/service#ai-pricing")}
                className="w-full mt-6 py-3 bg-[#f8f1ea] hover:bg-[#ede8e0] text-[#3a221c] text-xs font-bold uppercase tracking-[0.2em] rounded-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 group"
              >
                Top Up Coins / Upgrade
                <ArrowRight className="w-3.5 h-3.5 text-[#3a221c] transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Interactive Tabs & Tables (AI History / Transactions) */}
          <div className="space-y-6">
            {/* Tabs Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-[#ede8e0]/90 backdrop-blur-sm border border-[#e6d1c7] p-1.5 rounded-sm flex gap-2"
            >
              <button
                onClick={() => {
                  setActiveTab("ai-history");
                  setAiPage(1);
                }}
                className={`flex-grow flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-[0.15em] transition-all rounded-sm ${activeTab === "ai-history" ? "bg-[#3a221c] text-white shadow-md" : "text-[#5f463d] hover:bg-[#e6d1c7]/40 hover:text-[#3a221c]"}`}
                style={{ fontFamily: "var(--font-be-vietnam)" }}
              >
                <History className="w-4 h-4" />
                AI recommendation history
              </button>
              <button
                onClick={() => {
                  setActiveTab("transactions");
                  setTxPage(1);
                }}
                className={`flex-grow flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-[0.15em] transition-all rounded-sm ${activeTab === "transactions" ? "bg-[#3a221c] text-white shadow-md" : "text-[#5f463d] hover:bg-[#e6d1c7]/40 hover:text-[#3a221c]"}`}
                style={{ fontFamily: "var(--font-be-vietnam)" }}
              >
                <CreditCard className="w-4 h-4" />
                Billing & Transactions
              </button>
            </motion.div>

            {/* Content Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#ede8e0]/90 backdrop-blur-sm border border-[#e6d1c7] p-8 rounded-sm shadow-[0_20px_40px_-15px_rgba(57,28,22,0.08)] min-h-[480px] flex flex-col justify-between"
            >
              <div>
                <AnimatePresence mode="wait">
                  {activeTab === "ai-history" ? (
                    <motion.div
                      key="ai-history"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-between items-center pb-4 border-b border-[#e6d1c7]">
                        <h4 className="text-lg font-bold text-[#3a221c]" style={{ fontFamily: "var(--font-noto-serif)" }}>
                          Riwayat Rekomendasi AI Rambut
                        </h4>
                        <span className="text-[10px] bg-[#4a1a1a]/10 border border-[#4a1a1a]/20 text-[#4a1a1a] font-mono px-2 py-0.5 rounded">
                          Total: {aiMeta.total || 0}
                        </span>
                      </div>

                      {aiLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-3">
                          <Loader2 className="w-8 h-8 animate-spin text-[#4a1a1a]" />
                          <p className="text-xs text-[#8b6f66] uppercase tracking-wider">Memuat riwayat...</p>
                        </div>
                      ) : aiHistory.length === 0 ? (
                        <div className="py-20 text-center border border-dashed border-[#8b6f59]/30 rounded-lg">
                          <ImageIcon className="w-10 h-10 mx-auto text-[#8b6f66]/40 mb-3" />
                          <p className="text-sm font-semibold text-[#5f463d]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                            Belum ada riwayat generate AI.
                          </p>
                          <p className="text-xs text-[#8b6f66] mt-1 max-w-xs mx-auto">
                            Gunakan fitur styling rekomendasi AI kami untuk menganalisis wajah Anda sekarang!
                          </p>
                          <button
                            onClick={() => router.push("/ai")}
                            className="mt-5 px-5 py-2.5 bg-[#4a1a1a] hover:bg-[#3a221c] text-white text-[10px] font-bold uppercase tracking-wider rounded transition-all"
                          >
                            Mulai Analisis AI
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {aiHistory.map((item) => (
                            <div
                              key={item.id}
                              className="border border-[#e6d1c7] bg-[#f7f4f0]/60 p-4 rounded transition-all hover:bg-[#f7f4f0] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 relative bg-[#ede8e0] border border-[#e6d1c7] rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                                  {item.url_foto_upload ? (
                                    <Image
                                      src={item.url_foto_upload}
                                      alt="Upload Thumbnail"
                                      fill
                                      sizes="56px"
                                      className="object-cover"
                                    />
                                  ) : (
                                    <ImageIcon className="w-6 h-6 text-[#8b6f66]/50" />
                                  )}
                                </div>
                                <div className="space-y-1">
                                  <div className="flex flex-wrap gap-1.5 items-center">
                                    <span className="text-[9px] bg-[#4a1a1a] text-white px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                                      AI Scan
                                    </span>
                                    <span className="text-[10px] font-mono text-[#8b6f66]">
                                      ID: {item.id.substring(0, 8)}...
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#5f463d] font-medium mt-1">
                                    <span className="flex items-center gap-1 text-[#8b6f66]">
                                      <Clock className="w-3.5 h-3.5" />
                                      {formatDate(item.tgl_generate)}
                                    </span>
                                  </div>
                                  {/* List features used */}
                                  {item.active_features && item.active_features.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                      {item.active_features.map((feat, fidx) => (
                                        <span
                                          key={fidx}
                                          className="text-[8px] bg-[#ede8e0] text-[#5a2725] px-1.5 py-0.5 rounded border border-[#e6d1c7]"
                                        >
                                          {feat}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col sm:items-end gap-2 shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-[#e6d1c7]/50">
                                <span className="flex items-center gap-1 text-xs font-bold text-[#3a221c] font-mono bg-[#8b6f66]/10 px-2 py-1 rounded">
                                  <Coins className="w-3.5 h-3.5 text-[#8b6f66]" />
                                  Cost: {item.harga_credit_terpakai} coins
                                </span>
                                <button
                                  onClick={() => handleViewHistoryDetail(item)}
                                  className="text-[9px] uppercase tracking-widest text-[#4a1a1a] font-bold hover:text-[#c57e7b] transition-colors flex items-center gap-1 self-start sm:self-auto mt-1"
                                >
                                  Lihat Hasil Analisis
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="transactions"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-between items-center pb-4 border-b border-[#e6d1c7]">
                        <h4 className="text-lg font-bold text-[#3a221c]" style={{ fontFamily: "var(--font-noto-serif)" }}>
                          Riwayat Pembelian & Transaksi
                        </h4>
                        <span className="text-[10px] bg-[#4a1a1a]/10 border border-[#4a1a1a]/20 text-[#4a1a1a] font-mono px-2 py-0.5 rounded">
                          Total: {txMeta.total || 0}
                        </span>
                      </div>

                      {txLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-3">
                          <Loader2 className="w-8 h-8 animate-spin text-[#4a1a1a]" />
                          <p className="text-xs text-[#8b6f66] uppercase tracking-wider">Memuat transaksi...</p>
                        </div>
                      ) : transactions.length === 0 ? (
                        <div className="py-20 text-center border border-dashed border-[#8b6f59]/30 rounded-lg">
                          <CreditCard className="w-10 h-10 mx-auto text-[#8b6f66]/40 mb-3" />
                          <p className="text-sm font-semibold text-[#5f463d]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                            Belum ada riwayat transaksi.
                          </p>
                          <p className="text-xs text-[#8b6f66] mt-1 max-w-xs mx-auto">
                            Beli koin atau langganan premium untuk menikmati layanan penuh Key Barber.
                          </p>
                          <button
                            onClick={() => router.push("/service#ai-pricing")}
                            className="mt-5 px-5 py-2.5 bg-[#4a1a1a] hover:bg-[#3a221c] text-white text-[10px] font-bold uppercase tracking-wider rounded transition-all"
                          >
                            Beli Paket Sekarang
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {transactions.map((tx) => {
                            const statusColorMap = {
                              SUCCESS: "bg-green-100 text-green-800 border-green-200",
                              success: "bg-green-100 text-green-800 border-green-200",
                              PENDING: "bg-amber-100 text-amber-800 border-amber-200",
                              pending: "bg-amber-100 text-amber-800 border-amber-200",
                              FAILED: "bg-red-100 text-red-800 border-red-200",
                              failed: "bg-red-100 text-red-800 border-red-200",
                            };

                            const badgeColor =
                              statusColorMap[tx.status] ||
                              "bg-gray-100 text-gray-800 border-gray-200";

                            return (
                              <div
                                key={tx.id}
                                className="border border-[#e6d1c7] bg-[#f7f4f0]/60 p-4 rounded transition-all hover:bg-[#f7f4f0] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                              >
                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span
                                      className={`text-[9px] border px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${badgeColor}`}
                                    >
                                      {tx.status}
                                    </span>
                                    <span className="text-[10px] text-[#8b6f66] font-mono">
                                      Inv: {tx.invoice_number || tx.id.substring(0, 13)}
                                    </span>
                                  </div>
                                  <h5 className="text-sm font-bold text-[#3a221c] mt-1.5 uppercase tracking-wide">
                                    {tx.jenis_transaksi.replace(/_/g, " ")}
                                  </h5>
                                  <div className="flex items-center gap-1.5 text-xs text-[#8b6f66] mt-0.5 font-medium">
                                    <Clock className="w-3.5 h-3.5 text-[#8b6f66]" />
                                    {formatDate(tx.tgl_transaksi)}
                                  </div>
                                </div>

                                <div className="flex flex-col sm:items-end gap-1.5 shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-[#e6d1c7]/50">
                                  <span className="text-lg font-bold text-[#3a221c]" style={{ fontFamily: "var(--font-playfair)" }}>
                                    {formatCurrency(tx.nominal)}
                                  </span>
                                  {tx.status?.toLowerCase() === "pending" && tx.invoice_number && (
                                    <button
                                      onClick={() => router.push(`/payment/callback?invoice=${tx.invoice_number}`)}
                                      className="text-[9px] uppercase tracking-widest text-[#4a1a1a] hover:text-[#c57e7b] font-bold transition-colors flex items-center gap-0.5 self-start sm:self-auto"
                                    >
                                      Selesaikan Pembayaran
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between border-t border-[#e6d1c7] mt-8 pt-5 text-xs">
                {activeTab === "ai-history" ? (
                  <>
                    <button
                      onClick={() => setAiPage((prev) => Math.max(prev - 1, 1))}
                      disabled={aiPage === 1 || aiLoading}
                      className="px-4 py-2 border border-[#8b6f66] hover:bg-[#e6d1c7]/40 text-[#3a221c] font-bold uppercase tracking-wider rounded-sm transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                      Sebelumnya
                    </button>
                    <span className="text-[#8b6f66] font-semibold">
                      Halaman {aiMeta.page} dari {aiMeta.totalPages || 1}
                    </span>
                    <button
                      onClick={() => setAiPage((prev) => Math.min(prev + 1, aiMeta.totalPages))}
                      disabled={aiPage >= aiMeta.totalPages || aiLoading}
                      className="px-4 py-2 border border-[#8b6f66] hover:bg-[#e6d1c7]/40 text-[#3a221c] font-bold uppercase tracking-wider rounded-sm transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                      Selanjutnya
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setTxPage((prev) => Math.max(prev - 1, 1))}
                      disabled={txPage === 1 || txLoading}
                      className="px-4 py-2 border border-[#8b6f66] hover:bg-[#e6d1c7]/40 text-[#3a221c] font-bold uppercase tracking-wider rounded-sm transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                      Sebelumnya
                    </button>
                    <span className="text-[#8b6f66] font-semibold">
                      Halaman {txMeta.page} dari {txMeta.totalPages || 1}
                    </span>
                    <button
                      onClick={() => setTxPage((prev) => Math.min(prev + 1, txMeta.totalPages))}
                      disabled={txPage >= txMeta.totalPages || txLoading}
                      className="px-4 py-2 border border-[#8b6f66] hover:bg-[#e6d1c7]/40 text-[#3a221c] font-bold uppercase tracking-wider rounded-sm transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                      Selanjutnya
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
