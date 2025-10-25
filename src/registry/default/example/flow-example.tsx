"use client";
import { useTheme } from "next-themes";
import { useRef } from "react";
import Flow from "../ui/flow";

export default function FlowExample() {
  const ref = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);
  const ref4 = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const baseColor = theme === "dark" ? "#444" : "#ccc";
  const flowColor = theme === "dark" ? "#9bc612" : "#b6e343";

  return (
    <div
      ref={ref}
      className={"relative mx-auto my-8 w-full place-items-center"}
    >
      <div>
        <div
          className="relative z-0 mb-[200px] h-16 w-16 border bg-neutral-800 sm:h-32 sm:w-32 dark:bg-neutral-200"
          ref={ref1}
        ></div>
        <div className="flex gap-8">
          <div
            className="relative z-0 h-16 w-16 border bg-lime-400 sm:h-32 sm:w-32 dark:bg-lime-200"
            ref={ref2}
          ></div>
          <div
            className="relative z-0 h-16 w-16 border bg-lime-400 sm:h-32 sm:w-32 dark:bg-lime-200"
            ref={ref3}
          ></div>
          <div
            className="relative z-0 h-16 w-16 border bg-lime-400 sm:h-32 sm:w-32 dark:bg-lime-200"
            ref={ref4}
          ></div>
          <Flow
            fromRef={ref1}
            toRef={ref2}
            flowColor={flowColor}
            baseColor={baseColor}
            style="sharp"
            glow={4}
          />
          <Flow
            fromRef={ref1}
            toRef={ref3}
            flowColor={flowColor}
            baseColor={baseColor}
            style="sharp"
            glow={4}
          />
          <Flow
            fromRef={ref1}
            toRef={ref4}
            flowColor={flowColor}
            baseColor={baseColor}
            style="sharp"
            glow={4}
          />
        </div>
      </div>
    </div>
  );
}
