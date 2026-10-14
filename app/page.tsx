import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import ProjectsCarousel from "@/components/Home/ProjectsCarousel";
import CountUp from "@/components/Home/CountUp";
import ScrollToneText from "@/components/Home/ScrollToneText";
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
              <h1 id="home-title"><span>Two decades of building homes.</span><em>A name you can trust.</em></h1>
              <Link href="#projects" className={styles.heroPill}>Explore projects</Link>
            </div>
          </section>

          <section className={styles.aboutPreview} id="about" aria-labelledby="about-preview-title">
            <div className={styles.aboutCopy}>
              <span className={styles.kicker}>About us</span>
              <h2 id="about-preview-title">Engineering-led homes since 2007.</h2>
              <p>
                Abhigna Constructions is an engineering-led developer. Each
                project reflects meticulous planning, Vastu-aligned design and a
                standard of excellence that has delivered close to a million
                square feet of homes. These are homes built for the generations
                that follow.
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
              <p className={styles.microCopy}>Explore our ongoing and completed residential projects across Bengaluru.</p>
              <div className={styles.introBottom}>
                <span className={styles.kicker}>Built by Abhigna</span>
                <h2 id="projects-title">Our<br />projects.</h2>
              </div>
            </div>
            <ProjectsCarousel />
          </section>

          <section className={styles.philosophy} aria-labelledby="philosophy-title">
            <span className={styles.kicker}>Sustainability</span>
            <h2 id="philosophy-title">Build with nature in mind. <ScrollToneText activeClassName={styles.scrollToneActive}>Trees, rainwater, and daylight shape the places we make.</ScrollToneText></h2>
            <div className={styles.philosophyGrid}>
              <div className={styles.philosophyImage}>
                <Image src="/sustainability-landscape.webp" alt="Green landscape and trees" fill sizes="(max-width: 700px) 100vw, 60vw" />
                <span>Made for a life well lived.</span>
              </div>
              <div className={styles.quoteCard}>
                <span className={styles.quoteMark}>“</span>
                <blockquote>Engineering excellence is not an advantage at Abhigna. It is the baseline.</blockquote>
                <div><span className={styles.quoteRule} /><strong>Abhigna Constructions</strong></div>
              </div>
            </div>
          </section>

          <section className={styles.numbers} aria-label="Abhigna at a glance">
            <div className={styles.numberCard}>
              <div><h3>Founded on engineering</h3><p>Established by civil engineer Bhaskar Reddy.</p></div>
              <CountUp end={2007} label="2007" />
            </div>
            <div className={styles.numberCard}>
              <div><h3>Years of experience</h3><p>Qualified engineers guide every stage, from soil testing to handover.</p></div>
              <CountUp end={35} label="35 plus" suffix="+" />
            </div>
            <div className={styles.numberCard}>
              <div><h3>Square feet delivered</h3><p>Residential development across Nellore and Bengaluru.</p></div>
              <CountUp end={1} label="over one million" suffix="+" millions />
            </div>
          </section>

          <ServicesGrid headingLevel="h2" />

          <section className={styles.finalCta} data-dark-navigation-surface aria-labelledby="cta-title">
            <div className={styles.finalBackdrop} />
            <span className={styles.kicker}>Abhigna Constructions · Since 2007</span>
            <h2 id="cta-title">Live the<br /><em>Abhigna way.</em></h2>
            <p>Engineering-led homes, delivered across Bengaluru for nearly two decades.</p>
            <Link href="/contact" className={styles.ctaPill}>Enquire now</Link>
          </section>

      </main>
    </>
  );
}
