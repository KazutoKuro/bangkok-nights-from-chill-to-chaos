# Page Design — Animated Presentation Website (Desktop-first)

## Global Styles
- Design tokens
  - Background: #0B0D12 (near-black)
  - Text: #EDEFF6 (off-white)
  - Muted text: #AAB0C0
  - Accent: #7C5CFF
  - Surface/card: rgba(255,255,255,0.06)
  - Border: rgba(255,255,255,0.10)
- Typography
  - Base: 16px; scale: 16/20/28/40/56
  - Headings: tight line-height (1.05–1.15); body: 1.5–1.7
- Links/buttons
  - Link: underline on hover; accent color
  - Buttons: solid accent; hover brighten; focus-visible ring
- Motion
  - Default easing: ease-out; duration 250–600ms
  - Respect `prefers-reduced-motion` (disable non-essential animations)

---

## 1) Presentation (Home) Page

### Layout
- Primary system: CSS Grid for outer shell + Flexbox within components.
- Viewport behavior: Each slide is a full-viewport section (`min-height: 100vh`) stacked vertically.
- Spacing: 24–40px internal padding; max content width ~1100px centered.
- Responsive (desktop-first): At <1024px reduce padding and type scale; images stack below text.

### Meta Information
- Title: "Animated Presentation"
- Description: "Fullscreen animated slides loaded from local research documents."
- Open Graph: title/description + a default cover image (if present) for sharing.

### Page Structure
1. Fixed chrome layer (non-scrolling)
2. Scrollable slide rail (vertical)
3. Per-slide content grid (text + media)

### Sections & Components

#### A. Fixed Chrome Layer
- Top-left: minimal site title (optional) kept subtle.
- Top-right: hint text for navigation (e.g., “Scroll / ↑ ↓”) that fades after first interaction.
- Accessibility: Skip link (visually hidden) to slide container.

#### B. Slide Rail (Scrollable Container)
- Container
  - Uses native scroll with optional `scroll-snap-type: y mandatory`.
  - Programmatic snapping on navigation to align slides perfectly.
- Interaction handling
  - Keyboard: ArrowUp/ArrowDown, PageUp/PageDown, Space/Shift+Space.
  - Scroll: Debounced wheel/trackpad to switch one slide at a time.
  - Focus: The rail is focusable so keyboard input works reliably.

#### C. Slide Section (Repeated per slide)
- Structure
  - Fullscreen section with centered content.
  - Two-column grid on desktop: left = narrative text; right = media.
- Content elements
  - Slide title (H1/H2 depending on hierarchy)
  - Body text blocks (paragraphs / lists)
  - Media gallery populated from `/research-images/slide-X-imgs`
- Media display
  - 1–2 images: large hero image(s) with contain/cover options.
  - 3+ images: responsive grid (2–3 columns desktop) with consistent aspect ratios.
- Animation
  - Slide transition: fade + slight translate (or crossfade) between active slides.
  - In-slide reveal: staggered text/media entrance when slide becomes active.
- States
  - Loading: skeleton placeholders for text/media.
  - Error: inline panel stating which asset group failed (slides vs images) and basic recovery hint (reload).

---

## 2) Not Found Page

### Layout
- Centered single-column layout, max width ~720px.

### Meta Information
- Title: "Page Not Found"
- Description: "The page you requested does not exist."

### Sections & Components
- Message block: short heading + one-line explanation.
- Primary action: link/button back to `/`.
