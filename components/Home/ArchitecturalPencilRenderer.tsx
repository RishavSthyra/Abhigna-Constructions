"use client";

import { useEffect, useRef } from "react";
import type {
  Material,
  Object3D,
  WebGLRenderer,
} from "three";

export type PencilTrack = {
  pathId: string;
  length: number;
  progress: number;
  direction: "left" | "right";
};

type ArchitecturalPencilRendererProps = {
  tracks: PencilTrack[];
  reducedMotion: boolean | null;
};

const PENCIL_ASSET_URL = "/pencil.glb";
const MAX_PIXEL_RATIO = 2;
const PENCIL_SCREEN_LENGTH = 156;
// The shaft is deliberately pitched into the page so the pencil reads as a
// drawing instrument standing on its graphite tip, not a flat icon.
const PENCIL_DRAWING_TILT = Math.PI * 0.32;
const PENCIL_SCREEN_SLANT_ANGLE = Math.PI / 4;
const OUT_OF_VIEWPORT_MARGIN = 120;
const PENCIL_FADE_PORTION = 0.075;
const PENCIL_FADE_OUT_PORTION = 0.09;

type Axis = "x" | "y" | "z";

type VectorComponents = {
  x: number;
  y: number;
  z: number;
};

type ActiveDrawing = {
  track: PencilTrack;
  progress: number;
  opacity: number;
};

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
): number => Math.min(Math.max(value, minimum), maximum);

const smoothstep = (value: number): number => {
  const clamped = clamp(value, 0, 1);

  return clamped * clamped * (3 - 2 * clamped);
};

const getActiveDrawing = (
  tracks: PencilTrack[],
): ActiveDrawing | null => {
  const track = [...tracks]
    .reverse()
    .find(
      (candidate) =>
        candidate.progress > 0 &&
        candidate.progress < 1 &&
        candidate.length > 0,
    );

  if (!track) {
    return null;
  }

  const progress = smoothstep(track.progress);
  const fadeIn = smoothstep(
    progress / PENCIL_FADE_PORTION,
  );
  const fadeOut = smoothstep(
    (1 - progress) /
      PENCIL_FADE_OUT_PORTION,
  );

  return {
    track,
    progress,
    opacity: Math.min(fadeIn, fadeOut),
  };
};

const getLongestAxis = (
  size: VectorComponents,
): Axis => {
  if (size.y >= size.x && size.y >= size.z) {
    return "y";
  }

  if (size.z >= size.x && size.z >= size.y) {
    return "z";
  }

  return "x";
};

const getAxisVector = (
  three: typeof import("three"),
  axis: Axis,
) => {
  const vector = new three.Vector3();
  vector[axis] = 1;

  return vector;
};

const collectMaterials = (
  object: Object3D,
): Material[] => {
  const materials = new Set<Material>();

  object.traverse((child) => {
    const mesh = child as Object3D & {
      material?: Material | Material[];
    };
    const material = mesh.material;

    if (Array.isArray(material)) {
      material.forEach((item) => materials.add(item));
    } else if (material) {
      materials.add(material);
    }
  });

  return Array.from(materials);
};

const setMaterialsOpacity = (
  materials: Material[],
  opacity: number,
): void => {
  materials.forEach((material) => {
    const transparent = opacity < 0.999;

    if (material.transparent !== transparent) {
      material.transparent = transparent;
      material.needsUpdate = true;
    }

    material.opacity = opacity;
  });
};

const disposeObject = (object: Object3D): void => {
  object.traverse((child) => {
    const mesh = child as Object3D & {
      geometry?: { dispose: () => void };
      material?: Material | Material[];
    };

    mesh.geometry?.dispose();

    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((material) => material.dispose());
    } else {
      mesh.material?.dispose();
    }
  });
};

/**
 * Renders the supplied GLB pencil in viewport coordinates. SVG remains the
 * source of truth for geometry; the renderer only places the pencil tip at
 * the visible path endpoint and rotates it from the local spline tangent.
 */
