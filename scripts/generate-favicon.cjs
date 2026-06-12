#!/usr/bin/env node

/**
 * Generate a 32x32 pixel art favicon for Bildpunkt
 * Creates a stylized 'B' in a colored square
 */

const fs = require("fs");
const path = require("path");

// Check if we're in Node.js environment (for canvas support)
let Canvas, createCanvas;
try {
  ({ Canvas, createCanvas } = require("canvas"));
} catch (e) {
  console.error("canvas package not found. Installing...");
  require("child_process").execSync("npm install canvas", { stdio: "inherit" });
  ({ Canvas, createCanvas } = require("canvas"));
}

const SIZE = 32;
const OUTPUT_PATH = path.join(__dirname, "../public/favicon.png");

// Color palette
const BACKGROUND = "#1a1a1a"; // Dark background
const ACCENT = "#3b82f6"; // Blue accent (Tailwind blue-500)
const PIXEL = "#ffffff"; // White pixels for the 'B'

function generateFavicon() {
  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext("2d");

  // Fill background
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Add a subtle border/frame effect
  ctx.fillStyle = ACCENT;
  ctx.fillRect(0, 0, SIZE, 2); // top
  ctx.fillRect(0, 0, 2, SIZE); // left
  ctx.fillRect(SIZE - 2, 0, 2, SIZE); // right
  ctx.fillRect(0, SIZE - 2, SIZE, 2); // bottom

  // Disable anti-aliasing for pixel-perfect rendering
  ctx.imageSmoothingEnabled = false;

  // Draw a pixelated 'B' in the center
  // Each pixel is 2x2 for visibility at small size
  const pixelSize = 2;
  const startX = 8; // Center the letter
  const startY = 6;

  // B letter pattern (12x20 pixels, scaled down to fit)
  const bPattern = [
    "111111",
    "1    1",
    "1    1",
    "1    1",
    "11111 ",
    "11111 ",
    "1    1",
    "1    1",
    "1    1",
    "111111",
  ];

  ctx.fillStyle = PIXEL;

  for (let y = 0; y < bPattern.length; y++) {
    for (let x = 0; x < bPattern[y].length; x++) {
      if (bPattern[y][x] === "1") {
        ctx.fillRect(
          startX + x * pixelSize,
          startY + y * pixelSize,
          pixelSize,
          pixelSize,
        );
      }
    }
  }

  // Save to file
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(OUTPUT_PATH, buffer);

  console.log(`✓ Generated favicon: ${OUTPUT_PATH}`);
  console.log(`  Size: ${SIZE}x${SIZE}px`);
  console.log(
    `  File size: ${Math.round((buffer.length / 1024) * 100) / 100}KB`,
  );
}

// Run the generation
try {
  generateFavicon();
} catch (error) {
  console.error("Failed to generate favicon:", error.message);
  process.exit(1);
}
