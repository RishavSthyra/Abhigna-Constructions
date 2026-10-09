"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  PiCompassToolThin,
  PiHardHatThin,
  PiLeafThin,
  PiMapPinLineThin,
  PiShieldCheckThin,
} from "react-icons/pi";
import styles from "./ServicesGrid.module.css";

const SERVICES = [
  {
    title: "Engineer-led, end to end.",
    body: "Every Abhigna project is led by civil engineers, from soil test to handover.",
    Icon: PiHardHatThin,
  },
  {
    title: "Vastu-compliant by design",
    body: "Every plan we build follows Vastu: entrances, kitchens, bedrooms and light placed as tradition and good sense agree.",
    Icon: PiCompassToolThin,
  },
  {
    title: "Location chosen with care",
    body: "We build only where connectivity, schools, workplaces and everyday life come together, in neighbourhoods we expect to hold their value for decades.",
    Icon: PiMapPinLineThin,
  },
  {
    title: "Materials built to last",
    body: "We use the materials we specify, with no substitutions, and we give the same care to foundations, waterproofing and drainage as we do to the lobby.",
    Icon: PiShieldCheckThin,
  },
  {
    title: "Green by habit",
    body: "We keep mature trees wherever the site allows, harvest rainwater, and plan for daylight and cross-ventilation so homes stay cooler and use less.",
    Icon: PiLeafThin,
  },
] as const;

type ServicesGridProps = { headingLevel?: "h1" | "h2" };

export default function ServicesGrid({ headingLevel = "h1" }: ServicesGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const Heading = headingLevel;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const intro = gsap.utils.toArray<HTMLElement>("[data-services-intro]");
      const top = gsap.utils.toArray<HTMLElement>("[data-services-top]");
      const bottom = gsap.utils.toArray<HTMLElement>("[data-services-bottom]");

      gsap.fromTo(intro, {
        autoAlpha: 0,
        y: 30,
      }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 82%", once: true },
      });

      [top, bottom].forEach((row) => {
        if (!row.length) return;
        gsap.fromTo(row, {
          autoAlpha: 0,
          y: 54,
          filter: "blur(6px)",
        }, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.95,
          stagger: 0.16,
          ease: "power3.out",
          scrollTrigger: { trigger: row[0], start: "top 82%", once: true },
        });
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className={styles.section}
      aria-labelledby="services-title"
    >
      <div className={styles.inner}>
        <div className={styles.intro}>
          <p data-services-intro className={styles.eyebrow}>Our Services</p>
          <Heading data-services-intro id="services-title" className={styles.title}>
            <span>Why Families Choose</span>{" "}
            <span>Abhigna Constructions</span>
          </Heading>
        </div>

        <div className={styles.grid}>
          {SERVICES.map(({ title, body, Icon }, index) => (
            <article
              key={title}
              data-services-top={index < 2 ? "" : undefined}
              data-services-bottom={index >= 2 ? "" : undefined}
              className={`${styles.panel} ${index < 2 ? styles.feature : styles.standard}`}
            >
              <div className={styles.panelHeading}>
                <Icon className={styles.icon} aria-hidden="true" />
                <h3>{title}</h3>
              </div>
              <p className={styles.body}>{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
