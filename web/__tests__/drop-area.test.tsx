import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DropAreaWithPreview from "../src/components/drop-area-with preview";
import { useFileUpload } from "../src/hooks/use-file-upload";
import { useVectorize } from "../src/hooks/use-vectorize";

// Mock the modules
vi.mock("../src/hooks/use-file-upload");
vi.mock("../src/hooks/use-vectorize");

// Simplified mocks to avoid type errors
const mockFileUploadState = {
	files: [],
	isDragging: false,
	errors: [],
};

const mockFileUploadHandlers = {
	handleDragEnter: vi.fn(),
	handleDragLeave: vi.fn(),
	handleDragOver: vi.fn(),
	handleDrop: vi.fn(),
	openFileDialog: vi.fn(),
	removeFile: vi.fn(),
	getInputProps: vi.fn().mockReturnValue({ accept: "image/png", type: "file" }),
};

describe("DropAreaWithPreview Component", () => {
	beforeEach(() => {
		// Default mocks
		vi.mocked(useFileUpload).mockReturnValue([
			mockFileUploadState,
			mockFileUploadHandlers,
		]);

		vi.mocked(useVectorize).mockReturnValue({
			vectorizeImage: vi.fn().mockResolvedValue("<svg></svg>"),
			isProcessing: false,
			error: null,
		});
	});

	it("renders the component with initial state", () => {
		render(<DropAreaWithPreview />);

		// Check for main UI elements
		expect(screen.getByText("Drop your pixel art image here")).toBeDefined();
		expect(screen.getByText(/PNG images only/)).toBeDefined();
		expect(screen.getByText("Select image")).toBeDefined();

		// Export button should not be visible initially
		expect(screen.queryByText("Export")).toBeNull();
	});

	it("renders with a file preview when a file is provided", () => {
		// Mock the useFileUpload hook to return a file for this test
		vi.mocked(useFileUpload).mockReturnValueOnce([
			{
				...mockFileUploadState,
				files: [
					{
						id: "1",
						file: new File([], "test.png"),
						preview: "data:image/png;base64,test",
					},
				],
			},
			mockFileUploadHandlers,
		]);

		render(<DropAreaWithPreview />);

		// Image should be rendered
		const img = screen.getByAltText("test.png");
		expect(img).toBeDefined();
		expect(img.getAttribute("src")).toBe("data:image/png;base64,test");

		// Export button should be visible
		expect(screen.getByText("Export")).toBeDefined();
	});

	it("renders error messages when they occur", () => {
		// Mock the useFileUpload hook to return an error for this test
		vi.mocked(useFileUpload).mockReturnValueOnce([
			{
				...mockFileUploadState,
				errors: ["File is too large"],
			},
			mockFileUploadHandlers,
		]);

		render(<DropAreaWithPreview />);

		// Error message should be rendered
		expect(screen.getByText("File is too large")).toBeDefined();
	});

	it("renders processing state when vectorizing", () => {
		// Mock the useFileUpload hook to return a file for this test
		vi.mocked(useFileUpload).mockReturnValueOnce([
			{
				...mockFileUploadState,
				files: [
					{
						id: "1",
						file: new File([], "test.png"),
						preview: "data:image/png;base64,test",
					},
				],
			},
			mockFileUploadHandlers,
		]);

		// Mock the useVectorize hook to return isProcessing = true for this test
		vi.mocked(useVectorize).mockReturnValueOnce({
			vectorizeImage: vi.fn().mockResolvedValue("<svg></svg>"),
			isProcessing: true,
			error: null,
		});

		render(<DropAreaWithPreview />);

		// Processing text should be visible
		expect(screen.getByText("Processing...")).toBeDefined();
	});
});
