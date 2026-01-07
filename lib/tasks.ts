export type TaskStatus = "TODO" | "DOING" | "DONE";

export type Task = {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string; // YYYY-MM-DD
  status: TaskStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

const STORAGE_KEY = "tasks-app.tasks.v1";

function safeParse(json: string | null): Task[] {
  if (!json) return [];
  try {
    const data = JSON.parse(json);
    return Array.isArray(data) ? (data as Task[]) : [];
  } catch {
    return [];
  }
}

function nowIso() {
  return new Date().toISOString();
}

function genId() {
  // crypto.randomUUIDが無い環境向けにフォールバック
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  const tasks = safeParse(localStorage.getItem(STORAGE_KEY));
  // updatedAt降順
  return tasks.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function getTask(id: string): Task | null {
  const tasks = loadTasks();
  return tasks.find((t) => t.id === id) || null;
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function createTask(input: Omit<Task, "id" | "createdAt" | "updatedAt">): Task {
  const task: Task = {
    ...input,
    id: genId(),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  const tasks = loadTasks();
  tasks.unshift(task);
  saveTasks(tasks);
  return task;
}

export function updateTask(id: string, patch: Partial<Omit<Task, "id" | "createdAt">>): Task | null {
  const tasks = loadTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  const updated: Task = { ...tasks[idx], ...patch, updatedAt: nowIso() };
  tasks[idx] = updated;
  saveTasks(tasks);
  return updated;
}

export function deleteTask(id: string): boolean {
  const tasks = loadTasks();
  const next = tasks.filter((t) => t.id !== id);
  if (next.length === tasks.length) return false;
  saveTasks(next);
  return true;
}

export function isOverdue(task: Task): boolean {
  if (!task.dueDate) return false;
  const today = new Date();
  const d = new Date(task.dueDate + "T23:59:59");
  return d.getTime() < today.getTime() && task.status !== "DONE";
}
