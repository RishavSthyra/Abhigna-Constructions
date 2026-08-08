"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import NavDock from "./NavDock";
import NavMenu from "./NavMenu";
import { ensureGsapPlugins } from "./gsap/easings";

/**
 * NavOrchestrator — single entry point exposed to the page.
 *
 * Owns:
 *  - the `open` boolean
 *  - the ESC / outside / link-driven close logic
 *  - the GSAP plugin registration (one-time, idempotent)
 *
 * Critically, this *replaces* the previous top-mounted Navbar to keep
 * the rest of the page design untouched. Routing / anchor IDs are
 * identical to the prior Navbar so nothing in the existing sections
 * breaks.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // One-time plugin registration so CustomEase / ScrollTrigger are
  // ready before any timeline prints.
  useEffect(() => {
    ensureGsapPlugins();
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
    // Hand focus back to the hamburger so keyboard users don't get
    // stranded inside the closed-off dialog.
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const toggleMenu = useCallback(() => {
    setOpen((current) => !current);
  }, []);

  // Background scroll lock is handled inside NavMenu, but we want
  // this component's toggling to feel snappy on first click.
  useEffect(() => {
    if (open) {
      document.documentElement.classList.add("nav-is-open");
    } else {
      document.documentElement.classList.remove("nav-is-open");
    }
    return () => {
      document.documentElement.classList.remove("nav-is-open");
    };
  }, [open]);

  // Bridge: NavMenu's hamburger drives `onToggle` which lands here.
  return (
    <>
      <NavDock open={open} onToggle={toggleMenu} triggerRef={triggerRef} />
      <NavMenu open={open} onClose={closeMenu} />
    </>
  );
}
