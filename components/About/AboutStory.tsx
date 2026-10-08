"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AboutStory.module.css";
import AnimatedWords from "@/components/ui/AnimatedWords";

const HERO_IMAGE = "https://cdn.sthyra.com/AADHYA%20SERENE/images/HighresScreenshot00034.png";
const BEDROOM_IMAGE = "https://cdn.sthyra.com/MISTY_WOODS_IMAGES/upscaled%20image%20(1).jpg";
const KITCHEN_IMAGE = "https://cdn.sthyra.com/MISTY_WOODS_IMAGES/WhatsApp%20Image%202026-08-10%20at%2012.23.09%20PM.jpeg";

const SCENES = [
  { id: "our-story", label: "Our story" },
  { id: "our-beginning", label: "Our beginning" },
  { id: "our-bengaluru-story", label: "Bengaluru" },
  { id: "our-story-today", label: "Today" },
] as const;

export default function AboutStory() {
  const mainRef = useRef<HTMLElement>(null);
  const splitRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(0);
  const [showRail, setShowRail] = useState(false);

  useEffect(() => {
    const split = splitRef.current;
    if (!split) return;
    const splitObserver = new IntersectionObserver(
      ([entry]) => setShowRail(entry.isIntersecting),
      { rootMargin: "-50% 0px 0px 0px", threshold: 0 },
    );
    splitObserver.observe(split);
    const sceneObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = SCENES.findIndex(({ id }) => id === entry.target.id);
            if (index >= 0) setActiveScene(index);
          }
        });
      },
      { rootMargin: "-30% 0px -45% 0px" },
    );
    SCENES.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) sceneObserver.observe(section);
    });
    return () => {
      splitObserver.disconnect();
      sceneObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const main = mainRef.current;
    if (!main || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-about-photo]",
        { clipPath: "inset(29% 36% 29% 36%)", scale: 0.94 },
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.65, ease: "power3.inOut" },
      );
      gsap.utils.toArray<HTMLElement>("[data-word-reveal]").forEach((element) => {
        const words = element.querySelectorAll<HTMLElement>("[data-reveal-word]");
        gsap.fromTo(
          words,
          { autoAlpha: 0, yPercent: 110 },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.8,
            stagger: 0.035,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 88%", toggleActions: "play none none reverse" },
          },
        );
      });
      gsap.utils.toArray<HTMLElement>("[data-about-rise]").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 42 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 90%", toggleActions: "play none none reverse" },
          },
        );
      });
    }, main);
    return () => context.revert();
  }, []);

  return (
    <main ref={mainRef} id="about" className={styles.page}>
      <div ref={splitRef} className={styles.split}>
        <figure className={styles.photoPanel}>
          <div data-about-photo className={styles.photoFrame}>
            <Image src={HERO_IMAGE} alt="Exterior of an Abhigna residential project" fill priority sizes="(max-width: 800px) 100vw, 50vw" className={styles.photoImage} />
          </div>
          <figcaption className={styles.photoCaption}><span>Abhigna Constructions</span><span>Our story</span></figcaption>
        </figure>

        <div className={styles.narrative}>
          <section id="our-story" className={`${styles.scene} ${styles.opening}`} aria-labelledby="about-heading">
            <div className={styles.topline}><span>Abhigna Constructions</span><span>01 / 04</span></div>
            <div className={styles.openingContent}>
              <p data-about-rise className={styles.eyebrow}>Our story</p>
              <h1 id="about-heading" aria-label="Some builders begin with a piece of land. Ours began with two civil engineers."><AnimatedWords text="Some builders begin with a piece of land." /> <br /><AnimatedWords text="Ours began with two civil engineers." /></h1>
              <div className={styles.openingBody}>
                <p data-about-rise>Bhaskar Reddy has spent thirty-five years on construction sites. x, his wife and partner in every sense, is a civil engineer too. Between them they have spent over x years, learning how deep a foundation must go in a particular soil, how long a slab must cure before it carries weight, how a drain must fall to still run after twenty monsoons.</p>
                <p data-about-rise>For years they used that knowledge to build for other people. But an engineer who builds for others learns exactly where corners get cut.</p>
              </div>
            </div>
          </section>

          <section id="our-beginning" className={`${styles.scene} ${styles.beginning}`} aria-labelledby="beginning-heading">
            <div className={styles.topline}><span>Our beginning</span><span>02 / 04</span></div>
            <div className={styles.beginningContent}>
              <h2 id="beginning-heading" className={styles.year}><AnimatedWords text="2007." /></h2>
              <p data-about-rise>So in 2007, in [hometown], they began building under their own name. Small projects, close to home, for families.</p>
              <p data-about-rise>They called the company Abhigna, from the Sanskrit for deep knowing: the kind of understanding that only comes from years of doing the work.</p>
            </div>
            <figure data-about-rise className={styles.inlineImage}>
              <Image src={BEDROOM_IMAGE} alt="Finished bedroom in an Abhigna home" fill sizes="(max-width: 800px) 100vw, 32vw" />
            </figure>
            <blockquote className={styles.firstQuote}><AnimatedWords text="“We have never tried to be the biggest builder in Bengaluru. We would rather be the one whose buildings still look right in thirty years." /></blockquote>
          </section>

          <section id="our-bengaluru-story" className={`${styles.scene} ${styles.bengaluru}`} aria-labelledby="bengaluru-heading">
            <div className={styles.topline}><span>Bengaluru</span><span>03 / 04</span></div>
            <div className={styles.bengaluruContent}>
              <h2 id="bengaluru-heading"><AnimatedWords text="Bengaluru." /></h2>
              <p data-about-rise>Around [2016], the family brought that same way of working to Bengaluru. The city was growing faster than it could be built well. Abhigna chose the slower path: fewer projects, each planned completely before the first brick, each led by an engineer from soil test to handover.</p>
            </div>
            <figure data-about-rise className={styles.inlineImage}>
              <Image src={KITCHEN_IMAGE} alt="Finished kitchen in an Abhigna home" fill sizes="(max-width: 800px) 100vw, 32vw" />
            </figure>
            <p data-about-rise className={styles.longParagraph}>Much of that work came through landowners who trusted the family with land their own families had held for generations. In JP Nagar, that trust became Abhigna Misty Woods. The plot was full of mature trees, the kind most developers clear in the first week. We designed around them instead, built the community, sold it ourselves and handed over every key. The families who live there now tell that story better than we can, in their own words.</p>
          </section>

          <section id="our-story-today" className={`${styles.scene} ${styles.today}`} aria-labelledby="today-heading">
            <div className={styles.topline}><span>Today</span><span>04 / 04</span></div>
            <div className={styles.todayContent}>
              <h2 id="today-heading"><AnimatedWords text="Nearly two decades on." /></h2>
              <p data-about-rise>Nearly two decades on, Abhigna has delivered close to one million square feet of homes, and a second generation has joined the business. They bring new ideas about design and how families want to live today.</p>
              <blockquote className={styles.lastQuote}><AnimatedWords text={'"I have never sold a home I would not live in myself.”'} /></blockquote>
            </div>
          </section>
        </div>
      </div>

      <nav className={`${styles.progressRail} ${showRail ? styles.progressRailVisible : ""} ${activeScene === 1 ? styles.progressRailDark : ""}`} aria-label="About page sections">
        {SCENES.map((scene, index) => <a key={scene.id} href={`#${scene.id}`} aria-label={scene.label} aria-current={activeScene === index ? "location" : undefined} className={activeScene === index ? styles.progressActive : ""}><span /></a>)}
      </nav>

    </main>
  );
}
