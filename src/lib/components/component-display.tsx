import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComponentPreview } from "./component-preview";
import { ComponentSource } from "./component-source";

export default function MainTabs({ name }: { name: string }) {
  return (
    <Tabs defaultValue="preview" className="w-full">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <ComponentPreview name={name} />
      </TabsContent>
      <TabsContent value="code">
        <ComponentSource name={name} />
      </TabsContent>
    </Tabs>
  );
}
