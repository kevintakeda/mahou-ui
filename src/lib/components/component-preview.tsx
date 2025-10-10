import { type FC, Suspense, useMemo } from "react";
import { Index } from "@/registry/__index__";

export const ComponentPreview: FC<{ name: string }> = ({ name }) => {
  const Preview = useMemo(() => {
    const Component = Index[name]?.component;
    return <Component />;
  }, [name]);
  return (
    <div className="flex min-h-64 items-center justify-center rounded-lg border">
      <Suspense
        fallback={
          <div className="flex items-center justify-center text-muted-foreground text-sm">
            Loading...
          </div>
        }
      >
        {Preview}
      </Suspense>
    </div>
  );
};
