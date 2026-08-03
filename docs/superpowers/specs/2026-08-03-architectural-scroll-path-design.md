# Architectural Scroll Path Design

Date: 2026-08-03
Project: `abhigna-constructions`
Scope: Add a scroll-driven architectural SVG path overlay between landing page sections without redesigning the existing page layout.

## Goal

Add a premium technical-pen style scroll path that starts after the hero and marquee, alternates between the outer right and outer left gutters across the remaining sections, and draws progressively with scroll. The effect must sit behind content, never overlap content, and remain responsive without restructuring the section internals.

## In Scope

- Add one reusable page-level SVG overlay component.
- Connect the sections after the marquee:
  - `ExperienceExcellence`
  - `CurvedGallery`
  - `DreamHomeListings`
  - `StatsBand`
  - `WhyUs`
- Draw one connector between each adjacent pair of sections.
- Alternate connector lanes:
  - Connector 1: right outer gutter to left outer gutter
  - Connector 2: left outer gutter to right outer gutter
  - Connector 3: right outer gutter to left outer gutter
  - Connector 4: left outer gutter to right outer gutter
- Animate each connector with scroll progress using Framer Motion.
- Add a small pen-tip glow that follows the active drawing endpoint.
- Keep the path enabled on mobile with a slimmer gutter.

## Out of Scope

- Redesigning any section layout or changing the visual structure of the landing page.
- Rebuilding section internals into a new shared grid system.
- Changing the hero or marquee layout.
- Introducing GSAP if Framer Motion can satisfy the scroll behavior.

## Existing Page Constraints

The page currently renders sections in this order:

1. `Landing_Hero`
2. `Marquee`
3. `ExperienceExcellence`
4. `CurvedGallery`
5. `DreamHomeListings`
6. `StatsBand`
7. `WhyUs`

The requested effect must begin after `Marquee`, so the path system should only measure and connect items 3 through 7.

The repository currently has a dirty worktree. The implementation must avoid reverting or rewriting unrelated user changes.

## Recommended Approach

Use a single viewport-width SVG overlay mounted inside the existing `main` element. The overlay will be absolutely positioned across the full measured height of the scrollable content area and rendered behind the sections using stacking context only. The component will measure the real DOM boxes of the target sections, compute safe gutter lanes at the page edges, and generate long asymmetric bezier connectors between section anchor points.

This approach avoids wrappers around section content, preserves the existing page composition, and lets the overlay react to resize without forcing layout changes onto the current components.

## Component Architecture

### `ArchitecturalScrollPath`

Responsibilities:

- Mount one SVG layer spanning the full `main` content height.
- Register and measure target sections after the marquee.
- Build connector geometry from measured rectangles.
- Render dotted SVG paths and animated pen-tip glow.
- Listen for resize and content shifts, then recompute geometry.

Key behaviors:

- `pointer-events: none`
- positioned behind content but above the page background
- no layout-affecting DOM writes during scroll
- only transform and stroke-dashoffset style updates during animation

### `PathSectionAnchor`

Implementation helper, not necessarily a visible component.

Responsibilities:

- Provide a stable way to register section elements with the overlay.
- Avoid requiring wrappers when possible.

Recommended integration:

- Add a `data-scroll-path-section` attribute to each section after the marquee.
- Add a `data-scroll-path-index` attribute matching its order.
- Let the overlay query these nodes from within `main`.

This keeps the current JSX structure intact while giving the overlay deterministic measurement targets.

### Geometry Helpers

Pure functions should be extracted for:

- responsive gutter sizing
- connector anchor calculation
- cubic bezier control point generation
- path serialization
- total path length lookup and dash animation state

## Layout Model

### Overlay Placement

- The overlay mounts inside `main`.
- `main` becomes the containing block for absolute overlay positioning.
- The overlay fills the entire content height from the top of `ExperienceExcellence` through the bottom of `WhyUs`.
- Z-index order:
  - background
  - scroll path overlay
  - all content sections

### Gutter Strategy

The path must travel only in outer whitespace and never through the central reading area.

Responsive gutter targets:

- desktop: `160px` preferred, clamped within `120px` to `180px`
- tablet: `120px` preferred, clamped within `96px` to `140px`
- mobile: `72px` preferred, clamped within `56px` to `88px`

The lane is always measured from the viewport edge inward. The line center must stay inside that lane with additional padding from the content box.

### Content Avoidance

For each measured section:

- get its bounding rect relative to `main`
- compute a protected content zone from the section’s visible content width
- choose the path anchor only on the outside edge opposite the content-heavy side
- maintain a minimum clearance between path and content box

Clearance targets:

- desktop/tablet: at least `24px`
- mobile: at least `16px`

If the measured content box grows too close to the outer lane on a narrow screen, the path should flatten and hug the page edge rather than intruding inward.

## Path Geometry

Each connector is a long cubic bezier, never a straight diagonal.

### Anchor Points

For every adjacent pair of target sections:

- start anchor sits within the source section’s outgoing outer gutter lane
- end anchor sits within the target section’s incoming outer gutter lane
- anchors use vertical positions tied to section rhythm, not exact midpoints, so the line feels like a planned drafting route rather than a robotic centerline

Recommended vertical placement:

- outgoing anchor: `35%` to `45%` through the source section height
- incoming anchor: `28%` to `40%` through the target section height

### Alternating Direction

For connector index `0..n-1`:

- even index: right edge lane to left edge lane
- odd index: left edge lane to right edge lane

