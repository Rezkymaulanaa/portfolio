import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Draws the site icon: "AR." in Poppins Bold, light letters on the dark ink
// color with a pink dot (colors from globals.css). Used by app/icon.tsx
// (browser tab) and app/apple-icon.tsx (iPhone home screen).
// Generated once at build time as a PNG.

const poppinsBold = readFile(join(process.cwd(), "src/assets/fonts/Poppins-Bold.ttf"));

export async function renderAppIcon(size: number, { rounded }: { rounded: boolean }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1a1a",
          // Browser tabs show the rounded corners; iPhones round the icon
          // themselves, so the Apple icon stays square.
          borderRadius: rounded ? size * 0.22 : 0,
          color: "#f5f5f5",
          fontFamily: "Poppins",
          fontSize: size * 0.42,
          letterSpacing: size * -0.01,
          // Poppins sits a little high in its line box; this centers the letters.
          paddingTop: size * 0.04,
        }}
      >
        AR<span style={{ color: "#f7bcff" }}>.</span>
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: [{ name: "Poppins", data: await poppinsBold, weight: 700, style: "normal" }],
    },
  );
}
