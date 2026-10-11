# Build prompt: Alif Rezky Maulana — Portfolio Website

You are building my personal portfolio website from two finished design mockups. Match the designs closely; do not redesign them.

## 0. How to work with me

- Talk to me in **Bahasa Indonesia**. Keep code, comments, file names, and commit messages in English.
- I am a beginner (basic HTML, CSS, JavaScript). Prefer simple, readable code over clever code, and tell me in one or two sentences what each phase did and how to run it.
- **Before writing any code:** open both design images, then give me a short plan (pages, components, content model) and a list of anything that is unclear. Wait for my OK.
- Work in the phases listed in section 8. Stop after each phase so I can check it in the browser. Commit after each phase.
- Never invent content about me (bio, clients, statistics, testimonials, project descriptions). If text or an image is missing, use an obvious placeholder and add it to a `TODO.md` list.
- Check the current official docs for Next.js, Tailwind CSS, and Sanity before using their APIs. Do not rely on memory for setup commands or config, because these tools change often.

## 1. Design references

- `design/home.png` — the home page (full page, desktop).
- `design/project-detail.png` — the project detail page (desktop).
- `design/navbar-states.png` — the two navbar variants: full bar (top) and collapsed four-dot pill (bottom).
- `design/service-item-states.png` — the two service row variants: default (top) and hover/active (bottom).

These are the source of truth for layout, spacing, type scale, and colors. Sample exact colors from the images. Only desktop is designed; you design the tablet and mobile layouts in the same style (section 6).

## 2. Tech stack

- **Next.js** (latest stable, App Router, TypeScript)
- **Tailwind CSS** (latest stable)
- **Sanity** as the CMS, with Sanity Studio embedded in this same project at `/studio`
- **Hosting:** Vercel (free Hobby plan), code on GitHub
- No separate backend, no database of my own, no auth code of my own. Sanity handles login for `/studio`.
- Keep dependencies minimal. Ask before adding any library beyond the above.

Everything must stay inside the free plans of Sanity and Vercel.

## 3. Pages and routes

| Route | Purpose | Designed? |
|---|---|---|
| `/` | Home page | Yes — `home.png` |
| `/work` | All projects, with the same filter tabs and card grid as the home "Selected Work" section | No — build in the same style |
| `/work/[slug]` | Project detail | Yes — `project-detail.png` |
| `/studio` | Sanity Studio (admin) | Sanity default UI |
| 404 page | Simple, in the same style, with a link back home | No |

## 4. Home page, section by section

**Navbar** — a floating, pill-shaped bar with a thin border, fixed at the top center of the viewport on every page. It has two variants (see `design/navbar-states.png`):

*Expanded variant* (full bar):
- Left: a white pill with a green dot and "Available for New Project". Text and on/off state come from the CMS.
- Center: links "Work", "Service", "Capabilities", "About Me". The first three scroll smoothly to their sections on the home page. **"About Me" has no section in the design — ask me what it should link to.**
- Right: dark pill button "Let's Talk ↗" linking to my contact URL from the CMS.
- On pages other than home, the links go to `/#work`, `/#service`, and so on.

*Collapsed variant*: a small white pill with a soft shadow containing only four dots ("••••"), centered at the top.

Behavior:
- When the page is scrolled to the very top, show the expanded variant.
- As soon as the user scrolls down (use a small threshold so it does not flicker), switch to the collapsed four-dot pill.
- While collapsed, hovering the pill expands it back to the full bar; it stays expanded while the pointer is anywhere over the bar and collapses again shortly after the pointer leaves (add a short delay so it is not twitchy).
- Keyboard: when focus moves into the navbar, expand it, so every link is reachable with Tab. Collapse when focus leaves.
- Touch devices (no hover): tapping the four-dot pill expands it; tapping outside, tapping a link, or scrolling collapses it. The pill needs an accessible label ("Open navigation") and `aria-expanded`.
- Animate between the two variants as one element morphing (width, padding, opacity of the contents), not two elements cross-fading abruptly. With `prefers-reduced-motion`, switch instantly.
- The navbar must never cover content in a way that blocks clicks when collapsed; only the pill itself is interactive.

