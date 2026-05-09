"use client";

import React from "react";

export default function TransaksiPage() {
  const transactions = [
    {
      id: "KB-9901",
      customer: "Cust1",
      amount: "Rp 181.989",
      method: "QRIS",
    },
    {
      id: "KB-9902",
      customer: "Cust2",
      amount: "Rp 90.995",
      method: "BNI",
    },
    {
      id: "KB-9903",
      customer: "Cust3",
      amount: "Rp 90.995",
      method: "DANA",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#4a1a1a]" style={{ fontFamily: "var(--font-noto-serif)" }}>Payment Gateway Logs</h2>
          <p className="text-sm text-[#8b6f66] mt-1">Pantau riwayat transaksi, metode pembayaran, dan status order</p>
        </div>
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
                  Order ID
                </th>
                <th scope="col" className="px-6 py-4 font-bold text-center">
                  Customer
                </th>
                <th scope="col" className="px-6 py-4 font-bold text-center">
                  Amount (IDR)
                </th>
                <th scope="col" className="px-6 py-4 font-bold text-center">
                  Method
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trx) => (
                <tr key={trx.id} className="bg-white border-b border-[#e6d1c7] hover:bg-[#fafafa] transition-colors">
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#4a1a1a] bg-gray-100 border-gray-300 rounded focus:ring-[#4a1a1a] focus:ring-2"
                    />
                  </td>
                  <td className="px-6 py-4 font-bold text-[#4a1a1a] text-center sm:text-left">
                    {trx.id}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#4a1a1a] text-center">
                    {trx.customer}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#4a1a1a] text-center">
                    {trx.amount}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#4a1a1a] text-center">
                    {trx.method}
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
