"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createTask, TaskStatus } from "@/lib/tasks";

export default function NewTaskPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      alert("title は必須です");
      return;
    }
    createTask({ title: title.trim(), description, assignee, dueDate, status });
    router.push("/tasks");
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: 24 }}>New Task</h1>
        <Link href="/tasks" style={{ textDecoration: "none" }}>← Back</Link>
      </div>

      <form onSubmit={onSubmit} style={{ marginTop: 16, display: "grid", gap: 10, maxWidth: 520 }}>
        <label>
          Title*<br />
          <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", padding: 8 }} />
        </label>

        <label>
          Description<br />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: "100%", padding: 8, minHeight: 80 }} />
        </label>

        <label>
          Assignee<br />
          <input value={assignee} onChange={(e) => setAssignee(e.target.value)} style={{ width: "100%", padding: 8 }} />
        </label>

        <label>
          Due Date<br />
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ width: "100%", padding: 8 }} />
        </label>

        <label>
          Status<br />
          <select value={status} onChange={(e) => setStatus(e.target.value as any)} style={{ width: "100%", padding: 8 }}>
            <option value="TODO">TODO</option>
            <option value="DOING">DOING</option>
            <option value="DONE">DONE</option>
          </select>
        </label>

        <button type="submit" style={{ padding: "10px 12px" }}>Create</button>
      </form>
    </main>
  );
}
