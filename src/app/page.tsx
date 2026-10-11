// Temporary page for Phase 1: shows the design tokens so we can check
// colors and font in the browser. It will be replaced in Phase 4.

const swatches = [
  { name: "page", className: "bg-page" },
  { name: "ink", className: "bg-ink" },
  { name: "accent", className: "bg-accent" },
  { name: "surface", className: "bg-surface" },
  { name: "muted", className: "bg-muted" },
  { name: "line", className: "bg-line" },
  { name: "watermark", className: "bg-watermark" },
  { name: "available", className: "bg-available" },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16">
      <h1 className="text-hero font-extrabold uppercase">Alif</h1>
      <p className="mt-6 text-xl font-bold">Bachelor of Information System</p>
      <p className="text-muted">Phase 1 setup — design tokens preview.</p>

      <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {swatches.map((swatch) => (
          <li key={swatch.name} className="rounded-card bg-surface p-3">
            <div
              className={`h-16 rounded-card border border-line ${swatch.className}`}
            />
            <p className="mt-2 text-sm">{swatch.name}</p>
          </li>
        ))}
      </ul>

      <a
        href="#"
        className="mt-10 inline-flex rounded-full bg-accent px-5 py-2 font-medium"
      >
        Browse Projects ↗
      </a>
    </main>
  );
}
