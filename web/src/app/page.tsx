import { ArrowRight, Github, Heart } from "@nsmr/pixelart-react";
import DropAreaWithPreview from "~/components/drop-area-with preview";

export default function HomePage() {
	return (
		<main className="relative min-h-screen overflow-hidden bg-background">
			{/* Animated pixel art background elements */}
			<div className="pointer-events-none absolute inset-0">
				<div
					className="absolute top-10 left-10 h-2 w-2 animate-float bg-accent/20"
					style={{ animationDelay: "0s" }}
				/>
				<div
					className="absolute top-20 right-20 h-1 w-1 animate-float bg-accent/30"
					style={{ animationDelay: "1s" }}
				/>
				<div
					className="absolute bottom-32 left-16 h-1 w-1 animate-float bg-accent/25"
					style={{ animationDelay: "2s" }}
				/>
				<div
					className="absolute right-32 bottom-20 h-2 w-2 animate-float bg-accent/20"
					style={{ animationDelay: "0.5s" }}
				/>
			</div>

			{/* Main content container */}
			<div className="relative z-10 flex min-h-screen flex-col">
				{/* Header */}
				<header className="border-accent/30 border-b-2 p-4">
					<div className="mx-auto flex max-w-4xl items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="relative h-6 w-6 border border-accent-foreground bg-accent">
								<div className="absolute inset-1 bg-background" />
								<div className="absolute inset-2 bg-accent" />
							</div>
							<h1 className="font-bold text-accent text-sm">VECTORIZE</h1>
						</div>
						<a
							href="https://github.com/und3f/vectorize-pixelart"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1 text-muted-foreground text-xs transition-colors hover:text-accent"
						>
							<Github size={12} />
							<span className="hidden sm:inline">SOURCE</span>
						</a>
					</div>
				</header>

				{/* Main content */}
				<div className="flex flex-1 flex-col items-center justify-center p-4">
					<div className="mx-auto w-full max-w-md space-y-6">
						{/* Title section with pixel art styling */}
						<div className="mb-8 space-y-2 text-center">
							<div className="relative inline-block">
								<h1 className="relative font-bold text-accent text-xl tracking-wider">
									PIXEL → VECTOR
									<div className="-inset-1 -z-10 absolute border border-accent/30 bg-accent/10" />
								</h1>
							</div>
							<p className="mx-auto max-w-xs text-muted-foreground text-xs leading-relaxed">
								Convert PNG pixel art to clean SVG/EPS vectors
							</p>
						</div>

						{/* Main drop area */}
						<DropAreaWithPreview />

						{/* Footer info */}
						<div className="space-y-2 pt-4 text-center">
							<div className="flex items-center justify-center gap-1 text-muted-foreground text-xs">
								<Heart size={10} className="text-accent/60" />
								<span>100% local processing</span>
								<Heart size={10} className="text-accent/60" />
							</div>
							<p className="text-muted-foreground/70 text-xs">
								No uploads • No tracking • No data collection
							</p>
						</div>
					</div>
				</div>

				{/* Bottom decorative border */}
				<div className="h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
			</div>
		</main>
	);
}
