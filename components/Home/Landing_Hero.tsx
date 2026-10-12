"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./LandingHero.module.css";

const HERO_VIDEO =
  "https://cdn.sthyra.com/MISTY_WOODS_IMAGES/Misty%20Woods-fast.webm";

function AnimatedWord({ word, delay }: { word: string; delay: number }) {
  return (
    <span className={styles.titleLine} aria-hidden="true">
      {Array.from(word).map((letter, index) => (
        <span
          className={styles.letter}
          key={`${word}-${index}`}
          style={{ animationDelay: `${delay + index * 0.055}s` }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}

export default function Landing_Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readyAtRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "exiting" | "done">("loading");

  useEffect(() => {
    if (phase === "done") return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [phase]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedFrame = window.requestAnimationFrame(() => {
        setProgress(100);
        setPhase("done");
      });
      return () => window.cancelAnimationFrame(reducedFrame);
    }

    const startedAt = performance.now();
    if (videoRef.current && videoRef.current.readyState >= 2) {
      readyAtRef.current = startedAt;
    }

    let frame = 0;
    let exitTimer = 0;
    let doneTimer = 0;
    const fallbackTimer = window.setTimeout(() => {
      readyAtRef.current ??= performance.now();
    }, 3500);

    const update = (now: number) => {
      const elapsed = now - startedAt;
      const initial = Math.min(92, Math.floor((elapsed / 1750) * 92));
      const finishStart = Math.max(startedAt + 1750, readyAtRef.current ?? Infinity);
      const finish = now >= finishStart
        ? 92 + Math.floor(Math.min((now - finishStart) / 350, 1) * 8)
        : 0;
      const next = Math.min(100, Math.max(initial, finish));
      setProgress(next);

      if (next === 100) {
        exitTimer = window.setTimeout(() => setPhase("exiting"), 120);
        doneTimer = window.setTimeout(() => setPhase("done"), 1050);
      } else {
        frame = window.requestAnimationFrame(update);
      }
    };

    frame = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  const markVideoReady = () => {
    readyAtRef.current ??= performance.now();
  };

  return (
    <section className={styles.hero} aria-label="Abhigna Constructions">
      <div className={styles.mediaFrame}>
        <video
          ref={videoRef}
          className={styles.video}
          poster="/Hero/Misty-Woods-first-frame.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Abhigna Misty Woods residential community"
          onLoadedData={markVideoReady}
          onError={markVideoReady}
        >
          <source src={HERO_VIDEO} type="video/webm" />
          Your browser does not support this video.
        </video>
      </div>
      <h1
        className={`${styles.title} ${phase === "done" ? styles.titleReady : ""}`}
        aria-label="Abhigna Constructions"
      >
        <AnimatedWord word="ABHIGNA" delay={0.2} />
        <AnimatedWord word="CONSTRUCTIONS" delay={0.65} />
      </h1>
      {phase !== "done" && (
        <div
          className={`${styles.loader} ${phase === "exiting" ? styles.loaderExit : ""}`}
          role="status"
          aria-label="Loading Abhigna Constructions"
        >
          <span className={styles.loaderCount} aria-hidden="true">
            {String(progress).padStart(3, "0")}<small>%</small>
          </span>
          <div className={styles.loaderTrack} aria-hidden="true">
            <span style={{ transform: `scaleX(${progress / 100})` }} />
          </div>
        </div>
      )}
    </section>
  );
}
