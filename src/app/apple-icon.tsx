import { renderAppIcon } from "@/lib/app-icon";

// Icon used when someone adds the site to an iPhone/iPad home screen.

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return renderAppIcon(size.width, { rounded: false });
}
