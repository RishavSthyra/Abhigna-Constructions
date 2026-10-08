"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Stat = {
  value: number;
  suffix?: string;
  label: string;
  compactMillion?: boolean;
};

const STATS: Stat[] = [
  {
    value: 35,
    suffix: "+",
    label: "Years of engineered homes",
  },
  {
    value: 1_000_000,
    suffix: "+",
    label: "sq delivered",
    compactMillion: true,
  },
  {
    value: 200,
    suffix: "+",
    label: "Families who call Abhigna Constructions home",
  },
  {
    value: 100,
    suffix: "%",
    label: "Vastu-compliant plans",
  },
];

const COUNTER_DURATION = 1.5;

export default function StatsBand() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(() => setShouldAnimate(true));
      return () => cancelAnimationFrame(frame);
    }

    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 82%",
      once: true,
      onEnter: () => setShouldAnimate(true),
    });

    return () => trigger.kill();
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
          min-h-[176px]
          w-full max-w-[1440px]
          grid-cols-2
          px-5
          sm:px-8
          lg:grid-cols-4
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
      const frame = requestAnimationFrame(() => setDisplayValue(stat.value));
      return () => cancelAnimationFrame(frame);
    }

    const counter = { value: 0 };
    const tween = gsap.to(counter, {
      value: stat.value,
      duration: COUNTER_DURATION,
      delay: index * 0.12,
      ease: "power2.out",
      onUpdate: () => setDisplayValue(Math.round(counter.value)),
      onComplete: () => setDisplayValue(stat.value),
    });

    return () => tween.kill();
  }, [shouldAnimate, stat.value, index]);

  const renderedValue = stat.compactMillion
    ? displayValue >= stat.value
      ? "1M"
      : `${Math.floor(displayValue / 1_000)}K`
    : displayValue;

  return (
    <div
      className={[
        `
          relative flex min-h-[158px]
          items-center justify-center
          py-8
          md:min-h-[176px]
        `,

        // Mobile horizontal separation.
        index < 2
          ? "border-b border-[#d5d0c7] lg:border-b-0"
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
          grid min-w-0 grid-rows-[64px_52px]
          px-2 text-center
          sm:px-4
          lg:px-5
        "
      >
        <p
          className="
            flex items-center justify-center
            font-display
            font-normal
            leading-none
            tracking-[-0.035em]
            text-[#181817]
            tabular-nums
            whitespace-nowrap
            text-[38px] sm:text-[43px]
            md:text-[47px] lg:text-[50px]
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
            mx-auto mt-2 max-w-[30ch]
            text-[9px]
            font-medium
            uppercase
            leading-[1.35]
            tracking-[0.18em]
            text-[#4f4c47]
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
