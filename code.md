# code.md — Paul Zabotto Portfolio: Full Project Reference

> **Purpose:** This file is the single source of truth for any AI agent or developer picking up this project. Read this before touching any file.

---

## 1. Project Overview & Architecture

### What this is
A **3D interactive personal portfolio website** for Paul Zabotto — a French business engineer, entrepreneur, and traveler. The site is built on top of the open-source portfolio by [Mohit Virli](https://github.com/super-zab/PZ), fully customized with Paul's identity, content, and planned extensions.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15.5.7 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| 3D Engine | Three.js 0.173 + React Three Fiber 9 + Drei 10 |
| Animation | GSAP 3.12.7 |
| State Management | Zustand 5 |
| Styling | Tailwind CSS 3.4 |
| Device Detection | react-device-detect |
| Dev Server | `./node_modules/.bin/next dev` (use this, not `npm run dev`, on Windows) |

> **Windows note:** `npm run dev` may fail with "'next' is not recognized". Always use `./node_modules/.bin/next dev` directly.

### Folder Structure

```
Portfolio Paul Zabotto/
├── app/
│   ├── components/
│   │   ├── common/
│   │   │   ├── CanvasLoader.tsx       # Wraps the entire scene in a Three.js Canvas
│   │   │   ├── Preloader.tsx          # Loading screen with progress bar
│   │   │   ├── ProgressLoader.tsx     # Progress state tracker
│   │   │   ├── ScrollWrapper.tsx      # Manages scroll context for 3D scenes
│   │   │   ├── ScrollHint.tsx         # "Scroll to explore" UI hint
│   │   │   └── ThemeSwitcher.tsx      # Dark/light toggle (top-right icon)
│   │   ├── experience/
│   │   │   ├── index.tsx              # "EXPERIENCE" section container
│   │   │   ├── GridTile.tsx           # Portal tile (opens WORK or PROJECTS)
│   │   │   ├── Triangle.tsx           # Decorative 3D triangle
│   │   │   ├── work/
│   │   │   │   ├── index.tsx          # Work section wrapper
│   │   │   │   └── Timeline.tsx       # 3D winding timeline visualization
│   │   │   └── projects/
│   │   │       ├── index.tsx          # Projects section wrapper
│   │   │       ├── ProjectsCarousel.tsx  # Circular carousel layout engine
│   │   │       ├── ProjectTile.tsx       # Individual project card (3D)
│   │   │       └── TouchPanControls.tsx  # Mobile swipe/pan for carousel
│   │   ├── hero/
│   │   │   ├── index.tsx              # Hero scene: name + stars + clouds + window
│   │   │   └── TextWindow.tsx         # 3D rotating window with bio phrases
│   │   ├── footer/
│   │   │   └── index.tsx              # 3D footer with social links
│   │   └── models/
│   │       ├── Cloud.tsx              # Animated cloud particle system
│   │       ├── Memory.tsx             # Dalí "Persistence of Memory" 3D model
│   │       ├── Stars.tsx              # Starfield background
│   │       ├── Wanderer.tsx           # "Wanderer above the Sea of Fog" 3D model
│   │       └── WindowModel.tsx        # The 3D window frame object
│   ├── constants/
│   │   ├── index.ts                   # Re-exports all constants
│   │   ├── projects.ts                # ★ Paul's projects data
│   │   ├── work.ts                    # ★ Paul's work & education timeline
│   │   └── footer.ts                  # ★ Paul's social links
│   ├── stores/
│   │   ├── index.ts                   # Re-exports all stores
│   │   ├── portalStore.ts             # Which section is open (work/projects/null)
│   │   ├── scrollStore.ts             # Scroll progress (0–1)
│   │   └── themeStore.ts             # Current theme (dark/light)
│   ├── types/
│   │   ├── index.ts
│   │   ├── projects.ts                # Project { title, date, subtext, url?, urls? }
│   │   ├── work.ts                    # WorkTimelinePoint { point, year, title, subtitle, position }
│   │   └── footer.ts                  # FooterLink { name, hoverText, icon, url }
│   ├── layout.tsx                     # Root layout, metadata, fonts
│   ├── page.tsx                       # Home page (CanvasLoader > ScrollWrapper > Hero + Experience + Footer)
│   └── globals.css                    # Global CSS, scrollbar, theme vars
├── public/
│   ├── Resume-PZ.pdf                  # ★ Paul's resume (must be placed here manually)
│   ├── soria-font.ttf                 # Serif font used for titles/3D text
│   ├── Vercetti-Regular.woff          # Sans-serif font used for body/labels
│   ├── icons/
│   │   ├── linkedin.svg
│   │   ├── github.svg                 # Currently reused for World Map placeholder
│   │   ├── instagram.svg
│   │   ├── file.svg                   # Resume icon
│   │   ├── night-mode.svg             # Theme toggle icon
│   │   └── chevrons-*.svg             # UI navigation hints
│   └── models/
│       ├── window.glb                 # The 3D window frame
│       ├── wanderer_above_the_sea_of_fog.glb   # Hero painting 1 (Caspar David Friedrich)
│       └── dalithe_persistence_of_memory.glb   # Hero painting 2 (Salvador Dalí)
├── next.config.ts                     # Next.js config (strict mode OFF, GA env var)
├── tailwind.config.ts
├── tsconfig.json
└── code.md                            # This file
```

### How the page renders (data flow)

```
page.tsx
└── CanvasLoader          (Three.js Canvas wrapper)
    └── ScrollWrapper     (react-three/drei ScrollControls — drives all animation via scroll)
        ├── Hero          (scroll 0–65%: stars, clouds, window, name, bio phrases)
        ├── Experience    (scroll 65–85%: "EXPERIENCE" title + two portals)
        │   ├── GridTile "WORK AND EDUCATION"  → Timeline (reads WORK_TIMELINE)
        │   └── GridTile "SIDE PROJECTS"       → ProjectsCarousel (reads PROJECTS)
        └── Footer        (scroll 85–100%: social links — reads FOOTER_LINKS)
```

**Important scroll mechanic:** Everything is driven by `useScroll()` and `data.range(start, length)`. The scroll position (0→1) controls visibility and animation of every element. Nothing auto-plays — it's all scroll-triggered.

---

## 2. Current State (What Is Working)

### ✅ Personalization Complete
- **Hero name:** "Hi, I am Paul Zabotto."
- **Bio phrases in 3D window:** PASSIONATE ENGINEER / FINANCE & BUSINESS / VIBE CODING NEWBIE / ALL-STAR ATHLETE / CURIOUS OF EVERYTHING / TRAVELER ADDICT
- **Work & Education Timeline (10 entries):**
  1. 2021 — ESTP Paris — Engineering Degree
  2. 2023 — EDHEC Business School — Business & Finance (M1)
  3. 2023 — Vinci Energies — Business Engineer Intern
  4. 2023 — MatchMyCoach — Co-Founder & CEO
  5. 2024 — Sungkyunkwan University — Finance Major (M1)
  6. 2024 — SKARLETT — Right Hand of CEO
  7. 2025 — Tenergie — Analyst M&A Intern
  8. 2026 — UC Berkeley HAAS — Business Entrepreneurship (Master)
  9. 2026 — David French & Associates — Business Engineer Consultant
  10. 2026 — French Founders — Relationship Manager
- **Projects (4 entries):** Nepal Classroom / Hotel Acquisition / TotalEnergies Sustainability / Connected Greenhouse — all with placeholder `#` URLs pending real links/media
- **Footer links (4 links):** LinkedIn / World Map (placeholder) / Instagram / Resume
- **SEO metadata:** Title, description, keywords, Open Graph, Twitter card — all updated for Paul
- **Google Analytics:** Removed (commented out, no GA4 ID yet)

### ✅ Infrastructure
- `npm install` complete — all node_modules present
- Dev server runs on `http://localhost:3000` via `./node_modules/.bin/next dev`
- Footer recentered for 4 links (group start position: `-3` desktop, `-2` mobile)

### ⚠️ Pending Manual Action
- **`public/Resume-PZ.pdf`** — must be manually dragged into the `public/` folder. The footer link already points to it.

---

## 3. Structured Roadmap (To-Do List)

### TASK 1 — Project Media: Photos & PDF Integration
**Goal:** Each project card should be linkable to a photo gallery, PDF, or external page.

**What exists:** The `Project` type already supports `url` (single link) and `urls` (array of `{ text, url }` pairs). The project card renders a "VIEW ↗" button when `url` is set.

**Steps:**
1. Create `public/projects/` folder with subfolders per project:
   ```
   public/projects/
   ├── nepal/          ← photos from the classroom construction
   ├── hotel/          ← photos/documents for hotel acquisition
   ├── totalenergies/  ← PDF of sustainability analysis
   └── greenhouse/     ← photos/docs for Burkina Faso project
   ```
2. Drop images (`.jpg`/`.png`) and PDFs into their respective folders
3. For PDFs: update the `url` field in `app/constants/projects.ts` to point to `./projects/totalenergies/report.pdf`
4. For photo galleries: two options:
   - **Simple:** Link to an external Google Photos album or Notion page
   - **Integrated:** Build a lightbox/modal overlay inside the 3D scene (advanced — requires new component)

**File to edit:** `app/constants/projects.ts` — update `url: '#'` to real paths once files are added.

---

### TASK 2 — Replace the 3D Paintings on the Homepage
**Goal:** Swap the two existing artworks (Dalí and Caspar David Friedrich) for something more personal to Paul.

**What exists:** Two `.glb` 3D models in `public/models/`:
- `wanderer_above_the_sea_of_fog.glb` → rendered by `app/components/models/Wanderer.tsx`
- `dalithe_persistence_of_memory.glb` → rendered by `app/components/models/Memory.tsx`

These were sourced from [Sketchfab](https://sketchfab.com) under CC licenses and converted with `gltfjsx`.

**Steps to replace:**
1. Find a free `.glb` model on [Sketchfab](https://sketchfab.com/feed) (filter: downloadable, CC license)
2. Download the `.glb` file and place it in `public/models/`
3. Convert it to a React component using:
   ```bash
   npx gltfjsx@6.5.3 your-model.glb --types
   ```
   This auto-generates a `.tsx` component. Place it in `app/components/models/`
4. Update `app/components/experience/index.tsx` or wherever the models are imported to use the new component

**Ideas for replacement models (personal to Paul):**
- A 3D globe (fits the "traveler" identity)
- A mountain landscape (athletic/explorer theme)
- A miniature Eiffel Tower or French landmark
- An abstract architectural structure (fits engineering background)

---

### TASK 3 — Style & UI Modifications
**Goal:** Make the visual design more personal to Paul. Currently the site uses the original author's aesthetic.

**What can be changed (with file locations):**

| Element | File | What to change |
|---------|------|----------------|
| Background/theme colors | `app/globals.css` (`:root` vars) | `--background`, `--foreground` |
| 3D text color | e.g. `app/components/hero/index.tsx` | `color` prop on `<Text>` |
| Accent colors on tiles | `app/components/experience/index.tsx` | `color` prop on `<GridTile>` (`#b9c6d6`, `#bdd1e3`) |
| Scrollbar color | `app/globals.css` | `--scrollbarColor` |
| Project card background | `app/components/experience/projects/ProjectTile.tsx:104` | `color="#FFF"` on meshBasicMaterial |
| Fonts | `public/` + `app/layout.tsx` | Replace `.ttf`/`.woff` files and update `localFont` src |
| Favicon | `public/favicon-*.png` | Replace with personal favicon (use [favicon.io](https://favicon.io)) |

**Suggested Paul-specific color palette:**
- Deep navy blue (`#0d1b2a`) for background
- Gold/warm amber (`#c9a84c`) as accent — fits "French elegance + ambition"
- Clean white for text

---

### TASK 4 — Integrate the Interactive Travel Map
**Goal:** Link the "World Map" footer entry to Paul's interactive map project once it's live.

**Current state:** Footer entry exists with `url: '#'` and a placeholder icon (`github.svg`).

**Steps:**
1. Once the travel map project is deployed (e.g., on Vercel, GitHub Pages, or Netlify), get its URL
2. Update `app/constants/footer.ts`:
   ```ts
   {
     name: 'World Map',
     hoverText: 'Countries I\'ve visited',
     icon: 'icons/globe.svg',   // see step 3
     url: 'https://your-map-url.com',
   }
   ```
3. Add a globe SVG icon to `public/icons/globe.svg`. Source one from [heroicons.com](https://heroicons.com) or [feathericons.com](https://feathericons.com)

**Optional — embed the map inside the portfolio:** The travel map could be rendered as an iframe or a new 3D section within the portfolio itself. This would require a new section component between `Experience` and `Footer`.

---

## 4. Blind Spots & Recommendations

These are issues or gaps not explicitly requested but identified from deep code analysis:

### 🔴 Critical
- **`Resume-PZ.pdf` is missing from `public/`** — the footer "Download" button returns a 404. You must manually move the file there.
- **All 4 project URLs are `#`** — clicking "VIEW ↗" on any project card does nothing useful. Update as soon as you have real links.

### 🟡 Important
- **`reactStrictMode: false`** in `next.config.ts` — this was intentional in the original repo (likely to avoid double-rendering issues with Three.js), but means React's development warnings are suppressed. Keep it off for now.
- **`sitemap.xml` and `robots.txt`** in `public/` still reference `mohitvirli.github.io`. Update these when you deploy to your own domain.
  - `robots.txt`: Update `Sitemap:` URL
  - `sitemap.xml`: Update all `<loc>` URLs
- **Open Graph image is missing** — the metadata sets `openGraph.type = "website"` but no `openGraph.images` property. Add a screenshot of your site as `public/og-image.png` and reference it in `app/layout.tsx` for proper social sharing previews.
- **Google Analytics is commented out** — when you're ready to track visitors, create a free GA4 property and update `app/layout.tsx` with your ID.

### 🟢 Nice to Have
- **`WorldMap` footer icon** — currently reuses `github.svg` as placeholder. Replace with a proper globe icon before launch.
- **The `?` placeholder** at the end of the original timeline was removed (good). But the 3D path for 10 entries is longer than the original 5 — test the scroll speed to make sure the timeline doesn't feel too slow/fast. If it does, edit the `y` range in `app/components/experience/work/Timeline.tsx`.
- **Mobile layout for the footer** — the footer centering was adjusted for 4 links on desktop (`-3`) and mobile (`-2`). If you add a 5th link later, revert to `-4` and `-2.5`.
- **No 404 page** — Next.js serves a generic one. Add `app/not-found.tsx` for a branded error page.
- **No contact form or email link** — the portfolio has no way for visitors to reach Paul. Consider adding an email link to the footer (e.g., `mailto:paul@example.com`) or a contact section.
- **Images are not optimized** — any photos added to `public/projects/` should be compressed before deploy. Use [Squoosh](https://squoosh.app/) or convert to `.webp`.
- **The `AwwardsBadge` component exists** (`app/components/common/AwwardsBadge.tsx`) but is not used in `page.tsx`. It was likely part of an Awwwards submission. Can be safely deleted or left as-is.

---

## 5. Key Commands

```bash
# Start development server (Windows)
./node_modules/.bin/next dev

# Build for production
./node_modules/.bin/next build

# Start production server
./node_modules/.bin/next start

# Kill all running Node processes (if port is stuck)
taskkill /F /IM node.exe
```

---

## 6. Files I Will Edit Most

| Task | File |
|------|------|
| Change name / bio phrases | `app/components/hero/index.tsx`, `app/components/hero/TextWindow.tsx` |
| Update work history | `app/constants/work.ts` |
| Update projects + links | `app/constants/projects.ts` |
| Update social links | `app/constants/footer.ts` |
| Change page title / SEO | `app/layout.tsx` |
| Change colors / scrollbar | `app/globals.css` |
| Replace 3D models | `app/components/models/`, `public/models/` |
| Add resume | `public/Resume-PZ.pdf` |
