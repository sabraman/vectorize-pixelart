import DropAreaWithPreview from "~/components/drop-area-with preview";
import { ArrowRight, Heart, Github } from "@nsmr/pixelart-react";

export default function HomePage() {
	return (
		<main className="min-h-screen bg-background relative overflow-hidden">
			{/* Animated pixel art background elements */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute top-10 left-10 w-2 h-2 bg-accent/20 animate-float" style={{ animationDelay: '0s' }} />
				<div className="absolute top-20 right-20 w-1 h-1 bg-accent/30 animate-float" style={{ animationDelay: '1s' }} />
				<div className="absolute bottom-32 left-16 w-1 h-1 bg-accent/25 animate-float" style={{ animationDelay: '2s' }} />
				<div className="absolute bottom-20 right-32 w-2 h-2 bg-accent/20 animate-float" style={{ animationDelay: '0.5s' }} />
			</div>

			{/* Main content container */}
			<div className="relative z-10 flex flex-col min-h-screen">
				{/* Header */}
				<header className="p-4 border-b-2 border-accent/30">
					<div className="flex items-center justify-between max-w-4xl mx-auto">
						<div className="flex items-center gap-2">
							<div className="w-6 h-6 bg-accent border border-accent-foreground relative">
								<div className="absolute inset-1 bg-background" />
								<div className="absolute inset-2 bg-accent" />
							</div>
							<h1 className="text-accent text-sm font-bold">VECTORIZE</h1>
						</div>
						<a 
							href="https://github.com/und3f/vectorize-pixelart" 
							target="_blank" 
							rel="noopener noreferrer"
							className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors"
						>
							<Github size={12} />
							<span className="hidden sm:inline">SOURCE</span>
						</a>
					</div>
				</header>

				{/* Main content */}
				<div className="flex-1 flex flex-col items-center justify-center p-4">
					<div className="w-full max-w-md mx-auto space-y-6">
						{/* Title section with pixel art styling */}
						<div className="text-center space-y-2 mb-8">
							<div className="relative inline-block">
								<h1 className="text-xl text-accent font-bold tracking-wider relative">
									PIXEL → VECTOR
									<div className="absolute -inset-1 bg-accent/10 border border-accent/30 -z-10" />
								</h1>
							</div>
							<p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
								Convert PNG pixel art to clean SVG/EPS vectors
							</p>
						</div>
						
						{/* Main drop area */}
						<DropAreaWithPreview />
						
						{/* Footer info */}
						<div className="text-center space-y-2 pt-4">
							<div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
								<Heart size={10} className="text-accent/60" />
								<span>100% local processing</span>
								<Heart size={10} className="text-accent/60" />
							</div>
							<p className="text-xs text-muted-foreground/70">
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
