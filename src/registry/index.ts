import type { Registry } from "shadcn/schema";

import { examples } from "../registry/examples.ts";
import { ui } from "../registry/ui.ts";

export const registry = {
  name: "mahou-ui",
  homepage: "https://mahou-ui.kevintakeda.com",
  items: [...ui, ...examples],
} satisfies Registry;