**Hero** — full-width grayscale photo of me on the right side, with a horizontal motion-blur/ghosting effect that is part of the photo itself (use the image as provided, do not recreate the effect in CSS).
- Left: my name in three lines, "ALIF / REZKY / MAULANA", very large, extra-bold, uppercase, wide letter-spacing.
- Below: "Bachelor of Information System" (bold), then "Designing digital products that are clear, usable, and conversion focused."
- Pink pill button "Browse Projects ↗" that scrolls to the work section.
- Bottom right: two white pill buttons with icons, "LinkedIn" and "Instagram".
- Note: the small four-dot pill visible below the hero in `home.png` is **not** part of the hero. It is the collapsed navbar variant, shown there only to document the component.

**Selected Work** (`#work`)
- A huge, very faint watermark word "PORTFOLIO" behind the heading "/SELECTED WORK" (uppercase, leading slash is part of the style).
- Filter tabs on the left: "All" (default), "Real Project", "Exploration". Filtering happens instantly on the client, without a page reload.
- Right: outlined pill "View All work ↗" linking to `/work`.
- Grid of project cards, 2 columns on desktop: white rounded card, cover image, project title, pink tag pills. The whole card links to `/work/[slug]`.
- Shows only projects marked "featured" in the CMS.
- A dashed horizontal line separates this section from the next.

**Service** (`#service`)
- Watermark "SERVICE" behind the heading "/SERVICE".
- A list of service rows: "UI/UX DESIGN", "GRAPHIC DESIGN", "WEB DESIGN & DEV". Each row is one reusable component with two variants (see `design/service-item-states.png`):
  - *Default:* large uppercase title on the left, "↗" arrow on the right, thin bottom border, no background.
  - *Hover / active:* the row gets a pink rounded background, and a short description appears between the title and the arrow (for UI/UX Design: "Designing clear and scalable interfaces for dashboard, mobile apps, and websites."). The title and arrow do not move when the description appears; reserve the space so the row height does not jump.
- The active variant is triggered by pointer hover and by keyboard focus. Only one row is active at a time. Transition the background and the description smoothly (fade/slide), instantly with `prefers-reduced-motion`.
- Touch devices (no hover): show the description permanently under the title in smaller text, and use the pink background as the pressed state.
- Each row is a link to `/work` filtered by that service. **If you think this component is meant to expand on click instead of on hover, ask me before building it.**
- Title and description come from the CMS.

**Capabilities** (`#capabilities`) — dark background section.
- Watermark "CAPABILITIES" behind the pink heading "/MAIN SKILLS & TOOLS".
- Skill groups separated by thin lines, each with a title and a bullet list:
  - **Business Process Management:** Business Process Mapping; User Requirements Analysis; Workflow Optimization
  - **Design & Methodology:** Design Thinking; Empathize, Define, Ideate; Prototyping, Wireframing, and Testing
  - **Programming & Tools:** I have a basic understanding of JavaScript, Python, PHP, HTML, CSS, and SQL gained through learning and college projects.; Figma, Canva, Adobe Lightroom (for Design); Flowchart Tools; Ms. Office & Google Workspace
- **Tools that i usually use:** a wrapping grid of square tool icons (about 15). Icons and names come from the CMS; each icon needs alt text with the tool name.

**CTA + footer** — light background with a large gray decorative brush-stroke line behind the content.
- Heading "HAVE A PROJECT IN MIND?"
- Text: "Together, we can create something clear and impactful. Let's collaborate to bring our ideas to life in a way that resonates with everyone"
- Pink pill button "Let's Collaborate ↗" linking to my contact URL.
- Bottom row: dark pill "Alif Rezky" with a small avatar icon, then outlined pills "Instagram" and "LinkedIn".
- This CTA + footer block is shared by every page.

## 5. Project detail page (`/work/[slug]`)

- Outlined pill "← Back" (goes back to `/work`).
- Left column: pink tag pills, large bold project title, gray short description, dark pill button "Live Preview ↗" (hidden when the project has no URL; opens in a new tab).
- Right column, right-aligned: "Service" with its value, "Timeline" with its value (for example "4 Weeks"), "Tools" with tool icons.
- The same gray decorative stroke crosses behind this header area.
- Below: the main project image inside a white rounded frame, full content width. If the project has more gallery images, stack them below in the same frame style.
- Dashed divider, then a centered "/MORE WORK" heading with two other project cards (exclude the current project).
- Then the shared CTA + footer.

## 6. Visual system

