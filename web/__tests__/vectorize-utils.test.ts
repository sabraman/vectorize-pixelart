import { describe, expect, it } from "vitest";
import { PDF, SVG } from "../src/lib/vectorize/utils";

describe("SVG Image Composer", () => {
	it("should create valid SVG header", () => {
		const svg = new SVG(100, 200, 2);
		const header = svg.header();

		expect(header).toContain('<svg width="400" height="200"');
		expect(header).toContain('xmlns="http://www.w3.org/2000/svg"');
	});

	it("should create valid SVG path", () => {
		const svg = new SVG(100, 100);
		const path = svg.path(
			[
				[10, 10],
				[20, 10],
				[20, 20],
				[10, 20],
			],
			[255, 0, 0, 255],
		);

		expect(path).toContain('<path d="M 10 10');
		expect(path).toContain('style="fill:rgba(255, 0, 0, 255)"');
	});

	it("should return empty string for empty contour", () => {
		const svg = new SVG(100, 100);
		const path = svg.path([], [255, 0, 0, 255]);

		expect(path).toBe("");
	});

	it("should create valid SVG footer", () => {
		const svg = new SVG(100, 100);
		const footer = svg.footer();

		expect(footer).toBe("</svg>\n");
	});
});

describe("PDF Image Composer", () => {
	it("should create valid PDF header", () => {
		const pdf = new PDF(100, 200, 1.5);
		const header = pdf.header();

		expect(header).toContain("%PDF-1.4");
		expect(header).toContain("/Type /Catalog");
		expect(header).toContain("/MediaBox [0 0 300 150]");
	});

	it("should create valid PDF path", () => {
		const pdf = new PDF(100, 100);
		const path = pdf.path(
			[
				[10, 10],
				[20, 10],
				[20, 20],
				[10, 20],
			],
			[255, 0, 0, 255],
		);

		expect(path).toBe("");
	});

	it("should return empty string for empty contour", () => {
		const pdf = new PDF(100, 100);
		const path = pdf.path([], [255, 0, 0, 255]);

		expect(path).toBe("");
	});

	it("should create valid PDF footer", () => {
		const pdf = new PDF(100, 100);
		const footer = pdf.footer();

		expect(footer).toContain("xref");
		expect(footer).toContain("trailer");
		expect(footer).toContain("%%EOF");
	});
});
