"use client";

import {
  useEffect,
  useEffectEvent,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useReducedMotion } from "framer-motion";
import ArchitecturalPencilRenderer, {
  type PencilTrack,
} from "./ArchitecturalPencilRenderer";

type Side = "left" | "right";

type Rect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};

type SectionMeasurement = {
  index: number;
  id: string;
  rect: Rect;
  contentRect: Rect | null;
  pageTop: number;
};

type ConnectorLayout = {
  id: string;
  index: number;
  d: string;
  fromSide: Side;
  toSide: Side;
  triggerY: number;
  durationMs: number;
};

type OverlayLayout = {
  width: number;
  height: number;
  connectors: ConnectorLayout[];
  excludedZones: Rect[];
};

type ArchitecturalScrollPathProps = {
  mainId?: string;
};

const SECTION_SELECTOR = "[data-scroll-path-section='true']";
const CONTENT_SELECTOR = "[data-scroll-path-content='true']";
const EDGE_OFFSET = 14;
const BASE_STROKE_WIDTH = 2;
const MASK_STROKE_WIDTH = 14;
const DASH_PATTERN = "10 14";
const CONNECTOR_VIEWPORT_TRIGGER_RATIO = 0.82;
const PRELUDE_ANIMATION_DURATION_MS = 2400;
const CONNECTOR_ANIMATION_DURATION_MS = 2200;
const EXCLUDED_SECTION_IDS = new Set([
  "stats-band",
  // The Featured Projects grid uses a 16:8 wide tile plus 4:5 portrait
  // tiles — drawing the dashed connector through it overlaps the image
  // content. Skip the connector around it, like stats-band.
  "featured-projects",
]);

const hasExcludedGapBetween = (
  sections: SectionMeasurement[],
  startIndex: number,
  endIndex: number,
): boolean => {
  for (let index = startIndex + 1; index < endIndex; index += 1) {
    if (EXCLUDED_SECTION_IDS.has(sections[index].id)) {
      return true;
    }
  }

  return false;
};

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(Math.max(value, minimum), maximum);

const smoothstep = (value: number): number => {
  const clamped = clamp(value, 0, 1);

  return clamped * clamped * (3 - 2 * clamped);
};

const toRelativeRect = (
  rect: DOMRect,
  rootRect: DOMRect,
): Rect => ({
  top: rect.top - rootRect.top,
  right: rect.right - rootRect.left,
  bottom: rect.bottom - rootRect.top,
  left: rect.left - rootRect.left,
  width: rect.width,
  height: rect.height,
});

const getVerticalClearance = (
  viewportWidth: number,
): number => (viewportWidth < 768 ? 64 : 104);

const getOutgoingAnchorY = (
  sectionRect: Rect,
  contentRect: Rect | null,
  viewportWidth: number,
): number => {
  const clearance = getVerticalClearance(
    viewportWidth,
  );
  const baseY =
    sectionRect.bottom -
    clamp(
      sectionRect.height * 0.14,
      88,
      196,
    );

  return clamp(
    Math.max(
      baseY,
      contentRect
        ? contentRect.bottom + clearance
        : baseY,
    ),
    sectionRect.top + sectionRect.height * 0.6,
    sectionRect.bottom - 36,
  );
};

const getIncomingAnchorY = (
  sectionRect: Rect,
  contentRect: Rect | null,
  viewportWidth: number,
): number => {
  const clearance = getVerticalClearance(
    viewportWidth,
  );
  const baseY =
    sectionRect.top +
    clamp(
      sectionRect.height * 0.1,
      52,
      132,
    );

  return clamp(
    Math.min(
      baseY,
      contentRect
        ? contentRect.top - clearance
        : baseY,
    ),
    sectionRect.top + 20,
    sectionRect.top + sectionRect.height * 0.24,
  );
};

