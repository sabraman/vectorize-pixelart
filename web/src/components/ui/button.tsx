import { type VariantProps, cva } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
	"image-rendering-pixelated inline-flex items-center justify-center gap-1 whitespace-nowrap border-0 font-bold uppercase tracking-wide outline-none transition-all duration-150 focus-visible:ring-1 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-3 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"hover:-translate-y-0.5 border border-accent-foreground/20 bg-accent text-accent-foreground shadow-sm hover:bg-accent/90 active:translate-y-0",
				destructive:
					"hover:-translate-y-0.5 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:translate-y-0",
				outline:
					"hover:-translate-y-0.5 border border-accent/60 bg-background text-accent hover:bg-accent/10 hover:text-accent-foreground active:translate-y-0",
				secondary:
					"hover:-translate-y-0.5 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:translate-y-0",
				ghost:
					"hover:-translate-y-0.5 hover:bg-accent/10 hover:text-accent-foreground active:translate-y-0",
				link: "hover:-translate-y-0.5 text-accent underline-offset-2 hover:underline active:translate-y-0",
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
	},
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot.Root : "button";

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
