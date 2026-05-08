import { Be_Vietnam_Pro, Inter, Noto_Serif, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import GoogleAuthProviderWrapper from "@/components/GoogleAuthProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Key Barber",
  description: "Established in Tradition",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${plusJakarta.variable} ${beVietnam.variable} ${notoSerif.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans text-gray-800 bg-[#FBF9F7]">
        <GoogleAuthProviderWrapper>
          {children}
        </GoogleAuthProviderWrapper>
      </body>
    </html>
  );
}
