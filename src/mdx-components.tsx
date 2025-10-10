import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import ComponentDisplay from "./lib/components/component-display";
import { ComponentInstall } from "./lib/components/component-install";
import { ComponentPreview } from "./lib/components/component-preview";
import { ComponentSource } from "./lib/components/component-source";

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ComponentPreview,
    ComponentSource,
    ComponentDisplay,
    ComponentInstall,

    Step,
    Steps,
    Tab,
    Tabs,
    ...components,
  };
}
