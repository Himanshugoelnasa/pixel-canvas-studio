# PixelForge AI — Premium AI Image Studio (mock-data SaaS)

A complete, dark-first AI image generation and batch processing product, fully clickable with realistic demo data. No backend — everything runs on a mock data layer so every screen looks alive.

## Visual direction

- Deep near-black backgrounds with soft purple→cyan glows, glass panels, large rounded cards, minimal borders.
- Gradient accents reserved for: primary buttons, active nav, progress, credits, hero, selected states, charts, empty-state art.
- Modern typography pairing, generous spacing, restrained micro-interactions (hover lift, image reveal, shimmer skeletons, toast + modal transitions).
- Fully responsive: sidebar collapses, mobile gets a slide-out menu plus bottom nav, generation settings become collapsible sheets.

## Build order

**Phase 1 — Foundation**
Design tokens (gradients, glass, glow, radii), app shell (collapsible sidebar with credits/upgrade/profile footer, top bar with search, breadcrumbs, credits, notifications, theme toggle, avatar), toasts, reusable primitives: image card, stat card, modal, slider, tabs, dropdown, data table, chart, empty/loading/error states, context menu, command palette (⌘K).

**Phase 2 — Mock data layer**
Seeded demo account: 30+ generations with real prompts/metadata, 10 projects, 12 templates, 8–9 models, 10 batch jobs (one actively progressing), 20 notifications, usage series, invoices, API keys, team members. Curated stock imagery across portraits, landscapes, products, fashion, cars, food, fantasy, sci-fi, anime, thumbnails.

**Phase 3 — Generation Studio (highest priority)**
Mode tabs (text→image, image→image, sketch, pose, remix, inpaint, outpaint, ControlNet, style transfer); large prompt workspace with token counter, enhance/random/clear, prompt history; right settings rail: model cards, reference-image dropzone with weight/type, aspect ratio, resolution, quality, image count, seed controls, negative prompt, guidance sliders, advanced accordion, style picker with thumbnails, camera/lighting controls. Simulated generation queue drawer with progress, ETA and statuses; results grid with full hover action set; full-screen image detail modal with metadata and actions.

**Phase 4 — Batch Studio**
Three-step wizard (input: prompt list / CSV / JSON / catalog; configuration; variable mapping table with `{{variables}}`), preview summary of prompts/images/credits/time, batch dashboard with live progress, pause/resume/cancel/retry, results grid with filters, bulk selection, download/export actions, logs view.

**Phase 5 — Creative tools**
Image editor shell (tool rail, layers, history, properties, undo/redo), upscaler with before/after slider, background remover, variations comparison grid.

**Phase 6 — Library & account**
Gallery (grid/masonry/list, filters, search, multi-select bulk actions), projects, favorites, history, templates, models marketplace, collections; usage analytics with charts and time filters, billing with plans/invoices, settings tabs, team, API keys with code samples, notifications, security.

**Phase 7 — Auth & onboarding**
Split-screen login with artwork overlay, sign up, forgot/reset password, email verification, OAuth buttons; 3-step onboarding ending in a first-generation success animation. Plus help center, docs, shortcuts, feedback, changelog.

## Flows that work end to end

Login → onboarding → dashboard → create image → configure → generate → queue → results → detail → edit/upscale → save to project → download.
Dashboard → batch studio → upload CSV → map variables → configure → preview → start → processing → results → bulk download.

## Technical notes

- TanStack Start + React + TypeScript + Tailwind v4 tokens in `src/styles.css`; shadcn components; sonner toasts; Recharts for analytics.
- One route file per page under `src/routes`, each with its own SEO head metadata; shared layout in `__root.tsx`.
- Mock service layer in `src/mocks` with typed entities and simulated async latency/progress so queues and batch jobs animate believably; client state via React context + TanStack Query.
- Accessibility: keyboard nav, focus rings, labelled controls, accessible dialogs and tooltips.

This is a large build delivered in the phases above, prioritising Generation and Batch Studio quality.
