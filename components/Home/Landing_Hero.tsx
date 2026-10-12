"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import styles from "./LandingHero.module.css";

const HERO_VIDEO =
  "https://cdn.sthyra.com/MISTY_WOODS_IMAGES/Misty%20Woods-fast.webm";

export default function Landing_Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const media = mediaRef.current;
    const title = titleRef.current;
    const mask = maskRef.current;
    const video = videoRef.current;
    const still = imageRef.current;
    if (!stage || !media || !title || !mask || !video || !still) return;

    const revealVideo = () => {
      gsap.to(video, { autoAlpha: 1, duration: 0.6, ease: "power2.out" });
      gsap.to(still, { autoAlpha: 0, duration: 0.6, ease: "power2.out" });
    };

    video.addEventListener("playing", revealVideo);
    if (!video.paused && video.readyState >= 2) revealVideo();
    void video.play().catch(() => {
      // The still remains visible when autoplay is unavailable.
    });

    const motion = gsap.matchMedia();
    motion.add(
      {
        compact: "(max-width: 700px)",
        wide: "(min-width: 701px)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const compact = Boolean(context.conditions?.compact);
        const reduced = Boolean(context.conditions?.reduced);
        const finalTitle = {
          top: compact ? "85%" : "84%",
          left: "50%",
          gap: compact ? 0 : 16,
          scale: compact ? 1 : 1.4,
        };

        if (reduced) {
          gsap.set(media, { width: "100%", height: "100%", borderRadius: 0 });
          gsap.set(mask, { opacity: 1 });
          gsap.set(title, finalTitle);
          return;
        }

        const entrance = gsap.timeline({ delay: 0.45 });
        entrance
          .to(media, {
            width: "100%",
            height: "100%",
            borderRadius: 0,
            duration: 2.3,
            ease: "power3.inOut",
          }, 0)
          .to(title, {
            ...finalTitle,
            duration: 2.1,
            ease: "power3.inOut",
          }, 0.3)
          .to(mask, {
            opacity: 1,
            duration: 1.05,
            ease: "power2.out",
          }, 1.35);

        return () => entrance.kill();
      },
      stage,
    );

    return () => {
      video.removeEventListener("playing", revealVideo);
      motion.revert();
      gsap.killTweensOf([video, still]);
    };
  }, []);

  return (
    <section ref={stageRef} className={styles.hero} aria-label="Abhigna Misty Woods">
        <div ref={mediaRef} className={styles.mediaFrame}>
          <div ref={imageRef} className={styles.still}>
            <Image
              src="/Hero/Misty-Woods-first-frame.jpg"
              alt="Entrance to Abhigna Misty Woods"
              fill
              priority
              sizes="(max-width: 700px) 90vw, 76vw"
              className={[styles.media, styles.stillImage].join(" ")}
            />
          </div>
          <video
            ref={videoRef}
            className={[styles.media, styles.video].join(" ")}
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
          <span>Abhigna</span>
          <span>Constructions</span>
        </h1>
    </section>
  );
}
