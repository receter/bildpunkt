import { useCallback, useState } from "react";

import type { Project } from "../types";
import {
  deleteProject,
  listProjects,
  renameProject,
  saveProject,
} from "../utils/storage";

export function useStorage() {
  const [projects, setProjects] = useState<Project[]>(() => listProjects());

  const refresh = useCallback(() => setProjects(listProjects()), []);

  const save = useCallback(
    (project: Project) => {
      saveProject(project);
      refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    (id: string) => {
      deleteProject(id);
      refresh();
    },
    [refresh],
  );

  const rename = useCallback(
    (id: string, name: string) => {
      renameProject(id, name);
      refresh();
    },
    [refresh],
  );

  return { projects, save, remove, rename };
}
