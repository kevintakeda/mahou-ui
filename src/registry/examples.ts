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
    name: "stream-example",
    type: "registry:component",
    registryDependencies: ["stream"],
    files: [
      {
        path: "src/registry/default/example/stream-example.tsx",
        type: "registry:component",
      },
    ],
  },
];
