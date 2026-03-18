export default function HomePage() {
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
        src="/legacy/index.html"
        title="Deva AI Login"
        style={{ width: "100%", height: "100%", border: "0", display: "block" }}
      />
    </main>
  );
}