- **Font:** the design appears to use Poppins. Load it with `next/font`. If the images show a different font, tell me.
- **Colors (approximate — sample the real values from the images):** page background light gray (~`#F3F3F3`), near-black (~`#1B1B1B`) for dark sections and dark buttons, light pink/lilac accent (~`#F5B5FB`) for primary buttons and tags, white for cards and pills, green dot for availability, mid-gray for secondary text.
- Define colors, radii, and the type scale once as design tokens in the Tailwind theme. No hard-coded hex values scattered through components.
- Buttons, tags, and the navbar are fully rounded pills. Cards have a medium radius.
- Section headings share one pattern: faint oversized watermark word behind, "/TITLE" in front. Build it as one reusable component.
- **Responsive:** must work from 360px wide upward. On mobile: the navbar uses the same four-dot pill, which opens a compact stacked menu (availability pill, links, "Let's Talk") when tapped; hero text sits above or over a cropped photo and stays readable, project grid becomes 1 column, detail page meta moves below the title, watermark words scale down and never cause horizontal scrolling.
- **Motion:** subtle only — hover states on buttons, cards, and service rows; a light fade-up when sections enter the viewport. Respect `prefers-reduced-motion`. No animation library unless I approve it.

## 7. Content model (Sanity)

Every piece of text and every image on the site must be editable in `/studio`, so I never need to open the code to update content.

**`project`**
- `title` (string, required), `slug` (from title, required)
- `category` — "Real Project" or "Exploration" (drives the filter tabs)
- `tags` — array of strings (shown as pink pills)
- `service` — reference to `service`
- `shortDescription` (text)
- `timeline` (string, e.g. "4 Weeks")
- `tools` — array of references to `tool`
- `coverImage` (image with alt text, required), `gallery` (array of images with alt text)
- `livePreviewUrl` (url, optional)
- `featured` (boolean — show in "Selected Work" on home)
- `order` (number, for manual sorting)

**`service`** — `title`, `slug`, `description` (short text shown in the hover variant of the service row), `order`

**`tool`** — `name`, `icon` (image)

**`skillGroup`** — `title`, `items` (array of strings), `order`

**`siteSettings`** (single document)
- `fullName`, `headline`, `tagline`, `heroImage`
- `availabilityLabel`, `isAvailable` (boolean)
- `contactUrl` (used by "Let's Talk" and "Let's Collaborate"), `linkedinUrl`, `instagramUrl`
- `ctaHeading`, `ctaText`
- `usualTools` — array of references to `tool`
- SEO: `siteTitle`, `siteDescription`, `ogImage`

Requirements:
- Add helpful field descriptions and validation in the Studio so it is hard for me to publish a broken project.
- Fetch content on the server. After I publish in the Studio, the live site should update within about a minute without a manual redeploy (use revalidation; tell me which approach you chose and why).
- Provide a seed script or import file with the content from the designs (the 4 project cards, 3 services, 3 skill groups, and the texts above) using placeholder images, so the site looks complete on first run. Only the UI/UX Design service has a description in the designs; for the other two services use a clearly marked placeholder and add them to `TODO.md`.

## 8. Phases

1. **Setup** — create the Next.js project, Tailwind, fonts, design tokens, folder structure, Git. Walk me through creating the Sanity project and where to put the keys (`.env.local`, never committed; include a `.env.example`).
2. **CMS** — schemas, Studio at `/studio`, seed content.
3. **Shared UI** — navbar (both variants and the scroll/hover/focus/touch behavior), section heading, buttons/pills, project card, service row (both variants), CTA + footer.
4. **Home page** — all sections, wired to Sanity.
5. **Work pages** — `/work` with filters, `/work/[slug]`, 404.
6. **Responsive + polish** — mobile/tablet layouts, hover and scroll motion, accessibility pass.
7. **SEO + deploy** — metadata, Open Graph image, sitemap, favicon; then guide me step by step through pushing to GitHub and deploying on Vercel, including environment variables and allowing the production domain in Sanity (CORS).

## 9. Quality bar

- Semantic HTML, one `h1` per page, keyboard-navigable, visible focus states, sufficient color contrast (check the pink buttons and gray text).
- All images through `next/image` with correct sizes and alt text; no layout shift when images load.
- No TypeScript or lint errors; `npm run build` passes.
- Lighthouse on the deployed home page: 90+ for Performance, Accessibility, Best Practices, and SEO on mobile.
- A short `README.md` in Bahasa Indonesia: how to run locally, how to add a new project in the Studio, how to deploy.

## 10. Done means

- Both designed pages match the mockups side by side at desktop width.
- I can log in at `/studio`, add a new project with images, publish it, and see it appear on the home page, `/work`, and its own detail page without touching code.
- The site is live on Vercel, works on a phone, and `TODO.md` lists every placeholder I still need to replace.
