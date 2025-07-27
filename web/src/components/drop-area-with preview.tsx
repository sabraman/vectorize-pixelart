"use client";

import {
	ArrowUp,
	Close,
	Download,
	File,
	Image,
	Loader,
	Minus,
	Plus,
	Upload,
	WarningBox,
} from "@nsmr/pixelart-react";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";

import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { useFileUpload } from "~/hooks/use-file-upload";
import { useVectorize } from "~/hooks/use-vectorize";
import { downloadString } from "~/lib/download";

// Maximum canvas dimensions based on browser limits
// Most browsers have a limit around 32,767 pixels in either dimension
// or a total pixel count limit (width * height)
const MAX_CANVAS_DIMENSION = 16384; // Conservative limit for most browsers
const MAX_CANVAS_AREA = MAX_CANVAS_DIMENSION * MAX_CANVAS_DIMENSION;

export default function DropAreaWithPreview() {
	const maxSizeMB = 2;
	const maxSize = maxSizeMB * 1024 * 1024; // 2MB default
	const [processingFormat, setProcessingFormat] = useState<
		"svg" | "pdf" | null
	>(null);
	const [isUpscaling, setIsUpscaling] = useState(false);
	const [customUpscale, setCustomUpscale] = useState("10");
	const [upscaleError, setUpscaleError] = useState<string | null>(null);
	const [maxUpscaleFactor, setMaxUpscaleFactor] = useState<number | null>(null);
	const [imageDimensions, setImageDimensions] = useState<{
		width: number;
		height: number;
	} | null>(null);
	const [processingProgress, setProcessingProgress] = useState(0);
	const [showOptions, setShowOptions] = useState(false);
	const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

	const [
		{ files, isDragging, errors },
		{
			handleDragEnter,
			handleDragLeave,
			handleDragOver,
			handleDrop,
			openFileDialog,
			removeFile,
			getInputProps,
		},
	] = useFileUpload({
		accept: "image/png",
		maxSize,
	});

	const {
		vectorizeImage,
		isProcessing,
		error: vectorizeError,
	} = useVectorize();
	const previewUrl = files[0]?.preview || null;
	const fileName = files[0]?.file.name || null;

	// Calculate max upscale factor when a new file is loaded
	useEffect(() => {
		const calculateMaxUpscaleFactor = async () => {
			if (!files[0]?.file || !("arrayBuffer" in files[0].file)) {
				setMaxUpscaleFactor(null);
				setImageDimensions(null);
				return;
			}

			try {
				// Read the file as an array buffer
				const arrayBuffer = await files[0].file.arrayBuffer();

				// Create a bitmap from the array buffer
				const bitmap = await createImageBitmap(new Blob([arrayBuffer]));

				// Store original dimensions
				setImageDimensions({ width: bitmap.width, height: bitmap.height });

				// Calculate max possible upscale factor based on dimensions
				const maxWidthFactor = Math.floor(MAX_CANVAS_DIMENSION / bitmap.width);
				const maxHeightFactor = Math.floor(
					MAX_CANVAS_DIMENSION / bitmap.height,
				);

				// The smaller of the two is our limiting factor
				let maxFactor = Math.min(maxWidthFactor, maxHeightFactor);

				// Also check total area constraint
				const maxAreaFactor = Math.floor(
					Math.sqrt(MAX_CANVAS_AREA / (bitmap.width * bitmap.height)),
				);
				maxFactor = Math.min(maxFactor, maxAreaFactor);

				// Set the max upscale factor (minimum of 2)
				setMaxUpscaleFactor(Math.max(2, maxFactor));

				// If current custom upscale is higher than max, adjust it
				if (Number.parseInt(customUpscale, 10) > maxFactor) {
					setCustomUpscale(maxFactor.toString());
				}
			} catch (error) {
				console.error("Error calculating max upscale factor:", error);
				setMaxUpscaleFactor(null);
				setImageDimensions(null);
			}
		};

		calculateMaxUpscaleFactor();
	}, [files, customUpscale]);

	// Show options automatically when file is loaded
	useEffect(() => {
		if (previewUrl) {
			setShowOptions(true);
		} else {
			setShowOptions(false);
		}
	}, [previewUrl]);

	// Simulate progress during processing operations
	useEffect(() => {
		if (isProcessing || processingFormat || isUpscaling) {
			// Reset progress but start at 10% to show immediate feedback
			setProcessingProgress(10);

			// Clear any existing interval
			if (progressIntervalRef.current) {
				clearInterval(progressIntervalRef.current);
			}

			// Set up a new interval to increment progress
			progressIntervalRef.current = setInterval(() => {
				setProcessingProgress((prev) => {
					// Use a smaller increment for smoother progress
					// Slow down as we get closer to 95%
					const increment = Math.max(0.5, (95 - prev) / 10);
					const newProgress = prev + increment;
					return Math.min(newProgress, 95);
				});
			}, 50); // Use a shorter interval for more frequent updates
		} else {
			// Processing completed, set to 100%
			setProcessingProgress(100);

			// Clear the interval
			if (progressIntervalRef.current) {
				clearInterval(progressIntervalRef.current);
				progressIntervalRef.current = null;
			}

			// Reset progress after a delay
			const resetTimer = setTimeout(() => {
				setProcessingProgress(0);
			}, 1000);

			return () => clearTimeout(resetTimer);
		}

		// Clean up interval on unmount
		return () => {
			if (progressIntervalRef.current) {
				clearInterval(progressIntervalRef.current);
			}
		};
	}, [isProcessing, processingFormat, isUpscaling]);

	const handleExport = async (format: "svg" | "pdf") => {
		if (!files[0]) return;

		setProcessingFormat(format);

		try {
			// Check if we have a valid file to process
			if (!files[0].file) {
				throw new Error("No file selected");
			}

			// Make sure we're handling a File object (not FileMetadata)
			if ("arrayBuffer" in files[0].file) {
				// Add a small artificial delay to ensure progress bar is visible
				// Only if the operation would complete too quickly
				const startTime = Date.now();

				const result = await vectorizeImage(files[0].file, format);

				// If processing was too fast, add a small delay
				const processingTime = Date.now() - startTime;
				if (processingTime < 500) {
					await new Promise((resolve) =>
						setTimeout(resolve, 500 - processingTime),
					);
				}

				const outputFilename = `${files[0].file.name.split(".")[0]}.${format}`;
				const mimeType =
					format === "svg" ? "image/svg+xml" : "application/pdf";

				downloadString(result, outputFilename, mimeType);
			} else {
				throw new Error("Invalid file object - cannot process this file type");
			}
		} catch (error) {
			console.error(`Failed to export as ${format}:`, error);
		} finally {
			setProcessingFormat(null);
		}
	};

	const handleUpscale = async (scale: string | number) => {
		if (!files[0]) return;

		setUpscaleError(null);
		let upscaleFactor =
			typeof scale === "string" ? Number.parseInt(scale, 10) : scale;

		// Validate upscale factor
		if (Number.isNaN(upscaleFactor) || upscaleFactor < 2) {
			upscaleFactor = 2; // Default to 2x if invalid
		}

		// Cap at max upscale factor if calculated
		if (maxUpscaleFactor !== null && upscaleFactor > maxUpscaleFactor) {
			upscaleFactor = maxUpscaleFactor;
		}

		setIsUpscaling(true);

		try {
			// Check if we have a valid file to process
			if (!files[0].file || !("arrayBuffer" in files[0].file)) {
				throw new Error("Invalid file object");
			}

			const startTime = Date.now();

			// Read the file as an array buffer
			const arrayBuffer = await files[0].file.arrayBuffer();

			// Create a bitmap from the array buffer
			const bitmap = await createImageBitmap(new Blob([arrayBuffer]));

			// Check if the resulting canvas would exceed browser limits
			const targetWidth = bitmap.width * upscaleFactor;
			const targetHeight = bitmap.height * upscaleFactor;
			const targetArea = targetWidth * targetHeight;

			if (
				targetWidth > MAX_CANVAS_DIMENSION ||
				targetHeight > MAX_CANVAS_DIMENSION
			) {
				throw new Error(
					`Upscale too large: resulting image (${targetWidth}x${targetHeight}) exceeds maximum dimension of ${MAX_CANVAS_DIMENSION}px`,
				);
			}

			if (targetArea > MAX_CANVAS_AREA) {
				throw new Error(
					`Upscale too large: resulting image area (${targetWidth}x${targetHeight} = ${targetArea} pixels) exceeds maximum area`,
				);
			}

			// Create a canvas with upscaled dimensions
			const canvas = document.createElement("canvas");

			try {
				canvas.width = targetWidth;
				canvas.height = targetHeight;
			} catch (e) {
				throw new Error(
					`Browser cannot allocate canvas of size ${targetWidth}x${targetHeight}. Try a smaller upscale factor.`,
				);
			}

			// Get the canvas context and draw the upscaled image
			const ctx = canvas.getContext("2d");
			if (!ctx) throw new Error("Could not get canvas context");

			// Disable image smoothing for pixelated look
			ctx.imageSmoothingEnabled = false;

			try {
				ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
			} catch (e) {
				throw new Error(
					`Failed to render image at size ${targetWidth}x${targetHeight}. Try a smaller upscale factor.`,
				);
			}

			// Convert canvas to PNG blob
			const blob = await new Promise<Blob>((resolve, reject) => {
				try {
					canvas.toBlob((blob) => {
						if (blob) resolve(blob);
						else reject(new Error("Failed to create blob"));
					}, "image/png");
				} catch (e) {
					reject(
						new Error(
							"Failed to convert canvas to PNG. The image might be too large.",
						),
					);
				}
			});

			// If processing was too fast, add a small delay to show progress
			const processingTime = Date.now() - startTime;
			if (processingTime < 500) {
				await new Promise((resolve) =>
					setTimeout(resolve, 500 - processingTime),
				);
			}

			// Create download link
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			const originalName = files[0].file.name.split(".")[0];
			a.href = url;
			a.download = `${originalName}_UPx${upscaleFactor}.png`;
			document.body.appendChild(a);
			a.click();

			// Clean up
			setTimeout(() => {
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
			}, 100);
		} catch (error) {
			console.error("Failed to upscale image:", error);
			setUpscaleError(
				error instanceof Error
					? error.message
					: "Unknown error during upscaling",
			);
		} finally {
			setIsUpscaling(false);
		}
	};

	const incrementUpscale = () => {
		const currentValue = Number.parseInt(customUpscale, 10) || 2;
		const newValue = currentValue + 1;

		// Cap at max upscale factor if calculated
		if (maxUpscaleFactor !== null && newValue > maxUpscaleFactor) {
			setCustomUpscale(maxUpscaleFactor.toString());
		} else {
			setCustomUpscale(newValue.toString());
		}
	};

	const decrementUpscale = () => {
		const currentValue = Number.parseInt(customUpscale, 10) || 2;
		setCustomUpscale(Math.max(currentValue - 1, 2).toString());
	};

	const handleUpscaleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		// Allow empty string for better UX during typing
		if (e.target.value === "") {
			setCustomUpscale("");
			return;
		}

		const value = Number.parseInt(e.target.value, 10);
		if (!Number.isNaN(value)) {
			// Enforce minimum value
			if (value < 2) {
				setCustomUpscale("2");
			}
			// Cap at max upscale factor if calculated
			else if (maxUpscaleFactor !== null && value > maxUpscaleFactor) {
				setCustomUpscale(maxUpscaleFactor.toString());
			} else {
				setCustomUpscale(value.toString());
			}
		}
	};

	// When input loses focus, ensure we have a valid value
	const handleUpscaleInputBlur = () => {
		if (
			customUpscale === "" ||
			Number.isNaN(Number.parseInt(customUpscale, 10))
		) {
			setCustomUpscale("2");
		}
	};

	// Determine if any processing is happening
	const isAnyProcessing =
		isProcessing || processingFormat !== null || isUpscaling;

	return (
		<div className="w-full space-y-3">
			{/* Main drop area */}
			<div className="relative w-full">
				<div
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					onClick={openFileDialog}
					// biome-ignore lint/a11y/useSemanticElements: Cannot use button element due to nested button (remove button)
					role="button"
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							openFileDialog();
						}
					}}
					data-dragging={isDragging || undefined}
					className="group relative w-full cursor-pointer overflow-hidden border-2 border-accent/40 border-dashed bg-background/50 backdrop-blur-sm transition-all duration-200 hover:border-accent/60 hover:bg-accent/5 focus:border-accent focus:bg-accent/5 focus:outline-none data-[dragging=true]:scale-[1.02] data-[dragging=true]:border-accent data-[dragging=true]:bg-accent/10"
				>
					<input
						{...getInputProps()}
						className="sr-only"
						aria-label="Upload image file"
					/>

					{previewUrl ? (
						// Preview mode
						<div className="relative">
							<div className="flex aspect-square max-h-full w-full items-center justify-center p-2">
								<img
									src={previewUrl}
									alt={fileName || "Preview"}
									className="pixel-art-image max-h-full max-w-full border border-accent/20 object-contain"
									style={{ imageRendering: "pixelated" }}
								/>
							</div>

							{/* Remove button */}
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									files[0]?.id && removeFile(files[0].id);
								}}
								className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center border border-accent bg-background text-accent text-xs transition-colors hover:bg-accent hover:text-accent-foreground"
							>
								<Close size={10} />
							</button>

							{/* File info overlay */}
							<div className="absolute right-2 bottom-2 left-2 border border-accent/30 bg-background/90 p-2">
								<div className="truncate font-bold text-accent text-xs">
									{fileName}
								</div>
								{imageDimensions && (
									<div className="text-muted-foreground text-xs">
										{imageDimensions.width}×{imageDimensions.height}px
									</div>
								)}
							</div>
						</div>
					) : (
						// Upload state
						<div className="relative flex max-h-48 flex-col items-center justify-center p-6 text-center">
							{/* Floating pixel decorations */}
							<div className="pointer-events-none absolute inset-0 overflow-hidden">
								<div
									className="absolute top-4 left-4 h-1 w-1 animate-float bg-accent/30"
									style={{ animationDelay: "0s" }}
								/>
								<div
									className="absolute top-6 right-6 h-1 w-1 animate-float bg-accent/20"
									style={{ animationDelay: "1s" }}
								/>
								<div
									className="absolute bottom-8 left-6 h-1 w-1 animate-float bg-accent/25"
									style={{ animationDelay: "2s" }}
								/>
								<div
									className="absolute right-4 bottom-4 h-1 w-1 animate-float bg-accent/30"
									style={{ animationDelay: "0.5s" }}
								/>
							</div>

							<div className="relative z-10 mb-4 flex h-10 w-10 items-center justify-center border border-accent/40 bg-accent/20 transition-all duration-200 group-hover:scale-110 group-hover:animate-pixelPulse group-hover:bg-accent/40">
								<Image
									size={20}
									className="text-accent transition-colors group-hover:text-accent-foreground"
								/>

								{/* Hover glow effect */}
								<div className="absolute inset-0 bg-accent/0 transition-colors group-hover:bg-accent/10" />
							</div>

							<div className="relative z-10 space-y-2">
								<p className="font-bold text-accent text-sm tracking-wider transition-transform group-hover:scale-105">
									DROP PNG HERE
								</p>
								<p className="text-muted-foreground text-xs transition-colors group-hover:text-accent/70">
									or click to browse
								</p>
								<p className="text-muted-foreground/70 text-xs">
									max {maxSizeMB}MB
								</p>
							</div>

							{/* Corner pixels */}
							<div className="absolute top-2 left-2 h-2 w-2 border-accent/20 border-t-2 border-l-2 transition-colors group-hover:border-accent/50" />
							<div className="absolute top-2 right-2 h-2 w-2 border-accent/20 border-t-2 border-r-2 transition-colors group-hover:border-accent/50" />
							<div className="absolute bottom-2 left-2 h-2 w-2 border-accent/20 border-b-2 border-l-2 transition-colors group-hover:border-accent/50" />
							<div className="absolute right-2 bottom-2 h-2 w-2 border-accent/20 border-r-2 border-b-2 transition-colors group-hover:border-accent/50" />
						</div>
					)}
				</div>
			</div>

			{/* Error display */}
			{(errors.length > 0 || vectorizeError || upscaleError) && (
				<div className="space-y-2">
					{errors.length > 0 && (
						<div className="flex items-center gap-2 border border-destructive/30 bg-destructive/10 p-2 text-destructive text-xs">
							<WarningBox size={12} />
							<span>{errors[0]}</span>
						</div>
					)}
					{vectorizeError && (
						<div className="flex items-center gap-2 border border-destructive/30 bg-destructive/10 p-2 text-destructive text-xs">
							<WarningBox size={12} />
							<span>{vectorizeError}</span>
						</div>
					)}
					{upscaleError && (
						<div className="flex items-center gap-2 border border-destructive/30 bg-destructive/10 p-2 text-destructive text-xs">
							<WarningBox size={12} />
							<span>{upscaleError}</span>
						</div>
					)}
				</div>
			)}

			{/* Progress bar */}
			{isAnyProcessing && (
				<div className="space-y-2">
					<div className="relative h-3 overflow-hidden border border-accent/30 bg-background">
						<div
							className="relative h-full bg-accent transition-all duration-100 ease-out"
							style={{ width: `${processingProgress}%` }}
						>
							{/* Animated pixel pattern */}
							<div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
							<div
								className="absolute inset-0 opacity-50"
								style={{
									backgroundImage: `url("data:image/svg+xml,%3csvg width='4' height='4' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M0 0h4v4H0z' fill='%23ffffff' fill-opacity='0.1'/%3e%3cpath d='M0 0h2v2H0zM2 2h2v2H2z' fill='%23ffffff' fill-opacity='0.2'/%3e%3c/svg%3e")`,
									backgroundSize: "4px 4px",
								}}
							/>
						</div>
					</div>
					<div className="flex items-center justify-center gap-2">
						<div className="flex gap-1">
							<div
								className="h-1 w-1 animate-float bg-accent"
								style={{ animationDelay: "0s" }}
							/>
							<div
								className="h-1 w-1 animate-float bg-accent"
								style={{ animationDelay: "0.2s" }}
							/>
							<div
								className="h-1 w-1 animate-float bg-accent"
								style={{ animationDelay: "0.4s" }}
							/>
						</div>
						<p className="text-center font-bold text-accent text-xs tracking-wider">
							{processingFormat === "svg" &&
								`SVG ${Math.round(processingProgress)}%`}
							{processingFormat === "pdf" &&
								`PDF ${Math.round(processingProgress)}%`}
							{isUpscaling && `UPSCALE ${Math.round(processingProgress)}%`}
							{isProcessing &&
								!processingFormat &&
								!isUpscaling &&
								`PROCESS ${Math.round(processingProgress)}%`}
						</p>
						<div className="flex gap-1">
							<div
								className="h-1 w-1 animate-float bg-accent"
								style={{ animationDelay: "0.6s" }}
							/>
							<div
								className="h-1 w-1 animate-float bg-accent"
								style={{ animationDelay: "0.8s" }}
							/>
							<div
								className="h-1 w-1 animate-float bg-accent"
								style={{ animationDelay: "1s" }}
							/>
						</div>
					</div>
				</div>
			)}

			{/* Action buttons - only show when file is loaded */}
			{showOptions && (
				<div className="slide-in-from-bottom-2 animate-in space-y-3 duration-300">
					{/* Vector export */}
					<div className="border border-accent/30 bg-background/30 p-3">
						<h3 className="mb-2 text-center font-bold text-accent text-xs">
							EXPORT VECTOR
						</h3>
						<div className="grid grid-cols-2 gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleExport("svg")}
								disabled={isAnyProcessing}
								className="text-xs"
							>
								{processingFormat === "svg" ? (
									<Loader size={12} className="animate-spin" />
								) : (
									<File size={12} />
								)}
								SVG
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={() => handleExport("pdf")}
								disabled={isAnyProcessing}
								className="text-xs"
							>
								{processingFormat === "pdf" ? (
									<Loader size={12} className="animate-spin" />
								) : (
									<File size={12} />
								)}
								PDF
							</Button>
						</div>
					</div>

					{/* PNG upscale */}
					<div className="border border-accent/30 bg-background/30 p-3">
						<h3 className="mb-2 text-center font-bold text-accent text-xs">
							UPSCALE PNG
						</h3>

						{/* Quick upscale buttons */}
						<div className="mb-2 grid grid-cols-3 gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleUpscale(2)}
								disabled={isUpscaling}
								className="text-xs"
							>
								<ArrowUp size={10} />
								2×
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={() => handleUpscale(5)}
								disabled={isUpscaling}
								className="text-xs"
							>
								<ArrowUp size={10} />
								5×
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={() => handleUpscale(10)}
								disabled={isUpscaling}
								className="text-xs"
							>
								<ArrowUp size={10} />
								10×
							</Button>
						</div>

						{/* Custom upscale */}
						<div className="space-y-2">
							<div className="flex border border-accent/30 bg-background">
								<button
									type="button"
									onClick={decrementUpscale}
									disabled={
										Number.parseInt(customUpscale, 10) <= 2 || isUpscaling
									}
									className="flex h-6 flex-1 items-center justify-center hover:bg-accent/10 disabled:opacity-50"
								>
									<Minus size={10} />
								</button>

								<input
									type="text"
									inputMode="numeric"
									pattern="[0-9]*"
									value={customUpscale}
									onChange={handleUpscaleInputChange}
									onBlur={handleUpscaleInputBlur}
									className="h-6 flex-1 border-accent/30 border-x bg-transparent text-center text-xs focus:outline-none"
								/>

								<button
									type="button"
									onClick={incrementUpscale}
									disabled={
										isUpscaling ||
										(maxUpscaleFactor !== null &&
											Number.parseInt(customUpscale, 10) >= maxUpscaleFactor)
									}
									className="flex h-6 flex-1 items-center justify-center hover:bg-accent/10 disabled:opacity-50"
								>
									<Plus size={10} />
								</button>
							</div>

							<Button
								onClick={() => handleUpscale(customUpscale)}
								disabled={isUpscaling}
								size="sm"
								className="w-full text-xs"
							>
								{isUpscaling ? (
									<>
										<Loader size={12} className="animate-spin" />
										UPSCALING...
									</>
								) : (
									<>
										<Download size={12} />
										UPSCALE {customUpscale}×
									</>
								)}
							</Button>
						</div>

						{maxUpscaleFactor && (
							<p className="mt-1 text-center text-muted-foreground/70 text-xs">
								max:{" "}
								<button
									type="button"
									onClick={() => setCustomUpscale(maxUpscaleFactor.toString())}
									className="cursor-pointer text-accent hover:underline focus:outline-none"
									aria-label="Set to maximum upscale factor"
								>
									{maxUpscaleFactor}×
								</button>
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
