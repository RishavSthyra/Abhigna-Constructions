'use client';

import React, { useEffect, useRef, useState } from 'react';
import DayNightToggle from '../ui/HeroDayNightToggle';
import localFont from 'next/font/local';
import Image from 'next/image';
import { gsap } from 'gsap';
import { NAV_EASE, ensureGsapPlugins } from '@/components/Nav/gsap/easings';

type time = 'Day' | 'Night';

const HERO_TITLE = Array.from('Abhigna');
const DAY_TEXT_COLOR = '#fff';
const DAY_TEXT_OPACITY = 0.9;
const NIGHT_TITLE_COLOR = 'rgba(255,255,255,0.78)';
const NIGHT_CONSTRUCTION_COLOR = 'rgba(255,255,255,0.96)';

const arneta = localFont({
    src: '../../public/Hero/Arneta-Regular.otf',
    display: 'swap',
});

const silveridge = localFont({
    src: '../../public/Hero/Silveridge Free.otf',
    display: 'swap',
});

export default function Landing_Hero() {
    const [time, setTime] = useState<time>('Day');

    const sectionRef = useRef<HTMLElement | null>(null);
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const dayBackgroundRef = useRef<HTMLDivElement | null>(null);
    const nightBackgroundRef = useRef<HTMLDivElement | null>(null);
    const dayForegroundLoadRef = useRef<HTMLDivElement | null>(null);
    const nightForegroundLoadRef = useRef<HTMLDivElement | null>(null);
    const dayForegroundParallaxRef = useRef<HTMLDivElement | null>(null);
    const nightForegroundParallaxRef = useRef<HTMLDivElement | null>(null);
    const constructionRef = useRef<HTMLParagraphElement | null>(null);
    const bottomMaskRef = useRef<HTMLDivElement | null>(null);
    const firstThemeEffectRef = useRef(true);
    const prefersReduceRef = useRef(false);
    const transitionTimelineRef = useRef<gsap.core.Timeline | null>(null);

    const Day_Background_Image = '/Hero/Day_Background.png';
    const Day_Foreground_Image = '/Hero/Day_Foreground.png';
    const Night_Background_Image = '/Hero/Night_Background.jpg';
    const Night_Foreground_Image = '/Hero/withour bg Night View Aadhya Serene.png';

    useEffect(() => {
        if (typeof window === 'undefined') return;

        ensureGsapPlugins();

        const prefersReduce = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;
        prefersReduceRef.current = prefersReduce;

        const ctx = gsap.context(() => {
            const titleChars = titleRef.current
                ? Array.from(
                      titleRef.current.querySelectorAll<HTMLSpanElement>(
                          '[data-hero-char]',
                      ),
                  )
                : [];

            gsap.set(dayBackgroundRef.current, { autoAlpha: 1 });
            gsap.set(nightBackgroundRef.current, { autoAlpha: 0 });
            gsap.set(dayForegroundLoadRef.current, { autoAlpha: 1 });
            gsap.set(nightForegroundLoadRef.current, { autoAlpha: 0 });
            gsap.set(titleRef.current, {
                color: DAY_TEXT_COLOR,
                autoAlpha: DAY_TEXT_OPACITY,
            });
            gsap.set(constructionRef.current, {
                color: DAY_TEXT_COLOR,
                autoAlpha: DAY_TEXT_OPACITY,
            });

            if (prefersReduce) {
                gsap.set(titleChars, { yPercent: 0, autoAlpha: 1 });
                gsap.set(dayForegroundLoadRef.current, { yPercent: 0 });
                gsap.set(nightForegroundLoadRef.current, { yPercent: 0 });
                gsap.set(constructionRef.current, { y: 0, autoAlpha: 1 });
                gsap.set(bottomMaskRef.current, { yPercent: 0 });
                return;
            }

            gsap.set(titleChars, { yPercent: 120, autoAlpha: 0 });
            gsap.set(dayForegroundLoadRef.current, { yPercent: 14, autoAlpha: 1 });
            gsap.set(nightForegroundLoadRef.current, { yPercent: 0, autoAlpha: 0 });
            gsap.set(constructionRef.current, { y: 20, autoAlpha: 0 });
            gsap.set(bottomMaskRef.current, { yPercent: 102 });

            const intro = gsap.timeline({
                defaults: { ease: NAV_EASE.softIn },
            });

            [dayBackgroundRef.current, nightBackgroundRef.current].forEach(
                (background) => {
                    if (!background) return;
                    gsap.set(background, { scale: 1.06, yPercent: 0 });
                },
            );

            intro.to(
                dayBackgroundRef.current,
                {
                    scale: 1,
                    yPercent: 0,
                    duration: 2.2,
                    ease: 'power2.out',
                },
                0,
            );

            intro.to(
                bottomMaskRef.current,
                {
                    yPercent: 0,
                    duration: 0.9,
                    ease: NAV_EASE.curtain,
                },
                0.08,
            );

            intro.to(
                dayForegroundLoadRef.current,
                {
                    yPercent: 0,
                    duration: 1.4,
                    ease: NAV_EASE.curtain,
                },
                0.14,
            );

            intro.to(
                titleChars,
                {
                    yPercent: 0,
                    autoAlpha: 1,
                    duration: 0.95,
                    stagger: 0.055,
                    ease: NAV_EASE.row,
                },
                0.26,
            );

            intro.to(
                constructionRef.current,
                {
                    y: 0,
                    autoAlpha: DAY_TEXT_OPACITY,
                    duration: 0.85,
                },
                0.86,
            );

            [
                dayBackgroundRef.current,
                nightBackgroundRef.current,
            ].forEach((background) => {
                if (!background) return;
                gsap.to(background, {
                    yPercent: -8,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 0.8,
                    },
                });
            });

            [
                dayForegroundParallaxRef.current,
                nightForegroundParallaxRef.current,
            ].forEach((foreground) => {
                if (!foreground) return;
                gsap.to(foreground, {
                    yPercent: 10,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 0.95,
                    },
                });
            });
        }, sectionRef);

        return () => {
            transitionTimelineRef.current?.kill();
            ctx.revert();
        };
    }, []);

    useEffect(() => {
            if (firstThemeEffectRef.current) {
            firstThemeEffectRef.current = false;
            return;
        }

        if (prefersReduceRef.current) {
            gsap.set(dayBackgroundRef.current, { autoAlpha: time === 'Day' ? 1 : 0 });
            gsap.set(nightBackgroundRef.current, { autoAlpha: time === 'Night' ? 1 : 0 });
            gsap.set(dayForegroundLoadRef.current, { autoAlpha: time === 'Day' ? 1 : 0, yPercent: 0 });
            gsap.set(nightForegroundLoadRef.current, { autoAlpha: time === 'Night' ? 1 : 0, yPercent: 0 });
            gsap.set(titleRef.current, {
                color: time === 'Day' ? DAY_TEXT_COLOR : NIGHT_TITLE_COLOR,
                autoAlpha: time === 'Day' ? DAY_TEXT_OPACITY : 0.82,
            });
            gsap.set(constructionRef.current, {
                color: time === 'Day' ? DAY_TEXT_COLOR : NIGHT_CONSTRUCTION_COLOR,
                autoAlpha: time === 'Day' ? DAY_TEXT_OPACITY : 1,
            });
            return;
        }

        const isDay = time === 'Day';

        transitionTimelineRef.current?.kill();

        const transition = gsap.timeline({
            defaults: { ease: NAV_EASE.softIn },
            onComplete: () => {
                gsap.set(dayBackgroundRef.current, { autoAlpha: isDay ? 1 : 0 });
                gsap.set(nightBackgroundRef.current, { autoAlpha: isDay ? 0 : 1 });
                gsap.set(dayForegroundLoadRef.current, { autoAlpha: isDay ? 1 : 0 });
                gsap.set(nightForegroundLoadRef.current, { autoAlpha: isDay ? 0 : 1 });
            },
        });

        transition
            .to(
                dayBackgroundRef.current,
                {
                    autoAlpha: isDay ? 1 : 0,
                    duration: 0.65,
                },
                0,
            )
            .to(
                nightBackgroundRef.current,
                {
                    autoAlpha: isDay ? 0 : 1,
                    duration: 0.65,
                },
                0,
            )
            .to(
                dayForegroundLoadRef.current,
                {
                    autoAlpha: isDay ? 1 : 0,
                    duration: 0.65,
                },
                0,
            )
            .to(
                nightForegroundLoadRef.current,
                {
                    autoAlpha: isDay ? 0 : 1,
                    duration: 0.65,
                },
                0,
            )
            .to(
                titleRef.current,
                {
                    color: isDay ? DAY_TEXT_COLOR : NIGHT_TITLE_COLOR,
                    autoAlpha: isDay ? DAY_TEXT_OPACITY : 0.82,
                    duration: 0.65,
                },
                0,
            )
            .to(
                constructionRef.current,
                {
                    color: isDay ? DAY_TEXT_COLOR : NIGHT_CONSTRUCTION_COLOR,
                    autoAlpha: isDay ? DAY_TEXT_OPACITY : 1,
                    duration: 0.65,
                },
                0,
            );

        transitionTimelineRef.current = transition;
    }, [time]);

    return (
        <section
            ref={sectionRef}
            className='relative h-screen bg-white'
        >
            <div className='absolute inset-0 overflow-hidden'>
                <div
                    ref={dayBackgroundRef}
                    className='absolute inset-0 z-10 will-change-transform'
                >
                    <Image
                        src={Day_Background_Image}
                        alt='Day Background Image Abhgina Constructions'
                        fill
                        priority
                        sizes='100vw'
                        className='object-cover object-center'
                    />
                </div>

                <div
                    ref={nightBackgroundRef}
                    className='absolute inset-0 z-[12] will-change-transform'
                    style={{ opacity: 0 }}
                >
                    <Image
                        src={Night_Background_Image}
                        alt='Night Background Image Abhgina Constructions'
                        fill
                        priority
                        sizes='100vw'
                        className='object-cover object-center'
                    />
                </div>

                <div className='pointer-events-none absolute inset-x-0 top-[34%] z-20 -translate-y-1/2 px-2 sm:px-4'>
                    <h1
                        ref={titleRef}
                        className={`${arneta.className} whitespace-nowrap pl-[0%] text-left text-[clamp(4.25rem,22vw,25rem)] leading-[0.78] tracking-[0.02em]`}
                    >
                        {HERO_TITLE.map((char, index) => (
                            <span
                                key={`${char}-${index}`}
                                className='inline-block overflow-hidden align-baseline'
                                style={{
                                    paddingTop: '0.08em',
                                    paddingBottom: '0.08em',
                                    marginTop: '-0.08em',
                                    marginBottom: '-0.08em',
                                }}
                            >
                                <span
                                    data-hero-char
                                    className='inline-block will-change-transform'
                                >
                                    {char}
                                </span>
                            </span>
                        ))}
                    </h1>
                </div>

                <div
                    ref={dayForegroundLoadRef}
                    className='absolute inset-0 z-30 will-change-transform'
                >
                    <div
                        ref={dayForegroundParallaxRef}
                        className='absolute inset-0 will-change-transform'
                    >
                        <Image
                            src={Day_Foreground_Image}
                            alt='Day Foreground Image Abhgina Constructions'
                            fill
                            priority
                            sizes='100vw'
                            className='object-cover object-center'
                        />
                    </div>
                </div>

                <div
                    ref={nightForegroundLoadRef}
                    className='absolute inset-0 z-[32] will-change-transform'
                    style={{ opacity: 0 }}
                >
                    <div
                        ref={nightForegroundParallaxRef}
                        className='absolute inset-0 will-change-transform'
                    >
                        <Image
                            src={Night_Foreground_Image}
                            alt='Night Foreground Image Abhgina Constructions'
                            fill
                            priority
                            sizes='100vw'
                            className='object-cover object-center'
                        />
                    </div>
                </div>

                <div className='pointer-events-none absolute bottom-[19%] right-5 z-50 sm:bottom-[20%] sm:right-8 md:bottom-[21%] md:right-12 lg:right-16'>
                    <p
                        ref={constructionRef}
                        className={`${silveridge.className} whitespace-nowrap text-[clamp(4.2rem,8vw,8.5rem)] leading-none drop-shadow-[0_8px_28px_rgba(0,0,0,0.35)]`}
                    >
                        Constructions
                    </p>
                </div>

                <div
                    ref={bottomMaskRef}
                    aria-hidden
                    className='absolute inset-x-0 bottom-0 z-40 h-[4.5vh] min-h-[30px] bg-[var(--color-brand-bg)] will-change-transform'
                    style={{
                        clipPath: 'polygon(0 62%, 100% 0, 100% 100%, 0 100%)',
                        boxShadow: '0 -10px 24px rgba(0, 0, 0, 0.08)',
                    }}
                />

                <DayNightToggle time={time} position={'right'} setTime={setTime} />
            </div>
        </section>
    );
}
