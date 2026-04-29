import type { Coord, Path, Pixel, PNGImageData } from "./utils";

type Direction = Coord;
type ContourFoundCb = (contour: Path, pixel: Pixel) => void;
type EdgeMap = Map<string, Coord[]>;

const DIRECTIONS: Direction[] = [
	[1, 0],
	[0, -1],
	[-1, 0],
	[0, 1],
];

function getPointKey(point: Coord): string {
	return `${point[0]},${point[1]}`;
}

function parsePointKey(key: string): Coord {
	const [y, x] = key.split(",").map(Number);
	if (y === undefined || x === undefined) {
		throw new Error(`Invalid point key ${key}`);
	}
	return [y, x];
}

function getContourPoint(contour: Path, index: number): Coord {
	const point = contour[index];
	if (point === undefined) {
		throw new Error(`Invalid contour point ${index}`);
	}
	return point;
}

export class ContourTracing {
	private readonly image: PNGImageData;
	private readonly visitedPixels: boolean[];

	constructor(image: PNGImageData) {
		this.image = image;
		this.visitedPixels = new Array(image.width * image.height);
		this.visitedPixels.fill(false);
	}

	private isSignificantPixel(pixel: Pixel): boolean {
		const [, , , alpha] = pixel;
		return alpha > 0;
	}

	private getIndex(y: number, x: number): number {
		return y * this.image.width + x;
	}

	private isInsideImage(y: number, x: number): boolean {
		return y >= 0 && y < this.image.height && x >= 0 && x < this.image.width;
	}

	private floodFillComponent(y0: number, x0: number): number[] {
		const component: number[] = [];
		const queue: number[] = [this.getIndex(y0, x0)];
		this.visitedPixels[this.getIndex(y0, x0)] = true;

		for (let cursor = 0; cursor < queue.length; cursor++) {
			const index = queue[cursor];
			if (index === undefined) {
				throw new Error(`Invalid queue index ${cursor}`);
			}

			const y = Math.floor(index / this.image.width);
			const x = index % this.image.width;
			component.push(index);

			for (const [dy, dx] of DIRECTIONS) {
				const y1 = y + dy;
				const x1 = x + dx;

				if (!this.isInsideImage(y1, x1)) continue;

				const nextIndex = this.getIndex(y1, x1);
				if (this.visitedPixels[nextIndex]) continue;
				if (!this.image.comparePixels(y0, x0, y1, x1)) continue;

				this.visitedPixels[nextIndex] = true;
				queue.push(nextIndex);
			}
		}

		return component;
	}

	private addBoundaryEdge(edges: EdgeMap, start: Coord, end: Coord): void {
		const key = getPointKey(start);
		const ends = edges.get(key) ?? [];
		ends.push(end);
		edges.set(key, ends);
	}

	private takeBoundaryEdge(edges: EdgeMap, start: Coord): Coord | undefined {
		const key = getPointKey(start);
		const ends = edges.get(key);
		if (ends === undefined) return;

		const end = ends.shift();
		if (ends.length === 0) edges.delete(key);

		return end;
	}

	private hasComponentPixel(
		componentPixels: Set<number>,
		y: number,
		x: number,
	): boolean {
		return this.isInsideImage(y, x) && componentPixels.has(this.getIndex(y, x));
	}

	private buildBoundaryEdges(component: number[]): EdgeMap {
		const componentPixels = new Set(component);
		const edges: EdgeMap = new Map();

		for (const index of component) {
			const y = Math.floor(index / this.image.width);
			const x = index % this.image.width;

			if (!this.hasComponentPixel(componentPixels, y - 1, x)) {
				this.addBoundaryEdge(edges, [y, x], [y, x + 1]);
			}

			if (!this.hasComponentPixel(componentPixels, y, x + 1)) {
				this.addBoundaryEdge(edges, [y, x + 1], [y + 1, x + 1]);
			}

			if (!this.hasComponentPixel(componentPixels, y + 1, x)) {
				this.addBoundaryEdge(edges, [y + 1, x + 1], [y + 1, x]);
			}

			if (!this.hasComponentPixel(componentPixels, y, x - 1)) {
				this.addBoundaryEdge(edges, [y + 1, x], [y, x]);
			}
		}

		return edges;
	}

	private simplifyContour(contour: Path): Path {
		if (contour.length <= 2) return contour;

		const simplified: Path = [];

		for (let i = 0; i < contour.length; i++) {
			const previous = getContourPoint(
				contour,
				(i + contour.length - 1) % contour.length,
			);
			const current = getContourPoint(contour, i);
			const next = getContourPoint(contour, (i + 1) % contour.length);

			if (previous[0] === current[0] && current[0] === next[0]) continue;
			if (previous[1] === current[1] && current[1] === next[1]) continue;

			simplified.push(current);
		}

		return simplified;
	}

	private traceBoundaryContours(component: number[]): Path[] {
		const edges = this.buildBoundaryEdges(component);
		const contours: Path[] = [];

		while (edges.size > 0) {
			const startKey = edges.keys().next().value;
			if (startKey === undefined) break;

			const start = parsePointKey(startKey);
			const contour: Path = [start];
			let current = start;

			for (;;) {
				const next = this.takeBoundaryEdge(edges, current);
				if (next === undefined) break;
				if (next[0] === start[0] && next[1] === start[1]) break;

				contour.push(next);
				current = next;
			}

			contours.push(this.simplifyContour(contour));
		}

		return contours;
	}

	traceContours(cb: ContourFoundCb): void {
		for (let i = 0; i < this.visitedPixels.length; i++) {
			if (this.visitedPixels[i]) continue;

			const y0 = Math.floor(i / this.image.width);
			const x0 = i % this.image.width;
			const pixel = this.image.getPixel(y0, x0);

			if (!this.isSignificantPixel(pixel)) {
				this.visitedPixels[i] = true;
				continue;
			}

			const component = this.floodFillComponent(y0, x0);
			for (const contour of this.traceBoundaryContours(component)) {
				cb(contour, pixel);
			}
		}
	}
}
