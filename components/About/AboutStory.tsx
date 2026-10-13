"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AboutStory.module.css";
import AnimatedWords from "@/components/ui/AnimatedWords";

const HERO_IMAGE = "/about/about-aerial.jpg";
const BEDROOM_IMAGE = "/about/about-bedroom.jpg";
const KITCHEN_IMAGE = "/about/about-kitchen.jpg";

const SCENES = [
  { id: "our-story", label: "Our story" },
  { id: "our-beginning", label: "Our beginning" },
  { id: "our-bengaluru-story", label: "Our approach" },
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
              <h1 id="about-heading" aria-label="Engineering-led homes since 2007."><AnimatedWords text="Engineering-led" /> <br /><AnimatedWords text="homes since 2007." /></h1>
              <div className={styles.openingBody}>
                <p data-about-rise>Abhigna Constructions is a residential developer founded in 2007 by civil engineer Bhaskar Reddy. Backed by over 35 years of construction expertise, the company has delivered close to one million square feet of residential development across Nellore and Bengaluru.</p>
                <p data-about-rise>Every Abhigna project is planned in full before construction begins and overseen by qualified engineers from soil testing to handover. Our focus is quality construction, Vastu-compliant design and on-time delivery.</p>
              </div>
            </div>
          </section>

          <section id="our-beginning" className={`${styles.scene} ${styles.beginning}`} aria-labelledby="beginning-heading">
            <div className={styles.topline}><span>Our beginning</span><span>02 / 04</span></div>
            <div className={styles.beginningContent}>
              <h2 id="beginning-heading" className={styles.year}><AnimatedWords text="2007." /></h2>
              <p data-about-rise>Abhigna Constructions began in 2007 with a focus on residential development and a hands-on, engineer-led way of working.</p>
              <p data-about-rise>Each home starts with careful planning. Qualified engineers oversee the work from soil testing through construction and handover.</p>
            </div>
            <figure data-about-rise className={styles.inlineImage}>
              <Image src={BEDROOM_IMAGE} alt="Finished bedroom in an Abhigna home" fill sizes="(max-width: 800px) 100vw, 32vw" />
            </figure>
            <blockquote className={styles.firstQuote}><AnimatedWords text="Built with care from the ground up." /></blockquote>
          </section>

          <section id="our-bengaluru-story" className={`${styles.scene} ${styles.bengaluru}`} aria-labelledby="bengaluru-heading">
            <div className={styles.topline}><span>Our approach</span><span>03 / 04</span></div>
            <div className={styles.bengaluruContent}>
              <h2 id="bengaluru-heading"><AnimatedWords text="Built with intent." /></h2>
              <p data-about-rise>Our projects are planned in full before construction begins. That preparation lets us focus on the details that matter in everyday life: sound construction, thoughtful layouts and homes designed to last.</p>
            </div>
            <figure data-about-rise className={styles.inlineImage}>
              <Image src={KITCHEN_IMAGE} alt="Finished kitchen in an Abhigna home" fill sizes="(max-width: 800px) 100vw, 32vw" />
            </figure>
            <p data-about-rise className={styles.longParagraph}>Abhigna has delivered close to one million square feet of residential development. Across every project, the priorities remain the same: quality construction, Vastu-compliant design and on-time delivery.</p>
          </section>

          <section id="our-story-today" className={`${styles.scene} ${styles.today}`} aria-labelledby="today-heading">
            <div className={styles.topline}><span>Today</span><span>04 / 04</span></div>
            <div className={styles.todayContent}>
              <h2 id="today-heading"><AnimatedWords text="The work continues." /></h2>
              <p data-about-rise>Since 2007, our commitment has stayed the same: plan thoroughly, build responsibly and hand over homes we believe in.</p>
              <blockquote className={styles.lastQuote}><AnimatedWords text="“I have never sold a home I would not live in myself.”" /></blockquote>
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
