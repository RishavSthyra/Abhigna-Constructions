import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: "Abhigna Constructions — Engineering-led homes since 2007",
  description:
    "Thoughtfully planned residential communities in Bengaluru, built with engineering expertise, quality construction, and care for everyday living.",
};

const Arrow = ({ diagonal = false }: { diagonal?: boolean }) => (
  <span aria-hidden="true" className={styles.arrowIcon}>
    {diagonal ? "↗" : "→"}
  </span>
);

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
              <h1 id="home-title">Homes built<br />with purpose.<br /><em>Places made for life.</em></h1>
            </div>
          </section>

          <section className={styles.projects} id="projects" aria-labelledby="projects-title">
            <div className={styles.projectsIntro}>
              <div className={styles.sectionNumber}><span>01</span><i /> <span>02 &nbsp;03 &nbsp;04</span></div>
              <p className={styles.microCopy}>Every address begins with a simple idea: a better way to feel at home.</p>
              <div className={styles.introBottom}>
                <span className={styles.kicker}>/ Our communities</span>
                <h2 id="projects-title">Built around<br />your life.</h2>
                <Link href="/contact" className={styles.darkPill}>Find your home <Arrow diagonal /></Link>
              </div>
            </div>

            <article className={`${styles.projectCard} ${styles.projectCardDark}`}>
              <Image src="/Hero/withour bg Night View Aadhya Serene.avif" alt="Architectural rendering of Aadhya Serene" fill sizes="(max-width: 700px) 100vw, 33vw" className={styles.projectImage} />
              <div className={styles.projectShade} />
              <div className={styles.projectTop}><span>01 / Featured project</span><span>Ongoing</span></div>
              <div className={styles.projectBottom}>
                <span className={styles.projectLocation}>Manyata Tech Park · Bengaluru</span>
                <h3>Aadhya<br />Serene</h3>
                <p>Considered spaces for a more meaningful everyday.</p>
                <a href="https://www.aadhyaserene.com/" target="_blank" rel="noopener noreferrer" className={styles.lightPill}>View project <Arrow diagonal /></a>
              </div>
            </article>

            <article className={`${styles.projectCard} ${styles.projectCardGreen}`}>
              <Image src="/misty-woods-trees.webp" alt="Greenery at Misty Woods" fill sizes="(max-width: 700px) 100vw, 33vw" className={styles.projectImage} />
              <div className={styles.projectShade} />
              <div className={styles.projectTop}><span>02 / Featured project</span><span>Completed</span></div>
              <div className={styles.projectBottom}>
                <span className={styles.projectLocation}>JP Nagar · Bengaluru</span>
                <h3>Misty<br />Woods</h3>
                <p>A quieter rhythm of life, surrounded by green.</p>
                <Link href="/contact" className={styles.lightPill}>Enquire now <Arrow diagonal /></Link>
              </div>
            </article>
          </section>

          <section className={styles.philosophy} aria-labelledby="philosophy-title">
            <span className={styles.kicker}>/ The Abhigna approach</span>
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
            <div className={styles.numberRow}><p>Founded by civil engineer Bhaskar Reddy, with a commitment to build better homes.</p><div><strong>2007</strong><span>Founded</span></div></div>
            <div className={styles.numberRow}><p>Deep construction experience guides every decision, from soil testing to handover.</p><div><strong>35<span>+</span></strong><span>Years of expertise</span></div></div>
            <div className={styles.numberRow}><p>Residential space delivered across our communities, with quality at its core.</p><div><strong>~1M</strong><span>Sq ft delivered</span></div></div>
          </section>

          <section className={styles.detail} aria-labelledby="detail-title">
            <div className={styles.detailCopy}>
              <div className={styles.sectionNumber}><span>02</span><i /> <span>03 &nbsp;04</span></div>
              <p className={styles.microCopy}>Designed with intent. Planned in full. Overseen by qualified engineers.</p>
              <div>
                <span className={styles.kicker}>/ Why Abhigna</span>
                <h2 id="detail-title">The details you don’t see make all the difference.</h2>
                <p className={styles.detailDescription}>Quality construction, Vastu-compliant design, and on-time delivery are built into our process from the start.</p>
                <Link href="/why-choose-us" className={styles.darkPill}>Our approach <Arrow diagonal /></Link>
              </div>
            </div>
            <div className={styles.detailImage}>
              <Image src="/nav-building.avif" alt="Modern residential architecture" fill sizes="(max-width: 700px) 100vw, 50vw" />
              <span className={styles.imageTag}>Built to feel right.<br />Built to last.</span>
            </div>
          </section>

          <section className={styles.finalCta} data-dark-navigation-surface aria-labelledby="cta-title">
            <div className={styles.finalBackdrop} />
            <span className={styles.kicker}>/ Your next chapter</span>
            <h2 id="cta-title">A home that feels<br /><em>like yours.</em></h2>
            <p>Let’s find the place where your story can grow.</p>
            <Link href="/contact" className={styles.ctaPill}>Start a conversation <Arrow diagonal /></Link>
          </section>

          <footer className={styles.footer}>
            <span>© {new Date().getFullYear()} Abhigna Constructions. All rights reserved.</span>
            <div><Link href="/about">About</Link><Link href="/sustainability">Sustainability</Link><Link href="/contact">Contact</Link></div>
          </footer>
      </main>
    </>
  );
}
