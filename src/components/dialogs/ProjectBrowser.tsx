import { useEffect, useRef, useState } from "react";

import type { Project } from "../../types";

interface CardProps {
  project: Project;
  onOpen: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}

function ProjectCard({ project, onOpen, onRename, onDelete }: CardProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming) inputRef.current?.select();
  }, [isRenaming]);

  const savedDate = new Date(project.savedAt).toLocaleDateString();

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-neutral-700 p-3">
      <button
        className="w-full overflow-hidden rounded border border-neutral-600 bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-white"
        onClick={onOpen}
        aria-label={`Open ${project.name}`}
        title="Open project"
      >
        <img
          src={project.dataUrl}
          alt={project.name}
          width={project.size.width}
          height={project.size.height}
          className="h-24 w-full object-contain"
          style={{ imageRendering: "pixelated" }}
        />
      </button>

      {isRenaming ? (
        <input
          ref={inputRef}
          defaultValue={project.name}
          aria-label="Project name"
          className="w-full rounded bg-neutral-600 px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white"
          onBlur={(e) => {
            const name = e.target.value.trim() || project.name;
            onRename(name);
            setIsRenaming(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape") setIsRenaming(false);
          }}
        />
      ) : (
        <button
          className="truncate text-left text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-neutral-700"
          title="Double-click to rename"
          onDoubleClick={() => setIsRenaming(true)}
          onClick={onOpen}
        >
          {project.name}
        </button>
      )}

      <p className="text-xs text-neutral-400">{savedDate}</p>

      <div className="flex gap-2">
        <button
          onClick={onOpen}
          className="flex-1 rounded bg-white px-2 py-1 text-xs font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white"
        >
          Open
        </button>
        {confirmDelete ? (
          <div className="flex gap-1">
            <button
              onClick={onDelete}
              className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="rounded bg-neutral-600 px-2 py-1 text-xs text-white hover:bg-neutral-500 focus:outline-none focus:ring-2 focus:ring-white"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            aria-label={`Delete ${project.name}`}
            title="Delete project"
            className="rounded bg-neutral-600 px-2 py-1 text-xs text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-white"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

interface Props {
  projects: Project[];
  onOpen: (project: Project) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function ProjectBrowser({
  projects,
  onOpen,
  onRename,
  onDelete,
  onClose,
}: Props) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="browser-title"
        className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-neutral-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-700 px-6 py-4">
          <h2 id="browser-title" className="text-lg font-semibold text-white">
            Saved Projects
          </h2>
          <button
            onClick={onClose}
            aria-label="Close project browser"
            className="rounded p-1 text-neutral-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {projects.length === 0 ? (
            <p className="py-8 text-center text-neutral-500">
              No saved projects yet. Press Ctrl+S to save the current canvas.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {projects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onOpen={() => onOpen(p)}
                  onRename={(name) => onRename(p.id, name)}
                  onDelete={() => onDelete(p.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
