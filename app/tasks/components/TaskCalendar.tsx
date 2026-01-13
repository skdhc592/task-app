"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Task, TaskStatus } from "@/lib/tasks";

type Props = {
  tasks: Task[];
};

export default function TaskCalendar({ tasks }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 月の最初の日と最後の日を取得
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 (日曜日) から 6 (土曜日)

  // 日付ごとのタスクをグループ化
  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((task) => {
      if (task.dueDate) {
        const dateKey = task.dueDate;
        if (!map.has(dateKey)) {
          map.set(dateKey, []);
        }
        map.get(dateKey)!.push(task);
      }
    });
    return map;
  }, [tasks]);

  // 日付のタスクを取得
  function getTasksForDate(date: number): Task[] {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    return tasksByDate.get(dateStr) || [];
  }

  // ステータスごとの色を取得
  function getStatusColor(status: TaskStatus): string {
    switch (status) {
      case "TODO":
        return "#86868b"; // グレー
      case "DOING":
        return "#1976d2"; // 青
      case "DONE":
        return "#2e7d32"; // 緑
      default:
        return "#86868b";
    }
  }

  // 日付のドット表示（複数タスクがある場合は複数のドット）
  function renderDateDots(date: number) {
    const dateTasks = getTasksForDate(date);
    if (dateTasks.length === 0) return null;

    const statusCounts = dateTasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<TaskStatus, number>);

    return (
      <div style={{ display: "flex", gap: "2px", justifyContent: "center", marginTop: "2px", flexWrap: "wrap", maxWidth: "100%", overflow: "hidden" }}>
        {Object.entries(statusCounts).map(([status, count]) => (
          <div
            key={status}
            style={{
              width: count > 1 ? "6px" : "5px",
              height: count > 1 ? "6px" : "5px",
              borderRadius: "50%",
              backgroundColor: getStatusColor(status as TaskStatus),
              opacity: 0.8,
              flexShrink: 0,
            }}
            title={`${status}: ${count}件`}
          />
        ))}
      </div>
    );
  }

  // 前の月に移動
  function goToPreviousMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  // 次の月に移動
  function goToNextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  // 今日の日付かどうか
  function isToday(date: number): boolean {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === date
    );
  }

  const monthNames = [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月"
  ];
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <div className="task-calendar" style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)", border: "1px solid #e5e7eb" }}>
      {/* ヘッダー */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <button
          onClick={goToPreviousMonth}
          style={{
            padding: "8px 12px",
            background: "#f5f5f7",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            color: "#1d1d1f",
          }}
        >
          ←
        </button>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1d1d1f", margin: 0 }}>
          {year}年 {monthNames[month]}
        </h2>
        <button
          onClick={goToNextMonth}
          style={{
            padding: "8px 12px",
            background: "#f5f5f7",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            color: "#1d1d1f",
          }}
        >
          →
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "8px" }}>
        {dayNames.map((day) => (
          <div
            key={day}
            style={{
              textAlign: "center",
              fontSize: "12px",
              fontWeight: 600,
              color: "#86868b",
              padding: "8px 4px",
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", width: "100%", boxSizing: "border-box" }}>
        {/* 空白セル（月の最初の日までの空白） */}
        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} style={{ aspectRatio: "1", minHeight: "60px", width: "100%", maxWidth: "100%", boxSizing: "border-box" }} />
        ))}

        {/* 日付セル */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const date = index + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
          const hasTasks = getTasksForDate(date).length > 0;
          const today = isToday(date);

          const cellContent = (
            <>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: today ? 700 : hasTasks ? 600 : 400,
                  color: today ? "#007AFF" : "#1d1d1f",
                  lineHeight: "1.2",
                  whiteSpace: "nowrap",
                }}
              >
                {date}
              </span>
              {renderDateDots(date)}
            </>
          );

          const cellStyle: React.CSSProperties = {
            aspectRatio: "1",
            minHeight: "60px",
            width: "100%",
            maxWidth: "100%",
            border: today ? "2px solid #007AFF" : "1px solid #e5e5e7",
            borderRadius: "8px",
            padding: "4px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            background: today ? "#f0f7ff" : hasTasks ? "#fafafa" : "#ffffff",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxSizing: "border-box",
            overflow: "hidden",
            position: "relative",
            textDecoration: "none",
            color: "inherit",
          };

          if (hasTasks) {
            return (
              <Link
                key={date}
                href={`/tasks/date/${dateStr}`}
                style={cellStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {cellContent}
              </Link>
            );
          }

          return (
            <div
              key={date}
              style={cellStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {cellContent}
            </div>
          );
        })}
      </div>

      {/* 凡例 */}
      <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #e5e5e7", display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#86868b" }} />
          <span style={{ fontSize: "12px", color: "#86868b" }}>TODO</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#1976d2" }} />
          <span style={{ fontSize: "12px", color: "#86868b" }}>DOING</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#2e7d32" }} />
          <span style={{ fontSize: "12px", color: "#86868b" }}>DONE</span>
        </div>
      </div>
    </div>
  );
}
