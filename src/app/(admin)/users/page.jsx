"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { userManagementService } from "@/services/userManagementService";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(page, search);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search]);

  const fetchUsers = async (pageToFetch, querySearch) => {
    setLoading(true);
    setError(null);
    try {
      const res = await userManagementService.getUsers({ page: pageToFetch, limit: 10, search: querySearch });
      if (res.data.success) {
        setUsers(res.data.data || []);
        setTotalPages(res.data.meta?.totalPages || 1);
      }
    } catch (err) {
      console.error("Gagal memuat user:", err);
      setError(err?.response?.data?.message || "Gagal memuat daftar user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
      <div>
        <h1 className="text-2xl font-bold text-[#2b1d19]" style={{ fontFamily: "var(--font-noto-serif)" }}>
          User & Subscription
        </h1>
        <p className="text-sm text-[#8b6f66] mt-1">Kelola data user, paket aktif, dan saldo koin</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b6f66]" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Cari nama atau email..."
          className="w-full pl-10 pr-4 py-2.5 border border-[#e6d1c7] rounded-lg text-sm text-[#2b1d19] focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white border border-[#e6d1c7] rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#4a1a1a] border-b border-[#e6d1c7]">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold text-left">Nama</th>
                <th scope="col" className="px-6 py-4 font-bold text-left">Email</th>
                <th scope="col" className="px-6 py-4 font-bold text-center">Tipe Akun</th>
                <th scope="col" className="px-6 py-4 font-bold text-center">Status Langganan</th>
                <th scope="col" className="px-6 py-4 font-bold text-center">Sisa Credit</th>
                <th scope="col" className="px-6 py-4 font-bold text-center">Status</th>
                <th scope="col" className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">Memuat...</td>
                </tr>
              ) : users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className="bg-white border-b border-[#e6d1c7] hover:bg-[#fafafa] transition-colors">
                    <td className="px-6 py-4 text-[#2b1d19] font-medium">{u.nama}</td>
                    <td className="px-6 py-4 text-[#8b6f66]">{u.email}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">{u.tipe_akun}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-[#8b6f66]">
                      {u.status_langganan ? "Aktif" : "Tidak aktif"}
                    </td>
                    <td className="px-6 py-4 text-center text-[#8b6f66]">{u.sisa_credit}</td>
                    <td className="px-6 py-4 text-center">
                      {u.is_banned ? (
                        <span className="bg-[#fecaca] text-[#991b1b] text-[10px] font-bold px-2 py-1 rounded-md">BANNED</span>
                      ) : (
                        <span className="bg-[#bbf7d0] text-[#166534] text-[10px] font-bold px-2 py-1 rounded-md">AKTIF</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => router.push(`/users/${u.id}`)}
                        className="text-[#4a1a1a] hover:text-[#8b6f66] font-semibold text-xs transition-colors"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">Belum ada user</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-[#8b6f66]">Halaman {page} dari {totalPages}</span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2 border border-[#e6d1c7] rounded-lg disabled:opacity-40 hover:bg-[#fafafa]"
          >
            <ChevronLeft className="w-4 h-4 text-[#4a1a1a]" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-2 border border-[#e6d1c7] rounded-lg disabled:opacity-40 hover:bg-[#fafafa]"
          >
            <ChevronRight className="w-4 h-4 text-[#4a1a1a]" />
          </button>
        </div>
      </div>
    </div>
  );
}
