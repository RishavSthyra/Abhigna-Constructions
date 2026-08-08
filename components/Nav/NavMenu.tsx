"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import NavMenuItem from "./NavMenuItem";
import { ensureGsapPlugins } from "./gsap/easings";
import {
  buildOpenTimeline,
  buildCloseTimeline,
  applySheetState,
  type RevealTargets,
} from "./gsap/reveal";

export type NavMenuProps = {
  open: boolean;
  onClose: () => void;
};

/** Same nav items as before — routed to the real pages where possible. */
const NAV_ROWS = [
  { label: "Home", href: "/" },
  { label: "Apartments", href: "/#listings" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const PROJECT_SUBMENU = [
  { label: "Abhigna Misty Woods", href: "/#listings" },
  { label: "Aadhya Serene", href: "/#listings" },
  { label: "SRC Opulent Bluebells", href: "/#listings" },
];

/**
 * Fullscreen overlay menu — redesigned to match the ChatGPT reference.
 *
 * Layout (CSS grid, two columns on >=md):
 *
 *   ┌─────────────────────┬──────────────────────────┐
 *   │ menu items          │ (image bg) + tag         │
 *   │                     │                          │
 *   │ HOME                │                          │
 *   │ APARTMENTS          │                          │
 *   │ MASTERPLAN          │                          │
 *   │ GALLERY             │  ── BUILDING ───         │
 *   │ ABOUT US            │  ── THE FUTURE ──        │
 *   └─────────────────────┴──────────────────────────┘
 *   [● dock mark]    [location · phone · email]
 *
 * Sheets (CSS-driven):
 *   1. base    — near-opaque ink backdrop
 *   2. warm    — translucent ink gradient
 *   3. film    — soft radial + thin vertical-line pattern
 *   4. building— holds the AVIF, wipes in from the right
 *   5. vlines  — vertical light lines, fades in late
 *
 * The dock's hamburger (z-50) overlays this panel (z-40), so the same
 * control toggles open and closed.
 */
export default function NavMenu({ open, onClose }: NavMenuProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const baseRef = useRef<HTMLDivElement | null>(null);
  const warmRef = useRef<HTMLDivElement | null>(null);
  const filmRef = useRef<HTMLDivElement | null>(null);
  const buildingRef = useRef<HTMLDivElement | null>(null);
  const vlinesRef = useRef<HTMLDivElement | null>(null);
  const tagRef = useRef<HTMLDivElement | null>(null);
  const metaRef = useRef<HTMLDivElement | null>(null);
  const dockMarkRef = useRef<HTMLDivElement | null>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const pendingNavigationRef = useRef<string | null>(null);
  const [projectsOpen, setProjectsOpen] = useState(false);

  useEffect(() => {
    ensureGsapPlugins();
  }, []);

  const trapFocus = (event: KeyboardEvent) => {
    if (!rootRef.current) return;
    const focusables = rootRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      last.focus();
      event.preventDefault();
    } else if (!event.shiftKey && document.activeElement === last) {
      first.focus();
      event.preventDefault();
    }
  };

  const handleNavigate = (href: string) => {
    pendingNavigationRef.current = href;
    setProjectsOpen(false);
    onClose();
  };

  // Sheets are CSS-transitioned (not GSAP) so the dark backdrop lands
  // guaranteed — no GSAP race conditions. GSAP handles content
  // choreography on top.
  useEffect(() => {
    applySheetState(
      {
        base: baseRef.current,
        warm: warmRef.current,
        film: filmRef.current,
        building: buildingRef.current,
        vlines: vlinesRef.current,
      },
      open,
    );
  }, [open]);

  // Build a fresh GSAP content timeline every time `open` flips.
  useEffect(() => {
    if (!baseRef.current) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    const rowTargets = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>("[data-nav-row]") ?? [],
    );
    const rowWords = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>(
        "[data-nav-row-label]",
      ) ?? [],
    );

    const targets: RevealTargets = {
      panel: rootRef.current,
      base: baseRef.current,
      warm: warmRef.current,
      film: filmRef.current,
      building: buildingRef.current,
      vlines: vlinesRef.current,
      rows: rowTargets,
      rowWords,
      rail: null,
      railItems: [],
      tag: tagRef.current,
      meta: metaRef.current,
      dockMark: dockMarkRef.current,
    };

    if (open) {
      timelineRef.current = buildOpenTimeline(targets);
      timelineRef.current.timeScale(1);
      timelineRef.current.play(0);
      return;
    }

    const close = buildCloseTimeline(targets);
    close.timeScale(1.15);
    close.eventCallback("onComplete", () => {
      timelineRef.current = null;
      setProjectsOpen(false);

      const href = pendingNavigationRef.current;
      pendingNavigationRef.current = null;
      if (!href) return;

      // In-page hash on the current route → smooth scroll to the section.
      if (href.startsWith("#")) {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        return;
      }

      // Real route — let the browser navigate so Next.js can do its
      // client-side transition (the menu is already closed).
      window.location.assign(href);
    });
    close.play(0);
    timelineRef.current = close;
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "Tab") {
        trapFocus(event);
      }
    };

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);

    requestAnimationFrame(() => {
      rootRef.current
        ?.querySelector<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        ?.focus();
    });

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={rootRef}
      id="abg-nav-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      aria-hidden={!open}
      className={`fixed inset-0 z-40 ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{
        opacity: open ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
    >
      {/* Sheet 1 — base ink (almost opaque) */}
      <div
        ref={baseRef}
        aria-hidden
        className="absolute inset-x-0 top-0 h-full will-change-transform"
        style={{
          transform: "translateY(-101%)",
          background: "rgba(8, 8, 10, 0.92)",
        }}
      />

      {/* Sheet 2 — neutral overlay */}
      <div
        ref={warmRef}
        aria-hidden
        className="absolute inset-x-0 top-0 h-full will-change-transform"
        style={{
          transform: "translateY(-101%)",
          background:
            "linear-gradient(180deg, rgba(20, 20, 22, 0.55) 0%, rgba(10, 10, 12, 0.7) 50%, rgba(5, 5, 6, 0.85) 100%)",
        }}
      />

      {/* Sheet 3 — film (radial + thin vertical pattern) */}
      <div
        ref={filmRef}
        aria-hidden
        className="absolute inset-0 will-change-transform"
        style={{
          opacity: 0,
          background:
            "radial-gradient(ellipse at 80% 40%, rgba(80, 80, 80, 0.18) 0%, transparent 60%)",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05] mix-blend-screen"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 96px)",
          }}
        />
      </div>

      {/* Sheet 4 — building image as a GLOBAL background, edge to edge */}
      <div
        ref={buildingRef}
        aria-hidden
        className="absolute inset-0 hidden md:block will-change-[clip-path]"
        style={{
          clipPath: "inset(0 100% 0 0)",
        }}
      >
        {/* Heavy left-to-right veil so the building sits on the right
            and fades into the dark backdrop on the left, where the
            menu items live. */}
        <div
          aria-hidden
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(8,8,10,0.95) 0%, rgba(8,8,10,0.85) 35%, rgba(8,8,10,0.4) 60%, transparent 80%)",
          }}
        />
        {/* Top + bottom vignettes to settle the image into the nav */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 z-10 h-32"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,8,10,0.55) 0%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-10 h-40"
          style={{
            background:
              "linear-gradient(0deg, rgba(8,8,10,0.7) 0%, transparent 100%)",
          }}
        />
        <img
          src="/nav-building.avif"
          alt=""
          aria-hidden
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover object-center select-none"
        />
      </div>

      {/* Vertical light lines — edge-to-edge, evenly spaced, ~10%
          opacity gray. Wide gaps so they read as a quiet frame, not a
          grid. */}
      <div
        ref={vlinesRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden md:flex md:justify-between opacity-0"
        style={{ padding: "0 5vw" }}
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className="block h-full w-px"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(220, 220, 220, 0.10) 15%, rgba(220, 220, 220, 0.10) 85%, transparent 100%)",
            }}
          />
        ))}
      </div>

      {/* Content stack */}
      <div
        className="
          relative z-10 flex h-full w-full flex-col
          px-5 pt-20 pb-32
          sm:px-8 sm:pt-24
          md:px-10 md:pt-24 md:pb-24
          lg:px-14
        "
      >
        <div className="mx-auto grid h-full w-full max-w-[1400px] grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 md:gap-10">
          {/* Menu items — left column */}
          <nav className="relative flex flex-col justify-center md:pt-2">
            <ul className="flex flex-col gap-1 md:gap-2">
              {NAV_ROWS.map((row) => (
                <li key={row.label}>
                  <NavMenuItem
                    label={row.label}
                    href={row.href}
                    onNavigate={handleNavigate}
                    submenuItems={
                      row.label === "Apartments" ? PROJECT_SUBMENU : undefined
                    }
                    submenuOpen={
                      row.label === "Apartments" ? projectsOpen : false
                    }
                    onToggleSubmenu={
                      row.label === "Apartments"
                        ? () => setProjectsOpen((current) => !current)
                        : undefined
                    }
                  />
                </li>
              ))}
            </ul>
          </nav>

          {/* Right column — building image tag (the image itself is in
              its own sheet) */}
          <div className="relative hidden md:flex md:flex-col md:justify-end md:items-end md:pt-4">
            <div ref={tagRef} className="text-right" style={{ opacity: 0 }}>
              <div className="mb-3 ml-auto h-px w-10 bg-[#e5e7eb]/40" />
              <span className="block font-mono text-[10px] uppercase tracking-[0.36em] text-[#e5e7eb]/75">
                Building
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.36em] text-[#e5e7eb]/45">
                the Future
              </span>
              <div className="mt-3 ml-auto h-px w-6 bg-[#e5e7eb]/30" />
            </div>
          </div>
        </div>

        {/* Bottom dock — small circular logo mark (left) + meta strip (right) */}
        <div className="mx-auto mt-6 flex w-full max-w-[1400px] items-end justify-between gap-4">
          <div
            ref={dockMarkRef}
            className="
              inline-flex h-10 w-10 items-center justify-center
              rounded-full border border-[#e5e7eb]/35 bg-transparent
              font-display text-[14px] font-[600] text-[#e5e7eb]/85
            "
            style={{ opacity: 0 }}
            aria-label="Abhigna mark"
          >
            A
          </div>

          <div
            ref={metaRef}
            className="
              flex flex-1 flex-col gap-3 border-t border-[#e5e7eb]/10 pt-5
              text-[#e5e7eb]/55 sm:flex-row sm:items-center sm:justify-end
              sm:gap-8
            "
            style={{ opacity: 0 }}
          >
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em]">
              <FiMapPin className="h-3.5 w-3.5 stroke-[1.5]" aria-hidden />
              HSR Layout, Sector 4 · BLR
            </span>
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em]">
              <FiPhone className="h-3.5 w-3.5 stroke-[1.5]" aria-hidden />
              +91 96637 63333
            </span>
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em]">
              <FiMail className="h-3.5 w-3.5 stroke-[1.5]" aria-hidden />
              sales@abhignaconstructions.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { NAV_ROWS };
