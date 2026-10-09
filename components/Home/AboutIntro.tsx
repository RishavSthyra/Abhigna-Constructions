"use client";

import { Fragment, useEffect, useRef } from "react";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const COPY =
  "Abhigna Constructions is an engineering-led developer. Each project reflects meticulous planning, Vastu-aligned design and a standard of excellence that has delivered close to a million square feet of homes. These are homes built for the generations that follow.";
const WORDS = COPY.split(" ");

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

    // Pin-length scrub: the full sticky travel maps to the word fill,
    // so scrolling down AND scrolling up complete the animation gradually.
    const animation = gsap.to(words, {
      color: "#1c1815",
      ease: "none",
      stagger: 1,
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
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
      className="relative h-[240svh] bg-brand-bg motion-reduce:h-auto"
    >
      <div
        data-scroll-path-content="true"
        className="sticky top-0 z-20 mx-auto flex h-svh max-w-6xl flex-col items-center justify-center px-6 py-10 text-center sm:px-8 motion-reduce:relative motion-reduce:h-auto motion-reduce:py-24"
      >
        <p
          className="mb-8 text-[11px] font-medium uppercase tracking-[0.32em] text-brand-muted md:mb-10"
        >
          About us
        </p>

        <h2
          id="about-intro-heading"
          className="max-w-[1080px] font-display text-[clamp(1.65rem,2.8vw,2.6rem)] font-light leading-[1.22] tracking-[-0.04em] text-balance"
        >
          {WORDS.map((word, index) => (
            <Fragment key={`${word}-${index}`}>
              <span
                ref={(element) => { wordRefs.current[index] = element; }}
                className="text-[#c9c3b9]"
              >
                {word}
              </span>
              {index < WORDS.length - 1 ? " " : null}
            </Fragment>
          ))}
        </h2>

        <Link
          href="/about"
          className="site-cta site-cta--dark mt-10 md:mt-14"
        >
          More about us
          <FiArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
