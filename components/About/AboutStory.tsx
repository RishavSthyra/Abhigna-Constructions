"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ensureGsapPlugins } from "@/components/Nav/gsap/easings";
import { FiArrowUpRight } from "react-icons/fi";

type DisplayHeadingProps = {
  as?: "h2" | "h3";
  compactLines: string[];
  wideLines?: [string, string];
  className: string;
};

function DisplayHeading({
  as: Tag = "h2",
  compactLines,
  wideLines,
  className,
}: DisplayHeadingProps) {
  const renderLines = (lines: string[]) =>
    lines.map((line, lineIndex) => (
      <span
        key={`${line}-${lineIndex}`}
        className="block whitespace-nowrap last:-mt-[0.08em]"
      >
        {line.split(" ").map((word, wordIndex, words) => (
          <span
            key={`${word}-${lineIndex}-${wordIndex}`}
            className="inline-block overflow-hidden align-baseline"
            style={{
              paddingTop: "0.08em",
              paddingRight: wordIndex < words.length - 1 ? "0.14em" : "0",
              paddingBottom: "0.16em",
            }}
          >
            <span className="inline-block will-change-transform">{word}</span>
          </span>
        ))}
      </span>
    ));

  return (
    <Tag className={className}>
      <span className={wideLines ? "block lg:hidden" : "block"}>
        {renderLines(compactLines)}
      </span>
      {wideLines ? (
        <span className="hidden lg:block">{renderLines(wideLines)}</span>
      ) : null}
    </Tag>
  );
}

/**
 * AboutStory — magazine body for the /about route.
 *
 * Sections, top → bottom:
 *   1. Intro        — full-width eyebrow + headline + 3-paragraph spread
 *   2. Center Image — staggered right-to-left color panel intro animation,
 *                     followed by the image reveal
 *   3. Numbers      — 3 quick markers about the company
 *   4. Studio       — side image + copy about how the team works,
 *                     with a CTA into /contact
 *   5. Principles   — short list of what guides the practice
 *
 * Text constraints:
 *   - No `max-w-[36ch]` clamps on body copy — they were cutting words.
 *   - The main headline gets its own full-width row so the display font
 *     has room to breathe.
 *
 * Animations:
 *   - `data-reveal` / `data-split-text` are picked up by ScrollMotion
 *     for fade-ups + word reveals on scroll.
 *   - <LayerIntroImage /> mounts a custom GSAP timeline that paints 3
 *     colored panels in from the right-to-left, then reveals the image
 *     underneath. Fires when the element scrolls into the viewport.
 */

