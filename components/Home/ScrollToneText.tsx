"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollToneText({ children, activeClassName }: { children: React.ReactNode; activeClassName: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <span ref={ref} className={isActive ? activeClassName : undefined}>{children}</span>;
}
