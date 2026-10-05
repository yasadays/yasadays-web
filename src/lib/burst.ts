import { COLORS, INK, SHAPE_PATHS, between, pick } from "./shapes";

const SVG_NS = "http://www.w3.org/2000/svg";

interface BurstOptions {
  paths?: readonly string[];
  colors?: readonly string[];
  count?: number;
  angle?: [number, number];
  distance?: [number, number];
  size?: [number, number];
}

const defaultPaths = Object.entries(SHAPE_PATHS)
  .filter(([kind]) => kind !== "squiggle")
  .map(([, path]) => path);

const defaultColors = COLORS.filter((color) => color !== INK);

/**
 * Creates a shape confetti explosion effect relative to `container`, which needs to be positioned.
 * Shapes auto destroy once they fade out.
 */
export function burst(
  container: HTMLElement,
  x: number,
  y: number,
  {
    paths = defaultPaths,
    colors = defaultColors,
    count = 8,
    angle: [fromAngle, toAngle] = [0, 360],
    distance = [70, 150],
    size = [14, 28],
  }: BurstOptions = {},
) {
  // A full circle shouldn't put the first and last shape on top of each other.
  const steps = toAngle - fromAngle >= 360 ? count : count - 1 || 1;

  for (let i = 0; i < count; i++) {
    const jitter = between(-0.3, 0.3) / steps;
    const t = Math.min(Math.max(i / steps + jitter, 0), 1);
    const radians = ((fromAngle + t * (toAngle - fromAngle)) * Math.PI) / 180;
    const reach = between(...distance);
    const dx = Math.cos(radians) * reach;
    const dy = Math.sin(radians) * reach;
    const spin = between(-270, 270);
    const px = between(...size);

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "-50 -50 100 100");
    svg.setAttribute("aria-hidden", "true");
    Object.assign(svg.style, {
      position: "absolute",
      left: `${x}px`,
      top: `${y}px`,
      width: `${px}px`,
      height: `${px}px`,
      overflow: "visible",
      pointerEvents: "none",
      zIndex: "10",
    });

    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", pick(paths));
    Object.assign(path.style, {
      fill: pick(colors),
      stroke: INK,
      strokeWidth: "7",
      strokeLinejoin: "round",
    });
    svg.append(path);
    container.append(svg);

    const at = (moved: number, scale: number) =>
      `translate(calc(-50% + ${dx * moved}px), calc(-50% + ${dy * moved}px)) rotate(${spin * moved}deg) scale(${scale})`;

    svg
      .animate(
        [
          { transform: at(0, 0.3) },
          { transform: at(0.85, 1), offset: 0.55 },
          { transform: at(1, 0), opacity: 0 },
        ],
        {
          duration: between(700, 1000),
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        },
      )
      .finished.then(() => svg.remove());
  }
}
