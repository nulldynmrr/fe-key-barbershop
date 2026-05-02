"use client";

import React from "react";
import { User, Wallet, Scissors, BarChart3, AlertTriangle } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip,
  PieChart, Pie
} from "recharts";

const summaryData = [
  { title: "Total Users", value: "8,019", change: "+12.5%", isPositive: true, icon: User },
  { title: "Total Pendapatan", value: "Rp1.200.000", change: "+12.5%", isPositive: true, icon: Wallet },
  { title: "Pengeluaran AI", value: "Rp1.200.000", change: "-5.5%", isPositive: false, icon: Scissors },
  { title: "Sisa Token AI", value: "1M", change: "-5.5%", isPositive: false, icon: BarChart3, badge: "Token sedikit lagi" },
];

const barChartData = [
  { name: "30 April", value: 4000, max: 10000 },
  { name: "1 Mei", value: 6000, max: 10000 },
  { name: "3 Mei", value: 3500, max: 10000 },
  { name: "10 Mei", value: 8000, max: 10000 },
  { name: "17 Mei", value: 4500, max: 10000 },
  { name: "20 Mei", value: 8500, max: 10000 },
  { name: "31 Mei", value: 3000, max: 10000 },
  { name: "14 Juni", value: 5000, max: 10000 },
  { name: "30 Juli", value: 4000, max: 10000 },
];

const tableData = [
  { email: "keybarber2gmail.com", credit: "32 Credit", generate: "42 Generate", status: "PREMIUM" },
  { email: "keybarber2gmail.com", credit: "32 Credit", generate: "42 Generate", status: "GUEST" },
  { email: "keybarber2gmail.com", credit: "32 Credit", generate: "42 Generate", status: "VIP" },
  { email: "keybarber2gmail.com", credit: "32 Credit", generate: "42 Generate", status: "PREMIUM" },
  { email: "keybarber2gmail.com", credit: "32 Credit", generate: "42 Generate", status: "PREMIUM" },
  { email: "keybarber2gmail.com", credit: "32 Credit", generate: "42 Generate", status: "PREMIUM" },
];

const modelAiData = [
  { name: "Model Gemini 2.5 Flash Image", value: 37, color: "#4A3B91" },
  { name: "Model Gemini 2.1 Lite", value: 20, color: "#EF8354" },
];

const userStatData = [
  { name: "Guest", value: 35, count: "1,971", color: "#FBBF24" },
  { name: "Premium", value: 28, count: "1,577", color: "#F97316" },
  { name: "VIP", value: 35, count: "1,971", color: "#60A5FA" },
  { name: "Lainnya", value: 28, count: "1,577", color: "#4A3B91" },
];

