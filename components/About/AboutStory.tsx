import Image from "next/image";
import styles from "./AboutStory.module.css";

export default function AboutStory() {
  return (
    <main id="about" className={styles.page}>
      <figure className={styles.imagePanel}>
        <Image
          src="/about/about-aerial.jpg"
          alt="Aerial view of an Abhigna residential community"
          fill
          priority
          sizes="(max-width: 800px) 100vw, 38vw"
          className={styles.image}
        />
      </figure>

      <section className={styles.story} aria-labelledby="about-heading">
        <h1 id="about-heading">Engineering-led homes since 2007.</h1>

        <div className={styles.intro}>
          <p>
            Abhigna Constructions is a residential developer founded in 2007 by
            civil engineer Bhaskar Reddy. Backed by over 35 years of
            construction expertise, the company has delivered close to one
            million square feet of residential development across Nellore and
            Bengaluru.
          </p>
          <p>
            Every Abhigna project is planned in full before construction begins
            and overseen by qualified engineers from soil testing to handover.
            Our focus is quality construction, Vastu-compliant design and
            on-time delivery.
          </p>
        </div>

        <blockquote>
          “I have never sold a home I would not live in myself.”
        </blockquote>
      </section>
    </main>
  );
}
