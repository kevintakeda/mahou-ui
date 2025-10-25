import type { Registry } from "shadcn/schema";

export const examples: Registry["items"] = [
  {
    name: "text-reveal-example",
    type: "registry:component",
    registryDependencies: ["text-reveal"],
    files: [
      {
        path: "src/registry/default/example/text-reveal-example.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "grid-particles-example",
    type: "registry:component",
    registryDependencies: ["grid-particles"],
    files: [
      {
        path: "src/registry/default/example/grid-particles-example.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "circuits-example",
    type: "registry:component",
    registryDependencies: ["circuits"],
    files: [
      {
        path: "src/registry/default/example/circuits-example.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "flow-example",
    type: "registry:ui",
    registryDependencies: ["flow"],
    files: [
      {
        path: "src/registry/default/example/flow-example.tsx",
        type: "registry:ui",
      },
    ],
  },
];
