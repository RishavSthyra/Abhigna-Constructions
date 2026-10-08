"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { PiMinusThin, PiPlusThin } from "react-icons/pi";
import styles from "./FAQSection.module.css";

type FAQ = {
  question: string;
  answer: string;
};

const FEATURED_FAQS: FAQ[] = [
  {
    question: "Who is behind Abhigna Constructions?",
    answer:
      "Abhigna was founded by two civil engineers and remains family-run today. Our founder has thirty-five years of construction experience, and every project is led by an engineer.",
  },
  {
    question: "How long have you been building?",
    answer:
      "Abhigna has been building since 2007. Together we have delivered close to one million square feet.",
  },
  {
    question: "Are your homes Vastu-compliant?",
    answer:
      "Yes. Every plan is designed to Vastu from the start, covering entrance directions, kitchen and bedroom placement, and natural light.",
  },
  {
    question: "Are your projects RERA-registered?",
    answer:
      "Yes. Each ongoing project is registered with Karnataka RERA, and the registration number is shown on its project page. Aadhya Serene is registered under PRM/KA/RERA/1251/446/PR/190614/002604.",
  },
];

const MORE_FAQS: FAQ[] = [
  {
    question: "Can I visit a completed Abhigna project?",
    answer:
      "Yes, and we encourage it. Book a visit and we will arrange a walk-through, including a finished home where possible.",
  },
  {
    question: "What specifications do you use?",
    answer:
      "Every project page carries a full specification sheet: structure, flooring, fittings, doors, windows and electricals. We build to what we publish.",
  },
  {
    question: "How do you keep construction on schedule?",
    answer:
      "We complete the plan, structure and budget before breaking ground, and our engineers run stage-wise quality checks on site. You receive construction updates until handover.",
  },
  {
    question: "What happens after handover?",
    answer:
      "We remain responsible for structural defects as required under RERA, and our team stays reachable for anything that needs attention.",
  },
  {
    question: "Do you take up joint development with landowners?",
    answer:
      "Yes. Most of our Bengaluru work has been through joint development. If you own land and are considering it, write to us at sales@abhignaconstructions.com.",
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
          <p className={styles.eyebrow}>— Good to know</p>
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
            <Link className={styles.moreLink} href="/faqs">
              Explore all FAQs
              <FiArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
