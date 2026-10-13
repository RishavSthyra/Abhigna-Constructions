"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/home.module.css";

function ProjectArrow() {
  return <span aria-hidden="true" className={styles.arrowIcon}>↗</span>;
}

export default function ProjectsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanPrevious(track.scrollLeft > 2);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(updateControls);
    observer.observe(track);
    updateControls();
    return () => observer.disconnect();
  }, [updateControls]);

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.firstElementChild;
    const cardWidth = firstCard?.getBoundingClientRect().width ?? track.clientWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (cardWidth + gap), behavior: "smooth" });
  };

  return (
    <div className={styles.projectsCarousel}>
      <div
        ref={trackRef}
        className={styles.projectTrack}
        onScroll={updateControls}
        role="region"
        aria-label="Residential projects"
        tabIndex={0}
      >
        <article className={`${styles.projectCard} ${styles.projectCardDark}`}>
          <Image src="/Hero/withour bg Night View Aadhya Serene.avif" alt="Architectural rendering of Aadhya Serene" fill sizes="(max-width: 700px) 86vw, (max-width: 1000px) 45vw, 33vw" className={styles.projectImage} />
          <div className={styles.projectShade} />
          <div className={styles.projectStatus}><span>Ongoing</span></div>
          <div className={styles.projectBottom}>
            <span className={styles.projectLocation}>Manyata Tech Park · Bengaluru</span>
            <h3>Aadhya<br />Serene</h3>
            <p>Considered spaces for a more meaningful everyday.</p>
            <a href="https://www.aadhyaserene.com/" target="_blank" rel="noopener noreferrer" className={styles.lightPill}>View project <ProjectArrow /></a>
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
            <Link href="/contact" className={styles.lightPill}>Enquire now <ProjectArrow /></Link>
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
            <a href="https://huntvastuhomes.com/opulent-src-bluebells-vastu-apartments-ananth-nagar-bengaluru" target="_blank" rel="noopener noreferrer" className={styles.lightPill}>View project <ProjectArrow /></a>
          </div>
        </article>
      </div>

      <div className={styles.projectControls} aria-label="Project carousel controls">
        <button type="button" onClick={() => move(-1)} disabled={!canPrevious} aria-label="Previous project">←</button>
        <button type="button" onClick={() => move(1)} disabled={!canNext} aria-label="Next project">→</button>
      </div>
    </div>
  );
}
