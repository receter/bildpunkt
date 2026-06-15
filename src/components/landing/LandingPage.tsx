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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      <div className="flex w-full max-w-4xl flex-col items-center px-6 py-12 text-center">
        {/* Large favicon as hero image */}
        <div className="mb-8">
          <img
            src={`${import.meta.env.BASE_URL}favicon.png`}
            alt="Bildpunkt logo"
            className="h-64 w-64 object-contain"
            style={{
              imageRendering: "pixelated",
            }}
          />
        </div>

        {/* Main heading */}
        <div className="mb-4">
          <h1 className="text-6xl font-bold text-white sm:text-7xl md:text-8xl">
            Bildpunkt
          </h1>
        </div>

        {/* Subtitle */}
        <div className="mb-12">
          <p className="text-xl text-neutral-300 sm:text-2xl md:text-3xl">
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
            <span className="relative z-10">Saved Projects</span>
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