export default function ArchitecturalPencilRenderer({
  tracks,
  reducedMotion,
}: ArchitecturalPencilRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tracksRef = useRef<PencilTrack[]>(tracks);
  const requestRenderRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    tracksRef.current = tracks;
    requestRenderRef.current();
  }, [tracks]);

  useEffect(() => {
    if (reducedMotion || !canvasRef.current) {
      return;
    }

    let isDisposed = false;
    let renderer: WebGLRenderer | null = null;
    let renderFrame: number | null = null;
    let pencil: Object3D | null = null;
    let pencilMaterials: Material[] = [];

    const setupRenderer = async () => {
      const [three, loaderModule] = await Promise.all([
        import("three"),
        import("three/examples/jsm/loaders/GLTFLoader.js"),
      ]);

      if (isDisposed || !canvasRef.current) {
        return;
      }

      const canvas = canvasRef.current;
      const scene = new three.Scene();
      const camera = new three.OrthographicCamera();
      const pencilPivot = new three.Group();
      const tiltPivot = new three.Group();

      pencilPivot.add(tiltPivot);
      pencilPivot.visible = false;
      scene.add(pencilPivot);
      scene.add(new three.HemisphereLight(0xffffff, 0x66503a, 2.4));

      const keyLight = new three.DirectionalLight(0xffffff, 2.1);
      keyLight.position.set(-0.4, 0.7, 1.2);
      scene.add(keyLight);

      renderer = new three.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas,
        powerPreference: "high-performance",
      });
      renderer.setClearAlpha(0);
      renderer.outputColorSpace = three.SRGBColorSpace;

      const resize = () => {
        if (!renderer) {
          return;
        }

        const width = window.innerWidth;
        const height = window.innerHeight;

        renderer.setPixelRatio(
          Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO),
        );
        renderer.setSize(width, height, false);
        camera.left = -width / 2;
        camera.right = width / 2;
        camera.top = height / 2;
        camera.bottom = -height / 2;
        camera.near = 0.1;
        camera.far = 1000;
        camera.position.z = 500;
        camera.updateProjectionMatrix();
      };

      const render = () => {
        renderFrame = null;

        if (!renderer) {
          return;
        }

        const activeDrawing = getActiveDrawing(
          tracksRef.current,
        );
        const path = activeDrawing
          ? document.getElementById(activeDrawing.track.pathId)
          : null;

        if (
          !pencil ||
          !activeDrawing ||
          !(path instanceof SVGPathElement) ||
          activeDrawing.track.length <= 0 ||
          activeDrawing.opacity <= 0
        ) {
          pencilPivot.visible = false;
          renderer.render(scene, camera);
          return;
        }

        const drawLength =
          activeDrawing.track.length * activeDrawing.progress;
        const screenMatrix = path.getScreenCTM();

        if (!screenMatrix) {
          pencilPivot.visible = false;
          renderer.render(scene, camera);
          return;
        }

        const pathPoint = path.getPointAtLength(drawLength);
        const point = new DOMPoint(
          pathPoint.x,
          pathPoint.y,
        ).matrixTransform(screenMatrix);
        const viewportX = point.x;
        const viewportY = point.y;
        const screenRotation =
          activeDrawing.track.direction ===
          "right"
            ? PENCIL_SCREEN_SLANT_ANGLE
            : Math.PI -
              PENCIL_SCREEN_SLANT_ANGLE;
        const isInViewport =
          viewportX >= -OUT_OF_VIEWPORT_MARGIN &&
          viewportX <= window.innerWidth + OUT_OF_VIEWPORT_MARGIN &&
          viewportY >= -OUT_OF_VIEWPORT_MARGIN &&
          viewportY <= window.innerHeight + OUT_OF_VIEWPORT_MARGIN;

        pencilPivot.visible = isInViewport;

        if (isInViewport) {
          pencilPivot.position.set(
            viewportX - window.innerWidth / 2,
            window.innerHeight / 2 - viewportY,
            0,
          );
          pencilPivot.rotation.set(
            0,
            0,
            screenRotation,
          );
          setMaterialsOpacity(
            pencilMaterials,
            activeDrawing.opacity,
          );
        }

        renderer.render(scene, camera);
      };

      const requestRender = () => {
        if (renderFrame === null) {
          renderFrame = window.requestAnimationFrame(render);
        }
      };

      requestRenderRef.current = requestRender;
      window.addEventListener("resize", resize, {
        passive: true,
      });
      resize();

      const loader = new loaderModule.GLTFLoader();
      loader.load(
        PENCIL_ASSET_URL,
        (gltf) => {
          const model = gltf.scene;

          if (isDisposed) {
            disposeObject(model);
            return;
          }

          const sourceBounds = new three.Box3().setFromObject(model);
          const sourceSize = sourceBounds.getSize(
            new three.Vector3(),
          );
          const longestAxis = getLongestAxis(sourceSize);
          const longestDimension = Math.max(
            sourceSize.x,
            sourceSize.y,
            sourceSize.z,
            1,
          );
          const alignToScreen = new three.Quaternion().setFromUnitVectors(
            getAxisVector(three, longestAxis),
            new three.Vector3(1, 0, 0),
          );
          const modelRoot = new three.Group();

          modelRoot.add(model);
          modelRoot.quaternion.copy(alignToScreen);

          // This GLB has its sharpened graphite end at the model's minimum
          // X bound. Anchor that point at the path endpoint.
          const alignedBounds = new three.Box3().setFromObject(modelRoot);
          const alignedCenter = alignedBounds.getCenter(
            new three.Vector3(),
          );
          const normalizedScale =
            PENCIL_SCREEN_LENGTH / longestDimension;
          modelRoot.position.set(
            -alignedBounds.min.x * normalizedScale,
            -alignedCenter.y * normalizedScale,
            -alignedCenter.z * normalizedScale,
          );
          modelRoot.scale.setScalar(normalizedScale);

          tiltPivot.rotation.y = PENCIL_DRAWING_TILT;
          tiltPivot.add(modelRoot);
          pencil = modelRoot;
          pencilMaterials = collectMaterials(modelRoot);
          requestRender();
        },
        undefined,
        () => {
          // Keep the SVG-only drawing experience when the optional model
          // asset cannot be loaded.
          pencilPivot.visible = false;
        },
      );

      requestRender();

      return () => {
        window.removeEventListener("resize", resize);
        if (renderFrame !== null) {
          window.cancelAnimationFrame(renderFrame);
        }
        requestRenderRef.current = () => undefined;

        if (pencil) {
          disposeObject(pencil);
        }

        renderer?.dispose();
      };
    };

    let disposeRenderer: (() => void) | undefined;

    void setupRenderer().then((cleanup) => {
      if (isDisposed) {
        cleanup?.();
        return;
      }

      disposeRenderer = cleanup;
    });

    return () => {
      isDisposed = true;
      disposeRenderer?.();
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] h-dvh w-dvw"
    />
  );
}
