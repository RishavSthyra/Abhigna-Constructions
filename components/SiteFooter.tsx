import Link from "next/link";
import { FiInstagram } from "react-icons/fi";

/**
 * Shared footer. Used by both the homepage and the About page so the
 * site feels consistent.
 */
const FOOTER_NAV = [
  { label: "Projects", href: "/#listings" },
  { label: "Services", href: "/about" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "mailto:sales@abhignaconstructions.com" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-brand-line bg-brand-bg">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-12 lg:px-16">
        <div className="flex items-center gap-6">
          <Link href="/" className="shrink-0" aria-label="Abhigna Constructions">
            <img
              src="/abhigna-logo.png"
              alt="Abhigna Constructions"
              className="block h-6 w-auto object-contain md:h-7"
            />
          </Link>
          <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">
            © 2026 Abhigna Constructions. All rights reserved.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-6">
            {FOOTER_NAV.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-[10px] uppercase tracking-[0.28em] text-zinc-700 transition hover:text-zinc-900"
                  data-cursor="image"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="mailto:sales@abhignaconstructions.com"
            className="text-[10px] uppercase tracking-[0.28em] text-zinc-700 transition hover:text-zinc-900"
            data-cursor="image"
          >
            sales@abhignaconstructions.com
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="text-zinc-700 transition hover:text-zinc-900"
            data-cursor="image"
          >
            <FiInstagram size={16} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </footer>
  );
}
