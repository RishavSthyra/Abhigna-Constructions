"use client";

import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

export type SplitSectionOptions = {
  /** Split per-character in addition to per-word. */
  chars?: boolean;
  /** Padding-bottom in em so descenders don't clip during clip-reveal. */
  padBottomEm?: number;
};

export type SplitSection = {
  chars: HTMLElement[];
  words: HTMLElement[];
  revert: () => void;
  from: (vars: gsap.TweenVars) => gsap.core.Tween;
  toTo: (
    fromVars: gsap.TweenVars,
    toVars: gsap.TweenVars,
  ) => gsap.core.Tween;
};

/** Split a heading or label into GSAP SplitText fragments. */
export const splitSection = (
  el: HTMLElement,
  { chars = true, padBottomEm = 0.18 }: SplitSectionOptions = {},
): SplitSection => {
  const split = new SplitText(el, {
    type: chars ? "words,chars" : "words",
    charsClass: "nav-split-char",
    wordsClass: "nav-split-word",
  });

  const wordSpans = split.words as HTMLElement[];
  const charSpans = split.chars as HTMLElement[];
  const stylableNodes =
    charSpans.length > 0 ? [...wordSpans, ...charSpans] : wordSpans;

  stylableNodes.forEach((node) => {
    node.style.display = "inline-block";
    node.style.willChange = "transform,opacity";
    node.style.paddingBottom = `${padBottomEm}em`;
  });

  return {
    chars: charSpans,
    words: wordSpans,
    revert() {
      split.revert();
    },
    from(vars) {
      const target = chars && charSpans.length ? charSpans : wordSpans;
      return gsap.from(target, vars);
    },
    toTo(fromVars, toVars) {
      const target = chars && charSpans.length ? charSpans : wordSpans;
      return gsap.fromTo(target, fromVars, toVars);
    },
  };
};
