import type { Project } from "./types";
import type { TaskItem } from "./moduleData";

const PROJECT_STORAGE_KEY = "imprima.projects.v3";
const TASK_STORAGE_KEY = "imprima.tasks.v1";

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

interface StoredProjects {
  version: 3;
  projects: Project[];
}

function isStoredProject(value: unknown): value is Project {
  if (!value || typeof value !== "object") {
    return false;
  }

  const project = value as Partial<Project>;
  return (
    typeof project.id === "string" &&
    typeof project.title === "string" &&
    typeof project.publisher === "string" &&
    typeof project.pages === "number" &&
    Array.isArray(project.chapters) &&
    Array.isArray(project.profileWorkload)
  );
}

export function loadStoredProjects(storage: StorageAdapter, fallback: Project[]): Project[] {
  try {
    const rawValue = storage.getItem(PROJECT_STORAGE_KEY);
    if (!rawValue) {
      return fallback;
    }

    const payload = JSON.parse(rawValue) as Partial<StoredProjects>;
    if (payload.version !== 3 || !Array.isArray(payload.projects) || !payload.projects.every(isStoredProject)) {
      return fallback;
    }

    return payload.projects;
  } catch {
    return fallback;
  }
}

export function saveStoredProjects(storage: StorageAdapter, projects: Project[]) {
  try {
    const payload: StoredProjects = { version: 3, projects };
    storage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // The prototype remains usable when storage is unavailable or full.
  }
}

export function loadStoredTasks(storage: StorageAdapter, fallback: TaskItem[]): TaskItem[] {
  try {
    const rawValue = storage.getItem(TASK_STORAGE_KEY);
    if (!rawValue) {
      return fallback;
    }

    const parsedValue = JSON.parse(rawValue) as unknown;
    if (!Array.isArray(parsedValue)) {
      return fallback;
    }

    return parsedValue.every(
      (task) =>
        task &&
        typeof task === "object" &&
        typeof (task as Partial<TaskItem>).id === "string" &&
        typeof (task as Partial<TaskItem>).projectId === "string" &&
        typeof (task as Partial<TaskItem>).detailStatus === "string",
    )
      ? (parsedValue as TaskItem[])
      : fallback;
  } catch {
    return fallback;
  }
}

export function saveStoredTasks(storage: StorageAdapter, tasks: TaskItem[]) {
  try {
    storage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // The prototype remains usable when storage is unavailable or full.
  }
}
