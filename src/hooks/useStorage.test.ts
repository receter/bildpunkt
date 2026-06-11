import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { Project } from "../types";
import { useStorage } from "./useStorage";

function makeProject(id: string, name = "Test"): Project {
  return {
    id,
    name,
    size: { width: 16, height: 16 },
    dataUrl: "data:image/png;base64,abc",
    savedAt: 0,
  };
}

describe("useStorage", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("starts with an empty project list", () => {
    const { result } = renderHook(() => useStorage());
    expect(result.current.projects).toHaveLength(0);
  });

  it("save adds a project and updates state", () => {
    const { result } = renderHook(() => useStorage());
    act(() => result.current.save(makeProject("a", "My Art")));
    expect(result.current.projects).toHaveLength(1);
    expect(result.current.projects[0].name).toBe("My Art");
  });

  it("save a second project appends to the list", () => {
    const { result } = renderHook(() => useStorage());
    act(() => {
      result.current.save(makeProject("a", "A"));
      result.current.save(makeProject("b", "B"));
    });
    expect(result.current.projects).toHaveLength(2);
  });

  it("remove deletes a project from state", () => {
    const { result } = renderHook(() => useStorage());
    act(() => result.current.save(makeProject("a")));
    act(() => result.current.remove("a"));
    expect(result.current.projects).toHaveLength(0);
  });

  it("rename updates the project name in state", () => {
    const { result } = renderHook(() => useStorage());
    act(() => result.current.save(makeProject("a", "Old")));
    act(() => result.current.rename("a", "New"));
    expect(result.current.projects[0].name).toBe("New");
  });

  it("loads existing projects from localStorage on mount", () => {
    const { result: r1 } = renderHook(() => useStorage());
    act(() => r1.current.save(makeProject("a", "Persisted")));

    const { result: r2 } = renderHook(() => useStorage());
    expect(r2.current.projects[0].name).toBe("Persisted");
  });
});
