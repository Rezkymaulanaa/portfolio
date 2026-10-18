import { renderAppIcon } from "@/lib/app-icon";

// Browser tab icon (favicon). 96px: sharp on high-resolution screens and a
// multiple of 48px, the size Google search results ask for.

export const size = { width: 96, height: 96 };
export const contentType = "image/png";

export default function Icon() {
  return renderAppIcon(size.width, { rounded: true });
}
