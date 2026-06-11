import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { Project } from "../types";
import {
  deleteProject,
  listProjects,
  readIndex,
  readProject,
  renameProject,
  saveProject,
} from "./storage";

function makeProject(id: string, name = "Test"): Project {
  return {
    id,
    name,
    size: { width: 16, height: 16 },
    dataUrl: "data:image/png;base64,abc",
    savedAt: 1000,
  };
}

describe("storage", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("readIndex returns empty ids when storage is empty", () => {
    expect(readIndex()).toEqual({ ids: [] });
  });

  it("readIndex handles corrupted data gracefully", () => {
    localStorage.setItem("bildpunkt:index", "not json");
    expect(readIndex()).toEqual({ ids: [] });
  });

  it("readProject returns null for an unknown id", () => {
    expect(readProject("nope")).toBeNull();
  });

  it("readProject returns null for corrupted data", () => {
    localStorage.setItem("bildpunkt:project:bad", "not json");
    expect(readProject("bad")).toBeNull();
  });

  it("saveProject persists a project and adds it to the index", () => {
    saveProject(makeProject("abc", "My Art"));
    expect(readProject("abc")).toMatchObject({ id: "abc", name: "My Art" });
    expect(readIndex().ids).toContain("abc");
  });

  it("saveProject only adds an id once on repeated saves", () => {
    saveProject(makeProject("abc"));
    saveProject({ ...makeProject("abc"), savedAt: 2000 });
    expect(readIndex().ids.filter((x) => x === "abc").length).toBe(1);
  });

  it("deleteProject removes from storage and index", () => {
    saveProject(makeProject("abc"));
    deleteProject("abc");
    expect(readProject("abc")).toBeNull();
    expect(readIndex().ids).not.toContain("abc");
  });

  it("deleteProject is a no-op for a non-existent id", () => {
    expect(() => deleteProject("nope")).not.toThrow();
  });

  it("renameProject updates the project name", () => {
    saveProject(makeProject("abc", "Old Name"));
    renameProject("abc", "New Name");
    expect(readProject("abc")?.name).toBe("New Name");
  });

  it("renameProject does not throw for a non-existent project", () => {
    expect(() => renameProject("nope", "X")).not.toThrow();
  });

  it("listProjects returns all saved projects in index order", () => {
    saveProject(makeProject("a", "A"));
    saveProject(makeProject("b", "B"));
    saveProject(makeProject("c", "C"));
    expect(listProjects().map((p) => p.name)).toEqual(["A", "B", "C"]);
  });

  it("listProjects skips projects missing from storage", () => {
    saveProject(makeProject("a", "A"));
    localStorage.removeItem("bildpunkt:project:a");
    expect(listProjects()).toHaveLength(0);
  });

  it("listProjects returns an empty array when nothing is saved", () => {
    expect(listProjects()).toEqual([]);
  });
});
