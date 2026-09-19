# Octen 官网开发交接 (Handoff)

> 💡 **项目说明**：本项目采用 **Vite + 模块化 HTML Partials (`<include>`) + CSS/Vanilla JS** 作为页面主干，同时在 `src/components/` 维护同等 React 双轨组件。

---

## 🌐 核心访问入口
- **线上部署预览**：https://octen-homepage.vercel.app/
- **独立备用模态预览**：`http://localhost:3001/backup-modules.html`
- **本地开发服务**：`http://localhost:3001/`（启动命令：`pnpm dev`）
- **开发者交接简报**：[DEVELOPER_HANDOVER.md](file:///x:/XCoding/Octen/hompage/DEVELOPER_HANDOVER.md)

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
- **News Search 5 步动效优化**：
  - 中央舞台动画时序和状态流转仍需前端进一步微调。
  - **参考设计稿**：请对照 👉 [Figma News 动效 5 步静态分步设计稿 (Node 13661:163623)](https://www.figma.com/design/jnIlRSuXffn5g2OxnsqYIE/Octen_%E6%B1%87%E6%80%BB?node-id=13661-163623&t=7uy39MOcdDWVIOA4-4)。
