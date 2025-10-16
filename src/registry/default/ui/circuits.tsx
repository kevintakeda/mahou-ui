"use client";
import { useExtend, useTick } from "@pixi/react";
import { Color, Container, FillGradient, Graphics, Sprite } from "pixi.js";
import { useCallback, useEffect, useMemo, useRef } from "react";

export function Circuits({ speed = 100 }) {
  useExtend({ Container, Sprite, Graphics });

  const maskRef = useRef<Graphics>(null);
  const gradientRef = useRef<Graphics>(null);

  const drawMask = useCallback((g: Graphics) => {
    g.clear();
    const config = {
      numPaths: 8,
      stepY: 16,
      stepX: 16,
      stepJitterMax: 128,
      stepJitterMin: 64,
      steps: 10,
    };

    const optimalGap = config.stepX + config.stepX;

    for (let i = 0; i < config.numPaths; i++) {
      let x = 200 + optimalGap * i,
        y = 50;

      g.moveTo(x, y);
      let dir = Math.random() > 0.5 ? 1 : -1;
      let alt = -1;

      for (let j = 0; j < config.steps; j++) {
        if (alt === -1) {
          alt = 1;
          y +=
            config.stepY +
            Math.random() * config.stepJitterMax +
            config.stepJitterMin;
          g.lineTo(x, y);
        } else {
          alt = -1;
          dir *= -1;
          x = x + config.stepX * dir;
          y = y + config.stepY;
          g.lineTo(x, y);
        }
      }
    }
    g.stroke({ color: 0x00ff00, width: 1, pixelLine: true });
  }, []);

  // Pre-create gradient outside of draw function
  const gradient = useMemo(
    () =>
      new FillGradient({
        end: { x: 0, y: 1 },
        colorStops: [
          { offset: 0, color: new Color(0xffffff).setAlpha(0) },
          { offset: 1, color: 0x00ff00 },
        ],
      }),
    [],
  );

  const drawGradient = useCallback(
    (g: Graphics) => {
      g.clear();
      g.rect(0, 0, 800, 300);
      g.fill(gradient);
    },
    [gradient],
  );

  // Combine mask setup and animation logic
  useEffect(() => {
    if (maskRef.current && gradientRef.current) {
      gradientRef.current.mask = maskRef.current;
    }
  }, []);

  // Use deltaTime directly without extra multiplication
  useTick((ticker) => {
    if (gradientRef.current) {
      if (gradientRef.current.y >= 600) {
        gradientRef.current.y = -300;
      } else {
        gradientRef.current.y += speed * ticker.deltaTime * 0.1;
      }
    }
  });

  return (
    <pixiContainer>
      <pixiGraphics ref={maskRef} draw={drawMask} />
      <pixiGraphics ref={gradientRef} draw={drawGradient} />
    </pixiContainer>
  );
}
