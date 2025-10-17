"use client";
import { useExtend, useTick } from "@pixi/react";
import {
  Color,
  type ColorSource,
  Container,
  FillGradient,
  Graphics,
  Sprite,
} from "pixi.js";
import { BloomFilter } from "pixi-filters";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface ColorStop {
  offset: number;
  color: ColorSource;
}

interface CircuitsProps {
  speed?: number;
  numPaths?: number;
  stepY?: number;
  stepX?: number;
  stepJitterMax?: number;
  stepJitterMin?: number;
  steps?: number;
  width?: number;
  height?: number;
  startX?: number;
  startY?: number;
  colorStops?: ColorStop[];
  trailWidth?: number;
  trailHeight?: number;
  bloomStrength?: number;
  bloomKernelSize?: number;
  bloomQuality?: number;
}

const defaultColorStops: ColorStop[] = [
  { offset: 0, color: new Color(0xff94fe).setAlpha(0) },
  { offset: 1, color: new Color(0xd2ff65) },
];

export function Circuits({
  speed = 500,
  numPaths = 16,
  stepY = 16,
  stepX = 16,
  stepJitterMax = 128,
  stepJitterMin = 64,
  steps = 10,
  width = 512,
  height = 512,
  colorStops = defaultColorStops,
  trailWidth = 512,
  trailHeight = 256,
  bloomStrength = 8,
  bloomKernelSize = 15,
  bloomQuality = 10,
}: CircuitsProps) {
  useExtend({ Container, Sprite, Graphics });
  const [animationVersion, setAnimationVersion] = useState(0);
  const finishedCounter = useRef(0);

  const onFinish = useCallback(() => {
    finishedCounter.current++;
    if (finishedCounter.current >= numPaths) {
      finishedCounter.current = 0;
      setAnimationVersion((v) => v + 1);
    }
  }, [numPaths]);

  const gradient = useMemo(
    () =>
      new FillGradient({
        end: { x: 0, y: 1 },
        colorStops,
      }),
    [colorStops],
  );

  const filters = useMemo(
    () => [
      new BloomFilter({
        strength: bloomStrength,
        kernelSize: bloomKernelSize,
        quality: bloomQuality,
      }),
    ],
    [bloomStrength, bloomKernelSize, bloomQuality],
  );
  const circuitConfigs = useMemo(() => {
    return Array.from({ length: numPaths }).map((_, i) => {
      const centerIndex = (numPaths - 1) / 2;
      const distance = Math.abs(i - centerIndex) / numPaths / 2;

      const positionalSpeed = speed - Math.min(distance * 750, speed / 2);
      const randomJitter = Math.random() * 100;
      const finalSpeed = Math.max(100, positionalSpeed + randomJitter);
      const optimalGap = stepX + stepX;

      const totalSpan = (numPaths - 1) * optimalGap;
      const offset = (width - totalSpan) / 2;
      const x = offset + i * optimalGap;

      return {
        id: i,
        speed: finalSpeed,
        startX: x,
      };
    });
  }, [numPaths, speed, stepX, width]);

  return (
    <pixiContainer width={width} height={height} filters={filters}>
      {circuitConfigs.map((config) => (
        <SingleCircuit
          key={config.id}
          speed={config.speed}
          stepY={stepY}
          stepX={stepX}
          stepJitterMax={stepJitterMax}
          stepJitterMin={stepJitterMin}
          steps={steps}
          startX={config.startX}
          startY={0}
          trailWidth={trailWidth}
          trailHeight={trailHeight}
          height={height}
          gradient={gradient}
          onFinish={onFinish}
          animationVersion={animationVersion}
        />
      ))}
    </pixiContainer>
  );
}

function SingleCircuit({
  speed,
  stepY,
  stepX,
  stepJitterMax,
  stepJitterMin,
  steps,
  startX,
  startY,
  trailWidth,
  trailHeight,
  height,
  gradient,
  onFinish,
  animationVersion,
}: {
  speed: number;
  stepY: number;
  stepX: number;
  stepJitterMax: number;
  stepJitterMin: number;
  steps: number;
  startX: number;
  startY: number;
  trailWidth: number;
  trailHeight: number;
  height?: number;
  gradient: FillGradient;
  onFinish: () => void;
  animationVersion: number;
}) {
  const maskRef = useRef<Graphics>(null);
  const gradientRef = useRef<Graphics>(null);

  const drawMask = useCallback(
    (g: Graphics) => {
      g.clear();
      let x = startX,
        y = startY;

      g.moveTo(x, y);
      let dir = Math.random() > 0.5 ? 1 : -1;
      let alt = -1;

      for (let j = 0; j < steps; j++) {
        if (alt === -1) {
          alt = 1;
          y += stepY + Math.random() * stepJitterMax + stepJitterMin;
          g.lineTo(x, y);
        } else {
          alt = -1;
          dir *= -1;
          x = x + stepX * dir;
          y = y + stepY;
          g.lineTo(x, y);
        }
      }
      g.stroke({ color: 0x00ff00, width: 1, pixelLine: true });
    },
    [stepJitterMax, stepJitterMin, stepX, stepY, steps, startX, startY],
  );

  const drawGradient = useCallback(
    (g: Graphics) => {
      g.clear();
      g.rect(0, 0, trailWidth, trailHeight);
      g.fill(gradient);
    },
    [gradient, trailWidth, trailHeight],
  );

  const delayCounterRef = useRef(0);
  const onFinishCalledRef = useRef(false);
  const startYPos = -trailHeight - trailHeight * 0.5;

  useEffect(() => {
    if (maskRef.current && gradientRef.current) {
      gradientRef.current.mask = maskRef.current;
    }
  }, []);

  useEffect(() => {
    if (animationVersion > 0) {
      delayCounterRef.current = 0;
    }
    if (gradientRef.current) {
      gradientRef.current.y = startYPos;
    }
    onFinishCalledRef.current = false;
  }, [animationVersion, startYPos]);

  useTick((ticker) => {
    if (gradientRef.current) {
      if (onFinishCalledRef.current) {
        return;
      }

      const speedInMs = speed / 1000;
      gradientRef.current.y += speedInMs * ticker.deltaMS;

      const containerHeight = height ?? 256;
      const finishY = containerHeight + trailHeight / 2;

      if (gradientRef.current.y >= finishY) {
        onFinish();
        onFinishCalledRef.current = true;
      }
    }
  });

  return (
    <>
      <pixiGraphics ref={maskRef} draw={drawMask} />
      <pixiGraphics ref={gradientRef} draw={drawGradient} />
    </>
  );
}
