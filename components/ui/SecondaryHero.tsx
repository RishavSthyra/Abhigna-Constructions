"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { NAV_EASE, ensureGsapPlugins } from "@/components/Nav/gsap/easings";

/**
 * SecondaryHero — reusable full-bleed image hero for /about, /contact,
 * and any other secondary page.
 *
 *   ┌──────────────────────────────────────────────────────┐
 *   │ (dark mask)        │                                 │
 *   │                    │                                 │
 *   │  EYEBROW           │   [full-bleed architectural     │
 *   │                    │    exterior, slowly zooming     │
 *   │  Spaces with       │    in from 1.08 → 1.0]          │
 *   │  Purpose.          │                                 │
 *   │                    │                                 │
 *   │  paragraph …       │                                 │
 *   │                    │                                 │
 *   └──────────────────────────────────────────────────────┘
 *
 * GSAP entrance:
 *   - headline reveals word-by-word
 *   - paragraph fades up
 *   - bg image slowly scales 1.08 → 1.0
 */
export type SecondaryHeroProps = {
  eyebrow: string;
  headline: string;
  headlineLines?: string[];
  paragraph?: string;
  imageSrc: string;
  imageAlt: string;
};

export default function SecondaryHero({
  eyebrow,
  headline,
  headlineLines,
  paragraph,
  imageSrc,
  imageAlt,
}: SecondaryHeroProps) {
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ensureGsapPlugins();

    const headlineWords = headlineRef.current
      ? Array.from(headlineRef.current.querySelectorAll<HTMLSpanElement>(
          "[data-hero-word]",
        ))
      : [];

    const tl = gsap.timeline({ defaults: { ease: NAV_EASE.softIn } });

    if (bgRef.current) {
      tl.fromTo(
        bgRef.current,
        { scale: 1.08, force3D: true },
        { scale: 1.0, duration: 2.4, ease: "power2.out" },
        0,
      );
    }

    if (headlineWords.length) {
      tl.fromTo(
        headlineWords,
        { y: 32, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          stagger: 0.08,
          ease: NAV_EASE.softIn,
        },
        0.35,
      );
    }

    if (paragraphRef.current) {
      tl.fromTo(
        paragraphRef.current,
        { y: 16, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7 },
        0.85,
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  const lines = (headlineLines?.length ? headlineLines : [headline]).map(
    (line) => line.split(" ").filter(Boolean),
  );

  return (
    <section
      aria-label={`${eyebrow} hero`}
      className="relative min-h-[540px] w-full overflow-hidden bg-brand-bg sm:min-h-[620px] lg:min-h-[700px]"
    >
      {/* Full-bleed bg image */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{ transform: "scale(1.08)" }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Heavy left mask */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,8,10,0.92) 0%, rgba(8,8,10,0.78) 25%, rgba(8,8,10,0.45) 50%, rgba(8,8,10,0.15) 75%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-40"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,8,10,0.6) 0%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-48"
        style={{
          background:
            "linear-gradient(0deg, rgba(8,8,10,0.7) 0%, transparent 100%)",
        }}
      />

      {/* Content stack */}
      <div className="relative z-10 flex h-full w-full flex-col">
        <div className="h-24 md:h-28" />

        <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-6 py-16 md:px-12 md:py-20 lg:px-16">
          <p className="mb-7 font-sans text-[12px] font-medium tracking-[0.02em] text-white/70">{eyebrow}</p>

          <h1
            ref={headlineRef}
            className="max-w-[14ch] font-display text-[clamp(2rem,3.2vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.045em] text-white sm:max-w-[15ch] lg:max-w-[16ch]"
          >
            {lines.map((lineWords, lineIndex) => (
              <span
                key={`${headline}-${lineIndex}`}
                className="block whitespace-normal"
              >
                {lineWords.map((word, wordIndex) => (
                  <span
                    key={`${word}-${lineIndex}-${wordIndex}`}
                    className="inline-block overflow-hidden align-baseline"
                    style={{
                      paddingTop: "0.08em",
                      paddingRight:
                        wordIndex < lineWords.length - 1 ? "0.16em" : "0",
                      paddingBottom: "0.12em",
                    }}
                  >
                    <span
                      data-hero-word
                      className="inline-block will-change-transform"
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          {paragraph ? (
            <p
              ref={paragraphRef}
              className="mt-8 max-w-xl text-[15px] leading-relaxed text-white/80 md:mt-10 md:text-base"
            >
              {paragraph}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
