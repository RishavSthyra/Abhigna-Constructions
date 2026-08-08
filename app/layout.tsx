import type { Metadata } from "next";
import { Inter, Quicksand, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Home/Footer";

/**
 * Awwwards-style typographic stack.
 *
 *   - Quicksand       — clean geometric sans for oversized editorial
 *                       menus and display headlines. Rounded terminals
 *                       give it a contemporary, friendly feel without
 *                       the cold precision of a typical grotesk.
 *   - Inter           — clean sans for body, navigation, UI.
 *   - JetBrains Mono  — mono for index labels, sub-eyebrows,
 *                       metadata strips.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
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
      className={`${inter.variable} ${quicksand.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-brand-bg text-brand-ink">
        {children}
        <Footer />
      </body>
    </html>
  );
}
