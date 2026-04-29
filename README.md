# Vectorize Pixelart

Convert pixel art PNG files to SVG or PDF vector output.

[![License: GPL-3.0-or-later](https://img.shields.io/badge/License-GPL%203.0--or--later-green.svg)](https://spdx.org/licenses/GPL-3.0-or-later.html)
[![npm version](https://img.shields.io/npm/v/vectorize-pixelart.svg)](https://www.npmjs.com/package/vectorize-pixelart)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-blue.svg)](https://www.typescriptlang.org/)

This package traces contours in pixel art PNG files and writes vector paths as SVG or PDF. It includes a CLI, a TypeScript API, and a Next.js web interface.

## Features

- PNG input
- SVG and PDF output
- Contour tracing for pixel regions
- Command-line interface
- TypeScript types
- Browser-based web interface
- Local processing in the web app

## Installation

```bash
bun add vectorize-pixelart
```

## Web App

The hosted web app is available at [https://vectorize-pixelart.vercel.app/](https://vectorize-pixelart.vercel.app/).

## CLI Usage

Convert a PNG file to SVG:

```bash
vectorize-pixelart input.png output.svg
```

Convert a PNG file to PDF:

```bash
vectorize-pixelart input.png output.pdf
```

## API Usage

```typescript
import fs from "node:fs";
import { PNG } from "pngjs";
import { ContourTracing, PDF, PNGImageData, SVG } from "vectorize-pixelart";

const png = PNG.sync.read(fs.readFileSync("input.png"));
const image = new PNGImageData(png);
const tracer = new ContourTracing(image);

const svg = new SVG(image.height, image.width);

process.stdout.write(svg.header());
tracer.traceContours((contour, pixel) => {
	process.stdout.write(svg.path(contour, pixel));
});
process.stdout.write(svg.footer());

const pdf = new PDF(image.height, image.width);

process.stdout.write(pdf.header());
tracer.traceContours((contour, pixel) => {
	process.stdout.write(pdf.path(contour, pixel));
});
process.stdout.write(pdf.footer());
```

## Output Formats

### SVG

- Works in browsers and vector editors
- Keeps pixel edges as vector paths
- Uses per-path fill colors

### PDF

- Uses vector paths
- Suitable for PDF viewers and print workflows
- Preserves hard pixel-art edges

## Development

### Prerequisites

- Node.js 18+
- Bun 1.3+

### Setup

```bash
git clone https://github.com/sabraman/vectorize-pixelart.git
cd vectorize-pixelart
bun install
```

### Commands

```bash
bun run lint
bun run test
bun x tsc --noEmit
```

The build script is available as:

```bash
bun run build
```

### Web App

```bash
cd web
bun install
bun run dev
```

The local web app runs at `http://localhost:3000`.

## Project Structure

```text
vectorize-pixelart/
├── src/                    # Core library source
│   ├── contour-tracing.ts
│   ├── utils.ts
│   └── vectorize-pixelart.ts
├── test/                   # Core library tests
└── web/                    # Next.js web application
```

## API Reference

### ContourTracing

```typescript
class ContourTracing {
	constructor(image: PNGImageData);
	traceContours(callback: (contour: Path, pixel: Pixel) => void): void;
}
```

### PNGImageData

```typescript
class PNGImageData {
	constructor(png: PNG);
	comparePixels(y1: number, x1: number, y2: number, x2: number): boolean;
	getPixel(y: number, x: number): Pixel;
}
```

### SVG

```typescript
class SVG {
	constructor(height: number, width: number, pixelMultiplier?: number);
	header(): string;
	path(contour: Path, pixel: Pixel): string;
	footer(): string;
}
```

### PDF

```typescript
class PDF {
	constructor(height: number, width: number, pixelMultiplier?: number);
	header(): string;
	path(contour: Path, pixel: Pixel): string;
	footer(): string;
}
```

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make the change.
4. Run `bun run lint`, `bun run test`, and `bun x tsc --noEmit`.
5. Open a pull request.

## License

This project is licensed under GPL-3.0-or-later. See [LICENSE](LICENSE).

## Links

- [GitHub](https://github.com/sabraman/vectorize-pixelart)
- [npm](https://www.npmjs.com/package/vectorize-pixelart)
- [Web App](https://vectorize-pixelart.vercel.app/)
