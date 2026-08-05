# About Layer Full-Bleed Design

Date: 2026-08-05
Project: `abhigna-constructions`
Scope: Make the About page layered image section render edge-to-edge while keeping its text aligned to the existing content width.

## Goal

Change the About page's layered image section so the animated visual spans fully from the left viewport edge to the right viewport edge. The overlaid text should remain aligned to the current content container and should not stretch across the viewport.

## Current Problem

The layered image composition appears visually centered rather than full-bleed. This makes the section feel boxed in compared with the rest of the page and weakens the intended right-to-left layer reveal.

## In Scope

- Update the About page layered image section in `components/About/AboutStory.tsx`.
- Keep the GSAP layer animation behavior intact.
- Keep the foreground text block aligned to the existing `max-w-[1400px]` content grid.
- Preserve responsive behavior and existing section height.

## Out of Scope

- Redesigning the About page layout outside this section.
- Changing the text content, typography, or copy alignment.
- Reworking the animation timeline or introducing a new effect.

## Recommended Approach

Use the existing `LayerIntroImage` structure and remove the visual constraint that is causing the image/layer composition to feel centered.

Implementation direction:

- Keep the root visual wrapper as a true `w-full` overflow-hidden section.
- Ensure the image and animated colored panels are positioned against the full section bounds so they bleed edge-to-edge.
- Leave the bottom text container inside its current centered width wrapper so it continues to line up with the rest of the About content.

## Expected Result

- The image and color slabs visually touch both viewport edges.
- The animation still reads as panels entering from the right and sweeping out to the left.
- The caption remains neatly aligned with the existing page grid instead of becoming full-width.

## Testing

- Verify on desktop that the layered visual spans the full browser width.
- Verify on mobile/tablet that no horizontal overflow is introduced.
- Confirm the caption remains aligned with the rest of the About page content.
- Confirm reduced-motion behavior still reveals the image without animation regressions.
