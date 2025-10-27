import type { Registry } from "shadcn/schema";

export const ui: Registry["items"] = [
  {
    name: "text-reveal",
    type: "registry:ui",
    files: [
      {
        path: "src/registry/default/ui/text-reveal.tsx",
        type: "registry:ui",
      },
    ],
    css: {
      "@keyframes activate": {
        "0%": {
          opacity: "var(--base, 0.1)",
          color: "inherit",
        },
        "50%": {
          color: "var(--color-accent)",
          opacity: "1",
        },
        "100%": {
          color: "inherit",
          opacity: "1",
        },
      },
      "@layer components": {
        "@supports (animation-timeline: scroll())": {
          ".text-reveal > .char": {
            animation: "activate both linear 1ms",
            "animation-timeline": "scroll(block nearest)",
            "animation-range":
              "entry calc(var(--start) * ((var(--idx) + 1) / (var(--_chars) + 1))) entry calc(var(--start) * ((var(--idx) * var(--offset-multiplier) + var(--offset)) / (var(--_chars) + 1)))",
            opacity: "var(--base)",
          },
          "@supports not (animation-timeline: scroll())": {
            ".text-reveal > .char": {
              opacity: "1",
              color: "inherit",
            },
          },
        },
      },
    },
  },
  {
    name: "grid-particles",
    type: "registry:ui",
    dependencies: ["pixi.js", "@pixi/react", "simplex-noise"],
    files: [
      {
        path: "src/registry/default/ui/grid-particles.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "flow",
    type: "registry:ui",
    dependencies: ["motion", "react-use-measure"],
    files: [
      {
        path: "src/registry/default/ui/flow.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "cutout",
    type: "registry:ui",
    files: [
      {
        path: "src/registry/default/ui/cutout.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "cyber-button",
    type: "registry:ui",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["cutout"],
    files: [
      {
        path: "src/registry/default/ui/cyber-button.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "decrypted-text",
    type: "registry:ui",
    dependencies: ["tempus"],
    files: [
      {
        path: "src/registry/default/ui/decrypted-text.tsx",
        type: "registry:ui",
      },
    ],
  },
];