const CustomBar = (props) => {
  const { x, y, width, height, max, value } = props;
  const radius = 8;
  const totalHeight = (height / value) * max;
  const bottomY = y + height;

  return (
    <g>
      {/* Background Bar (Light Pink) */}
      <path
        d={`M${x},${bottomY - totalHeight + radius} 
            a${radius},${radius} 0 0 1 ${radius},-${radius} 
            h${width - 2 * radius} 
            a${radius},${radius} 0 0 1 ${radius},${radius} 
            v${totalHeight - radius} 
            h-${width} Z`}
        fill="#fdf2f0"
      />
      {/* Foreground Bar (Dark Red) */}
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

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-white p-5 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#f0e2d9] relative flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#fafafa] flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-[#4a1a1a]" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-[#8b6f66] uppercase tracking-wider font-semibold mb-1" style={{ fontFamily: "var(--font-be-vietnam)" }}>
                  {item.title}
                </p>
                <h3 className="text-2xl font-bold text-[#2b1d19] mb-2" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                  {item.value}
                </h3>
                <p className="text-[10px] text-[#8b6f66]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                  <span className={`font-bold ${item.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                    {item.change}
                  </span>{" "}
                  dari 7 hari kebelakang
                </p>
              </div>
              
              {item.badge && (
                <div className="absolute top-4 right-4 bg-[#8b1a1a] text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1 font-semibold tracking-wide">
                  <AlertTriangle className="w-3 h-3" />
                  {item.badge}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main Charts & Tables) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Income Chart */}
          <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#f0e2d9]">
            <h3 className="text-lg font-bold text-[#2b1d19] mb-6" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
              Rangkuman Pendapatan
            </h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0e2d9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#8b6f66', fontFamily: 'var(--font-plus-jakarta)' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#8b6f66', fontFamily: 'var(--font-plus-jakarta)' }}
                    ticks={[0, 1500, 14000, 1000000, 12000000, 16000000]} // Rough approximation of the y-axis labels
                    tickFormatter={(value) => {
                      if(value === 0) return '0';
                      if(value === 1500) return 'Rp1500';
                      if(value === 14000) return 'Rp14rb';
                      if(value === 1000000) return 'Rp1jt';
                      if(value === 12000000) return 'Rp12jt';
                      if(value === 16000000) return 'Rp16jt';
                      return value;
                    }}
                  />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" shape={<CustomBar />} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table Analisis AI */}
          <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#f0e2d9] overflow-hidden">
            <h3 className="text-lg font-bold text-[#2b1d19] mb-4" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
              Analisis AI Terbaru
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e6d1c7]">
                    <th className="pb-3 pt-2 pl-4 w-12">
                      <input type="checkbox" className="rounded border-gray-300 text-[#4a1a1a] focus:ring-[#4a1a1a]" />
                    </th>
                    <th className="pb-3 pt-2 text-[11px] font-bold text-[#2b1d19] uppercase tracking-wider" style={{ fontFamily: "var(--font-plus-jakarta)" }}>Email</th>
                    <th className="pb-3 pt-2 text-[11px] font-bold text-[#2b1d19] uppercase tracking-wider" style={{ fontFamily: "var(--font-plus-jakarta)" }}>Total Credit</th>
                    <th className="pb-3 pt-2 text-[11px] font-bold text-[#2b1d19] uppercase tracking-wider" style={{ fontFamily: "var(--font-plus-jakarta)" }}>Total Generate</th>
                    <th className="pb-3 pt-2 text-[11px] font-bold text-[#2b1d19] uppercase tracking-wider" style={{ fontFamily: "var(--font-plus-jakarta)" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, idx) => (
                    <tr key={idx} className="border-b border-[#f5ebe6] last:border-none hover:bg-[#fafafa] transition-colors">
                      <td className="py-4 pl-4">
                        <input type="checkbox" className="rounded border-gray-300 text-[#4a1a1a] focus:ring-[#4a1a1a]" />
                      </td>
                      <td className="py-4 text-xs font-medium text-[#2b1d19]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>{row.email}</td>
                      <td className="py-4 text-xs text-[#524342]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>{row.credit}</td>
                      <td className="py-4 text-xs text-[#524342]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>{row.generate}</td>
                      <td className="py-4">
                        <span className={`px-4 py-1 text-[10px] font-bold rounded-md border ${
                          row.status === 'PREMIUM' ? 'bg-white border-[#e6d1c7] text-[#8b6f66]' :
                          row.status === 'GUEST' ? 'bg-white border-[#e6d1c7] text-[#8b6f66]' :
                          row.status === 'VIP' ? 'bg-white border-[#e6d1c7] text-[#8b6f66]' : ''
                        }`} style={{ fontFamily: "var(--font-be-vietnam)" }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (Donut Charts) */}
        <div className="space-y-6">
          
          {/* Model AI Chart */}
          <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#f0e2d9]">
            <h3 className="text-lg font-bold text-[#2b1d19] mb-2" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
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
                 <Scissors className="w-6 h-6 text-[#4A1A1A]" />
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {modelAiData.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }}></div>
                    <span className="text-[11px] font-semibold text-[#524342]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>{item.name}</span>
                  </div>
                  <span className="text-sm font-medium pl-4.5 text-[#2b1d19]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                    Sisa {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Statistik User Chart */}
          <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#f0e2d9]">
            <h3 className="text-lg font-bold text-[#2b1d19] mb-2" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
              Statistik User
            </h3>
            
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
                 <BarChart3 className="w-6 h-6 text-[#4A1A1A]" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-y-4 gap-x-2">
              {userStatData.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-[10px] font-semibold text-[#8b6f66]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>{item.name}</span>
                  </div>
                  <span className="text-xs font-bold pl-4 text-[#2b1d19]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                    {item.value}% <span className="text-[#8b6f66] font-medium">({item.count})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}