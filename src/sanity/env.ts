// Sanity connection settings, read from .env.local (see .env.example).

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local",
);

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing NEXT_PUBLIC_SANITY_DATASET in .env.local",
);

// A fixed date keeps the API behavior stable even when Sanity releases changes.
export const apiVersion = "2026-03-01";

function assertValue(value: string | undefined, message: string): string {
  if (!value) {
    throw new Error(message);
  }
  return value;
}
