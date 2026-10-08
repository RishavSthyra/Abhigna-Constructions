"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
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

/**
 * Featured Projects — horizontal scroll-pinned showcase.
 *
 * Layout:
 *   ┌──────────────────────────────────────────────────────────┐
 *   │  Section header (pinned, fades in once)                  │
 *   │  — Our Collection                                         │
 *   │  Featured Projects                                        │
 *   │  counter hairline: 06 ━━━━━━━━━━ 06                      │
 *   │                                                          │
 *   │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐          │
 *   │  │ Card 1 │  │ Card 2 │  │ Card 3 │  │ Card 4 │ ← slides │
 *   │  │  BG    │  │  BG    │  │  BG    │  │  BG    │   left   │
 *   │  │  image │  │  image │  │  image │  │  image │          │
 *   │  │        │  │        │  │        │  │        │          │
 *   │  │ name   │  │ name   │  │ name   │  │ name   │          │
 *   │  │ loc    │  │ loc    │  │ loc    │  │ loc    │          │
 *   │  └────────┘  └────────┘  └────────┘  └────────┘          │
 *   │  ...2 more cards in the same horizontal track           │
 *   └──────────────────────────────────────────────────────────┘
 *
 * - Section pins to the top of the viewport when it enters.
 * - Cards translate horizontally as the user scrolls (scrub).
 * - When the last card reaches the right edge, the pin releases and
 *   normal vertical scroll resumes for StatsBand / WhyUs.
 * - Cards are landscape (≈80vw × 56vh) so they read as cinematic
 *   frames, not vertical thumbnails.
 */
export default function DreamHomeListings() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const projectTotalPadded = String(PROJECTS.length).padStart(2, "0");

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
        <div className="relative z-10 mx-auto w-full shrink-0 max-w-[1400px] px-6 pb-2 pt-24 md:px-12 md:pt-28 lg:px-16 xl:pt-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end">
            <div data-reveal className="md:col-span-7">
              <p className="mb-5 text-xs uppercase tracking-[0.3em] text-zinc-500">
                — Our Collection
              </p>
              <h2
                data-split-text
                className="font-display text-4xl font-medium leading-[1.1] tracking-tight text-zinc-900 md:text-5xl lg:text-6xl"
              >
                Featured Projects.
              </h2>
            </div>
            <div
              data-reveal
              className="md:col-span-4 md:col-start-9 md:pb-2"
            >
              <p className="max-w-sm text-sm leading-relaxed text-zinc-500 md:text-base">
                Explore every home and community in our featured collection.
              </p>
              <p className="mt-6 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-500">
                <span className="font-semibold text-zinc-900">
                  {projectTotalPadded}
                </span>
                <span
                  aria-hidden
                  className="block h-px w-16 bg-zinc-400"
                />
                <span>Projects</span>
              </p>
            </div>
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

      {/* Type chip — top-left */}
      <span className="absolute left-5 top-5 z-10 bg-white/95 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-900">
        {project.type}
      </span>
      {/* Bottom metadata — name + location + arrow */}
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
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/70">
            {project.location}
          </p>
          <h3 className="mt-1.5 font-display text-xl font-light italic leading-tight md:text-2xl">
            {project.name}
          </h3>
        </div>
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur transition group-hover:border-white group-hover:bg-white group-hover:text-zinc-900">
          <FiArrowUpRight size={16} strokeWidth={1.6} />
        </span>
      </div>
    </article>
  );
}
