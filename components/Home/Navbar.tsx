"use client";

import { useEffect, useState } from "react";
import { FiInstagram, FiLinkedin, FiTwitter, FiPhone } from "react-icons/fi";

const NAV_ITEMS = [
  { label: "Home", href: "#hero" },
  { label: "Apartments", href: "#listings" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "#about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-cursor="image"
      className={`fixed inset-x-0 top-0 z-50 flex justify-center px-4 transition-all duration-500 ${
        scrolled ? "pt-3" : "pt-6"
      }`}
    >
      <nav
        className={`flex w-full max-w-[1180px] items-center justify-between rounded-full border border-white/30 bg-white/15 px-3 py-2 backdrop-blur-xl transition-all duration-500 ${
          scrolled ? "shadow-[0_8px_32px_rgba(20,17,15,0.12)]" : ""
        }`}
      >
        {/* Logo */}
        <a
          href="#hero"
          className="flex items-center gap-2 px-3 py-1.5 text-white"
          aria-label="Abhigna Constructions"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white/85 text-zinc-900">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path
                d="M4 11.5L12 4l8 7.5V20a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-8.5z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Abhigna
          </span>
        </a>

        {/* Center pill with links */}
        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/25 bg-white/10 px-1.5 py-1.5 text-sm text-white backdrop-blur-md md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="rounded-full px-3.5 py-1.5 transition-colors duration-300 hover:bg-white/20"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right cluster */}
        <div className="flex items-center gap-1.5">
          <a
            href="https://instagram.com"
            aria-label="Instagram"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white transition hover:bg-white/20 sm:flex"
          >
            <FiInstagram size={15} />
          </a>
          <a
            href="https://linkedin.com"
            aria-label="LinkedIn"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white transition hover:bg-white/20 sm:flex"
          >
            <FiLinkedin size={15} />
          </a>
          <a
            href="https://twitter.com"
            aria-label="Twitter"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white transition hover:bg-white/20 sm:flex"
          >
            <FiTwitter size={15} />
          </a>
          <a
            href="tel:+919663763333"
            className="flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-medium text-zinc-900 shadow-sm transition hover:bg-white"
          >
            <FiPhone size={13} />
            <span>+91 96637 63333</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
