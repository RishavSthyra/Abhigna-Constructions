"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FiArrowDownRight, FiArrowUpRight, FiMinus, FiPlus } from "react-icons/fi";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./SustainabilityStory.module.css";
import AnimatedWords from "@/components/ui/AnimatedWords";

const VISION = [
  {
    number: "01",
    title: "The land",
    text: "Build around what the site already gives us: its trees, its rain, its light.",
    image: "/sustainability-landscape.webp",
    alt: "Green landscape with mature trees and a walking path",
  },
  {
    number: "02",
    title: "The people",
    text: "Safe sites for those who build our homes, and honest answers for those who buy them.",
    image: "/misty-woods-trees.webp",
    alt: "Mature tree at Abhigna Misty Woods",
  },
  {
    number: "03",
    title: "The promise",
    text: "Dates, plans and approvals in the open, so families can hold us to them.",
    image: "/sustainability-landscape.webp",
    alt: "Tree-lined landscape in warm evening light",
  },
] as const;

const APPROACH = [
  {
    title: "Use water well",
    text: "Rainwater harvesting is built into every project, to recharge groundwater and ease the load on the city's supply. Treated water from the STP is reused for landscaping and flushing.",
  },
  {
    title: "Work with the climate",
    text: "Orientation, window placement and cross-ventilation are planned so homes need less artificial light and less cooling. Vastu and good climate design often point the same way, and we design for both.",
  },
  {
    title: "Make room for trees",
    text: "We plan buildings around a site's mature trees instead of clearing them. At Abhigna Misty Woods in JP Nagar, 38% of the land was left open and the towers were placed around the trees that were already there.",
  },
  {
    title: "Keep the timeline public",
    text: "Every project is RERA-registered, with its timeline on public record. Misty Woods' filed completion target was 15 August 2023. Sustainable building starts with a builder who is still answerable years later.",
  },
  {
    title: "Care for the builders",
    text: "The people who build our homes deserve the same care as the people who live in them. Safety gear and training on site, insurance for workers, on-time wages, clean drinking water and rest areas.",
  },
] as const;

type CommitmentCategory = "Land" | "People" | "Promise";
type CommitmentFilter = "All" | CommitmentCategory;
const FILTERS: CommitmentFilter[] = ["All", "Land", "People", "Promise"];
const COMMITMENTS: { category: CommitmentCategory; text: string }[] = [
  { category: "Land", text: "Rainwater harvesting on every project" },
  { category: "Land", text: "Mature trees retained wherever the site plan allows" },
  { category: "Land", text: "Homes designed for natural light and cross-ventilation" },
  { category: "People", text: "Safety gear and site safety training for every worker" },
  { category: "People", text: "Wages paid on time, every time" },
  { category: "Promise", text: "Every project RERA-registered, with its timeline public" },
  { category: "Promise", text: "Monthly construction updates for every buyer" },
  { category: "Promise", text: "A named person to call after handover" },
];
const SCENES = [
  { id: "sustainability-intro", label: "Introduction" },
  { id: "vision", label: "Our vision" },
  { id: "approach", label: "Our approach" },
  { id: "commitments", label: "Our commitments" },
  { id: "sustainability-thought", label: "Our thought" },
] as const;

