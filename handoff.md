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
    3. **更省 Token（转载去重、相同新闻去重）**：当前仅呈现清洗后的 10 篇文章，缺乏去重与 Token 节省直观感知，建议引入 `⚡ Saved ~18k Tokens` / `86 raw wires consolidated into 10` 压缩比徽章与转载渠道折叠交互；
    4. **话题聚合（追踪事件始末，包含原始事件+子事件）**：当前已由 Stage 3~5 完整体现，建议后续补充 `Origin` ➔ `Escalation` 拓扑阶段标签。

> [!IMPORTANT]
> **开发边界规范**：后续需求与修改**仅针对独立 Demo（`vertical search/` 目录下文件）** 进行，**暂不修改 index 主项目（`src/`、`index.html` 等）**。




