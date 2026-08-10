"use client";

import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";

/**
 * Home — Services (saisei-style asymmetric grid)
 *
 * Each row is a 3-cell CSS grid (`grid-cols-3`). The arrangement of
 * image and text cells within those 3 columns is **per service** and
 * varies intentionally so the layout feels organic and rhythmic
 * rather than a rigid repeating pattern.
 *
 * Borders (hairlines) sit only on text cells — never on image cells.
 *
 * Cell permutations used (below):
 *   row 1: [ empty · text · image ]   ← text center, image right
 *   row 2: [ image · text · empty ]   ← image left, text center
 *   row 3: [ text · empty · image ]   ← text left, image right
 *   row 4: [ image · empty · text ]   ← image left, text right
 *   row 5: [       Explore CTA        ]   ← full-width CTA
 *
 * Row heights also vary (~520px / 460px / 540px / 480px) so the grid
 * has a magazine-layout cadence, not a stamp effect.
 */

type Cell = "text" | "image" | "empty";

type Service = {
  label: string;
  body: string;
  src: string;
  layout: [Cell, Cell, Cell];
  rowHeight: string; // tailwind class for min-h
};

/**
 * Service copy sourced from abhignaconstructions.com "Our Services"
 * section. Bodies trimmed to match the reference's editorial voice.
 */
/**
 * 6 services — labels + bodies pulled from abhignaconstructions.com
 * "Our Services" list. Layouts vary so each row feels distinct:
 *
 *   row 1: empty · text · image       (image right)
 *   row 2: image · text · empty       (image left)
 *   row 3: text · empty · image       (image right)
 *   row 4: image · text · empty       (image left)
 *   row 5: text · empty · image       (image right)
 *   row 6: empty · image · text       (image center)
 *
 * Stacking rule: selected rows intentionally push imagery to the third
 * column so the editorial rhythm stays asymmetrical.
 *
 * Within any row, at most one image cell — never two side-by-side.
 */
const SERVICES: Service[] = [
  {
    label: "Modern Architecture",
    body: "Contemporary architecture shaped by functionality, proportion, context, and timeless design principles — working sensitively with each site's character and the lives that will inhabit it.",
    src: "https://cdn.sthyra.com/MISTY_WOODS_IMAGES/WhatsApp%20Image%202026-08-10%20at%2012.22.49%20PM.jpeg",
    layout: ["empty", "text", "image"],
    rowHeight: "min-h-[480px]",
  },
  {
    label: "Perfect Project Planning",
    body: "Careful project planning that coordinates every stage, from the initial concept through final completion. Clear timelines, transparent budgets, and rigorous quality checkpoints at each phase.",
    src: "https://cdn.sthyra.com/AADHYA%20SERENE/images/badminton.avif",
    layout: ["image", "text", "empty"],
    rowHeight: "min-h-[540px]",
  },
  {
    label: "Green Buildings",
    body: "Environmentally responsible buildings designed to improve efficiency, comfort, and long-term sustainability — passive cooling, daylighting, rainwater harvesting, and low-embodied-carbon materials.",
    src: "https://cdn.sthyra.com/AADHYA%20SERENE/images/amenities-first-frames/Gym%20-%20First%20Frame.avif",
    layout: ["text", "empty", "image"],
    rowHeight: "min-h-[500px]",
  },
  {
    label: "Best Quality Service",
    body: "A commitment to exceptional workmanship, reliable materials, and consistently high standards of delivery — with experienced Project Managers overseeing every detail from site to handover.",
    src: "https://cdn.sthyra.com/AADHYA%20SERENE/images/amenities-first-frames/Rooftopnew%20-%20First%20Frame.avif",
    layout: ["image", "text", "empty"],
    rowHeight: "min-h-[460px]",
  },
  {
    label: "Professional Specialist",
    body: "Experienced professionals bringing technical knowledge, creative thinking, and attention to every detail — architects, engineers, and project leads working as one team around each brief.",
    src: "https://cdn.sthyra.com/AADHYA%20SERENE/images/amenities-first-frames/swimmingPool-first-frame.avif",
    layout: ["text", "empty", "image"],
    rowHeight: "min-h-[520px]",
  },
  {
    label: "Hand Picked Locations",
    body: "Carefully selected locations chosen for their connectivity, surroundings, potential, and lasting value — sites that reward residents and hold their worth over decades.",
    src: "https://cdn.sthyra.com/MISTY_WOODS_IMAGES/WhatsApp%20Image%202026-08-10%20at%2012.22.33%20PM.jpeg",
    layout: ["empty", "image", "text"],
    rowHeight: "min-h-[480px]",
  },
];

