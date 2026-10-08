"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./SustainabilityFeature.module.css";

type SustainabilityFeatureProps = {
  standalone?: boolean;
};

export default function SustainabilityFeature({
  standalone = false,
}: SustainabilityFeatureProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const Heading = standalone ? "h1" : "h2";

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-sustainability-panel]",
        { autoAlpha: 0.78, y: 28, scale: 0.985 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.15,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 82%", once: true },
        },
      );

      gsap.fromTo(
        "[data-sustainability-reveal]",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.95,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 75%", once: true },
        },
      );

      gsap.fromTo(
        "[data-sustainability-image]",
        { scale: 1.07 },
        {
          scale: 1,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 85%", once: true },
        },
      );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={standalone ? "sustainability-page" : "sustainability"}
      className={`${styles.section} ${standalone ? styles.standalone : ""}`}
      aria-labelledby={standalone ? "sustainability-page-title" : "sustainability-title"}
    >
      <div data-sustainability-panel className={styles.panel}>
        <Image
          data-sustainability-image
          src="/sustainability-landscape.webp"
          alt="Tree-lined green open space with a walking path beside a pond"
          fill
          sizes="100vw"
          className={styles.image}
        />
        <div className={styles.veil} aria-hidden="true" />

        <div className={styles.content}>
          <p data-sustainability-reveal className={styles.eyebrow}>
            — Sustainability
          </p>
          <Heading
            data-sustainability-reveal
            id={standalone ? "sustainability-page-title" : "sustainability-title"}
            className={styles.title}
          >
            Homes That Breathe
          </Heading>
          <p data-sustainability-reveal className={styles.description}>
            Orienting every space for natural light and airflow, reducing the
            need for constant cooling and artificial light.
          </p>
          <Link
            data-sustainability-reveal
            href={standalone ? "/#sustainability" : "/sustainability"}
            className={styles.link}
          >
            {standalone ? "Back to home" : "Explore sustainability"}
            <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
