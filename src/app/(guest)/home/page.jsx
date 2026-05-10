import Image from "next/image";
import Link from "next/link";
import { Clock3, Mail, MapPinned, Phone, Scissors, Sparkles, Shield } from "lucide-react";
import SeparatorKey from "../../../components/SeparatorKey";
import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";

const navItems = [
  { label: "Home", href: "#", active: true },
  { label: "AI Feature", href: "/ai" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
];

const stats = [
  { value: "100+", label: "Clients" },
  { value: "2+ Years", label: "Expertise" },
  { value: "20+", label: "Styles" },
];

const footerLinks = [
  { label: "Home", href: "#home" },
  { label: "AI Feature", href: "#ai-feature" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
];

const contactDetails = [
  {
    icon: MapPinned,
    label: "Jl. Nanas No.31, Cihapit, Kec. Bandung Wetan, Kota Bandung, Jawa Barat 40114",
  },
  { icon: Phone, label: "+62 813-1380-798" },
  { icon: Mail, label: "hello@keybarber.id" },
];

const openingHours = [
  ["Monday - Thursday", "10:00 - 20:00"],
  ["Friday", "13:00 - 20:00"],
  ["Saturday - Sunday", "09:00 - 20:00"],
];

function StatCard({ value, label }) {
  return (
    <div className="border border-[#e6d1c7] bg-[#EDE8E0] px-5 py-6 text-center shadow-[0_16px_30px_rgba(57,28,22,0.05)]">
      <div className="text-3xl leading-none text-[#3a221c]" style={{ fontFamily: "var(--font-playfair)" }}>
        {value}
      </div>
      <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8b6f66]" style={{ fontFamily: "var(--font-be-vietnam)" }}>
        {label}
      </div>
    </div>
  );
}

function SectionCard({ title, description, className = "", titleClassName = "", descriptionClassName = "", children, childrenFirst = false }) {
  return (
    <article className={className}>
      {childrenFirst ? children : null}
      <h3 className={`text-3xl ${titleClassName}`} style={{ fontFamily: "var(--font-noto-serif)" }}>
        {title}
      </h3>
      {description ? (
        <p className={`mt-4 text-base leading-7 ${descriptionClassName}`} style={{ fontFamily: "var(--font-plus-jakarta)" }}>
          {description}
        </p>
      ) : null}
      {!childrenFirst ? children : null}
    </article>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#2B1D19] scroll-smooth">
      <section id="home" className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/figma/home/hero-background-3dbeae.png" alt="Key Barber interior" fill priority sizes="100vw" className="object-cover object-center opacity-90" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(74,26,26,0.38)_80%,rgba(74,26,26,0.3)_20%,rgba(254,248,243,0.65)_100%)]" />
        </div>

        <SiteNavbar activeLabel="Home" />

        <div className="relative mx-auto flex min-h-[min(100svh,58rem)] max-w-7xl flex-col items-center justify-center px-6 pb-24 pt-32 text-center lg:px-10 lg:pt-36">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-16 bg-[#f0e2d9]/50" />
            <span className="text-lg  uppercase tracking-[0.42em] text-[#f0e2d9]" style={{ fontFamily: "var(--font-be-vietnam)" }}>
              EST. 2024
            </span>
            <span className="h-px w-16 bg-[#f0e2d9]/50" />
          </div>

          <h1 className="max-w-5xl text-5xl font-semibold leading-[0.95] tracking-tight text-[#fdf9f4] text-shadow-soft sm:text-6xl lg:text-7xl" style={{ fontFamily: "var(--font-playfair)" }}>
            <span className="block">Find Your Perfect Hairstyle</span>
            <span className="block" style={{ fontFamily: "var(--font-noto-serif)" }}>
              with AI
            </span>
          </h1>

          <p className="mt-8 max-w-3xl text-base leading-8 text-[#f0e2d9]/85 sm:text-lg" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
            Experience precision grooming powered by expertise and enhanced with AI-driven recommendations.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
            <Link
              href="/ai"
              className="inline-flex items-center justify-center border border-[#4a1a1a] bg-[#4a1a1a] px-8 py-4 text-sm font-medium uppercase tracking-[0.3em] text-[#fbf7f3] shadow-[inset_0_1px_2px_rgba(255,255,255,0.35)] transition hover:bg-[#5a2725]"
              style={{ fontFamily: "var(--font-plus-jakarta)" }}
            >
              Start AI Recommendation
            </Link>
            <Link
              href="/service"
              className="inline-flex items-center justify-center border border-[#c57e7b]/55 bg-white/8 px-8 py-4 text-sm font-medium uppercase tracking-[0.3em] text-[#fbf7f3] backdrop-blur-[2px] transition hover:border-[#f0e2d9] hover:bg-white/14"
              style={{ fontFamily: "var(--font-plus-jakarta)" }}
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      <SeparatorKey />

      {/* Grid Features Section */}
      <div className="bg-gradient-to-b from-white to-[#E1D5C9]">
        <section className="relative isolate mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:pb-14">
          <div className="relative z-10 grid gap-8 lg:grid-cols-[0.65fr_0.35fr]">
            <article className="relative row-span-2 min-h-128 overflow-hidden border border-[#e6d1c7] bg-[#ede8e0]">
              <Image
                src="/images/figma/home/artisanal-precision.png"
                alt="Artisanal Precision"
                fill
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover object-center opacity-85"
              />
              <div className="absolute inset-0 bg-[linear-gradient(360deg,rgba(74,26,26,0.82)_0%,rgba(74,26,26,0.42)_34%,rgba(74,26,26,0.06)_62%,rgba(74,26,26,0)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
                <p className="text-sm uppercase tracking-[0.42em] text-[#f3ded6]" style={{ fontFamily: "var(--font-be-vietnam)" }}>
                  The Technique
                </p>
                <h3 className="mt-3 text-3xl text-white sm:text-4xl" style={{ fontFamily: "var(--font-noto-serif)" }}>
                  Artisanal Precision
                </h3>
                <p className="mt-4 max-w-xl text-base leading-7 text-[#f7e7e1]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                  Every cut is a collaboration between technique and individuality, guided by experience, refined through detail.
                </p>
              </div>
            </article>
            <SectionCard
              className="border border-[#e6d1c7] bg-[#ede8e0] px-9 py-12 text-center flex flex-col justify-center"
              title="The Calm"
              titleClassName="text-[#4a1a1a]"
              description="A space designed for comfort, where every detail is crafted to give you a relaxing and refined grooming experience."
              descriptionClassName="text-[#8B4513]"
              childrenFirst={true}
            >
              <Shield className="mx-auto mb-4 h-10 w-10 text-[#8B4513]" strokeWidth={1.5} />
            </SectionCard>

            <SectionCard
              className="border border-[#4a1a1a] bg-[#4a1a1a] px-9 py-12 text-left text-[#fbf7f3] shadow-[0_28px_60px_rgba(74,26,26,0.28)] flex flex-col justify-center"
              title="AI Stylist"
              titleClassName="text-[#fbf7f3]"
              description="Our intelligent system analyzes your facial structure and hair characteristics to recommend the most suitable hairstyle for you."
              descriptionClassName="text-[#f3ded6]"
            >
              <Link
                href="/user/ai-analyze"
                className="mt-8 inline-flex items-center gap-2 border-b border-white/30 pb-1 text-[0.72rem] uppercase tracking-[0.38em] text-[#fbf7f3] transition hover:border-white/70"
                style={{ fontFamily: "var(--font-be-vietnam)" }}
              >
                Discover your look
              </Link>
            </SectionCard>
          </div>
        </section>
      </div>

      <div className="bg-[#E1D5C9]">
        {/* Banner Section */}
        <section className="relative isolate mx-auto max-w-7xl px-6 py-4 pb-10 lg:px-10 lg:pb-14">
          <div className="w-full mb-8 relative flex items-center justify-center rounded-sm overflow-hidden">
            <Image
              src="/images/figma/home/keybarber-intro.png"
              alt="Key Barber Intro"
              width={1200}
              height={600}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </section>

        <SeparatorKey />

        {/* About Section */}
        <section id="about" className="relative isolate mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:pb-24 mt-4">
          <div className="relative z-10 grid gap-12 lg:grid-cols-[0.3fr_0.7fr] items-center">
            <div className="relative flex flex-col justify-center">
              <div className="absolute -left-16 -top-16 w-64 h-64 pointer-events-none opacity-20">
                <Image src="/images/figma/home/key-icon.png" alt="Key Barber Background" fill className="object-contain" />
              </div>
              <div className="relative z-10 pl-4 sm:pl-8">
                <h2 className="text-[#4a1a1a] flex flex-col">
                  <span className="text-3xl mb-1" style={{ fontFamily: "var(--font-playfair)" }}>About</span>
                  <span className="text-5xl sm:text-6xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>Key Barber</span>
                </h2>
              </div>
            </div>
            <article className="relative overflow-hidden p-4 sm:p-8 md:p-0">
              <div className="relative z-10">
                <p className="max-w-xl text-lg italic leading-8 text-[#5f463d]" style={{ fontFamily: "var(--font-be-vietnam)" }}>
                  A legacy of craftsmanship refined through modern precision
                </p>
                <p className="mt-6 max-w-2xl text-base leading-7 text-[#6e5851]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                  Founded in Bandung, Key Barber is built on the belief that a haircut is more than a routine, it is a reflection of self-respect. Designed for men who value precision, comfort, and timeless style, we blend classic barbering
                  techniques with a modern sensibility to create a look that is uniquely yours.
                </p>

                <div className="mt-10 grid gap-4 grid-cols-2 sm:grid-cols-3">
                  {stats.map((stat) => (
                    <StatCard key={stat.label} value={stat.value} label={stat.label} />
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Our Media Social Section */}
        <section className="relative isolate mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:pb-32 overflow-hidden">
          <div className="grid gap-12 lg:grid-cols-[0.55fr_0.45fr] items-center">
            {/* Left: 3 Overlapping Cards */}
            <div className="relative h-[450px] sm:h-[550px] w-full flex items-center justify-center">
              <div className="absolute left-0 sm:left-[5%] z-10 w-48 sm:w-64 aspect-[3/4] transition transform -rotate-6 origin-bottom-right hover:scale-105 hover:-rotate-3 hover:z-30 duration-300">
                <Image src="/images/figma/home/card1.png" alt="Card 1" fill className="object-contain" />
              </div>

              <div className="absolute right-0 sm:right-[5%] z-10 w-48 sm:w-64 aspect-[3/4] transition transform rotate-6 origin-bottom-left hover:scale-105 hover:rotate-3 hover:z-30 duration-300">
                <Image src="/images/figma/home/card3.png" alt="Card 3" fill className="object-contain" />
              </div>

              <div className="absolute z-20 w-52 sm:w-72 aspect-[3/4] transition transform rotate-2 hover:scale-105 hover:rotate-0 hover:z-30 duration-300">
                <Image src="/images/figma/home/card2.png" alt="Card 2" fill className="object-contain" />
              </div>
            </div>

            {/* Right: Text Content */}
            <div className="flex flex-col justify-center px-4 sm:px-8">
              <h2 className="text-[#4a1a1a] flex items-center gap-4 text-4xl sm:text-5xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
                Our Media Social
                <div className="h-12 w-4 sm:h-14 sm:w-5 relative shrink-0">
                  <Image src="/images/figma/home/key-icon.png" alt="Key Icon" fill className="object-contain opacity-80" />
                </div>
              </h2>
              <p className="mt-6 max-w-md text-sm sm:text-base italic leading-7 text-[#5f463d]" style={{ fontFamily: "var(--font-be-vietnam)" }}>
                A legacy of craftsmanship refined through modern precision
              </p>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
