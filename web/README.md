# Vectorize Pixelart - Web Interface

Web interface for converting pixel art to vector formats (SVG and PDF).

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

## ✨ Features

- **🖼️ Image Upload** - Drag & drop PNG files or select via dialog
- **⚡ Instant Conversion** - 100% local processing, no server uploads
- **📄 Two Formats** - Export to SVG (for web) and PDF (for print)
- **📱 Responsive Design** - Works on all devices
- **🎨 Modern UI** - Beautiful and intuitive interface

## 🛠️ Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Full type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Vitest** - Testing
- **PNGJS** - PNG image processing

## 📁 Project Structure

```
web/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   │   └── ui/             # shadcn/ui components
│   ├── hooks/              # React hooks
│   ├── lib/                # Utilities and libraries
│   │   └── vectorize/      # Vectorization logic
│   └── styles/             # Global styles
├── __tests__/              # Tests
└── public/                 # Static files
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode (use --watch flag)
pnpm test --watch

# Run tests with coverage (use --coverage flag)
pnpm test --coverage
```

## 🚀 Deployment

The application is ready to deploy on:

- **Vercel** - Recommended for Next.js
- **Netlify** - Alternative option
- **Docker** - For containerization

## 🔧 Development

### Adding New Components

```bash
# Create a new component
pnpm dlx shadcn@latest add button
```

### Vectorization Structure

The main vectorization logic is located in `src/lib/vectorize/`:

- `contour-tracing.ts` - Contour tracing algorithm
- `utils.ts` - SVG and PDF formatters

### Adding New Formats

1. Create a new class in `utils.ts` that extends `Image`
2. Implement `header()`, `footer()`, `path()` methods
3. Add support in `use-vectorize.ts`

## 📄 License

MIT License - see [LICENSE](../LICENSE) in the project root.
