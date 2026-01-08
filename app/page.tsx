import Link from "next/link";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#f5f5f7", padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: "600px" }}>
        <h1 style={{ fontSize: "48px", fontWeight: 700, color: "#1d1d1f", marginBottom: "16px" }}>CRUD Systems</h1>
        <p style={{ fontSize: "18px", color: "#86868b", marginBottom: "32px", lineHeight: 1.6 }}>
          シンプルで使いやすいタスク管理アプリケーション
        </p>
        <Link
          href="/tasks"
          style={{
            display: "inline-block",
            padding: "16px 32px",
            background: "#007AFF",
            color: "#ffffff",
            borderRadius: "12px",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: 500,
            boxShadow: "0 2px 8px rgba(0, 122, 255, 0.3)",
            transition: "all 0.2s ease",
          }}
        >
          タスク管理を開く →
        </Link>
      </div>
    </main>
  );
}
