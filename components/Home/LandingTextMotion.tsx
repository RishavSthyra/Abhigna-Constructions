"use client";

import { useEffect } from "react";

export default function LandingTextMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const page = document.getElementById("landing-page");
    if (!page || !window.IntersectionObserver) return;

    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;
          observer.unobserve(element);

          const animation = element.animate(
            [
              { transform: "translateY(12px)" },
              { transform: "translateY(0)" },
            ],
            {
              duration: 620,
              delay: Number(element.dataset.textDelay ?? 0),
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "backwards",
            },
          );

          animations.add(animation);
          animation.finished.then(
            () => animations.delete(animation),
            () => animations.delete(animation),
          );
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );

    page.querySelectorAll<HTMLElement>("[data-text-reveal]").forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, []);

  return null;
}
