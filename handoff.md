# 项目状态与开发交接上下文 (Handoff Context)

## 📌 项目基本概况
- **仓库地址**: [amasun/octen-homepage](https://github.com/amasun/octen-homepage)
- **本地路径**: `X:\XCoding\Octen\hompage`
- **开发服务**: `http://localhost:3001/` (端口锁定，已开启全量文件实时热更新 `live-reload`)
- **包管理器**: `pnpm` (严禁使用 npm install)

---

## 🛠️ 最近已解决的关键问题与设计决策

1. **Hero 静态仪表盘替换**:
   - 已使用设计规范静态 DOM 替换原本包含视频/动效的动态 Dashboard。
2. **导航栏图标补齐与微调**:
   - `Developers -> Docs` 替换为专属绿色科技感矢量图标。
   - `Web Search` 左侧地球图标替换为 20x20 规范 SVG。
3. **Products 下拉菜单移植与样式统一**:
   - 从 `05-pricing` 完美移植双列卡片（Capabilities + Applications）结构。
   - 移除原先冗余的 "error fetching..." 背景错误提示块。
4. **Omni Search 区域精确对齐与 Early Access 标签修复**:
   - 标题完全采用数学居中对齐（中心 X=942px，与说明文字段落共线）。
   - `Early Access` 标签使用绝对定位挂载（`left: calc(100% + 12px); top: 50%; transform: translateY(-50%)`），杜绝挤占流式排版空间和标题偏移。
   - 标签样式严格执行 Figma 规范：`#18FB6F` 实体纯绿底色、纯黑文字、`JetBrains Mono` 字体、`100px × 24px`、`4px` 圆角。
5. **Navbar 菜单项 Hover 透明度**:
   - Dark 模式下悬停背景由实色 `#333!important` 修改为 50% 半透明 `rgba(51, 51, 51, 0.5) !important`，透出底层渐变光泽。
6. **Navbar 下拉卡片真实尺寸与无形变过渡**:
   - 下拉面板容器 `transition: none !important`，消除切换时的宽度与高度插值形变。
   - `Products` 菜单展示为直观的 821px 双列布局。
   - `Developers` 菜单由原先过宽的 320px 收窄为贴合选项的 208px 紧凑布局。
7. **开发环境与端口管理**:
   - [vite.config.ts](file:///x:/XCoding/Octen/hompage/vite.config.ts) 锁定 `port: 3001, strictPort: true`。
   - 增加 `liveReloadPlugin`，对 `public/` 静态编译包及 `index.html` 的变动实现自动推送与浏览器即时全量刷新。
8. **Footer 结构与排版优化 (Figma 13625:174217)**:
   - 顶部重构为全宽贯穿式 Header（Octen Logo + `The Foundation of Real-Time AI`）带横向分割线。
   - 导航主体重构为标准 5 列布局（`GET IN TOUCH`、`SEARCH`、`OTHERS`、`APPLICATION`、`DEVELOPERS & COMPANY`）。
   - 版权文本更新为 `© 2026 APITECH AI PTE. LTD. All rights reserved.`。
   - 严格复用页面既有的 SVG 图标（邮件、SOC 2 盾牌、Logo 与背景网格）。
9. **Navbar Products 分组恢复**:
   - 保持原版设计规范，`Embedding` 与 `Others` 保持独立子分组。
10. **Vercel 部署静态路由配置**:
   - 新增 `vercel.json`，解决静态部署缺少 `/_next/image` 动态代理导致的图片 404 问题。
11. **Get started in minutes 步骤卡片去点**:
   - 彻底移除 01、02、03 三个步骤卡片内部的白色背景点阵（`radial-gradient` 点阵遮罩），保持纯净的深色线性渐变质感。
   - 同步修改 [index.html](file:///x:/XCoding/Octen/hompage/index.html) 与客户端 chunk [page-04860a45c73d1775.js](file:///x:/XCoding/Octen/hompage/public/_next/static/chunks/app/(marketing)/page-04860a45c73d1775.js)，避免水合冲突。
12. **Footer 菜单栏单行排版修复 (Figma 13625:174221)**:
   - **原因排查**: 原静态 CSS 缺失 `.lg:grid-cols-5` 规则，导致桌面端断点被降级为 `.sm:grid-cols-3`（3 列）从而折行成两行；同时客户端 bundle [layout-8538915e5423da35.js](file:///x:/XCoding/Octen/hompage/public/_next/static/chunks/app/(marketing)/layout-8538915e5423da35.js) 中将 `DEVELOPERS` 与 `COMPANY` 作为 2 个独立顶层项（共 6 项），进一步导致网格折行。
   - **精确修复**:
     1. 在 [layout-8538915e5423da35.js](file:///x:/XCoding/Octen/hompage/public/_next/static/chunks/app/(marketing)/layout-8538915e5423da35.js) 中重构为 5 列数据结构，第 5 列垂直整合 `DEVELOPERS` 与 `COMPANY`，彻底消除第 6 项溢出。
     2. 在 [index.html](file:///x:/XCoding/Octen/hompage/index.html) 与 [c4ae1de60afeb6c3.css](file:///x:/XCoding/Octen/hompage/public/_next/static/css/c4ae1de60afeb6c3.css) 补齐 `@media (min-width: 1024px) { .lg\:grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)) !important; } }`。
     3. 同步优化 [Footer.tsx](file:///x:/XCoding/Octen/hompage/src/components/Footer.tsx) 中的网格定义为 5 列（`repeat(5, minmax(0, 1fr))`）。
     4. 5 大分类（`GET IN TOUCH`、`SEARCH`、`OTHERS`、`APPLICATION`、`DEVELOPERS & COMPANY`）在桌面端完整处于同一行。
13. **Footer 顶部标题下横线样式精确对齐 (Figma 13625:178499)**:
   - **设计规范**:
     - `border-bottom: 1px solid rgba(207, 207, 207, 0.2)` (透明度调整为 0.2)
     - `padding: 0px 0px 60px` (padding-bottom: 60px)
     - `display: flex; flex-direction: column; align-items: flex-start; align-self: stretch;`
     - 下方间距收缩为 `mb-10` (40px)
   - **三层同步落地**:
     1. **客户端 Chunk**: [layout-8538915e5423da35.js](file:///x:/XCoding/Octen/hompage/public/_next/static/chunks/app/(marketing)/layout-8538915e5423da35.js) 中配置内联样式 `borderBottom: "1px solid rgba(207, 207, 207, 0.2)"` 与 `paddingBottom: "60px"`，防止 SSR 与 CSR 水合时产生属性差异。
     2. **静态入口**: [index.html](file:///x:/XCoding/Octen/hompage/index.html) 同步更新内联样式与 `mb-10` 类名。
     3. **全局样式表**: [c4ae1de60afeb6c3.css](file:///x:/XCoding/Octen/hompage/public/_next/static/css/c4ae1de60afeb6c3.css) 补充 `.border-[#CFCFCF33], .footer-title-divider` 强制规则。
     4. **React 源码组件**: [Footer.tsx](file:///x:/XCoding/Octen/hompage/src/components/Footer.tsx) 同步对齐 `borderBottom`、`paddingBottom: '60px'` 及 `alignSelf: 'stretch'`。
14. **Footer 顶部全宽分割线与前置章节半分割线优化**:
   - **移除半分割线**: 移除 `#get-started` 模块底部的局部半宽分割线（原 `max-w-7xl mx-auto py-25 border-b border-[#FFFFFF33]`，该分割线在视觉上位于 Footer 内部 `pt-16 pb-6` 正上方），解决其桌面端仅局限于 1280px 网格的截断问题。
   - **新增贯穿全宽顶部分割线**: 在 Footer 整个容器顶部（即背景粒子层 `.particles-container undefined` 上方）增加一条与标题下横线同款规格的全宽贯穿式分割线（`border-top: 1px solid rgba(207, 207, 207, 0.2)`）。
   - **多端同步更新**:
     1. [layout-8538915e5423da35.js](file:///x:/XCoding/Octen/hompage/public/_next/static/chunks/app/(marketing)/layout-8538915e5423da35.js)：Footer 容器增加 `border-t` 与 `borderTop: "1px solid rgba(207, 207, 207, 0.2)"`。
     2. [page-04860a45c73d1775.js](file:///x:/XCoding/Octen/hompage/public/_next/static/chunks/app/(marketing)/page-04860a45c73d1775.js)：移除 `border-b border-[#FFFFFF33]`。
     3. [index.html](file:///x:/XCoding/Octen/hompage/index.html)：移除 get-started 容器的 `border-b border-[#FFFFFF33]`，并在 `<footer>` 容器挂载 `border-t` 与内联 `border-top: 1px solid rgba(207, 207, 207, 0.2)`。
     4. [c4ae1de60afeb6c3.css](file:///x:/XCoding/Octen/hompage/public/_next/static/css/c4ae1de60afeb6c3.css)：增加 `footer[data-node-id="13625:174217"], footer.relative { border-top: 1px solid rgba(207, 207, 207, 0.2) !important; }`。
     5. [Footer.tsx](file:///x:/XCoding/Octen/hompage/src/components/Footer.tsx)：更新根容器属性为 `borderTop: '1px solid rgba(207, 207, 207, 0.2)'`。
15. **Vertical Search 模块结构重构 (Figma 13625:179114)**:
   - **设计稿深度对齐**: 彻底替换原简易 3 张灰色骨架轮播卡片，重构为 Figma 最新设计结构：
     1. **文案区**: 更新副文案为 `LLM-native web search, delivering industry-leading real-time intelligence with the lowest latency and enterprise-grade reliability.`；CTA 按钮对齐为 `Request Access` + 箭头图标。
     2. **行业分类 Tab**: 新增顶部 3 大重点场景标签（`Business`、`News`、`Academic`），默认激活 `News`（`#a7f07d` 高亮底色），具备交互切换能力。
     3. **巨幅展示卡片**: 采用 56px 大圆角绿黄渐变卡片（`#AAEF8A` ~ `#F3FFC1`），居中悬浮白底毛玻璃搜索药丸框（`w: 518px; h: 66px; border: 8px solid rgba(255,255,255,0.4)`），展示真实查询文案与 AI 搜索图标，并随 Tab 点击联动更新。
     4. **未来规划场景跑道**: 底部呈现 `More scenarios in future releases`，带两侧白光渐变遮罩（`w: 160px`）与 9 大行业标签（`Legal`、`Sport`、`Code`、`Design`、`Travel`、`Game`、`Real Estate`、`Shopping`、`Finance`），实现无缝无限滑动跑道。
   - **多端与源码同步**:
     1. [index.html](file:///x:/XCoding/Octen/hompage/index.html)：更新 `<head>` 样式、HTML 结构与交互脚本。
     2. [VerticalSearch.tsx](file:///x:/XCoding/Octen/hompage/src/components/VerticalSearch.tsx)：创建全新 React TypeScript 组件并接入 [App.tsx](file:///x:/XCoding/Octen/hompage/src/App.tsx)。
     3. 矢量图标永久归档保存至 `public/images/vertical/`。
16. **Vertical Search 巨幅卡片样式精确对齐 (Frame 427319246)**:
   - **设计规格**:
     - `width: 1260px; height: 532px;`
     - `background: linear-gradient(67.02deg, #AAEF8A 3.49%, #F3FFC1 101.39%), #BBEE97;`
     - `border-radius: 40px;`
     - `flex: none; order: 0; flex-grow: 0;`
   - **多端同步更新**:
     1. [index.html](file:///x:/XCoding/Octen/hompage/index.html)：更新 `.octen-vs-card-banner` 样式为 40px 圆角与 67.02deg 线性渐变。
     2. [VerticalSearch.tsx](file:///x:/XCoding/Octen/hompage/src/components/VerticalSearch.tsx)：同步内联样式保证 React 渲染层一致性。
     3. [index.css](file:///x:/XCoding/Octen/hompage/src/index.css) & [c4ae1de60afeb6c3.css](file:///x:/XCoding/Octen/hompage/public/_next/static/css/c4ae1de60afeb6c3.css)：同步全量补充规则。
17. **Vertical Search 巨幅卡片三阶段时间轴动态演示 (Figma 13625:179507)**:
   - **分步动画编排**:
     1. **阶段 1 (输入 query)**: 搜索框处于巨幅卡片正中央（`top: 50%; height: 66px`），展示真实查询文案及左侧新闻报刊图标。
     2. **阶段 2 (开始搜索)**: 搜索框平滑上移至卡片顶端（`top: 36px; height: 127px`），AI 搜索星光图标旋转，底部浮现 10 个脉冲波浪圆点进行检索等待。
     3. **阶段 3 (时间轴展现结果)**: 搜索框底部呈现提炼统计指标（`2 subjects · 10 articles · 89 ms`），向下延伸白色半透明垂直连接线；5 张真实新闻事件卡片瀑布流错峰弹出（包含时间戳、来源域名及长标题），并在卡片视口内平滑微滚展示。
   - **交互与循环体验**:
     - 动画全自动无缝循环（约 13s 一个周期），鼠标悬停（hover）时立即暂停以便用户阅读卡片内容，移开后恢复播放。
     - 顶部分类 Tab（`News`、`Business`、`Academic`）点击时将即刻启动对应分类的定制搜索演练与真实时间轴数据。
   - **多端同步更新**:
     - 静态入口 [index.html](file:///x:/XCoding/Octen/hompage/index.html)、源码组件 [VerticalSearch.tsx](file:///x:/XCoding/Octen/hompage/src/components/VerticalSearch.tsx) 及样式表均已全量落地，并通过 TypeScript / 构建校验。
18. **Vertical Search 动画细节深度改造 (打字效果 / 静止Icon / 6px竖线 / 移出画外 / 卡片2s步进停顿)**:
    - **步骤 1 (打字效果)**:
      - 进入步骤 1 时先清空输入框，采用逐字打字机动效（~36ms/字），末尾带有高科技绿色呼吸闪烁光标（`.octen-vs-typing-cursor`）。
      - 打字完成之后自动停顿约 1.2s，让用户看清输入内容，随后平滑过渡至步骤 2。
    - **步骤 2 (搜索中静止 Icon)**:
      - 彻底移除输入框右侧 icons 的旋转动画（`animation: octen-vs-spin`），图标保持静止优雅展示；保留中间 10 个绿色脉冲圆点的检索波浪动效。
    - **步骤 3 (时间轴竖线 6px 粗)**:
      - 时间轴垂直连接线 `.octen-vs-timeline-line` 宽度升级为 `6px` 粗（`width: 6px; border-radius: 3px;`），从卡片顶部贯穿到底部，极具视觉冲击力与现代感。
    - **步骤 3 (卡片向上运动 & 主 Query 输入框移出画外 & 每步停顿 2s 直到出完)**:
      - 初始状态（第 0 步）：主 Query 输入框在卡片上方展示统计信息，第 1 张时间轴卡片在下方露面，在此停顿 **2s**。
      - 第 1 步上移：主 Query 输入框平滑向上平移（`transform: translateX(-50%) translateY(-220px); opacity: 0;`）彻底**移出画外**！同时卡片列表向上平移 144px，第 2 张卡片上升到视觉焦点，移动到位后**停顿 2s**！
      - 后续各步：卡片列表依次步进上移（每步平移 144px），每移动一个卡片出来中间均有完整的 **2s 停顿**，让用户舒适阅读每一个时间节点与新闻条目。
      - 完结与循环：全部卡片滚动出完并在最后一张卡片停顿 2.5s 后，平滑返回步骤 1，重新进入打字效果循环。
    - **严格遵照指令**:
      - 仅针对 `Search built for every vertical` 进行重构与强化，完全保持 `Omni Search` 原状未作任何改动。
19. **Vertical Search 辅助副标题文案更新**:
    - 将原辅助文字更新为：`Give every industry the real-time context it needs with search tuned to its sources, language, and workflows. <strong>News search is live now.</strong>`。
    - 其中 `News search is live now.` 进行特别加粗高亮（`font-weight: 600; color: #000000;`）。
    - 同步更新了 [index.html](file:///x:/XCoding/Octen/hompage/index.html) 和 [VerticalSearch.tsx](file:///x:/XCoding/Octen/hompage/src/components/VerticalSearch.tsx)。
20. **More scenarios 走马灯 Hover 透明度交互优化**:
    - **修改前**: 原逻辑在跑道容器 `.octen-vs-scenarios-track:hover` 上设置了全局 `opacity: 0.95`，导致鼠标移入跑道区域时所有卡片同时变亮。
    - **修改后**:
      1. 移除跑道容器 `.octen-vs-scenarios-track` 的整体 opacity 控制，悬浮时仅负责暂停跑道滚动（`animation-play-state: paused;`）。
      2. 将默认透明度设置在每个独立卡片（`.octen-vs-scenario-badge, .octen-vs-more-badge`）上（`opacity: 0.65;`）。
      3. 鼠标悬停在特定卡片上时（`:hover`），**仅该卡片去掉透明度（`opacity: 1 !important;`）**，其余未被 hover 的卡片继续保持原有透明度（`0.65`）不变。
    - **同步文件**: [index.html](file:///x:/XCoding/Octen/hompage/index.html) 与 [index.css](file:///x:/XCoding/Octen/hompage/src/index.css)。
21. **Omni Search 底部背景图替换为 `gradient.png`**:
    - 将 Omni Search 区域底部的发光渐变底图（原 `multi-modal-bottom-light.7004d871.png`）替换为用户提供的 [gradient.png](file:///x:/XCoding/Octen/hompage/gradient.png)（1920x556 规范高清底图）。
    - **双重保障替换机制**:
      1. 复制至 `public/gradient.png`，并将 [index.html](file:///x:/XCoding/Octen/hompage/index.html) 中对应的 `<img>` 标签的 `src` 与 `srcSet` 直接更新为 `/gradient.png`。
      2. 同步覆盖 `public/_next/static/media/multi-modal-bottom-light.7004d871.png` 文件内容，保证任何客户端水合（Hydration）或静态缓存均能无缝渲染全新的 `gradient.png`。

---

## 📂 代码架构分层说明
- **运行层**: 当前入口为根目录 [index.html](file:///x:/XCoding/Octen/hompage/index.html) + `public/_next/`，呈现 100% 完整原站动效与资产。
- **源码层**: `src/components/*.tsx` 为手写的高质量 React 18 + TS 组件，已预先准备好组件拆分。
- **样式配置**: 核心补丁位于 [index.html](file:///x:/XCoding/Octen/hompage/index.html) 顶部的 `<style id="octen-local-nav-width-fix">` 与 `public/_next/static/css/c4ae1de60afeb6c3.css`。
