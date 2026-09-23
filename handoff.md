# Octen 官网开发交接 (Handoff)

> 💡 **项目说明**：本项目采用 **Vite + 模块化 HTML Partials (`<include>`) + CSS/Vanilla JS** 作为页面主干，同时在 `src/components/` 维护同等 React 双轨组件。

---

## 🖥️ 预览与运行方式 (How to Preview & Run)

### 1. 线上免安装即时预览
无需本地运行环境，浏览器直接打开即可体验最新线上部署版本：
- **线上部署地址**：[https://octen-homepage.vercel.app/](https://octen-homepage.vercel.app/)

### 2. 本地开发环境启动与预览
本地调试样式或进行二次开发：
1. **安装依赖**（首次运行）：
   ```bash
   pnpm install
   ```
2. **启动本地开发服务器**：
   ```bash
   pnpm dev
   ```
3. **在浏览器中打开预览**：
   - **主页预览**：👉 [http://localhost:3001/](http://localhost:3001/)
   - **独立备用模态测试页**：👉 [http://localhost:3001/backup-modules.html](http://localhost:3001/backup-modules.html)
   *(服务固定监听 `3001` 端口，局域网同网段设备可通过 `http://<本机IP>:3001/` 同步预览)*

### 3. 生产打包与构建预览
验证生产环境打包与静态资源加载完整性：
```bash
pnpm build     # TypeScript 类型校验并打包产物至 dist/
pnpm preview   # 本地静态托管并预览构建产物
```

- **相关文档**：详见 [DEVELOPER_HANDOVER.md](./DEVELOPER_HANDOVER.md)（开发者重点改动与设计交接说明）

---

## 🧭 页面模块架构索引 (Page Modules 01 ~ 10)

`index.html` 按照从上到下的顺序通过 `<include>` 引入 10 个独立模块：

| 模块序号 | 文件路径 | 职责说明 | 关联样式/组件 |
| :--- | :--- | :--- | :--- |
| **01** | `src/sections/01-navbar.html` | 顶部导航栏、双下拉菜单（Products / Developers） | `public/css/navbar.css` |
| **02** | `src/sections/02-hero.html` | 首屏 Hero、动态搜索交互输入框演示 | Tailwind + Base CSS |
| **03** | `src/sections/03-web-search.html` | Web Search 双架构对比（Human vs Octen） | `public/css/web-search.css` |
| **04** | `src/sections/05-vertical-search.html` | News Search（新闻垂直搜索、5步动态时间线舞台） | `public/css/vertical-search.css` |
| **05** | `src/sections/04-modalities.html` | Omni Search 模态搜索过渡区（核心大图暂存于备份仓） | `public/css/modalities-search.css` |
| **06** | `src/sections/06-retrieval-stack.html` | API 检索全栈（Sticky Tabs + 4 大子项） | `src/sections/partials/model-gateway-diagram.html` |
| **07** | `src/sections/07-showcase.html` | Built on Octen Search 客户案例卡片与轮播展示 | Tailwind + Base CSS |
| **08** | `src/sections/08-get-started.html` | Start Building 行动号召与三步上手指南 | `public/css/octen-tags.css` |
| **09** | `src/sections/09-footer.html` | 底部品牌 Slogan、5 列导航网格与 SOC 2 认证 | `public/css/footer.css` / `src/styles/footer.css` |
| **10** | `src/sections/10-scripts.html` | 页面底部全局交互初始化脚本 | - |
| **备份仓** | `src/sections/backup/` | 暂存的 Modalities 动效大图、未来场景走马灯 | 对应 `backup-modules.html` 独立测试 |

---

## 🎨 全局核心设计规范 (Core Design Tokens)

1. **暗色磨砂玻璃胶囊标签 (`.octen-glass-tag` / `.octen-search-tag`)**：
   - 尺寸与圆角：`height: 30px; border-radius: 24px; padding: 0 16px;`
   - 材质与投影：`background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(8px); border: none;`
   - 双向微倒角内阴影：`box-shadow: 0px 8px 16px rgba(0,0,0,0.08), inset -0.5px -0.5px 1px rgba(255,255,255,0.3), inset 0.5px 0.5px 1px rgba(255,255,255,0.3);`
   - 排版：`font-size: 14px; font-weight: 500; line-height: 20px; color: #ffffff;` 无前置图标。
   - 覆盖范围：Web Search、News Search、Start Building 等所有深底区域。
2. **浅色卡片子项标签 (`.tag-v`)**：
   - 尺寸与圆角：`height: 30px; border-radius: 19.5px; padding: 6px 16px;`
   - 材质：`background: rgba(255, 255, 255, 0.3); border: 1px solid #BCBCBC; backdrop-filter: blur(10px);`
   - 排版：`font-family: 'DM Sans'; font-size: 14px; color: #000000; text-align: center;`
   - 覆盖范围：Retrieval Stack 各产品子卡片。
3. **页脚 Header 规范 (Figma 13625:178499)**：
   - 尺寸：Logo `119.4px × 40.5px`；Slogan `font-size: 24px`（Fraunces 衬线体）。
   - 渐变：`Real-Time AI` 采用 `linear-gradient(85.39deg, rgb(172, 244, 95) 5.8%, rgb(112, 254, 126) 99.3%)`。
   - 布局：上下 Padding 40px，与下方导航网格间距 40px；Col 2 与 Col 5 双分组上下间距统一 50px。

---

## ⚡ 近期重点改动速览 (Recent Key Changes)

1. **顶部导航栏 (Navbar)**：
   - 移除 Products / Developers 下拉按钮右侧小三角箭头；
   - 规范分组：`Search · FAST`、`Search · PREMIER`、`Models`、`Tool`（单数）；图标统一为 20px。
2. **Web Search 与 News Search 衔接**：
   - 全面移除 `.vertical-search-section` 的 `border-top` 浅色分割线，深黑底色无缝融合。
3. **News Search (Vertical Search)**：
   - 底部 `padding-bottom` 调整为 `80px`；中央交互卡片圆角调整为 `24px`。
4. **Omni Search (模态拆解)**：
   - 文案拆为 Image Search 与 Video Search 独立双列，排版宽度强制锁定 `500px`（解决 592px 导致的文字失调）。
5. **The Complete Retrieval Stack**：
   - 移除标题顶部的 `More APIs` / `Beyond Search` 标签；
   - 主标题显式换行 `The complete<br />retrieval stack`；
   - 各子项挂载独立标签（Embedding/VL/Model Gateway ➔ `Models`，Extract ➔ `Tool`）；
   - 产品排序重构：`Extract` 整体移至 `Model Gateway` 后面（第 4 位）；
   - 架构图解耦：Model Gateway 中 1,291 行纯静态 SVG 抽取为独立 Partial（`model-gateway-diagram.html`），主模板由 2,076 行锐减至 786 行。
   - `vite.config.ts` 升级实现递归嵌套 Partial 解析。
6. **Start Building 行动区**：
   - 标签升级为全站统一规范的磨砂玻璃微倒角胶囊标签。
7. **页脚 (Footer)**：
   - Slogan 字号修正为 24px + 最新草绿渐变；Logo 修正为 119.4px × 40.5px；SOC 2 认证徽章居右排版。

---

## 🚨 已知问题与下一步计划 (Next Steps)
- ✅ **News & Business 独立模块整合为 `vertical search` 统一目录**（已完成）：
  - 将原独立的 `news search` 与 `business search` 全部合并统一归纳在 [vertical search/](file:///x:/XCoding/Octen/hompage/vertical%20search/) 根目录下；
  - 包含了 [verticals-demo.html](file:///x:/XCoding/Octen/hompage/vertical%20search/verticals-demo.html)、[business-search-demo.html](file:///x:/XCoding/Octen/hompage/vertical%20search/business-search-demo.html)、[NEWS_SEARCH_ANIMATION_SPEC.md](file:///x:/XCoding/Octen/hompage/vertical%20search/NEWS_SEARCH_ANIMATION_SPEC.md)、[BUSINESS_SEARCH_SPEC.md](file:///x:/XCoding/Octen/hompage/vertical%20search/BUSINESS_SEARCH_SPEC.md) 及控制台交互规范；
  - **后续规划**：后续将直接在 `vertical search/` 目录下用同一个 HTML 整合 News 与 Business 的动效交互。
- ✅ **News Search 5 步动效全套移植**（已完成）：
  - 中央舞台 5 步时序动画（逐字打字 ➔ 正弦波脉冲 ➔ 卡片总览翻滚 ➔ 药丸形态形变 ➔ 时间线滚动延展）已由 [vertical search/verticals-demo.html](file:///x:/XCoding/Octen/hompage/vertical%20search/verticals-demo.html) 完整落地至 `src/sections/05-vertical-search.html` 与 `public/js/vertical-search.js`。
  - 支持进入视口自动播放、悬浮暂停、药丸 Tab 切换与 Replay 重播。
  - **参考设计稿**：👉 [Figma News 动效 5 步静态分步设计稿 (Node 13661:163623)](https://www.figma.com/design/jnIlRSuXffn5g2OxnsqYIE/Octen_%E6%B1%87%E6%80%BB?node-id=13661-163623&t=7uy39MOcdDWVIOA4-4)。
- ✅ **Business Search 巨幅卡片背景与水印精确对齐 Figma (Node 13795:166561)**（已完成）：
  - 渐变参数全面对齐 Figma 最新原稿：`linear-gradient(44.87deg, rgba(255, 232, 129, 0.6) 0.11%, rgba(255, 249, 230, 0.6) 101.27%), linear-gradient(90deg, rgba(255, 239, 97, 0.6) 0%, rgba(255, 241, 153, 0.6) 100%)`；
  - 核心背景高光元素 (`.canvas-aura`)：引入 Figma 原型中的 600px 居中白色径向光晕球（`radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 70%)`），增强卡片纵深与光影质感；
  - SVG 水印严格对齐：
    - 透明度统一锁定为 Figma 规范的 `opacity: 0.12 !important`；
    - 颜色采用纯黑 `#000000` 融入背景底色，移除原先粗糙的棕黄色着色覆盖；
    - 尺寸精确对齐为 `280px × 280px`，桌面端定位为 `left: 120px; top: 126px;`（移动端自适应响应）；
    - 水印矢量线宽严格标定为 `18px`（`stroke-width="18"` 与 CSS `stroke-width: 18px` 协同保障），消除大尺寸下的过于粗重感。
- ✅ **Section 8 Start Building (CTA) 背景色与可见性修复**（已完成）：
  - 外层容器补充 `#080B12` 暗黑背景与底部分割线 `<div class="w-full border-b border-[#FFFFFF33]">`；
- ✅ **Business Search 规范与结构性差异归档**（已完成）：
  - 输出权威规范文档 [vertical search/BUSINESS_SEARCH_SPEC.md](file:///x:/XCoding/Octen/hompage/vertical%20search/BUSINESS_SEARCH_SPEC.md)；
  - 同步更新并在 [vertical search/Business Search 控制台交互/Business Search 控制台交互.md](file:///x:/XCoding/Octen/hompage/vertical%20search/Business%20Search%20控制台交互/Business%20Search%20控制台交互.md) 中完整收录与 News Search 的数据模型、实体二分（Company vs Person）、双轨动态（Activities 时间线 vs News 列表）以及控制台参数结构差异。
- ✅ **Vertical Search 独立 Demo 双 Tab 与 Business 整合及水印透明度对齐**（已完成）：
  - 将 Business Search 完整补充进 [vertical search/verticals-demo.html](file:///x:/XCoding/Octen/hompage/vertical%20search/verticals-demo.html)；
  - 采用 index 主站的 Hero 标题排版（`Search / PREMIER` 胶囊标签、动态标题副标题、`Request Access` 按钮）与毛玻璃双 Tab 胶囊栏（`News Search` vs `Business Search`）；
  - 支持主题色、水波纹、水印 SVG、打字 Query、统计数字、卡片形变与 5 阶段动画一键无缝切换与独立运行；
- ✅ **Vertical Search 独立 Demo 双 Tab 水印切换缩放动效（Watermark Pop）全面复原**（已完成）：
  - 严格溯源主项目版本（Commit `811ff42` / `83a7d80`）的 `@keyframes watermark-swap` 动效签名；
  - 在 [vertical search/verticals-demo.html](file:///x:/XCoding/Octen/hompage/vertical%20search/verticals-demo.html) 中添加 `.canvas-watermark.watermark-pop svg` 动画系统，从 `scale(0.8) rotate(-6deg)` 弹性放大并轻微回正至 `scale(1) rotate(0deg)`，耗时 `0.45s` 并使用标准弹簧曲线 `--ease-spring: cubic-bezier(0.16, 1, 0.3, 1)`；
- ✅ **Vertical Search 独立 Demo 页面结构净化与控件下沉**（已完成）：
  - 彻底删除左上角两行开发信息（`Octen / Vertical Search Infrastructure` 与 `News & Business Search Interactive Prototype`），使 Demo 顶部视觉完全与正式官网产品 Hero 对齐；
  - 将开发步骤调试控件条（`⏸ Pause` 与 `1. Typing` ~ `5. Timeline` 按钮组）平移下沉至巨型卡片底部居中排列，保持完整的时序快进与交互功能；
  - 彻底清理底部冗余的 `demo-footer-info` 文本（*“Dual Vertical Search Stage...”* 与 *“Hover over results area...”*）。
- ✅ **Vertical Search 独立 Demo 头部标题与 Tab 栏严格对齐 Figma Node 13701:168352**（已完成）：
  - 严格根据 Figma 原型参数（Node `13701:168352`）重构 [vertical search/verticals-demo.html](file:///x:/XCoding/Octen/hompage/vertical%20search/verticals-demo.html) 标题区：
    - **垂直层次堆叠**：居中容器 `gap: 30px`，下辖文字组与居中 `Request Access` 行动按钮；
    - **胶囊标签 `Search / PREMIER`**（Node `13720:174651`）：引入 `DM Mono` 字形，`DM Sans 14px SemiBold` ("Search") + `DM Sans 13px SemiBold` ("/") + `DM Mono 14px Medium` ("PREMIER", letter-spacing `0.936px`)；
    - **大标题**（Node `13701:168357`）：`Fraunces 44px` 衬线体，400 字重，行高 1.2，`font-variation-settings: "SOFT" 0, "WONK" 1`，字距 `-0.015em`；
    - **辅助说明**（Node `13701:168359`）：`DM Sans 16px`，`max-width: 682px`，居中排版，opacity 0.8；
    - **`Request Access` 按钮**（Node `13702:169791`）：高度 40px，居中放置在副标题下方，`border: 1px solid #60ff70`，文字 `#70fe7e` 16px SemiBold，右侧搭配 15.5px 45° 倾斜外链矢量箭头；
    - **三 Tab 导航栏**（Node `13799:166686`）：`background: rgba(82, 82, 82, 0.5)` 毛玻璃外壳（`backdrop-filter: blur(12px)`），包含 `News Search`（草绿 `#8adb47` 激活态、黑字黑标）、`Business Search` 与 `Academic`（白字白标，学术帽图标），并完整挂载 Academic 全量数据模型与交互切换逻辑。
- ✅ **News Search 4 大核心卖点呈现现状评估与落地方案归档**（已完成）：
  - 产出专用方案文档 [NEWS_SEARCH_VALUE_PROPOSITIONS.md](file:///x:/XCoding/Octen/hompage/vertical%20search/NEWS_SEARCH_VALUE_PROPOSITIONS.md)；
  - 针对 4 大核心卖点进行深度分析：
    1. **更高时效（3分钟内可搜到）**：当前仅体现静态日期，建议在卡片顶部引入 `● Ingested 2m ago` / `● Wire Speed (<3m)` 实时呼吸绿点徽章，并在 Stage 2 检索中增加秒级快报扫描感知；
    2. **更全覆盖（95% 头部媒体覆盖）**：当前仅显示文本域名，建议引入头部媒体矩阵 Favicon/Logo 与左侧面板 `8 tier-1 sources` 维度；
- ✅ **Vertical Search 独立 Demo 标题、辅助文字与 Tabs 间距层级标定**（已完成）：
  - **标题与辅助文字间距**：严格锁定为 **`20px`**（`.hero-title-group gap: 20px`，完全契合 Figma 原型参数）；
  - **辅助文字与下方行动按钮间距**：同步平准为 **`20px`**（`.hero-header-box gap: 20px`），使辅助文字的**上方间距（距大标题）与下方间距（距按钮）达到完美的 20px 双向对称**；
  - **清除 `<p>` 默认上下 margin 渗透**：彻底清除浏览器原生的 16px block margin 累加，确保呈现纯正的 20px 几何空隙；
  - **Tabs 导航栏与行动按钮间距**：平准标定为严格的 **`30px`**（`.vertical-tabs-bar margin-top: 10px` 叠加容器 `gap: 20px`），还原 Figma 宽适舒展的导航段落间隔。
- ✅ **News Search Timeline 时间轴末尾最新卡片相对时间与切换自动定位末尾**（已完成）：
  - **最新突发时效对齐末尾卡片**：因时间轴按时间升序（从早到晚）编排，**时间轴上最后一张卡片（最新的突发进展）统一呈现相对时间**，直观体现“3分钟内可搜到”的核心卖点：
    - Subject 1 终局最新进展（12:04）：`3 minutes ago`；
    - Subject 2 终局最新进展（18:05）：`10 minutes ago`；
    - Subject 3 终局最新进展（19:18）：`24 minutes ago`；
    - Subject 4 终局最新进展（20:15）：`36 minutes ago`；
  - **首部卡片恢复精准时间**：事件起点的历史卡片（第 1 篇及中间篇目）恢复准确时间戳（如 `05:26:15`、`05:27:44`），完整呈现从事件爆发到最新突发的情报追踪脉络；
- ✅ **Vertical Tabs Bar 平滑滑动变色胶囊滑块（Glider）与去外发光优化**（已完成）：
  - **平滑左右滑动动效**：引入独立绝对定位的 `.tabs-indicator` 底层高亮胶囊，切换 Tab 时采用弹簧缓动曲线 `--ease-spring: cubic-bezier(0.16, 1, 0.3, 1)`（耗时 0.38s）实现横向位置（`transform: translate3d`）和宽度的双向平滑自适应过渡；
  - **动态平滑变色过渡**：胶囊背景色在 News 草绿色（`#8adb47`）与 Business 琥珀金色（`#FBBF24`）之间平滑插值过渡；按钮文字与图标在 `#000000`（激活黑字）与 `rgba(255,255,255,0.7)`（未激活白字）间柔和淡入淡出；
  - **彻底移除外发光效果**：移除所有激活态与胶囊的彩色弥散投影（`box-shadow: none !important;`），消除毛玻璃外侧发光光晕溢出，使整个导航胶囊更纯净、现代、平实。
- ✅ **News Search 卡片左侧核心卖点文字对齐四大价值主张**（已完成）：
  - 严格依照 [NEWS_SEARCH_VALUE_PROPOSITIONS.md](file:///x:/XCoding/Octen/hompage/vertical%20search/NEWS_SEARCH_VALUE_PROPOSITIONS.md) 中的 4 大核心卖点定义，将 [vertical search/verticals-demo.html](file:///x:/XCoding/Octen/hompage/vertical%20search/verticals-demo.html) 卡片左侧面板原有的 3 条陈旧描述全面替换为专业高密度的 4 大价值主张：
    1. **更高时效**：`• Wire-speed freshness: searchable within 3 minutes.`（3 分钟内可搜到 / Wire-speed Freshness）
    2. **更全覆盖**：`• Comprehensive coverage: 95% tier-1 global news media.`（95% 头部新闻媒体与全球通讯社全覆盖）
    3. **更省 Token**：`• Token-efficient: deduplication of syndicated & duplicate stories.`（通稿泛滥去重、相同新闻语义归并，节省 70%~90% 上下文 Token）
    4. **话题聚合**：`• Topic clustering: track complete event lineage and development.`（追踪事件始末、原始突发与衍生子事件脉络）
  - 同步更新了 HTML 初始静态模板（`#summaryBulletsList`）以及 JavaScript 数据模型（`VERTICALS.news.bullets`），保证在 Tab 切换与动画重播时均准确呈现。
- ✅ **News Search 时间轴末尾相对时间简写为 `xxm ago` 并增加橙色 `latest` 标签**（已完成）：
  - 将每个事件时间轴最后一张卡片上的时间戳格式从 `xx minutes ago` 紧凑简写为 **`xxm ago`**（如 `3m ago`、`10m ago`、`24m ago`、`36m ago`）；
  - 在时间文字后方紧邻增加专属的**橙色 `latest` 状态微标**（`.timeline-latest-tag`），采用亮橙背景（`#F97316`）与白色加粗小字，高度辨识最新突发节点；
  - 采用 `.sub-article-time-group` flex 容器排版，保持时间与徽章紧密贴合，同时与右侧来源域名（`reuters.com` 等）保持两端舒展对齐。
- ✅ **News Search 核心卖点数字加粗与内容区宽度拓宽（消除单字折行）**（已完成）：
  - **重要关键指标加粗**：将四大卖点中的核心量化数字通过 `<b>...</b>` 加粗强化（如 `<b>3&nbsp;minutes</b>`、`<b>95%</b>`），显著提升关键绩效信息抓人眼球的视觉冲击力；
  - **内容区宽度显著拓宽**：将 `.canvas-left-panel` 桌面端 `max-width` 由 `440px` 拓宽至 **`560px`**（`width: calc(100% - 670px)`），充分利用卡片左半区域，四条卖点在桌面端均舒展呈现为纯正单行；
  - **双重杜绝第二行单字孤行 (Orphan Words)**：
    1. 为每条文案末尾两个单词注入不换行空格（`&nbsp;`，如 `3&nbsp;minutes.`、`news&nbsp;media.`、`duplicate&nbsp;stories.`、`and&nbsp;development.`）；
    2. 引入现代排版属性 `text-wrap: pretty;`，确保在任何视口尺寸下折行时均携带多个词汇，彻底告别“第二行单个孤立单词”的排版瑕疵。
- ✅ **News Search 移除低价值局部统计行并增设核心定位说明（方案 A）**（已完成）：
  - **彻底移除统计行**：删除了原有的 `4 subjects · 10 articles` 大字号局部统计（避免抢走核心卖点风头，且消除“10篇收录少”的负向误解）；
  - **标题下增设定位说明**：在 `News Search` 标题与四大卖点之间新增清晰的产品副标题：
    *“Search live news and read each story as a single grouped event.”*（`.summary-desc`，16px 优雅深绿质感字色）；
  - **双垂直主题数据无缝切换**：同步为 Business Search 配置对应定位说明，在切换 Tab 时平滑动态切换。
- ✅ **Vertical Tabs Bar 文字与 Icon 变色运动扫光与微弹簧动效**（已完成）：
  - **双层物理蒙版变色扫光 (Physical Mask Wipe)**：在滑块胶囊内部植入等距反向联动的 `.tabs-indicator-track`，使黑色文字/图标层随胶囊位移以亚像素级精度反向平移，在视觉上形成“绿色/琥珀金胶囊滑过之处瞬间被擦亮为黑色，离开之处还原为半透明白字”的纯物理扫光效果，彻底消除了黑色文字提前在暗色底上变色的突兀感；
  - **图标与文字微弹簧动态 (Micro-Spring Dynamics)**：激活态 Tab 的图标加入 `transform: scale(1.12) rotate(-3deg)` 弹性跳脱，文字带有 `scale(1.02)` 呼吸感，切换时使用 `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)` 弹性阻尼，带来极具质感的原生交互体验。
- ✅ **Hero 顶部总览说明文字文案优化（去具体垂类枚举，聚焦“深度定制、即时、准确、深度”）**（已完成）：
  - **去除特定业务方向枚举**：原先的文案枚举了 `real-time news, corporate filings, and market disclosures`，现彻底移除具体业务方向，使其成为垂类搜索模块通用的价值定位；
  - **聚焦核心特性表达**：提炼为聚焦“垂类深度定制、即时性、高准确度、深度智能与自主推理”的高质感英文表述：
    *“Deeply customized search engineered for vertical domains. Delivering real-time, high-precision, and in-depth intelligence structured for autonomous reasoning.”*；
  - **数据层与静态模板全局对齐**：同步更新静态 HTML 占位、`VERTICALS.news.desc` 以及 `VERTICALS.business.desc`，在切换选项卡时保持整栏价值定位的一致与纯粹。
- ✅ **修复 Tabs 区域 News Search 绿色胶囊初始定位偏差问题**（已完成）：
  - **根本原因定位**：页面初次加载时，JS 执行 `document.querySelector('.vertical-tabs-bar .tab-trigger.active')` 时误匹配到了内嵌在 `#tabsIndicatorTrack` 内部的镜像克隆元素（`.tab-clone`），其相对父容器的 `offsetLeft/offsetTop` 为 `0, 0`（而非真实按钮在父栏 4px 内边距下的 `4, 4`），导致首屏初次渲染时胶囊偏左上 4px 错位；而在用户点击切换后，`switchVertical` 直接传入了真实的 `<button id="tabNews">`，因而立刻矫正；
  - **类名语义隔离**：将内部遮罩克隆节点从 `.tab-trigger.tab-clone` 净化为纯净的 `.tab-clone`，CSS 采用联合选择器（`.tab-trigger, .tab-clone`）共享几何尺寸与排版，彻底避免 DOM 层面误查；
  - **可靠同步队列**：通过 `getActiveTabButton()` 显式绑定真实的 `<button>` 实体，并结合 `requestAnimationFrame`、`document.fonts.ready` 和 `window.load` 多阶段静默重校（`animate = false`），确保任何网络和字体加载环境下初次进入页面时胶囊即精准严丝合缝对齐。
- ✅ **背景水印图标与第二步标题左侧 Icon 共享元素平滑形变动效（Shared-Element Morph）**（已完成）：
  - **视觉连续性与隐喻统一**：将 Stage 1（Typing）的 280px 大号背景环境水印与 Stage 2+ 标题左侧的 28px 图标建立动态连接，形成“同一个图标在不同阶段的物理形变”认知；
  - **正向过渡（Typing ➔ Searching）**：
    - 在打字完毕进入搜索时，水印图标从底色层（`opacity: 0.12`，280px）平滑飞跃穿越画布，同步执行：
      1. **亚像素空间位移**：以中心点为基准精准飞向标题左侧插槽；
      2. **物理缩放**：由 280px 细腻收缩至 28px（缩小 10 倍）；
      3. **透明度凝练**：由 0.12 的虚化背景逐渐加深凝练至 1.0 的高对比度实体；
      4. **无缝零抖动交接**：抵达瞬间完美贴合并无缝交接给原生 flex 标题栏内的 `#canvasHeadingIcon`，随后平稳承接后续 Stage 3/4/5 的所有交互；
  - **反向过渡（Results ➔ Typing / Replay / Tab切换）**：
    - 当动画循环结束回滚或用户点击 Replay / 切换垂直选项卡时，触发 `transitionToTyping()`：小号标题图标沿相反轨迹向画布深处扩散膨胀回 280px 大水印，透明度从 1.0 柔化淡回 0.12，实现完全对称的电影级视觉呼吸感；
  - **矢量资产完全对齐**：News Search 与 Business Search 的 watermarkSvg 与 iconSvg 均统一采用一致的 `viewBox="0 0 24 24"` 与 `stroke-width="2"`，消除缩放过程中的矢量变形失真；
  - **水印图标与标题严格同色（仅透明度变化）**：
    - 将 `.canvas-watermark` 的文字颜色统一为与标题完全一致的纯黑 `#000000`（移除各主题下设置的绿色、褐色或天蓝强调色覆盖）；
    - 将 `.heading-icon-spring` 设置为 `color: inherit;`，严格继承父级 `.canvas-heading-row` 的 `#000000` 标题字色；
    - **视觉纯粹性**：标题（100% 不透明纯黑）与背景大水印（12% 半透明纯黑）在色相和明度上达成 100% 绝对一致，飞行过渡时没有任何色彩色调跳变，仅有**尺寸缩放**、**空间位移**与**透明度从 0.12 到 1.0 的平滑加深**。

- ✅ **修复第三步 Overview 开始卡片左侧多出一个水印图标的问题**（已完成）：
  - **根本原因排查**：在 Stage 1 到 Stage 2 的共享元素变形（`watermarkMorphAnim`）中使用了 Web Animations API 的 `fill: 'forwards'` 配置。在浏览器标准规范中，带有 `fill: 'forwards'` 的动画即使在 `onfinish` 执行后，其最终关键帧（`opacity: 1`、`transform: translate(...) scale(0.1)`）仍被长期固化在 CSS 动画层级，其优先级高于内联样式（`style.opacity = '0'`）和普通 CSS 类名规则。当流程推进到 Stage 3（Overview）时，标题栏 `.canvas-heading-row` 以及内嵌的真实 `#canvasHeadingIcon` 整体向上滑移，而未被显式取消的水印图标仍被动画层强行锁定在 Stage 2 的几何坐标上，导致视觉上在卡片左侧多停留了一个半透明的水印重影；
  - **三重安全防护（Triple-Lock Shield）**：
    1. **显式取消 WAAPI 动画层**：在 `watermarkMorphAnim.onfinish` 以及 `reverseMorphAnim.onfinish` 回调中，显式调用 `anim.cancel()`，彻底释放 WAAPI 对元素样式的图层锁定；
    2. **画布状态机强校验**：在 `setCanvasState(state)` 中，一旦进入非 `typing` 状态（即 `searching`、`overview`、`focus`、`timeline`），立即主动扫描并清理 `canvasWatermark.getAnimations()`，并将 `canvasWatermark.style.display` 严格置为 `'none'`；
    3. **CSS 物理隐藏强制锁**：在全局样式表中追加规则 `.card-canvas.has-results .canvas-watermark { display: none !important; opacity: 0 !important; pointer-events: none !important; }`，由于 `.has-results` 仅在 Stage 3（Overview）、Stage 4（Focus）、Stage 5（Timeline）生效，从渲染树物理层面彻底杜绝了水印图标在结果展示阶段出现的可能，同时完好保留了 Stage 1 到 Stage 2 的丝滑穿越形变。

- ✅ **调整 Stage 5 时间线流卡片容器最大高度为 248px**（已完成）：
  - 将 `.card-canvas.is-stage5 .timeline-stream-block` 的 `max-height` 从原有的 `232px` 调整为 `248px`，使 Stage 5 阶段多篇新闻资讯展开时获得更适宜的纵向视口高度展示。

- ✅ **调整四大核心卖点为自然流畅表述（不刻意前置加重文字）**（已完成）：
  - **自然语法与专业表达（Natural Enterprise Phrasing）**：去除生硬的倒装与刻意前置加粗，还原为清晰自然的名词特性标签 + 完整陈述句，核心指标数字自然融入句中加粗强调：
    1. `• Wire-speed freshness: searchable within <b>3&nbsp;minutes</b> of publication.`（更高时效：发稿3分钟内全网可搜）；
    2. `• Comprehensive coverage: indexing <b>95%</b> of global tier-1 news&nbsp;media.`（更全覆盖：收录95%全球头部主流通讯社与媒体）；
    3. `• Token-efficient deduplication: filters syndicated reprints and duplicate&nbsp;stories.`（更省 Token：智能过滤通稿转载与重复故事）；
    4. `• Topic clustering: tracks complete event lineage and&nbsp;development.`（话题聚合：完整追踪事件始末起因与后续发展脉络）；
  - **排版防孤行与平衡对齐**：每条末尾单词保留 `&nbsp;` 不换行空格与 `text-wrap: pretty;`，保持优雅阅读体验；Business Search 同步恢复纯粹自然表述。

- ✅ **调整四大卖点与上方定位描述文字的间距为 24px**（已完成）：
  - 将 `.summary-box` 的 `gap` 从 `16px` 调整为 `24px`（含 `@media (min-width: 1024px)`），拉开定位描述（`.summary-desc`）与四大核心卖点列表（`.summary-bullets-list`）的纵向呼吸感，使卡片左侧的信息层次更加舒展。

> [!IMPORTANT]
> **开发边界规范**：后续需求与修改**仅针对独立 Demo（`vertical search/` 目录下文件）** 进行，**暂不修改 index 主项目（`src/`、`index.html` 等）**。





