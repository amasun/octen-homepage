# 项目交接与核心架构上下文 (Handoff Context)

## 📌 1. 项目概况与开发规范
- **仓库地址**: [amasun/octen-homepage](https://github.com/amasun/octen-homepage) (`main` 分支)
- **本地服务**: `http://localhost:3001/`（已锁定端口，开启全量文件实时热更新 `live-reload`）
- **包管理器**: 强制使用 `pnpm`（绝对禁止使用 `npm install`）
- **构建验证**: 每次修改后需执行 `pnpm run build` (`tsc && vite build`) 确保 0 报错通过

---

## 📂 2. 代码架构分层与核心决策
1. **单一真实数据源架构**：
   - 核心运行入口为根目录 [index.html](file:///x:/XCoding/Octen/hompage/index.html)。
   - 历史混淆的 Next.js 客户端脚本已全量清除，彻底根除客户端水合冲突与双重页面渲染隐患。
   - 原内联在 HTML 中的庞大样式和交互脚本已按 DOM 结构解耦抽取至 `public/css/` 与 `public/js/`，主 HTML 结构清晰轻量。
2. **双端同步机制**：
   - 当前页面直接依赖 [index.html](file:///x:/XCoding/Octen/hompage/index.html) + `public/css/` + `public/js/` + `public/assets/` 运行。
   - `src/components/*.tsx` 为手写的高质量 React 18 + TS 组件（供工程化维护）。
   - **核心约束**：修改界面样式或结构时，需同步维护 `public/` 静态资源与 `src/components/` 源码组件，确保双端一致。

---

## 🎨 3. 核心功能模块与重要设计决策

### A. 导航栏 (Navbar)
- **下拉菜单**: Products（821px 三列布局）与 Developers（208px 紧凑布局）下拉卡片，采用原生防抖事件驱动，尺寸锁死无形变抖动。
- **关联文件**: [public/css/navbar.css](file:///x:/XCoding/Octen/hompage/public/css/navbar.css) 与 [public/js/navbar.js](file:///x:/XCoding/Octen/hompage/public/js/navbar.js)。

### B. Web Search (General Search)
- **标签规范**: 顶部标签由 `Web Search API` 统一更名为 `General Search`（与垂直搜索分类对齐）。
- **卡片实线**: Human Search 与 Octen Search 的外框及纵向列分割线已全量改为**实线**（`border-solid`），杜绝草稿感。

### C. Image & Video Search
- **并排架构**: 深度对齐 Figma 13631:182359，左右各 630px 双列并排，居中挂载于 1280px 容器。
- **标题绝对居中**: `Early Access` 标签采用绝对定位脱离文档流（`left: calc(100% + 12px); top: 50%`），确保标题与下方卡片 100% 绝对数学居中。
- **行动点 CTA**: 描述文字下方居中配置高精幽灵外框按钮 `Request Access ↗`，带绿色柔光悬停微动效。
- **关联文件**: [public/css/modalities-search.css](file:///x:/XCoding/Octen/hompage/public/css/modalities-search.css) 与 [src/components/ImageVideoSearch.tsx](file:///x:/XCoding/Octen/hompage/src/components/ImageVideoSearch.tsx)。

### D. Vertical Search (核心高频迭代区)
- **胶囊标签**: 深度对齐 Figma 13625:179118 规范（`height: 32px; border-radius: 19.5px;`），附带专属翠绿色立体三角锥矢量图标 [icon-vertical-tag.svg](file:///x:/XCoding/Octen/hompage/public/assets/icon-vertical-tag.svg)。
- **顶部 Tabs 简化**: 移除原有顶部 3 个垂直 Tab 切换按钮，界面整体聚焦并**纯粹保留 News（新闻搜索）完整流水线动画演示**。
- **动态流水线时序**:
  1. **首屏静态保底**: 页面初次加载时为待输入静态状态，严禁后台空跑动画。
  2. **视口滚动触发**: 挂载 `IntersectionObserver`，当画布滚入可视区域达 15%（约 80px）时才正式激活流水线。
  3. **Step 1 (打字机)**: 逐字平滑输出行业搜索 Query（`Strait of Hormuz shipping disruptions`），光标呼吸闪烁。
  4. **Step 2 (检索等待)**: 14 个黑色波浪脉冲圆点起伏检索。
  5. **Step 3 (时间轴卡片瀑布流)**: 
     - 搜索框与统计数据（`2 subjects · 10 articles · 89 ms`）先平稳停留 **2.0s**；
     - 随后搜索框上移出视口，满屏 3 张卡片瀑布流，后续新卡片均自底部（Slot 3）平滑推入；
     - 5 张卡片完成向上流动后停留 3.0s，随后重循环新闻检索流水线；
     - 鼠标悬停画布时暂停动画，移出平滑恢复。
- **底部 More scenarios 走马灯交互 (Hover 驱动 & Unhover 恢复)**:
  - **悬停打断动画并即时呈现 Query**：鼠标悬停在走马灯中任意场景按钮（如 Legal、Sport、Code、Design 等）时，会立即打断当前的 News 动画播放，重置到 Step 1 居中状态，并**无动画直接显示该场景对应的真实检索 Query**（例如 Legal 对应 `Antitrust precedents in AI agent autonomous transactions`），同时将背景水印图标同步切换为该场景图标。已彻底移除点击交互逻辑。
  - **随机切换渐变背景**：每次悬停进入不同场景按钮，同时会从渐变变量池（Academic 天青蓝、Business 暖金琥珀、Purple 薰衣草紫、News 翠绿荧光）中随机挑选一款与当前不同的颜色平滑过渡。
  - **Unhover 移出后无缝回到 News 动画播放**：当鼠标离开底部场景按钮及走马灯区域后（经 120ms-150ms 跨按钮微防抖，保证用户在相邻按钮间滑过时不发生抖动），系统会自动执行 `resetToNews()`，将卡片背景渐变平滑恢复为 News 翠绿色、主题标题恢复为 `News Search`、水印图标恢复为 `/assets/icon-news.svg`，并立即**重新激活并循环播放 News 动画流水线**（Step 1 逐字打字机 ➔ Step 2 14 点检索波浪 ➔ Step 3 阶梯卡片瀑布流）。
- **卡片主题文字 (Figma 13661:7381 / 13631:181771)**:
  - 深度还原 Figma 规范：位于巨型卡片顶部（`top: 172px; left: 50%; transform: translateX(-50%);`），字体为 `Fraunces:SemiBold` 30px，行高 24px，文字黑色。
  - 默认及 News 播放状态下展示为 `News Search`。
  - **Step 2 随输入框等距位移同步上移出画框消失**：在 Step 2 检索开始时，输入框从卡片中央向上滑移至顶部 `top: 36px`（输入框顶边缘位移量为 `36px - 233px = -197px`）。`News Search` 标题以 100% 严格一致的物理位移（`-197px`，即自 172px 上移至 -25px 超出卡片上边框）以及完全相同的贝塞尔曲线时序（`0.65s cubic-bezier(0.16, 1, 0.3, 1)`）与输入框等距锁定向上推移，保持两者相对间距恒定为 61px，并在推至画框顶边缘时（配合 0.25s 延时渐隐）顺畅滑出画框外消失；闭环重循环至 Step 1 时同样以等距时序平滑归位。
  - 悬停底部走马灯不同场景时（如 Legal、Academic、Business、Sport、Code 等），该文字会同步、动态且瞬间切换为对应的主题文字（例如 `Legal Search`、`Academic Search`、`Business Search` 等）。
- **图标来源一致性对齐 (以底部按钮为准)**:
  - 巨型卡片水印图标（`canvasWatermarkIcon`）彻底废弃外部通用矢量 Lucide 代码，**100% 统一直接读取底部按钮中正在使用的原生矢量 SVG 资产**（`/assets/icon-*.svg`，如 `icon-news.svg`、`icon-legal.svg`、`icon-sport.svg` 等）。
  - 悬停走马灯任意场景时，实时自对应按钮 DOM 的 `<img>` 标签直接读取 `src` 并注入巨型卡片水印区，以 280x280px + 0.12 不透明度呈现，确保图标形态、笔画细节与底部按钮完全一致。
- **关联文件**: [index.html](file:///x:/XCoding/Octen/hompage/index.html)、[public/css/vertical-search.css](file:///x:/XCoding/Octen/hompage/public/css/vertical-search.css)、[public/js/vertical-search.js](file:///x:/XCoding/Octen/hompage/public/js/vertical-search.js) 及 [src/components/VerticalSearch.tsx](file:///x:/XCoding/Octen/hompage/src/components/VerticalSearch.tsx)。

### E. 页脚 (Footer)
- **架构与排版**: 
  - 顶部全宽贯穿线与 Slogan（`The Foundation of Real-Time AI`）。
  - 5 列横向排布（`GET IN TOUCH`、`SEARCH`、`OTHERS`、`APPLICATION`、`DEVELOPERS & COMPANY`）。
  - 列表项垂直间距为 `gap: 14px`。
  - 网格底部留白为 `padding-bottom: 110px`。
- **资质认证**: 右下角绝对定位挂载 SOC 2 Type 2 认证徽章（`bottom: 91px`）。
- **关联文件**: [public/css/footer.css](file:///x:/XCoding/Octen/hompage/public/css/footer.css) 与 [src/components/Footer.tsx](file:///x:/XCoding/Octen/hompage/src/components/Footer.tsx)。

---

## 🗂️ 4. 关键资产与文件速查
| 模块 / 区域 | 静态样式 (CSS) | 交互脚本 (JS) | React 源码组件 |
| :--- | :--- | :--- | :--- |
| **Navbar 导航栏** | `public/css/navbar.css` | `public/js/navbar.js` | `src/components/Navbar.tsx` |
| **Image & Video** | `public/css/modalities-search.css` | 页面静态 DOM | `src/components/ImageVideoSearch.tsx` |
| **Vertical Search** | `public/css/vertical-search.css` | `public/js/vertical-search.js` | `src/components/VerticalSearch.tsx` |
| **Footer 页脚** | `public/css/footer.css` | 页面静态 DOM | `src/components/Footer.tsx` |
| **主入口 / 全局** | `public/_next/static/css/c4ae1de60afeb6c3.css` | - | `index.html` / `src/App.tsx` |

---

## 🚀 5. 当前工程状态
- **构建状态**: `pnpm run build` 0 报错通过（`tsc` 校验通过，Vite 打包耗时 ~200ms）。
- **服务状态**: `http://localhost:3001/` 实时稳定运行中。
