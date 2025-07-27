import "~/styles/globals.css";

import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";

export const metadata: Metadata = {
	title: "Vectorize Pixel Art",
	description: "Convert pixel art PNG images to SVG or PDF vector graphics",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
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
			<body className="min-h-screen bg-background text-foreground antialiased">
				{children}
			</body>
		</html>
	);
}
