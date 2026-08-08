"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FiPlus } from "react-icons/fi";
import { NAV_EASE } from "./gsap/easings";

export type NavMenuItemProps = {
  label: string;
  href: string;
  onNavigate: (href: string) => void;
  submenuItems?: Array<{
    label: string;
    href: string;
  }>;
  submenuOpen?: boolean;
  onToggleSubmenu?: () => void;
};

/**
 * Editorial menu row — premium, with a per-letter wave hover.
 *
 * Layout for the label:
 *   ┌────────────────────────────────────────┐
 *   │  [clipped front]   [clipped back]      │
 *   │  H E L L O          H E L L O         │   <- both layers same width
 *   │  (idle, dim)        (hidden below)    │
 *   │                     slides UP on hover│
 *   └────────────────────────────────────────┘
 *
 * On hover:
 *   - Front letters slide UP out of their clip (y: -100%)
 *   - Back letters slide UP into their clip (y: 100% -> 0)
 *   - The two clip windows overlap exactly, so visually the letter is
 *     "replaced" by itself from below in a stagger — a confident wave.
 *
 * No underline — the wave replaces it. No right-side sub-text. The row
 * does not translate on hover (no magnetic pull) so the layout stays
 * rock-steady under the cursor.
 *
 * Optional submenu (Apartments → project list) folds open under the row.
 */
export default function NavMenuItem({
  label,
  href,
  onNavigate,
  submenuItems = [],
  submenuOpen = false,
  onToggleSubmenu,
}: NavMenuItemProps) {
  const submenuRef = useRef<HTMLDivElement | null>(null);
  const caretRef = useRef<HTMLSpanElement | null>(null);
  const frontRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const backRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [hovered, setHovered] = useState(false);

  // Submenu open/close animation.
  useEffect(() => {
    if (!submenuRef.current) return;

    gsap.to(submenuRef.current, {
      height: submenuOpen ? "auto" : 0,
      autoAlpha: submenuOpen ? 1 : 0,
      duration: submenuOpen ? 0.42 : 0.32,
      ease: submenuOpen ? NAV_EASE.softIn : NAV_EASE.microSoft,
      overwrite: "auto",
    });

    if (caretRef.current) {
      gsap.to(caretRef.current, {
        rotate: submenuOpen ? 45 : 0,
        duration: 0.32,
        ease: NAV_EASE.microSoft,
        overwrite: "auto",
      });
    }
  }, [submenuOpen]);

  // Letter wave on hover.
  useEffect(() => {
    const front = frontRefs.current.filter(Boolean) as HTMLSpanElement[];
    const back = backRefs.current.filter(Boolean) as HTMLSpanElement[];

    if (hovered) {
      // Front letters: slide UP out of view, fade out
      gsap.to(front, {
        yPercent: -100,
        opacity: 0,
        duration: 0.5,
        stagger: 0.028,
        ease: NAV_EASE.row,
        overwrite: true,
      });
      // Back letters: slide UP into view, fade in
      gsap.to(back, {
        yPercent: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.028,
        ease: NAV_EASE.row,
        overwrite: true,
      });
    } else {
      // Reset: front letters back down, back letters back down out of view
      gsap.to(front, {
        yPercent: 0,
        opacity: 1,
        duration: 0.45,
        stagger: 0.022,
        ease: NAV_EASE.row,
        overwrite: true,
      });
      gsap.to(back, {
        yPercent: 100,
        opacity: 0,
        duration: 0.45,
        stagger: 0.022,
        ease: NAV_EASE.row,
        overwrite: true,
      });
    }
  }, [hovered]);

  // Initialize the back letters so they start hidden below their clip.
  useEffect(() => {
    const back = backRefs.current.filter(Boolean) as HTMLSpanElement[];
    gsap.set(back, { yPercent: 100, opacity: 0 });
  }, []);

  const letters = Array.from(label);

  return (
    <div data-nav-row className="text-[#e5e7eb]">
      <div
        className="
          group relative flex items-center justify-between gap-4
          py-4 md:py-5
        "
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Label — anchor + clipped front + clipped back layers */}
        <a
          href={href}
          data-nav-row-label
          onClick={(event) => {
            event.preventDefault();
            onNavigate(href);
          }}
          className="
            relative inline-block font-display uppercase leading-[0.95]
            tracking-[0.02em] font-[400]
            text-[clamp(36px,5vw,68px)]
          "
          aria-label={label}
        >
          {/* Front layer — clipped window showing the idle letters */}
          <span
            aria-hidden
            className="relative inline-flex overflow-hidden align-top"
            style={{ paddingBottom: "0.06em" }}
          >
            {letters.map((char, i) => (
              <span
                key={`front-${i}`}
                ref={(el) => {
                  frontRefs.current[i] = el;
                }}
                className="inline-block"
                style={{
                  willChange: "transform, opacity",
                  color: hovered ? "#e5e7eb" : "rgba(229, 231, 235, 0.55)",
                  transition: "color 0.4s ease",
                }}
              >
                {char === " " ? " " : char}
              </span>
            ))}
          </span>

          {/* Back layer — its own clipped window, positioned
              absolutely ON TOP of the front layer at the same x.
              Letters start at yPercent: 100 (below the clip), slide
              up into the clip on hover. */}
          <span
            aria-hidden
            className="
              pointer-events-none absolute left-0 top-0 inline-flex
              overflow-hidden align-top
            "
            style={{ paddingBottom: "0.06em" }}
          >
            {letters.map((char, i) => (
              <span
                key={`back-${i}`}
                ref={(el) => {
                  backRefs.current[i] = el;
                }}
                className="inline-block"
                style={{
                  willChange: "transform, opacity",
                  color: "#e5e7eb",
                }}
              >
                {char === " " ? " " : char}
              </span>
            ))}
          </span>
        </a>

        {submenuItems.length > 0 && onToggleSubmenu ? (
          <button
            type="button"
            onClick={onToggleSubmenu}
            className="
              inline-flex items-center gap-2 rounded-full
              border border-[#e5e7eb]/20 bg-transparent
              px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em]
              text-[#e5e7eb]/65 transition-colors duration-300
              hover:border-[#e5e7eb]/55 hover:text-[#e5e7eb]
            "
            aria-expanded={submenuOpen}
            aria-label={`${label} project list`}
          >
            <span>Projects</span>
            <span
              ref={caretRef}
              aria-hidden
              className="inline-flex h-3 w-3 items-center justify-center"
            >
              <FiPlus className="h-3 w-3" strokeWidth={1.5} />
            </span>
          </button>
        ) : null}
      </div>

      {submenuItems.length > 0 ? (
        <div
          ref={submenuRef}
          className="h-0 overflow-hidden opacity-0"
        >
          <div className="flex flex-col gap-2 py-3 pl-2">
            {submenuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(item.href);
                }}
                className="
                  font-mono text-[12px] uppercase tracking-[0.22em]
                  text-[#e5e7eb]/55 transition-colors duration-300
                  hover:text-[#e5e7eb]
                "
              >
                — {item.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}