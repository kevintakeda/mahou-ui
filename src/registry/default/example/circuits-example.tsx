"use client";

import { Application } from "@pixi/react";
import { Circuits } from "../ui/circuits";

export default function StreamExample() {
  return (
    <div>
      <div className="relative h-[500px] w-[400px] rounded-lg p-8">
        <div className="mask-radial-from-40% mask-radial-to-80% absolute inset-0">
          <Application
            antialias
            autoDensity
            autoStart
            sharedTicker
            preference="webgpu"
            backgroundAlpha={0}
            width={400}
            height={500}
          >
            <Circuits
              trailWidth={400}
              trailHeight={400}
              width={400}
              height={500}
              steps={16}
              speed={400}
              numPaths={16}
            />
          </Application>
        </div>
      </div>
    </div>
  );
}
