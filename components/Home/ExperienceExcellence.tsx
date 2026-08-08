"use client";

import { FiArrowRight } from "react-icons/fi";

const HOME_TYPES = ["Apartments", "1BHK", "2BHK", "3BHK", "4BHK"];

const FOCUS_AREAS = ["Since 2007", "Bangalore", "Community First"];

export default function ExperienceExcellence() {
  return (
    <section
      id="about"
      data-scroll-path-section="true"
      data-scroll-path-section-id="experience-excellence"
      data-scroll-path-index="0"
      className="bg-brand-bg px-6 py-28 md:py-36"
    >
      <div
        data-scroll-path-content="true"
        className="relative z-20 mx-auto max-w-6xl"
      >
        {/* Heading */}
        <h2
          data-split-text
          className="mx-auto max-w-2xl text-center font-display text-5xl font-medium leading-[1.05] tracking-tight text-zinc-900 md:text-6xl"
        >
          Experience Excellence In Residential Development
        </h2>

        {/* 3-column grid */}
        <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          {/* Left column */}
          <div data-reveal className="md:col-span-4 md:pt-16">
            <h3 className="font-display text-2xl font-medium leading-tight text-zinc-900">
              Building homes that belong to a greater community
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              Abhigna Constructions, established in 2007, is one of
              Bangalore&apos;s leading real estate developers with a strong
              record of completed residential projects across the city.
            </p>
            <a
              href="/about"
              data-cursor="image"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-zinc-800"
            >
              About Us
              <FiArrowRight size={13} />
            </a>

            <div className="mt-14">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                What We Build:
              </p>
              <ul className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-medium text-zinc-700">
                {HOME_TYPES.map((type) => (
                  <li key={type} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                    {type}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Center image — parallax wrap so the photo drifts gently */}
          <div data-reveal className="md:col-span-4">
            <div
              data-cursor="image"
              className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-200"
            >
              <div data-parallax="0.10" className="absolute inset-0">
                <img
                  src="https://cdn.sthyra.com/AADHYA%20SERENE/images/ROOF.avif"
                  alt="Modern hillside villa with infinity pool"
                  className="cursor-target h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right column — stagger reveal */}
          <div className="md:col-span-4 md:pt-16">
            <div
              data-reveal="stagger"
              className="space-y-6 border-b border-zinc-200 pb-6"
            >
              <h4 className="font-display text-xl font-medium text-zinc-900">
                Community-First Vision
              </h4>
              <p className="text-sm leading-relaxed text-zinc-500">
                We believe our most important goal is the creation of homes as
                part of an overall community where residents can grow, connect,
                and thrive.
              </p>
            </div>
            <div
              data-reveal="stagger"
              className="space-y-6 border-b border-zinc-200 py-6"
            >
              <h4 className="font-display text-xl font-medium text-zinc-900">
                Sustainable Development
              </h4>
              <p className="text-sm leading-relaxed text-zinc-500">
                Our team is passionate about designing sustainable communities
                while upholding high standards in residential development and
                client service.
              </p>
            </div>

            <div className="pt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                Our Focus:
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {FOCUS_AREAS.map((area) => (
                  <span
                    key={area}
                    className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-zinc-700"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
