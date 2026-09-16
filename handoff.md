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

### D. Vertical Search (核心高频迭代区 - 新版 5 步动画管线)
- **胶囊标签**: 深度对齐 Figma 13625:179118 规范（`height: 32px; border-radius: 19.5px;`），附带专属翠绿色立体三角锥矢量图标 [icon-vertical-tag.svg](file:///x:/XCoding/Octen/hompage/public/assets/icon-vertical-tag.svg)。
- **新版 5 步动态流水线时序 (Figma 13661:163623)**:
  1. **首屏静态保底**: 页面初次加载时为待输入静态状态，严禁后台空跑动画。挂载 `IntersectionObserver`，当画布滚入可视区域达 15% 时正式激活流水线。
  2. **Step 1 (Frame 1 - 居中打字机)**: 搜索框与水印居中，逐字平滑输出 Query（`Strait of Hormuz shipping disruptions`），光标呼吸闪烁，输入完成后停留 1.2s。
  3. **Step 2 (Frame 2 - 搜索移位与波浪)**: 搜索框平滑移至左侧（`left: 64px, top: 220px`），标题平移至左上方（`left: 68px, top: 168px`），水印渐隐；右侧居中展示 `searching...` 与 14 个黑色波浪脉冲圆点（持续 1.8s）。
  4. **Step 3 (Frame 3 - 主题卡片总览 & 关键数据走马灯)**: 搜索框溶解隐去，左侧浮现统计数据行（`4 subjects · 10 articles · 89 ms`）及 3 条特性 Bullet 列表。**关键数据搭载走马灯式数字转轮动效 (Slot-Machine / Ticker Reel)**：`4`、`10`、`89` 三组数字采用溢出隐藏窗口与滚轮数字长条，以阶梯延时（0.1s / 0.25s / 0.4s）高速垂直翻转滚动并带微小回弹阻尼（Over-shoot / Settle）锁定到目标数值；Step 4与5保持锁定展示，循环回到Step 1/2时自动隐式归零复位；右侧展示 4 个 Subject 卡片（包含 dates、`Subject1-4` 标签、高保真缩略图、标题与描述，持续 2.5s）。
  5. **Step 4 (Frame 4 - 聚焦 Subject 1)**: Subject 2~4 向下滑隐，Subject 1 卡片在右侧居中聚焦，卡片右下方浮现带有脉冲微动效的 `timeline ↓` 提示（持续 1.5s）。
  6. **Step 5 (Frame 5 & Frame 6 - 同一步的两个状态: 展开与向上滚动)**:
     - **状态 5A (Frame 5 - 时间轴展开)**: 绿色圆点节点脊椎线（`#4AAC80`）自左侧展开，Subject 1 作为 Header 卡片锚定在顶部，下方展开第一条时间轴新闻卡片（05:26:15 / sbs.com.au，持续 1.8s）。
     - **状态 5B (Frame 6 - 向上滚动遍历)**: 时间轴轨道与脊椎线节点保持等距步进，平滑向上逐条滑动展示 5 篇按时序推进的新闻报道（05:26:15 ➔ 05:27:44 ➔ 06:45:31 ➔ 16:24:02 ➔ 10 mins ago）；最后一条展示完毕后平稳停留 3.0s，无缝闭环重循环回到 Step 1。
  7. **悬停暂停与移出恢复**: 鼠标悬停在巨型画布区域时立即冻结当前步时序，移出后平滑继续推进或重置循环。
- **底部 More scenarios 走马灯交互 (Hover 驱动 & Unhover 恢复)**:
  - **悬停打断动画并即时呈现 Query**：鼠标悬停在走马灯中任意场景按钮（如 Legal、Sport、Code、Design 等）时，会立即打断当前的 News 动画播放，重置到 Step 1 居中状态，并**无动画直接显示该场景对应的真实检索 Query**（例如 Legal 对应 `Antitrust precedents in AI agent autonomous transactions`），同时将背景水印图标同步切换为该场景图标。已彻底移除点击交互逻辑。
  - **随机切换渐变背景**：每次悬停进入不同场景按钮，同时会从渐变变量池（Academic 天青蓝、Business 暖金琥珀、Purple 薰衣草紫、News 翠绿荧光）中随机挑选一款与当前不同的颜色平滑过渡。
  - **Unhover 移出后无缝回到 News 动画播放**：当鼠标离开底部场景按钮及走马灯区域后（经 120ms 防抖），系统自动执行 `resetToNews()`，卡片背景恢复为 News 翠绿、标题恢复为 `News Search`、水印恢复为 News 图标，并立即**重新激活并循环播放完整的 5 步动画流水线**。
- **图标来源一致性对齐 (以底部按钮为准)**:
  - 巨型卡片水印图标（`canvasWatermarkIcon`）彻底废弃外部通用矢量 Lucide 代码，**100% 统一直接读取底部按钮中正在使用的原生矢量 SVG 资产**（`/assets/icon-*.svg`）。
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
