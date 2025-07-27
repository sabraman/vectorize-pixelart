import { describe, expect, it } from "vitest";
import { PDF, SVG } from "../src/lib/vectorize/utils";

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

describe("PDF Image Composer", () => {
	it("should create valid PDF header", () => {
		const pdf = new PDF(101, 102);
		const header = pdf.header();

		expect(header).toMatch(/%PDF-1.4/);
		expect(header).toContain("/Type /Catalog");
		expect(header).toContain("/MediaBox [0 0");
	});

	it("should create valid PDF path", () => {
		const pdf = new PDF(101, 102);
		const path = pdf.path(
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

		// PDF path method returns empty string as content is added to internal stream
		expect(path).toBe("");
	});

	it("should create valid PDF footer", () => {
		const pdf = new PDF(101, 102);
		const footer = pdf.footer();

		expect(footer).toMatch(/xref/);
		expect(footer).toMatch(/trailer/);
		expect(footer).toMatch(/%%EOF/);
	});
});