export default function SustainabilityStory() {
  const mainRef = useRef<HTMLElement>(null);
  const splitRef = useRef<HTMLDivElement>(null);
  const [activeApproach, setActiveApproach] = useState<number | null>(0);
  const [activeFilter, setActiveFilter] = useState<CommitmentFilter>("All");
  const [activeScene, setActiveScene] = useState(0);
  const [showRail, setShowRail] = useState(false);
  const visibleCommitments = COMMITMENTS.filter(
    ({ category }) => activeFilter === "All" || category === activeFilter,
  );

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
        "[data-photo-reveal]",
        { clipPath: "inset(30% 35% 30% 35%)", scale: 0.94 },
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
      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 44 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 92%", toggleActions: "play none none reverse" },
          },
        );
      });
    }, main);
    return () => context.revert();
  }, []);

  return (
    <main ref={mainRef} className={styles.page}>
      <div ref={splitRef} className={styles.storySplit}>
        <figure className={styles.photoPanel}>
          <div data-photo-reveal className={styles.photoFrame}>
            <Image
              src="/misty-woods-trees.webp"
              alt="A mature tree growing between the residential buildings at Abhigna Misty Woods, JP Nagar"
              fill
              priority
              sizes="(max-width: 800px) 100vw, 50vw"
              className={styles.photoImage}
            />
          </div>
          <figcaption className={styles.photoCaption}>
            <span>Abhigna Misty Woods</span>
            <span>JP Nagar, Bengaluru</span>
          </figcaption>
        </figure>

        <div className={styles.narrative}>
          <section id="sustainability-intro" className={`${styles.scene} ${styles.introScene}`} aria-labelledby="sustainability-heading">
            <div className={styles.sceneTopline}><span>Abhigna Constructions</span><span>01 / 05</span></div>
            <div className={styles.introContent}>
              <p data-rise className={styles.eyebrow}>Sustainability · Since 2007</p>
              <h1 id="sustainability-heading" className={styles.introTitle} aria-label="A way of living with the land."><AnimatedWords text="A way of" /> <em><AnimatedWords text="living" /></em><br /><AnimatedWords text="with the land." /></h1>
              <p data-rise className={styles.introText}>
                Sustainability, for us, is the habit of making choices that a family will thank us for in the future. Since 2007, that has meant keeping the trees a site already has, catching the rain that falls on it, and designing homes that stay cool and bright on their own.
              </p>
              <a data-rise className={styles.textLink} href="#approach">See how we build <FiArrowDownRight aria-hidden="true" /></a>
            </div>
            <div className={styles.introStats} aria-label="Sustainability at a glance">
              <div><strong>2007</strong><span>Building since</span></div>
              <div><strong>38%</strong><span>of Misty Woods’ land left open</span></div>
              <div><strong>XX</strong><span>Mature trees retained<small>Count to be confirmed</small></span></div>
              <div><strong>100%</strong><span>Projects with rainwater harvesting</span></div>
            </div>
          </section>

          <section id="vision" className={`${styles.scene} ${styles.visionScene}`} aria-labelledby="vision-heading">
            <div className={styles.sceneTopline}><span>Our vision</span><span>02 / 05</span></div>
            <div className={styles.visionLead}>
              <p data-rise className={styles.eyebrow}>What guides us</p>
              <h2 id="vision-heading"><AnimatedWords text="Built on" /><br /><em><AnimatedWords text="ROOTS." /></em></h2>
              <p data-rise>A home outlives the people who build it. So every decision we make on a site, from where a tower stands to where the rainwater goes, is made with the next twenty years in mind.</p>
            </div>
            <div className={styles.visionStack}>
              {VISION.map((card) => (
                <article data-rise className={styles.visionCard} key={card.title}>
                  <div className={styles.visionImage}>
                    <Image src={card.image} alt={card.alt} fill sizes="(max-width: 800px) 75vw, 27vw" />
                  </div>
                  <div className={styles.visionCopy}>
                    <span>{card.number} / 03</span>
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="approach" className={`${styles.scene} ${styles.approachScene}`} aria-labelledby="approach-heading">
            <div className={styles.sceneTopline}><span>Our approach</span><span>03 / 05</span></div>
            <div className={styles.approachHeader}>
              <p data-rise className={styles.eyebrow}>On every project</p>
              <h2 id="approach-heading"><AnimatedWords text="Thought through." /><br /><AnimatedWords text="Built to last." /></h2>
              <p data-rise>These are the things we do on every Abhigna project, regardless of the land parcel.</p>
            </div>
            <div className={styles.accordion}>
              {APPROACH.map((item, index) => {
                const isOpen = activeApproach === index;
                return (
                  <article className={`${styles.accordionItem} ${isOpen ? styles.accordionOpen : ""}`} key={item.title}>
                    <h3>
                      <button type="button" aria-expanded={isOpen} aria-controls={`approach-content-${index}`} onClick={() => setActiveApproach(isOpen ? null : index)}>
                        <span className={styles.approachNumber}>{String(index + 1).padStart(2, "0")}</span>
                        <span>{item.title}</span>
                        {isOpen ? <FiMinus aria-hidden="true" /> : <FiPlus aria-hidden="true" />}
                      </button>
                    </h3>
                    <div id={`approach-content-${index}`} className={styles.accordionBody} hidden={!isOpen}><p>{item.text}</p></div>
                  </article>
                );
              })}
            </div>
          </section>

          <section id="commitments" className={`${styles.scene} ${styles.commitmentScene}`} aria-labelledby="commitments-heading">
            <div className={styles.sceneTopline}><span>Our commitments</span><span>04 / 05</span></div>
            <div className={styles.commitmentHeader}>
              <p data-rise className={styles.eyebrow}>Land · People · Promise</p>
              <h2 id="commitments-heading"><AnimatedWords text="What you can" /><br /><AnimatedWords text="hold us to." /></h2>
            </div>
            <div className={styles.filters} role="group" aria-label="Filter commitments">
              {FILTERS.map((filter) => (
                <button key={filter} type="button" className={`${styles.filter} ${activeFilter === filter ? styles.filterActive : ""}`} aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>{filter}</button>
              ))}
            </div>
            <div className={styles.commitmentList} aria-live="polite">
              {visibleCommitments.map((commitment) => (
                <div className={styles.commitmentRow} key={commitment.text}><span>{commitment.category}</span><p>{commitment.text}</p><FiArrowUpRight aria-hidden="true" /></div>
              ))}
            </div>
            <p className={styles.reviewNote}>We review these commitments every year and update this page when they change.</p>
          </section>

          <section id="sustainability-thought" className={`${styles.scene} ${styles.thoughtScene}`} aria-label="Our guiding thought">
            <div className={styles.sceneTopline}><span>Looking ahead</span><span>05 / 05</span></div>
            <blockquote><AnimatedWords text="“A home outlives the people who build it.”" /></blockquote>
            <p data-rise>So we make every choice with the next twenty years in mind.</p>
          </section>
        </div>
      </div>

      <nav className={`${styles.progressRail} ${showRail ? styles.progressRailVisible : ""} ${activeScene === 1 ? styles.progressRailDark : ""}`} aria-label="Sustainability page sections">
        {SCENES.map((scene, index) => <a key={scene.id} href={`#${scene.id}`} aria-label={scene.label} aria-current={activeScene === index ? "location" : undefined} className={activeScene === index ? styles.progressActive : ""}><span /></a>)}
      </nav>

    </main>
  );
}
