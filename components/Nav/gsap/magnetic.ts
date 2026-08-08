"use client";

import { gsap } from "gsap";

/**
 * Mouse-magnetic micro-interactions.
 *
 * Each magnetic element translates toward the cursor proportional to the
 * vector from its centroid. The translate is small (< 12 px) and bounded
 * via a damped ease so the element never overshoots or sticks to the
 * pointer. Pure transform — never animates layout.
 */

export type MagneticOptions = {
  /** Translation factor (0–1). 1 = the element follows 100 % of the cursor delta. */
  strength?: number;
  /** Maximum pixel translation per axis. */
  max?: number;
  /** Easing function name or TweenVars easing. Defaults to "power3.out". */
  ease?: gsap.EaseFunction | string;
  /** Duration of the relax-back tween when the pointer leaves. */
  restDuration?: number;
};

const DEFAULTS: Required<MagneticOptions> = {
  strength: 0.28,
  max: 10,
  ease: "power3.out",
  restDuration: 0.55,
};

export const attachMagnetic = (
  el: HTMLElement,
  options: MagneticOptions = {},
): (() => void) => {
  const { strength, max, ease, restDuration } = { ...DEFAULTS, ...options };
  const quickSet = gsap.quickSetter(el, "x", "px");
  const quickSetY = gsap.quickSetter(el, "y", "px");

  let frame = 0;

  const handleMove = (event: MouseEvent) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (event.clientX - cx) * strength;
    const dy = (event.clientY - cy) * strength;
    const clampedX = Math.max(-max, Math.min(max, dx));
    const clampedY = Math.max(-max, Math.min(max, dy));
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      quickSet(clampedX);
      quickSetY(clampedY);
    });
  };

  const handleLeave = () => {
    cancelAnimationFrame(frame);
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: restDuration,
      ease,
    });
  };

  el.addEventListener("mousemove", handleMove);
  el.addEventListener("mouseleave", handleLeave);

  // Make the wrapper participate in transforms rather than the pseudo
  // inheritance from the parent nav layer.
  el.style.willChange = "transform";

  return () => {
    cancelAnimationFrame(frame);
    el.removeEventListener("mousemove", handleMove);
    el.removeEventListener("mouseleave", handleLeave);
  };
};
