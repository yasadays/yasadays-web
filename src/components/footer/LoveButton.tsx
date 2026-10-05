import { useCallback, useRef } from "react";
import { burst } from "../../lib/burst";
import { INK, SHAPE_PATHS } from "../../lib/shapes";

import styles from "./LoveButton.module.css";

const heartPath =
  "M 0 40 C -30 18 -46 0 -46 -18 C -46 -34 -34 -44 -21 -44 C -10 -44 -3 -37 0 -30 C 3 -37 10 -44 21 -44 C 34 -44 46 -34 46 -18 C 46 0 30 18 0 40 Z";
const heartColor = "#c04b6a";

export default function LoveButton() {
  const button = useRef<HTMLButtonElement>(null);
  const burstLayer = useRef<HTMLSpanElement>(null);

  const onClick = useCallback(() => {
    const el = button.current;
    const layer = burstLayer.current;
    if (!el || !layer || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    el.animate([{ scale: "0.7" }, { scale: "1.25" }, { scale: "1" }], {
      duration: 400,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    });

    burst(layer, el.offsetWidth / 2, el.offsetHeight / 2, {
      paths: [heartPath, heartPath, SHAPE_PATHS.sparkle],
      colors: [heartColor, "#eba886", "#9fe9ec"],
      count: 7,
      angle: [-160, -20],
      distance: [40, 100],
      size: [10, 20],
    });
  }, []);

  return (
    <span
      ref={burstLayer}
      className="relative inline-block size-[1.1em] align-[-0.15em]"
    >
      <button
        ref={button}
        type="button"
        aria-label="love"
        title="Send some love"
        className="block size-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
        onClick={onClick}
      >
        <svg
          viewBox="-50 -50 100 100"
          className={`size-full overflow-visible ${styles.heartbeat}`}
        >
          <path
            d={heartPath}
            fill={heartColor}
            stroke={INK}
            strokeWidth={8}
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </span>
  );
}
