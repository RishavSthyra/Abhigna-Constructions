import { Fragment } from "react";
import styles from "./AnimatedWords.module.css";

type AnimatedWordsProps = {
  text: string;
};

export default function AnimatedWords({ text }: AnimatedWordsProps) {
  const words = text.split(" ");

  return (
    <span className={styles.group} data-word-reveal>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className={styles.mask}>
            <span className={styles.word} data-reveal-word>{word}</span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
