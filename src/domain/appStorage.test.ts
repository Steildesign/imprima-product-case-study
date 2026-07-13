import { describe, expect, it } from "vitest";
import { loadStoredProjects, loadStoredTasks, saveStoredProjects, saveStoredTasks, type StorageAdapter } from "./appStorage";
import { projects } from "./mockData";
import { taskItems } from "./moduleData";

function createStorage(initialValue?: string): StorageAdapter & { value?: string } {
  return {
    value: initialValue,
    getItem() {
      return this.value ?? null;
    },
    setItem(_key, value) {
      this.value = value;
    },
  };
}

describe("app storage", () => {
  it("returns the fallback for missing or invalid data", () => {
    expect(loadStoredProjects(createStorage(), projects)).toBe(projects);
    expect(loadStoredProjects(createStorage("not-json"), projects)).toBe(projects);
  });

  it("round-trips project and chapter changes", () => {
    const storage = createStorage();
    const changedProjects = [{ ...projects[0], chapters: [...projects[0].chapters, { ...projects[0].chapters[0], id: "neu" }] }];

    saveStoredProjects(storage, changedProjects);

    expect(loadStoredProjects(storage, projects)).toEqual(changedProjects);
  });

  it("round-trips task status changes", () => {
    const storage = createStorage();
    const changedTasks = taskItems.map((task, index) => index === 0 ? { ...task, detailStatus: "erledigt" as const } : task);

    saveStoredTasks(storage, changedTasks);

    expect(loadStoredTasks(storage, taskItems)).toEqual(changedTasks);
  });
});
