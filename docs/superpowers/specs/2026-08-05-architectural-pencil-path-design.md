# Architectural Pencil Path Design

## Goal

Make the homepage's existing architectural dashed connectors feel physically drawn. A single 3D pencil model from `public/pencil.fbx` follows the live drawing endpoint, rotating into the spline as the user scrolls. The featured-projects section must no longer leave a large empty band below its cards.

## Scope

- Preserve the existing single-cubic SVG connector geometry and dashed line style.
- Preserve the rule that connectors must not cross Featured Projects or Stats Band content.
- Add one transparent, pointer-inert WebGL canvas over the SVG overlay.
- Load `public/pencil.fbx` once and place the model at the endpoint of the connector currently being revealed.
- Derive pencil position from SVG path length and its heading from nearby `getPointAtLength` samples.
- Tighten the desktop pinned Featured Projects panel so project cards use the available rail height rather than ending at a fixed short card height.

## Interaction

1. Scroll progress reveals each static dashed path through its existing dash mask.
2. The active path's revealed length determines the pen-tip location.
3. Two nearby path samples produce a tangent vector. Its `atan2` angle drives the pencil's screen rotation, with a single documented asset-axis offset for the FBX's native orientation.
4. The pencil is visible only while a connector is partially drawn. It fades out before and after that interval. Reduced-motion users see complete paths and no moving model.
5. If the model cannot load or WebGL is unavailable, the existing SVG behavior remains fully functional; the pencil layer is simply absent.

## Architecture

- `ArchitecturalScrollPath` remains the source of path layout and scroll progress.
- A small pencil-renderer module owns Three.js renderer setup, FBX loading, resizing, and disposal.
- The SVG path elements remain in the DOM because they provide exact geometry and reveal masks.
- Every animation frame reads only current path progress and path geometry, then updates the pencil scene. It does not measure layout or write React state.
- The renderer uses an orthographic camera mapped to CSS viewport pixels so the model's tip can align with the SVG endpoint.

## Layout Safety

- Excluded zones continue to mask line rendering over Featured Projects and Stats Band.
- The pencil uses the same connector endpoint and therefore cannot enter a masked section.
- The project rail's desktop cards grow to the available rail space with responsive bounds. The containing pinned panel therefore ends closely after the images instead of reserving a large unused vertical region.

## Performance And Error Handling

- One canvas, one loaded FBX model, one `requestAnimationFrame` render loop.
- Transparent alpha canvas, antialiasing, and no pointer events.
- The model and renderer are disposed when the component unmounts.
- A failed FBX fetch or unavailable WebGL resolves to the existing line-only experience without throwing into the page.

## Verification

- Desktop: the pencil follows every visible dashed connector, its tip stays on the line, and its tilt follows each curve.
- Responsive: no line or pencil overlaps the Featured Projects or Stats content; project panel has no large blank lower band.
- Accessibility: `prefers-reduced-motion` renders the completed paths without continuous pencil movement.
- Quality: TypeScript, ESLint, production build, and a browser smoke test pass.
