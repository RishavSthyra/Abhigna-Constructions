"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NAV_EASE, ensureGsapPlugins } from "@/components/Nav/gsap/easings";

/**
 * ScrollMotion — single page-level GSAP driver.
 *
 * Mounted once on the homepage. Walks the DOM for `data-reveal`,
 * `data-split-text`, and `data-parallax` attributes and wires each
 * one to a ScrollTrigger. Reduced-motion users get a no-op.
 *
 * - `data-reveal`           → fade-up on enter, once
 * - `data-reveal="stagger"` → fade-up + 0.08s stagger against its
 *                              immediate siblings carrying the same attr
 * - `data-split-text`       → headline words reveal word-by-word
 * - `data-parallax`         → background image / inner div moves
 *                              -10% → +10% of its own height as the
 *                              trigger traverses the viewport
 *
 * All triggers use `once: true` so the page feels deliberate, not
 * twitchy on scroll-back.
 */
export default function ScrollMotion() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduce) {
      // Just reveal everything immediately.
      gsap.set("[data-reveal], [data-split-text]", {
        autoAlpha: 1,
        y: 0,
      });
      return;
    }

    ensureGsapPlugins();

    const triggers: ScrollTrigger[] = [];

    // ── 1. data-reveal (single) ────────────────────────────────────────
    const singleReveals = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-reveal]:not([data-reveal='stagger'])",
      ),
    );
    singleReveals.forEach((el) => {
      // Mark the element so we can re-trigger on scroll-back if needed.
      gsap.set(el, { autoAlpha: 0, y: 80, scale: 0.96 });
      triggers.push(
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: NAV_EASE.softIn,
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            end: "top 60%",
            toggleActions: "play none none none",
          },
        }).scrollTrigger!,
      );
    });

    // ── 2. data-reveal="stagger" ───────────────────────────────────────
    const staggerGroups = new Map<
      HTMLElement,
      HTMLElement[]
    >();
    document
      .querySelectorAll<HTMLElement>("[data-reveal='stagger']")
      .forEach((el) => {
        // Group by parent — siblings reveal together.
        const parent = el.parentElement ?? document.body;
        if (!staggerGroups.has(parent)) staggerGroups.set(parent, []);
        staggerGroups.get(parent)!.push(el);
      });

    staggerGroups.forEach((siblings) => {
      gsap.set(siblings, { autoAlpha: 0, y: 60 });
      triggers.push(
        gsap.to(siblings, {
          autoAlpha: 1,
          y: 0,
          duration: 1.0,
          ease: NAV_EASE.softIn,
          stagger: 0.12,
          scrollTrigger: {
            trigger: siblings[0],
            start: "top 92%",
            toggleActions: "play none none none",
          },
        }).scrollTrigger!,
      );
    });

    // ── 3. data-split-text ─────────────────────────────────────────────
    const splitEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-split-text]"),
    );
    splitEls.forEach((el) => {
      const text = el.textContent ?? "";
      const words = text.split(/(\s+)/); // keep whitespace
      el.textContent = "";
      const wordSpans: HTMLSpanElement[] = [];
      words.forEach((segment) => {
        if (/^\s+$/.test(segment)) {
          el.appendChild(document.createTextNode(segment));
          return;
        }
        const wrap = document.createElement("span");
        wrap.className = "inline-block overflow-hidden align-baseline";
        wrap.style.paddingTop = "0.12em";
        wrap.style.paddingBottom = "0.12em";
        wrap.style.marginTop = "-0.12em";
        wrap.style.marginBottom = "-0.12em";
        const inner = document.createElement("span");
        inner.className = "inline-block will-change-transform";
        inner.setAttribute("data-split-word", "");
        inner.textContent = segment;
        wrap.appendChild(inner);
        el.appendChild(wrap);
        wordSpans.push(inner);
      });

      gsap.set(wordSpans, { yPercent: 110, autoAlpha: 0 });

      triggers.push(
        gsap.to(wordSpans, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1.0,
          ease: NAV_EASE.softIn,
          stagger: 0.06,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }).scrollTrigger!,
      );
    });

    // ── 4. data-parallax ───────────────────────────────────────────────
    const parallaxEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]"),
    );
    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax ?? "0.20");
      gsap.fromTo(
        el,
        { yPercent: -speed * 100, scale: 1.08 },
        {
          yPercent: speed * 100,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );
    });

    return () => {
      triggers.forEach((t) => t.kill());
      // Kill any leftover ScrollTriggers created by this component.
      ScrollTrigger.getAll()
        .filter((t) => !t.pin)
        .forEach((t) => t.kill());
    };
  }, []);

  return null;
}
