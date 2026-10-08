"use client";

import { useEffect, useRef, useState } from "react";

const CURSOR_SIZE = 18;

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    let x = -1000;
    let y = -1000;
    let ringX = -1000;
    let ringY = -1000;

    const render = () => {
      ringX += (x - ringX) * 0.22;
      ringY += (y - ringY) * 0.22;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    const onMove = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const html = document.documentElement;
    const updateNavState = () => {
      setNavOpen(html.classList.contains("nav-is-open"));
    };
    updateNavState();
    const navObserver = new MutationObserver(updateNavState);
    navObserver.observe(html, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      navObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full border transition-[opacity,border-color] duration-200"
      style={{
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        opacity: visible ? 1 : 0,
        backgroundColor: "transparent",
        borderColor: navOpen
          ? "rgba(245, 236, 223, 0.85)"
          : "rgba(20, 17, 15, 0.6)",
      }}
    />
  );
}