export default function AboutStory() {
  const statsSectionRef = useRef<HTMLDivElement | null>(null);
  const studioSectionRef = useRef<HTMLDivElement | null>(null);
  const studioImageFrameRef = useRef<HTMLDivElement | null>(null);
  const studioImageMediaRef = useRef<HTMLDivElement | null>(null);
  const boundariesListRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduce) return;

    ensureGsapPlugins();

    const ctx = gsap.context(() => {
      const stats = statsSectionRef.current?.querySelectorAll<HTMLElement>(
        "[data-about-stat]",
      );
      if (stats?.length) {
        gsap.fromTo(
          stats,
          { autoAlpha: 0, y: 72, rotateX: 8 },
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            duration: 1.05,
            ease: "power3.out",
            stagger: 0.14,
            scrollTrigger: {
              trigger: statsSectionRef.current,
              start: "top 78%",
              toggleActions: "play none none none",
            },
          },
        );

        const statValues = statsSectionRef.current?.querySelectorAll<HTMLElement>(
          "[data-about-stat-value]",
        );
        if (statValues?.length) {
          gsap.fromTo(
            statValues,
            { yPercent: 110, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.1,
              scrollTrigger: {
                trigger: statsSectionRef.current,
                start: "top 74%",
                toggleActions: "play none none none",
              },
            },
          );
        }
      }

      if (studioImageFrameRef.current && studioImageMediaRef.current) {
        gsap.fromTo(
          studioImageFrameRef.current,
          {
            autoAlpha: 0,
            clipPath: "inset(18% 0 18% 0)",
          },
          {
            autoAlpha: 1,
            clipPath: "inset(0% 0 0% 0)",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: studioSectionRef.current,
              start: "top 76%",
              toggleActions: "play none none none",
            },
          },
        );

        gsap.fromTo(
          studioImageMediaRef.current,
          { scale: 1.14 },
          {
            scale: 1,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: studioSectionRef.current,
              start: "top 76%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      const boundaryItems =
        boundariesListRef.current?.querySelectorAll<HTMLElement>(
          "[data-boundary-item]",
        );
      if (boundaryItems?.length) {
        gsap.fromTo(
          boundaryItems,
          { autoAlpha: 0, x: 48 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: boundariesListRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      aria-label="About Abhigna — story"
      className="relative bg-brand-bg"
    >
      {/* ╔══ 1. INTRO ═════════════════════════════════════════════════════╗ */}
      <div className="mx-auto max-w-[1400px] px-6 pt-28 md:px-12 md:pt-36 lg:px-16">
        <p
          data-reveal
          className="mb-6 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-zinc-500"
        >
          <span aria-hidden className="block h-px w-10 bg-zinc-400" />
          Our Story
        </p>

        {/* Full-width headline row — no col-span clamp so the italic
            display font can flow freely. */}
        <DisplayHeading
          compactLines={[
            "Built in Bangalore.",
            "Designed for better",
            "community living.",
          ]}
          wideLines={[
            "Built in Bangalore. Designed",
            "for better community living.",
          ]}
          className="max-w-[26ch] font-display text-[clamp(1rem,4.2vw,4rem)] font-light italic leading-[0.9] tracking-[-0.035em] text-zinc-900"
        />

        {/* Body copy — full-width flowing columns */}
        <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-12 md:gap-y-0">
          <div data-reveal className="md:col-span-5">
            <p className="text-[15px] leading-[1.7] text-zinc-700 md:text-base">
              Established in 2007, Abhigna Constructions has grown into one of
              Bangalore&apos;s leading real estate developers, delivering
              residential projects through a strong combination of engineering,
              financial, and design capability.
            </p>
          </div>
          <div data-reveal className="md:col-span-5 md:col-start-8">
            <p className="text-[15px] leading-[1.7] text-zinc-700 md:text-base">
              From 1BHK to 4BHK apartments, every development is shaped around
              our belief that quality of life matters and that every home
              should be part of a sustainable, well-planned community.
            </p>
          </div>
        </div>
      </div>

      {/* ╔══ 2. CENTER IMAGE — LAYERED ENTRY ════════════════════════════╗ */}
      <div className="mt-24 w-full md:mt-32">
        <LayerIntroImage />
      </div>

      {/* ╔══ 3. NUMBERS ══════════════════════════════════════════════════╗ */}
      <div
        ref={statsSectionRef}
        className="mx-auto max-w-[1400px] px-6 py-28 md:px-12 md:py-36 lg:px-16"
      >
        <div className="grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-3">
          {[
            {
              k: "01",
              t: "Founded",
              v: "2007",
              b: "Established in Bangalore with a long-term focus on residential development.",
            },
            {
              k: "02",
              t: "Homes",
              v: "1-4 BHK",
              b: "Apartments designed to serve different families, lifestyles, and stages of life.",
            },
            {
              k: "03",
              t: "Focus",
              v: "Community",
              b: "Sustainable neighborhoods, dependable client service, and consistently high standards.",
            },
          ].map((p) => (
            <article
              key={p.k}
              data-about-stat
              className="border-t border-zinc-300 pt-7 will-change-transform"
            >
              <p className="font-mono text-[11px] tracking-[0.3em] text-zinc-400">
                — {p.k}
              </p>
              <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                {p.t}
              </p>
              <h3 className="mt-3 overflow-hidden font-display text-5xl font-light italic leading-none tracking-tight text-zinc-900 md:text-6xl">
                <span data-about-stat-value className="inline-block">
                  {p.v}
                </span>
              </h3>
              <p className="mt-5 text-[15px] leading-[1.7] text-zinc-600">
                {p.b}
              </p>
            </article>
          ))}
        </div>
      </div>

      {/* ╔══ 4. STUDIO COPY + IMAGE ════════════════════════════════════╗ */}
      <div ref={studioSectionRef} className="border-y border-zinc-200 bg-zinc-50">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 py-24 md:grid-cols-12 md:gap-14 md:px-12 md:py-32 lg:px-16">
          <div className="md:col-span-6">
            <div
              ref={studioImageFrameRef}
              data-cursor="image"
              className="relative aspect-[5/4] overflow-hidden bg-zinc-200"
            >
              <div
                ref={studioImageMediaRef}
                data-parallax="0.10"
                className="absolute inset-0"
              >
                <Image
                  src="https://cdn.sthyra.com/MISTY_WOODS_IMAGES/WhatsApp%20Image%202026-08-10%20at%2012.23.09%20PM.jpeg"
                  alt="Studio review at a drawing table"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7 md:flex md:flex-col md:justify-center">
            <p
              data-reveal
              className="mb-5 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-zinc-500"
            >
              <span aria-hidden className="block h-px w-10 bg-zinc-400" />
              How we work
            </p>
            <DisplayHeading
              as="h3"
              compactLines={[
                "Engineering, financial,",
                "and design strength",
                "in one team.",
              ]}
              wideLines={[
                "Engineering, financial, and",
                "design strength in one team.",
              ]}
              className="max-w-[26ch] font-display text-[clamp(0.98rem,3.3vw,3rem)] font-light italic leading-[0.9] tracking-[-0.03em] text-zinc-900"
            />
            <p
              data-reveal
              className="mt-6 text-[15px] leading-[1.7] text-zinc-700 md:text-base"
            >
              Our team oversees each project with care for planning,
              execution, and customer experience. That shared responsibility
              helps us deliver residential communities with quality, clarity,
              and long-term value.
            </p>
            <a
              href="/contact"
              data-reveal
              className="mt-9 inline-flex items-center gap-2 self-start border-b border-zinc-900 pb-1 text-[11px] uppercase tracking-[0.32em] text-zinc-900"
            >
              Contact our team
              <FiArrowUpRight size={14} strokeWidth={1.6} />
            </a>
          </div>
        </div>
      </div>

      {/* ╔══ 5. WHAT GUIDES US ══════════════════════════════════════════╗ */}
      <div className="mx-auto max-w-[1400px] px-6 py-28 md:px-12 md:py-36 lg:px-16">
        <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-12 md:gap-y-0">
          <div className="md:col-span-5">
            <p
              data-reveal
              className="mb-5 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-zinc-500"
            >
              <span aria-hidden className="block h-px w-10 bg-zinc-400" />
              Boundaries
            </p>
            <DisplayHeading
              as="h3"
              compactLines={[
                "Quality of life is",
                "the standard we",
                "build toward.",
              ]}
              wideLines={[
                "Quality of life is the",
                "standard we build toward.",
              ]}
              className="max-w-[24ch] font-display text-[clamp(1rem,3.1vw,2.8rem)] font-light italic leading-[0.9] tracking-[-0.03em] text-zinc-900"
            />
          </div>
          <ul ref={boundariesListRef} className="md:col-span-6 md:col-start-7">
            {[
              "Homes should feel like part of a larger, well-connected community.",
              "Sustainable planning should support long-term success for residents.",
              "Residential development should be backed by strong engineering, design, and financial discipline.",
              "Client service should reflect the same high standards as the construction itself.",
            ].map((line, i) => (
              <li
                key={line}
                data-boundary-item
                className="flex items-start gap-6 border-t border-zinc-200 py-6 text-[15px] leading-[1.7] text-zinc-700 last:border-b md:text-base"
              >
                <span className="font-mono text-[11px] tracking-[0.28em] text-zinc-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */
/*  LayerIntroImage                                                         */
/* ─────────────────────────────────────────────────────────────────────── */

/**
 * Paints 3 full-width colored panels from the right edge, then reveals
 * the image by lifting those panels out to the left. Result reads like a
 * wipe-on, wipe-off transition: the colors come in to mask the image,
 * the image is in place underneath, then the colors exit and reveal it.
 *
 * GSAP timeline:
 *   0.0s   bg image already loaded, opacity 0
 *   0.0s   panels at x: 100% (offscreen right), full height
 *   0.0s → 1.0s  panel[0] slides in leftward to fully cover the image
 *   0.2s → 1.0s  panel[1] slides in to fully cover the image
 *   0.4s → 1.0s  panel[2] slides in to fully cover the image
 *   1.0s → 1.6s  all 3 panels slide out to the left (x: -100%)
 *   1.0s → 1.6s  image fades up (autoAlpha 0 → 1) underneath
 *
 *   Total intro: ~1.6s, fires when the ScrollTrigger's start hits.
 *
 * Reduced motion → skip the panels, just fade the image up.
 */
function LayerIntroImage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panel0Ref = useRef<HTMLDivElement | null>(null);
  const panel1Ref = useRef<HTMLDivElement | null>(null);
  const panel2Ref = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = rootRef.current;
    if (!root) return;

    const prefersReduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduce) {
      if (imageRef.current)
        gsap.set(imageRef.current, { autoAlpha: 1 });
      if (eyebrowRef.current)
        gsap.set(eyebrowRef.current, { autoAlpha: 1 });
      return;
    }

    ensureGsapPlugins();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top 80%",
        once: true,
      },
    });

    // Start state: image hidden, panels hidden off the right.
    tl.set(imageRef.current, { autoAlpha: 0 })
      .set(
        [panel0Ref.current, panel1Ref.current, panel2Ref.current],
        { xPercent: 110 },
      )
      .set(eyebrowRef.current, { autoAlpha: 0, y: 18 });

    // 1) Panels slide in from the right, each covering the full image
    //    so the mask reads edge-to-edge instead of collecting centrally.
    tl.to(panel0Ref.current, {
      xPercent: 0,
      duration: 0.9,
      ease: "power4.out",
    })
      .to(
        panel1Ref.current,
        {
          xPercent: 0,
          duration: 0.9,
          ease: "power4.out",
        },
        "-=0.7",
      )
      .to(
        panel2Ref.current,
        {
          xPercent: 0,
          duration: 0.9,
          ease: "power4.out",
        },
        "-=0.7",
      );

    // 2) Brief pause where the panels fully cover the image. The image
    //    quietly fades up *under* them.
    tl.to(imageRef.current, {
      autoAlpha: 1,
      duration: 0.5,
      ease: "power2.out",
    });

    // 3) Eyebrow slides in from below.
    tl.to(
      eyebrowRef.current,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      },
      "-=0.2",
    );

    // 4) Panels sweep out to the LEFT, revealing the image.
    tl.to(
      [panel0Ref.current, panel1Ref.current, panel2Ref.current],
      {
        xPercent: -110,
        duration: 0.85,
        ease: "power4.inOut",
        stagger: 0.07,
      },
      ">-0.1",
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative h-[58vh] min-h-[420px] w-full overflow-hidden md:h-[72vh]"
    >
      {/* Image — sits underneath the panels */}
      <div
        ref={imageRef}
        className="absolute inset-0"
        style={{ opacity: 0 }}
      >
        <div data-parallax="0.10" className="absolute inset-0">
          <Image
            src="https://cdn.sthyra.com/MISTY_WOODS_IMAGES/upscaled%20image%20(1).jpg"
            alt="Abhigna site at first light"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,8,10,0.55) 0%, transparent 30%, transparent 65%, rgba(8,8,10,0.7) 100%)",
          }}
        />
      </div>

      {/* Layer panels — three full-width colored slabs that paint in from
          the right, then sweep out to the left. */}
      <div
        ref={panel0Ref}
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "#1f2a2e",
          willChange: "transform",
        }}
      />
      <div
        ref={panel1Ref}
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "#c87f4a",
          willChange: "transform",
        }}
      />
      <div
        ref={panel2Ref}
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "#e9e2d3",
          willChange: "transform",
        }}
      />

      {/* Foreground text */}
      <div
        ref={eyebrowRef}
        className="absolute inset-x-0 bottom-0 mx-auto max-w-[1400px] px-6 pb-10 md:px-12 md:pb-14 lg:px-16"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/70">
          Since 2007 · Bangalore
        </p>
        <p className="mt-3 max-w-lg text-2xl font-light italic leading-[1.15] text-white md:text-[2.4rem]">
          We build homes that strengthen everyday life and the community around them.
        </p>
      </div>
    </div>
  );
}
