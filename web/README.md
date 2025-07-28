# Vectorize Pixelart - Web Interface

A modern web application for converting pixel art PNG images to clean SVG and PDF vector graphics. Built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

- **Drag & Drop Interface**: Easy file upload with drag-and-drop support
- **Multiple Output Formats**: Convert to SVG (web-ready) or PDF (print-ready)
- **100% Local Processing**: No files uploaded to servers - everything happens in your browser
- **Real-time Preview**: See your vectorized image before downloading
- **Mobile Responsive**: Works perfectly on all devices
- **PWA Support**: Install as a web app on mobile devices
- **SEO Optimized**: Complete meta tags, Open Graph, and social media optimization

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/vectorize-pixelart.git
cd vectorize-pixelart/web

# Install dependencies
pnpm install

# Generate favicons (optional)
pnpm generate-favicon

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Preview production build
pnpm preview

# Run tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage

# Type checking
pnpm typecheck

# Linting and formatting
pnpm check
pnpm check:write
```

## 📁 Project Structure

```
web/
├── public/                 # Static assets
│   ├── favicon.ico        # Generated favicon
│   ├── favicon-*.png      # Various favicon sizes
│   ├── favicon.svg        # Original SVG favicon
│   ├── robots.txt         # SEO robots file
│   ├── sitemap.xml        # SEO sitemap
│   └── site.webmanifest   # PWA manifest
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/           # API routes
│   │   │   └── og/        # Open Graph image generation
│   │   ├── layout.tsx     # Root layout with SEO metadata
│   │   └── page.tsx       # Home page
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   └── styles/            # Global styles
├── scripts/
│   └── generate-favicon.js # Favicon generation script
└── __tests__/             # Test files
```

## 🎨 SEO & Social Media Features

### Open Graph Images
- Dynamic OG image generation at `/api/og`
- Optimized for social media sharing (1200x630px)
- Branded design with your app's colors and logo

### Meta Tags
- Comprehensive SEO metadata
- Twitter Card support
- PWA manifest for mobile installation
- Structured data for better search visibility

### Favicons
- Multiple sizes: 16x16, 32x32, 48x48, 128x128, 256x256
- ICO format for maximum compatibility
- SVG version for modern browsers
- Apple touch icons for iOS devices

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
   ```bash
   # Install Vercel CLI
   pnpm dlx vercel@latest

   # Deploy to Vercel
   pnpm dlx vercel@latest --prod
   ```

2. **Environment Variables** (if needed)
   - No environment variables required for basic functionality
   - Add Google Analytics or other tracking codes as needed

3. **Custom Domain** (optional)
   - Configure in Vercel dashboard
   - Update `robots.txt` and `sitemap.xml` with your domain

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- **Netlify**: Use `next build && next export`
- **Railway**: Direct deployment from GitHub
- **DigitalOcean App Platform**: Container deployment
- **AWS Amplify**: Full-stack deployment

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
# Optional: Google Analytics
NEXT_PUBLIC_GA_ID=your-ga-id

# Optional: Custom domain for OG images
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### SEO Customization

Update `src/app/layout.tsx` to customize:

- Site title and description
- Open Graph images
- Twitter Card settings
- Favicon paths
- Google Search Console verification

### Favicon Generation

To regenerate favicons from your SVG:

```bash
pnpm generate-favicon
```

This creates:
- `favicon.ico` (ICO format)
- `favicon-16x16.png` through `favicon-256x256.png`
- Updates `site.webmanifest` with new icons

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage

# Run specific test file
pnpm test drop-area.test.tsx
```

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for all metrics
- **Bundle Size**: <200KB gzipped
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s

## 🔍 SEO Checklist

- ✅ Meta tags optimized
- ✅ Open Graph images
- ✅ Twitter Cards
- ✅ Structured data
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Favicons (multiple sizes)
- ✅ PWA manifest
- ✅ Mobile responsive
- ✅ Fast loading times
- ✅ Accessible design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [@nsmr/pixelart-react](https://www.npmjs.com/package/@nsmr/pixelart-react)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Testing with [Vitest](https://vitest.dev/)

---

**Live Demo**: [https://vectorize-pixelart.vercel.app](https://vectorize-pixelart.vercel.app)

**NPM Package**: [vectorize-pixelart](https://www.npmjs.com/package/vectorize-pixelart)
