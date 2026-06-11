import type { Project, ProjectIndex } from "../types";

const NS = "bildpunkt";
const INDEX_KEY = `${NS}:index`;
const projectKey = (id: string) => `${NS}:project:${id}`;

export function readIndex(): ProjectIndex {
  try {
    return (
      (JSON.parse(
        localStorage.getItem(INDEX_KEY) ?? "null",
      ) as ProjectIndex) ?? {
        ids: [],
      }
    );
  } catch {
    return { ids: [] };
  }
}

function writeIndex(index: ProjectIndex): void {
  localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

export function readProject(id: string): Project | null {
  try {
    return JSON.parse(
      localStorage.getItem(projectKey(id)) ?? "null",
    ) as Project | null;
  } catch {
    return null;
  }
}

export function saveProject(project: Project): void {
  const index = readIndex();
  if (!index.ids.includes(project.id)) {
    writeIndex({ ids: [...index.ids, project.id] });
  }
  localStorage.setItem(projectKey(project.id), JSON.stringify(project));
}

export function deleteProject(id: string): void {
  const index = readIndex();
  writeIndex({ ids: index.ids.filter((i) => i !== id) });
  localStorage.removeItem(projectKey(id));
}

export function renameProject(id: string, name: string): void {
  const project = readProject(id);
  if (!project) return;
  saveProject({ ...project, name, savedAt: Date.now() });
}

export function listProjects(): Project[] {
  const { ids } = readIndex();
  return ids.flatMap((id) => {
    const p = readProject(id);
    return p ? [p] : [];
  });
}
