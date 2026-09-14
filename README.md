# Octen Homepage

> Octen AI Official Homepage replica with high-performance search infrastructure, interactive 3D hero, multimodal showcase, and custom responsive navigation.

## 🚀 Features

- **Pixel-perfect Hero & Dashboard**: Integrated static search dashboard with custom vector glow styling.
- **Modern Responsive Navigation**:
  - Radix NavigationMenu with custom dual-column Products showcase and compact Developers menu.
  - Zero-morphing instant dimension switching.
  - Translucent hover pills (`rgba(51, 51, 51, 0.5)`).
- **Omni Search Section**:
  - Center-aligned Omni Search typography with non-intrusive Early Access badge.
  - Direct playground access and multimodal feature cards.
- **Web Search & Search Infrastructure**:
  - Interactive benchmarks, architecture comparison, and real-time indexing capabilities.
- **Vite Local Dev Environment**:
  - Local image proxy & real-time live reload on assets and templates.
  - Locked to `http://localhost:3001/`.

## 🛠️ Tech Stack

- **Framework**: React 18, TypeScript, Vite 6
- **Styling**: Tailwind CSS, CSS Modules
- **Animations**: Framer Motion, Lucide Icons
- **Package Manager**: `pnpm`

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/)

### Installation & Run

```bash
# Install dependencies
pnpm install

# Start development server (http://localhost:3001/)
pnpm dev

# Build production bundle
pnpm build
```

## Implementation guardrails

This project serves a mirrored SSR homepage from `index.html`. The page's hydration scripts can replace or reorder markup after the initial HTML is parsed. When adding a new homepage section:

- Insert it relative to a stable rendered landmark (for example, the `Omni Search` section), rather than relying only on a static source offset.
- If the section must be mounted after hydration, use the existing post-hydration mount script and make the insertion idempotent with a unique id.
- Put section CSS in the document head or a global stylesheet. Do not rely on a `<style>` tag nested inside dynamically injected HTML; hydration can discard it and leave only unstyled markup.
- Keep Figma dimensions as the desktop reference, then add explicit responsive rules. For the Vertical Search reference (`13625:179114`), preserve the 80px top padding, 1280px content width, 40px copy/card gap, 60px card gap, and the 558px / 656px / 558px card proportions.
- After changing a mirrored section, run `pnpm build`, refresh both local preview ports when used (`3000` and `3001`), and verify the rendered DOM and visual position below Omni Search. A source grep alone is not sufficient because hydration may change the final DOM.

### Figma implementation checklist

1. Read the Figma node with `get_design_context` before coding and record its node id, spacing, typography, colors, and assets.
2. Adapt the reference to this mirrored HTML architecture instead of pasting generated React/Tailwind code into the page.
3. Verify the section after hydration in a fresh browser tab and confirm its heading, button, cards, and background are visible.

### Vertical Search motion rules

The carousel follows the Calendly “SEAMLESS LOOP” timing: hold each centered card for 2.8s, move left for 1.2s, and advance every 4s. Use three repeated groups, a 60px gap, `cubic-bezier(.76,.01,.29,.99)` for the displacement, 85% scale for side cards, and 100% for the centered card. Pause while the carousel is hovered or focused, and pause when it is off screen or the document is hidden.
