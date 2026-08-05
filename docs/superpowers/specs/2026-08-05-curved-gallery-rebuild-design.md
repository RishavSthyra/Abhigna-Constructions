# Curved Gallery Rebuild Design

Date: 2026-08-05
Project: `abhigna-constructions`
Scope: Restore `components/Home/CurvedGallery.tsx` as a premium cylindrical carousel with drag, inertia, and auto-rotation.

## Goal

Rebuild the deleted and partially corrupted curved gallery as a stable, premium inward-cylinder carousel. The result should feel physically rigid, visually luxurious, and consistent with the earlier Vision Pro / high-end Awwwards direction: edge cards appear larger through perspective, center cards sit farther back, and the entire band rotates as one continuous cylindrical surface.

## In Scope

- Replace the current broken `CurvedGallery.tsx` implementation.
- Preserve the section’s role in the landing page.
- Support:
  - auto-rotation
  - pointer drag
  - inertia / momentum after release
  - friction / damping
- Keep responsive sizing for:
  - card width
  - card height
  - cylinder radius
  - perspective / camera distance
  - gap / spacing
  - edge fades
- Use transform-only animation for runtime updates.
- Sort cards by depth every frame so the nearest card layers correctly.

## Out of Scope

- Redesigning the entire homepage section order.
- Changing the images themselves beyond using the existing gallery image set.
- Coupling the gallery to the architectural scroll-path logic.
- Adding captions, filters, pagination dots, or CMS behavior.

## Current Problem

The current `CurvedGallery.tsx` is in an inconsistent state:

- geometry mixes multiple experimental approaches
- spacing math is no longer trustworthy
- animation flow is brittle
- the premium cylindrical illusion has been lost

Instead of patching the current file incrementally, the safer path is a clean rebuild using a single coherent cylinder model.

## Recommended Approach

Use one rigid-cylinder render model driven by a shared rotation angle.

Every card gets a fixed slot on the cylinder. The gallery never moves cards independently. Instead:

- each card has a base angle
- the carousel stores one global `rotation`
- each frame computes `cardAngle = baseAngle + rotation`
- transform, depth, opacity, and z-order derive from that shared angle

This gives consistent spacing, no snapping, and a much more believable premium motion profile.

## Interaction Model

### Auto-Rotation

- The carousel rotates continuously while idle.
- Auto-rotation pauses implicitly when the user drags.
- Auto-rotation resumes after release while inertia decays back toward idle behavior.

### Dragging

- Pointer dragging controls angular displacement.
- Horizontal pointer movement maps directly to cylinder rotation delta.
- Dragging should feel immediate and not lag behind the pointer.

### Inertia

- On release, the current angular velocity is preserved.
- Velocity decays through exponential damping.
- The decay must feel premium and controlled, not abrupt.

### Motion Rules

- No snapping to slots.
- No per-card interpolation.
- Only the shared cylinder rotation changes over time.
- Reduced-motion users should see a stable non-animated composition with dragging and auto-rotation disabled.

## Geometry Model

### Cylinder

The gallery is treated as the visible front half of a concave cylinder.

- cards live on the inside surface
- center cards are farther from the camera
- edge cards come closer to the camera
- perspective makes edge cards appear larger naturally

### Card Placement

Each card has:

- a fixed base angle based on its index
- a computed `x` position from the cylinder radius and angle
- a computed `z` depth from the same angle
- a `rotateY` so the card tangentially follows the cylinder surface

Optional very light polish such as a tiny roll or opacity fade can be used, but the core illusion must come from the cylinder, not arbitrary scale tricks.

### Spacing

Spacing must be rigid and derived from the cylinder layout itself.

Preferred model:

- derive a visible-angle window from viewport width
- derive card width responsively
- derive gap responsively
- compute angular spacing from the card slot around the cylinder

This keeps every neighboring card relationship constant while the cylinder rotates.

### Depth and Scale

