"use client";
import { Application } from "@pixi/react";
import { useTheme } from "next-themes";
import { useRef } from "react";
import { GridParticles } from "@/registry/default/ui/grid-particles";

export default function GridParticlesExample() {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  return (
    <div ref={ref} className={"h-[600px] w-full"}>
      <Application
        autoStart
        sharedTicker
        resizeTo={ref}
        preference="webgpu"
        backgroundAlpha={0}
        onInit={(app) => {
          app.canvas.style.pointerEvents = "auto";
          app.canvas.style.touchAction = "auto";
        }}
      >
        <GridParticles
          mode="random"
          color={theme === "dark" ? 0xd2ff65 : 0x5d7522}
        />
      </Application>
    </div>
  );
}
