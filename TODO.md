# TODO — content and placeholders to replace

Everything listed here is a placeholder. Replace it in the Studio (`/studio`) or tell Claude.

## Content
- [ ] About Me section: heading, bio text, and photo (the design has no About section yet; layout is placeholder).
- [ ] CV file for the "Download CV" button in About — Studio → Site settings → About → CV file (PDF). The button is hidden until a file is uploaded.
- [ ] Service descriptions for "Graphic Design" and "Web Design & Dev" (only UI/UX Design has one in the design).
- [ ] Short descriptions for "Cyber Security - Web App", "Nala Heritage Mobile Apps", "Cyber Security - Web App" (2nd card) — only "Nala Mobile App" has one in the design.
- [ ] Category for each of the 4 projects (seeded as: 2 × Real Project, 2 × Exploration — just a guess so the filter tabs work).
- [ ] Timeline and tools for each project (only "Nala Mobile App" shows "4 Weeks", Canva + Figma).
- [ ] Contact email shown in the message panel ("Copy email") — Studio → Site settings → Contact email (now `your-email@example.com`).
- [ ] Set up Resend for the "Let's Talk" panel: add RESEND_API_KEY and CONTACT_TO_EMAIL to .env.local (and to Vercel in Phase 7).
- [ ] LinkedIn, Instagram and GitHub URLs (shown as buttons in the footer) — check they point to your own profiles.
- [ ] "Live Preview" URL for Nala Mobile App (now `https://example.com`).
- [ ] Project names and tags are inconsistent in the design ("Nala Mobile App - Design" vs "Nala Mobile App", "Mobile App" vs "Mobile Apps").

## Thesis project (Newborn JKN Registration System)
- [ ] Cover image (now the placeholder `design/cover-proyek.png`).
- [ ] Diagrams and screenshots: add an "Images" block in the case study (use case, activity, ERD/dbdiagram, final UI).
- [ ] Short descriptions for the "System requirements analysis" and "System design" steps.
- [ ] Optional: a "Table" block with some black box test scenarios.
- [ ] Show on the home page? (now "Featured" is off, so it is only on /work).
- [ ] After the first run of `npm run add-skripsi`, edit this project in the Studio only (running the script again overwrites it).

## Decisions postponed
- [ ] Service rows: what should clicking a row do? (currently hover/focus only, no link)

## Images
- [ ] All 4 projects use the same cover image (`design/cover-proyek.png`).
- [ ] 4 photos for the photo grid below Education — Studio → Site settings → About → Photo grid. Hidden until photos are added.
- [ ] About photo (currently re-uses the hero photo).
- [ ] Service of each project (all seeded as UI/UX Design).
- [ ] Alt text of project cover images (marked [PLACEHOLDER]).

## Security
- [ ] Contact form spam limits (per visitor) live in server memory, so on Vercel they are approximate. If spam still gets through, add Cloudflare Turnstile or Upstash rate limiting.
- [ ] Delete the "seed" API token in sanity.io/manage → API → Tokens and create a new one if you need to re-run the seed (the old one was shared in chat).
