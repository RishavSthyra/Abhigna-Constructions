"use client";

import { Fragment, useEffect, useRef } from "react";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const INTRO = "Abhigna Constructions is an engineering-led developer.";
const REST = "Each project reflects meticulous planning, Vastu-aligned design and a standard of excellence that has delivered close to a million square feet of homes. These are homes built for the generations that follow.";
const REST_WORDS = REST.split(" ");

export default function AboutIntro() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const words = wordRefs.current.filter((word): word is HTMLSpanElement => Boolean(word));
    if (!section || !words.length) return;

    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(words, { color: "#14110f" });
      return;
    }

    const animation = gsap.to(words, {
      color: "#14110f",
      ease: "none",
      duration: 0.3,
      stagger: 0.09,
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      data-scroll-path-section="true"
      data-scroll-path-section-id="about-intro"
      data-scroll-path-index="0"
      aria-labelledby="about-intro-heading"
      className="relative h-[195svh] bg-brand-bg motion-reduce:h-auto"
    >
      <div
        data-scroll-path-content="true"
        className="sticky top-0 z-20 mx-auto flex h-svh max-w-6xl flex-col items-center justify-center px-6 py-10 text-center sm:px-8 motion-reduce:relative motion-reduce:h-auto motion-reduce:py-24"
      >
        <p
          className="mb-6 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-muted md:mb-8"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" aria-hidden="true" />
          About us
        </p>

        <h2
          id="about-intro-heading"
          className="max-w-[1080px] font-display text-[clamp(1.65rem,2.8vw,2.6rem)] font-medium leading-[1.22] tracking-[-0.04em]"
        >
          <span className="text-brand-ink">{INTRO}</span>{" "}
          {REST_WORDS.map((word, index) => (
            <Fragment key={`${word}-${index}`}>
              <span
                ref={(element) => { wordRefs.current[index] = element; }}
                className="text-[#a19c95]"
              >
                {word}
              </span>
              {index < REST_WORDS.length - 1 ? " " : null}
            </Fragment>
          ))}
        </h2>

        <Link
          href="/about"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-brand-ink px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-ink md:mt-12"
        >
          More about us
          <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
