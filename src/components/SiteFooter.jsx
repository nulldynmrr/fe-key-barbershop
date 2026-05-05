import Image from "next/image";
import Link from "next/link";
import { Clock3, Mail, MapPinned, Phone } from "lucide-react";

const defaultFooterLinks = [
  { label: "Home", href: "/home" },
  { label: "AI Feature", href: "/ai" },
  { label: "Services", href: "/service" },
  { label: "Gallery", href: "/gallery" },
];

const defaultContactDetails = [
  {
    icon: MapPinned,
    label: "Jl. Nanas No.31, Cihapit, Kec. Bandung Wetan, Kota Bandung, Jawa Barat 40114",
  },
  { icon: Phone, label: "+62 813-1380-798" },
  { icon: Mail, label: "hello@keybarber.id" },
];

const defaultOpeningHours = [
  ["Monday - Thursday", "10:00 - 20:00"],
  ["Friday", "13:00 - 20:00"],
  ["Saturday - Sunday", "09:00 - 20:00"],
];

export default function SiteFooter({ footerLinks = defaultFooterLinks, contactDetails = defaultContactDetails, openingHours = defaultOpeningHours }) {
  return (
    <footer id="gallery" className="bg-[#2D0D0D] text-[#C57E7B]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.8fr_0.95fr]">
          <div>
            <div className="flex items-center gap-4">
              <div>
                <div className="text-3xl text-[#f3e8de]" style={{ fontFamily: "var(--font-playfair)" }}>
                  Key Barber
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-md text-base leading-7 text-[#c57e7b]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
              Premium barbershop combining traditional craftsmanship with AI-powered precision.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <Link
                href="https://www.instagram.com/"
                aria-label="Instagram"
                className="inline-flex h-11 w-11 items-center justify-center border border-[#c57e7b]/20 text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[#f3e8de] transition hover:bg-white/5"
                style={{ fontFamily: "var(--font-be-vietnam)" }}
              >
                IG
              </Link>
              <Link href="tel:+628131380798" aria-label="Phone" className="inline-flex h-11 w-11 items-center justify-center border border-[#c57e7b]/20 text-[#f3e8de] transition hover:bg-white/5">
                <Phone className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.42em] text-[#f3e8de]" style={{ fontFamily: "var(--font-be-vietnam)" }}>
              Menu
            </p>
            <div className="mt-6 space-y-4">
              {footerLinks.map((item) => (
                <Link key={item.label} href={item.href} className="block text-base text-[#c57e7b] transition hover:text-[#f3e8de]" style={{ fontFamily: "var(--font-be-vietnam)" }}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.42em] text-[#f3e8de]" style={{ fontFamily: "var(--font-be-vietnam)" }}>
              Contact us
            </p>

            <div className="mt-6 space-y-4">
              {contactDetails.map(({ icon: Icon, label }) => (
                <div key={label} className="flex gap-3 text-base leading-7 text-[#c57e7b]">
                  <Icon className="mt-1 h-4 w-4 shrink-0 text-[#D07B46]" />
                  <span style={{ fontFamily: "var(--font-plus-jakarta)" }}>{label}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-[#c57e7b]/20 pt-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.34em] text-[#D07B46]">
                <Clock3 className="h-4 w-4" />
                Opening Hours
              </div>
              <div className="mt-4 space-y-3">
                {openingHours.map(([day, time]) => (
                  <div key={day} className="flex items-center justify-between gap-4 text-base text-[#c57e7b]">
                    <span style={{ fontFamily: "var(--font-plus-jakarta)" }}>{day}</span>
                    <span style={{ fontFamily: "var(--font-plus-jakarta)" }}>{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-6xl py-6">
          <div className="separator flex items-center justify-center gap-6">
            <div className="grow border-t border-[#c57e7b]/20"></div>
            <div className="sep-img-wrapper" aria-hidden="true">
              <Image src="/images/logo-transparent.png" alt="separator" width={Math.round(64 * 0.5)} height="64" className="sep-img" />
            </div>
            <div className="grow border-t border-[#c57e7b]/20"></div>
          </div>
        </div>
        <div className=" flex flex-col gap-4 text-xs uppercase tracking-[0.34em] text-[#c57e7b]/70 md:flex-row md:items-center md:justify-between">
          <span>© 2026 Key Barber. Seluruh hak cipta dilindungi.</span>
          <span>
            DIKEMBANGKAN OLEH <span className="text-[#D07B46]">IUM26-042 · TELKOM UNIVERSITY</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
