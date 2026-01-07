"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addTask, deleteTask, getTask, TaskStatus, updateTask } from "./data";

function getField(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() ?? "";
}

function parseStatus(value: string): TaskStatus {
  if (value === "TODO" || value === "DOING" || value === "DONE") return value;
  return "TODO";
}

export async function createTaskAction(formData: FormData) {
  const title = getField(formData, "title");
  if (!title) return;

  addTask({
    title,
    description: getField(formData, "description"),
    assignee: getField(formData, "assignee"),
    dueDate: getField(formData, "dueDate"),
    status: parseStatus(getField(formData, "status")),
  });

  revalidatePath("/tasks");
  redirect("/tasks");
}

export async function updateTaskAction(formData: FormData) {
  const id = getField(formData, "id");
  const existing = getTask(id);
  if (!id || !existing) return;

  updateTask(id, {
    title: getField(formData, "title") || existing.title,
    description: getField(formData, "description"),
    assignee: getField(formData, "assignee"),
    dueDate: getField(formData, "dueDate"),
    status: parseStatus(getField(formData, "status")),
  });

  revalidatePath("/tasks");
  redirect("/tasks");
}

export async function deleteTaskAction(formData: FormData) {
  const id = getField(formData, "id");
  if (!id) return;
  deleteTask(id);
  revalidatePath("/tasks");
}
