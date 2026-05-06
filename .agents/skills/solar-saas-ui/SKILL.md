---
name: solar-saas-ui
description: "Design system for energetic SaaS and product landing pages — warm white backgrounds, vibrant orange accents, glass-morphism dashboard heroes, and grid-based spatial layouts. Use this skill whenever the user wants to build a startup landing page, SaaS product page, app showcase, or any interface that needs to feel modern, metric-driven, and conversion-focused with a light, airy palette. Trigger on mentions of SaaS landing pages, product demos, dashboard showcases, startup sites, warm accent colors, or when the user asks for something that feels energetic, clean, and app-like."
---

# Solar SaaS UI — Warm Product Landing System
  
## 1. Meta Directive

You build **high-energy SaaS and product landing pages**. The aesthetic is a warm white canvas, one vibrant orange accent, clean geometric typography, and a grid-based spatial language that feels technical without being cold. Think conversion-optimized startup pages, app showcases, or tool landing pages — anything that needs to feel alive, trustworthy, and product-forward.

**Core identity:** warm white substrate + orange punctuation. The mood is confident momentum, not corporate quiet.

---

## 2. THE "ABSOLUTE ZERO" DIRECTIVE

If your output includes ANY of the following, the design fails:

- **Banned Colors:** Pure black text (`#000000`). Cool blue or purple accents. Gradients on backgrounds or cards.
- **Banned Typography:** Serif fonts. More than two font families. `font-bold` on display headings.
- **Banned Shapes:** Sharp `rounded-none` corners on interactive elements. Square buttons — CTAs are always pills (`rounded-full`) or soft rectangles (`rounded-lg` minimum).
- **Banned Layouts:** Edge-to-edge content without a grid background in the hero. Missing a product mockup or dashboard visualization in the hero.
- **Banned Motion:** Default `linear` transitions. Missing hover states on buttons and cards. No entrance animations.

---

## 3. TOKENS

### Colors
```css
--accent:       #f97518;  /* warm orange — THE ONLY chromatic color */
--bg-primary:   #ffffff;  /* pure white page background */
--bg-surface:   #fbfbfc;  /* subtle warm gray for dashboard interiors */
--text-dark:    #1e0d01;  /* warm near-black — never pure black */
--text-muted:   rgba(30, 13, 1, 0.6);  /* body copy opacity */
--text-faint:   rgba(30, 13, 1, 0.4);  /* labels, microcopy */
--border:       rgba(30, 13, 1, 0.1);  /* hairline dividers */
--accent-glow:  rgba(249, 117, 24, 0.4);  /* shadow and blur color */
```

> The accent is intentionally warm (orange, not red). Swapping to a warm coral, amber, or golden yellow re-skins the energy while keeping the same SaaS personality.

### Typography
- **Display / headings:** `Geist` — weights 400–600, tight negative tracking (`tracking-[-3.5px]` at hero). Use `font-medium` or `font-normal`, never bold on display.
- **Body / UI:** `Inter` — weights 400–500, `text-[16px]` or `text-lg`, `leading-relaxed`.
- **Accent words in headings:** Use `text-accent` inline to highlight the product promise.

### Spacing & Shapes
- Section padding: `pt-[100px] pb-[80px]` for hero; `py-24` for content.
- Container: `max-w-[1160px] mx-auto px-[30px]`.
- Buttons: `rounded-full` (pill) for primary CTAs; `rounded-lg` for secondary. Card radius: `rounded-card` (`24px`). Inner content: `rounded-inner` (`12px`).
- Shadows: `shadow-cta` (`0 10px 20px -5px rgba(249, 117, 24, 0.4)`) for primary buttons. Subtle `shadow-sm` for cards. Never heavy dark drop shadows.

---

## 4. SECTION RHYTHM

This system is **hero-heavy** — most of the visual identity lives in the hero. Below that, sections alternate simply:

```
Hero          → white (with grid background layer)
Features      → white or subtle warm surface
Testimonials  → white
Pricing       → white
CTA           → white
Footer        → white
```

The page stays predominantly white. Contrast and rhythm come from the grid lines, the dashboard mockup, and the orange accent, not from background alternation.

