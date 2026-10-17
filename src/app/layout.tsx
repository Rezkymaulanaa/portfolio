import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { RevealObserver } from "@/components/RevealObserver";
import { revealScript } from "@/lib/reveal";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alif Rezky Maulana — Portfolio",
  description: "Portfolio of Alif Rezky Maulana.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the inline script adds data-reveal to <html>
    // before React starts, so the attribute differs from the server HTML.
    <html lang="en" className={`${poppins.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
      </head>
      {/* suppressHydrationWarning: browser extensions add attributes to <body>
          (e.g. inmaintabuse). It only covers <body>'s own attributes, so real
          errors in the page content are still reported. */}
      <body className="flex min-h-full flex-col font-sans" suppressHydrationWarning>
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
