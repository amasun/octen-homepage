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
  - 包含了 [news-search-demo.html](file:///x:/XCoding/Octen/hompage/vertical%20search/news-search-demo.html)、[business-search-demo.html](file:///x:/XCoding/Octen/hompage/vertical%20search/business-search-demo.html)、[NEWS_SEARCH_ANIMATION_SPEC.md](file:///x:/XCoding/Octen/hompage/vertical%20search/NEWS_SEARCH_ANIMATION_SPEC.md)、[BUSINESS_SEARCH_SPEC.md](file:///x:/XCoding/Octen/hompage/vertical%20search/BUSINESS_SEARCH_SPEC.md) 及控制台交互规范；
  - **后续规划**：后续将直接在 `vertical search/` 目录下用同一个 HTML 整合 News 与 Business 的动效交互。
- ✅ **News Search 5 步动效全套移植**（已完成）：
  - 中央舞台 5 步时序动画（逐字打字 ➔ 正弦波脉冲 ➔ 卡片总览翻滚 ➔ 药丸形态形变 ➔ 时间线滚动延展）已由 [vertical search/news-search-demo.html](file:///x:/XCoding/Octen/hompage/vertical%20search/news-search-demo.html) 完整落地至 `src/sections/05-vertical-search.html` 与 `public/js/vertical-search.js`。
  - 支持进入视口自动播放、悬浮暂停、药丸 Tab 切换与 Replay 重播。
  - **参考设计稿**：👉 [Figma News 动效 5 步静态分步设计稿 (Node 13661:163623)](https://www.figma.com/design/jnIlRSuXffn5g2OxnsqYIE/Octen_%E6%B1%87%E6%80%BB?node-id=13661-163623&t=7uy39MOcdDWVIOA4-4)。
- ✅ **Business Search 巨幅卡片背景与水印精确对齐 Figma (Node 13795:166561)**（已完成）：
  - 渐变角度微调：调整为 Figma 导出的高精度 `linear-gradient(22.8deg, rgba(255, 223, 80, 0.6) 0.11%, rgba(255, 249, 230, 0.6) 101.27%), linear-gradient(90deg, rgba(255, 205, 97, 0.6) 0%, rgba(255, 230, 153, 0.6) 100%)`；
  - 核心背景高光元素 (`.canvas-aura`)：引入 Figma 原型中的 600px 居中白色径向光晕球（`radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 70%)`），增强卡片纵深与光影质感；
  - SVG 水印严格对齐：
    - 透明度统一锁定为 Figma 规范的 `opacity: 0.12 !important`；
    - 颜色采用纯黑 `#000000` 融入背景底色，移除原先粗糙的棕黄色着色覆盖；
    - 尺寸精确对齐为 `280px × 280px`，桌面端定位为 `left: 120px; top: 126px;`（移动端自适应响应）；
    - Business 水印矢量更新为 Figma 原型提取的高精度公文包矢量节点，线条粗细与原稿完美一致。
- ✅ **Section 8 Start Building (CTA) 背景色与可见性修复**（已完成）：
  - 外层容器补充 `#080B12` 暗黑背景与底部分割线 `<div class="w-full border-b border-[#FFFFFF33]">`；
- ✅ **Business Search 规范与结构性差异归档**（已完成）：
  - 输出权威规范文档 [vertical search/BUSINESS_SEARCH_SPEC.md](file:///x:/XCoding/Octen/hompage/vertical%20search/BUSINESS_SEARCH_SPEC.md)；
  - 同步更新并在 [vertical search/Business Search 控制台交互/Business Search 控制台交互.md](file:///x:/XCoding/Octen/hompage/vertical%20search/Business%20Search%20控制台交互/Business%20Search%20控制台交互.md) 中完整收录与 News Search 的数据模型、实体二分（Company vs Person）、双轨动态（Activities 时间线 vs News 列表）以及控制台参数结构差异。
- ✅ **Vertical Search 独立 Demo 双 Tab 与 Business 整合**（已完成）：
  - 将 Business Search 完整补充进 [vertical search/news-search-demo.html](file:///x:/XCoding/Octen/hompage/vertical%20search/news-search-demo.html)；
  - 采用 index 主站的 Hero 标题排版（`Search / PREMIER` 胶囊标签、动态标题副标题、`Request Access` 按钮）与毛玻璃双 Tab 胶囊栏（`News Search` vs `Business Search`）；
  - 支持主题色、水波纹、水印 SVG、打字 Query、统计数字、卡片形变与 5 阶段动画一键无缝切换与独立运行。

> [!IMPORTANT]
> **开发边界规范**：后续需求与修改**仅针对独立 Demo（`vertical search/` 目录下文件）** 进行，**暂不修改 index 主项目（`src/`、`index.html` 等）**。



