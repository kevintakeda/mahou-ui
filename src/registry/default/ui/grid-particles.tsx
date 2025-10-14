"use client";

import { useApplication, useExtend, useTick } from "@pixi/react";
import {
  Container,
  Graphics,
  Sprite,
  type Texture,
  type TickerCallback,
} from "pixi.js";
import { useCallback, useMemo, useRef, useState } from "react";
import { createNoise2D } from "simplex-noise";

export interface RectDefinition {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PolygonDefinition {
  type: "polygon";
  points: Array<{ x: number; y: number }>;
}

export type ShapeDefinition = RectDefinition | PolygonDefinition;

export interface GridParticlesProps {
  cellSize?: number;
  minAlpha?: number;
  maxAlpha?: number;
  color?: number;
  minSpeed?: number;
  maxSpeed?: number;
  size?: number;
  frequency?: number;
  threshold?: number;
  masks?: ShapeDefinition[];
  fitToContainer?: boolean;
  mode?:
    | "random"
    | "top-to-bottom"
    | "bottom-to-top"
    | "left-to-right"
    | "right-to-left"
    | "center-outward";
}

function pointInRect(
  x: number,
  y: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number,
): boolean {
  return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
}

function pointInPolygon(
  x: number,
  y: number,
  polygon: Array<{ x: number; y: number }>,
): boolean {
  const n = polygon.length;
  let isInside = false;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) isInside = !isInside;
  }

  return isInside;
}

function isPointInShapes(
  point: { x: number; y: number },
  shapes: ShapeDefinition[],
): boolean {
  if (!shapes || shapes.length === 0) return true;

  return shapes.some((shape) => {
    if (shape.type === "rect") {
      return pointInRect(
        point.x,
        point.y,
        shape.x,
        shape.y,
        shape.width,
        shape.height,
      );
    } else if (shape.type === "polygon") {
      return pointInPolygon(point.x, point.y, shape.points);
    }
    return false;
  });
}

export function GridParticles({
  cellSize = 24,
  minAlpha = 0,
  maxAlpha = 1,
  color = 0xd2ff65,
  minSpeed = 0.001,
  maxSpeed = 0.002,
  size = 2,
  frequency = 3,
  threshold = 0.4,
  masks = [],
  fitToContainer = true,
  mode = "random",
}: GridParticlesProps) {
  useExtend({ Container, Sprite, Graphics });
  const { app, isInitialised } = useApplication();
  const [time, setTime] = useState(0);
  const containerRef = useRef<Container>(null);
  const prevTextureRef = useRef<Texture>(null);

  const dotTexture = useMemo(() => {
    if (!isInitialised) return null;
    const g = new Graphics();
    g.rect(0, 0, size, size).fill({ color });
    if (prevTextureRef.current != null) {
      prevTextureRef.current.destroy();
    }
    const texture = app.renderer.generateTexture(g);
    prevTextureRef.current = texture;
    return texture;
  }, [isInitialised, color, size, app]);

  const noise2D = useMemo(() => createNoise2D(Math.random), []);

  const points = useMemo(() => {
    if (!isInitialised) return [];

    const effectiveW = app.renderer.width;
    const effectiveH = app.renderer.height;

    if (!effectiveW || !effectiveH) return [];

    const cols = Math.ceil(effectiveW / cellSize);
    const rows = Math.ceil(effectiveH / cellSize);
    let hSpacing = cellSize;
    let vSpacing = cellSize;
    const offsetX = size / 2;
    const offsetY = size / 2;

    if (fitToContainer) {
      hSpacing = (effectiveW - size) / cols;
      vSpacing = (effectiveH - size) / rows;
    }

    const arr = [];
    const phaseOffset = Math.PI * 2;
    const baseSpeed = minSpeed + (maxSpeed - minSpeed) / 2;

    for (let c = 0; c <= cols; c++) {
      for (let r = 0; r <= rows; r++) {
        const nx = c / cols;
        const ny = r / rows;
        const noiseVal = noise2D(nx * frequency, ny * frequency);
        if (noiseVal < threshold) continue;

        const point = {
          x: c * hSpacing + offsetX,
          y: r * vSpacing + offsetY,
          id: `${c}-${r}`,
        };

        const speed =
          mode === "random"
            ? minSpeed + (maxSpeed - minSpeed) * Math.random()
            : baseSpeed;

        let phase: number;
        let normalized = 0;
        if (mode === "random") {
          phase = Math.random() * Math.PI * 2;
        } else if (mode === "top-to-bottom") {
          normalized = point.y / effectiveH;
          phase = (1 - normalized) * phaseOffset;
        } else if (mode === "bottom-to-top") {
          normalized = point.y / effectiveH;
          phase = normalized * phaseOffset;
        } else if (mode === "left-to-right") {
          normalized = point.x / effectiveW;
          phase = (1 - normalized) * phaseOffset;
        } else if (mode === "right-to-left") {
          normalized = point.x / effectiveW;
          phase = normalized * phaseOffset;
        } else if (mode === "center-outward") {
          const cx = effectiveW / 2;
          const cy = effectiveH / 2;
          const dist = Math.sqrt((point.x - cx) ** 2 + (point.y - cy) ** 2);
          const maxDist = Math.sqrt(cx ** 2 + cy ** 2);
          normalized = dist / maxDist;
          phase = (1 - normalized) * phaseOffset;
        } else {
          phase = Math.random() * Math.PI * 2;
        }
        if (isPointInShapes(point, masks)) {
          arr.push({ ...point, phase, speed });
        }
      }
    }
    return arr;
  }, [
    cellSize,
    minSpeed,
    maxSpeed,
    isInitialised,
    noise2D,
    frequency,
    threshold,
    masks,
    app,
    app.renderer?.width,
    app.renderer?.height,
    size,
    fitToContainer,
    mode,
  ]);

  const animate = useCallback<TickerCallback<unknown>>(
    (delta) => setTime((t) => t + delta.elapsedMS),
    [],
  );
  useTick(animate);

  if (!isInitialised || !dotTexture) return null;

  return (
    <pixiContainer ref={containerRef}>
      {points.map((point) => {
        const alpha =
          minAlpha +
          maxAlpha * (Math.sin(time * point.speed + point.phase) * 0.5 + 0.5);
        return (
          <pixiSprite
            key={point.id}
            texture={dotTexture}
            x={point.x}
            y={point.y}
            anchor={0.5}
            tint={color}
            alpha={alpha}
          />
        );
      })}
    </pixiContainer>
  );
}
