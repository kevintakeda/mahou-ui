"use client";

import { useApplication, useExtend, useTick } from "@pixi/react";
import {
  Container,
  Graphics,
  Sprite,
  type Texture,
  type TickerCallback,
} from "pixi.js";
import { useCallback, useMemo, useRef } from "react";
import { createNoise2D } from "simplex-noise";

export interface EllipseMask {
  radiusX: number;
  radiusY: number;
  invert?: boolean;
}

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
  fitToContainer?: boolean;
  mode?:
    | "random"
    | "top-to-bottom"
    | "bottom-to-top"
    | "left-to-right"
    | "right-to-left"
    | "center-outward";
  randomFn?: () => number;
  ellipseMask?: EllipseMask;
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
  fitToContainer = true,
  mode = "random",
  randomFn = Math.random,
  ellipseMask,
}: GridParticlesProps) {
  useExtend({ Container, Sprite, Graphics });
  const { app, isInitialised } = useApplication();
  const timeRef = useRef(0);
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

  const noise2D = useMemo(() => createNoise2D(randomFn), [randomFn]);

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
    const halfW = effectiveW / 2;
    const halfH = effectiveH / 2;

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

        if (ellipseMask) {
          const translatedPoint = {
            x: point.x - halfW,
            y: point.y - halfH,
          };
          const isInside =
            (translatedPoint.x / ellipseMask.radiusX) ** 2 +
              (translatedPoint.y / ellipseMask.radiusY) ** 2 <=
            1;

          if (isInside === ellipseMask.invert) {
            continue;
          }
        }

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

        arr.push({ ...point, phase, speed, ref: null as Sprite | null });
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
    app,
    app.renderer?.width,
    app.renderer?.height,
    size,
    fitToContainer,
    mode,
    ellipseMask,
  ]);

  const animate = useCallback<TickerCallback<unknown>>(
    (ticker) => {
      timeRef.current += ticker.deltaMS;
      const time = timeRef.current;

      points.forEach((point) => {
        if (point.ref) {
          const alpha =
            minAlpha +
            maxAlpha * (Math.sin(time * point.speed + point.phase) * 0.5 + 0.5);
          point.ref.alpha = alpha;
        }
      });
    },
    [points, minAlpha, maxAlpha],
  );

  useTick(animate);

  if (!isInitialised || !dotTexture) return null;

  return (
    <pixiContainer ref={containerRef}>
      {points.map((point) => {
        const initialAlpha =
          minAlpha + maxAlpha * (Math.sin(point.phase) * 0.5 + 0.5);
        return (
          <pixiSprite
            ref={(el) => {
              point.ref = el;
            }}
            key={point.id}
            texture={dotTexture}
            x={point.x}
            y={point.y}
            anchor={0.5}
            tint={color}
            alpha={initialAlpha}
          />
        );
      })}
    </pixiContainer>
  );
}
