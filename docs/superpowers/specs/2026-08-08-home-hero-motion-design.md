# Home Hero Motion Design

## Goal

Upgrade the homepage hero so the image stack and typography feel cinematic instead of static.

## Approved Direction

Use a GSAP load timeline plus ScrollTrigger-based parallax.

## Motion Requirements

- Add a hard bottom mask so the hero ends with a deliberate crop instead of an abrupt seam.
- Reveal `Abhigna` letter-by-letter on load.
- Bring the foreground image up from below the frame on load.
- Keep `Constructions` in the front layer.
- On scroll:
  - the background image moves upward slowly
  - the foreground image moves downward slightly

## Implementation Shape

- Keep the work in `components/Home/Landing_Hero.tsx`.
- Reuse the repo's GSAP plugin setup via `ensureGsapPlugins`.
- Split the `Abhigna` title into per-letter spans for staggered entrance.
- Use separate wrappers for foreground load motion and foreground parallax so the intro and scroll transforms do not fight each other.
- Add a bottom matte overlay using the site background color.
- Respect `prefers-reduced-motion` by skipping timeline/parallax effects.

## Visual Notes

- The bottom mask should read as a hard cinematic wipe, not a soft fade.
- The title animation should feel premium and restrained, not bouncy.
- The foreground rise should feel weighty and architectural.
- Parallax should stay subtle so the hero still feels stable.
