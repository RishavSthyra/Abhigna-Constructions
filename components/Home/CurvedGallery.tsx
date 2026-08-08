"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";

type GalleryImage = {
  id: number;
  src: string;
  alt: string;
};

type GalleryLayout = {
  cardWidth: number;
  cardHeight: number;
  gap: number;
  radius: number;
  angleStep: number;
  cameraDistance: number;
  visibleAngle: number;
  fadeWidth: number;
};

const GALLERY_IMAGES: readonly GalleryImage[] = [
  {
    id: 1,
    src: "https://cdn.sthyra.com/AADHYA%20SERENE/images/HighresScreenshot00034.png",
    alt: "Contemporary luxury villa with an infinity pool",
  },
  {
    id: 2,
    src: "https://cdn.sthyra.com/AADHYA%20SERENE/images/Swimming%20Pool.avif",
    alt: "Modern residence surrounded by natural landscaping",
  },
  {
    id: 3,
    src: "https://cdn.sthyra.com/AADHYA%20SERENE/images/image5.avif",
    alt: "Minimal contemporary residential interior",
  },
  {
    id: 4,
    src: "https://cdn.sthyra.com/AADHYA%20SERENE/images/interiorimage7.avif",
    alt: "Elegant modern home with warm architectural lighting",
  },
  {
    id: 5,
    src: "https://cdn.sthyra.com/AADHYA%20SERENE/images/INterior%20(2).png",
    alt: "Refined luxury living space with neutral finishes",
  },
  {
    id: 6,
    src: "https://cdn.sthyra.com/AADHYA%20SERENE/images/INterior%20(3).png",
    alt: "Modern house framed by mature trees",
  },
  {
    id: 7,
    src: "https://cdn.sthyra.com/AADHYA%20SERENE/images/images.jpeg",
    alt: "Premium residential interior with natural materials",
  },
  {
    id: 8,
    src: "https://cdn.sthyra.com/AADHYA%20SERENE/images/HERO_KITCHEN.avif",
    alt: "Contemporary architectural interior with soft daylight",
  },
  {
    id: 9,
    src: "https://cdn.sthyra.com/AADHYA%20SERENE/images/central-park-big1.png",
    alt: "Luxury home with clean modern architecture",
  },
  {
    id: 10,
    src: "https://cdn.sthyra.com/AADHYA%20SERENE/images/2_copy_1920x1440.jpg",
    alt: "Sophisticated residence with warm minimal styling",
  },
  {
    id: 11,
    src: "https://cdn.sthyra.com/AADHYA%20SERENE/images/HERO_3_NEW.avif",
    alt: "Modern white home with a landscaped courtyard",
  },
  {
    id: 12,
    src: "https://cdn.sthyra.com/AADHYA%20SERENE/images/badminton.avif",
    alt: "Contemporary dining room with natural light",
  },
  {
    id: 13,
    src: "https://cdn.sthyra.com/AADHYA%20SERENE/images/Exterior%20Shots%20(8).png",
    alt: "Architect-designed home with a tranquil garden",
  },
  {
    id: 14,
    src: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200&q=85&auto=format&fit=crop",
    alt: "Warm contemporary living space with refined detailing",
  },
];

const TAU = Math.PI * 2;
const RADIANS_TO_DEGREES = 180 / Math.PI;
const MIN_LAYOUT_WIDTH = 360;
const MAX_LAYOUT_WIDTH = 1680;
const AUTO_ROTATION_RADIANS_PER_SECOND = TAU / 44;
const AUTO_ROTATION_DELAY_MS = 900;
const DRAG_ROTATION_PER_VIEWPORT = TAU * 0.76;
const VELOCITY_FRICTION_PER_SECOND = 4.7;
const MAX_INERTIA_RADIANS_PER_SECOND = TAU * 0.62;
const MIN_INERTIA_RADIANS_PER_SECOND = 0.002;
const MAX_FRAME_DELTA_SECONDS = 1 / 20;
const RADIUS_EXPANSION_FACTOR = 1.02;
const DEPTH_AMPLIFICATION = 1.28;

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(Math.max(value, minimum), maximum);

