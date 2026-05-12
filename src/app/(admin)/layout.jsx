"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Home, Cpu, Tags, Users, ReceiptText, Bell, Share2, LogOut, User, Settings, X, CheckCircle } from "lucide-react";
import { ToastProvider, useToast } from "@/contexts/ToastContext";
import { logoutAdmin } from "@/utils/request";
import { getAdminProfile, requestAdminOTP, getNotifications, updateAdminProfile, markNotificationRead, markAllNotificationsRead } from "@/services/adminService";

function AdminLayoutContent({ children }) {
  const pathname = usePathname();
  const { showToast } = useToast();

  const [admin, setAdmin] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Form states
  const [updateForm, setUpdateForm] = useState({ nama: "", password: "", otp: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRequestingOTP, setIsRequestingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "AI Engine Control", href: "/ai-config", icon: Cpu },
    { name: "Harga & Langganan", href: "/langganan", icon: Tags },
    { name: "Transaksi", href: "/transaksi", icon: ReceiptText },
    { name: "Barbers", href: "/barbers", icon: Users },
    { name: "Media Social", href: "/media-social", icon: Share2 },
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [profileRes, notifRes] = await Promise.all([
        getAdminProfile(),
        getNotifications()
      ]);

      if (profileRes.success) {
        setAdmin(profileRes.data);
        setUpdateForm({ nama: profileRes.data.nama, password: "" });
      }

      if (notifRes.success) {
        setNotifications(notifRes.data);
        setUnreadCount(notifRes.unreadCount);
      }
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
  };

  const handleRequestOTP = async () => {
    setIsRequestingOTP(true);
    try {
      const res = await requestAdminOTP();
      if (res.success) {
        showToast("Kode OTP telah dikirim ke email Anda", "success");
        setOtpSent(true);
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal mengirim OTP", "error");
    } finally {
      setIsRequestingOTP(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (updateForm.password && !updateForm.otp) {
      showToast("OTP wajib diisi jika ingin mengubah password", "warning");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await updateAdminProfile(updateForm);
      if (res.success) {
        showToast("Profil berhasil diperbarui", "success");
        setAdmin(res.data);
        setShowUpdateModal(false);
        setUpdateForm(prev => ({ ...prev, password: "", otp: "" }));
        setOtpSent(false);
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal memperbarui profil", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await markAllNotificationsRead();
      if (res.success) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  return (
    <div className="flex h-screen bg-[#fafafa] font-sans text-[#4a1a1a]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#e6d1c7] flex flex-col flex-shrink-0 z-20">
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

        <div className="p-4 border-t border-[#f0e6e1]">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-3 text-sm font-medium text-[#8b6f66] hover:text-red-600 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 flex items-center justify-between px-8 bg-[#fafafa] border-b border-transparent">
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
            {/* Notification Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifDropdown(!showNotifDropdown);
                  setShowProfileDropdown(false);
                }}
                className={`relative p-2 rounded-full transition-all shadow-sm border ${showNotifDropdown ? 'bg-[#ede8e0] border-[#8b6f66]' : 'bg-white border-[#e6d1c7] text-[#8b6f66] hover:bg-[#ede8e0]'}`}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-[#e6d1c7] overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-3 border-b border-[#f0e6e1] flex justify-between items-center bg-[#fafafa]">
                    <h3 className="font-bold text-sm">Notifikasi</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-[#8b6f66] hover:text-[#4a1a1a] font-medium"
                      >
                        Tandai semua dibaca
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto p-2">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 border-b border-[#f9f5f3] hover:bg-[#faf9f8] transition-colors relative ${!n.is_read ? 'bg-[#fffcfb]' : ''}`}
                        >
                          {!n.is_read && <div className="absolute left-1 top-4 w-2 h-2 p-1 bg-green-600 rounded-full" />}
                          <p className="text-xs font-bold mb-0.5">{n.title}</p>
                          <p className="text-[11px] text-[#8b6f66] leading-relaxed">{n.message}</p>
                          <span className="text-[9px] text-[#d8c8bc] mt-1 block">
                            {new Date(n.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-10 text-center text-[#d8c8bc]">
                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                        <p className="text-xs">Tidak ada notifikasi</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
                  setShowNotifDropdown(false);
                }}
                className="flex items-center gap-3 p-1 pr-3 rounded-full bg-white shadow-sm border border-[#e6d1c7] hover:bg-[#faf9f8] transition-all"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#e6d1c7]">
                  <img
                    src={`https://ui-avatars.com/api/?name=${admin?.nama || 'Admin'}&background=4a1a1a&color=fff`}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="text-left hidden md:block">
                  {admin ? (
                    <>
                      <p className="text-xs font-bold leading-tight">{admin.nama}</p>
                      <p className="text-[10px] text-[#8b6f66] leading-tight uppercase tracking-wider">{admin.role}</p>
                    </>
                  ) : (
                    <div className="space-y-1">
                      <div className="h-3 w-20 bg-gray-100 animate-pulse rounded" />
                      <div className="h-2 w-12 bg-gray-50 animate-pulse rounded" />
                    </div>
                  )}
                </div>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-[#e6d1c7] overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                  {admin && (
                    <div className="px-4 py-4 border-b border-[#f0e6e1] bg-[#fafafa]">
                      <p className="text-xs font-bold truncate">{admin.nama}</p>
                      <p className="text-[10px] text-[#8b6f66] truncate">{admin.email}</p>
                    </div>
                  )}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowUpdateModal(true);
                        setShowProfileDropdown(false);
                      }}
                      className="flex items-center w-full px-3 py-2.5 text-xs text-[#8b6f66] hover:bg-[#faf9f8] hover:text-[#4a1a1a] rounded-xl transition-colors"
                    >
                      <User className="mr-3 h-4 w-4" />
                      Edit Profil
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2.5 text-xs text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-1"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 pt-4">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Update Profile Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500 border border-[#e6d1c7]">
            <div className="px-8 py-6 border-b border-[#f0e6e1] flex justify-between items-center bg-[#fafafa]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#ede8e0] rounded-xl">
                  <Settings className="h-5 w-5 text-[#4a1a1a]" />
                </div>
                <h2 className="text-lg font-bold">Update Profil Admin</h2>
              </div>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="p-2 text-[#d8c8bc] hover:text-[#4a1a1a] hover:bg-[#ede8e0] rounded-full transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#8b6f66] uppercase tracking-widest mb-2 ml-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={updateForm.nama}
                  onChange={(e) => setUpdateForm({ ...updateForm, nama: e.target.value })}
                  className="w-full px-5 py-4 bg-[#f9f5f3] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#4a1a1a] transition-all placeholder-[#d8c8bc]"
                  placeholder="Masukkan nama baru"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8b6f66] uppercase tracking-widest mb-2 ml-1">
                  Password Baru (Opsional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={updateForm.password}
                    onChange={(e) => setUpdateForm({ ...updateForm, password: e.target.value })}
                    className="flex-1 px-5 py-4 bg-[#f9f5f3] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#4a1a1a] transition-all placeholder-[#d8c8bc]"
                    placeholder="Kosongkan jika tidak ingin diubah"
                  />
                  {updateForm.password && (
                    <button
                      type="button"
                      onClick={handleRequestOTP}
                      disabled={isRequestingOTP}
                      className="px-4 bg-white border border-[#e6d1c7] text-[#4a1a1a] rounded-2xl text-[10px] font-bold hover:bg-[#fafafa] disabled:opacity-50"
                    >
                      {isRequestingOTP ? "..." : "Get OTP"}
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-[#d8c8bc] mt-2 ml-1">Minimal 6 karakter</p>
              </div>

              {updateForm.password && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-bold text-[#8b6f66] uppercase tracking-widest mb-2 ml-1">
                    Kode OTP {otpSent && <span className="text-green-600 normal-case font-medium ml-2">(Sudah Terkirim)</span>}
                  </label>
                  <input
                    type="text"
                    required
                    value={updateForm.otp}
                    onChange={(e) => setUpdateForm({ ...updateForm, otp: e.target.value })}
                    className="w-full px-5 py-4 bg-[#f9f5f3] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#4a1a1a] transition-all placeholder-[#d8c8bc]"
                    placeholder="Masukkan 6 digit kode OTP"
                  />
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-4 bg-[#4a1a1a] text-white rounded-2xl text-sm font-bold shadow-lg shadow-[#4a1a1a]/20 hover:bg-[#3d1515] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <ToastProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ToastProvider>
  );
}

