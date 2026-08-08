"use client";

import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * Cinematic easing curves used by the nav reveal timeline.
 *
 * Define once via CustomEase so every timeline can re-use the same names
 * — and so `power4.out` never has to fight the infinite ease-soup that GSAP
 * ships with. These map directly to the kind of motion Locomotive / Obys
 * / Cuberto tend to use: short dramatic acceleration, long graceful
 * release.
 */
export const NAV_EASE = {
  /** Curtain-drop — quick start, confident slow landing. */
  curtain: "nav.curtain",
  /** Soft settle for content rows. */
  softIn: "nav.softIn",
  /** Row reveal — slower in, slower out. */
  row: "nav.row",
  /** Texture / vellum layer — gentle. */
  textureIn: "nav.textureIn",
  /** Default micro-interaction: quiet, never bouncy. */
  microSoft: "nav.microSoft",
  /** Magnetic pull — slightly accel + easeout for a felt weight. */
  magnetic: "nav.magnetic",
};

let registered = false;

export const registerNavEasings = (): void => {
  if (registered) return;
  registered = true;

  // CustomEase is a plugin, not core — must be explicitly registered or
  // GSAP throws "Please gsap.registerPlugin(CustomEase)" at runtime.
  gsap.registerPlugin(CustomEase);

  CustomEase.create(NAV_EASE.curtain, "0.83, 0, 0.17, 1");
  CustomEase.create(NAV_EASE.softIn, "0.25, 0.46, 0.45, 0.94");
  CustomEase.create(NAV_EASE.row, "0.22, 1, 0.36, 1");
  CustomEase.create(NAV_EASE.textureIn, "0.45, 0, 0.15, 1");
  CustomEase.create(NAV_EASE.microSoft, "0.40, 0.00, 0.20, 1.00");
  CustomEase.create(NAV_EASE.magnetic, "0.12, 0.92, 0.30, 1.00");
};

export const ensureGsapPlugins = (): void => {
  // Register the full nav animation stack once so every component can
  // assume the premium motion primitives are available.
  if (!registered) {
    gsap.registerPlugin(CustomEase, ScrollTrigger, Flip, SplitText);
  }
  registerNavEasings();
};

/** Forces GSAP to flush transforms — handy during dev / hot reload. */
export const resetNavTweens = (scope: gsap.DOMTarget): void => {
  gsap.set(scope, { clearProps: "transform,opacity" });
};
