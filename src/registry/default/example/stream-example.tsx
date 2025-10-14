"use client";

import { Stream } from "../ui/stream";

export default function StreamExample() {
  return (
    <div className="h-full w-full">
      <Stream
        points={[
          [50, 0],
          [200, 200],
          [300, 250],
          [500, 600],
        ]}
        width={600}
        height={600}
        animationDuration={2}
        className="h-[600px] w-full"
      />
    </div>
  );
}
