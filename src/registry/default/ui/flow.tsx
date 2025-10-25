/** biome-ignore-all lint/a11y/noSvgWithoutTitle: svg used for decoration */
"use client";

import { motion } from "motion/react";
import { type RefObject, useEffect, useId, useRef, useState } from "react";
import useMeasure from "react-use-measure";

export interface FlowProps {
  className?: string;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  borderRadius?: number;
  spacing?: number;
  glow?: number;
  baseColor?: string;
  flowColor: string;
  style?: "smooth" | "sharp";
}

export default function Flow({
  fromRef,
  toRef,
  borderRadius = 48,
  spacing: propSpacing,
  glow = 0,
  baseColor,
  flowColor,
  style = "sharp",
}: FlowProps) {
  const [data, setData] = useState<{
    path: string;
    width: number;
    height: number;
  } | null>(null);
  const [svgRef, svgBounds] = useMeasure();
  const pathRef = useRef<SVGPathElement>(null);
  const effectiveSpacing = propSpacing ?? 200;
  const filterId = useId();
  const margin = glow * 6;

  useEffect(() => {
    const fromEl = fromRef.current;
    const toEl = toRef.current;
    if (!fromEl || !toEl || svgBounds.width === 0 || svgBounds.height === 0)
      return;
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    const startX = fromRect.left - svgBounds.left + fromRect.width / 2;
    const startY = fromRect.bottom - svgBounds.top;
    const endX = toRect.left - svgBounds.left + toRect.width / 2;
    const endY = toRect.top - svgBounds.top;
    const path =
      style === "smooth"
        ? generateSimpleSmoothStepPath(startX, startY, endX, endY, borderRadius)
        : generateSimpleCutOutStepPath(
            startX,
            startY,
            endX,
            endY,
            borderRadius,
          );
    setData({
      path,
      width: svgBounds.width,
      height: svgBounds.height,
    });
  }, [
    fromRef,
    toRef,
    borderRadius,
    svgBounds.left,
    svgBounds.top,
    svgBounds.width,
    svgBounds.height,
    style,
  ]);

  if (!data) {
    return (
      <svg
        ref={svgRef}
        className="pointer-events-none absolute inset-0 z-0 overflow-visible"
        width="100%"
        height="100%"
        viewBox="0 0 1 1"
        fill="none"
      />
    );
  }

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-visible"
      width="100%"
      height="100%"
      viewBox={`0 0 ${data.width} ${data.height}`}
      fill="none"
    >
      {glow && (
        <defs>
          <filter
            id={filterId}
            filterUnits="userSpaceOnUse"
            x={-margin}
            y={-margin}
            width={data.width + 2 * margin}
            height={data.height + 2 * margin}
          >
            <feGaussianBlur stdDeviation={glow} result="blur1" />
            <feGaussianBlur stdDeviation={glow * 2} result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}
      {baseColor && (
        <path
          ref={pathRef}
          d={data.path}
          stroke={baseColor}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      <motion.path
        d={data.path}
        stroke={flowColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={`${effectiveSpacing} ${effectiveSpacing}`}
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -effectiveSpacing * 2 }}
        transition={{
          duration: 2,
          ease: "linear",
          repeat: Infinity,
        }}
        filter={glow ? `url(#${filterId})` : undefined}
      />
    </svg>
  );
}

function generateSimpleSmoothStepPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  borderRadius = 0,
) {
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const signX = Math.sign(dx);

  if (dy <= 0 || signX === 0) {
    return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  }

  const centerY = (sourceY + targetY) / 2;
  const r = Math.min(borderRadius, Math.abs(dx) / 2, dy / 2);

  if (dy < 2 * r) {
    return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  }

  let path = `M ${sourceX} ${sourceY}`;
  path += ` L ${sourceX} ${centerY - r}`;
  path += ` Q ${sourceX} ${centerY} ${sourceX + signX * r} ${centerY}`;
  path += ` L ${targetX - signX * r} ${centerY}`;
  path += ` Q ${targetX} ${centerY} ${targetX} ${centerY + r}`;
  path += ` L ${targetX} ${targetY}`;
  return path;
}

function generateSimpleCutOutStepPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  borderRadius = 0,
) {
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const signX = Math.sign(dx);

  if (dy <= 0 || signX === 0) {
    return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  }

  const centerY = (sourceY + targetY) / 2;
  const r = Math.min(borderRadius, Math.abs(dx) / 2, dy / 2);

  if (dy < 2 * r) {
    return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  }

  let path = `M ${sourceX} ${sourceY}`;
  path += ` L ${sourceX} ${centerY - r}`;
  path += ` L ${sourceX + signX * r} ${centerY}`;
  path += ` L ${targetX - signX * r} ${centerY}`;
  path += ` L ${targetX} ${centerY + r}`;
  path += ` L ${targetX} ${targetY}`;
  return path;
}
