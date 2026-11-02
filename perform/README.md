# Octen — Built to Perform

React + TypeScript + Vite implementation of the **Built to Perform** section from the Figma file `Octen_汇总`:

- **Speed** tab — `Web Search latency` table (P50 / P90 / DIFF) and `Time per Task` bar chart
- **Search Index** tab — `Search API performance profile` radar chart + comparison table (hovering a row or a radar shape highlights that provider)
- Accuracy / Scale / Freshness tabs are wired up with a placeholder panel

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # serve dist/
```

Tabs are deep-linkable: `#speed`, `#search-index`, …

## Structure

```
src/
  main.tsx, App.tsx
  styles/          tokens.css (Figma colours, type, spacing), global.css, fonts.ts (self-hosted fonts)
  data/            all numbers live here — edit data, not components
    providers.ts     provider names, logos, hover accents
    latency.ts       Web Search latency (SealQA Hard, us-west-1)
    timePerTask.ts   Time per Task (Artificial Analysis)
    searchIndex.ts   Search Index rows, radar axes + normalisation, table column order
    tabs.ts          tab labels and per-tab headline copy
  components/      Card, Tabs, SectionHeader, Metric, ProviderLogo,
                   LatencyCard, TimePerTaskCard, RadarChart, ComparisonTable, SearchIndexCard
  sections/        BuiltToPerform (header + tabs + panels)
  assets/logos/    provider logos exported from Figma
```

Styling uses CSS Modules + CSS custom properties (`src/styles/tokens.css`); no runtime CSS-in-JS.

## Data notes

- Search Index data: Artificial Analysis Search Index, data as of Oct 19, 2026; answer model GPT-5.6 Luna (medium).
- **Cost per Task** = (Search $/1k + Model $/1k) ÷ 1000.
- Radar axes are all "outer edge is better": DeepSearchQA F1, BrowseComp and Omniscience accuracy are plotted as reported;
  **Cost Efficiency** and **Speed** = best Cost / Time per Task among the shown providers ÷ provider value × 100.
- The latency bar track spans 0–2300 ms (`LATENCY_DOMAIN_MS`); longer values clip at the end of the track, as in the design.
