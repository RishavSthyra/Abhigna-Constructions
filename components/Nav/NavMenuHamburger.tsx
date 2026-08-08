"use client";

import { forwardRef } from "react";

/**
 * Custom Awwwards-style hamburger / close icon.
 *
 * Two quarter-circle arcs (an "open" parenthesis on top, a "closed"
 * parenthesis on bottom). On open, they rotate 180° apart to form a
 * full closed cross / plus shape.
 *
 * Solid color background, no glass, no border — a clean colored disk.
 *
 * Implementation: inline SVG with two `<path>` arcs. A small `useEffect`
 * applies CSS transitions on `transform` to spin the arcs.
 */

export type NavMenuHamburgerProps = {
  open: boolean;
  onToggle: () => void;
  controlsId?: string;
};

const NavMenuHamburger = forwardRef<HTMLButtonElement, NavMenuHamburgerProps>(
  function NavMenuHamburger({ open, onToggle, controlsId }, ref) {
    // The two arcs: top arc opens to the right (open state rotates -90°),
    // bottom arc opens to the left (open state rotates +90°). They meet
    // in the middle to form a + sign when the menu is open.
    const arcTransform = open
      ? "rotate(-90deg)"
      : "rotate(0deg)";
    const arcTransformReverse = open
      ? "rotate(90deg)"
      : "rotate(0deg)";

    return (
      <button
        ref={ref}
        type="button"
        onClick={onToggle}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={controlsId}
        className="
          group relative grid h-14 w-14 place-items-center rounded-full
          transition-transform duration-500 hover:scale-[1.04]
        "
        style={{
          backgroundColor: open ? "transparent" : "#14110f",
          border: open ? "1px solid rgba(245, 236, 223, 0.45)" : "1px solid transparent",
          boxShadow: open ? "none" : "0 6px 20px -8px rgba(20,17,15,0.55)",
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          aria-hidden
          className="overflow-visible"
        >
          {/* Top arc — rotates -90° on open to form top-right quadrant of a + */}
          <path
            d="M 11 3 A 8 8 0 0 1 19 11"
            stroke="#f5ecdf"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
            style={{
              transformOrigin: "11px 11px",
              transform: arcTransform,
              transition: "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
          {/* Bottom arc — rotates +90° on open to form bottom-left quadrant */}
          <path
            d="M 11 19 A 8 8 0 0 1 3 11"
            stroke="#f5ecdf"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
            style={{
              transformOrigin: "11px 11px",
              transform: arcTransformReverse,
              transition: "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </svg>
      </button>
    );
  },
);

export default NavMenuHamburger;
