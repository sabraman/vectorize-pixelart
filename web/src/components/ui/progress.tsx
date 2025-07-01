"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

const progressVariants = cva(
	"image-rendering-pixelated relative h-2 w-full overflow-hidden border border-accent/30 bg-background",
	{
		variants: {
			variant: {
				default: "",
				accent: "border-accent/50",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const Progress = React.forwardRef<
	React.ElementRef<typeof ProgressPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> &
		VariantProps<typeof progressVariants>
>(({ className, value, variant, ...props }, ref) => (
	<ProgressPrimitive.Root
		ref={ref}
		data-slot="progress"
		className={cn(progressVariants({ variant }), className)}
		{...props}
	>
		<ProgressPrimitive.Indicator
			className="h-full w-full flex-1 bg-accent transition-all duration-300 ease-out"
			style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
		/>
	</ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
