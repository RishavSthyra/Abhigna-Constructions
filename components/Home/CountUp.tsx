"use client";

import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  end: number;
  label: string;
  prefix?: string;
  suffix?: string;
  millions?: boolean;
};

export default function CountUp({ end, label, prefix = "", suffix = "", millions = false }: CountUpProps) {
  const ref = useRef<HTMLElement>(null);
  const [value, setValue] = useState(end);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        setValue(0);
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / 1500, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(end * eased);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end]);

  const displayValue = millions
    ? value >= end ? String(end) : value.toFixed(1)
    : String(Math.round(value));

  return (
    <strong ref={ref} aria-label={label}>
      {prefix}{displayValue}{millions && "M"}{suffix && <span>{suffix}</span>}
    </strong>
  );
}
