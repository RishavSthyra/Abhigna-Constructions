import type { Metadata } from "next";
import { Inter, Roboto_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Home/Footer";

/** Inter for body copy, Roboto Serif for display headings, JetBrains Mono for labels. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const robotoSerif = Roboto_Serif({
  variable: "--font-roboto-serif",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
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
      className={`${inter.variable} ${robotoSerif.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-brand-bg text-brand-ink">
        {children}
        <Footer />
      </body>
    </html>
  );
}
