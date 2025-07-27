# 🎨 Vectorize Pixelart

> Convert raster pixel art graphics to clean vector formats (SVG/PDF)

[![License: GPL-3.0-or-later](https://img.shields.io/badge/License-GPL%203.0--or--later-green.svg)](https://spdx.org/licenses/GPL-3.0-or-later.html)
[![npm version](https://img.shields.io/npm/v/vectorize-pixelart.svg)](https://www.npmjs.com/package/vectorize-pixelart)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1.3-blue.svg)](https://www.typescriptlang.org/)

A powerful tool for converting pixel art PNG images into clean, scalable vector formats. Perfect for game developers, artists, and anyone who needs to scale up their pixel art without losing quality.

## ✨ Features

- **🖼️ PNG to Vector Conversion** - Convert pixel art to SVG or PDF formats
- **🎯 Contour Tracing** - Intelligent edge detection and path generation
- **📱 Web Interface** - Modern, mobile-first web app for easy conversion
- **⚡ CLI Tool** - Command-line interface for batch processing
- **🔒 Privacy First** - 100% local processing, no uploads or tracking
- **📦 TypeScript** - Fully typed for better development experience
- **📄 PDF Support** - Generate proper PDF files with vector paths

## 🚀 Quick Start

### CLI Installation

```bash
pnpm add vectorize-pixelart
```

### Web App

Visit the live web application: [https://vectorize-pixelart.vercel.app/](https://vectorize-pixelart.vercel.app/)

## 📖 Usage

### Command Line Interface

Convert a PNG file to SVG:

```bash
vectorize-pixelart input.png output.svg
```

Convert to PDF format:

```bash
vectorize-pixelart input.png output.pdf
```

### Programmatic Usage

```typescript
import { PNG } from 'pngjs'
import { ContourTracing, PNGImageData, SVG, PDF } from 'vectorize-pixelart'

// Read PNG image
const png = PNG.sync.read(fs.readFileSync('input.png'))
const image = new PNGImageData(png)

// Create SVG composer
const svg = new SVG(image.height, image.width)

// Start SVG output
process.stdout.write(svg.header())

// Trace contours
const tracer = new ContourTracing(image)
tracer.traceContours((contour, pixel) => {
  process.stdout.write(svg.path(contour, pixel))
})

// End SVG output
process.stdout.write(svg.footer())

// Or create PDF
const pdf = new PDF(image.height, image.width)
process.stdout.write(pdf.header())
tracer.traceContours((contour, pixel) => {
  process.stdout.write(pdf.path(contour, pixel))
})
process.stdout.write(pdf.footer())
```

### Web Interface

1. **Drag & Drop** - Simply drag your PNG file onto the web interface
2. **Preview** - See a live preview of your pixel art
3. **Convert** - Click to generate vector output
4. **Download** - Get your SVG or PDF file instantly

## 📄 Output Formats

### SVG Format
- **Web-friendly** - Perfect for web applications and browsers
- **Scalable** - Maintains quality at any size
- **Editable** - Can be modified in vector graphics software
- **Small file size** - Efficient for web use

### PDF Format
- **Print-ready** - Perfect for professional printing
- **Universal compatibility** - Works with all PDF viewers
- **Vector paths** - Maintains crisp edges at any scale
- **Professional standard** - Industry-standard format

## 🏗️ Development

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/sabraman/vectorize-pixelart.git
cd vectorize-pixelart

# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test
```

### Web App Development

```bash
cd web
pnpm dev
```

The web app will be available at `http://localhost:3000`

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test contour-tracing.test.ts
```

## 📁 Project Structure

```
vectorize-pixelart/
├── src/                    # Core library source
│   ├── contour-tracing.ts  # Contour detection algorithm
│   ├── utils.ts           # Utility functions and formatters
│   └── vectorize-pixelart.ts # CLI entry point
├── web/                   # Next.js web application
│   ├── src/
│   │   ├── app/          # App router pages
│   │   ├── components/   # React components
│   │   └── hooks/        # Custom React hooks
│   └── public/           # Static assets
└── test/                 # Test files
```

## 🔧 API Reference

### ContourTracing

The main class for tracing pixel art contours.

```typescript
class ContourTracing {
  constructor(image: PNGImageData)
  traceContours(callback: (contour: Path, pixel: Pixel) => void): void
}
```

### PNGImageData

Wrapper for PNG image data with pixel comparison methods.

```typescript
class PNGImageData {
  constructor(png: PNG)
  comparePixels(y1: number, x1: number, y2: number, x2: number): boolean
  getPixel(y: number, x: number): Pixel
}
```

### SVG/PDF Formatters

Vector output formatters for different file formats.

```typescript
class SVG {
  constructor(height: number, width: number, pixelMultiplier?: number)
  header(): string
  path(contour: Path, pixel: Pixel): string
  footer(): string
}

class PDF {
  constructor(height: number, width: number, pixelMultiplier?: number)
  header(): string
  path(contour: Path, pixel: Pixel): string
  footer(): string
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the GNU General Public License v3.0 or later - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original algorithm by Sergii Zasenko
- Built with modern TypeScript and Next.js
- UI components powered by Radix UI and Tailwind CSS

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/sabraman/vectorize-pixelart/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/sabraman/vectorize-pixelart/discussions)
- 📧 **Email**: [sabraman@yandex.ru](mailto:sabraman@yandex.ru)

---

<div align="center">
  <p>
    <a href="https://github.com/sabraman/vectorize-pixelart">GitHub</a> •
    <a href="https://www.npmjs.com/package/vectorize-pixelart">npm</a> •
    <a href="https://vectorize-pixelart.vercel.app/">Web App</a>
  </p>
</div>
