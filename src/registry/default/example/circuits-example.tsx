"use client";

import { Application } from "@pixi/react";
import { useEffect, useRef, useState } from "react";
import { Circuits } from "../ui/circuits";

export default function StreamExample() {
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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
    <div ref={ref} className={"h-[600px] w-full"}>
      <Application
        antialias
        autoDensity
        autoStart
        sharedTicker
        resizeTo={ref}
        preference="webgpu"
        backgroundAlpha={0}
        width={dimensions.width}
        height={dimensions.height}
      >
        <Circuits />
      </Application>
    </div>
  );
}
