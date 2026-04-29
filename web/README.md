# Vectorize Pixelart Web

Next.js web interface for converting pixel art PNG files to SVG or PDF. Conversion runs in the browser.

## Requirements

- Node.js 18+
- Bun 1.3+

## Setup

```bash
git clone https://github.com/sabraman/vectorize-pixelart.git
cd vectorize-pixelart/web
bun install
```

## Development

```bash
bun run dev
```

The local app runs at `http://localhost:3000`.

## Commands

```bash
bun run check
bun run check:write
bun run typecheck
bun run test --run
bun run generate-favicon
```

The production scripts are available as:

```bash
bun run build
bun run start
bun run preview
```

## Features

- PNG file upload
- SVG export
- PDF export
- PNG upscaling
- Local browser processing
- Dynamic Open Graph image route
- PWA manifest and favicon assets

## Project Structure

```text
web/
├── __tests__/              # Vitest tests
├── public/                 # Static assets
├── scripts/                # Utility scripts
└── src/
    ├── app/                # Next.js App Router
    ├── components/         # React components
    ├── hooks/              # React hooks
    ├── lib/                # Shared utilities
    ├── styles/             # Global styles
    └── test/               # Test setup
```

## Configuration

Use `.env.local` for local environment values.

```env
NEXT_PUBLIC_GA_ID=your-ga-id
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Both variables are optional for the default app.

## Deployment

Deploy with the Vercel CLI:

```bash
bunx vercel@latest
bunx vercel@latest --prod
```

For other platforms, use the standard Next.js production flow for the target host.

## Favicons

Regenerate favicon assets from `public/favicon.svg`:

```bash
bun run generate-favicon
```

## Testing

```bash
bun run test --run
bun run test --coverage
bun run test drop-area.test.tsx
```

## License

This project uses the repository license. See [../LICENSE](../LICENSE).
