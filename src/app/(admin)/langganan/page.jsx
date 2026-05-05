"use client";

import React from "react";
import { SquarePen, Trash2 } from "lucide-react";

export default function LanggananPage() {
  const packages = [
    {
      id: 1,
      name: "StarterPack",
      type: "ONTIME",
      coin: "100",
      originalPrice: "Rp25.000",
      price: "Rp19.000",
      status: "AKTIF",
    },
    {
      id: 2,
      name: "Premium Weekly",
      type: "Subscription",
      coin: "-",
      originalPrice: null,
      price: "Rp29.000",
      status: "AKTIF",
    },
    {
      id: 3,
      name: "Student Pack",
      type: "Ontime",
      coin: "20",
      originalPrice: null,
      price: "Rp5.000",
      status: "AKTIF",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#4a1a1a]" style={{ fontFamily: "var(--font-noto-serif)" }}>List Paket Harga</h2>
          <p className="text-sm text-[#8b6f66] mt-1">Atur harga paket, kuota koin, dan status langganan</p>
        </div>
        <button className="bg-[#4a1a1a] hover:bg-[#3a1414] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          Tambah Paket
        </button>
      </div>

      <div className="bg-white border border-[#e6d1c7] rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#4a1a1a] border-b border-[#e6d1c7]">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold w-12 text-center">
                  <span className="sr-only">Checkbox</span>
                </th>
                <th scope="col" className="px-6 py-4 font-bold text-center sm:text-left">
                  Nama Paket
                </th>
                <th scope="col" className="px-6 py-4 font-bold text-center">
                  Tipe Paket
                </th>
                <th scope="col" className="px-6 py-4 font-bold text-center">
                  Koin
                </th>
                <th scope="col" className="px-6 py-4 font-bold text-center">
                  Harga
                </th>
                <th scope="col" className="px-6 py-4 font-bold text-center">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 font-bold text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id} className="bg-white border-b border-[#e6d1c7] hover:bg-[#fafafa] transition-colors">
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-[#4a1a1a] bg-gray-100 border-gray-300 rounded focus:ring-[#4a1a1a] focus:ring-2" 
                    />
                  </td>
                  <td className="px-6 py-4 text-[#8b6f66] text-center sm:text-left">
                    {pkg.name}
                  </td>
                  <td className="px-6 py-4 text-[#8b6f66] text-center">
                    {pkg.type}
                  </td>
                  <td className="px-6 py-4 text-[#8b6f66] text-center">
                    {pkg.coin}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {pkg.originalPrice && (
                      <div className="text-xs text-[#ef4444] line-through mb-1">
                        {pkg.originalPrice}
                      </div>
                    )}
                    <div className="font-bold text-[#4a1a1a]">
                      {pkg.price}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-[#4ade80] text-white text-xs font-bold px-3 py-1 rounded-md">
                      {pkg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-[#4a1a1a] hover:text-[#8b6f66] transition-colors" title="Edit">
                        <SquarePen className="w-5 h-5" />
                      </button>
                      <button className="text-[#ef4444] hover:text-[#b91c1c] transition-colors" title="Delete">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
