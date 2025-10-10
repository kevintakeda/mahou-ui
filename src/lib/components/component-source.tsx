import { promises as fs } from "fs";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import path from "path";
import type * as React from "react";
import { Index } from "@/registry/__index__";

export const ComponentSource: React.FC<{ name: string }> = async ({ name }) => {
  const file = Index[name]?.files[0];

  if (!file?.path) {
    return null;
  }

  const value = await fs.readFile(path.join(process.cwd(), file.path), "utf-8");

  return <DynamicCodeBlock lang="tsx" code={value} />;
};
