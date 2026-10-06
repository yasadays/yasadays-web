import { useEffect, useState, type CSSProperties } from "react";
import {
  between,
  INK,
  randomShapeState,
  SHAPE_PATHS,
  shapeTransform,
  type ShapeState,
} from "../../lib/shapes";
import { cn } from "../../lib/utils";

import styles from "./AboutShapes.module.css";

const slots = [
  { x: 8, y: 10, size: 16 },
  { x: 32, y: 2, size: 11 },
  { x: 62, y: 4, size: 13 },
  { x: 91, y: 10, size: 15 },
  { x: 22, y: 30, size: 8 },
  { x: 76, y: 30, size: 8 },
  { x: 4, y: 44, size: 12 },
  { x: 96, y: 42, size: 11 },
  { x: 10, y: 72, size: 14 },
  { x: 92, y: 74, size: 16 },
] as const;

const popMs = 350;

// Rendered on the server and before hydration, so it must not be random.
const initialState: ShapeState = {
  kind: "circle",
  dx: 0,
  dy: 0,
  rotate: 0,
  scale: 0,
  fill: INK,
  fillOpacity: 0,
  stroke: INK,
  strokeWidth: 0,
  dash: "12 0",
};

interface Shape {
  state: ShapeState;
  popping: boolean;
}

interface Motion {
  bobDuration: string;
  bobDelay: string;
  depth: string;
}

export default function AboutShapes({ className }: { className?: string }) {
  const [shapes, setShapes] = useState<Shape[]>(() =>
    slots.map(() => ({ state: initialState, popping: false })),
  );
  const [motions, setMotions] = useState<Motion[] | null>(null);

  useEffect(() => {
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };

    let current = slots.map(() => ({ state: initialState, popping: false }));
    const update = (i: number, shape: Shape) => {
      current = current.map((s, j) => (j === i ? shape : s));
      setShapes(current);
    };

    const morph = (i: number) => {
      const prev = current[i];
      if (prev.popping) return;

      const next = randomShapeState(prev.state);
      if (next.kind === prev.state.kind) {
        update(i, { state: next, popping: false });
        return;
      }

      update(i, { state: prev.state, popping: true });
      later(() => update(i, { state: next, popping: false }), popMs);
    };

    setMotions(
      slots.map(() => ({
        bobDuration: `${between(2.5, 5).toFixed(2)}s`,
        bobDelay: `${between(-5, 0).toFixed(2)}s`,
        depth: `${((Math.random() < 0.5 ? -1 : 1) * between(10, 30)).toFixed(1)}px`,
      })),
    );

    slots.forEach((_, i) => {
      later(
        () => update(i, { state: randomShapeState(), popping: false }),
        150 + i * 90,
      );
    });

    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const shuffle = () => {
      if (!reduceMotion.matches && !document.hidden) {
        morph(Math.floor(Math.random() * slots.length));
      }
      later(shuffle, between(1200, 2600));
    };
    later(shuffle, 150 + slots.length * 90 + 1500);

    return () => timers.forEach((id) => clearTimeout(id));
  }, []);

  return (
    <div
      className={cn(["pointer-events-none select-none", className])}
      aria-hidden="true"
    >
      {shapes.map(({ state, popping }, i) => {
        const slot = slots[i];
        const motion = motions?.[i];

        return (
          <div
            key={i}
            className={cn([styles.aboutShape, popping && styles.isPopping])}
            style={
              {
                left: `${slot.x}%`,
                top: `${slot.y}%`,
                width: `${slot.size}%`,
                transform: shapeTransform(
                  popping ? { ...state, scale: 0 } : state,
                ),
                "--morph-duration": popping ? `${popMs}ms` : undefined,
                "--bob-duration": motion?.bobDuration,
                "--bob-delay": motion?.bobDelay,
                "--depth": motion?.depth,
              } as CSSProperties
            }
          >
            <svg viewBox="-50 -50 100 100">
              <path
                d={SHAPE_PATHS[state.kind]}
                style={{
                  fill: state.fill,
                  fillOpacity: state.fillOpacity,
                  stroke: state.stroke,
                  strokeWidth: state.strokeWidth,
                  strokeDasharray: state.dash,
                }}
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
