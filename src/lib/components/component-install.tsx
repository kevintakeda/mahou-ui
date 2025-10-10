"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ComponentInstall({ name }: { name: string }) {
  const [value, setValue] = useLocalStorage("packageManager", "pnpm");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeValue = mounted ? value : "pnpm";

  return (
    <Tabs
      className="rounded-lg border border-neutral-800 bg-neutral-900 p-2"
      defaultValue={activeValue}
      onValueChange={setValue}
    >
      <TabsList className="TabsList">
        <TabsTrigger value="pnpm">pnpm</TabsTrigger>
        <TabsTrigger value="npm">npm</TabsTrigger>
        <TabsTrigger value="yarn">yarn</TabsTrigger>
        <TabsTrigger value="bun">bun</TabsTrigger>
      </TabsList>
      <TabsContent value="pnpm">
        <DynamicCodeBlock
          lang="sh"
          code={`pnpm dlx shadcn@latest add https://mahou-ui.kevintakeda.com/r/${name}.json`}
        />
      </TabsContent>
      <TabsContent value="npm">
        <DynamicCodeBlock
          lang="sh"
          code={`npx shadcn@latest add https://mahou-ui.kevintakeda.com/r/${name}.json`}
        />
      </TabsContent>
      <TabsContent value="yarn">
        <DynamicCodeBlock
          lang="sh"
          code={`yarn shadcn@latest add https://mahou-ui.kevintakeda.com/r/${name}.json`}
        />
      </TabsContent>
      <TabsContent value="bun">
        <DynamicCodeBlock
          lang="sh"
          code={`bunx --bun shadcn@latest add https://mahou-ui.kevintakeda.com/r/${name}.json`}
        />
      </TabsContent>
    </Tabs>
  );
}
