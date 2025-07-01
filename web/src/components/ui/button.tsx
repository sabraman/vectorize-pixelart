import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "~/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap font-bold transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3 [&_svg]:shrink-0 outline-none focus-visible:ring-1 focus-visible:ring-accent image-rendering-pixelated border-0 uppercase tracking-wide",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-accent-foreground border border-accent-foreground/20 hover:bg-accent/90 hover:-translate-y-0.5 active:translate-y-0 shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:-translate-y-0.5 active:translate-y-0 shadow-sm",
        outline:
          "border border-accent/60 bg-background hover:bg-accent/10 hover:text-accent-foreground hover:-translate-y-0.5 active:translate-y-0 text-accent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:-translate-y-0.5 active:translate-y-0 shadow-sm",
        ghost: 
          "hover:bg-accent/10 hover:text-accent-foreground hover:-translate-y-0.5 active:translate-y-0",
        link: 
          "text-accent underline-offset-2 hover:underline hover:-translate-y-0.5 active:translate-y-0",
      },
      size: {
        default: "h-7 px-3 py-1 text-xs",
        sm: "h-6 px-2 py-0.5 text-xs",
        lg: "h-8 px-4 py-1.5 text-sm",
        icon: "h-7 w-7 p-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
