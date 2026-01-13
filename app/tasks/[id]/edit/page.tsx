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
      alert("タイトルは必須です");
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
      <main style={{ minHeight: "100vh", background: "#f5f5f7", padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
        <p style={{ color: "#86868b", fontSize: "16px" }}>読み込み中...</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f9fafb", padding: "32px 24px", boxSizing: "border-box" }}>
      <div className="form-container" style={{ maxWidth: "640px", margin: "0 auto" }}>
        <div className="form-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#111827", margin: 0 }}>タスク編集</h1>
          <Link
            href="/tasks"
            className="btn-secondary"
            style={{
              padding: "8px 16px",
              color: "#3b82f6",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
              borderRadius: "8px",
              transition: "all 0.2s ease",
            }}
          >
            ← 戻る
          </Link>
        </div>

        <form
          onSubmit={onSubmit}
          style={{
            background: "#ffffff",
            padding: "32px",
            borderRadius: "12px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            display: "grid",
            gap: "24px",
            boxSizing: "border-box",
            width: "100%",
            maxWidth: "100%",
            border: "1px solid #e5e7eb",
          }}
        >
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#111827", marginBottom: "8px" }}>
              タイトル <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid #e5e5e7",
                fontSize: "14px",
                fontFamily: "inherit",
                boxSizing: "border-box",
                maxWidth: "100%",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#1d1d1f", marginBottom: "8px" }}>
              説明
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid #e5e5e7",
                fontSize: "14px",
                fontFamily: "inherit",
                minHeight: "100px",
                resize: "vertical",
                boxSizing: "border-box",
                maxWidth: "100%",
              }}
            />
          </div>

          <div className="form-row-grid" style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
            <div style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", minWidth: 0 }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#1d1d1f", marginBottom: "8px" }}>
                担当
              </label>
              <input
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #e5e5e7",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  minWidth: 0,
                }}
              />
            </div>
            <div style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", minWidth: 0 }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#1d1d1f", marginBottom: "8px" }}>
                期限
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{
                  width: "auto",
                  maxWidth: "250px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #e5e5e7",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  minWidth: 0,
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#1d1d1f", marginBottom: "8px" }}>
              ステータス
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid #e5e5e7",
                fontSize: "14px",
                fontFamily: "inherit",
                background: "#ffffff",
                cursor: "pointer",
                boxSizing: "border-box",
                maxWidth: "100%",
              }}
            >
              <option value="TODO">TODO</option>
              <option value="DOING">DOING</option>
              <option value="DONE">DONE</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              type="submit"
              className="btn-primary"
              style={{
                flex: 1,
                padding: "14px 24px",
                background: "#3b82f6",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 500,
                cursor: "pointer",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                transition: "all 0.2s ease",
              }}
            >
              更新する
            </button>
            <Link
              href="/tasks"
              className="btn-secondary"
              style={{
                padding: "14px 24px",
                background: "#ffffff",
                color: "#111827",
                textDecoration: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 500,
                textAlign: "center",
                border: "1px solid #e5e7eb",
                transition: "all 0.2s ease",
              }}
            >
              キャンセル
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