### Curve Character

The line should feel hand-drafted but disciplined.

Geometry rules:

- use cubic bezier segments only
- no 45 degree line segments
- no symmetric “S” curves with mirrored handles
- vary control point distances slightly per connector
- keep horizontal drift long and elegant
- keep vertical transitions smooth and continuous

Recommended control-point logic:

- derive handle length from horizontal travel and vertical distance
- bias one control point longer than the other
- apply a small deterministic variance by connector index
- keep the variance pure and repeatable so the shape does not jitter on re-render

## Visual Style

### Stroke

- color: `#111111`
- width: `1.75px`
- linecap: `round`
- linejoin: `round`
- fill: `none`

### Dot Pattern

Use a dotted technical-pen rhythm, not chunky dashes.

Recommended stroke pattern:

- `strokeDasharray: "0.01 9"` or an equivalent circle-like dotted rhythm after browser testing
- keep spacing even
- preserve round caps so each dash reads as a dot

### Rendering Quality

- use SVG for antialiasing and stable scaling
- set `shape-rendering: geometricPrecision`
- avoid CSS filters on the full path
- keep the glow effect isolated to the moving pen tip only

## Scroll Animation

### Animation Engine

Use Framer Motion.

Rationale:

- matches the request
- integrates well with React client components
- can bind per-connector progress to scroll without adding GSAP

### Progress Model

Each connector gets its own scroll progress derived from the section pair it bridges.

Recommended mapping:

- start when the source section enters the viewport and the connector lane becomes visually relevant
- end when the target section is substantially in view
- use a normalized `0..1` progress value per connector

The connector should:

- be fully hidden at progress `0`
- progressively reveal with `stroke-dashoffset`
- erase naturally when progress reverses

### Path Drawing Technique

For each connector:

- measure full path length with `getTotalLength()`
- set `strokeDasharray` to the path length
- set `strokeDashoffset` from full length down to `0` based on scroll progress
- fade opacity from a low initial value to full visibility during the first part of the draw

### Pen Tip Glow

Render one small animated marker at the currently active connector endpoint:

- use the current path’s `getPointAtLength()`
- move the glow with `translate3d`
- keep the glow subtle, small, and elegant
- hide it when the connector progress is `0` or `1` and not actively drawing

Suggested visual treatment:

- inner dot near `#111`
- outer blur with very low opacity
- no oversized bloom

## Responsiveness

The system must recalculate on:

- window resize
- orientation change
- font/layout reflow that affects section boxes

Responsive adjustments:

- gutters get narrower on small screens
- curves flatten toward the edge on narrow widths
- path remains enabled on mobile
- content clearance remains enforced

The overlay must not rely on hardcoded desktop-only positions.

## Performance Plan

- measure layout outside the hot scroll path
- recalculate geometry on resize and with a `ResizeObserver`
- cache section rectangles and path lengths
- animate only stroke offsets, opacity, and pen-tip transforms
- use `requestAnimationFrame` indirectly through Framer Motion
- keep the SVG layer `pointer-events: none`
- avoid reading layout on every animation frame

## Error Handling and Fallbacks

- If a target section cannot be found, skip only the missing connector instead of crashing.
- If a path length cannot be measured yet, defer drawing until the ref is ready.
- If reduced motion is enabled:
  - show the completed path statically at low opacity, or
  - use a minimal fade without scroll-tied drawing
  - final implementation should choose one consistent fallback

## Testing Plan

### Functional

- Confirm path begins after `Marquee`.
- Confirm alternation order is correct across all section pairs.
- Confirm line draws forward on downward scroll and erases on upward scroll.
- Confirm pen-tip glow follows the active drawn endpoint.

### Layout Safety

- Test desktop, tablet, and mobile widths.
- Verify the line stays in outer gutters only.
- Verify no text or image block overlaps the path.
- Verify the line does not cross the page center.

### Performance

- Confirm no visible flicker during scroll.
- Confirm no layout shifts when the overlay mounts.
- Confirm scroll remains smooth with the overlay active.

### Regression

- Confirm the existing visual layout of all sections is unchanged.
- Confirm the cursor, gallery, stats animation, and marquee continue to work.

## Implementation Sequence

1. Add Framer Motion dependency if not already present.
2. Mark target sections after the marquee with stable path attributes.
3. Add `ArchitecturalScrollPath` to `app/page.tsx` inside `main`.
4. Implement measurement and geometry helpers.
5. Render the full-page SVG overlay and static connectors.
6. Add scroll-driven path drawing.
7. Add pen-tip glow.
8. Add reduced-motion fallback.
9. Validate across breakpoints and refine gutter clamps if needed.

## Open Decisions Resolved

- The path starts after hero and marquee: resolved.
- The path stays enabled on mobile: resolved.
- Try without section wrappers first: resolved.
- The path must remain edge-to-edge in outer gutters and never form through the middle: resolved.

## Risks

- Some current sections may occupy more horizontal space than expected on smaller screens, leaving very little safe gutter room.
- The gallery section has custom behavior and large visual presence, so connector anchors may need slightly more conservative clearance there.
- Without wrappers, measurement must be careful to avoid selecting decorative absolute children instead of the intended section box.

## Mitigation

- Query only top-level section elements carrying explicit path attributes.
- Clamp gutter coordinates against measured section bounds and viewport width.
- Flatten curves near narrow layouts instead of allowing center drift.
- Keep connector generation deterministic so resize recomputation does not visually jump between shapes.
