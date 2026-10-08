"use client";

import { type RefObject, useEffect, useRef } from "react";
import Link from "next/link";
import NavMenuHamburger from "./NavMenuHamburger";
import { ensureGsapPlugins } from "./gsap/easings";
import { bindScrollDock } from "./gsap/scrollDock";

export type NavDockProps = {
  open: boolean;
  onToggle: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

/**
 * Top-bar navigation.
 *
 *   - Logo on the FAR LEFT, without a background or container.
 *   - Hamburger on the FAR RIGHT — round glass control.
 *   - Single row, vertically centered via items-center.
 *
 * The hamburger is the single open/close control. The brand mark is a
 * link back to the top of the page. The bar is `position: fixed` at
 * the top of the viewport; the document flow never has to reserve a
 * navbar gap.
 */
export default function NavDock({
  open,
  onToggle,
  triggerRef,
}: NavDockProps) {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!barRef.current) return;
    ensureGsapPlugins();
    return bindScrollDock(barRef.current, {
      start: 80,
      lift: 4,
      scale: 0.98,
      restSeconds: 0.55,
    });
  }, []);

  return (
    <div
      className="
        pointer-events-none fixed inset-x-0 top-0 z-50
        flex items-center justify-between
        px-5 py-3 sm:px-8 sm:py-4 md:px-10 md:py-4
      "
    >
      {/* Transparent wordmark with no backing or visual effect. */}
      <Link
        href="/#hero"
        aria-label="Abhigna Constructions — back to top"
        className="pointer-events-auto inline-flex items-center"
        onClick={(event) => {
          if (open) {
            event.preventDefault();
            onToggle();
          }
        }}
      >
        <img
          src="/abhigna-logo.png"
          alt="Abhigna Constructions"
          className="
            block w-auto object-contain
            h-[42px] sm:h-[50px] md:h-[58px]
          "
          style={{
            filter: open
              ? "brightness(0) invert(0.96)"
              : "none",
            transition: "filter 0.4s ease",
          }}
        />
      </Link>

      {/* FAR RIGHT — hamburger (single control, vertically centered) */}
      <div
        ref={barRef}
        style={{ transformOrigin: "100% 50%", willChange: "transform" }}
        data-state={open ? "open" : "closed"}
        className="pointer-events-auto flex items-center"
      >
        <NavMenuHamburger
          ref={triggerRef}
          open={open}
          onToggle={onToggle}
          controlsId="abg-nav-menu"
        />
      </div>
    </div>
  );
}
