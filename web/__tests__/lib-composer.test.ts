import { describe, expect, it } from "vitest";
import { EPS, SVG } from "../src/lib/vectorize/utils";

describe("SVG Image Composer", () => {
	it("should create valid SVG header", () => {
		const svg = new SVG(101, 102);
		const header = svg.header();

		expect(header).toMatch(/<svg/);
		expect(header).toContain('width="102"');
		expect(header).toContain('height="101"');
	});

	it("should create valid SVG path", () => {
		const svg = new SVG(101, 102);
		const path = svg.path(
			[
				[0, 0],
				[10, 0],
				[10, 1],
				[1, 1],
				[2, 1],
				[2, 0],
			],
			[0, 0, 0, 0],
		);

		expect(path).toMatch(/<path/);
	});

	it("should create valid SVG footer", () => {
		const svg = new SVG(101, 102);
		const footer = svg.footer();

		expect(footer).toMatch(/<\/svg>/);
	});
});

describe("EPS Image Composer", () => {
	it("should create valid EPS header", () => {
		const eps = new EPS(101, 102);
		const header = eps.header();

		expect(header).toMatch(/%!PS-Adobe-3.0 EPSF-3.0/);
		expect(header).toContain("%%BoundingBox: 0 0");
	});

	it("should create valid EPS path", () => {
		const eps = new EPS(101, 102);
		const path = eps.path(
			[
				[0, 0],
				[10, 0],
				[10, 1],
				[1, 1],
				[2, 1],
				[2, 0],
			],
			[0, 0, 0, 0],
		);

		// Test for color setting, line commands, and fill
		expect(path).toMatch(/rg/);
		expect(path).toMatch(/m/); // moveto
		expect(path).toMatch(/l/); // lineto
	});

	it("should create valid EPS footer", () => {
		const eps = new EPS(101, 102);
		const footer = eps.footer();

		expect(footer).toMatch(/%%EOF/);
	});
});
