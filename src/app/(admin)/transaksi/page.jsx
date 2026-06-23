"use client";

import React, { useState, useEffect } from "react";
import { getAdminTransactions } from "@/services/adminService";

export default function TransaksiPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async (pageToFetch = page, querySearch = search) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminTransactions({
        page: pageToFetch,
        limit: 10,
        search: querySearch,
      });
      setTransactions(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setError(err.response?.data?.message || "Gagal mengambil data transaksi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTransactions(page, search);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [page, search]);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const baseClass = "px-3 py-1 text-xs font-semibold rounded-full inline-block text-center";
    switch (status?.toUpperCase()) {
      case "SUCCESS":
      case "PAID":
        return <span className={`${baseClass} bg-green-50 text-green-700 border border-green-200`}>Success</span>;
      case "PENDING":
        return <span className={`${baseClass} bg-amber-50 text-amber-700 border border-amber-200`}>Pending</span>;
      case "FAILED":
      case "EXPIRED":
        return <span className={`${baseClass} bg-red-50 text-red-700 border border-red-200`}>Failed</span>;
      default:
        return <span className={`${baseClass} bg-gray-50 text-gray-700 border border-gray-200`}>{status || "Unknown"}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#4a1a1a]" style={{ fontFamily: "var(--font-noto-serif)" }}>
            Payment Gateway Logs
          </h2>
          <p className="text-sm text-[#8b6f66] mt-1">Pantau riwayat transaksi, metode pembayaran, dan status order</p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari Order ID, Customer, atau Email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2.5 pl-10 text-sm text-[#4a1a1a] bg-white border border-[#e6d1c7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/20 focus:border-[#4a1a1a] transition-all"
          />
          <div className="absolute left-3.5 top-3 text-[#8b6f66]">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        {loading && (
          <span className="text-xs text-[#8b6f66] animate-pulse flex items-center gap-1.5">
            <svg className="animate-spin h-3.5 w-3.5 text-[#4a1a1a]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Memuat data...
          </span>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white border border-[#e6d1c7] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-xs text-[#4a1a1a] bg-[#fdfaf8] border-b border-[#e6d1c7]">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold w-12 text-center">
                  <span className="sr-only">Select</span>
                </th>
                <th scope="col" className="px-6 py-4 font-bold">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-4 font-bold">
                  Tanggal
                </th>
                <th scope="col" className="px-6 py-4 font-bold">
                  Customer
                </th>
                <th scope="col" className="px-6 py-4 font-bold text-right">
                  Amount (IDR)
                </th>
                <th scope="col" className="px-6 py-4 font-bold text-center">
                  Method
                </th>
                <th scope="col" className="px-6 py-4 font-bold text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-[#8b6f66]">
                    Memuat daftar transaksi...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-[#8b6f66]">
                    Tidak ada transaksi ditemukan.
                  </td>
                </tr>
              ) : (
                transactions.map((trx) => (
                  <tr
                    key={trx.id}
                    className="bg-white border-b border-[#e6d1c7] hover:bg-[#faf6f3]/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#4a1a1a] bg-gray-100 border-[#e6d1c7] rounded focus:ring-[#4a1a1a]"
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#4a1a1a]">
                      {trx.invoice_number || trx.id}
                    </td>
                    <td className="px-6 py-4 text-[#6e534a] text-xs">
                      {formatDate(trx.tgl_transaksi)}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#4a1a1a]">
                      <div>{trx.user?.nama || "Unknown"}</div>
                      <div className="text-xs text-[#8b6f66] font-normal">{trx.user?.email || ""}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#4a1a1a] text-right">
                      {formatPrice(trx.nominal)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#4a1a1a] text-center text-xs">
                      {trx.payment_method || (trx.invoice_number ? "DOKU" : "MANUAL")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(trx.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 bg-[#fdfaf8] border-t border-[#e6d1c7]">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || loading}
              className="px-4 py-2 text-xs font-semibold text-[#4a1a1a] bg-white border border-[#e6d1c7] rounded-xl hover:bg-[#faf6f3] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <span className="text-xs text-[#8b6f66] font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || loading}
              className="px-4 py-2 text-xs font-semibold text-[#4a1a1a] bg-white border border-[#e6d1c7] rounded-xl hover:bg-[#faf6f3] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
