"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const defaultNavItems = [
  { label: "Home", href: "#home" },
  { label: "AI Feature", href: "#ai-feature" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
];

export default function SiteNavbar({
  navItems = defaultNavItems,
  activeLabel,
  logoHref = "#home",
  logoSrc = "/images/logo-navbar.png",
  logoAlt = "Key Barber logo",
  ctaLabel = "Try AI Now",
  ctaHref = "/user/ai-analyze",
  signInHref = "/user/login-admin",
  showSignIn = true,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-20 w-full bg-white bg-[radial-gradient(ellipse_74.79%_67.23%_at_50%_50%,rgba(29,27,25,0)_0%,rgba(29,27,25,0.4)_100%)]">
      <div className="relative mx-auto flex max-w-8xl items-center justify-between px-6 py-3 lg:px-12 lg:py-0">
        {/* Logo */}
        <Link href={logoHref} className="flex items-center gap-3 pl-0 lg:pl-5">
          <Image src={logoSrc} alt={logoAlt} width={100} height={100} className="h-12 w-16 object-contain lg:h-18 lg:w-24" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-10 lg:absolute lg:left-1/2 lg:flex lg:-translate-x-1/2" style={{ fontFamily: "Liberation Serif" }}>
          {navItems.map((item) => {
            const isActive = item.active || item.label === activeLabel;

            return (
              <Link key={item.label} href={item.href} className={`text-sm uppercase tracking-[0.25em] transition ${isActive ? "border-b-2 border-[#4a1a1a] pb-0.5 text-[#4a1a1a]" : "text-[#78716c] hover:text-[#4a1a1a]"}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-6 lg:flex">
          {showSignIn ? (
            <Link href={signInHref} className="text-sm uppercase tracking-[0.25em] text-[#4a1a1a] transition hover:text-[#2b1d19]" style={{ fontFamily: "Liberation Serif" }}>
              Sign In
            </Link>
          ) : null}
          <Link
            href={ctaHref}
            className="inline-flex h-11 items-center justify-center bg-[#4a1a1a] px-6 text-xs font-medium uppercase tracking-[0.28em] text-[#fbf7f3] shadow-[0_10px_24px_rgba(74,26,26,0.2)] transition hover:bg-[#5a2725]"
            style={{ fontFamily: "Liberation Serif" }}
          >
            {ctaLabel}
          </Link>
        </div>

        {/* Mobile CTA + Menu Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <Link
            href={ctaHref}
            className="inline-flex h-10 items-center justify-center bg-[#4a1a1a] px-4 text-xs font-medium uppercase tracking-[0.25em] text-[#fbf7f3] transition hover:bg-[#5a2725]"
            style={{ fontFamily: "Liberation Serif" }}
          >
            {ctaLabel}
          </Link>
          <button onClick={toggleMenu} className="flex h-10 w-10 items-center justify-center rounded text-[#4a1a1a] transition hover:bg-[#f7f1ea]" aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <nav className="border-t border-[#e6d1c7] bg-white px-6 py-4 lg:hidden" style={{ fontFamily: "Liberation Serif" }}>
          <div className="flex flex-col gap-4">
            {navItems.map((item) => {
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
                <Link href={signInHref} onClick={closeMenu} className="block text-sm uppercase tracking-[0.25em] text-[#4a1a1a] transition hover:text-[#2b1d19]">
                  Sign In
                </Link>
              ) : null}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
