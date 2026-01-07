export default function Home() {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>CRUD Systems</h1>
        <p style={{ marginBottom: 16 }}>まずはタスク管理（localStorage版）を動かします。</p>
  
        <a
          href="/tasks"
          style={{
            display: "inline-block",
            padding: "10px 14px",
            border: "1px solid #444",
            borderRadius: 10,
            textDecoration: "none",
          }}
        >
          /tasks を開く →
        </a>
      </main>
    );
  }
  