const lerp = (start: number, end: number, progress: number): number =>
  start + (end - start) * progress;

const getViewportProgress = (width: number): number =>
  clamp(
    (width - MIN_LAYOUT_WIDTH) / (MAX_LAYOUT_WIDTH - MIN_LAYOUT_WIDTH),
    0,
    1,
  );

const wrapAngle = (angle: number): number => {
  const wrapped = (angle + Math.PI) % TAU;
  return wrapped < 0 ? wrapped + Math.PI : wrapped - Math.PI;
};

/**
 * The slot width is the physical arc length reserved by one card. Deriving the
 * radius from it guarantees a rigid, fixed gap all the way around the cylinder.
 */
const createGalleryLayout = (
  viewportWidth: number,
  cardCount: number,
): GalleryLayout => {
  const width = Math.max(viewportWidth, MIN_LAYOUT_WIDTH);
  const progress = getViewportProgress(width);
  const cardWidth = width * lerp(0.5, 0.19, progress);
  const cardHeight = cardWidth * lerp(1.31, 1.22, progress);
  const angleStep = TAU / cardCount;
  const baseGap = cardWidth * lerp(0.05, 0.035, progress);
  const baseRadius = (cardCount * (cardWidth + baseGap)) / TAU;
  const radius = baseRadius * RADIUS_EXPANSION_FACTOR;
  const gap = radius * angleStep - cardWidth;

  return {
    cardWidth,
    cardHeight,
    gap,
    radius,
    angleStep,
    cameraDistance: width * lerp(1.68, 1.56, progress),
    visibleAngle: lerp(1.42, 1.5, progress),
    fadeWidth: cardWidth * lerp(0.82, 1.16, progress),
  };
};

