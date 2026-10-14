"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapPlugins } from "@/components/Nav/gsap/easings";

type Project = {
  id: number;
  name: string;
  location: string;
  type: "Ongoing" | "Completed";
  src: string;
  href: string;
};

/**
 * Projects currently featured in the homepage showcase.
 */
const PROJECTS: Project[] = [
  {
    id: 1,
    name: "Aadhya Serene",
    location: "Manyata Tech Park, Bengaluru",
    type: "Ongoing",
    src: "https://cdn.sthyra.com/AADHYA%20SERENE/images/HERO_NEW.avif",
    href: "https://www.aadhyaserene.com/",
  },
  {
    id: 2,
    name: "Abhigna SRC Opulent Bluebells",
    location: "Electronic City Phase - II, Bengaluru",
    type: "Completed",
    src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1400&q=80",
    href: "https://huntvastuhomes.com/opulent-src-bluebells-vastu-apartments-ananth-nagar-bengaluru",
  },
  {
    id: 3,
    name: "Abhigna Misty Wood",
    location: "JP Nagar, Bengaluru",
    type: "Completed",
    src: "https://cdn.sthyra.com/AADHYA%20SERENE/images/ChatGPT%20Image%20Aug%207%2C%202026%2C%2002_06_02%20PM%20(1).jpg",
    href: "https://housing.com/in/buy/projects/page/251177-abhigna-misty-woods-by-abhigna-constructions-in-jp-nagar",
  },
];

/** Featured projects scroll as a horizontal track on desktop. */
export default function DreamHomeListings() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduce) return;

    ensureGsapPlugins();

    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const rail = railRef.current;
    if (!section || !viewport || !rail) return;

    const media = gsap.matchMedia();

    // Small screens keep a native horizontal track so the header always owns
    // its space. The pinned, scroll-scrubbed presentation starts at desktop.
    media.add("(min-width: 1280px)", () => {
      const resetRailPosition = () => {
        viewport.scrollLeft = 0;
        gsap.set(rail, { x: 0 });
      };

      const computeDistance = () => {
        const total = rail.scrollWidth - viewport.clientWidth;
        return Math.max(0, total);
      };

      resetRailPosition();

      const tween = gsap.to(rail, {
        x: () => -computeDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${computeDistance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onRefreshInit: resetRailPosition,
          onLeaveBack: resetRailPosition,
          invalidateOnRefresh: true,
        },
      });

      const cleanupFns: Array<() => void> = [];

      // Refresh after images have settled so ScrollTrigger measures the real
      // track width, not the unhydrated layout.
      const imgs = Array.from(rail.querySelectorAll("img"));
      imgs.forEach((img) => {
        if (img.complete) return;
        img.addEventListener("load", () => ScrollTrigger.refresh(), {
          once: true,
        });
        img.addEventListener("error", () => ScrollTrigger.refresh(), {
          once: true,
        });
      });

      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
        cleanupFns.push(() => cancelAnimationFrame(raf2));
      });
      cleanupFns.push(() => cancelAnimationFrame(raf1));

      return () => {
        resetRailPosition();
        cleanupFns.forEach((fn) => fn());
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => media.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="listings"
      data-scroll-path-section="true"
      data-scroll-path-section-id="featured-projects"
      data-scroll-path-index="2"
      aria-label="Featured projects"
      className="relative bg-brand-bg"
    >
      <div
        data-scroll-path-content="true"
        className="relative z-20 mx-auto max-w-none overflow-hidden xl:flex xl:h-screen xl:flex-col"
      >
        <div className="relative z-10 mx-auto w-full shrink-0 max-w-[1400px] px-6 pb-2 pt-24 md:px-12 md:pt-28 lg:px-16 xl:pt-24">
          <div data-reveal>
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-zinc-500">
              Our Collection
            </p>
            <h2
              data-split-text
              className="font-display text-4xl font-light leading-[1.1] tracking-tight text-zinc-900 md:text-5xl lg:text-6xl"
            >
              Featured Projects.
            </h2>
          </div>
        </div>

        {/* Horizontal project viewport */}
        <div
          ref={viewportRef}
          className="overflow-x-auto xl:min-h-0 xl:flex-1 xl:overflow-hidden"
        >
          <div
            ref={railRef}
            className="flex w-max snap-x snap-mandatory gap-6 px-6 pb-10 pt-10 md:gap-10 md:px-12 lg:gap-12 lg:px-16 xl:h-full xl:items-start xl:pb-12 xl:pt-10"
            style={{ willChange: "transform" }}
          >
            {PROJECTS.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      data-cursor="image"
      className="group relative h-[min(52svh,420px)] shrink-0 snap-start overflow-hidden bg-zinc-200 xl:h-full"
      style={{
        width: "min(80vw, 760px)",
      }}
    >
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${project.name} project details (opens in a new tab)`}
        className="absolute inset-0 z-20 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
      />
      <div className="absolute inset-0">
        <Image
          src={project.src}
          alt={project.name}
          fill
          sizes="80vw"
          priority
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
      </div>

      {/* Bottom metadata — status, name, and location */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,8,10,0.0) 50%, rgba(8,8,10,0.65) 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 px-6 pb-6 text-white">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/80">
            {project.type}
          </p>
          <h3 className="mt-2 font-display text-2xl font-normal leading-tight md:text-3xl">
            {project.name}
          </h3>
          <p className="mt-1 text-sm leading-snug text-white/80">
            {project.location}
          </p>
        </div>
      </div>
    </article>
  );
}
