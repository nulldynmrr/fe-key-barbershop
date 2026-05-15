"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AlertTriangle, InboxIcon, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip,
  PieChart,
  Pie,
} from "recharts";
import api from "@/utils/request";

const CustomBar = (props) => {
  const { x, y, width, height, max, value } = props;
  const radius = 8;
  const safeValue = value || 1;
  const totalHeight = (height / safeValue) * max;
  const bottomY = y + height;

  return (
    <g>
      <path
        d={`M${x},${bottomY - totalHeight + radius} 
            a${radius},${radius} 0 0 1 ${radius},-${radius} 
            h${width - 2 * radius} 
            a${radius},${radius} 0 0 1 ${radius},${radius} 
            v${totalHeight - radius} 
            h-${width} Z`}
        fill="#fdf2f0"
      />
      <path
        d={`M${x},${y + radius} 
            a${radius},${radius} 0 0 1 ${radius},-${radius} 
            h${width - 2 * radius} 
            a${radius},${radius} 0 0 1 ${radius},${radius} 
            v${height - radius} 
            h-${width} Z`}
        fill="#4A1A1A"
      />
    </g>
  );
};

const EmptyState = ({ label }) => (
  <div className="flex flex-col items-center justify-center py-12 text-[#c8b0a8]">
    <InboxIcon className="w-10 h-10 mb-3" strokeWidth={1.2} />
    <p
      className="text-sm font-medium"
      style={{ fontFamily: "var(--font-plus-jakarta)" }}
    >
      {label}
    </p>
  </div>
);

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentAnalysisPage, setRecentAnalysisPage] = useState(1);
  const [isRecentAnalysisLoading, setIsRecentAnalysisLoading] = useState(false);

  const fetchDashboardData = async (page = 1) => {
    if (page === 1) setDashboardData(null);
    setIsRecentAnalysisLoading(true);
    try {
      const response = await api.get(`/dashboard/main?page=${page}&limit=10`);
      if (response?.data?.success) {
        if (page === 1) {
          setDashboardData(response.data.data);
        } else {
          setDashboardData(prev => ({
            ...prev,
            recentAnalysis: response.data.data.recentAnalysis,
            recentAnalysisMeta: response.data.data.recentAnalysisMeta
          }));
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsRecentAnalysisLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(recentAnalysisPage);
  }, [recentAnalysisPage]);

  const summaryData = [
    {
      title: "Total Users",
      value:
        dashboardData?.summaryCards.users.currentValue.toLocaleString(
          "id-ID",
        ) ?? "0",
      change: dashboardData
        ? (parseFloat(dashboardData.summaryCards.users.trendPercentage) < 0.1 || dashboardData.summaryCards.users.trendDirection === "down")
          ? "Tidak ada perubahan"
          : `+${Math.abs(dashboardData.summaryCards.users.trendPercentage)}%`
        : "0%",
      isPositive: dashboardData?.summaryCards.users.trendDirection === "up",
      isNoChange: !dashboardData || parseFloat(dashboardData.summaryCards.users.trendPercentage) < 0.1 || dashboardData.summaryCards.users.trendDirection === "down",
      image: "/images/figma/admin-dashboard/total-users.png",
      trendLabel: dashboardData?.summaryCards.users.trendLabel ?? "-",
    },
    {
      title: "Total Pemasukan",
      value: dashboardData
        ? new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(dashboardData.summaryCards.pendapatan.currentValue)
        : "Rp0",
      change: dashboardData
        ? (parseFloat(dashboardData.summaryCards.pendapatan.trendPercentage) < 0.1 || dashboardData.summaryCards.pendapatan.trendDirection === "down")
          ? "Tidak ada perubahan"
          : `+${Math.abs(dashboardData.summaryCards.pendapatan.trendPercentage)}%`
        : "0%",
      isPositive:
        dashboardData?.summaryCards.pendapatan.trendDirection === "up",
      isNoChange: !dashboardData || parseFloat(dashboardData.summaryCards.pendapatan.trendPercentage) < 0.1 || dashboardData.summaryCards.pendapatan.trendDirection === "down",
      image: "/images/figma/admin-dashboard/total-pendapatan.png",
      trendLabel: dashboardData?.summaryCards.pendapatan.trendLabel ?? "-",
    },
    {
      title: "Pengeluaran AI",
      value: dashboardData
        ? new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(dashboardData.summaryCards.pengeluaranAi.currentValue)
        : "Rp0",
      change: dashboardData
        ? (parseFloat(dashboardData.summaryCards.pengeluaranAi.trendPercentage) < 0.1 || dashboardData.summaryCards.pengeluaranAi.trendDirection === "down")
          ? "Tidak ada perubahan"
          : `+${Math.abs(dashboardData.summaryCards.pengeluaranAi.trendPercentage)}%`
        : "0%",
      isPositive:
        dashboardData?.summaryCards.pengeluaranAi.trendDirection === "up",
      isNoChange: !dashboardData || parseFloat(dashboardData.summaryCards.pengeluaranAi.trendPercentage) < 0.1 || dashboardData.summaryCards.pengeluaranAi.trendDirection === "down",
      image: "/images/figma/admin-dashboard/pengeluaran-ai.png",
      trendLabel: dashboardData?.summaryCards.pengeluaranAi.trendLabel ?? "-",
    },
    {
      title: "Sisa Token AI",
      value: dashboardData
        ? Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(dashboardData.summaryCards.sisaToken.currentValue)
        : "0",
      change: dashboardData
        ? (parseFloat(dashboardData.summaryCards.sisaToken.trendPercentage) < 0.1 || dashboardData.summaryCards.sisaToken.trendDirection === "down")
          ? "Tidak ada perubahan"
          : `+${Math.abs(dashboardData.summaryCards.sisaToken.trendPercentage)}%`
        : "0%",
      isPositive: dashboardData?.summaryCards.sisaToken.trendDirection === "up",
      isNoChange: !dashboardData || parseFloat(dashboardData.summaryCards.sisaToken.trendPercentage) < 0.1 || dashboardData.summaryCards.sisaToken.trendDirection === "down",
      image: "/images/figma/admin-dashboard/sisa-token.png",
      badge: dashboardData?.summaryCards.sisaToken.isCritical
        ? "Token sedikit lagi"
        : null,
      trendLabel: dashboardData?.summaryCards.sisaToken.trendLabel ?? "-",
    },
  ];

  const maxDataValue = dashboardData?.revenueChart?.length > 0
    ? Math.max(...dashboardData.revenueChart.map((d) => d.total || 0))
    : 0;
  const computedMax = maxDataValue > 0 ? maxDataValue : 10000;

  const barChartData = (dashboardData?.revenueChart || []).map((d) => ({
    name: d.date || "",
    value: d.total || 0,
    max: computedMax,
  }));

  const tableData = (dashboardData?.recentAnalysis || []).map((row) => ({
    email: row.email,
    credit:
      typeof row.credit === "number" ? `${row.credit} Credit` : row.credit,
    generate:
      typeof row.generate === "number"
        ? `${row.generate} Generate`
        : row.generate,
    status: row.status,
  }));

  const aiColors = ["#4A3B91", "#EF8354", "#10B981", "#3B82F6"];
  const modelAiData = (dashboardData?.aiModelsChart || []).map((d, i) => ({
    name: d.modelName,
    value: d.sisaPercentage,
    color: aiColors[i % aiColors.length],
  }));

  const userColors = {
    Guest: "#FBBF24",
    Premium: "#F97316",
    VIP: "#60A5FA",
    Lainnya: "#4A3B91",
  };

  const userStatData = (dashboardData?.userStats || []).map((d, i) => ({
    name: d.label,
    value: d.percentage,
    count: d.count.toLocaleString("id-ID"),
    color: userColors[d.label] || d.color || aiColors[i % aiColors.length],
  }));
  const hasLeftData = barChartData.length > 0 || tableData.length > 0;
  const hasRightData = modelAiData.length > 0 || userStatData.length > 0;

  return (
    <div className="space-y-6 pb-12">
      {modelAiData.some((m) => m.value <= 20) && (
        <div className="bg-red-50 p-5 rounded-2xl shadow-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-red-800 font-bold text-sm" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
              <Sparkles size={20} strokeWidth={1.5} />DANGER: Budget API AI Hampir / Sudah Habis!
            </h4>
            <p className="text-red-600 text-[11px] mt-1 leading-relaxed" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
              Satu atau lebih model AI memiliki sisa budget kurang dari 20%. Fitur Virtual Try-On dan analisis AI akan GAGAL jika budget habis. Segera top-up saldo provider atau ganti API Key.
            </p>
            <div className="mt-3 flex gap-2">
              <a
                href="/ai-config"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Kelola API Key Sekarang
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((item, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative flex items-start gap-4 transition-transform hover:scale-[1.02] duration-300"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#fafafa] flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner">
              <Image
                src={item.image}
                alt={item.title}
                width={22}
                height={22}
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="flex-1">
              <p
                className="text-[11px] text-[#8b6f66] uppercase tracking-wider font-semibold mb-1"
                style={{ fontFamily: "var(--font-be-vietnam)" }}
              >
                {item.title}
              </p>
              <h3
                className="text-lg font-bold text-[#2b1d19] mb-1.5"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                {item.value}
              </h3>
              <p
                className="text-[10px] text-[#8b6f66]"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                {item.isNoChange ? (
                  <span className="text-[#c4b4a8] font-medium opacity-80 italic">
                    {item.change}
                  </span>
                ) : (
                  <span
                    className={`font-bold ${item.isPositive ? "text-emerald-600" : "text-rose-500"}`}
                  >
                    {item.change}
                  </span>
                )}{" "}
                <span className="opacity-60">{item.trendLabel}</span>
              </p>
            </div>
            {item.badge && (
              <div className="absolute top-4 right-4 bg-[#8b1a1a] text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1 font-semibold tracking-wide">
                <AlertTriangle className="w-3 h-3" />
                {item.badge}
              </div>
            )}
          </div>
        ))}
      </div>

      {(hasLeftData || hasRightData) && (
        <div className={`grid grid-cols-1 ${hasLeftData && hasRightData ? "lg:grid-cols-3" : ""} gap-6`}>
          {hasLeftData && (
            <div className={`${hasRightData ? "lg:col-span-2" : ""} space-y-6`}>
              {barChartData.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <h3
                    className="text-lg font-bold text-[#2b1d19] mb-6"
                    style={{ fontFamily: "var(--font-plus-jakarta)" }}
                  >
                    Rangkuman Pendapatan
                  </h3>
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={barChartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#f0e2d9"
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 10,
                            fill: "#8b6f66",
                            fontFamily: "var(--font-plus-jakarta)",
                          }}
                          dy={10}
                        />
                        <YAxis
                          width={65}
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 10,
                            fill: "#8b6f66",
                            fontFamily: "var(--font-plus-jakarta)",
                          }}
                          tickFormatter={(value) => {
                            if (value === 0) return "0";
                            if (value >= 1000000) return `Rp${value / 1000000}jt`;
                            if (value >= 1000) return `Rp${value / 1000}rb`;
                            return `Rp${value}`;
                          }}
                        />
                        <Tooltip cursor={{ fill: "transparent" }} />
                        <Bar
                          dataKey="value"
                          shape={
                            <CustomBar
                              max={computedMax}
                            />
                          }
                          barSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {tableData.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                  <h3
                    className="text-lg font-bold text-[#2b1d19] mb-4"
                    style={{ fontFamily: "var(--font-plus-jakarta)" }}
                  >
                    Analisis AI Terbaru
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#e6d1c7]">
                          <th className="pb-3 pt-2 pl-4 w-12">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-[#4a1a1a] focus:ring-[#4a1a1a]"
                            />
                          </th>
                          <th
                            className="pb-3 pt-2 text-[11px] font-bold text-[#2b1d19] uppercase tracking-wider"
                            style={{ fontFamily: "var(--font-plus-jakarta)" }}
                          >
                            Email
                          </th>
                          <th
                            className="pb-3 pt-2 text-[11px] font-bold text-[#2b1d19] uppercase tracking-wider"
                            style={{ fontFamily: "var(--font-plus-jakarta)" }}
                          >
                            Total Credit
                          </th>
                          <th
                            className="pb-3 pt-2 text-[11px] font-bold text-[#2b1d19] uppercase tracking-wider"
                            style={{ fontFamily: "var(--font-plus-jakarta)" }}
                          >
                            Total Generate
                          </th>
                          <th
                            className="pb-3 pt-2 text-[11px] font-bold text-[#2b1d19] uppercase tracking-wider"
                            style={{ fontFamily: "var(--font-plus-jakarta)" }}
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((row, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-[#f5ebe6] last:border-none hover:bg-[#fafafa] transition-colors"
                          >
                            <td className="py-4 pl-4">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 text-[#4a1a1a] focus:ring-[#4a1a1a]"
                              />
                            </td>
                            <td
                              className="py-4 text-xs font-medium text-[#2b1d19]"
                              style={{ fontFamily: "var(--font-plus-jakarta)" }}
                            >
                              {row.email}
                            </td>
                            <td
                              className="py-4 text-xs text-[#524342]"
                              style={{ fontFamily: "var(--font-plus-jakarta)" }}
                            >
                              {row.credit}
                            </td>
                            <td
                              className="py-4 text-xs text-[#524342]"
                              style={{ fontFamily: "var(--font-plus-jakarta)" }}
                            >
                              {row.generate}
                            </td>
                            <td className="py-4">
                              <span
                                className={`px-4 py-1 text-[10px] font-bold rounded-md border ${row.status !== "FREE"
                                  ? "bg-[#fdf2f0] border-[#e6d1c7] text-[#4a1a1a]"
                                  : "bg-white border-gray-100 text-[#8b6f66]"
                                  }`}
                                style={{ fontFamily: "var(--font-be-vietnam)" }}
                              >
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {dashboardData?.recentAnalysisMeta && dashboardData.recentAnalysisMeta.totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between border-t border-[#fcf7f4] pt-4">
                      <p className="text-[10px] text-[#8b6f66]">
                        Menampilkan {dashboardData.recentAnalysis.length} dari {dashboardData.recentAnalysisMeta.total} data
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setRecentAnalysisPage(prev => Math.max(1, prev - 1))}
                          disabled={recentAnalysisPage === 1 || isRecentAnalysisLoading}
                          className="p-1.5 rounded-lg bg-[#fafafa] text-[#8b6f66] disabled:opacity-30 hover:bg-[#f5ece8] transition-all"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex items-center px-3 text-[11px] font-bold text-[#2b1d19]">
                          {recentAnalysisPage} / {dashboardData.recentAnalysisMeta.totalPages}
                        </div>
                        <button
                          onClick={() => setRecentAnalysisPage(prev => Math.min(dashboardData.recentAnalysisMeta.totalPages, prev + 1))}
                          disabled={recentAnalysisPage === dashboardData.recentAnalysisMeta.totalPages || isRecentAnalysisLoading}
                          className="p-1.5 rounded-lg bg-[#fafafa] text-[#8b6f66] disabled:opacity-30 hover:bg-[#f5ece8] transition-all"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {hasRightData && (
            <div className="space-y-6">
              {modelAiData.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <h3
                    className="text-lg font-bold text-[#2b1d19] mb-2"
                    style={{ fontFamily: "var(--font-plus-jakarta)" }}
                  >
                    Model AI
                  </h3>
                  <div className="flex justify-center items-center h-[200px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={modelAiData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {modelAiData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Image
                        src="/images/figma/admin-dashboard/pengeluaran-ai.png"
                        alt="Model AI"
                        width={28}
                        height={28}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-4">
                    {modelAiData.map((item, idx) => (
                      <div key={idx} className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-2.5 h-2.5 rounded-sm"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span
                            className="text-[11px] font-semibold text-[#524342]"
                            style={{ fontFamily: "var(--font-plus-jakarta)" }}
                          >
                            {item.name}
                          </span>
                        </div>
                        <span
                          className="text-sm font-medium pl-4.5 text-[#2b1d19]"
                          style={{ fontFamily: "var(--font-plus-jakarta)" }}
                        >
                          Sisa {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h3
                  className="text-lg font-bold text-[#2b1d19] mb-2"
                  style={{ fontFamily: "var(--font-plus-jakarta)" }}
                >
                  Statistik User
                </h3>
                {userStatData.length === 0 ? (
                  <EmptyState label="Belum ada data statistik user" />
                ) : (
                  <>
                    <div className="flex justify-center items-center h-[200px] relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={userStatData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                          >
                            {userStatData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Image
                          src="/images/figma/admin-dashboard/statistik-user.png"
                          alt="Statistik User"
                          width={28}
                          height={28}
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-y-4 gap-x-2">
                      {userStatData.map((item, idx) => (
                        <div key={idx} className="flex flex-col">
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span
                              className="text-[10px] font-semibold text-[#8b6f66]"
                              style={{ fontFamily: "var(--font-plus-jakarta)" }}
                            >
                              {item.name}
                            </span>
                          </div>
                          <span
                            className="text-xs font-bold pl-4 text-[#2b1d19]"
                            style={{ fontFamily: "var(--font-plus-jakarta)" }}
                          >
                            {item.value}%{" "}
                            <span className="text-[#8b6f66] font-medium">
                              ({item.count})
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
