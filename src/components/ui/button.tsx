import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "cursor-pointer active:scale-[98%] active:translate-y-0.5 duration-[200ms] active:duration-[50ms] transition-transform duration-200 ease-[cubic-bezier(0.6,0.6,0,1)] active:translate-y-[0.5px] active:duration-[50ms] focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-lg border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-3 aria-invalid:ring-3 [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none",
  {
    variants: {
      variant: {
        default:
          'gloss bg-[radial-gradient(circle_at_top_center,oklch(30.9%_0_0)_0%,oklch(27.9%_0_0)_70%)] shadow-[inset_0_0_1px_3px_rgba(255,255,255,0.04)] relative rounded-full border-transparent text-white transition-all duration-[200ms] active:duration-[20ms] focus-visible:ring-white/60',
        secondary:
          'bg-black text-secondary-foreground aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
      },
      size: {
        default:
          'h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5',
        xs: "h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        lg: 'h-12 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
        icon: 'size-9 aspect-square',
        'icon-xs': "size-6 aspect-square [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8 aspect-square',
        'icon-lg': 'size-10 aspect-square',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
