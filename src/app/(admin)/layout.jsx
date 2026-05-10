"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Home, Cpu, Tags, Users, ReceiptText, Bell } from "lucide-react";
import { ToastProvider } from "@/contexts/ToastContext";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "AI Engine Control", href: "/ai-config", icon: Cpu },
    { name: "Harga & Langganan", href: "/langganan", icon: Tags },
    { name: "Barbers", href: "/barbers", icon: Users },
    { name: "Transaksi", href: "/transaksi", icon: ReceiptText },
  ];

  return (
    <ToastProvider>
      <div className="flex h-screen bg-[#fafafa] font-sans">
        <aside className="w-64 bg-white border-r border-[#e6d1c7] flex flex-col flex-shrink-0">
          <div className="flex items-center justify-center h-20 px-6 mb-4">
            <div className="relative w-48 h-12">
              <Image
                src="/images/logo-navbar.png"
                alt="Key Barber"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center group relative px-3 py-3 text-sm font-medium transition-colors ${isActive
                      ? "text-[#4a1a1a]"
                      : "text-[#8b6f66] hover:text-[#4a1a1a]"
                    }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive
                        ? "text-[#4a1a1a]"
                        : "text-[#d8c8bc] group-hover:text-[#8b6f66]"
                      }`}
                    aria-hidden="true"
                  />
                  <span
                    className={isActive ? "font-bold" : "font-medium"}
                    style={{ fontFamily: "var(--font-plus-jakarta)" }}
                  >
                    {item.name}
                  </span>
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#4a1a1a] rounded-l-md" />
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-20 flex items-center justify-between px-8 bg-[#fafafa]">
            <div>
              <div
                className="flex items-center text-xs text-[#8b6f66] mb-1"
                style={{ fontFamily: "var(--font-be-vietnam)" }}
              >
                <span>Pages</span>
                <span className="mx-2">/</span>
                <span className="capitalize">
                  {pathname.split("/").pop().replace("-", " ")}
                </span>
              </div>
              <h1
                className="text-2xl font-bold text-[#4a1a1a]"
                style={{ fontFamily: "var(--font-noto-serif)" }}
              >
                <span className="capitalize">
                  {pathname.split("/").pop().replace("-", " ")}
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-[#8b6f66] hover:bg-[#ede8e0] rounded-full transition-colors bg-white shadow-sm border border-[#e6d1c7]">
                <Bell className="h-4 w-4" />
              </button>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#e6d1c7]">
                <img
                  src="https://ui-avatars.com/api/?name=Admin+User&background=4a1a1a&color=fff"
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto p-8 pt-0">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
