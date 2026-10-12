"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import styles from "./LandingHero.module.css";

const HERO_VIDEO =
  "https://cdn.sthyra.com/MISTY_WOODS_IMAGES/Misty%20Woods-fast.webm";

export default function Landing_Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const media = mediaRef.current;
    const title = titleRef.current;
    const mask = maskRef.current;
    const video = videoRef.current;
    const still = imageRef.current;
    if (!hero || !media || !title || !mask || !video || !still) return;

    const words = title.querySelectorAll(`.${styles.titleWord}`);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealVideo = () => {
      gsap.to(video, { autoAlpha: 1, duration: 0.7, ease: "power2.out" });
      gsap.to(still, { autoAlpha: 0, duration: 0.7, ease: "power2.out" });
    };

    video.addEventListener("playing", revealVideo);
    if (!video.paused && video.readyState >= 2) revealVideo();
    void video.play().catch(() => {
      // Keep the first frame in place when autoplay is unavailable.
    });

    const animation = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(media, { width: "100%", height: "100%", borderRadius: 0 });
        gsap.set(mask, { opacity: 1 });
        gsap.set(title, { autoAlpha: 1 });
        gsap.set(words, { y: 0 });
        return;
      }

      gsap.timeline({ delay: 0.55 })
        .to(media, {
          width: "100%",
          height: "100%",
          borderRadius: 0,
          duration: 1.8,
          ease: "power3.inOut",
        }, 0)
        .to(mask, {
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
        }, 1.4)
        .set(title, { autoAlpha: 1 }, 1.75)
        .to(words, {
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
        }, 1.75);
    }, hero);

    return () => {
      video.removeEventListener("playing", revealVideo);
      animation.revert();
      gsap.killTweensOf([video, still]);
    };
  }, []);

  return (
    <section ref={heroRef} className={styles.hero} aria-label="Abhigna Misty Woods">
      <div className={styles.introTitle} aria-hidden="true">
        <span className={styles.introLeft}>Abhigna</span>
        <span className={styles.introRight}>Constructions</span>
      </div>

      <div ref={mediaRef} className={styles.mediaFrame}>
        <div ref={imageRef} className={styles.still}>
          <Image
            src="/Hero/Misty-Woods-first-frame.jpg"
            alt="Entrance to Abhigna Misty Woods"
            fill
            priority
            sizes="100vw"
            className={styles.media}
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
