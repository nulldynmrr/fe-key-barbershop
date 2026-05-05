"use client";

import React from "react";

export default function BarbersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#4a1a1a]" style={{ fontFamily: "var(--font-noto-serif)" }}>Barbers</h2>
          <p className="text-sm text-[#8b6f66] mt-1">Kelola data barber Anda di sini</p>
        </div>
      </div>
    </div>
  );
}
