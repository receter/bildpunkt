interface LandingPageProps {
  onNewCanvas: () => void;
  onOpenProject: () => void;
  onImportImage: (file: File) => void;
}

export function LandingPage({
  onNewCanvas,
  onOpenProject,
  onImportImage,
}: LandingPageProps) {
  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onImportImage(file);
    }
    // Reset input for repeated imports of same file
    e.target.value = "";
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Pixel grid background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "16px 16px",
        }}
      />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-6 py-12 text-center">
        {/* Inline SVG pixel-art logo */}
        <div className="mb-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64"
            role="img"
            aria-label="Bildpunkt pixel art logo"
            style={{ imageRendering: "pixelated" }}
          >
            <rect width="32" height="32" fill="transparent" />
            {/* Stylized "B" pixel art */}
            <rect x="8" y="6" width="2" height="20" fill="#3b82f6" />
            <rect x="10" y="6" width="8" height="2" fill="#3b82f6" />
            <rect x="18" y="8" width="2" height="4" fill="#3b82f6" />
            <rect x="10" y="12" width="8" height="2" fill="#3b82f6" />
            <rect x="18" y="14" width="2" height="4" fill="#3b82f6" />
            <rect x="10" y="18" width="8" height="2" fill="#3b82f6" />
            <rect x="18" y="20" width="2" height="4" fill="#3b82f6" />
            <rect x="10" y="24" width="8" height="2" fill="#3b82f6" />
            {/* Pixel accent dots */}
            <rect x="22" y="10" width="2" height="2" fill="#60a5fa" />
            <rect x="22" y="16" width="2" height="2" fill="#60a5fa" />
            <rect x="22" y="22" width="2" height="2" fill="#60a5fa" />
          </svg>
        </div>

        {/* Main heading with better hierarchy */}
        <div className="mb-6">
          <h1 className="bg-gradient-to-br from-white via-neutral-100 to-neutral-300 bg-clip-text text-7xl font-black tracking-tight text-transparent sm:text-8xl md:text-9xl">
            Bildpunkt
          </h1>
        </div>

        {/* Subtitle with improved typography */}
        <div className="mb-14">
          <p className="text-2xl font-medium tracking-wide text-neutral-400 sm:text-3xl md:text-4xl">
            Online Pixel Art Editor
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <button
            onClick={onNewCanvas}
            className="group relative overflow-hidden rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900 active:scale-95"
          >
            <span className="relative z-10">New Canvas</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 transition-opacity duration-200 group-hover:opacity-20" />
          </button>

          <button
            onClick={onOpenProject}
            className="group relative overflow-hidden rounded-lg border-2 border-neutral-600 bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:border-neutral-500 hover:bg-neutral-800 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-neutral-900 active:scale-95"
          >
            <span className="relative z-10">Open Project</span>
          </button>

          <label className="group relative cursor-pointer overflow-hidden rounded-lg border-2 border-neutral-600 bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:border-neutral-500 hover:bg-neutral-800 hover:shadow-xl focus-within:ring-2 focus-within:ring-neutral-500 focus-within:ring-offset-2 focus-within:ring-offset-neutral-900 active:scale-95">
            <span className="relative z-10">Import Image</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp"
              className="sr-only"
              onChange={handleFileInputChange}
            />
          </label>
        </div>

        {/* Feature hints */}
        <div className="mt-16 max-w-2xl">
          <p className="text-sm text-neutral-500 sm:text-base">
            Create pixel art with drawing tools, save projects locally, and
            export as PNG files. No account required — everything stays in your
            browser.
          </p>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-8">
          <p className="text-xs text-neutral-600">
            Press{" "}
            <kbd className="rounded bg-neutral-800 px-1.5 py-0.5 text-neutral-400">
              ?
            </kbd>{" "}
            for keyboard shortcuts once in the editor
          </p>
        </div>
      </div>
    </div>
  );
}
