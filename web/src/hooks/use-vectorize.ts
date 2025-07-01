import { Buffer } from "buffer";
import { PNG } from "pngjs";
import { useState } from "react";
import { ContourTracing } from "~/lib/vectorize/contour-tracing";
import { EPS, PNGImageData, SVG } from "~/lib/vectorize/utils";

type VectorFormat = "svg" | "eps";

export function useVectorize() {
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function vectorizeImage(
		file: File,
		format: VectorFormat,
	): Promise<string> {
		setIsProcessing(true);
		setError(null);

		try {
			// Read the file as an array buffer
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			// Parse the PNG
			const png = new PNG();
			await new Promise<void>((resolve, reject) => {
				png.parse(buffer, (error) => {
					if (error) reject(error);
					else resolve();
				});
			});

			// Create image data
			const image = new PNGImageData(png);

			// Setup for vectorization
			const targetSize = 2 ** 23;
			const pixelMultiplier = Math.sqrt(targetSize / (png.height * png.width));

			// Select formatter based on format
			const VectorFormatterClass = format === "svg" ? SVG : EPS;
			const vectorFormatter = new VectorFormatterClass(
				png.height,
				png.width,
				pixelMultiplier,
			);

			// Perform the vectorization
			let result = vectorFormatter.header();

			const tracer = new ContourTracing(image);
			tracer.traceContours((contour, pixel) => {
				result += vectorFormatter.path(contour, pixel);
			});

			result += vectorFormatter.footer();

			return result;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Unknown error occurred";
			setError(errorMessage);
			throw err;
		} finally {
			setIsProcessing(false);
		}
	}

	return {
		vectorizeImage,
		isProcessing,
		error,
	};
}