Depth should come from perspective rather than fake manual scaling.

Allowed:

- CSS perspective on the parent stage
- `translate3d(...)`
- `rotateY(...)`

Avoid:

- arbitrary scale curves that fight the perspective model
- geometry that changes depending on scroll or time

If a tiny corrective scale is necessary for polish, it should be minimal and only used after the perspective model is already correct.

## Responsive Rules

Everything should derive from measured section width rather than hardcoded desktop constants.

Responsive values:

- `cardWidth`
- `cardHeight`
- `gap`
- `radius`
- `cameraDistance`
- `fadeWidth`

Responsive behavior goals:

- mobile still reads as a curved premium band
- desktop has wider breathing room and deeper perspective
- no breakpoint should flatten into a broken strip

## Rendering Model

### DOM Structure

Keep the current structure conceptually simple:

- section
- perspective stage
- 3D track container
- absolutely positioned cards
- left/right fade overlays

### Animation Pipeline

- `requestAnimationFrame`
- update shared rotation and velocity
- recompute transforms
- apply only `transform`, `opacity`, `zIndex`, and pointer-events

No layout reads inside the hot frame loop except where absolutely required.

### Z Ordering

- Each frame computes depth for every card.
- Cards are sorted by depth.
- Nearest card receives the highest z-index.

This prevents visual glitches where a far card overlaps a near one incorrectly.

## Visual Direction

The rebuilt gallery should feel:

- premium
- restrained
- editorial
- physically coherent

It should not feel:

- game-like
- exaggerated
- gimmicky
- over-animated

### Specific Visual Traits

- soft edge fades to conceal exits
- rounded cards
- generous image crop
- strong but tasteful perspective
- smooth continuous rotation
- slight overlap only as a result of perspective, not random spacing hacks

## State and Data Flow

### Refs

Use refs for runtime animation state:

- section element
- card elements
- rotation
- inertia velocity
- drag state
- pointer tracking
- animation frame id
- previous frame timestamp

### State

Use React state only for slower-changing layout values:

- measured layout metrics
- responsive render metrics if needed for styles

High-frequency animation values should remain outside React state to avoid re-render pressure.

## Error Handling and Fallbacks

- If resize measurement fails, retain the previous valid layout.
- If a card ref is missing, skip that element without breaking the loop.
- If reduced motion is enabled:
  - disable drag, inertia, and auto-rotation
  - render the gallery as a stable static cylinder composition

## Testing Plan

### Functional

- verify drag works with mouse/touch/pointer input
- verify inertia continues after release
- verify idle auto-rotation resumes cleanly
- verify cards never snap or jump

### Visual

- center card appears slightly smaller and farther back
- edge cards appear closer and larger
- spacing stays visually rigid while rotating
- cards remain on one continuous inward curve
- no visible flattening into a row

### Responsive

- test mobile width
- test tablet width
- test desktop width
- verify no broken overlaps or giant holes

### Performance

- verify smooth motion at 60fps on typical desktop behavior
- verify no layout thrashing from the animation loop
- verify only transform/opacity/z-index mutate per frame

## Implementation Sequence

1. Replace the current gallery geometry with a clean rigid-cylinder helper model.
2. Rebuild layout measurement around section width and responsive derived metrics.
3. Restore pointer drag handling.
4. Restore inertia and idle auto-rotation.
5. Reintroduce edge fades and perspective stage.
6. Add per-frame depth sorting.
7. Run build and lint, then tune responsive constants visually.

## Risks

- It is easy to fake the illusion with scale curves that look good in one viewport but collapse elsewhere.
- The current file already contains mixed logic, so partial reuse may reintroduce instability.
- Responsive tuning may need a second visual pass after the functional rebuild is in place.

## Mitigation

- Prefer replacing the geometry core rather than patching it.
- Keep the model based on one shared rotation value.
- Derive layout from width measurement only.
- Keep helper functions small and explicit so future tuning is controlled.
