export type TaskStatus = "TODO" | "DOING" | "DONE";

export type Task = {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate?: string;
  status: TaskStatus;
};

let tasks: Task[] = [
  {
    id: "1",
    title: "企画書の叩き台作成",
    description: "アウトラインだけでOK",
    assignee: "Alice",
    dueDate: "2025-01-10",
    status: "TODO",
  },
  {
    id: "2",
    title: "デザインレビュー",
    description: "Figmaのリンクを確認",
    assignee: "Bob",
    dueDate: "2024-12-15",
    status: "DOING",
  },
  {
    id: "3",
    title: "リリースノート草案",
    description: "主要変更点を3つにまとめる",
    assignee: "Carol",
    dueDate: "2024-12-01",
    status: "DONE",
  },
];

function generateId() {
  try {
    const { randomUUID } = require("crypto");
    return randomUUID();
  } catch {
    return String(Date.now());
  }
}

export function listTasks(filter: TaskStatus | "ALL" = "ALL") {
  if (filter === "ALL") return [...tasks];
  return tasks.filter((t) => t.status === filter);
}

export function getTask(id: string) {
  return tasks.find((t) => t.id === id);
}

export function addTask(input: Omit<Task, "id">) {
  const newTask: Task = { ...input, id: generateId() };
  tasks = [newTask, ...tasks];
  return newTask;
}

export function updateTask(id: string, input: Omit<Task, "id">) {
  tasks = tasks.map((t) => (t.id === id ? { ...input, id } : t));
}

export function deleteTask(id: string) {
  tasks = tasks.filter((t) => t.id !== id);
}
