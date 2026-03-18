export default function AdminPage() {
  return (
    <main
      style={{
        width: "100%",
        height: "100dvh",
        minHeight: "100dvh",
        overflow: "hidden",
      }}
    >
      <iframe
        src="/legacy/admin.html"
        title="Deva AI Admin"
        style={{ width: "100%", height: "100%", border: "0", display: "block" }}
      />
    </main>
  );
}
