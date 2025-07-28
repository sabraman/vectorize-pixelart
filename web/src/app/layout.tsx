import "~/styles/globals.css";

import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";

export const metadata: Metadata = {
	title: "Vectorize Pixelart - Convert Pixel Art to Vector Graphics",
	description: "Free online tool to convert pixel art PNG images to clean SVG and PDF vector graphics. Perfect for game developers, artists, and designers. 100% local processing, no uploads required.",
	keywords: [
		"pixel art",
		"vector graphics",
		"svg converter",
		"pdf converter",
		"pixel art to vector",
		"game development",
		"digital art",
		"vectorization",
		"contour tracing",
		"web tool",
		"free converter",
	],
	authors: [{ name: "Vectorize Pixelart" }],
	creator: "Vectorize Pixelart",
	publisher: "Vectorize Pixelart",
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://vectorize-pixelart.vercel.app",
		title: "Vectorize Pixelart - Convert Pixel Art to Vector Graphics",
		description: "Free online tool to convert pixel art PNG images to clean SVG and PDF vector graphics. Perfect for game developers, artists, and designers.",
		siteName: "Vectorize Pixelart",
		images: [
			{
				url: "/api/og",
				width: 1200,
				height: 630,
				alt: "Vectorize Pixelart - Convert pixel art to vector graphics",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Vectorize Pixelart - Convert Pixel Art to Vector Graphics",
		description: "Free online tool to convert pixel art PNG images to clean SVG and PDF vector graphics. Perfect for game developers, artists, and designers.",
		images: ["/api/og"],
		creator: "@vectorize_pixelart",
	},
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
		],
		apple: [
			{ url: "/favicon-180x180.png", sizes: "180x180", type: "image/png" },
		],
		other: [
			{ url: "/favicon.svg", type: "image/svg+xml" },
		],
	},
	manifest: "/site.webmanifest",
	other: {
		"msapplication-TileColor": "#FF197C",
		"theme-color": "#FF197C",
		"apple-mobile-web-app-capable": "yes",
		"apple-mobile-web-app-status-bar-style": "default",
		"apple-mobile-web-app-title": "Vectorize Pixelart",
	},
	verification: {
		google: "your-google-verification-code", // Add your Google Search Console verification code
	},
};

const pixelFont = Press_Start_2P({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-pixel",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${pixelFont.variable} dark`}>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
			</head>
			<body className="min-h-screen bg-background text-foreground antialiased">
				{children}
			</body>
		</html>
	);
}
