"use client";

import React, { useState } from "react";
import { Globe, Wallet, Activity } from "lucide-react";

const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? "bg-[#86efac]" : "bg-[#fca5a5]"
      }`}
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
  const [routers, setRouters] = useState([
    { id: 1, name: "MAIA ROUTER", model: "gemini-1.5 flash", apiKey: "***************************", active: true },
    { id: 2, name: "MAIA ROUTER", model: "gemini-1.5 flash", apiKey: "***************************", active: true },
    { id: 3, name: "MAIA ROUTER", model: "gemini-1.5 flash", apiKey: "***************************", active: false },
  ]);

  const toggleRouter = (id) => {
    setRouters(routers.map(router => 
      router.id === id ? { ...router, active: !router.active } : router
    ));
  };

  const logsData = [
    { id: 1, timestamp: "30/04 14:00", email: "@dinar_akbar", tokens: "1.200 / 800", modalApi: "$0.00014", chargeUser: "$0.00019", profit: "+$0.00005" },
    { id: 2, timestamp: "30/04 14:05", email: "@user_test", tokens: "5.000 / 2.000", modalApi: "$0.00050", chargeUser: "$0.00067", profit: "+$0.00017" },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Konfigurasi Model Aktif */}
      <section>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#4a1a1a]" style={{ fontFamily: "var(--font-noto-serif)" }}>
              Konfigurasi Model Aktif
            </h2>
            <p className="text-sm text-[#8b6f66] mt-1" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
              Konfigurasikan dan kelola rute model AI serta koneksi API
            </p>
          </div>
          <button className="bg-[#4a1a1a] hover:bg-[#2b1d19] text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
            Tambah API
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {routers.map((router) => (
            <div key={router.id} className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#f0e2d9]">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-[#2b1d19] tracking-wide uppercase" style={{ fontFamily: "var(--font-plus-jakarta)" }}>{router.name}</h3>
                <ToggleSwitch checked={router.active} onChange={() => toggleRouter(router.id)} />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#2b1d19] uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-be-vietnam)" }}>Model</label>
                  <input 
                    type="text" 
                    value={router.model}
                    readOnly
                    className="w-full text-sm text-[#524342] px-3 py-2 rounded border border-[#e6d1c7] bg-white focus:outline-none"
                    style={{ fontFamily: "var(--font-plus-jakarta)" }}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#2b1d19] uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-be-vietnam)" }}>API KEY</label>
                  <input 
                    type="text" 
                    value={router.apiKey}
                    readOnly
                    className="w-full text-sm text-[#524342] px-3 py-2 rounded border border-[#e6d1c7] bg-white focus:outline-none"
                    style={{ fontFamily: "var(--font-plus-jakarta)" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Master Exchange Setting */}
      <section>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#4a1a1a]" style={{ fontFamily: "var(--font-noto-serif)" }}>
              Master Exchange Setting
            </h2>
            <p className="text-sm text-[#8b6f66] mt-1" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
              Kelola kurs mata uang, margin profit, dan buffer inflasi
            </p>
          </div>
          <button className="bg-[#4a1a1a] hover:bg-[#2b1d19] text-white text-xs font-semibold px-6 py-2 rounded-md transition-colors" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
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
              <p className="text-[10px] font-semibold text-[#8b6f66] mb-1" style={{ fontFamily: "var(--font-plus-jakarta)" }}>Global Multiplier</p>
              <h3 className="text-2xl font-bold text-[#2b1d19]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                1.35 <span className="text-xs font-normal text-[#524342] ml-1">(35%)</span>
              </h3>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#f0e2d9] flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#fdf2f0] flex items-center justify-center flex-shrink-0">
              <Wallet className="w-5 h-5 text-[#4a1a1a]" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#8b6f66] mb-1" style={{ fontFamily: "var(--font-plus-jakarta)" }}>Base Rate (USD/IDR)</p>
              <h3 className="text-2xl font-bold text-[#2b1d19] mb-1" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                Rp17.332
              </h3>
              <p className="text-[9px] text-[#2b1d19] font-medium" style={{ fontFamily: "var(--font-plus-jakarta)" }}>Kurs Mentah, samakan di web router</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#f0e2d9] flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#fdf2f0] flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5 text-[#4a1a1a]" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#8b6f66] mb-1" style={{ fontFamily: "var(--font-plus-jakarta)" }}>Inflation Buffer</p>
              <h3 className="text-2xl font-bold text-[#2b1d19] mb-1" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                5%
              </h3>
              <p className="text-[9px] font-medium" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                <span className="text-[#2b1d19]">Effective Rate: </span>
                <span className="text-[#b91c1c]">Rp 18.199</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Usage Logs */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#4a1a1a]" style={{ fontFamily: "var(--font-noto-serif)" }}>
            AI Usage Logs
          </h2>
          <p className="text-sm text-[#8b6f66] mt-1" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
            Monitor riwayat token, biaya modal, dan laba transaksi
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#f0e2d9] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e6d1c7] bg-white">
                  <th className="py-4 pl-6 w-12">
                    <input type="checkbox" className="rounded border-gray-300 text-[#4a1a1a] focus:ring-[#4a1a1a]" />
                  </th>
                  <th className="py-4 px-4 text-[11px] font-bold text-[#2b1d19] uppercase tracking-wider" style={{ fontFamily: "var(--font-plus-jakarta)" }}>Timestamp</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-[#2b1d19] uppercase tracking-wider" style={{ fontFamily: "var(--font-plus-jakarta)" }}>Email User</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-[#2b1d19] uppercase tracking-wider" style={{ fontFamily: "var(--font-plus-jakarta)" }}>Tokens (In/Out)</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-[#2b1d19] uppercase tracking-wider" style={{ fontFamily: "var(--font-plus-jakarta)" }}>Modal API ($)</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-[#2b1d19] uppercase tracking-wider" style={{ fontFamily: "var(--font-plus-jakarta)" }}>Charge User ($)</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-[#2b1d19] uppercase tracking-wider" style={{ fontFamily: "var(--font-plus-jakarta)" }}>Profit ($)</th>
                </tr>
              </thead>
              <tbody>
                {logsData.map((row) => (
                  <tr key={row.id} className="border-b border-[#f5ebe6] last:border-none hover:bg-[#fafafa] transition-colors">
                    <td className="py-5 pl-6">
                      <input type="checkbox" className="rounded border-gray-300 text-[#4a1a1a] focus:ring-[#4a1a1a]" />
                    </td>
                    <td className="py-5 px-4 text-xs text-[#2b1d19] font-medium" style={{ fontFamily: "var(--font-plus-jakarta)" }}>{row.timestamp}</td>
                    <td className="py-5 px-4 text-xs text-[#524342]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>{row.email}</td>
                    <td className="py-5 px-4 text-xs text-[#524342]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>{row.tokens}</td>
                    <td className="py-5 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded border border-[#e6d1c7] bg-white text-[10px] font-medium text-[#524342]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                        {row.modalApi}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded border border-[#e6d1c7] bg-white text-[10px] font-medium text-[#524342]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                        {row.chargeUser}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded border border-[#e6d1c7] bg-[#fdf2f0] text-[10px] font-semibold text-[#8b1a1a]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                        {row.profit}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
