"use client";

import { Task } from "../data";

type Props = {
  tasks: Task[];
};

export default function CsvButton({ tasks }: Props) {
  const handleClick = () => {
    const header = ["id", "title", "description", "assignee", "dueDate", "status"];
    const rows = tasks.map((t) =>
      [
        t.id,
        t.title,
        t.description,
        t.assignee,
        t.dueDate ?? "",
        t.status,
      ].map((value) => `"${(value ?? "").replace(/"/g, '""')}"`).join(","),
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
    >
      CSVダウンロード
    </button>
  );
}
