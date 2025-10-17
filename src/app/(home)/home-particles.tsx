"use client";

import { Application } from "@pixi/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  GridParticles,
  type ShapeDefinition,
} from "@/registry/default/ui/grid-particles";

export function HomeParticles({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const masks = useMemo<Array<ShapeDefinition>>(() => [], []);

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      <Application
        autoStart
        sharedTicker
        resizeTo={ref}
        preference="webgpu"
        backgroundAlpha={0}
        width={dimensions.width}
        height={dimensions.height}
      >
        <GridParticles
          cellSize={8}
          size={1}
          fitToContainer={true}
          frequency={4}
          maxAlpha={0.7}
          masks={masks}
        />
      </Application>
    </div>
  );
}
