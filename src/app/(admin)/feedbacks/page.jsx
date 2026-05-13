"use client";

import React, { useState, useEffect } from "react";
import {
    Loader2,
    Trash2,
    MessageSquareText,
    CheckCircle,
    Clock,
    Mail,
    User as UserIcon,
    Search,
    Filter,
    Check,
    X,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { waitlistService } from "@/services/waitlistService";
import { useToast } from "@/contexts/ToastContext";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function FeedbacksPage() {
    const { showToast, showConfirm } = useToast();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const [meta, setMeta] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1
    });

    useEffect(() => {
        fetchFeedbacks(meta.page);
    }, [meta.page]);

    const fetchFeedbacks = async (page = 1) => {
        setLoading(true);
        try {
            const res = await waitlistService.getWaitlist(page, meta.limit);
            if (res.data.success) {
                setFeedbacks(res.data.data);
                setMeta(res.data.meta);
            }
        } catch (err) {
            console.error("Gagal memuat feedback:", err);
            setError("Gagal memuat data feedback");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (feedbackId) => {
        showConfirm(
            "Hapus Feedback",
            "Apakah Anda yakin ingin menghapus feedback ini? Tindakan ini tidak dapat dibatalkan.",
            async () => {
                try {
                    const res = await waitlistService.deleteWaitlist(feedbackId);
                    if (res.data.success) {
                        showToast("Feedback berhasil dihapus!", "success");
                        fetchFeedbacks(meta.page);
                    }
                } catch (err) {
                    showToast(err?.response?.data?.message || "Gagal menghapus feedback", "error");
                }
            }
        );
    };

    const handleMarkHandled = async (feedbackId) => {
        try {
            const res = await waitlistService.markHandled(feedbackId);
            if (res.data.success) {
                showToast("Ditandai sudah ditangani!", "success");
                fetchFeedbacks(meta.page);
            }
        } catch (err) {
            showToast(err?.response?.data?.message || "Gagal memperbarui status", "error");
        }
    };

    const filteredFeedbacks = feedbacks.filter(item => {
        const matchesFilter =
            filter === "all" ? true :
                filter === "handled" ? item.is_handled :
                    !item.is_handled;

        const matchesSearch =
            (item.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (item.pesan?.toLowerCase() || "").includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2
                        className="text-xl font-bold text-[#4a1a1a]"
                        style={{ fontFamily: "var(--font-noto-serif)" }}
                    >
                        User Feedbacks & Waitlist
                    </h2>
                    <p
                        className="text-sm text-[#8b6f66] mt-1"
                        style={{ fontFamily: "var(--font-plus-jakarta)" }}
                    >
                        Kelola pesan dan masukan dari user saat AI sedang sibuk atau offline
                    </p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b6f66]" />
                    <input
                        type="text"
                        placeholder="Cari email atau isi pesan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white w-full pl-10 pr-4 py-2.5 bg-[#fafafa] border border-[#f0e2d9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4a1a1a]/10 focus:border-[#4a1a1a] transition-all"
                        style={{ fontFamily: "var(--font-plus-jakarta)" }}
                    />
                </div>
                <div className="flex gap-2">
                    {[
                        { id: "all", label: "Semua", icon: MessageSquareText },
                        { id: "pending", label: "Pending", icon: Clock },
                        { id: "handled", label: "Selesai", icon: CheckCircle }
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border
                ${filter === f.id
                                    ? "bg-[#4a1a1a] text-white border-[#4a1a1a] shadow-md shadow-[#4a1a1a]/20"
                                    : "bg-white text-[#8b6f66] border-[#f0e2d9] hover:bg-[#fafafa]"}`}
                            style={{ fontFamily: "var(--font-plus-jakarta)" }}
                        >
                            <f.icon className="w-3.5 h-3.5" />
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading && feedbacks.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-[#4a1a1a]" />
                </div>
            ) : error ? (
                <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-3">
                    <X className="w-5 h-5" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredFeedbacks.length > 0 ? (
                        filteredFeedbacks.map((item) => (
                            <div
                                key={item.id}
                                className={`group bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] flex flex-col
                  ${item.is_handled ? 'border-[#f0e2d9] opacity-80' : 'border-[#4a1a1a]/10 bg-gradient-to-br from-white to-[#fffcfb]'}`}
                            >
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center
                        ${item.is_handled ? 'bg-[#f5f5f5] text-gray-400' : 'bg-[#fdf2f0] text-[#4a1a1a]'}`}>
                                                <UserIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-[#2b1d19] truncate max-w-[150px]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                                                    {item.email || "Anonymous Guest"}
                                                </p>
                                                <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-[#8b6f66]">
                                                    <Clock className="w-3 h-3" />
                                                    {format(new Date(item.createdAt), "d MMM yyyy, HH:mm", { locale: id })}
                                                </div>
                                            </div>
                                        </div>
                                        {item.is_handled ? (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                                                <Check className="w-3 h-3" /> SELESAI
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                                                <Clock className="w-3 h-3" /> PENDING
                                            </span>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <MessageSquareText className="absolute -left-1 -top-1 w-4 h-4 text-[#4a1a1a]/10" />
                                        <p className="text-sm text-[#4a1a1a] leading-relaxed pl-4 font-medium" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                                            {item.pesan}
                                        </p>
                                    </div>
                                </div>

                                <div className="px-6 py-4 bg-[#fafafa] border-t border-[#f0e2d9]/50 flex items-center justify-between rounded-b-2xl">
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        title="Hapus"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    {!item.is_handled && (
                                        <button
                                            onClick={() => handleMarkHandled(item.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-[#4a1a1a] hover:bg-[#2b1d19] text-white text-[11px] font-bold rounded-lg transition-all shadow-sm"
                                            style={{ fontFamily: "var(--font-plus-jakarta)" }}
                                        >
                                            <Check className="w-3.5 h-3.5" />
                                            Tandai Selesai
                                        </button>
                                    )}

                                    {item.is_handled && item.email && (
                                        <a
                                            href={`mailto:${item.email}`}
                                            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#f0e2d9] text-[#4a1a1a] text-[11px] font-bold rounded-lg hover:bg-[#fdf2f0] transition-all"
                                            style={{ fontFamily: "var(--font-plus-jakarta)" }}
                                        >
                                            <Mail className="w-3.5 h-3.5" />
                                            Balas Email
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 rounded-full bg-[#fdf2f0] flex items-center justify-center mb-6">
                                <MessageSquareText className="w-10 h-10 text-[#e6d1c7]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#2b1d19] mb-2">
                                Tidak Ada Feedback
                            </h3>
                            <p className="text-sm text-[#8b6f66] max-w-xs">
                                {searchQuery || filter !== "all"
                                    ? "Tidak menemukan feedback yang sesuai dengan kriteria pencarian Anda."
                                    : "Belum ada pesan masuk dari user saat ini."}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {!loading && meta.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-8">
                    <button
                        onClick={() => setMeta(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                        disabled={meta.page === 1}
                        className="p-2 rounded-xl border border-[#f0e2d9] text-[#4a1a1a] disabled:opacity-30 hover:bg-[#fdf2f0] transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-bold text-[#4a1a1a]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                        Halaman {meta.page} dari {meta.totalPages}
                    </span>
                    <button
                        onClick={() => setMeta(prev => ({ ...prev, page: Math.min(meta.totalPages, prev.page + 1) }))}
                        disabled={meta.page === meta.totalPages}
                        className="p-2 rounded-xl border border-[#f0e2d9] text-[#4a1a1a] disabled:opacity-30 hover:bg-[#fdf2f0] transition-all"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
