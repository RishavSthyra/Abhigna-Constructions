"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ensureGsapPlugins } from "@/components/Nav/gsap/easings";
import styles from "@/app/home.module.css";

export default function ProjectsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const carousel = carouselRef.current;
    const section = carousel?.closest("section");
    if (!track || !carousel || !section) return;

    ensureGsapPlugins();

    const media = gsap.matchMedia();
    const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);

    const pinProjects = (pinTarget: HTMLElement, start: string) => {
      track.scrollLeft = 0;
      const tween = gsap.fromTo(
        track,
        { scrollLeft: 0 },
        {
          scrollLeft: distance,
          ease: "none",
          scrollTrigger: {
            trigger: pinTarget,
            start,
            end: () => `+=${distance()}`,
            pin: pinTarget,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        },
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        track.scrollLeft = 0;
      };
    };

    // The full section fits on desktop. On smaller screens, pin just the
    // cards so the introduction scrolls away before the project sequence.
    media.add("(min-width: 1001px) and (prefers-reduced-motion: no-preference)", () =>
      pinProjects(section, "top top"),
    );
    media.add("(max-width: 1000px) and (prefers-reduced-motion: no-preference)", () =>
      pinProjects(carousel, "top 76px"),
    );

    return () => media.revert();
  }, []);

  return (
    <div ref={carouselRef} className={styles.projectsCarousel}>
      <div
        ref={trackRef}
        className={styles.projectTrack}
        role="region"
        aria-label="Residential projects"
        tabIndex={0}
      >
        <article className={`${styles.projectCard} ${styles.projectCardDark}`}>
          <Image src="/projects/aadhya-serene-card.avif" alt="Architectural rendering of Aadhya Serene" fill sizes="(max-width: 700px) 86vw, (max-width: 1000px) 45vw, 33vw" className={styles.projectImage} />
          <div className={styles.projectShade} />
          <div className={styles.projectStatus}><span>Ongoing</span></div>
          <div className={styles.projectBottom}>
            <span className={styles.projectLocation}>Manyata Tech Park · Bengaluru</span>
            <h3>Aadhya<br />Serene</h3>
            <p>Considered spaces for a more meaningful everyday.</p>
            <a href="https://www.aadhyaserene.com/" target="_blank" rel="noopener noreferrer" className={styles.projectLink}>View project <span aria-hidden="true">↗</span></a>
          </div>
        </article>

        <article className={`${styles.projectCard} ${styles.projectCardGreen}`}>
          <Image src="/misty-woods-trees.webp" alt="Greenery at Misty Woods" fill sizes="(max-width: 700px) 86vw, (max-width: 1000px) 45vw, 33vw" className={styles.projectImage} />
          <div className={styles.projectShade} />
          <div className={styles.projectStatus}><span>Completed</span></div>
          <div className={styles.projectBottom}>
            <span className={styles.projectLocation}>JP Nagar · Bengaluru</span>
            <h3>Misty<br />Woods</h3>
            <p>A quieter rhythm of life, surrounded by green.</p>
            <Link href="/contact" className={styles.projectLink}>Enquire now <span aria-hidden="true">↗</span></Link>
          </div>
        </article>

        <article className={`${styles.projectCard} ${styles.projectCardBlue}`}>
          <Image src="/nav-building.avif" alt="" fill sizes="(max-width: 700px) 86vw, (max-width: 1000px) 45vw, 33vw" className={styles.projectImage} />
          <div className={styles.projectShade} />
          <div className={styles.projectStatus}><span>Completed</span></div>
          <div className={styles.projectBottom}>
            <span className={styles.projectLocation}>Electronic City Phase II · Bengaluru</span>
            <h3 className={styles.projectLongTitle}>SRC Opulent<br />Bluebells</h3>
            <p>Explore this Abhigna community in Electronic City.</p>
            <a href="https://huntvastuhomes.com/opulent-src-bluebells-vastu-apartments-ananth-nagar-bengaluru" target="_blank" rel="noopener noreferrer" className={styles.projectLink}>View project <span aria-hidden="true">↗</span></a>
          </div>
        </article>
      </div>

    </div>
  );
}