const createConnectorPath = ({
  width,
  startX,
  startY,
  endX,
  endY,
  fromSide,
}: {
  width: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  fromSide: Side;
}): string => {
  const verticalSpan = endY - startY;
  const absVerticalSpan =
    Math.abs(verticalSpan);
  const direction =
    verticalSpan === 0
      ? 1
      : Math.sign(verticalSpan);
  const edgeControlInset = clamp(
    width * (width < 768 ? 0.065 : 0.075),
    34,
    88,
  );
  const entryLead = Math.min(
    clamp(
      absVerticalSpan * 0.36,
      width < 768 ? 88 : 120,
      width < 768 ? 168 : 228,
    ),
    absVerticalSpan * 0.72,
  );
  const exitLead = Math.min(
    clamp(
      absVerticalSpan * 0.12,
      width < 768 ? 18 : 26,
      width < 768 ? 42 : 58,
    ),
    absVerticalSpan * 0.24,
  );
  const firstControlX =
    fromSide === "right"
      ? width - edgeControlInset
      : edgeControlInset;
  const secondControlX =
    fromSide === "right"
      ? edgeControlInset
      : width - edgeControlInset;
  const firstControlY =
    startY + direction * entryLead;
  const secondControlY =
    endY - direction * exitLead;

  return [
    `M ${startX.toFixed(2)} ${startY.toFixed(2)}`,
    `C ${firstControlX.toFixed(2)} ${firstControlY.toFixed(2)}, ${secondControlX.toFixed(2)} ${secondControlY.toFixed(2)}, ${endX.toFixed(2)} ${endY.toFixed(2)}`,
  ].join(" ");
};

const getExcludedZoneInset = (
  viewportWidth: number,
): number => (viewportWidth < 768 ? 28 : 48);

const getPreludeSafeTopY = (
  sectionRect: Rect,
  contentRect: Rect | null,
  viewportWidth: number,
): number =>
  contentRect
    ? Math.max(
        contentRect.top -
          (viewportWidth < 768 ? 74 : 108),
        sectionRect.top +
          (viewportWidth < 768 ? 24 : 32),
      )
    : sectionRect.top + sectionRect.height * 0.22;

const createPreludePath = ({
  width,
  sectionRect,
  contentRect,
}: {
  width: number;
  sectionRect: Rect;
  contentRect: Rect | null;
}): string => {
  const startX = EDGE_OFFSET;
  const endX = width - EDGE_OFFSET;
  const safeTopY = getPreludeSafeTopY(
    sectionRect,
    contentRect,
    width,
  );
  const startY = Math.max(
    sectionRect.top +
      (width < 768 ? 14 : 18),
    24,
  );
  const endY = Math.max(
    safeTopY,
    startY +
      (width < 768 ? 74 : 108),
  );
  const span = endY - startY;
  const firstControlX = clamp(
    width * 0.07,
    44,
    92,
  );
  const secondControlX = clamp(
    width * 0.78,
    width * 0.66,
    width - 72,
  );
  const firstControlY =
    startY + span * 0.68;
  const secondControlY =
    startY + span * 0.92;

  return [
    `M ${startX.toFixed(2)} ${startY.toFixed(2)}`,
    `C ${firstControlX.toFixed(2)} ${firstControlY.toFixed(2)}, ${secondControlX.toFixed(2)} ${secondControlY.toFixed(2)}, ${endX.toFixed(2)} ${endY.toFixed(2)}`,
  ].join(" ");
};

const areProgressListsEqual = (
  first: number[],
  second: number[],
): boolean =>
  first.length === second.length &&
  first.every(
    (value, index) =>
      Math.abs(value - second[index]) < 0.001,
  );

