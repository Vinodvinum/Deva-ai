export default function AppPage() {
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
        src="/legacy/app.html"
        title="Deva AI App"
        style={{ width: "100%", height: "100%", border: "0", display: "block" }}
      />
    </main>
  );
}
