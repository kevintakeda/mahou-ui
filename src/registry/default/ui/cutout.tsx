import type { CSSProperties, ElementType } from "react";

export type CutOutProps<C extends React.ElementType> = {
  as?: C;
  edgeSize?: number;
  borderWidth?: number;
} & React.ComponentPropsWithRef<C>;

export function Cutout<C extends ElementType = "div">({
  as,
  children,
  edgeSize = 16,
  borderWidth = 4,
  className = "",
  style,
  ...restProps
}: CutOutProps<C>) {
  const Component = as || "div";

  return (
    <Component
      className={`[clip-path:polygon(var(--edge-size)_0%,100%_0,100%_calc(100%-var(--edge-size)),calc(100%-var(--edge-size))_100%,0_100%,0%_var(--edge-size))] ${className}`}
      style={
        {
          "--edge-size": `${edgeSize}px`,
          "--border-width": `${borderWidth}px`,
          ...style,
        } as CSSProperties
      }
      {...restProps}
    >
      {children}
    </Component>
  );
}