---

## 5. COMPONENT MASTERY

### A. Grid Background Layer

The hero MUST include a subtle technical grid that creates spatial depth without clutter:
- **Vertical lines:** 3–5 dashed vertical lines (`border-l border-dashed border-brand-dark/10`) distributed across `max-w-[1280px]`, centered.
- **Horizontal lines:** 2–3 dashed horizontal lines at strategic heights (`mt-[100px]`, `mt-[400px]`), using `bg-gradient-to-r from-transparent via-brand-dark/10 to-transparent`.
- **Intersection dots:** Small `w-1.5 h-1.5 bg-brand-dark/20 rounded-full` at grid crossings. Add a `bg-brand-primary/20 blur-[2px]` glow dot at key intersections.
- **Ambient glow:** A large `bg-brand-primary/5 blur-[120px] rounded-full` positioned behind the content area for warmth.
- All grid elements are `pointer-events-none` and `absolute inset-0`.

### B. Glass Header

A clean, non-glassy nav (this system keeps the header simple to let the hero breathe):
- Height: `h-[99px]`, `py-6`.
- Logo: icon in a `w-10 h-10 bg-accent rounded-xl` with `group-hover:rotate-6` + wordmark.
- Nav links: `text-[16px] font-medium text-brand-dark hover:opacity-70 transition-opacity`.
- CTA: `rounded-full bg-accent text-white w-[158px] h-[51px]` with trailing arrow that `group-hover:translate-x-1`.

### C. Hero Architecture

The hero is a **centered flex column** with a massive floating product mockup below the text.

**Text block (centered, `max-w-[630px]`):**
1. **Version tag:** Inline-flex pill with live indicator. Contains a `bg-accent/10` sub-pill with a pulsing dot (`animate-pulse-slow`) + "Live" label, plus a muted version string.
2. **Headline:** `text-[64px] leading-[64px] tracking-[-3.5px] font-medium`. One key phrase in `text-accent`.
3. **Subtext:** `text-[18px] leading-[28px] text-brand-dark opacity-60 max-w-[630px]`.
4. **Primary CTA:** Pill with `bg-hero-gradient` (radial gradient from transparent to accent) + `hero-shadow` (inset glow + drop shadow). Contains text + arrow icon.
5. **Rating pill:** Inline-flex with avatar stack (`-space-x-2`), separator lines, review count, and 5 gold stars (`text-[#eba100]`).

**Dashboard mockup (floating, `animate-float-slow`):**
- Outer container: `p-3 bg-white/20 rounded-card backdrop-blur-md border border-brand-dark/5`.
- Inner frame: `aspect-[16/10] lg:aspect-[16/9] rounded-inner border border-brand-dark/10 bg-[#fbfbfc]`.
- **Sidebar:** `w-16 md:w-56`, white, with logo placeholder and nav items.
- **Content area:** Top nav bar + scrollable dashboard content.
- **Stats cards:** 4-column grid of white cards with `rounded-xl border border-brand-dark/5 shadow-sm`. Each has a micro label (`text-[10px] uppercase`), a large metric, and a visual indicator (progress bar or mini chart).
- **Main chart:** Large card with bar chart using accent-tinted bars. Bars animate with `animate-pulse` on the active column.
- **Activity feed:** Side panel with event items, each with a colored icon circle.
- **Floating overlay:** A glass card (`bg-white/95 backdrop-blur shadow-2xl rounded-2xl`) positioned absolute over the dashboard, containing a mini stat with progress bar.

### D. Pill CTA (Primary Action)

Every primary action is a pill with a **translating arrow**:
- Structure: `rounded-full` container with inner `bg-accent` fill.
- Text: `font-semibold text-[16px] text-white opacity-90`.
- Arrow icon container: `w-6 h-6 overflow-hidden`. The SVG `group-hover:translate-x-1`.
- Hover: `hover:scale-105 active:scale-95`. Add `hover:shadow-cta`.

### E. Glass Cards

Cards that float above content use:
- `bg-white/20 backdrop-blur-md border border-brand-dark/5 rounded-card`.
- Inner content uses `bg-white` or `bg-[#fbfbfc]` with `rounded-inner`.
- The double-layer (glass outer + solid inner) is the signature depth pattern.

