"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShieldAlert, ShieldCheck } from "lucide-react";
import { userManagementService } from "@/services/userManagementService";
import { useToast } from "@/contexts/ToastContext";

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast, showConfirm } = useToast();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              {user.is_banned ? (
                <span className="bg-[#fecaca] text-[#991b1b] font-bold px-2 py-1 rounded-md">BANNED</span>
              ) : (
                <span className="bg-[#bbf7d0] text-[#166534] font-bold px-2 py-1 rounded-md">AKTIF</span>
              )}
            </div>
          </div>
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
        </div>
      </div>

      <div className="bg-white border border-[#e6d1c7] rounded-lg p-6 shadow-sm">
        <h2 className="text-sm font-bold text-[#4a1a1a] uppercase tracking-wide mb-3">Paket Aktif</h2>
        <p className="text-[#2b1d19]">
          {user.active_package ? user.active_package.namaPaket : "Tidak ada paket aktif"}
        </p>
      </div>

      <div className="bg-white border border-[#e6d1c7] rounded-lg overflow-hidden shadow-sm">
        <div className="p-6 pb-0">
          <h2 className="text-sm font-bold text-[#4a1a1a] uppercase tracking-wide">Saldo per Paket</h2>
        </div>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#4a1a1a] border-b border-[#e6d1c7]">
              <tr>
                <th scope="col" className="px-6 py-3 font-bold text-left">Nama Paket</th>
                <th scope="col" className="px-6 py-3 font-bold text-center">Sisa Koin</th>
                <th scope="col" className="px-6 py-3 font-bold text-center">Total Dibeli</th>
                <th scope="col" className="px-6 py-3 font-bold text-center">Tanggal Beli</th>
              </tr>
            </thead>
            <tbody>
              {user.package_balances.length > 0 ? (
                user.package_balances.map((b) => (
                  <tr key={b.id} className="border-b border-[#e6d1c7] hover:bg-[#fafafa] transition-colors">
                    <td className="px-6 py-3 text-[#2b1d19] font-medium">{b.package.namaPaket}</td>
                    <td className="px-6 py-3 text-center text-[#8b6f66]">{b.coins_remaining}</td>
                    <td className="px-6 py-3 text-center text-[#8b6f66]">{b.coins_purchased}</td>
                    <td className="px-6 py-3 text-center text-[#8b6f66]">
                      {new Date(b.purchased_at).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-6 text-center text-gray-500">Belum ada saldo paket</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
