import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Home/Footer";

/** Inter for body copy, Outfit for display headings, JetBrains Mono for labels. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/** Outfit — geometric sans display face; clean at light weights, premium feel. */
const displaySans = Outfit({
  variable: "--font-display-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abhigna Constructions — Residential Communities in Bengaluru",
  description:
    "Abhigna Constructions builds thoughtful residential communities in Bengaluru, with a focus on quality, sustainability, and long-term value.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${displaySans.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-brand-bg text-brand-ink">
        {children}
        <Footer />
      </body>
    </html>
  );
}
