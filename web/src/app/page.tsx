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
				{/* Main content */}
				<div className="flex flex-1 flex-col items-center justify-center p-4">
					<div className="mx-auto w-full max-w-md space-y-6">
						{/* Title section with pixel art styling */}
						<div className="mb-4 space-y-4 text-center">
							<div className="relative font-bold text-accent text-xl tracking-wider flex w-full justify-between px-4">
								<span className="text-accent">PIXEL</span>
								<span className="mx-2 flex items-center" aria-hidden="true">
									<svg
										width="96"
										height="16"
										viewBox="0 0 96 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										style={{ imageRendering: "pixelated" }}
										className="text-accent"
									>
										{/* Arrow shaft (bolder) */}
										<rect x="0" y="5" width="72" height="6" fill="currentColor" />
										{/* Arrow head (bolder, blocky) */}
										<rect x="72" y="2" width="6" height="12" fill="currentColor" />
										<rect x="78" y="4" width="6" height="8" fill="currentColor" />
										<rect x="84" y="6" width="6" height="4" fill="currentColor" />
										<rect x="90" y="7" width="6" height="2" fill="currentColor" />
									</svg>
								</span>
								<span className="text-accent">VECTOR</span>
								<div className="-inset-1 -z-10 absolute border border-accent/30 bg-accent/10" />
							</div>
							<p className="mx-auto w-full text-muted-foreground text-md leading-relaxed">
								Convert PNG pixel art to clean SVG/PDF vectors
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

				{/* Bottom footer with GitHub link */}
				<footer className="border-accent/30 border-t p-4">
					<div className="mx-auto flex max-w-md items-center justify-center text-xs">
						<a
							href="https://github.com/sabraman/vectorize-pixelart"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-accent"
						>
							<Github size={10} />
							<span>SOURCE</span>
						</a>
					</div>
				</footer>
			</div>
		</main>
	);
}
