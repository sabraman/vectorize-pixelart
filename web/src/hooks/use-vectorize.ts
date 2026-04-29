import { Buffer } from "buffer";
import { PNG } from "pngjs";
import { useState } from "react";
import { type VectorFormat, vectorizePng } from "vectorize-pixelart";

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

			return vectorizePng(png, format);
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
