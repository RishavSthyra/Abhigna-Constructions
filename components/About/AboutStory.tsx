import Image from "next/image";
import styles from "./AboutStory.module.css";

const PROJECT_IMAGE = "/nav-building.avif";

export default function AboutStory() {
  return (
    <main id="about-page" className={styles.page}>
      <div className={styles.canvas}>
        <div className={styles.content}>
          <header className={styles.heading}>
            <p className={styles.kicker}>About Abhigna Constructions</p>
            <h1>
              Engineering-led
              <br />
              homes since <span>2007.</span>
            </h1>
          </header>

          <div className={styles.intro}>
            <p>
              Abhigna Constructions is a residential developer founded in 2007 by
              civil engineer Bhaskar Reddy. Backed by over 35 years of
              construction expertise, the company has delivered close to one
              million square feet of residential development across Bengaluru.
            </p>
          </div>

          <div className={styles.principles}>
            <div className={styles.principle}>
              <h2>Our approach</h2>
              <p>
                Every Abhigna project is planned in full before construction
                begins and overseen by qualified engineers from soil testing to
                handover.
              </p>
            </div>
            <div className={styles.principle}>
              <h2>Our focus</h2>
              <p>
                Our focus is quality construction, Vastu-compliant design and
                on-time delivery.
              </p>
            </div>
          </div>

          <figure className={styles.project}>
            <Image
              src={PROJECT_IMAGE}
              alt="Contemporary residential building"
              fill
              priority
              unoptimized
              sizes="(max-width: 700px) 100vw, 50vw"
              className={styles.projectImage}
            />
            <figcaption>Thoughtfully built homes</figcaption>
          </figure>
        </div>

        <div className={styles.bottom}>
          <blockquote>
            “I have never sold a home I would not live in myself.”
          </blockquote>
          <div className={styles.folio}>
            <span>Abhigna Constructions | Our story</span>
            <span>Est. 2007</span>
          </div>
        </div>
      </div>
    </main>
  );
}
