"use client";

import { type ReactNode, useId, useState } from "react";
import Link from "next/link";
import { PiMinusThin, PiPlusThin } from "react-icons/pi";
import styles from "./FAQSection.module.css";

type FAQ = {
  question: string;
  answer: ReactNode;
};

const FEATURED_FAQS: FAQ[] = [
  {
    question: "When was Abhigna Constructions founded?",
    answer:
      "Abhigna Constructions was founded in 2007 by civil engineer Bhaskar Reddy, who has over 35 years of experience in construction. The company has been building in Bengaluru since 2016.",
  },
  {
    question: "How much has Abhigna delivered so far?",
    answer:
      "Abhigna has delivered close to one million square feet of residential development across [X] projects in Bengaluru.",
  },
  {
    question: "Where does Abhigna build?",
    answer:
      "Abhigna’s projects are in Bengaluru, at JP Nagar and Thanisandra, with the next project coming up on Sarjapur Road.",
  },
  {
    question: "How many projects are currently in the market?",
    answer:
      "Abhigna currently has [X] ongoing project(s). Aadhya Serene in Thanisandra, near Manyata Tech Park, is open for sale, offering [2 and 3 BHK] homes with possession in [month, year].",
  },
];

const MORE_FAQS: FAQ[] = [
  {
    question: "Where is your next project coming up?",
    answer:
      "Our next project is on Sarjapur Road. Details will be announced soon. Register your interest to receive updates first.",
  },
  {
    question: "What types of homes do you build?",
    answer:
      "We build residential apartments ranging from [2 BHK to 4 BHK]. Configurations vary by project and are listed on each project page.",
  },
  {
    question: "Are your projects RERA-registered?",
    answer: (
      <>
        Yes. Every project is registered with Karnataka RERA. The registration
        number is listed on each project page and can be verified at{" "}
        <a href="https://rera.karnataka.gov.in" target="_blank" rel="noopener noreferrer">
          rera.karnataka.gov.in
        </a>
        .
      </>
    ),
  },
  {
    question: "Are your homes Vastu-compliant?",
    answer:
      "Yes. Every home is planned to Vastu principles, covering entrance direction, kitchen and bedroom placement, and natural light.",
  },
  {
    question: "Can I visit a project before booking?",
    answer: (
      <>
        Yes. Call or WhatsApp us on{" "}
        <a href="tel:+919602099333">+91 96020 99333</a> to book a site visit. We
        can also arrange a walk-through of a completed Abhigna home.
      </>
    ),
  },
  {
    question: "Do you assist NRI buyers?",
    answer:
      "Yes. We support NRI buyers with virtual walk-throughs, documentation and home loan assistance.",
  },
  {
    question: "How do you ensure construction quality?",
    answer:
      "Every project is overseen by qualified engineers, with stage-wise quality checks from foundation to finishing.",
  },
  {
    question: "Do you take up joint development projects?",
    answer: (
      <>
        Yes. Most of our Bengaluru projects have been developed through joint
        development with landowners. If you own land and would like to discuss a
        partnership, write to us at{" "}
        <a href="mailto:sales@abhignaconstructions.com">
          sales@abhignaconstructions.com
        </a>
        .
      </>
    ),
  },
];

type FAQSectionProps = {
  fullPage?: boolean;
};

export default function FAQSection({ fullPage = false }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const id = useId();
  const faqs = fullPage ? [...FEATURED_FAQS, ...MORE_FAQS] : FEATURED_FAQS;
  const Heading = fullPage ? "h1" : "h2";

  return (
    <section
      id={fullPage ? "faqs" : "home-faqs"}
      className={`${styles.section} ${fullPage ? styles.fullPage : ""}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Good to know</p>
          <Heading id={`${id}-heading`} className={styles.title}>
            Frequently Asked Questions
          </Heading>
          {fullPage && (
            <p className={styles.intro}>
              Clear answers about the people, planning, and principles behind
              Abhigna homes.
            </p>
          )}
        </header>

        <div className={styles.list}>
          {faqs.map(({ question, answer }, index) => {
            const isOpen = openIndex === index;
            const questionId = `${id}-question-${index}`;
            const answerId = `${id}-answer-${index}`;

            return (
              <article
                key={question}
                className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
              >
                <h3 className={styles.questionHeading}>
                  <button
                    id={questionId}
                    type="button"
                    className={styles.question}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span className={styles.questionText}>{question}</span>
                    <span className={styles.toggle} aria-hidden="true">
                      {isOpen ? <PiMinusThin /> : <PiPlusThin />}
                    </span>
                  </button>
                </h3>
                <div
                  id={answerId}
                  className={styles.answerOuter}
                  role="region"
                  aria-labelledby={questionId}
                  aria-hidden={!isOpen}
                  inert={!isOpen}
                >
                  <div className={styles.answerClip}>
                    <p className={styles.answer}>{answer}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {!fullPage && (
          <div className={styles.moreWrap}>
            <Link className="site-cta site-cta--dark" href="/faqs">
              Explore all FAQs
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
