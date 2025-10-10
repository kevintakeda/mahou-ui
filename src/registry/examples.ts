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
];