### F. Live Indicator

A pulsing status dot used in version tags or status badges:
- Outer: `relative w-2 h-2 rounded-full bg-accent`.
- Inner: `absolute inset-0 rounded-full bg-accent animate-pulse-slow`.
- Always paired with a label in a `bg-accent/10` pill.

### G. Rating Pill

Social proof element: inline-flex row containing:
- Avatar stack: `flex -space-x-2` with `w-7 h-7 rounded-full border-2 border-white` images.
- Separator: `w-px h-4 bg-brand-dark opacity-10`.
- Review count text.
- Rating number + 5 filled star SVGs at `text-[#eba100]`.

### H. Footer

Minimal, clean footer:
- Branding left, nav links center/right.
- Social icons in `w-9 h-9 rounded-full border border-border hover:border-accent` circles.
- Copyright centered, `text-[14px] text-text-muted`.

---

## 6. MOTION RULES

| Effect | Duration | Easing | Property |
|---|---|---|---|
| Scroll reveal | 1s | `ease-out` | `opacity`, `transform` |
| Button hover | 300ms | default | `transform`, `opacity` |
| Arrow translate | 300ms | default | `transform` |
| Float animation | 6s | `ease-in-out` | `transform` (infinite) |
| Pulse animation | 3s | `ease-in-out` | `transform`, `opacity` (infinite) |
| Image scale | 700ms | default | `transform` |
| Link opacity | 300ms | default | `opacity` |

**Rules:**
- Animate ONLY `transform` and `opacity` for performance.
- The dashboard float is intentionally slow (6s) — it creates living, breathing product energy.
- Use `group-hover:` for compound hover states.

---

## 7. RESPONSIVE CONTRACTS

- **Hero heading:** `text-4xl` → `text-5xl` → `text-[64px]`.
- **Dashboard mockup:** Maintains aspect ratio; sidebar collapses to icon-only (`w-16`) on mobile, expands to full (`w-56`) on `md+`.
- **Stats grid:** `grid-cols-2` on mobile → `grid-cols-4` on `lg:`.
- **Chart + activity:** Stack vertically on mobile (`grid-cols-1`), side-by-side (`grid-cols-3` with chart spanning 2) on `lg:`.
- **Floating overlay:** Hidden on mobile (`hidden lg:block`).
- **Grid background:** Simplify on mobile — fewer vertical lines, hide intersection dots.
- **Nav:** Full links hidden on mobile; show hamburger or collapse.

---

## 8. ADAPTATION GUIDE

To re-skin this system:
1. Change `--accent` to any warm hue (coral, amber, golden yellow).
2. Change `--text-dark` to match the accent warmth (warm black for orange, cool black for blue).
3. Keep `--bg-primary` white and `--bg-surface` as a subtle warm gray.

The grid background, dashboard mockup, glass layering, and pill CTAs are the structural signatures. They must remain constant.

---

## 9. PRE-OUTPUT CHECKLIST

Evaluate your code before delivering:
- [ ] Background is white (`#ffffff`); text is warm near-black (`#1e0d01`), not pure black.
- [ ] Only one accent color exists (`#f97518` or equivalent warm hue).
- [ ] Geist is used for headings; Inter for body. No additional fonts.
- [ ] Hero includes a grid background with dashed lines and intersection dots.
- [ ] Hero contains a floating dashboard/product mockup with `animate-float-slow`.
- [ ] Dashboard mockup uses glass outer (`bg-white/20 backdrop-blur-md`) + solid inner (`bg-[#fbfbfc]`).
- [ ] Primary CTAs are `rounded-full` pills with `hover:scale-105` and translating arrow.
- [ ] Version tag includes a pulsing live indicator dot.
- [ ] Rating pill uses avatar stack + gold stars.
- [ ] Stats cards use micro labels (`text-[10px] uppercase`) + large metrics + visual indicators.
- [ ] All hover effects use `group-hover:` with `transform` only.
- [ ] The overall impression feels like a Series B startup page, not a bootstrap template.
