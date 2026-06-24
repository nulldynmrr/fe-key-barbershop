"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  Coins,
  X,
  Loader2,
  CircleSlash,
  Wallet,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { userManagementService } from "@/services/userManagementService";
import { packageService } from "@/services/packageService";
import { useToast } from "@/contexts/ToastContext";

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast, showConfirm } = useToast();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [availablePackages, setAvailablePackages] = useState([]);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [isTopupSubmitting, setIsTopupSubmitting] = useState(false);

  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [creditAmount, setCreditAmount] = useState("");
  const [creditReason, setCreditReason] = useState("");
  const [isCreditSubmitting, setIsCreditSubmitting] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userManagementService.getUserDetail(id);
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (err) {
      console.error("Gagal memuat detail user:", err);
      setError(err?.response?.data?.message || "Gagal memuat detail user");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = () => {
    const nextBanned = !user.is_banned;
    const verb = nextBanned ? "mem-banned" : "meng-unban";
    showConfirm(
      nextBanned ? "Ban User" : "Unban User",
      `Apakah Anda yakin ingin ${verb} user "${user.nama}"?`,
      async () => {
        try {
          const res = await userManagementService.updateStatus(id, nextBanned);
          if (res.data.success) {
            showToast(`User berhasil di${nextBanned ? "banned" : "unban"}!`, "success");
            fetchDetail();
          }
        } catch (err) {
          showToast(err?.response?.data?.message || `Gagal ${verb} user`, "error");
        }
      }
    );
  };

  const handleOpenTopupModal = async () => {
    setSelectedPackageId("");
    setIsTopupModalOpen(true);
    try {
      const res = await packageService.getPackages(1, 100);
      if (res.data.success) {
        const combined = [
          ...(res.data.data.topup_koin || []),
          ...(res.data.data.langganan_premium || []),
        ];
        setAvailablePackages(combined.filter((p) => p.status === "AKTIF"));
      }
    } catch (err) {
      console.error("Gagal memuat daftar paket:", err);
      showToast("Gagal memuat daftar paket aktif", "error");
    }
  };

  const handleTopup = async () => {
    if (!selectedPackageId) {
      showToast("Pilih paket terlebih dahulu", "error");
      return;
    }
    setIsTopupSubmitting(true);
    try {
      const res = await userManagementService.topupPackage(id, selectedPackageId);
      if (res.data.success) {
        showToast("Top-up paket berhasil!", "success");
        setIsTopupModalOpen(false);
        fetchDetail();
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Gagal top-up paket", "error");
    } finally {
      setIsTopupSubmitting(false);
    }
  };

  const handleSetActive = (packageId, namaPaket) => {
    showConfirm(
      "Set Paket Aktif",
      `Jadikan "${namaPaket}" sebagai paket aktif user ini?`,
      async () => {
        try {
          const res = await userManagementService.setActivePackage(id, packageId);
          if (res.data.success) {
            showToast("Paket aktif berhasil diubah!", "success");
            fetchDetail();
          }
        } catch (err) {
          showToast(err?.response?.data?.message || "Gagal mengubah paket aktif", "error");
        }
      }
    );
  };

  const handleCabutAktif = () => {
    showConfirm(
      "Cabut Paket Aktif",
      `Cabut paket aktif dari user "${user.nama}"? User tidak akan punya paket aktif setelah ini.`,
      async () => {
        try {
          const res = await userManagementService.setActivePackage(id, null);
          if (res.data.success) {
            showToast("Paket aktif berhasil dicabut!", "success");
            fetchDetail();
          }
        } catch (err) {
          showToast(err?.response?.data?.message || "Gagal mencabut paket aktif", "error");
        }
      }
    );
  };

  const handleOpenCreditModal = () => {
    setCreditAmount("");
    setCreditReason("");
    setIsCreditModalOpen(true);
  };

  const handleAdjustCredit = async () => {
    const amount = Number(creditAmount);
    if (!Number.isFinite(amount) || amount === 0) {
      showToast("Masukkan angka delta yang valid (boleh negatif)", "error");
      return;
    }
    if (!creditReason.trim()) {
      showToast("Alasan koreksi saldo wajib diisi", "error");
      return;
    }
    setIsCreditSubmitting(true);
    try {
      const res = await userManagementService.adjustCredit(id, amount, creditReason.trim());
      if (res.data.success) {
        showToast("Saldo utama berhasil dikoreksi!", "success");
        setIsCreditModalOpen(false);
        fetchDetail();
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Gagal mengoreksi saldo", "error");
    } finally {
      setIsCreditSubmitting(false);
    }
  };

  const handleDeleteUser = () => {
    showConfirm(
      "Hapus User",
      `Aksi ini tidak bisa dibatalkan. Hapus permanen user "${user.nama}"?`,
      async () => {
        try {
          const res = await userManagementService.deleteUser(id);
          if (res.data.success) {
            showToast("User berhasil dihapus!", "success");
            router.push("/users");
          }
        } catch (err) {
          showToast(err?.response?.data?.message || "Gagal menghapus user", "error");
        }
      }
    );
  };

  if (loading) {
    return <div className="p-8 text-center text-[#8b6f66]">Memuat...</div>;
  }

  if (error || !user) {
    return (
      <div className="p-8 text-center text-red-600">
        {error || "User tidak ditemukan"}
      </div>
    );
  }

  const hasHistory =
    user._count.transactions > 0 ||
    user._count.ai_generations > 0 ||
    user._count.system_api_logs > 0 ||
    user._count.feedbacks > 0 ||
    user._count.package_balances > 0;

  return (
    <div className="space-y-6" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
      <button
        onClick={() => router.push("/users")}
        className="flex items-center gap-2 text-sm text-[#8b6f66] hover:text-[#4a1a1a] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke daftar user
      </button>

      <div className="bg-white border border-[#e6d1c7] rounded-lg p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#2b1d19]" style={{ fontFamily: "var(--font-noto-serif)" }}>
              {user.nama}
            </h1>
            <p className="text-sm text-[#8b6f66] mt-1">{user.email}</p>
            <div className="flex items-center gap-3 mt-3 text-xs text-[#8b6f66]">
              <span className="bg-gray-100 px-2 py-1 rounded">{user.tipe_akun}</span>
              <span>Daftar: {new Date(user.createdAt).toLocaleDateString("id-ID")}</span>
              <span>Sisa Credit: {user.sisa_credit}</span>
              {user.is_banned ? (
                <span className="bg-[#fecaca] text-[#991b1b] font-bold px-2 py-1 rounded-md">BANNED</span>
              ) : (
                <span className="bg-[#bbf7d0] text-[#166534] font-bold px-2 py-1 rounded-md">AKTIF</span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={handleToggleBan}
              className={
                user.is_banned
                  ? "flex items-center gap-2 px-4 py-2 rounded-lg bg-[#166534] hover:bg-[#0f3d22] text-white text-xs font-semibold transition-colors"
                  : "flex items-center gap-2 px-4 py-2 rounded-lg bg-[#991b1b] hover:bg-[#7a1616] text-white text-xs font-semibold transition-colors"
              }
            >
              {user.is_banned ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
              {user.is_banned ? "Unban User" : "Ban User"}
            </button>
            <button
              onClick={handleOpenCreditModal}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#e6d1c7] text-xs font-semibold text-[#4a1a1a] hover:bg-[#fafafa] transition-colors"
            >
              <Wallet className="w-4 h-4" />
              Koreksi Saldo Utama
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e6d1c7] rounded-lg p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#4a1a1a] uppercase tracking-wide mb-3">Paket Aktif</h2>
            <p className="text-[#2b1d19]">
              {user.active_package ? user.active_package.namaPaket : "Tidak ada paket aktif"}
            </p>
          </div>
          <button
            onClick={handleCabutAktif}
            disabled={!user.active_package}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#e6d1c7] text-xs font-semibold text-[#991b1b] hover:bg-[#fecaca]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <CircleSlash className="w-4 h-4" />
            Cabut Paket Aktif
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#e6d1c7] rounded-lg overflow-hidden shadow-sm">
        <div className="p-6 pb-0 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#4a1a1a] uppercase tracking-wide">Saldo per Paket</h2>
          <button
            onClick={handleOpenTopupModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4a1a1a] hover:bg-[#2b1d19] text-white text-xs font-semibold transition-colors"
          >
            <Coins className="w-4 h-4" />
            Top-up Paket
          </button>
        </div>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#4a1a1a] border-b border-[#e6d1c7]">
              <tr>
                <th scope="col" className="px-6 py-3 font-bold text-left">Nama Paket</th>
                <th scope="col" className="px-6 py-3 font-bold text-center">Sisa Koin</th>
                <th scope="col" className="px-6 py-3 font-bold text-center">Total Dibeli</th>
                <th scope="col" className="px-6 py-3 font-bold text-center">Tanggal Beli</th>
                <th scope="col" className="px-6 py-3 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {user.package_balances.length > 0 ? (
                user.package_balances.map((b) => {
                  const isCurrentActive = user.active_package?.id === b.package_id;
                  return (
                    <tr key={b.id} className="border-b border-[#e6d1c7] hover:bg-[#fafafa] transition-colors">
                      <td className="px-6 py-3 text-[#2b1d19] font-medium">{b.package.namaPaket}</td>
                      <td className="px-6 py-3 text-center text-[#8b6f66]">{b.coins_remaining}</td>
                      <td className="px-6 py-3 text-center text-[#8b6f66]">{b.coins_purchased}</td>
                      <td className="px-6 py-3 text-center text-[#8b6f66]">
                        {new Date(b.purchased_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <button
                          onClick={() => handleSetActive(b.package_id, b.package.namaPaket)}
                          disabled={isCurrentActive}
                          className="text-[#4a1a1a] hover:text-[#8b6f66] font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          {isCurrentActive ? "Sedang Aktif" : "Set sebagai Aktif"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-6 text-center text-gray-500">Belum ada saldo paket</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-[#e6d1c7] rounded-lg overflow-hidden shadow-sm">
        <div className="p-6 pb-0">
          <h2 className="text-sm font-bold text-[#4a1a1a] uppercase tracking-wide">Riwayat Transaksi</h2>
        </div>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#4a1a1a] border-b border-[#e6d1c7]">
              <tr>
                <th scope="col" className="px-6 py-3 font-bold text-left">Jenis</th>
                <th scope="col" className="px-6 py-3 font-bold text-center">Nominal</th>
                <th scope="col" className="px-6 py-3 font-bold text-center">Status</th>
                <th scope="col" className="px-6 py-3 font-bold text-center">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {user.transactions.length > 0 ? (
                user.transactions.map((t) => (
                  <tr key={t.id} className="border-b border-[#e6d1c7] hover:bg-[#fafafa] transition-colors">
                    <td className="px-6 py-3 text-[#2b1d19] font-medium">{t.jenis_transaksi}</td>
                    <td className="px-6 py-3 text-center text-[#8b6f66]">
                      Rp{t.nominal.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-3 text-center text-[#8b6f66]">{t.status}</td>
                    <td className="px-6 py-3 text-center text-[#8b6f66]">
                      {new Date(t.tgl_transaksi).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-6 text-center text-gray-500">Belum ada transaksi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-[#e6d1c7] rounded-lg overflow-hidden shadow-sm">
        <div className="p-6 pb-0">
          <h2 className="text-sm font-bold text-[#4a1a1a] uppercase tracking-wide">Riwayat AI Generation</h2>
        </div>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#4a1a1a] border-b border-[#e6d1c7]">
              <tr>
                <th scope="col" className="px-6 py-3 font-bold text-center">Koin Terpakai</th>
                <th scope="col" className="px-6 py-3 font-bold text-center">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {user.ai_generations.length > 0 ? (
                user.ai_generations.map((g) => (
                  <tr key={g.id} className="border-b border-[#e6d1c7] hover:bg-[#fafafa] transition-colors">
                    <td className="px-6 py-3 text-center text-[#8b6f66]">{g.harga_credit_terpakai}</td>
                    <td className="px-6 py-3 text-center text-[#8b6f66]">
                      {new Date(g.tgl_generate).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="px-6 py-6 text-center text-gray-500">Belum ada riwayat AI generation</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-[#fecaca] rounded-lg p-6 shadow-sm">
        <h2 className="text-sm font-bold text-[#991b1b] uppercase tracking-wide mb-3">Zona Bahaya</h2>
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#8b6f66] max-w-md">
            {hasHistory
              ? "User ini punya riwayat transaksi/AI generation/saldo paket, sehingga tidak bisa dihapus permanen. Gunakan Ban User di atas sebagai gantinya."
              : "User ini belum punya riwayat apapun dan aman untuk dihapus permanen."}
          </p>
          <button
            onClick={handleDeleteUser}
            disabled={hasHistory}
            title={hasHistory ? "Tidak bisa hapus user yang punya riwayat data" : "Hapus user permanen"}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#991b1b] hover:bg-[#7a1616] text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Hapus User
          </button>
        </div>
      </div>

      {isTopupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#2b1d19]">Top-up Paket</h2>
                <button
                  onClick={() => setIsTopupModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <label className="block text-xs font-semibold text-[#4a1a1a] mb-2">Pilih Paket</label>
              <select
                value={selectedPackageId}
                onChange={(e) => setSelectedPackageId(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e6d1c7] rounded-lg text-sm text-[#2b1d19] focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20"
              >
                <option value="">-- Pilih paket --</option>
                {availablePackages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama} ({p.koin} koin)
                  </option>
                ))}
              </select>

              <button
                onClick={handleTopup}
                disabled={isTopupSubmitting}
                className="flex items-center justify-center gap-2 mt-6 px-8 py-3 rounded-lg bg-[#4a1a1a] hover:bg-[#2b1d19] text-white text-sm font-semibold transition-colors disabled:opacity-70 w-full"
              >
                {isTopupSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>Top-up Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#2b1d19]">Koreksi Saldo Utama</h2>
                <button
                  onClick={() => setIsCreditModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-start gap-2 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800">
                  Sisa credit saat ini: <strong>{user.sisa_credit}</strong>. Gunakan angka negatif untuk mengurangi.
                </p>
              </div>

              <label className="block text-xs font-semibold text-[#4a1a1a] mb-2">Delta Koin (boleh negatif)</label>
              <input
                type="number"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                placeholder="contoh: 10 atau -5"
                className="w-full px-4 py-2.5 border border-[#e6d1c7] rounded-lg text-sm text-[#2b1d19] focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20"
              />

              <label className="block text-xs font-semibold text-[#4a1a1a] mt-4 mb-2">Alasan</label>
              <textarea
                value={creditReason}
                onChange={(e) => setCreditReason(e.target.value)}
                rows={3}
                placeholder="contoh: Kompensasi error sistem tanggal 24 Juni"
                className="w-full px-4 py-2.5 border border-[#e6d1c7] rounded-lg text-sm text-[#2b1d19] focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20"
              />

              <button
                onClick={handleAdjustCredit}
                disabled={isCreditSubmitting}
                className="flex items-center justify-center gap-2 mt-6 px-8 py-3 rounded-lg bg-[#4a1a1a] hover:bg-[#2b1d19] text-white text-sm font-semibold transition-colors disabled:opacity-70 w-full"
              >
                {isCreditSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>Simpan Koreksi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
