"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { loadTasks, Task, TaskStatus, updateTask, deleteTask } from "@/lib/tasks";

export default function DateTasksPage() {
  const params = useParams();
  const date = params.date as string;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  // 指定された日付のタスクをフィルタリング
  const dateTasks = useMemo(() => {
    return tasks.filter((task) => task.dueDate === date);
  }, [tasks, date]);

  // 日付をフォーマット
  const formattedDate = useMemo(() => {
    if (!date) return "";
    try {
      const [year, month, day] = date.split("-");
      return `${year}年${parseInt(month)}月${parseInt(day)}日`;
    } catch {
      return date;
    }
  }, [date]);

  function refresh() {
    setTasks(loadTasks());
  }

  function onDelete(id: string) {
    if (busyId) return;
    if (!confirm("削除しますか?")) return;
    try {
      setBusyId(id);
      deleteTask(id);
      refresh();
    } finally {
      setBusyId(null);
    }
  }

  function setStatus(id: string, status: TaskStatus) {
    if (busyId) return;
    try {
      setBusyId(id);
      updateTask(id, { status });
      refresh();
    } finally {
      setBusyId(null);
    }
  }

  function getDueBadge(t: Task) {
    if (t.status === "DONE" || !t.dueDate) return null;
    const due = new Date(`${t.dueDate}T00:00:00`);
    const now = new Date();
    const diffMs = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return { text: "期限切れ", color: "#ff3b30", bg: "#ffebee" };
    }
    if (diffDays <= 3) {
      return { text: `期限まで${diffDays}日`, color: "#ff9500", bg: "#fff3e0" };
    }
    return { text: `期限まで${diffDays}日`, color: "#86868b", bg: "#f5f5f7" };
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f5f5f7", padding: "16px 12px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* ヘッダー */}
        <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#1d1d1f", margin: "0 0 8px 0" }}>
              {formattedDate}のタスク
            </h1>
            <p style={{ fontSize: "14px", color: "#86868b", margin: 0 }}>
              {dateTasks.length}件のタスク
            </p>
          </div>
          <Link
            href="/tasks"
            style={{
              padding: "10px 20px",
              background: "#ffffff",
              border: "1px solid #e5e5e7",
              borderRadius: "12px",
              color: "#1d1d1f",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            }}
          >
            ← タスク一覧に戻る
          </Link>
        </div>

        {/* タスク一覧 */}
        {dateTasks.length === 0 && (
          <div
            style={{
              background: "#ffffff",
              padding: "48px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              textAlign: "center",
              color: "#86868b",
            }}
          >
            {formattedDate}に期限があるタスクはありません。
          </div>
        )}

        {/* モバイル（sm以下）: カード型表示 */}
        <div className="tasks-card-view">
          {dateTasks.map((t) => {
            const badge = getDueBadge(t);
            return (
              <div key={t.id} className="task-item-card">
                <div className="task-header">
                  <div className="task-title-row">
                    <h3 className="task-title">{t.title}</h3>
                    {badge && (
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: 500,
                          color: badge.color,
                          background: badge.bg,
                          whiteSpace: "nowrap",
                          alignSelf: "flex-start",
                        }}
                      >
                        {badge.text}
                      </span>
                    )}
                  </div>
                  {t.description && (
                    <p className="task-description">{t.description}</p>
                  )}
                  <div className="task-meta">
                    <div className="task-meta-item">
                      <span style={{ fontWeight: 500 }}>担当:</span>
                      <span>{t.assignee || "-"}</span>
                    </div>
                    <div className="task-meta-item">
                      <span style={{ fontWeight: 500 }}>期限:</span>
                      <span>{t.dueDate || "-"}</span>
                    </div>
                    <div className="task-meta-item">
                      <span style={{ fontWeight: 500 }}>ステータス:</span>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          background: t.status === "DONE" ? "#e8f5e9" : t.status === "DOING" ? "#e3f2fd" : "#f5f5f7",
                          color: t.status === "DONE" ? "#2e7d32" : t.status === "DOING" ? "#1976d2" : "#86868b",
                          fontWeight: 500,
                          fontSize: "12px",
                        }}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="task-actions">
                  <Link
                    href={`/tasks/${t.id}/edit`}
                    style={{
                      background: "#f5f5f7",
                      color: "#1d1d1f",
                      textDecoration: "none",
                      fontWeight: 500,
                      transition: "all 0.2s ease",
                    }}
                  >
                    編集
                  </Link>
                  <select
                    value={t.status}
                    onChange={(e) => setStatus(t.id, e.target.value as TaskStatus)}
                    disabled={busyId === t.id}
                    style={{
                      border: "1px solid #e5e5e7",
                      background: "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    <option value="TODO">TODO</option>
                    <option value="DOING">DOING</option>
                    <option value="DONE">DONE</option>
                  </select>
                  <button
                    onClick={() => onDelete(t.id)}
                    disabled={busyId === t.id}
                    style={{
                      background: "#ffebee",
                      color: "#c62828",
                      border: "none",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    削除
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* PC（md以上）: テーブル表示 */}
        <div className="tasks-table-view">
          <table>
            <thead>
              <tr>
                <th>タイトル</th>
                <th>説明</th>
                <th>担当</th>
                <th>期限</th>
                <th>ステータス</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {dateTasks.map((t) => {
                const badge = getDueBadge(t);
                return (
                  <tr key={t.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: 600, color: "#1d1d1f" }}>{t.title}</span>
                        {badge && (
                          <span
                            style={{
                              padding: "4px 12px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: 500,
                              color: badge.color,
                              background: badge.bg,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {badge.text}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ color: "#86868b", maxWidth: "300px" }}>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {t.description || "-"}
                      </div>
                    </td>
                    <td style={{ color: "#86868b" }}>{t.assignee || "-"}</td>
                    <td style={{ color: "#86868b" }}>{t.dueDate || "-"}</td>
                    <td>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "6px",
                          background: t.status === "DONE" ? "#e8f5e9" : t.status === "DOING" ? "#e3f2fd" : "#f5f5f7",
                          color: t.status === "DONE" ? "#2e7d32" : t.status === "DOING" ? "#1976d2" : "#86868b",
                          fontWeight: 500,
                          fontSize: "13px",
                        }}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <Link
                          href={`/tasks/${t.id}/edit`}
                          style={{
                            padding: "6px 12px",
                            background: "#f5f5f7",
                            color: "#1d1d1f",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontSize: "12px",
                            fontWeight: 500,
                            transition: "all 0.2s ease",
                          }}
                        >
                          編集
                        </Link>
                        <select
                          value={t.status}
                          onChange={(e) => setStatus(t.id, e.target.value as TaskStatus)}
                          disabled={busyId === t.id}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: "1px solid #e5e5e7",
                            background: "#ffffff",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          <option value="TODO">TODO</option>
                          <option value="DOING">DOING</option>
                          <option value="DONE">DONE</option>
                        </select>
                        <button
                          onClick={() => onDelete(t.id)}
                          disabled={busyId === t.id}
                          style={{
                            padding: "6px 12px",
                            background: "#ffebee",
                            color: "#c62828",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          削除
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
