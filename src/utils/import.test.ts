import { describe, expect, it } from "vitest";

import { dataUrlToFile } from "./import";

describe("dataUrlToFile", () => {
  it("creates a File with the correct filename", () => {
    const file = dataUrlToFile("data:image/png;base64,iVBORw0KGgo=", "art.png");
    expect(file.name).toBe("art.png");
  });

  it("infers the MIME type from the data URL header", () => {
    const file = dataUrlToFile("data:image/png;base64,iVBORw0KGgo=", "art.png");
    expect(file.type).toBe("image/png");
  });

  it("infers image/jpeg for jpeg data URLs", () => {
    const file = dataUrlToFile("data:image/jpeg;base64,/9j/4AA=", "photo.jpg");
    expect(file.type).toBe("image/jpeg");
  });

  it("falls back to image/png when MIME type is missing", () => {
    const file = dataUrlToFile("data:,abc");
    expect(file.type).toBe("image/png");
  });

  it("uses image.png as default filename when omitted", () => {
    const file = dataUrlToFile("data:image/png;base64,abc");
    expect(file.name).toBe("image.png");
  });

  it("produces a non-empty file for valid base64 data", () => {
    // minimal 1×1 transparent PNG
    const b64 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const file = dataUrlToFile(`data:image/png;base64,${b64}`, "pixel.png");
    expect(file.size).toBeGreaterThan(0);
  });
});
