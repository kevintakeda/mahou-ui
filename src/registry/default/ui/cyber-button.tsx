import { cva, type VariantProps } from "class-variance-authority";
import type { CSSProperties, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { Cutout } from "./cutout";

const cyberButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-lime-950 text-lime-100 dark:bg-lime-50 dark:text-lime-950",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type CyberButtonProps<C extends React.ElementType = "button"> = {
  as?: C;
  edgeSize?: number;
  borderWidth?: number;
} & VariantProps<typeof cyberButtonVariants> &
  React.ComponentPropsWithRef<C>;

export const CyberButton = ({
  children,
  edgeSize = 16,
  borderWidth = 4,
  as = "button",
  variant = "default",
  size = "default",
  className,
  ...restProps
}: PropsWithChildren<CyberButtonProps>) => {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="absolute top-0 right-0 bottom-0 block w-1/4 rounded-full bg-lime-600 opacity-50 blur-sm dark:bg-lime-200"
      ></span>
      <span
        aria-hidden
        className="absolute top-0 right-0 bottom-0 block w-1/4 rounded-full bg-lime-200 opacity-25 blur-lg dark:bg-lime-200"
      ></span>
      <Cutout
        as={as}
        {...restProps}
        className={cn(cyberButtonVariants({ variant, size }))}
        style={
          {
            "--edge-size": `${edgeSize}px`,
            "--border-width": `${borderWidth}px`,
          } as CSSProperties
        }
      >
        <span
          aria-hidden
          className="absolute top-0 right-0 bottom-0 hidden w-1/4 rounded-full opacity-50 blur dark:block dark:bg-white"
        ></span>
        <span aria-hidden className="relative">
          {children}
        </span>
      </Cutout>
    </div>
  );
};
