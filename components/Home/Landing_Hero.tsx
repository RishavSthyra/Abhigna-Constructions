"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import styles from "./LandingHero.module.css";

const HERO_VIDEO =
  "https://cdn.sthyra.com/MISTY_WOODS_IMAGES/Misty%20Woods-fast.webm";

export default function Landing_Hero() {
  const [posterReady, setPosterReady] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);
  const mediaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const videoRevealedRef = useRef(false);

  useEffect(() => {
    if (!posterReady) return;

    const video = videoRef.current;
    if (!video) return;

    const fallback = window.setTimeout(() => setMediaReady(true), 1800);
    void video.play().catch(() => setMediaReady(true));

    return () => window.clearTimeout(fallback);
  }, [posterReady]);

  useEffect(() => {
    if (!posterReady || !mediaReady) return;

    const media = mediaRef.current;
    const title = titleRef.current;
    const mask = maskRef.current;
    if (!media || !title || !mask) return;

    const words = title.querySelectorAll(`.${styles.titleWord}`);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      gsap.set(media, {
        width: "100%",
        height: "100%",
        borderRadius: 0,
      });
      gsap.set(mask, { opacity: 1 });
      gsap.set(words, { y: 0, autoAlpha: 1 });
    } else {
      const entrance = gsap.timeline();
      entrance
        .to(media, {
          width: "100%",
          height: "100%",
          borderRadius: 0,
          duration: 1.7,
          ease: "power3.inOut",
        }, 0.4)
        .to(mask, {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        }, 2.1)
        .to(words, {
          y: 0,
          duration: 1,
          stagger: 0.14,
          ease: "power3.out",
        }, 2.3);

      return () => {
        entrance.kill();
      };
    }
  }, [posterReady, mediaReady]);

  const revealVideo = () => {
    setMediaReady(true);
    if (videoRevealedRef.current) return;
    videoRevealedRef.current = true;
    gsap.to(videoRef.current, { autoAlpha: 1, duration: 0.8, ease: "power2.out" });
    gsap.to(imageRef.current, { autoAlpha: 0, duration: 0.8, ease: "power2.out" });
  };

  return (
    <section className={styles.hero} aria-label="Abhigna Misty Woods">
      <div ref={mediaRef} className={styles.mediaFrame}>
        <div ref={imageRef} className={styles.still}>
          <Image
            src="/Hero/Misty-Woods-first-frame.jpg"
            alt="Entrance to Abhigna Misty Woods"
            fill
            priority
            sizes="100vw"
            className={styles.media}
            onLoad={() => setPosterReady(true)}
            onError={() => setPosterReady(true)}
          />
        </div>
        <video
          ref={videoRef}
          className={`${styles.media} ${styles.video}`}
          poster="/Hero/Misty-Woods-first-frame.jpg"
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={revealVideo}
          aria-label="Abhigna Misty Woods residential community"
        >
          <source src={HERO_VIDEO} type="video/webm" />
          Your browser does not support this video.
        </video>
      </div>

      <div ref={maskRef} className={styles.bottomMask} aria-hidden="true" />
      <h1 ref={titleRef} className={styles.title}>
        <span className={styles.titleLine}><span className={styles.titleWord}>Abhigna</span></span>
        <span className={styles.titleLine}><span className={styles.titleWord}>Constructions</span></span>
      </h1>
    </section>
  );
}
