import type { Coord, Path, Pixel, PNGImageData } from "./utils";

type Direction = Coord;
type ContourFoundCb = (contour: Path, pixel: Pixel) => void;

const DIRECTIONS: Direction[] = [
	[1, 0],
	[0, -1],
	[-1, 0],
	[0, 1],
];

const DIRECTION_VERTEX: Direction[] = [
	[1, 0],
	[0, 0],
	[0, 1],
	[1, 1],
];

const D_MOD = DIRECTIONS.length;

function getDirection(direction: number): Direction {
	const offset = DIRECTIONS[direction];
	if (offset === undefined) {
		throw new Error(`Invalid direction ${direction}`);
	}
	return offset;
}

function getDirectionVertex(direction: number): Direction {
	const vertex = DIRECTION_VERTEX[direction];
	if (vertex === undefined) {
		throw new Error(`Invalid direction vertex ${direction}`);
	}
	return vertex;
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

	findNeighborbood(y: number, x: number): number | undefined {
		for (let direction = 0; direction < DIRECTIONS.length; direction++) {
			const directionOffset = getDirection(direction);
			const y1 = y + directionOffset[0];
			const x1 = x + directionOffset[1];

			if (
				this.image.comparePixels(y, x, y1, x1) &&
				!this.visitedPixels[y1 * this.image.width + x1]
			) {
				return direction;
			}
		}
	}

	addMoveVertexes(
		contour: Path,
		y: number,
		x: number,
		directionMove: number,
		directionPrevious: number,
	): void {
		for (
			let direction = directionPrevious;
			direction !== directionMove;
			direction = (direction + 1) % D_MOD
		) {
			const vertex = getDirectionVertex(direction);
			contour.push([y + vertex[0], x + vertex[1]]);
		}

		if (directionMove === directionPrevious) contour.pop();

		const vertex = getDirectionVertex(directionMove);
		contour.push([y + vertex[0], x + vertex[1]]);
	}

	addRotationVertexes(
		contour: Path,
		y: number,
		x: number,
		currentDirection: number,
		targetDirection: number,
	): void {
		for (
			let direction = currentDirection;
			direction !== targetDirection;
			direction = (direction + 1) % D_MOD
		) {
			const vertex = getDirectionVertex(direction);
			contour.push([y + vertex[0], x + vertex[1]]);
		}
	}

	addContour(
		contour: Path,
		y: number,
		x: number,
		startDirection: number,
		endDirection: number,
	): void {
		if (startDirection === endDirection) return;

		for (
			let direction = (startDirection + D_MOD - 1) % D_MOD, firstRun = true;
			firstRun || direction !== endDirection;
			direction = (direction + 1) % D_MOD, firstRun = false
		) {
			const vertex = getDirectionVertex(direction);
			contour.push([y + vertex[0], x + vertex[1]]);
		}
	}

	traceContour(y0: number, x0: number): Path {
		const image = this.image;
		const width = this.image.width;
		const height = this.image.height;
		const contour: Path = [];
		const neighborhoodDirection = this.findNeighborbood(y0, x0);

		if (neighborhoodDirection === undefined) {
			this.visitedPixels[y0 * width + x0] = true;
			this.addMoveVertexes(contour, y0, x0, D_MOD - 1, 0);
			return contour;
		}

		this.addContour(contour, y0, x0, 0, neighborhoodDirection);

		let lastDirection = neighborhoodDirection;
		const neighborhoodOffset = getDirection(neighborhoodDirection);
		let ylast = y0 + neighborhoodOffset[0];
		let xlast = x0 + neighborhoodOffset[1];

		const trace = [y0 * width + x0, ylast * width + xlast];

		do {
			const oppositeDirection = (lastDirection + D_MOD / 2) % D_MOD;
			const startDirection = (oppositeDirection + 1) % D_MOD;

			for (
				let newDirection = startDirection;
				;
				newDirection = (newDirection + 1) % D_MOD
			) {
				const directionOffset = getDirection(newDirection);
				const y = ylast + directionOffset[0];
				const x = xlast + directionOffset[1];

				if (y < 0 || y >= height || x < 0 || x >= width) continue;

				if (
					image.comparePixels(ylast, xlast, y, x) &&
					!this.visitedPixels[y * width + x]
				) {
					trace.push(y * width + x);

					this.addContour(contour, ylast, xlast, lastDirection, newDirection);
					ylast = y;
					xlast = x;
					lastDirection = newDirection;
					break;
				}
			}
		} while (!(ylast === y0 && xlast === x0));

		this.addContour(contour, y0, x0, lastDirection, neighborhoodDirection);

		for (const pos of trace) {
			this.visitedPixels[pos] = true;
		}

		return contour;
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

			const contour = this.traceContour(y0, x0);
			if (contour !== undefined) cb(contour, pixel);
		}
	}
}
