// Small pink label, e.g. "Web App".

export function Tag({ children, large = false }: { children: string; large?: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full bg-accent text-ink ${
        large ? "px-4 py-1 text-base lg:text-xl" : "px-4 py-1 text-sm lg:text-base"
      }`}
    >
      {children}
    </span>
  );
}
