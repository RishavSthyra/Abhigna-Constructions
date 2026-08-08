"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scroll-driven dock motion.
 *
 * The bottom dock shrinks while the user scrolls, gains a bit more blur
 * opacity, lifts ~10 px off the bottom edge, and then settles back when
 * scrolling pauses. Driven by a ScrollTrigger whose scrub is tweaked so
 * the motion feels intentional rather than tied 1:1 to scroll velocity.
 */

export type DockScrollOptions = {
  /** Top distance from the page (in px) at which the dock begins to shrink. */
  start?: number;
  /** Y-translation in px while scrolling. Default 10. */
  lift?: number;
  /** Scale factor while scrolling. Default 0.94. */
  scale?: number;
  /** Easing curve for the relax-back. Default "power3.out". */
  ease?: string;
  /** Time to ease back to rest after scrolling ends. */
  restSeconds?: number;
};

const DEFAULTS = {
  start: 80,
  lift: 10,
  scale: 0.96,
  ease: "power3.out",
  restSeconds: 0.55,
};

/**
 * Bind scroll behavior to a dock element.
 * Returns a cleanup function that kills all GSAP work on unmount.
 */
export const bindScrollDock = (
  dock: HTMLElement,
  options: DockScrollOptions = {},
): (() => void) => {
  const cfg = { ...DEFAULTS, ...options };
  const veil = dock.querySelector<HTMLElement>("[data-dock-veil]");
  const hint = dock.querySelector<HTMLElement>("[data-dock-hint]");

  const applyScrolled = () => {
    gsap.to(dock, {
      y: -cfg.lift,
      scale: cfg.scale,
      duration: 0.45,
      ease: cfg.ease,
    });
    if (veil) {
      gsap.to(veil, {
        autoAlpha: 0.78,
        duration: 0.45,
        ease: cfg.ease,
      });
    }
    if (hint) {
      gsap.to(hint, {
        autoAlpha: 0.35,
        duration: 0.45,
        ease: cfg.ease,
      });
    }
  };

  const applyRest = () => {
    gsap.to(dock, {
      y: 0,
      scale: 1,
      duration: cfg.restSeconds,
      ease: cfg.ease,
    });
    if (veil) {
      gsap.to(veil, {
        autoAlpha: 0,
        duration: cfg.restSeconds,
        ease: cfg.ease,
      });
    }
    if (hint) {
      gsap.to(hint, {
        autoAlpha: 0,
        duration: cfg.restSeconds,
        ease: cfg.ease,
      });
    }
  };

  const refreshState = () => {
    if (window.scrollY > cfg.start) {
      applyScrolled();
      return;
    }
    applyRest();
  };

  // ScrollTrigger gives us low-jitter scroll lifecycle hooks while the
  // tweens themselves stay transform/opacity-only for smooth motion.
  const trigger = ScrollTrigger.create({
    trigger: document.documentElement,
    start: 0,
    end: "max",
    onUpdate: refreshState,
  });

  const handleScrollStart = () => {
    if (window.scrollY > cfg.start) {
      applyScrolled();
    }
  };
  const handleScrollEnd = () => {
    refreshState();
  };

  ScrollTrigger.addEventListener("scrollStart", handleScrollStart);
  ScrollTrigger.addEventListener("scrollEnd", handleScrollEnd);
  refreshState();

  return () => {
    ScrollTrigger.removeEventListener("scrollStart", handleScrollStart);
    ScrollTrigger.removeEventListener("scrollEnd", handleScrollEnd);
    trigger.kill();
    gsap.killTweensOf([dock, veil, hint]);
  };
};
