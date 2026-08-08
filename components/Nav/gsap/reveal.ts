"use client";

import { gsap } from "gsap";
import { NAV_EASE } from "./easings";

/**
 * Awwwards-style layered reveal for the navigation overlay.
 *
 *   1. CSS transition handles the SHEET panels (base + warm + building).
 *      They slide up/down via a CSS transition on `transform` (or
 *      clip-path for the building wipe).
 *
 *   2. GSAP handles the CONTENT choreography. Two separate timelines
 *      so the OPEN and CLOSE visibly mirror each other:
 *      - openTimeline:  fromTo({hidden}, {visible}) — content rises and
 *                       fades in.
 *      - closeTimeline: fromTo({visible}, {hidden}) — content drops
 *                       and fades out, with an explicit stage that
 *                       animates the inverse motion.
 */

export type RevealTargets = {
  panel: HTMLElement | null;
  base: HTMLElement | null;
  warm: HTMLElement | null;
  film: HTMLElement | null;
  building: HTMLElement | null;
  vlines: HTMLElement | null;
  rows: HTMLElement[];
  rowWords: HTMLElement[];
  rail: HTMLElement | null;
  railItems: HTMLElement[];
  tag: HTMLElement | null;
  meta: HTMLElement | null;
  dockMark: HTMLElement | null;
};

const ROW_STAGGER = 0.05;
const ROW_DURATION = 0.55;

/**
 * Switch the CSS transition state on the sheets. Called from the
 * component via React state, not from a tween.
 */
export const applySheetState = (
  targets: Pick<RevealTargets, "base" | "warm" | "film" | "building" | "vlines">,
  open: boolean,
): void => {
  const sheets = [targets.base, targets.warm].filter(Boolean) as HTMLElement[];
  sheets.forEach((el) => {
    el.style.transition = "transform 0.85s cubic-bezier(0.83, 0, 0.17, 1)";
    el.style.transform = open ? "translateY(0%)" : "translateY(-101%)";
  });

  if (targets.film) {
    targets.film.style.transition =
      "opacity 0.7s cubic-bezier(0.45, 0, 0.15, 1) 0.18s, transform 0.7s cubic-bezier(0.45, 0, 0.15, 1) 0.18s";
    targets.film.style.transform = open ? "translateY(0%)" : "translateY(4%)";
    targets.film.style.opacity = open ? "1" : "0";
  }

  if (targets.building) {
    // Wipe reveal: clip from the right side inward, then back out.
    targets.building.style.transition =
      "clip-path 0.95s cubic-bezier(0.83, 0, 0.17, 1) 0.22s";
    targets.building.style.clipPath = open
      ? "inset(0 0 0 0)"
      : "inset(0 100% 0 0)";
  }

  if (targets.vlines) {
    targets.vlines.style.transition =
      "opacity 0.6s ease 0.45s";
    targets.vlines.style.opacity = open ? "1" : "0";
  }
};

/**
 * Build the OPEN timeline. Content rises and fades in.
 */
export const buildOpenTimeline = (
  targets: RevealTargets,
): gsap.core.Timeline => {
  const tl = gsap.timeline({ paused: true });

  if (targets.dockMark) {
    tl.fromTo(
      targets.dockMark,
      { autoAlpha: 0, scale: 0.6 },
      { autoAlpha: 1, scale: 1, duration: 0.5, ease: NAV_EASE.softIn },
      0.05,
    );
  }

  if (targets.rail) {
    tl.fromTo(
      targets.rail,
      { autoAlpha: 0, x: -12 },
      { autoAlpha: 1, x: 0, duration: 0.55, ease: NAV_EASE.softIn },
      0.1,
    );
  }

  if (targets.railItems.length > 0) {
    tl.fromTo(
      targets.railItems,
      { autoAlpha: 0, y: -6 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: NAV_EASE.softIn,
      },
      0.2,
    );
  }

  if (targets.rows.length > 0) {
    tl.fromTo(
      targets.rows,
      { autoAlpha: 0, yPercent: 60 },
      {
        autoAlpha: 1,
        yPercent: 0,
        duration: ROW_DURATION,
        stagger: ROW_STAGGER,
        ease: NAV_EASE.row,
      },
      0.25,
    );
  }

  if (targets.rowWords.length > 0) {
    tl.fromTo(
      targets.rowWords,
      { autoAlpha: 0, yPercent: 110 },
      {
        autoAlpha: 1,
        yPercent: 0,
        duration: 0.7,
        stagger: 0.04,
        ease: NAV_EASE.row,
      },
      0.4,
    );
  }

  if (targets.tag) {
    tl.fromTo(
      targets.tag,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.55, ease: NAV_EASE.softIn },
      0.7,
    );
  }

  if (targets.meta) {
    tl.fromTo(
      targets.meta,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.55, ease: NAV_EASE.softIn },
      0.8,
    );
  }

  return tl;
};

/**
 * Build a CLOSE timeline that explicitly animates content out — NOT
 * a reverse of the open timeline.
 */
export const buildCloseTimeline = (
  targets: RevealTargets,
): gsap.core.Timeline => {
  const tl = gsap.timeline({ paused: true });

  if (targets.meta) {
    tl.to(
      targets.meta,
      { autoAlpha: 0, y: 12, duration: 0.35, ease: NAV_EASE.softIn },
      0,
    );
  }

  if (targets.tag) {
    tl.to(
      targets.tag,
      { autoAlpha: 0, y: 8, duration: 0.35, ease: NAV_EASE.softIn },
      0.02,
    );
  }

  if (targets.rowWords.length > 0) {
    tl.to(
      targets.rowWords,
      {
        autoAlpha: 0,
        yPercent: 110,
        duration: 0.4,
        stagger: 0.025,
        ease: NAV_EASE.row,
      },
      0.05,
    );
  }

  if (targets.rows.length > 0) {
    tl.to(
      targets.rows,
      {
        autoAlpha: 0,
        yPercent: 60,
        duration: ROW_DURATION * 0.7,
        stagger: ROW_STAGGER,
        ease: NAV_EASE.row,
      },
      0.1,
    );
  }

  if (targets.railItems.length > 0) {
    tl.to(
      targets.railItems,
      { autoAlpha: 0, y: -6, duration: 0.3, stagger: 0.03, ease: NAV_EASE.softIn },
      0.15,
    );
  }

  if (targets.rail) {
    tl.to(
      targets.rail,
      { autoAlpha: 0, x: -12, duration: 0.35, ease: NAV_EASE.softIn },
      0.18,
    );
  }

  if (targets.dockMark) {
    tl.to(
      targets.dockMark,
      { autoAlpha: 0, scale: 0.6, duration: 0.35, ease: NAV_EASE.softIn },
      0.2,
    );
  }

  return tl;
};

/**
 * `play().reverse()` shim — kept for backwards compat with the old
 * overlay. Prefer `buildCloseTimeline` for new code.
 */
export const closeTimeline = (
  timeline: gsap.core.Timeline,
): gsap.core.Timeline => {
  timeline.timeScale(1.2);
  timeline.play().reverse();
  return timeline;
};
