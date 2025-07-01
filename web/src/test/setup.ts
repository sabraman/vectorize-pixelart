import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

// Runs a cleanup after each test case
afterEach(() => {
	cleanup();
});