export default function ArchitecturalScrollPath({
  mainId = "landing-main",
}: ArchitecturalScrollPathProps) {
  const componentId = useId().replace(/:/g, "-");
  const prefersReducedMotion =
    useReducedMotion();
  const pathRefs = useRef<
    Array<SVGPathElement | null>
  >([]);
  const resizeFrameRef = useRef<number | null>(
    null,
  );
  const playbackFrameRef = useRef<number | null>(
    null,
  );
  const startedAtRef = useRef<
    Array<number | null>
  >([]);
  const progressRef = useRef<number[]>([]);
  const [overlayLayout, setOverlayLayout] =
    useState<OverlayLayout>({
      width: 0,
      height: 0,
      connectors: [],
      excludedZones: [],
    });
  const [pathLengths, setPathLengths] =
    useState<number[]>([]);
  const [
    connectorProgresses,
    setConnectorProgresses,
  ] = useState<number[]>([]);

  const measureOverlay = useEffectEvent(() => {
    const mainElement =
      document.getElementById(mainId);

    if (!mainElement) {
      return;
    }

    const mainRect =
      mainElement.getBoundingClientRect();
    const sectionElements = Array.from(
      mainElement.querySelectorAll<HTMLElement>(
        SECTION_SELECTOR,
      ),
    )
      .sort(
        (first, second) =>
          Number(
            first.dataset.scrollPathIndex ?? 0,
          ) -
          Number(
            second.dataset.scrollPathIndex ?? 0,
          ),
      );

    const sections: SectionMeasurement[] =
      sectionElements.map((section) => {
        const sectionRect =
          section.getBoundingClientRect();
        const contentElement =
          section.querySelector<HTMLElement>(
            CONTENT_SELECTOR,
          );
        const contentRect = contentElement
          ? toRelativeRect(
              contentElement.getBoundingClientRect(),
              mainRect,
            )
          : null;

        return {
          index: Number(
            section.dataset.scrollPathIndex ?? 0,
          ),
          id:
            section.dataset.scrollPathSectionId ??
            `section-${section.dataset.scrollPathIndex ?? "0"}`,
          rect: toRelativeRect(
            sectionRect,
            mainRect,
          ),
          contentRect,
          pageTop:
            sectionRect.top + window.scrollY,
        };
      });
    const routeSections = sections.filter(
      (section) =>
        !EXCLUDED_SECTION_IDS.has(section.id),
    );

    const nextWidth = mainRect.width;
    const nextHeight = mainElement.scrollHeight;
    const viewportHeight =
      window.innerHeight;
    const excludedZoneInset =
      getExcludedZoneInset(nextWidth);

    const connectors: ConnectorLayout[] = [];

    if (routeSections.length > 0) {
      const firstSection = routeSections[0];
      const fromSide: Side = "left";
      const toSide: Side = "right";

      connectors.push({
        id: `prelude-${firstSection.id}`,
        index: 0,
        d: createPreludePath({
          width: nextWidth,
          sectionRect: firstSection.rect,
          contentRect:
            firstSection.contentRect,
        }),
        fromSide,
        toSide,
        triggerY:
          firstSection.pageTop +
          firstSection.rect.height * 0.04,
        durationMs:
          PRELUDE_ANIMATION_DURATION_MS,
      });
    }

    routeSections
      .slice(0, -1)
      .forEach((sourceSection, offset) => {
        const targetSection =
          routeSections[offset + 1];

        if (!targetSection) {
          return;
        }

        const sourceSectionIndex =
          sections.findIndex(
            (section) =>
              section.id === sourceSection.id,
          );
        const targetSectionIndex =
          sections.findIndex(
            (section) =>
              section.id === targetSection.id,
          );

        if (
          sourceSectionIndex === -1 ||
          targetSectionIndex === -1 ||
          hasExcludedGapBetween(
            sections,
            sourceSectionIndex,
            targetSectionIndex,
          )
        ) {
          return;
        }

        const connectorIndex =
          offset + 1;
        const fromSide: Side =
          connectorIndex % 2 === 1
            ? "right"
            : "left";
        const toSide: Side =
          fromSide === "right"
            ? "left"
            : "right";
        const startX =
          fromSide === "right"
            ? nextWidth - EDGE_OFFSET
            : EDGE_OFFSET;
        const endX =
          toSide === "right"
            ? nextWidth - EDGE_OFFSET
            : EDGE_OFFSET;

        connectors.push({
          id: `${sourceSection.id}-${targetSection.id}`,
          index: connectorIndex,
          d: createConnectorPath({
            width: nextWidth,
            startX,
            startY: getOutgoingAnchorY(
              sourceSection.rect,
              sourceSection.contentRect,
              nextWidth,
            ),
            endX,
            endY: getIncomingAnchorY(
              targetSection.rect,
              targetSection.contentRect,
              nextWidth,
            ),
            fromSide,
          }),
          fromSide,
          toSide,
          triggerY:
            sourceSection.pageTop +
            sourceSection.rect.height * 0.58,
          durationMs:
            CONNECTOR_ANIMATION_DURATION_MS,
        });
      });
    const excludedZones = sections
      .filter((section) =>
        EXCLUDED_SECTION_IDS.has(section.id),
      )
      .map((section) => {
        const top = Math.max(
          section.rect.top - excludedZoneInset,
          0,
        );
        const bottom = Math.min(
          section.rect.bottom + excludedZoneInset,
          nextHeight,
        );

        return {
          top,
          right: nextWidth,
          bottom,
          left: 0,
          width: nextWidth,
          height: bottom - top,
        };
      });

    setOverlayLayout({
      width: nextWidth,
      height: nextHeight,
      connectors,
      excludedZones,
    });
  });

  const queueMeasure = useEffectEvent(() => {
    if (resizeFrameRef.current !== null) {
      window.cancelAnimationFrame(
        resizeFrameRef.current,
      );
    }

    resizeFrameRef.current =
      window.requestAnimationFrame(() => {
        resizeFrameRef.current = null;
        measureOverlay();
      });
  });

  useEffect(() => {
    const syncMeasurement =
      window.requestAnimationFrame(() => {
        measureOverlay();
      });

    const mainElement =
      document.getElementById(mainId);

    if (!mainElement) {
      return;
    }

    const observedElements = [
      mainElement,
      ...Array.from(
        mainElement.querySelectorAll<HTMLElement>(
          `${SECTION_SELECTOR}, ${CONTENT_SELECTOR}`,
        ),
      ),
    ];

    const resizeObserver = new ResizeObserver(
      () => {
        queueMeasure();
      },
    );

    for (const element of observedElements) {
      resizeObserver.observe(element);
    }

    window.addEventListener(
      "resize",
      queueMeasure,
      { passive: true },
    );
    window.addEventListener(
      "load",
      queueMeasure,
    );

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener(
        "resize",
        queueMeasure,
      );
      window.removeEventListener(
        "load",
        queueMeasure,
      );

      if (resizeFrameRef.current !== null) {
        window.cancelAnimationFrame(
          resizeFrameRef.current,
        );
      }

      window.cancelAnimationFrame(
        syncMeasurement,
      );
    };
  }, [mainId]);

  useEffect(() => {
    const nextLengths =
      overlayLayout.connectors.map(
        (_, index) =>
          pathRefs.current[index]?.getTotalLength() ??
          0,
      );

    setPathLengths((currentLengths) => {
      if (
        currentLengths.length ===
          nextLengths.length &&
        currentLengths.every(
          (length, index) =>
            Math.abs(length - nextLengths[index]) <
            0.5,
        )
      ) {
        return currentLengths;
      }

      return nextLengths;
    });
  }, [overlayLayout]);

  useEffect(() => {
    const initialProgresses =
      overlayLayout.connectors.map(() =>
        prefersReducedMotion ? 1 : 0,
      );

    startedAtRef.current =
      overlayLayout.connectors.map(() =>
        prefersReducedMotion ? 0 : null,
      );
    progressRef.current = initialProgresses;
    setConnectorProgresses(initialProgresses);

    if (playbackFrameRef.current !== null) {
      window.cancelAnimationFrame(
        playbackFrameRef.current,
      );
      playbackFrameRef.current = null;
    }
  }, [
    overlayLayout.connectors,
    prefersReducedMotion,
  ]);

  const animateConnectors = useEffectEvent(
    (now: number) => {
      playbackFrameRef.current = null;

      const nextProgresses = [
        ...progressRef.current,
      ];
      let hasActiveAnimation = false;
      let changed = false;

      overlayLayout.connectors.forEach(
        (connector, index) => {
          const startedAt =
            startedAtRef.current[index];

          if (startedAt === null) {
            return;
          }

          const nextProgress = clamp(
            (now - startedAt) /
              connector.durationMs,
            0,
            1,
          );

          if (
            Math.abs(
              nextProgresses[index] -
                nextProgress,
            ) >= 0.001
          ) {
            nextProgresses[index] =
              nextProgress;
            changed = true;
          }

          if (nextProgress < 1) {
            hasActiveAnimation = true;
          }
        },
      );

      if (changed) {
        progressRef.current = nextProgresses;
        setConnectorProgresses((current) =>
          areProgressListsEqual(
            current,
            nextProgresses,
          )
            ? current
            : nextProgresses,
        );
      }

      if (hasActiveAnimation) {
        playbackFrameRef.current =
          window.requestAnimationFrame(
            animateConnectors,
          );
      }
    },
  );

  const startVisibleConnectors =
    useEffectEvent((now: number) => {
      if (prefersReducedMotion) {
        return;
      }

      const viewportTriggerY =
        window.scrollY +
        window.innerHeight *
          CONNECTOR_VIEWPORT_TRIGGER_RATIO;
      let shouldAnimate = false;

      overlayLayout.connectors.forEach(
        (connector, index) => {
          if (
            startedAtRef.current[index] !==
              null ||
            viewportTriggerY <
              connector.triggerY
          ) {
            return;
          }

          startedAtRef.current[index] = now;
          shouldAnimate = true;
        },
      );

      if (
        shouldAnimate &&
        playbackFrameRef.current === null
      ) {
        playbackFrameRef.current =
          window.requestAnimationFrame(
            animateConnectors,
          );
      }
    });

  useEffect(() => {
    if (
      prefersReducedMotion ||
      overlayLayout.connectors.length === 0
    ) {
      return;
    }

    const triggerPlayback = () => {
      startVisibleConnectors(
        performance.now(),
      );
    };

    triggerPlayback();
    window.addEventListener(
      "scroll",
      triggerPlayback,
      { passive: true },
    );
    window.addEventListener(
      "resize",
      triggerPlayback,
      { passive: true },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        triggerPlayback,
      );
      window.removeEventListener(
        "resize",
        triggerPlayback,
      );

      if (playbackFrameRef.current !== null) {
        window.cancelAnimationFrame(
          playbackFrameRef.current,
        );
        playbackFrameRef.current = null;
      }
    };
  }, [
    animateConnectors,
    overlayLayout.connectors,
    prefersReducedMotion,
    startVisibleConnectors,
  ]);

  const connectorStates = useMemo(
    () =>
      overlayLayout.connectors.map(
        (connector, index) => {
          const progress = smoothstep(
            prefersReducedMotion
              ? 1
              : connectorProgresses[index] ??
                  0,
          );

          return {
            connector,
            length:
              pathLengths[index] ?? 0,
            progress,
          };
        },
      ),
    [
      overlayLayout.connectors,
      connectorProgresses,
      pathLengths,
      prefersReducedMotion,
    ],
  );

  const pencilTracks = useMemo<PencilTrack[]>(
    () =>
      overlayLayout.connectors.map((connector, index) => ({
        pathId: `${componentId}-path-${connector.id}`,
        length: pathLengths[index] ?? 0,
        progress:
          connectorProgresses[index] ?? 0,
        direction:
          connector.toSide === "right"
            ? "right"
            : "left",
      })),
    [
      componentId,
      connectorProgresses,
      overlayLayout.connectors,
      pathLengths,
    ],
  );

  if (
    overlayLayout.width === 0 ||
    overlayLayout.height === 0 ||
    overlayLayout.connectors.length === 0
  ) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${overlayLayout.width} ${overlayLayout.height}`}
        preserveAspectRatio="none"
        style={{
          shapeRendering:
            "geometricPrecision",
          overflow: "visible",
        }}
      >
        <defs>
          {connectorStates.map(
            ({ connector, length, progress }) => (
              <mask
                key={`mask-${connector.id}`}
                id={`${componentId}-mask-${connector.id}`}
                maskUnits="userSpaceOnUse"
              >
                <rect
                  x="0"
                  y="0"
                  width={overlayLayout.width}
                  height={overlayLayout.height}
                  fill="black"
                />
                <path
                  d={connector.d}
                  fill="none"
                  stroke="white"
                  strokeWidth={MASK_STROKE_WIDTH}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={
                    length > 0
                      ? `${length}`
                      : undefined
                  }
                  strokeDashoffset={
                    length > 0
                      ? length * (1 - progress)
                      : undefined
                  }
                />
                {overlayLayout.excludedZones.map(
                  (zone, index) => (
                    <rect
                      key={`${connector.id}-zone-${index}`}
                      x={zone.left}
                      y={zone.top}
                      width={zone.width}
                      height={zone.height}
                      fill="black"
                    />
                  ),
                )}
              </mask>
            ),
          )}
        </defs>

        {connectorStates.map(
          ({ connector }, index) => (
            <path
            key={connector.id}
            id={`${componentId}-path-${connector.id}`}
              ref={(element) => {
                pathRefs.current[index] =
                  element;
              }}
              d={connector.d}
              fill="none"
              stroke="#111"
              strokeWidth={BASE_STROKE_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={DASH_PATTERN}
              vectorEffect="non-scaling-stroke"
              mask={`url(#${componentId}-mask-${connector.id})`}
            />
          ),
        )}
      </svg>
      <ArchitecturalPencilRenderer
        tracks={pencilTracks}
        reducedMotion={prefersReducedMotion}
      />
    </div>
  );
}
