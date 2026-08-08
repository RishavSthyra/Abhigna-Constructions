"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  value: number;
  suffix?: string;
  label: string;
};

const STATS: Stat[] = [
  {
    value: 145,
    suffix: "+",
    label: "Projects Delivered",
  },
  {
    value: 21,
    label: "Years of Practice",
  },
  {
    value: 36,
    label: "Design Honors",
  },
  {
    value: 14,
    label: "Countries Served",
  },
];

const COUNTER_DURATION = 1500;

export default function StatsBand() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldAnimate(true);

          // Counter runs only once.
          observer.disconnect();
        }
      },
      {
        // Animation begins only when a good portion
        // of the section is inside the viewport.
        threshold: 0.4,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-scroll-path-section="true"
      data-scroll-path-section-id="stats-band"
      data-scroll-path-index="3"
      aria-label="Company statistics"
      className="
        relative w-full
        border-y border-[#d5d0c7]
        bg-[#f4f1eb]
      "
    >
      <div
        data-scroll-path-content="true"
        className="
          relative z-20 mx-auto grid
          min-h-[138px]
          w-full max-w-[1440px]
          grid-cols-2
          px-5
          sm:px-8
          md:grid-cols-4
          md:px-10
          lg:px-14
        "
      >
        {STATS.map((stat, index) => (
          <StatItem
            key={stat.label}
            stat={stat}
            shouldAnimate={shouldAnimate}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

type StatItemProps = {
  stat: Stat;
  shouldAnimate: boolean;
  index: number;
};

function StatItem({
  stat,
  shouldAnimate,
  index,
}: StatItemProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      // Skip the animation entirely; the final value is the rendered state.
      return;
    }

    let animationFrame = 0;
    let startTime: number | null = null;

    const animateCounter = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(
        elapsed / COUNTER_DURATION,
        1,
      );

      // Smooth cubic ease-out.
      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      setDisplayValue(
        Math.round(stat.value * easedProgress),
      );

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(animateCounter);
      }
    };

    animationFrame =
      requestAnimationFrame(animateCounter);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [shouldAnimate, stat.value]);

  // When reduced motion is preferred, show the final value immediately
  // without driving it through the animation hook.
  const renderedValue =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? stat.value
      : displayValue;

  return (
    <div
      className={[
        `
          relative flex min-h-[118px]
          items-center justify-center
          py-7
          md:min-h-[138px]
          md:py-6
        `,

        // Mobile horizontal separation.
        index < 2
          ? "border-b border-[#d5d0c7] md:border-b-0"
          : "",
      ].join(" ")}
    >
      {/* Left horizontal hairline */}
      <div
        aria-hidden="true"
        className="
          hidden h-px min-w-4 flex-1
          bg-[#cec9c0]
          sm:block
        "
      />

      {/* Statistic content */}
      <div
        className="
          shrink-0 px-4 text-center
          sm:px-5
          lg:px-7
        "
      >
        <p
          className="
            font-display
            text-[42px]
            font-normal
            leading-[0.9]
            tracking-[-0.035em]
            text-[#181817]
            tabular-nums
            sm:text-[48px]
            md:text-[52px]
            lg:text-[56px]
          "
        >
          {renderedValue}
          {stat.suffix && (
            <span className="ml-[1px]">
              {stat.suffix}
            </span>
          )}
        </p>

        <p
          className="
            mt-3 whitespace-nowrap
            text-[7px]
            font-medium
            uppercase
            leading-none
            tracking-[0.27em]
            text-[#4f4c47]
            sm:text-[8px]
            md:mt-4
          "
        >
          {stat.label}
        </p>
      </div>

      {/* Right horizontal hairline */}
      <div
        aria-hidden="true"
        className="
          hidden h-px min-w-4 flex-1
          bg-[#cec9c0]
          sm:block
        "
      />
    </div>
  );
}
