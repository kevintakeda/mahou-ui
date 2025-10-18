"use client";

import { Application } from "@pixi/react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { GridParticles } from "@/registry/default/ui/grid-particles";

export function HomeParticles({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { theme } = useTheme();

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
        onInit={(app) => {
          app.canvas.style.pointerEvents = "auto";
          app.canvas.style.touchAction = "auto";
        }}
      >
        <GridParticles
          color={theme === "dark" ? 0xd2ff65 : 0x5d7522}
          cellSize={16}
          size={2}
          fitToContainer={true}
          frequency={6}
          maxAlpha={1}
        />
      </Application>
    </div>
  );
}