export default function CurvedGallery() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const layoutRef = useRef<GalleryLayout | null>(null);
  const stageWidthRef = useRef(0);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const lastInteractionTimeRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const previousFrameTimeRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);
  const [layout, setLayout] = useState<GalleryLayout | null>(null);

  const renderCards = () => {
    const currentLayout = layoutRef.current;
    if (!currentLayout) return;

    for (let index = 0; index < GALLERY_IMAGES.length; index += 1) {
      const card = cardRefs.current[index];
      if (!card) continue;

      const angle = wrapAngle(
        index * currentLayout.angleStep + rotationRef.current,
      );
      const visibility = 1 - Math.abs(angle) / currentLayout.visibleAngle;
      const isVisible = visibility > 0;
      const depth =
        currentLayout.radius * (1 - Math.cos(angle)) * DEPTH_AMPLIFICATION;
      const horizontalPosition = currentLayout.radius * Math.sin(angle);
      const rotationDegrees = -angle * RADIANS_TO_DEGREES;

      // CSS perspective performs the scale projection. No manual scale is used.
      card.style.transform = `translate3d(calc(-50% + ${horizontalPosition}px), -50%, ${depth}px) rotateY(${rotationDegrees}deg)`;
      card.style.opacity = String(clamp(visibility * 1.2, 0, 1));
      card.style.visibility = isVisible ? "visible" : "hidden";
      card.style.pointerEvents = visibility > 0.2 ? "auto" : "none";
      card.style.zIndex = String(Math.round(depth * 10));
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      reducedMotionRef.current = mediaQuery.matches;
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const updateLayout = () => {
      stageWidthRef.current = stage.getBoundingClientRect().width;
      const nextLayout = createGalleryLayout(stageWidthRef.current, GALLERY_IMAGES.length);
      layoutRef.current = nextLayout;
      setLayout(nextLayout);
      renderCards();
    };

    const observer = new ResizeObserver(updateLayout);
    observer.observe(stage);
    updateLayout();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!layout) return;

    const animate = (timestamp: number) => {
      const previousTimestamp = previousFrameTimeRef.current ?? timestamp;
      const deltaSeconds = Math.min(
        (timestamp - previousTimestamp) / 1000,
        MAX_FRAME_DELTA_SECONDS,
      );
      previousFrameTimeRef.current = timestamp;

      if (!reducedMotionRef.current && !isDraggingRef.current) {
        if (Math.abs(velocityRef.current) > MIN_INERTIA_RADIANS_PER_SECOND) {
          rotationRef.current += velocityRef.current * deltaSeconds;
          velocityRef.current *= Math.exp(
            -VELOCITY_FRICTION_PER_SECOND * deltaSeconds,
          );
        } else {
          velocityRef.current = 0;
          const idleTime = timestamp - lastInteractionTimeRef.current;

          if (idleTime > AUTO_ROTATION_DELAY_MS) {
            rotationRef.current +=
              AUTO_ROTATION_RADIANS_PER_SECOND * deltaSeconds;
          }
        }
      }

      renderCards();
      frameRef.current = requestAnimationFrame(animate);
    };

    lastInteractionTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      previousFrameTimeRef.current = null;
    };
  }, [layout]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (reducedMotionRef.current) return;

    isDraggingRef.current = true;
    velocityRef.current = 0;
    lastPointerXRef.current = event.clientX;
    lastPointerTimeRef.current = event.timeStamp;
    lastInteractionTimeRef.current = performance.now();
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!isDraggingRef.current) return;

    const deltaX = event.clientX - lastPointerXRef.current;
    const deltaTimeSeconds = Math.max(
      (event.timeStamp - lastPointerTimeRef.current) / 1000,
      1 / 240,
    );
    const stageWidth = stageWidthRef.current || window.innerWidth;
    const angularDelta =
      (deltaX / stageWidth) * DRAG_ROTATION_PER_VIEWPORT;

    rotationRef.current += angularDelta;
    velocityRef.current = clamp(
      angularDelta / deltaTimeSeconds,
      -MAX_INERTIA_RADIANS_PER_SECOND,
      MAX_INERTIA_RADIANS_PER_SECOND,
    );
    lastPointerXRef.current = event.clientX;
    lastPointerTimeRef.current = event.timeStamp;
    lastInteractionTimeRef.current = performance.now();
    renderCards();
  };

  const stopDragging = (event: ReactPointerEvent<HTMLElement>) => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    lastInteractionTimeRef.current = performance.now();

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section
      id="gallery"
      data-scroll-path-section="true"
      data-scroll-path-section-id="gallery"
      data-scroll-path-index="1"
      aria-label="Infinite cylindrical property gallery"
      className="relative flex min-h-[clamp(35rem,78vw,58rem)] w-full items-center overflow-hidden bg-brand-bg"
    >
      <div
        ref={stageRef}
        className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
        style={{
          perspective: layout ? `${layout.cameraDistance}px` : undefined,
          perspectiveOrigin: "50% 50%",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
      >
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {GALLERY_IMAGES.map((image, index) => (
            <article
              key={image.id}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              data-cursor="image"
              className="group absolute left-1/2 top-1/2 overflow-hidden rounded-[clamp(1rem,1.45vw,1.5rem)] bg-zinc-200 shadow-[0_24px_70px_rgba(24,24,27,0.14)] transition-shadow duration-500 hover:shadow-[0_30px_90px_rgba(24,24,27,0.22)]"
              style={{
                width: layout ? `${layout.cardWidth}px` : undefined,
                height: layout ? `${layout.cardHeight}px` : undefined,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 62vw, 25vw"
                priority={index < 3}
                draggable={false}
                className="pointer-events-none select-none object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
              />
            </article>
          ))}
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-30"
        style={{
          width: layout ? `${layout.fadeWidth}px` : undefined,
          background:
            "linear-gradient(90deg, var(--brand-bg, #faf9f7) 0%, rgba(250,249,247,0) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-30"
        style={{
          width: layout ? `${layout.fadeWidth}px` : undefined,
          background:
            "linear-gradient(270deg, var(--brand-bg, #faf9f7) 0%, rgba(250,249,247,0) 100%)",
        }}
      />

    </section>
  );
}
