"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Coins, Sparkles, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import api, { logoutUser } from "@/utils/request";
import { fetchHasActivePurchaseablePackage } from "@/utils/packageAvailability";

const defaultNavItems = [
  { label: "Home", href: "/home" },
  { label: "AI Feature", href: "/ai" },
  { label: "Services", href: "/service" },
  { label: "The Cut Room", href: "/room" },
];

export default function SiteNavbar({
  navItems = defaultNavItems,
  activeLabel,
  logoHref = "#home",
  logoSrc = "/images/logo-navbar.png",
  logoAlt = "Key Barber logo",
  ctaLabel = "Try AI Now",
  ctaHref = "/ai",
  signInHref = "/login",
  showSignIn = true,
  hideAiCta = false,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      try {
        return savedUser ? JSON.parse(savedUser) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [packagesResolved, setPackagesResolved] = useState(false);
  const [hasActivePackage, setHasActivePackage] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    await logoutUser();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile", null, {}, true);

        if (res.data && res.data.success) {
          setUser(res.data.data);
        }
      } catch (error) {
        setUser(null);
      }
    };

    if (showSignIn) {
      fetchProfile();
    }
  }, [showSignIn, pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".user-dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await fetchHasActivePurchaseablePackage();
      if (cancelled) return;
      setHasActivePackage(ok);
      setPackagesResolved(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const showAiNavAndCta = packagesResolved && hasActivePackage && !hideAiCta;
  const visibleNavItems = navItems.filter((item) => item.href !== "/ai" || showAiNavAndCta);

  const formatDisplayName = (name) => {
    if (!name) return "";
    if (name.toLowerCase().startsWith("guest_")) {
      return "Barber Guest";
    }
    return `${name.split(" ")[0]}`;
  };

  const isAiPage = pathname?.startsWith("/ai");

  return (
    <header className="sticky top-0 z-[100] w-full bg-white bg-[radial-gradient(ellipse_74.79%_67.23%_at_50%_50%,rgba(29,27,25,0)_0%,rgba(29,27,25,0.4)_100%)] border-b border-[#e6d1c7]/30">
      <div className="relative mx-auto flex max-w-8xl items-center justify-between px-6 py-3 lg:px-12 lg:py-0 h-[80px]">
        <Link href={logoHref} className="flex items-center gap-3 pl-0 lg:pl-5">
          <Image src={logoSrc} alt={logoAlt} width={100} height={100} className="h-12 w-16 object-contain lg:h-18 lg:w-24" />
        </Link>

        <nav className="hidden items-center gap-10 lg:absolute lg:left-1/2 lg:flex lg:-translate-x-1/2" style={{ fontFamily: "Liberation Serif" }}>
          {visibleNavItems.map((item) => {
            const isActive = item.active || item.label === activeLabel;

            return (
              <Link key={item.label} href={item.href} className={`text-sm uppercase tracking-[0.25em] transition ${isActive ? "border-b-2 border-[#4a1a1a] pb-0.5 text-[#4a1a1a]" : "text-[#78716c] hover:text-[#4a1a1a]"}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          {showSignIn ? (
            user ? (
              <div className="flex items-center gap-4 border-r border-[#d8c8bc] pr-5 relative user-dropdown-container">
                <div className="flex flex-col items-end">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.25em] text-[#4a1a1a] transition hover:text-[#2b1d19] font-bold"
                    style={{ fontFamily: "Liberation Serif" }}
                  >
                    {formatDisplayName(user.nama)}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isAiPage && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 text-[0.6rem] bg-[#f7f1ea] px-1.5 py-0.5 rounded-sm border border-[#e6d1c7] text-[#5a2725] font-semibold">
                        <Coins className="w-3 h-3 text-[#C59B8F]" />
                        {user.sisa_credit || 0}
                      </span>
                      <span className="flex items-center gap-1 text-[0.6rem] bg-[#4a1a1a] px-1.5 py-0.5 rounded-sm text-[#fbf7f3] uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 text-[#C59B8F]" />
                        {user.active_package?.namaPaket || "Free"}
                      </span>
                    </div>
                  )}

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full right-5 mt-2 w-48 bg-white border border-[#e6d1c7] rounded-md shadow-[0_10px_30px_-10px_rgba(43,29,25,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest text-[#78716c] hover:bg-[#f7f1ea] hover:text-[#4a1a1a] transition-colors"
                        style={{ fontFamily: "var(--font-be-vietnam)" }}
                      >
                        <UserIcon className="w-4 h-4" />
                        My Profile
                      </Link>
                      <div className="h-px bg-[#e6d1c7]/50" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors text-left"
                        style={{ fontFamily: "var(--font-be-vietnam)" }}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link href={signInHref} className="text-sm uppercase tracking-[0.25em] text-[#4a1a1a] transition hover:text-[#2b1d19]" style={{ fontFamily: "Liberation Serif" }}>
                Sign In
              </Link>
            )
          ) : null}

          {!isAiPage && showAiNavAndCta && (
            <Link
              href={ctaHref}
              className="inline-flex h-10 items-center justify-center bg-[#4a1a1a] px-5 text-xs font-medium uppercase tracking-[0.25em] text-[#fbf7f3] shadow-[0_10px_24px_rgba(74,26,26,0.2)] transition hover:bg-[#5a2725] rounded-sm"
              style={{ fontFamily: "Liberation Serif" }}
            >
              {ctaLabel}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          {user && isAiPage && (
            <div className="flex flex-col items-end mr-2">
              <span className="flex items-center gap-1 text-[0.55rem] text-[#5a2725] font-semibold">
                <Coins className="w-2.5 h-2.5 text-[#C59B8F]" />
                {user.sisa_credit || 0} COINS
              </span>
              <span className="text-[0.5rem] uppercase tracking-wider text-[#78716c]">
                {user.active_package?.namaPaket || "Free"}
              </span>
            </div>
          )}

          {!isAiPage && showAiNavAndCta && (
            <Link
              href={ctaHref}
              className="inline-flex h-8 items-center justify-center bg-[#4a1a1a] px-3 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-[#fbf7f3] transition hover:bg-[#5a2725] rounded-sm"
              style={{ fontFamily: "Liberation Serif" }}
            >
              {ctaLabel}
            </Link>
          )}
          <button onClick={toggleMenu} className="flex h-10 w-10 items-center justify-center rounded text-[#4a1a1a] transition hover:bg-[#f7f1ea]" aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="border-t border-[#e6d1c7] bg-white px-6 py-4 lg:hidden" style={{ fontFamily: "Liberation Serif" }}>
          <div className="flex flex-col gap-4">
            {visibleNavItems.map((item) => {
              const isActive = item.active || item.label === activeLabel;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  className={`text-sm uppercase tracking-[0.25em] transition ${isActive ? "border-l-2 border-[#4a1a1a] pl-3 text-[#4a1a1a]" : "pl-3 text-[#78716c] hover:text-[#4a1a1a]"}`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="border-t border-[#e6d1c7] pt-4">
              {showSignIn ? (
                user ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Link href="/profile" onClick={closeMenu} className="block text-sm uppercase tracking-[0.25em] text-[#4a1a1a] transition hover:text-[#2b1d19] font-bold">
                        {formatDisplayName(user.nama)}
                      </Link>
                      <button onClick={handleLogout} className="text-red-600">
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                    {isAiPage && (
                      <div className="flex gap-2">
                        <span className="flex items-center gap-1 text-[0.6rem] bg-[#f7f1ea] px-2 py-1 rounded-sm border border-[#e6d1c7] text-[#5a2725] font-semibold">
                          <Coins className="w-3 h-3 text-[#C59B8F]" />
                          {user.sisa_credit || 0}
                        </span>
                        <span className="flex items-center gap-1 text-[0.6rem] bg-[#4a1a1a] px-2 py-1 rounded-sm text-[#fbf7f3] uppercase tracking-wider">
                          <Sparkles className="w-3 h-3 text-[#C59B8F]" />
                          {user.active_package?.namaPaket || "Free"}
                        </span>
                      </div>
                    )}

                  </div>
                ) : (
                  <Link href={signInHref} onClick={closeMenu} className="block text-sm uppercase tracking-[0.25em] text-[#4a1a1a] transition hover:text-[#2b1d19]">
                    Sign In
                  </Link>
                )
              ) : null}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}