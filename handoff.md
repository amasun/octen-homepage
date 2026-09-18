# 项目交接与核心架构上下文 (Handoff Context)

## 📌 1. 项目概况与开发规范
- **仓库地址**: [amasun/octen-homepage](https://github.com/amasun/octen-homepage) (`main` 分支)
- **本地服务**: `http://localhost:3001/`（已锁定端口，开启全量文件实时热更新 `live-reload`）
- **包管理器**: 强制使用 `pnpm`（绝对禁止使用 `npm install`）
- **构建验证**: 每次修改后需执行 `pnpm run build` (`tsc && vite build`) 确保 0 报错通过

---

## 📂 2. 代码架构分层与核心决策
1. **单一真实数据源与切片化架构 (HTML Partials)**：
   - 核心运行入口为根目录 [index.html](file:///x:/XCoding/Octen/hompage/index.html)（轻量总装骨架，仅 ~5KB）。
   - 页面 8 大业务模块已切片至 `src/sections/`（各模块独立，体积仅 1KB~90KB），由 Vite 自定义插件 `htmlPartialsPlugin` 在构建与开发时无感组装：
     - `src/sections/01-navbar.html`：导航栏与下拉菜单
     - `src/sections/02-hero.html`：首屏搜索体验与生产评测表格
     - `src/sections/03-web-search.html`：Web Search 架构对比 (Search / FAST)
     - `src/sections/04-modalities.html`：Image & Video Search (图文/多模态混搜)
     - `src/sections/05-vertical-search.html`：Vertical Search (5 步动态打字机与时间轴)
     - `src/sections/06-retrieval-stack.html`：The Complete Retrieval Stack 与 Partners
     - `src/sections/07-footer.html`：全宽页脚与资质徽章
     - `src/sections/08-scripts.html`：底层脚本与 NumberFlow 注册
   - **Token 暴降 85%+**：修改具体模块时只需针对性读取/编辑对应 `src/sections/*.html`，彻底规避 400KB 单文件与 10 万字符单行造成的截断与性能卡顿。
2. **CSS 模块化分层架构 (`src/styles/`)**：
   - 原 `src/index.css`（1084 行单体巨石文件）已拆分为高内聚的模块化样式并使用标准 `@import` 汇聚：
     - `src/styles/variables.css`：全局 CSS 变量、颜色 Token、排版、间距与阴影
     - `src/styles/base.css`：全局 Reset、自定义滚动条、排版 (`h1`-`p`)、通用按钮 (`.btn-primary-solid` 等)、磨砂玻璃卡片 (`.card-glass`)、胶囊标签与代码块
     - `src/styles/vertical-search.css`：Vertical Search (Figma 13625:179114) 动态标签、展示卡片与时间轴响应式样式
     - `src/styles/modalities-search.css`：Image & Video Search 模态卡片 (Figma 13631:182359) 双列网格与特性徽章样式
     - `src/styles/web-search.css`：Web Search 架构对比卡片轻浅微透描边与分割线样式
   - **Token 与维护提升**：避免每次排查或微调样式时重复解析千行单体 CSS，提升 AI 交互与开发构建效率。
3. **双端同步机制**：
   - 当前页面直接由 Vite 基于 `index.html` + `src/sections/` + `public/` 驱动。
   - `src/components/*.tsx` 为手写的高质量 React 18 + TS 组件（供工程化维护）。
   - **核心约束**：修改界面样式或结构时，同步维护 `src/sections/` 与 `src/components/` 源码组件，确保双端一致。

---

## 🎨 3. 核心功能模块与重要设计决策

### A. 导航栏 (Navbar)
- **下拉菜单**: 
  - **Products 下拉菜单 (深度对齐 Figma node 13625:174324)**：
    - **尺寸与投影**: 容器宽度定格为 `827px`，内边距 `20px`，双层微阴影 `box-shadow: 0px 12px 8px rgba(10, 13, 18, 0.08), 0px 4px 3px rgba(10, 13, 18, 0.03)`，圆角 `12px`。
    - **三列布局结构**:
      - **第一列 Search**：宽度 `220px`，上下段间距 `24px`。
        - **FAST 分组**：Web Search (`/platform/web-search`)、Broad Search (`/platform/broad-search`)。
        - **Premier 分组**：Image Search (`/products/image`)、Video Search (`/products/video`)、News Search (`/products/news`)（Business Search 暂时隐去）。
      - **第二列 Models / Tools**：宽度 `249px`，左内边距 `28px`，左侧半透明灰实线分割 `1px solid rgba(202, 202, 202, 0.5)`，上下段间距 `24px`。
        - **上部 Models 分组**：Embedding、VL Embedding、Model Gateway。
        - **下部 Tools 分组**：标题明确为 `Tools`，仅保留 Extract（Collect 暂时隐去）。
      - **高度对称与标题间距对齐**：三列分类标题 `.nav-dropdown-col-title` 统一采用 `margin: 0`，消除原本后两列的额外下外边距。前两列（第一列 2+3=5 项，第二列 3+2=5 项）总高度均严格为 `284px`，达成亚像素级等高对齐。
      - **第三列 Application**：宽度 `278px`，左内边距 `28px`，左侧半透明灰实线分割 `1px solid rgba(202, 202, 202, 0.5)`。包含 Answer、Deep Research、Multimodal Chat、Ground Generation，菜单项垂直间距严格为 `10px`。
    - **全量 15 款图标矢量化与色彩架构**:
      - **Web Search / News Search / Business Search 图标原生化**：Web Search、News Search（`lucide:newspaper` 带标准 clipPath）与 Business Search（`lucide:briefcase` 公文包）均已采用原生 `20×20` 规格高质量矢量 SVG（`stroke="#628A78"`），并同步归档至 [public/assets/icons/products/](file:///x:/XCoding/Octen/hompage/public/assets/icons/products/)。描边、尺寸与设计稿严格 1:1 吻合。
      - 彻底清除原 CSS 强行全局给所有 svg 子节点注入 `fill: none !important;` 与覆写 `stroke-width` 的破坏性样式 Bug，修复 Image/Video Search、Answer、Extract、Collect、Ground Generation 及复合点状图形（Embedding、VL Embedding）的镂空撕裂。
      - 统一基于 `currentColor` 响应式架构：常态下图标与链接文字保持 `#628A78`，悬停时连动变为翠绿 `#039855`，标题为黑底 `#181D27`（悬停 `#0E121B`），保证线框与面填充图标均呈现完美视觉一致性。
  - **Developers 下拉菜单**：`208px` 紧凑单列布局，包含 API Platform 与 Docs。
- **关联文件**: [public/css/navbar.css](file:///x:/XCoding/Octen/hompage/public/css/navbar.css)、[public/js/navbar.js](file:///x:/XCoding/Octen/hompage/public/js/navbar.js) 及 [index.html](file:///x:/XCoding/Octen/hompage/index.html)。

### B. Web Search (Search · Fast)
- **标签规范**: 顶部标签改为纯文本 `Search · Fast`，并彻底去除标签内的图标（移除原 Globe 图标）。
- **边框与分割线调浅微透**: 
  - 将原厚重生硬的深灰实线（`#555555`）优化为高精轻浅半透明微描边（`rgba(255, 255, 255, 0.14)`），杜绝突兀切割感与厚重线框感。
  - 外层对比大卡片：`.octen-web-search-card`（`border: 1px solid rgba(255, 255, 255, 0.14)`，悬停柔光 0.22）。
  - 中间纵向分割线：`.octen-web-search-divider`（桌面端 `border-right: 1px solid rgba(255, 255, 255, 0.14)`；移动端自适应为底分割线）。
- **左侧 Human Search 对齐设计图完美补全**:
  - **副标题完整呈现**：`Single Query → Sequential Results`，彻底修复原先 `width: 0px` 导致箭头与文本隐藏的问题。
  - **搜索框 Query Bar**：左侧用户头像徽标（圆底 + `lucide:user`）、Query 预置文本 `What is the best AI search engine?`、右侧放大镜图标 `lucide:search`。
  - **垂向连接脊线 (Connector Line)**：自搜索框底端居中垂直连接至下方结果卡片（`w-[1.5px] h-[38px]`，`rgba(255, 255, 255, 0.22)`）。
  - **5 条连续骨架结果卡片 (5 Sequential Results)**：
    - 每行独立条目：左侧带地球图标（`lucide:globe`，半透浅灰）。
    - 顶部双行骨架：首行中长（高亮 `0.45` 透明度，宽度 `62%`），次行较长（`0.22` 透明度，宽度 `90%`）。
    - 底部折返全宽双行：折返至地球图标下方左对齐排布，上行近全宽（`98%`），下行中长（`65%`）。
    - 结构严格 1:1 吻合参考图。
  - **底对齐与元素间距微调 (Bottom Alignment)**：
    - 将 `.octen-human-results-panel` 容器高度固定为 `322px`，内边距调整为 `padding: 17px 14px`，配置 `justify-content: space-between` 与 `gap: 29px`。
    - 结合上方 `38px` 连接线与 `42px` 搜索胶囊，总高度完美达到 `402px`，与右侧 Octen Search 流程（60px 树状括号 + 140px 子查询卡片 + 28px 间距 + 132px 检索结果卡片 = 360px 流程 + 42px 搜索框 = 402px）实现像素级绝对底对齐。
    - 统一 Human Search 标题的负边距为 `-mb-3`，确保左右两栏标题、副标题、搜索框与底端卡片四重水平均衡对齐。
- **关联文件**: [public/css/web-search.css](file:///x:/XCoding/Octen/hompage/public/css/web-search.css)、[src/styles/web-search.css](file:///x:/XCoding/Octen/hompage/src/styles/web-search.css)、[src/sections/03-web-search.html](file:///x:/XCoding/Octen/hompage/src/sections/03-web-search.html) 及 [src/components/ArchitectureComparison.tsx](file:///x:/XCoding/Octen/hompage/src/components/ArchitectureComparison.tsx)。


### C. Image & Video Search
- **胶囊标签规范**: 标题上方统一配置纯文本 `Search · Fast` 胶囊标签（`.octen-modality-tag`，居中对齐，圆角 `9999px`，内边距 `5px 16px`，半透明边框与磨砂背景），与 Web Search 视觉规范保持一致。
- **并排架构**: 深度对齐 Figma 13631:182359，左右各 630px 双列并排，居中挂载于 1280px 容器。
- **标题绝对居中**: `Early Access` 标签采用绝对定位脱离文档流（`left: calc(100% + 12px); top: 50%`），确保标题与下方卡片 100% 绝对数学居中。
- **行动点 CTA**: 描述文字下方居中配置高精幽灵外框按钮 `Request Access ↗`，带绿色柔光悬停微动效。
- **关联文件**: [public/css/modalities-search.css](file:///x:/XCoding/Octen/hompage/public/css/modalities-search.css) 与 [src/components/ImageVideoSearch.tsx](file:///x:/XCoding/Octen/hompage/src/components/ImageVideoSearch.tsx)。

### D. Vertical Search (核心高频迭代区 - 新版 5 步动画管线)
- **胶囊标签**: 深度对齐 Figma 13625:179118 规范（`height: 32px; border-radius: 19.5px;`），附带专属翠绿色立体三角锥矢量图标 [icon-vertical-tag.svg](file:///x:/XCoding/Octen/hompage/public/assets/icon-vertical-tag.svg)。
- **新版 5 步动态流水线时序 (Figma 13661:163623)**:
  1. **首屏静态保底**: 页面初次加载时为待输入静态状态，严禁后台空跑动画。挂载 `IntersectionObserver`，当画布滚入可视区域达 15% 时正式激活流水线。
  2. **Step 1 (Frame 1 - 居中打字机)**: 搜索框与水印居中，逐字平滑输出 Query（`Strait of Hormuz shipping disruptions`），光标呼吸闪烁，输入完成后停留 1.2s。
  3. **Step 2 (Frame 2 - 搜索移位与波浪)**: 搜索框平滑移至左侧（`left: 64px, top: 220px`），标题平移至左上方（`left: 68px, top: 168px`），水印渐隐；右侧居中展示 `Searching...`（首字母大写，`font-weight: 600; font-size: 18px; color: #000000; opacity: 0.6;` 严格对齐 Figma `13661:162700`）与 14 个黑色脉冲圆点（采用紧凑短波长波纹动效，单周期跨度由 15 个点缩短至 ~6.7 个点，整排呈现连续起伏的双峰涟漪，持续 1.8s）。
  4. **Step 3 (Frame 3 - 主题卡片总览 & 4 张卡片依次入场与视口滚动遍历)**: 搜索框溶解隐去，左侧浮现统计数据行（`4 subjects` 与 `10 articles`）及 3 条特性 Bullet 列表。右侧 4 张 Subject 卡片搭载高精度阶梯入场与平滑滚动遍历机制（持续 4.0s）：
     - **卡片依次入场 (Sequential Staggered Entrance)**：4 张卡片分别配置 `100ms`、`350ms`、`600ms`、`850ms` 阶梯渐进延时，伴随轻微弹性上浮淡入（`translateY(24px) ➔ 0; opacity: 0 ➔ 1`）。
     - **轨道平滑向上滚动遍历 (`.subjects-cards-track`)**：因 4 张卡片总高度（672px）超出视口高度（460px），在 1.1s 至 2.7s 间，卡片轨道平滑向上滚动 216px（`translateY(0) ➔ translateY(-216px)`），使最初超出视口下沿的 Subject 3 与 Subject 4 顺畅滚动至视口完整呈现（底边严密贴合视口底端），达成 4 张卡片全部完备呈现给用户的流畅阅读体验；末尾停顿 1.3s 供阅读。
     - **关键数据搭载开源库 [barvian/number-flow](https://github.com/barvian/number-flow) 支撑的真实弹簧物理走马灯动效**：
       - **双端对齐架构**：[index.html](file:///x:/XCoding/Octen/hompage/index.html) 中采用原生 `<number-flow>` Custom Element，由 [public/js/vertical-search.js](file:///x:/XCoding/Octen/hompage/public/js/vertical-search.js) 全局控制器驱动；React 组件 [src/components/VerticalSearch.tsx](file:///x:/XCoding/Octen/hompage/src/components/VerticalSearch.tsx) 采用 `@number-flow/react` 封装。
       - **真实滚轮动效 (Continuous Odometer Tumbler)**：集成 `continuous` 插件，确保数字由 `0` 顺次翻滚遍历至目标数值，呈现丝滑且真实的里程表式走马灯质感。
       - **阶梯时序与阻尼物理**：进入 Step 3 时，`subjects` 延时 120ms 滚动至 `4`（900ms 弹簧缓动），`articles` 延时 280ms 滚动至 `10`（1100ms 弹簧缓动）；Step 4 与 5 保持目标数值锁定；循环回到 Step 1/2 时执行隐式静默归零，杜绝逆向倒转。
     - **特性 Bullet 列表阶梯式渐进动画 (Progressive Staggered Entrance)**：3 条特性文本（`• Fresh news, delivered in milliseconds.` ➔ `• Track the progress of each subject across the timeline.` ➔ `• Dive deep into the story's development.`）分别延时 200ms、420ms、640ms 依次滑入。
     - **排版与样式严格继承**：`DM Sans:Light` (`font-weight: 300`, 30px, `#000000`)，数字高度 36px；标签文本 `subjects` / `articles` 为 22.5px、`color: #000000; opacity: 0.6`，间距 9px。
  5. **Step 4 (Frame 4 - 镜头回弹聚焦 Subject 1)**: 卡片轨道平滑回位（`translateY(0)`），Subject 2~4 立即无延迟向下滑隐（`transition-delay: 0s; opacity: 0; transform: translateY(60px) scale(0.95)`），Subject 1 卡片在右侧居中聚焦（`translateY(140px)`），卡片右下方浮现带有脉冲微动效的 `timeline ↓` 提示（持续 1.5s）。
  6. **Step 5 (Frame 5 & Frame 6 - 时间轴组件核心球体严格中心对齐与行级 Flexbox 架构)**:
     - **严格中心对齐架构 (Row-Based Flexbox Architecture)**: 彻底废弃以往独立的静态 SVG 脊椎图（`timeline-spine.svg`），重构为行级 Flex 容器（`.timeline-item { display: flex; flex-direction: row; align-items: center; gap: 16px; }`）。卡片与对应的绿色中心球体（`width: 20px, height: 20px; border: 4px solid white; background: #4AAC80`）处于同一行级弹性盒内，由 CSS Flex 引擎原生数学保障球体中心与卡片高度物理中心 100% 严格亚像素对齐。
     - **贯穿式垂直白线脊椎 (`.timeline-spine-line`)**: 在时间轴轨道内绘制连续 6px 宽白色实线（`left: 7px; top: 78px; bottom: 50px; width: 6px; background: white; border-radius: 3px;`），从首个 Header 球体几何中心贯穿至末尾新闻球体背后，各球体（`z-index: 2`）覆盖于白线之上，天然无错位、无缝隙。
     - **状态 5A (Frame 5 - 时间轴展开)**: Subject 1 作为 Header 卡片锚定在顶部，左侧严格对齐首个绿色球体，下方展开第一条时间轴新闻卡片（05:26:15 / sbs.com.au，持续 1.8s）。
     - **状态 5B (Frame 6 - 向上滚动遍历)**: 时间轴轨道采用精准卡片步进位移数组 `[0, 172, 288, 404, 520]`，平滑向上逐条滑动展示 5 篇按时序推进的新闻报道（05:26:15 ➔ 05:27:44 ➔ 06:45:31 ➔ 16:24:02 ➔ 10 mins ago），球体、卡片与脊椎线完全同频移动，永不漂移；最后一条展示完毕后平稳停留 3.0s，无缝闭环重循环回到 Step 1。
  7. **悬停暂停与移出恢复**: 鼠标悬停在巨型画布区域时立即冻结当前步时序，移出后平滑继续推进或重置循环。
- **底部 More scenarios 走马灯交互 (Hover 驱动 & Unhover 恢复)**:
  - **悬停打断动画并即时呈现 Query**：鼠标悬停在走马灯中任意场景按钮（如 Legal、Sport、Code、Design 等）时，会立即打断当前的 News 动画播放，重置到 Step 1 居中状态，并**无动画直接显示该场景对应的真实检索 Query**（例如 Legal 对应 `Antitrust precedents in AI agent autonomous transactions`），同时将背景水印图标同步切换为该场景图标。已彻底移除点击交互逻辑。
  - **随机切换渐变背景**：每次悬停进入不同场景按钮，同时会从渐变变量池（Academic 天青蓝、Business 暖金琥珀、Purple 薰衣草紫、News 翠绿荧光）中随机挑选一款与当前不同的颜色平滑过渡。
  - **Unhover 移出后无缝回到 News 动画播放**：当鼠标离开底部场景按钮及走马灯区域后（经 120ms 防抖），系统自动执行 `resetToNews()`，卡片背景恢复为 News 翠绿、标题恢复为 `News Search`、水印恢复为 News 图标，并立即**重新激活并循环播放完整的 5 步动画流水线**。
- **图标来源一致性对齐与 News Search 标题前图标规范**:
  - **News Search 标题前 28px 图标规范**: 标题前新闻图标严格遵循用户提供的原生 Figma 矢量代码（`viewBox="0 0 28 28"`，保留外层约 2.33px 呼吸留白空隙与 `stroke-width="2.33333"`），彻底解决之前直接使用 16.5px 紧凑图标被拉伸填充导致缺失外层空隙的视觉问题。
  - 巨型卡片水印图标（`canvasWatermarkIcon`）彻底废弃外部通用矢量 Lucide 代码，**100% 统一直接读取底部按钮中正在使用的原生矢量 SVG 资产**（`/assets/icon-*.svg`）。
- **卡片纯净无长投影规范**:
  - 全量去除 Step 3（4 张 Subject 概览卡片）、Step 4（聚焦放大卡片）、Step 5（时间轴顶部 Header 卡片与 5 条时序新闻卡片）的重色长投影（`box-shadow: none`），仅保留 `8px` 半透明白色毛玻璃描边（`border: 8px solid rgba(255, 255, 255, 0.4)`），与背景渐变通透融为一体，彻底告别草稿厚重感。
- **底部留白与布局规范**:
  - 父级容器 `.vertical-search-section` 配置标准 `padding-bottom: 110px`（顶部为 `padding-top: 80px`），确保底部 `More scenarios in future releases` 走马灯交互区与下方 `#api-introduce` 模块之间具备标准充足的呼吸留白。
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
| 模块 / 区域 | HTML 片段 (src/sections/) | 静态样式 (CSS) | 交互脚本 (JS) | React 源码组件 |
| :--- | :--- | :--- | :--- | :--- |
| **Navbar 导航栏** | `src/sections/01-navbar.html` | `public/css/navbar.css` | `public/js/navbar.js` | `src/components/Navbar.tsx` |
| **Hero 检索区** | `src/sections/02-hero.html` | `c4ae1de60afeb6c3.css` | 页面静态 DOM | `src/components/Hero.tsx` |
| **Web Search 对比** | `src/sections/03-web-search.html` | `c4ae1de60afeb6c3.css` | 页面静态 DOM | `src/components/ArchitectureComparison.tsx` |
| **Image & Video** | `src/sections/04-modalities.html` | `public/css/modalities-search.css` | 页面静态 DOM | `src/components/ImageVideoSearch.tsx` |
| **Vertical Search** | `src/sections/05-vertical-search.html` | `public/css/vertical-search.css` | `public/js/vertical-search.js` | `src/components/VerticalSearch.tsx` |
| **Retrieval Stack** | `src/sections/06-retrieval-stack.html`| `c4ae1de60afeb6c3.css` | 页面静态 DOM | `src/components/RetrievalStack.tsx` |
| **Footer 页脚** | `src/sections/07-footer.html` | `public/css/footer.css` | 页面静态 DOM | `src/components/Footer.tsx` |
| **底层脚本/挂载** | `src/sections/08-scripts.html`| - | `vertical-search.js` | - |
| **主入口 / 骨架** | `index.html` (~5 KB) | - | - | `src/App.tsx` |

---

## 🚀 5. 当前工程状态
- **构建状态**: `pnpm run build` 0 报错通过（`tsc` 校验通过，Vite 打包耗时 ~200ms）。
- **服务状态**: `http://localhost:3001/` 实时稳定运行中。
