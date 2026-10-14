import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import ProjectsCarousel from "@/components/Home/ProjectsCarousel";
import ServicesGrid from "@/components/Services/ServicesGrid";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: "Abhigna Constructions — Engineering-led homes since 2007",
  description:
    "Thoughtfully planned residential communities in Bengaluru, built with engineering expertise, quality construction, and care for everyday living.",
};

export default function Home() {
  return (
    <>
      <Nav lightLogo />
      <main id="landing-page" className={styles.page}>
          <section className={styles.hero} id="hero" data-dark-navigation-surface aria-labelledby="home-title">
            <video
              className={styles.heroVideo}
              poster="/Hero/misty-woods-hero-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            >
              <source src="/Hero/misty-woods-hero.mp4" type="video/mp4" />
            </video>
            <div className={styles.heroBackdrop} />

            <div className={styles.heroContent}>
              <h1 id="home-title"><span>Homes built with purpose.</span><em>Places made for life.</em></h1>
              <Link href="#projects" className={styles.heroPill}>Explore projects</Link>
            </div>
          </section>

          <section className={styles.aboutPreview} id="about" aria-labelledby="about-preview-title">
            <div className={styles.aboutCopy}>
              <span className={styles.kicker}>About us</span>
              <h2 id="about-preview-title">Engineering-led homes since 2007.</h2>
              <p>
                Founded by civil engineer Bhaskar Reddy, Abhigna Constructions
                brings over 35 years of construction expertise to homes across
                Bengaluru. Each project is planned before building begins and
                overseen by qualified engineers from soil testing to handover.
              </p>
              <Link href="/about" className={styles.darkPill}>More about us</Link>
            </div>

            <div className={styles.aboutBento} aria-label="Homes and spaces by Abhigna Constructions">
              <figure className={`${styles.aboutTile} ${styles.aboutAerial}`}>
                <Image src="/about/about-aerial.jpg" alt="Aerial rendering of a residential community" fill sizes="(max-width: 700px) 100vw, (max-width: 1000px) 70vw, 40vw" />
              </figure>
              <figure className={`${styles.aboutTile} ${styles.aboutBedroom}`}>
                <Image src="/about/about-bedroom.jpg" alt="Bedroom with warm finishes" fill sizes="(max-width: 700px) 50vw, 25vw" />
              </figure>
              <figure className={`${styles.aboutTile} ${styles.aboutLiving}`}>
                <Image src="/about/about-living-room.jpg" alt="Living room with blue sofas" fill sizes="(max-width: 700px) 50vw, 25vw" />
              </figure>
              <figure className={`${styles.aboutTile} ${styles.aboutKitchen}`}>
                <Image src="/about/about-kitchen.jpg" alt="Kitchen with green cabinetry" fill sizes="(max-width: 700px) 50vw, 20vw" />
              </figure>
              <figure className={`${styles.aboutTile} ${styles.aboutExterior}`}>
                <Image src="/about/about-exterior.jpg" alt="Residential building beside landscaped sports courts" fill sizes="(max-width: 700px) 50vw, 20vw" />
              </figure>
              <figure className={`${styles.aboutTile} ${styles.aboutClubhouse}`}>
                <Image src="/about/about-clubhouse.jpg" alt="Pool and clubhouse beside a residential building" fill sizes="(max-width: 700px) 50vw, 25vw" />
              </figure>
            </div>
          </section>

          <section className={styles.projects} id="projects" aria-labelledby="projects-title">
            <div className={styles.projectsIntro}>
              <p className={styles.microCopy}>Every address begins with a simple idea: a better way to feel at home.</p>
              <div className={styles.introBottom}>
                <span className={styles.kicker}>Our communities</span>
                <h2 id="projects-title">Built around<br />your life.</h2>
              </div>
            </div>
            <ProjectsCarousel />
          </section>

          <section className={styles.philosophy} aria-labelledby="philosophy-title">
            <span className={styles.kicker}>The Abhigna approach</span>
            <h2 id="philosophy-title">Good homes begin long before <br />the first brick is laid. <span>We bring engineering, <br />care, and conviction to every detail.</span></h2>
            <div className={styles.philosophyGrid}>
              <div className={styles.philosophyImage}>
                <Image src="/sustainability-landscape.webp" alt="Green landscape and trees" fill sizes="(max-width: 700px) 100vw, 60vw" />
                <span>Made for a life well lived.</span>
              </div>
              <div className={styles.quoteCard}>
                <span className={styles.quoteMark}>“</span>
                <blockquote>I have never sold a home I would not live in myself.</blockquote>
                <div><span className={styles.quoteRule} /><strong>Bhaskar Reddy</strong><small>Founder · Civil Engineer</small></div>
              </div>
            </div>
          </section>

          <section className={styles.numbers} aria-label="Abhigna at a glance">
            <div className={styles.numberCard}>
              <strong>2007</strong>
              <div><h3>Founded on engineering</h3><p>Established by civil engineer Bhaskar Reddy.</p></div>
            </div>
            <div className={styles.numberCard}>
              <strong>35<span>+</span></strong>
              <div><h3>Years of experience</h3><p>Qualified engineers guide every stage, from soil testing to handover.</p></div>
            </div>
            <div className={styles.numberCard}>
              <strong>~1M</strong>
              <div><h3>Square feet delivered</h3><p>Residential development across Nellore and Bengaluru.</p></div>
            </div>
          </section>

          <ServicesGrid headingLevel="h2" />

          <section className={styles.finalCta} data-dark-navigation-surface aria-labelledby="cta-title">
            <div className={styles.finalBackdrop} />
            <span className={styles.kicker}>Your next chapter</span>
            <h2 id="cta-title">A home that feels<br /><em>like yours.</em></h2>
            <p>Let’s find the place where your story can grow.</p>
            <Link href="/contact" className={styles.ctaPill}>Start a conversation</Link>
          </section>

      </main>
    </>
  );
}
