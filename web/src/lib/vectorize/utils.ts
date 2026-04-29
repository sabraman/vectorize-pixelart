import { Buffer } from "buffer";
import type { PNG } from "pngjs";

const DEFAULT_MULTIPLIER = 1;
const BYTES_PER_PIXEL = 4;

export type Pixel = [number, number, number, number];
export type Coord = [number, number];
export type Path = Coord[];

function getPathPoint(contour: Path, index: number): Coord {
	const point = contour[index];
	if (point === undefined) {
		throw new Error(`Invalid contour point ${index}`);
	}
	return point;
}

abstract class Image {
	protected readonly height: number;
	protected readonly width: number;
	protected readonly multiplier: number;

	constructor(height: number, width: number, multiplier = DEFAULT_MULTIPLIER) {
		this.height = height;
		this.width = width;
		this.multiplier = multiplier == null ? 1 : multiplier;
	}

	abstract header(): string;
	abstract footer(): string;
	abstract path(contour: Path, pixel: Pixel): string;
}

export class SVG extends Image {
	private readonly pathsByColor = new Map<string, string[]>();

	header(): string {
		return `\
<?xml version="1.0" encoding="UTF-8" ?>
<svg width="${this.width * this.multiplier}" height="${this.height * this.multiplier}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
`;
	}

	footer(): string {
		let paths = "";

		for (const [rgba, pathData] of this.pathsByColor) {
			paths += `  <path d="${pathData.join(" ")}" fill-rule="evenodd" style="fill:rgba(${rgba})" />\n`;
		}

		return `${paths}</svg>\n`;
	}

	path(contour: Path, pixel: Pixel): string {
		if (contour.length === 0) return "";

		const multiplier = this.multiplier;
		const rgba = pixel.join(", ");
		const move = getPathPoint(contour, 0);
		let path = `M ${move[1] * multiplier} ${move[0] * multiplier}`;

		for (let i = 1; i < contour.length; i++) {
			const point = getPathPoint(contour, i);
			path += ` L${point[1] * multiplier} ${point[0] * multiplier}`;
		}

		path += " Z";

		const paths = this.pathsByColor.get(rgba) ?? [];
		paths.push(path);
		this.pathsByColor.set(rgba, paths);

		return "";
	}
}

export class PDF extends Image {
	private contentStream = "";

	header(): string {
		const width = this.width * this.multiplier;
		const height = this.height * this.multiplier;

		return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 ${width} ${height}]
/Contents 4 0 R
/Resources <<
>>
>>
endobj

`;
	}

	footer(): string {
		const contentLength = Buffer.byteLength(this.contentStream, "utf8");
		const contentObj = `4 0 obj
<<
/Length ${contentLength}
>>
stream
${this.contentStream}endstream
endobj

`;

		const headerLength = Buffer.byteLength(this.header(), "utf8");
		const contentObjLength = Buffer.byteLength(contentObj, "utf8");
		const xrefOffset = headerLength + contentObjLength;

		return `${contentObj}xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
${this.padOffset(headerLength)} 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
${xrefOffset}
%%EOF
`;
	}

	private padOffset(offset: number): string {
		return offset.toString().padStart(10, "0");
	}

	path(contour: Path, pixel: Pixel): string {
		if (contour.length === 0) return "";

		const multiplier = this.multiplier;
		const height = this.height * multiplier;
		const r = (pixel[0] / 255).toFixed(3);
		const g = (pixel[1] / 255).toFixed(3);
		const b = (pixel[2] / 255).toFixed(3);
		const move = getPathPoint(contour, 0);
		let path = `${r} ${g} ${b} rg\n`;

		path += `${move[1] * multiplier} ${height - move[0] * multiplier} m\n`;

		for (let i = 1; i < contour.length; i++) {
			const point = getPathPoint(contour, i);
			path += `${point[1] * multiplier} ${height - point[0] * multiplier} l\n`;
		}

		path += "f\n";
		this.contentStream += path;

		return "";
	}
}

export class PNGImageData {
	private readonly data: Buffer;

	readonly width: number;
	readonly height: number;

	constructor(png: PNG) {
		this.width = png.width;
		this.height = png.height;
		this.data = png.data;
	}

	comparePixels(y1: number, x1: number, y2: number, x2: number): boolean {
		const offset1 = (y1 * this.width + x1) * BYTES_PER_PIXEL;
		const offset2 = (y2 * this.width + x2) * BYTES_PER_PIXEL;

		for (let i = 0; i < BYTES_PER_PIXEL; i++) {
			if (this.data[offset1 + i] !== this.data[offset2 + i]) return false;
		}

		return true;
	}

	getPixel(y: number, x: number): Pixel {
		const offset = (y * this.width + x) * BYTES_PER_PIXEL;

		return [
			this.data[offset] ?? 0,
			this.data[offset + 1] ?? 0,
			this.data[offset + 2] ?? 0,
			this.data[offset + 3] ?? 0,
		];
	}
}
