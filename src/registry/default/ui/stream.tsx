"use client";
import { useEffect, useMemo, useRef } from "react";

export function Stream({
  radius = 16,
  points,
  animationDuration = 3,
  className,
  width = 600,
  height = 600,
}: {
  stroke?: string;
  radius?: number;
  points: Array<[number, number]>;
  animationDuration?: number;
  direction?: number;
  gradientColors?: [string, string];
  className?: string;
  height?: number;
  width?: number;
}) {
  const d = useMemo(() => getRoundedPath(points, radius), [points, radius]);
  const svg = useMemo(
    () =>
      `url("data:image/svg+xml,${encodeURIComponent(
        `<svg viewBox='0 0 ${width} ${height}' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio="none"><path d='${d}' fill='none' stroke='#ffffff' stroke-width='${1}px' shape-rendering='optimizeQuality' /></svg>`,
      )}")`,
    [d, width, height],
  );
  const animationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = animationRef.current;
    if (!element) return;
    const animation = element.animate(
      [{ transform: "translateY(-100%)" }, { transform: "translateY(100%)" }],
      {
        duration: animationDuration * 1000,
        iterations: Infinity,
        easing: "linear",
      },
    );
    return () => {
      animation.cancel();
    };
  }, [animationDuration]);

  return (
    <div
      style={{
        maskImage: svg,
      }}
      className={className}
    >
      <div
        ref={animationRef}
        className="h-full w-full"
        style={{
          background: `linear-gradient(to bottom, transparent, white, transparent)`,
        }}
      />
    </div>
  );
}

function getRoundedPath(points: Array<[number, number]>, radius: number) {
  if (points.length < 3) {
    return (
      `M${points[0][0]},${points[0][1]}` +
      points
        .slice(1)
        .map((p) => `L${p[0]},${p[1]}`)
        .join("")
    );
  }
  let d = `M${points[0][0]},${points[0][1]}`;

  for (let i = 1; i < points.length - 1; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const v1 = [p0[0] - p1[0], p0[1] - p1[1]];
    const v2 = [p2[0] - p1[0], p2[1] - p1[1]];
    const len1 = Math.sqrt(v1[0] ** 2 + v1[1] ** 2);
    const len2 = Math.sqrt(v2[0] ** 2 + v2[1] ** 2);

    const dot = v1[0] * v2[0] + v1[1] * v2[1];
    const angle = Math.acos(Math.max(-1, Math.min(1, dot / (len1 * len2))));

    let tan = radius / Math.tan(angle / 2);
    tan = Math.min(tan, len1 / 2, len2 / 2);

    const r = tan * Math.tan(angle / 2);
    const t1 = [p1[0] + (tan * v1[0]) / len1, p1[1] + (tan * v1[1]) / len1];
    const t2 = [p1[0] + (tan * v2[0]) / len2, p1[1] + (tan * v2[1]) / len2];

    const sweepFlag = v1[0] * v2[1] - v1[1] * v2[0] > 0 ? 0 : 1;

    d += `L${t1[0].toFixed(3)},${t1[1].toFixed(3)}`;
    d += `A${r.toFixed(3)},${r.toFixed(3)},0,0,${sweepFlag},${t2[0].toFixed(3)},${t2[1].toFixed(3)}`;
  }

  const last = points[points.length - 1];
  d += `L${last[0]},${last[1]}`;

  return d;
}
