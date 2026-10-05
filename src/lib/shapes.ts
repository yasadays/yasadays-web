export const SHAPE_PATHS = {
  circle: "M -40 0 A 40 40 0 1 0 40 0 A 40 40 0 1 0 -40 0 Z",
  square: "M -34 -34 H 34 V 34 H -34 Z",
  triangle: "M 0 -40 L 40 32 H -40 Z",
  semicircle: "M -42 14 A 42 42 0 0 1 42 14 Z",
  plus: "M -12 -40 H 12 V -12 H 40 V 12 H 12 V 40 H -12 V 12 H -40 V -12 H -12 Z",
  sparkle: "M 0 -46 Q 6 -6 46 0 Q 6 6 0 46 Q -6 6 -46 0 Q -6 -6 0 -46 Z",
  squiggle: "M -42 0 Q -31.5 -22 -21 0 T 0 0 T 21 0 T 42 0",
} as const;

export type ShapeKind = keyof typeof SHAPE_PATHS;

const shapeKinds = Object.keys(SHAPE_PATHS) as ShapeKind[];
const openShapeKinds: ReadonlySet<ShapeKind> = new Set(["squiggle"]);

export const INK = "#46283b";
export const COLORS = ["#9fe9ec", "#c04b6a", "#eba886", "#93c5fd", INK];

// [dash, gap] in viewBox units
const DASHES = [
  [12, 0],
  [12, 0],
  [10, 8],
  [0.1, 9],
];

export interface ShapeState {
  kind: ShapeKind;
  dx: number;
  dy: number;
  rotate: number;
  scale: number;
  fill: string;
  fillOpacity: number;
  stroke: string;
  strokeWidth: number;
  dash: string;
}

export const pick = <T>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)];

export const between = (min: number, max: number) =>
  min + Math.random() * (max - min);

export function randomShapeState(prev?: ShapeState): ShapeState {
  const kind = prev && Math.random() < 0.5 ? prev.kind : pick(shapeKinds);
  const filled = !openShapeKinds.has(kind) && Math.random() < 0.55;
  const fill = pick(COLORS);
  const [dash, gap] = pick(DASHES);

  return {
    kind,
    dx: between(-18, 18),
    dy: between(-18, 18),
    rotate: (prev?.rotate ?? between(-180, 180)) + between(-150, 150),
    scale: between(0.45, 1.25),
    fill,
    fillOpacity: filled ? 1 : 0,
    stroke: filled ? INK : pick(COLORS.filter((c) => c !== fill)),
    strokeWidth: between(2.5, 9),
    dash: `${dash} ${gap}`,
  };
}

export function shapeTransform(
  s: Pick<ShapeState, "dx" | "dy" | "rotate" | "scale">,
) {
  return `translate(-50%, -50%) translate(${s.dx}px, ${s.dy}px) rotate(${s.rotate}deg) scale(${s.scale})`;
}
