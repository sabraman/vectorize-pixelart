import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DropAreaWithPreview from "../src/components/drop-area-with preview";
import { useFileUpload } from "../src/hooks/use-file-upload";
import { useVectorize } from "../src/hooks/use-vectorize";

// Mock the modules
vi.mock("../src/hooks/use-file-upload");
vi.mock("../src/hooks/use-vectorize");

// Mock @nsmr/pixelart-react to avoid import issues
vi.mock("@nsmr/pixelart-react", () => ({
	ArrowUp: () => <div data-testid="arrow-up">ArrowUp</div>,
	Close: () => <div data-testid="close">Close</div>,
	Download: () => <div data-testid="download">Download</div>,
	File: () => <div data-testid="file">File</div>,
	Image: () => <div data-testid="image">Image</div>,
	Loader: () => <div data-testid="loader">Loader</div>,
	Minus: () => <div data-testid="minus">Minus</div>,
	Plus: () => <div data-testid="plus">Plus</div>,
	Upload: () => <div data-testid="upload">Upload</div>,
	WarningBox: () => <div data-testid="warning-box">WarningBox</div>,
}));

// Simplified mocks to avoid type errors
const mockFileUploadState = {
	files: [],
	isDragging: false,
	errors: [],
};

const mockFileUploadHandlers = {
	addFiles: vi.fn(),
	removeFile: vi.fn(),
	clearFiles: vi.fn(),
	clearErrors: vi.fn(),
	handleDragEnter: vi.fn(),
	handleDragLeave: vi.fn(),
	handleDragOver: vi.fn(),
	handleDrop: vi.fn(),
	handleFileChange: vi.fn(),
	openFileDialog: vi.fn(),
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
		expect(screen.getByText("DROP PNG HERE")).toBeDefined();
		expect(screen.getByText("or click to browse")).toBeDefined();
		expect(screen.getByText(/max.*2.*MB/)).toBeDefined();

		// Export button should not be visible initially
		expect(screen.queryByText("EXPORT VECTOR")).toBeNull();
	});

	it.skip("renders with a file preview when a file is provided", () => {
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
		expect(screen.getByText("EXPORT VECTOR")).toBeDefined();
	});

	it.skip("renders error messages when they occur", () => {
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

	it.skip("renders processing state when vectorizing", () => {
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
		expect(screen.getByText(/PROCESS \d+%/)).toBeDefined();
	});
});
