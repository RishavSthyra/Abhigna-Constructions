"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Testimonials.module.css";

const STORIES = [
  {
    name: "Deepak",
    initials: "D",
    quote: "They were very helpful, considerate.",
    detail: "The team answered his questions and delivered the home in time for his family to plan their interiors.",
  },
  {
    name: "Shri Ram",
    initials: "SR",
    quote: "I really love this place.",
    detail: "He speaks about the personal feel of his home and the quality of its construction.",
  },
  {
    name: "Ajay Jain",
    initials: "AJ",
    quote: "We are happy here.",
    detail: "For his family, Misty Woods has felt like a worthwhile investment.",
  },
] as const;

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % STORIES.length);
    }, 6500);

    return () => window.clearTimeout(timer);
  }, [active, paused, visible]);

  const story = STORIES[active];

  return (
    <section ref={sectionRef} id="testimonials" className={styles.section} aria-labelledby="testimonials-title">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <span className={styles.eyebrow}>Resident stories</span>
          <h2 id="testimonials-title">Hear it from the people who call it home.</h2>
          <p>Life at Misty Woods, told by the people living there.</p>
        </header>

        <div className={styles.layout}>
          <div
            className={styles.storyPanel}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
            }}
          >
            <div className={styles.panelTop}>
              <span>Misty Woods residents</span>
              <span>{String(active + 1).padStart(2, "0")} / {String(STORIES.length).padStart(2, "0")}</span>
            </div>

            <article key={story.name} className={styles.storyCard} aria-live="polite">
              <span className={styles.quoteMark} aria-hidden="true">“</span>
              <blockquote>{story.quote}</blockquote>
              <p className={styles.detail}>{story.detail}</p>
              <div className={styles.person}>
                <span className={styles.avatar} aria-hidden="true">{story.initials}</span>
                <div>
                  <strong>{story.name}</strong>
                  <span>Misty Woods homeowner</span>
                </div>
              </div>
            </article>

            <div className={styles.controls} role="group" aria-label="Choose a resident story">
              {STORIES.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  className={index === active ? styles.activeControl : styles.control}
                  onClick={() => setActive(index)}
                  aria-label={`Show ${item.name}'s story`}
                  aria-current={index === active ? "true" : undefined}
                >
                  <span />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.videoPanel}>
            <div className={styles.videoFrame}>
              <iframe
                src="https://www.youtube-nocookie.com/embed/WRxV0QM_btc?rel=0"
                title="Abhigna Misty Woods homeowner testimonials"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className={styles.videoCaption}>
              <span>Watch their stories</span>
              <span>Misty Woods · Bengaluru</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
