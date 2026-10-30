import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope, Caveat } from "next/font/google";
import ButterflyCursor from "@/components/shared/ButterflyCursor";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SenJun — A home built with love",
  description:
    "A quiet garden home where nobody feels alone. Follow the butterfly — welcome to SenJun.",
};

export const viewport: Viewport = {
  themeColor: "#F6E3B5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} ${caveat.variable}`}
    >
      <body className="bg-cream font-body text-ink antialiased">
        {children}
        {/* Desktop only — a small blue butterfly replaces the arrow
            (pointer: fine; hidden again on touch, and the native arrow
            returns if JS never runs). */}
        <ButterflyCursor />
        {/* If JavaScript never runs, reveal the opening copy and story lines anyway */}
        <noscript>
          <style>{`.reveal-line { opacity: 1 !important; transform: none !important; } .story-line { opacity: 1 !important; } .final-line, .fade-in-late { opacity: 1 !important; }`}</style>
        </noscript>
      </body>
    </html>
  );
}
