import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { PixelCanvas } from "./components/canvas/PixelCanvas";
import { HelpDialog } from "./components/dialogs/HelpDialog";
import { NewCanvasDialog } from "./components/dialogs/NewCanvasDialog";
import { ProjectBrowser } from "./components/dialogs/ProjectBrowser";
import { LandingPage } from "./components/landing/LandingPage";
import { AppShell } from "./components/layout/AppShell";
import { Sidebar } from "./components/layout/Sidebar";
import { Toolbar } from "./components/layout/Toolbar";
import { StatusBar } from "./components/ui/StatusBar";
import { Toast } from "./components/ui/Toast";
import { useEditor } from "./hooks/useEditor";
import { useHistory } from "./hooks/useHistory";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useStorage } from "./hooks/useStorage";
import { useToast } from "./hooks/useToast";
import type { CanvasSize, PixelBuffer, Project } from "./types";
import { bufferToDataUrl, exportAsPng } from "./utils/export";
import { floodFill } from "./utils/fill";
import { dataUrlToFile, importImageFile } from "./utils/import";
import {
  cloneBuffer,
  createBuffer,
  getPixel,
  setPixel,
} from "./utils/pixelBuffer";

const TRANSPARENT = { r: 0, g: 0, b: 0, a: 0 } as const;

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const editor = useEditor();
  const storage = useStorage();
  const { message: toastMessage, showToast } = useToast();

  const [newCanvasOpen, setNewCanvasOpen] = useState(false);
  const [browserOpen, setBrowserOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("Untitled");
  const [isDirty, setIsDirty] = useState(false);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [isFirstEntry, setIsFirstEntry] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // History holds committed snapshots. current = last committed state.
  const [initialBuffer] = useState(() => createBuffer(editor.state.canvasSize));
  const history = useHistory(initialBuffer);

  // Working buffer: what the canvas renders. Accumulates pixels during a stroke.
  const workingRef = useRef<PixelBuffer>(history.current);
  const [displayBuffer, setDisplayBuffer] = useState<PixelBuffer>(
    history.current,
  );

  const updateBuffer = useCallback((next: PixelBuffer) => {
    workingRef.current = next;
    setDisplayBuffer(next);
  }, []);

  // Sync display before paint after undo/redo/reset to avoid visible flash.
  const { current: committedBuffer, commit: historyCommit } = history;
  const committedRef = useRef<PixelBuffer>(committedBuffer);
  useLayoutEffect(() => {
    if (committedBuffer !== committedRef.current) {
      committedRef.current = committedBuffer;
      workingRef.current = committedBuffer;
      setDisplayBuffer(committedBuffer);
    }
  }, [committedBuffer]);

  // Wrap commit to also mark the canvas dirty.
  const commitHistory = useCallback(
    (buf: PixelBuffer) => {
      historyCommit(buf);
      setIsDirty(true);
    },
    [historyCommit],
  );

  function handleDraw(x: number, y: number) {
    const { tool, primaryColor, canvasSize } = editor.state;

    if (tool === "picker") {
      const picked = getPixel(workingRef.current, x, y, canvasSize.width);
      if (picked.a > 0) editor.setColor(picked);
      return;
    }

    if (tool === "fill") {
      const filled = floodFill(
        workingRef.current,
        x,
        y,
        primaryColor,
        canvasSize,
      );
      commitHistory(filled);
      updateBuffer(filled);
      return;
    }

    const next = cloneBuffer(workingRef.current);
    if (tool === "pencil") setPixel(next, x, y, canvasSize.width, primaryColor);
    if (tool === "eraser") setPixel(next, x, y, canvasSize.width, TRANSPARENT);
    updateBuffer(next);
  }

  function handleCommit() {
    const { tool } = editor.state;
    if (tool === "picker" || tool === "fill") return;
    commitHistory(workingRef.current);
  }

  function handleClear() {
    const blank = createBuffer(editor.state.canvasSize);
    commitHistory(blank);
    updateBuffer(blank);
  }

  function handleNewCanvas(size: CanvasSize) {
    editor.setCanvasSize(size);
    const blank = createBuffer(size);
    history.reset(blank);
    workingRef.current = blank;
    setDisplayBuffer(blank);
    setCurrentProjectId(null);
    setProjectName("Untitled");
    setIsDirty(false);
    setNewCanvasOpen(false);
    setIsFirstEntry(true);
    setCanvasKey((k) => k + 1);
    navigate("/editor");
  }

  // Landing page actions
  function handleLandingNewCanvas() {
    setNewCanvasOpen(true);
  }

  function handleLandingOpenProject() {
    setBrowserOpen(true);
  }

  async function handleLandingImportImage(file: File) {
    try {
      const buf = await importImageFile(file, editor.state.canvasSize);
      commitHistory(buf);
      updateBuffer(buf);
      navigate("/editor");
      showToast("Image imported");
    } catch {
      showToast("Failed to import image");
    }
  }

  // ── Save / Export ──────────────────────────────────────────────────────────

  function handleSave() {
    const project: Project = {
      id: currentProjectId ?? crypto.randomUUID(),
      name: projectName.trim() || "Untitled",
      size: editor.state.canvasSize,
      dataUrl: bufferToDataUrl(history.current, editor.state.canvasSize),
      savedAt: Date.now(),
    };
    storage.save(project);
    setCurrentProjectId(project.id);
    setIsDirty(false);
    showToast("Project saved");
  }

  function handleExportPng() {
    exportAsPng(
      history.current,
      editor.state.canvasSize,
      projectName || "bildpunkt",
    );
    showToast("PNG downloaded");
  }

  // ── Import ─────────────────────────────────────────────────────────────────

  async function handleImportFile(file: File) {
    try {
      const buf = await importImageFile(file, editor.state.canvasSize);
      commitHistory(buf);
      updateBuffer(buf);
      showToast("Image imported");
    } catch {
      showToast("Failed to import image");
    }
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleImportFile(file);
    e.target.value = "";
  }

  // ── Open project ───────────────────────────────────────────────────────────

  async function handleOpenProject(project: Project) {
    try {
      const file = dataUrlToFile(project.dataUrl, `${project.name}.png`);
      const buf = await importImageFile(file, project.size);
      editor.setCanvasSize(project.size);
      history.reset(buf);
      updateBuffer(buf);
      setCurrentProjectId(project.id);
      setProjectName(project.name);
      setIsDirty(false);
      setBrowserOpen(false);
      setCanvasKey((k) => k + 1);
      navigate("/editor");
    } catch {
      showToast("Failed to open project");
    }
  }

  // ── First entry pulse animation timeout ────────────────────────────────────

  useEffect(() => {
    if (isFirstEntry) {
      // Pulse animation runs for ~4.5s (1.5s × 3), turn off after 5s
      const timer = setTimeout(() => setIsFirstEntry(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isFirstEntry]);

  // ── Clipboard paste ────────────────────────────────────────────────────────

  useEffect(() => {
    async function onPaste(e: ClipboardEvent) {
      const items = Array.from(e.clipboardData?.items ?? []);
      const imageItem = items.find((item) => item.type.startsWith("image/"));
      if (!imageItem) return;
      const file = imageItem.getAsFile();
      if (!file) return;
      try {
        const buf = await importImageFile(file, editor.state.canvasSize);
        historyCommit(buf);
        setIsDirty(true);
        updateBuffer(buf);
        showToast("Image pasted from clipboard");
      } catch {
        showToast("Failed to paste image");
      }
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [editor.state.canvasSize, historyCommit, showToast, updateBuffer]);

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────

  const isEditor = location.pathname.startsWith("/editor");

  useKeyboardShortcuts(
    isEditor
      ? {
          p: () => editor.setTool("pencil"),
          e: () => editor.setTool("eraser"),
          f: () => editor.setTool("fill"),
          k: () => editor.setTool("picker"),
          g: () => editor.toggleGrid(),
          "=": () => editor.setZoom(editor.state.zoom + 2),
          "+": () => editor.setZoom(editor.state.zoom + 2),
          "-": () => editor.setZoom(editor.state.zoom - 2),
          "Ctrl+z": () => history.undo(),
          "Ctrl+y": () => history.redo(),
          "Ctrl+Shift+Z": () => history.redo(),
          "Ctrl+n": () => setNewCanvasOpen(true),
          "Ctrl+s": handleSave,
          "Ctrl+o": () => setBrowserOpen(true),
          "Ctrl+Shift+S": handleExportPng,
          "?": () => setHelpOpen((v) => !v),
        }
      : {},
  );

  const canvasAriaLabel = `${editor.state.canvasSize.width}×${editor.state.canvasSize.height} pixel canvas — ${projectName}`;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <LandingPage
              onNewCanvas={handleLandingNewCanvas}
              onOpenProject={handleLandingOpenProject}
              onImportImage={handleLandingImportImage}
            />

            {newCanvasOpen && (
              <NewCanvasDialog
                onConfirm={handleNewCanvas}
                onCancel={() => setNewCanvasOpen(false)}
              />
            )}

            {browserOpen && (
              <ProjectBrowser
                projects={storage.projects}
                onOpen={(p) => void handleOpenProject(p)}
                onRename={storage.rename}
                onDelete={storage.remove}
                onClose={() => setBrowserOpen(false)}
              />
            )}

            <Toast message={toastMessage} />
          </>
        }
      />

      <Route
        path="/editor"
        element={
          <>
            {/* Small-screen message */}
            <div className="flex h-screen items-center justify-center bg-neutral-900 px-6 md:hidden">
              <p className="max-w-xs text-center text-sm text-neutral-400">
                Bildpunkt works best on desktop. Please open it on a larger
                screen.
              </p>
            </div>

            {/* Main application — desktop+ */}
            <div className="hidden h-screen w-screen md:block">
              <AppShell
                toolbar={
                  <Toolbar
                    tool={editor.state.tool}
                    zoom={editor.state.zoom}
                    showGrid={editor.state.showGrid}
                    canUndo={history.canUndo}
                    canRedo={history.canRedo}
                    showPencilPulse={isFirstEntry}
                    onNew={() => setNewCanvasOpen(true)}
                    onClear={handleClear}
                    onSetTool={editor.setTool}
                    onZoomIn={() => editor.setZoom(editor.state.zoom + 2)}
                    onZoomOut={() => editor.setZoom(editor.state.zoom - 2)}
                    onToggleGrid={editor.toggleGrid}
                    onUndo={history.undo}
                    onRedo={history.redo}
                    onHelp={() => setHelpOpen((v) => !v)}
                  />
                }
                canvas={
                  <PixelCanvas
                    key={canvasKey}
                    buffer={displayBuffer}
                    size={editor.state.canvasSize}
                    zoom={editor.state.zoom}
                    showGrid={editor.state.showGrid}
                    ariaLabel={canvasAriaLabel}
                    onDraw={handleDraw}
                    onCommit={handleCommit}
                    onHover={setHoverPos}
                  />
                }
                statusBar={
                  <StatusBar
                    hoverPos={hoverPos}
                    size={editor.state.canvasSize}
                    zoom={editor.state.zoom}
                    tool={editor.state.tool}
                    isDirty={isDirty}
                  />
                }
                sidebar={
                  <Sidebar
                    size={editor.state.canvasSize}
                    primaryColor={editor.state.primaryColor}
                    projectName={projectName}
                    isDirty={isDirty}
                    onColorChange={editor.setColor}
                    onSave={handleSave}
                    onExportPng={handleExportPng}
                    onImportImage={() => fileInputRef.current?.click()}
                    onOpenBrowser={() => setBrowserOpen(true)}
                    onRenameProject={setProjectName}
                  />
                }
              />
            </div>

            {/* Hidden file input for import */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              aria-hidden="true"
              tabIndex={-1}
              onChange={handleFileInputChange}
            />

            {newCanvasOpen && (
              <NewCanvasDialog
                onConfirm={handleNewCanvas}
                onCancel={() => setNewCanvasOpen(false)}
              />
            )}

            {browserOpen && (
              <ProjectBrowser
                projects={storage.projects}
                onOpen={(p) => void handleOpenProject(p)}
                onRename={storage.rename}
                onDelete={storage.remove}
                onClose={() => setBrowserOpen(false)}
              />
            )}

            {helpOpen && <HelpDialog onClose={() => setHelpOpen(false)} />}

            <Toast message={toastMessage} />
          </>
        }
      />
    </Routes>
  );
}
