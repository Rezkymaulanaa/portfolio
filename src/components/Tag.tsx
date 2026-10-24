// Small pink label, e.g. "Web App".

export function Tag({ children, large = false }: { children: string; large?: boolean }) {
  return (
    <span
      className={`inline-flex rounded-card bg-accent text-ink ${
        large ? "px-4 py-1 text-body" : "px-3.5 py-1 text-small"
      }`}
    >
      {children}
    </span>
  );
}