export default function WhyUs() {
  return (
    <section
      id="services"
      data-scroll-path-section="true"
      data-scroll-path-section-id="why-us"
      data-scroll-path-index="4"
      aria-label="Our services"
      className="relative bg-brand-bg pt-28 md:pt-36"
    >
      <div
        data-scroll-path-content="true"
        className="relative z-20 mx-auto"
      >
        {/* Header */}
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end">
            <div data-reveal className="md:col-span-7">
              <p className="mb-5 text-xs uppercase tracking-[0.3em] text-zinc-500">
                — Our Services
              </p>
              <h2
                data-split-text
                className="font-display text-5xl font-medium leading-[1.04] tracking-tight text-zinc-900 md:text-6xl lg:text-7xl"
              >
                Crafted with care. Designed to last.
              </h2>
            </div>
            <div data-reveal className="md:col-span-4 md:col-start-9 md:pb-2">
              <p className="max-w-sm text-sm leading-relaxed text-zinc-500 md:text-base">
                From modern architecture and sustainable buildings to strategic
                planning and timely delivery, every project is handled with
                precision, transparency, and care.
              </p>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3">
          {SERVICES.map((s, i) => (
            <ServiceRow key={i} service={s} />
          ))}

          {/* Final row — full-width Explore CTA */}
          <div className="flex min-h-[180px] items-center justify-center border-t border-zinc-300 md:col-span-3">
            <a
              href="#services"
              data-cursor="image"
              className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-zinc-900"
            >
              <span className="border-b border-zinc-900 pb-1">
                Explore All Expertise
              </span>
              <FiArrowUpRight size={14} strokeWidth={1.6} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceRow({ service }: { service: Service }) {
  const [left, mid, right] = service.layout;

  /**
   * For each cell-position we decide what it contains. The position
   * also determines which borders the text cell needs:
   *   - col 1 → border-r on right (so the frame borders the text on
   *             its left outer edge, top, bottom, and right inner edge)
   *   - col 2 → border-l + border-r (frame on both sides)
   *   - col 3 → border-l (frame on the left only)
   */
  /**
   * Borders — only text cells carry hairlines (the saisei reference
   * style). The frame hugs the text block on its outer edge:
   *   col 0 → border-r (frame on the right)
   *   col 1 → border-l + border-r (frame on both sides)
   *   col 2 → border-l (frame on the left)
   * Plus `border-t` + `border-b` so the row reads as a self-contained
   * band wherever text appears.
   *
   * Image and empty cells stay borderless, so adjacent photos never
   * visually merge with anything.
   */
  const textBorders = (pos: 0 | 1 | 2) => {
    if (pos === 0) return "border-t border-r border-b border-zinc-300";
    if (pos === 1) return "border-t border-l border-r border-zinc-300";
    return "border-t border-l border-b border-zinc-300";
  };

  const renderCell = (kind: Cell, pos: 0 | 1 | 2) => {
    if (kind === "empty") {
      // Empty cells stay borderless — they only exist to hold the
      // grid's column rhythm.
      return <div key={pos} aria-hidden className="hidden md:block" />;
    }

    if (kind === "image") {
      return (
        <div
          key={pos}
          data-reveal
          className={
            "relative aspect-[3/4] w-full overflow-hidden bg-zinc-200 md:aspect-auto " +
            service.rowHeight
          }
        >
          <div data-parallax="0.10" className="absolute inset-0">
            <Image
              src={service.src}
              alt=""
              aria-hidden
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        </div>
      );
    }

    // text cell
    return (
      <div
        key={pos}
        data-reveal
        className={
          "flex flex-col justify-between gap-8 p-8 md:p-10 lg:p-12 " +
          service.rowHeight +
          " " +
          textBorders(pos)
        }
      >
        <h3 className="font-display text-2xl font-light italic text-zinc-900 md:text-3xl">
          {service.label}
        </h3>
        <p className="max-w-[42ch] text-sm leading-relaxed text-zinc-600 md:text-[15px]">
          {service.body}
        </p>
      </div>
    );
  };

  return (
    <>
      {renderCell(left, 0)}
      {renderCell(mid, 1)}
      {renderCell(right, 2)}
    </>
  );
}
