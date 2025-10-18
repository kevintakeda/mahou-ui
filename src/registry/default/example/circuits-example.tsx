"use client";

import { Application } from "@pixi/react";
import { Circuits } from "../ui/circuits";

export default function StreamExample() {
  return (
    <div className="relative h-[500px] w-[400px] rounded-lg bg-neutral-300 p-8 dark:bg-transparent">
      <div className="absolute inset-0">
        <Application
          antialias
          autoDensity
          autoStart
          sharedTicker
          preference="webgpu"
          backgroundAlpha={0}
          width={400}
          height={500}
          onInit={(app) => {
            app.canvas.style.pointerEvents = "auto";
            app.canvas.style.touchAction = "auto";
          }}
        >
          <Circuits
            trailWidth={400}
            trailHeight={400}
            width={400}
            height={500}
            steps={16}
            speed={800}
            numPaths={9}
          />
        </Application>
      </div>
    </div>
  );
}
