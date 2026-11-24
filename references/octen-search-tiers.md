# Octen Search — three tiers（主功能模块内容提取）

> 来源：`references/octen-homepage-hifi.html` 第 ② 模块「Octen Search: overview + per-tier」(约 389–469 行)。
> 页面实现：`src/sections/03b-search-tiers.html` + `public/css/octen-tiers.css` + `public/js/octen-tiers.js`。

## 模块头

- Eyebrow：Octen Search(页面胶囊改为 "Search products")
- 标题：One search system, three tiers.(页面标题改为 "Every search your AI needs, one key")
- 副标题：Your AI asks for everything — a quick lookup, a live web search, the best result on a hard topic. One Octen key serves all three, each at the speed and cost that call needs, and nothing more.
- 轴：Fastest ⟶ Highest quality（Pulse → Fast → Premier）

## 概览（三卡）

| Tier | 一句话 | 延迟 / 级别 | 价格 |
|---|---|---|---|
| Pulse | Generative retrieval — URLs in one model inference. | ~10 ms | $0.1–0.2 / 1k |
| Fast | The live web, ranked — across text, images and video. | ~62 ms | $1–5 / 1k |
| Premier | The highest-quality tier — best results for each domain. | premium | $3–5 / 1k |

---

## 1. Octen Pulse · ~10 ms

- 标题：The model is the index.
- 描述：Pulse returns relevant URLs through generative retrieval — the model recalls the web directly, with no crawl and no ranking pass. Fast and cheap enough to call on every step of an agent loop.
- 产品：Pulse Search
- Meta：~10 ms · $0.1–0.2 / 1k · routing, pre-fetch & in-loop lookups
- 图示：query → [model = index · one inference] → URL（顶部标 ~10 ms）
- 图注：No crawl, no ranking pass — the model maps the query straight to a URL.
- 适用（FAQ）：when the query points to a known page and speed or cost matters most.

## 2. Octen Fast · ~62 ms

- 标题：Real-time search, one call per surface.
- 描述：A family of live-web APIs, each its own endpoint: Web for general queries, Broad to split a hard question into concurrent sub-queries, Image and Video for visual results. Call just the one your task needs.
- 产品：Web · Broad · Image · Video · Sense (Soon)
- Meta：~62 ms · $1–5 / 1k · grounding answers & research agents
- API 网格：
  - Web — ranked links
  - Broad — concurrent sub-queries
  - Image — visual results
  - Video — clips + timestamps
  - Sense (Soon) — cameras, robots & devices
- 图注：Separate real-time APIs — one per surface. Call just the one your task needs.
- 补充：Latency holds flat from 1K to 1M+ QPS（62 ms，Octen internal load test）。

## 3. Octen Premier

- 标题：Our best results, tuned per domain.
- 描述：Premier is the highest-quality tier. Where structure helps, it returns structure — News groups coverage into one event with full lineage, Business returns company profiles, Place returns location intelligence. Where it doesn't, Web Premier simply returns markedly better web results. Structure is one way we lift quality, not the point.
- 产品：News · Business · Place · Design (Soon) · Web Premier (Soon)
- Meta：$3–5 / 1k · highest-quality results, per domain
- 示例卡（News Search · POST /news-search）：
  - Event · Fed rate decision（deduped）
    - 05:38 US stocks retreat from record highs on oil-driven inflation fears
    - 03:50 Treasury 10-year yields hold near two-decade highs after $39B auction
    - 01:20 Fed swaps price in higher peak rate as Brent crude crosses $90
  - Sources：bloomberg.com · reuters.com · wsj.com · +6
- 图注：Structure where it lifts quality — News → event, Business → profile, Place → location. Web Premier returns better web results, no structure.
- 适用（FAQ）：Web Search Premier when the results must contain the answer, like agent Q&A or a specific fact.

## 选型（FAQ: Which search API should I use?）

Start with Web Search. Switch when the query calls for it:
- **Pulse Search** when the query points to a known page and speed or cost matters most.
- **Web Search Premier** when the results must contain the answer, like agent Q&A or a specific fact.
- **Image, Video, News, Business or Place Search** when you want that type of result.

## 页面 Premier 画廊用到的文案(2026-11-24)

来源:用户提供的 "Search by type" 参考截图(布局与文案),颜色不参考。
- News Search — Live news grouped into one event — related coverage and sources together.(示例:Port strike enters third day · 14 sources / 3 original / 11 reprints merged · Updated 18 min ago · Sub-event: talks resume Friday)
- Business Search — Companies and people, returned as structured entity cards.(示例:Northwind Robotics · Founded 2019 · HQ Berlin · Series B · northwind.example,虚构)
- Place Search — Places by location — cards with hours and ratings, plus optional web results.(示例:Harbor Street Coffee · 4.6 ★ · Open until 18:00,虚构)
- Design Search (Soon) — Design references — web pages, app screens, slides.
- Web Premier (Soon) — Markedly better web results, for queries where the results must contain the answer.(取自 hifi 参考页 + FAQ;对比插画为示意)
