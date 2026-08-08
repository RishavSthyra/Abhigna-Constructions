"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor.
 * - Default: small circle, no dot, no label
 * - Over an image (data-cursor="image" or .cursor-target): the ring expands
 *   into a larger circle. The portion of the image under the circle is shown
 *   INVERTED (negative effect) using a duplicated, CSS-filtered copy of the
 *   image clipped to the circle and positioned in the same spot on the page.
 *
 * The image itself is NOT modified — the inverted copy is what creates the
 * "negative inside the circle" effect.
 */

type Mode = "default" | "view";

const VIEW_SIZE = 120; // diameter of the expanded circle
const DEFAULT_SIZE = 14;

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const loupeRef = useRef<HTMLDivElement | null>(null);
  const loupeImgRef = useRef<HTMLImageElement | null>(null);
  const [mode, setMode] = useState<Mode>("default");
  const [visible, setVisible] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);
  const targetRectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    let raf = 0;
    let x = -1000;
    let y = -1000;
    let rx = -1000;
    let ry = -1000;

    const render = () => {
      // ring follows with slight lag, loupe snaps exactly to the cursor
      rx += (x - rx) * 0.22;
      ry += (y - ry) * 0.22;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      if (loupeRef.current && targetRef.current && targetRectRef.current) {
        const r = targetRectRef.current;
        // Position the loupe clone so the same point on the image sits under the cursor
        loupeRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        // Offset the duplicated image so the right pixel lines up
        const localX = x - r.left;
        const localY = y - r.top;
        loupeImgRef.current!.style.transform = `translate3d(${-localX + VIEW_SIZE / 2}px, ${-localY + VIEW_SIZE / 2}px, 0)`;
        loupeImgRef.current!.style.width = `${r.width}px`;
        loupeImgRef.current!.style.height = `${r.height}px`;
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) setVisible(true);

      const el = document.elementFromPoint(x, y) as HTMLElement | null;
      const target = findImageTarget(el);
      if (target !== targetRef.current) {
        targetRef.current = target;
        if (target) {
          const rect = target.getBoundingClientRect();
          targetRectRef.current = rect;
          // Use the image's actual src if available
          const img = target.querySelector("img") as HTMLImageElement | null;
          if (img && loupeImgRef.current) {
            loupeImgRef.current.src = img.src;
          } else if (target instanceof HTMLImageElement && loupeImgRef.current) {
            loupeImgRef.current.src = target.src;
          }
        } else {
          targetRectRef.current = null;
        }
      } else if (target && targetRectRef.current) {
        // Keep rect fresh as the image may move on scroll/transition
        targetRectRef.current = target.getBoundingClientRect();
      }
      setMode(target ? "view" : "default");
    };

    const onLeave = () => {
      setVisible(false);
      targetRef.current = null;
      targetRectRef.current = null;
    };

    const onEnter = () => setVisible(true);

    // Watch the html element for the `nav-is-open` class — when the
    // overlay menu is open, we flip the cursor to light so it stays
    // visible on the dark backdrop.
    const htmlEl = document.documentElement;
    const observeNav = () => {
      setNavOpen(htmlEl.classList.contains("nav-is-open"));
    };
    observeNav();
    const navObserver = new MutationObserver(observeNav);
    navObserver.observe(htmlEl, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    function onScroll() {
      if (targetRef.current) {
        targetRectRef.current = targetRef.current.getBoundingClientRect();
      }
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      navObserver.disconnect();
    };
  }, [visible]);

  const size = mode === "view" ? VIEW_SIZE : DEFAULT_SIZE;

  // When the nav is open, the cursor flips to a light color so it
  // stays visible on the dark backdrop.
  const ringColor = navOpen
    ? "rgba(245, 236, 223, 0.95)"
    : mode === "view"
      ? "rgba(20,17,15,0)"
      : "rgba(20,17,15,0.85)";

  return (
    <>
      {/* Tracking ring (the visible cursor) */}
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full border transition-[width,height,opacity,background-color,border-color] duration-300 ease-out"
        style={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          backgroundColor: "rgba(255,255,255,0)",
          borderColor: ringColor,
        }}
      />

      {/* Loupe — only visible when over an image. Shows a negative
          copy of the image clipped to the cursor circle. */}
      <div
        ref={loupeRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] overflow-hidden rounded-full ring-1 ring-zinc-900/10 transition-opacity duration-200"
        style={{
          width: VIEW_SIZE,
          height: VIEW_SIZE,
          opacity: visible && mode === "view" ? 1 : 0,
          boxShadow: "0 8px 30px rgba(20,17,15,0.18)",
        }}
      >
        <img
          ref={loupeImgRef}
          alt=""
          className="absolute left-0 top-0 max-w-none select-none"
          style={{
            filter: "invert(1) hue-rotate(180deg)",
            transformOrigin: "0 0",
          }}
          draggable={false}
        />
      </div>
    </>
  );
}

function findImageTarget(el: HTMLElement | null): HTMLElement | null {
  let cur: HTMLElement | null = el;
  while (cur) {
    if (cur.dataset && cur.dataset.cursor === "image") return cur;
    if (cur.classList && cur.classList.contains("cursor-target")) return cur;
    cur = cur.parentElement;
  }
  return null;
}
