"use client";

import { Application } from "@pixi/react";
import { useTheme } from "next-themes";
import { Color } from "pixi.js";
import { Circuits } from "../ui/circuits";

export default function StreamExample() {
  const { theme } = useTheme();
  return (
    <div className="relative grid place-items-center rounded-lg p-8 dark:bg-transparent">
      <div className="w-[280px] rounded-sm border py-10 text-center text-foreground">
        Data
      </div>
      <div className="h-[256px]">
        <Application
          antialias
          autoDensity
          autoStart
          sharedTicker
          preference="webgpu"
          backgroundAlpha={0}
          width={320}
          height={256}
          onInit={(app) => {
            app.canvas.style.pointerEvents = "auto";
            app.canvas.style.touchAction = "auto";
          }}
        >
          <Circuits
            trailWidth={320}
            trailHeight={256}
            width={320}
            height={256}
            steps={16}
            speed={500}
            numPaths={8}
            colorStops={
              theme === "dark"
                ? [
                    { offset: 0, color: new Color(0xff94fe).setAlpha(0) },
                    { offset: 1, color: new Color(0xd2ff65) },
                  ]
                : [
                    { offset: 0, color: new Color(0x963097).setAlpha(0) },
                    { offset: 1, color: new Color(0xa2d300) },
                  ]
            }
          />
        </Application>
      </div>
      <div className="w-[400px] rounded-sm border py-10 text-center">LLMs</div>
    </div>
  );
}
