"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { updateTask, getTask, TaskStatus } from "@/lib/tasks";

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const task = getTask(id);
    if (!task) {
      alert("タスクが見つかりません");
      router.push("/tasks");
      return;
    }
    setTitle(task.title);
    setDescription(task.description);
    setAssignee(task.assignee);
    setDueDate(task.dueDate);
    setStatus(task.status);
    setLoading(false);
  }, [id, router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      alert("title は必須です");
      return;
    }
    const updated = updateTask(id, {
      title: title.trim(),
      description,
      assignee,
      dueDate,
      status,
    });
    if (!updated) {
      alert("更新に失敗しました");
      return;
    }
    router.push("/tasks");
  }

  if (loading) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <p>読み込み中...</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: 24 }}>Edit Task</h1>
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

        <button type="submit" style={{ padding: "10px 12px" }}>Update</button>
      </form>
    </main>
  );
}
