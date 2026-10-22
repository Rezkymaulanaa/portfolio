// Root layout of the Sanity Studio (/studio). Separate from the website
// layout in app/[lang], so the Studio gets none of the website styles.

export default function StudioLayout({ children }: LayoutProps<"/studio">) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
