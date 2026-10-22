import { notFound } from "next/navigation";

// Any address that matches no page (e.g. /does-not-exist) lands here and
// shows the 404 page (not-found.tsx) in the right language.

export default function CatchAll(): never {
  notFound();
}
