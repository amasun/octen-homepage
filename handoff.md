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
    - 将 Omni Search 区域底部的发光渐变底图替换为用户提供的 [gradient.png](file:///x:/XCoding/Octen/hompage/gradient.png)。
    - 复制至 `public/gradient.png`，并同步覆盖 `public/_next/static/media/multi-modal-bottom-light.7004d871.png`。
22. **单一数据源架构深度改造 (Single Source of Truth Refactor)**:
    - **痛点根治**: 彻底删除了底部转义字符串模板 `vsTemplate`，删除了死循环轮询 `setInterval(mount, 300)`。
    - **收益**: 确立单一真理来源，改文字、样式或逻辑只需在 [index.html](file:///x:/XCoding/Octen/hompage/index.html) 中改动一次即可即时生效。
23. **全站结构深度优化与“两套重复页面”彻底根除**:
    - **根本问题排查与攻克**:
      - 查明原版 Next.js 混淆脚本在客户端执行水合时，因与已修改 DOM 产生 mismatch 导致 React 18 触发了 Client fallback 全量重新渲染，在页面底部追加了第二套完整页面；
      - 同时静态导出的 HTML 源码中存在 90 处写死的内联 `style="opacity: 0"`，导致 Web Search / Omni Search 处于隐形状态。
    - **全面优化实施**:
      1. **彻底移除 40 个 Next.js 混淆 Chunks 脚本**：完全杜绝客户端二次水合与重新挂载，第二套页面彻底消失，页面体积减少 48KB。
      2. **彻底铲除 `vsTemplate` 模板与 `setInterval` 轮询**：代码纯净原生化，Vertical Search 仅在 `DOMContentLoaded` 初始化一次。
      3. **解除 90 处内联 `opacity: 0` 封印**：添加静态可见性恢复规则，Web Search、Omni Search（含 gradient.png 底图）、视频/图像展示卡片瞬时恢复 100% 完整可见，原汁原味展现官网视觉。
      4. **重构轻量原生 Navbar 下拉交互**：纯原生 30 行事件监听支持 Products 与 Developers 菜单悬浮切换，消除庞大的外部依赖。
    - **成果与验证**:
      - 页面仅保留唯一的 11 个标准主标题段落，无任何重复、无任何缺失。
      - `tsc` 与 `pnpm build` 仅耗时 **199ms**，打包零警告零报错，开发服务器 `http://localhost:3001/` 毫秒级稳定秒开。

24. **Navbar Products 与 Developers 下拉悬浮菜单原生挂载与恢复**:
    - **DOM 挂载**: 将保存完好的 12 项高精切图与矢量图标的 [products_menu.html](file:///x:/XCoding/Octen/hompage/products_menu.html)（821px 三列布局：Search、Embedding & Others、Application）及 Developers 菜单（208px 紧凑布局：API Platform 与科技绿 Docs）原生挂载入 [index.html](file:///x:/XCoding/Octen/hompage/index.html) 的 `.pc-nav_ViewportPosition__wHhyv` 容器中。
    - **样式与自适应修复**: `.pc-nav_Viewport__lDMhI` 配置自动尺寸计算（`width: auto !important; height: auto !important;`）与 0.15s 淡入动画，切换菜单零形变抖动；新增箭头的 180° 平滑翻转动效。
    - **事件机制优化**: 原生事件驱动，区分 button 触发器与普通链接，悬停自动激活对应面板并带有 180ms 防抖离手延时，体验丝滑稳定。
    - **构建验证**: 执行 `pnpm build` (`tsc && vite build`) 零报错顺利通过。

25. **Footer 样式错乱彻底重构与 Figma 13625:174217 全量像素级对齐**:
    - **样式错乱根因分析**:
      - 之前直接在 [index.html](file:///x:/XCoding/Octen/hompage/index.html) 中使用 Tailwind 任意中括号类名（如 `pb-[60px]`, `py-[30px]`, `space-y-5`, `bottom-[91px]`, `gap-[30px]`, `text-[41.5px]`）；
      - 由于项目当前采用预编译的静态 CSS 资产，**并不存在运行时 Tailwind JIT 编译器**，导致所有中括号类名全部失效，链接垂直间距折叠为 0、底部栏失去上下内边距、徽标 bottom 坐标丢失。
    - **终极解决方案与落地**:
      1. **独立样式规则注入**: 在 [index.html](file:///x:/XCoding/Octen/hompage/index.html) `<head>` 中新增 `<style id="octen-footer-styles">`，以原生明确的 CSS 规则替代失效的 Tailwind 类名。
      2. **Header 区域**: 底部内边距 `padding-bottom: 60px`，下边框 `border-bottom: 1px solid rgba(207, 207, 207, 0.2)`，Logo 精准尺寸 `184px × 62.5px`，Slogan "The Foundation of"（300 Light 41.5px）+ "Real-Time AI"（Fraunces Italic 41.5px 绿渐变），间距 `17px`。
      3. **5 列导航菜单高度与间距**:
         - 整体底部边距 `padding-bottom: 60px`，5 列栅格 `gap: 40px`。
         - 每列链接垂直步进间距统一提升为 `gap: 20px !important`，字号 `16px`、行高 `24px`，文字颜色 `rgba(255,255,255,0.8)`。
         - Col 1 (Get in touch) 配置 `padding-left: 24px`，邮箱图标位于 `left: -24px; top: 4px;`。
         - Col 5 (Developers & Company) 保持标准紧凑宽度 `110px`，两个子分组垂直间距 `gap: 30px`。
      4. **SOC 2 徽标位置 (Figma 13625:174285)**:
         - 独立卡片绝对定位：`position: absolute; right: 24px; bottom: 91px; z-index: 10;`，精确贴合于 1280px 容器右边缘、底部横线正上方，绝不侵入底部版权栏。
         - 矢量盾牌 SVG 替换为 Figma Dev Mode 原生提取的 `ant-design:safety-outlined` 高清白底矢量图。
         - 文本分级：`SOC 2®` (12px 加粗白字) 与 `Type 2` (10px 50%白)。
      5. **底部版权栏 (Figma 13625:174279)**:
         - `border-top: 1px solid rgba(255, 255, 255, 0.1); padding: 30px 0;`
         - 左右两端对齐：左侧 `© 2026 APITECH AI PTE. LTD. All rights reserved.`，右侧 Privacy Policy 与 Terms of Service 间距 `30px`。
    - **同步与验证**:
      - [index.html](file:///x:/XCoding/Octen/hompage/index.html) 与 [Footer.tsx](file:///x:/XCoding/Octen/hompage/src/components/Footer.tsx) 均已完整同步。
      - `pnpm build` (`tsc && vite build`) 零警告通过（耗时 ~220ms）。
      - 本地服务 `http://localhost:3001/` 实时生效。

26. **Vertical Search 核心区域从 `temp2` 像素级要素完整移植**:
    - **背景与目标**:
      - 将 [X:\XCoding\Octen\temp2](file:///x:/XCoding/Octen/temp2) 的独立落地页中高精实现的 "Search built for every vertical" 区域（含 Hero 标题、3 类 Vertical 选项卡、1260x532 渐变互动画布、1-2-3 步逐帧流水线、动态管道连接脊柱、步进上移时间线卡片群、以及底部 12 行业无限无缝跑马灯）全量移植至主项目 [hompage/index.html](file:///x:/XCoding/Octen/hompage/index.html)。
      - 严格保持主项目现有的顶部导航栏 Navbar（含 Products/Developers 下拉菜单）以及底部 Footer 完好无损。
    - **资产与路径对齐**:
      - 完整复制 `temp2/assets/` 下全部 31 个 SVG 矢量图至 [public/assets/](file:///x:/XCoding/Octen/hompage/public/assets/)，涵盖所有分类图标、时钟图标、14 动画点阵波浪、搜索晶体图标及背景水印。
      - 将所有相对路径 `assets/*.svg` 精准重写为 Vite 根静态路径 `/assets/*.svg`，确保所有网络请求 100% 命中且 HTTP 200。
    - **样式与设计系统融合**:
      - 将 `temp2/css/variables.css`、`temp2/css/style.css`（剥离无关的子页 nav 和 footer）以及 `temp2/css/marquee.css` 统一规整并注入至 `<style id="octen-vertical-search-styles">`。
      - 引入 Google Fonts（DM Sans、Fraunces、JetBrains Mono、DM Mono）。
      - 隔离重置规则，仅作用于 `.vertical-search-section` 内部，避免污染主项目其它区块。
    - **交互与动画控制引擎挂载**:
      - 移植 `temp2/js/main.js` 完整 659 行多阶状态机引擎至 `<script id="octen-vertical-search-script">`：
        1. **Step 1 打字机交互**: 平滑输出各行业真实搜索 Prompt，光标绿/蓝/黄动态匹配分类主题；
        2. **Step 2 搜索中过渡**: 14 纯黑点正弦波起伏动画；
        3. **Step 3 时间线步进**: 动态伸缩白色 Pipeline 脊柱线，5 张新闻/学术/商业卡片依次进入视口并匀速向上推移，首卡推出画外；
        4. **行业自动轮询与悬停暂停**: News ➔ Academic ➔ Business 自动流转；鼠标移入画布暂停上移，移出平滑恢复；
        5. **底部跑马灯芯片联动**: 点击底部跑马灯芯片立即回填搜索词并更新背景大水印。
    - **细节调优与 Bug 修复**:
      - **标题严格居中**: 修正 `<style id="octen-vertical-search-styles">` 中的非法嵌套注释，确保 Flex 居中规则生效，加固 `margin: 0 auto; text-align: center;`；
      - **状态机动画秒启**: 剥离内部重复包裹的 `DOMContentLoaded` 事件监听，确保脚本加载完成后直接启动打字机及后续流水线动效；
      - **Code 图标定制替换**: 将 [public/assets/icon-code.svg](file:///x:/XCoding/Octen/hompage/public/assets/icon-code.svg) 与脚本中 `ICONS.code` 全量替换为用户指定的新版斜杠闭合代码矢量图形。
    - **构建与服务验证**:
      - 执行 `pnpm build` (`tsc && vite build`) 零警告零报错通过，打包耗时 225ms，生成代码 468.99 kB。
      - 开发服务在 `http://localhost:3001/` 实时响应，主导航与页脚均稳定正常。

27. **Academic 与 Game 图标长宽比与形变彻底纠正**:
    - **根本原因排查**:
      - 原 SVG 导出文件包含 `preserveAspectRatio="none"` 且使用了非正方形画幅尺寸：
        - `icon-academic.svg`: 原始视口为宽画幅 `16.5114 × 12.0003`（宽高比约 1.38:1）；
        - `icon-game.svg`: 原始视口为窄高画幅 `12 × 16.5`（宽高比约 0.73:1）；
      - 当页面通过 `<img src="/assets/icon-*.svg" width="18" height="18" />` 以及 CSS `.tab-trigger img`, `.scenario-chip img` 强制设定为 1:1 正方形（18px × 18px）时，`preserveAspectRatio="none"` 导致浏览器忽略图形内在比例，将 Academic 学士帽在垂直方向拉伸 1.5 倍（形态失真瘦高），将 Game 游戏机在水平方向拉伸 1.5 倍（形态失真肥扁）。
    - **精确修正实施**:
      1. 彻底移除 `preserveAspectRatio="none"` 畸变属性；
      2. 将 `icon-academic.svg` 与 `icon-game.svg` 统一重构为标准 18×18 纯正方形视口（`viewBox="0 0 18 18"`），通过精密的几何位移矩阵（偏移量居中补偿），将核心图形水平垂直双向严格数学居中（对称轴 X=9，Y=9）；
      3. 同步修正了 [public/assets/icon-academic.svg](file:///x:/XCoding/Octen/hompage/public/assets/icon-academic.svg)、[public/assets/icon-game.svg](file:///x:/XCoding/Octen/hompage/public/assets/icon-game.svg) 以及历史归档 `public/images/vertical/` 目录下的所有对应文件；
      4. 页面中 Tab 触发器、Marquee 无限跑马灯芯片以及背景动态水印图标在任何容器缩放下均保持原画真实的完美几何长宽比例。
    - **构建与验证**:
      - 运行 `pnpm build` (`tsc && vite build`) 零错误通过（耗时 228ms）；
      - 本地开发服务 `http://localhost:3001/` 资源请求确认 HTTP 200 且正确返回 18x18 正方形 SVG 矢量内容。

28. **Image & Video Search 双列并排与 Figma 13631:182359 像素级重构**:
    - **并排架构改造**: 将原本纵向分散的 Image Search 与 Video Search 区域整合为高精并排的双列展示系统（左右各 630px 独立卡片，位于 1280px 标准容器内居中对齐）。
    - **Figma 细节要素像素级还原**:
      - 标签系统：左列 `Image Search` 与右列 `Video Search` 胶囊 Tag；
      - 主副标题：采用 Fraunces 衬线字体 44px 配合 `#18FB6F` 科技绿 JetBrains Mono "Early Access" 徽章；
      - 3 行特征卡：每列配置 3 项特色功能卡片，带细边框与毛玻璃悬浮高亮；
      - 渐变底板与搜索演示窗：左侧展示图片特征提取及相似图检索，右侧展示视频时间戳动作定位及帧级搜索。
    - **双层同步与验证**:
      - [index.html](file:///x:/XCoding/Octen/hompage/index.html) 新增 `<section id="modalities-search">` 与专用样式 `<style id="octen-modalities-search-styles">`；
      - 同步创建 [ImageVideoSearch.tsx](file:///x:/XCoding/Octen/hompage/src/components/ImageVideoSearch.tsx)，并在 [App.tsx](file:///x:/XCoding/Octen/hompage/src/App.tsx) 及 [src/index.css](file:///x:/XCoding/Octen/hompage/src/index.css) 中挂载；
      - `pnpm exec tsc --noEmit` 0 报错通过。

29. **Vertical Search 动画步骤三 3 卡同屏与底部入场优化**:
    - **原动画问题分析**:
      - 原 Step 3 的卡片时间线轨道设定 `top: 205px`，导致仅聚焦中间单个卡片；
      - 当新卡片激活步进时，新卡片均从画布中轴（`205px`）滑入，视口中仅能看到 1~2 张卡片，且新卡切入在中部截断了上方上下文。
    - **数学几何重构与居中推导**:
      - 画布固定高度 532px，卡片高 118px，纵向间距 40px，3 张卡片总高度 `118×3 + 40×2 = 434px`；
      - 垂直对称边距为 `(532 - 434) / 2 = 49px`；
      - 将 `.timeline-scroll-track` 的初始定位从 `top: 205px` 精确修正为 `top: 49px`；
      - 优化上下双向渐变遮罩：`-webkit-mask-image` 设定顶部 32px 与底部 32px 柔和淡出，确保 3 个卡片位（Slot 1: 49~167px, Slot 2: 207~325px, Slot 3: 365~483px）在屏幕中 100% 完整清晰显示。
    - **步进逻辑与底部滑入动效**:
      - Step 3 启动时，搜索胶囊自动滑出视口顶部（`.pill-out`），前 3 张卡片（Cards 0, 1, 2）以微阶梯（60ms, 180ms, 300ms）自然铺满一屏；
      - 停留 2.2s 后启动向上平移流水线：
        - 窗口 1：轨道平移 -158px，Card 0 向上滑出，Slot 3 底部平滑**滑入 Card 3**；
        - 窗口 2：轨道平移 -316px，Card 1 向上滑出，Slot 3 底部平滑**滑入 Card 4**（最新卡片，绿标时间）；
      - 任何时刻一屏内均稳定展现 3 张完整卡片，**所有新卡片 100% 均从底部（Slot 3）自然滑入**；
      - 动态更新中心连接脊柱线 `pipeline-spine`，实时跟随当前最新卡片延展；
      - 悬停 Hero 画布暂停步进，移出后平滑恢复；全流程播完后停留 3.0s 自动轮转到下一行业。
    - **组件与构建验证**:
      - 同步重构 [index.html](file:///x:/XCoding/Octen/hompage/index.html) 中的脚本与样式以及 [VerticalSearch.tsx](file:///x:/XCoding/Octen/hompage/src/components/VerticalSearch.tsx)；
      - 运行 `pnpm exec tsc --noEmit` 0 报错通过；
      - 纯原生 JS 语法校验通过，本地服务 `http://localhost:3001/` 实时稳定生效。

30. **Web Search 区域对比卡片边框从虚线改为实线**:
    - **调整范围**:
      - 将 Web Search 下方的核心双列对比卡片外层边框由虚线改实线：`border border-[#555555] border-dashed` ➔ `border border-[#555555] border-solid`；
      - 将 Human Search 与 Octen Search 之间的纵向列分割线由虚线改实线：`md:border-r-[#555555] border-dashed` ➔ `md:border-r-[#555555] border-solid`。
    - **视觉提升与验证**:
      - 彻底消除草稿感与临时占位框视觉，整体风格更符合高精商业交付级标准；
31. **More scenarios in future releases 走马灯卡片透明度优化与 GitHub 交付**:
    - **透明度优化**:
      - 深度对齐 Figma 设计规范（Node `13628:180824`，全局 `opacity: 0.6`）；
      - 为底部无限走马灯卡片 `.scenario-chip`（以及 React 样式 `.octen-vs-scenario-badge`, `.octen-vs-more-badge`）添加 `opacity: 0.6;` 基准透明度，消除纯灰厚重底色，呈现通透精致的微透质感；
      - 悬停（`:hover`）时即刻平滑过渡恢复至 `opacity: 1 !important;`，配合 `translateY(-2px)` 与微阴影浮起动效，提供聚焦高亮反馈；
      - 同步维护 [index.html](file:///x:/XCoding/Octen/hompage/index.html) 与 [src/index.css](file:///x:/XCoding/Octen/hompage/src/index.css)。
    - **环境与交付**:
      - 清理无用调试文件 `scratch_products.txt`，更新 `.gitignore` 补充 `.vscode/`；
      - 运行 `pnpm run build` 打包验证 0 报错通过；
      - 执行 Git 提交并推送到 GitHub 远端仓库 `origin/main`。

---

## 📂 代码架构分层说明
- **运行层**: 当前入口为根目录 [index.html](file:///x:/XCoding/Octen/hompage/index.html) + `public/_next/` + `public/assets/`，呈现 100% 完整原站动效与资产。
- **源码层**: `src/components/*.tsx` 为手写的高质量 React 18 + TS 组件，已预先准备好组件拆分。
- **样式配置**: 核心补丁位于 [index.html](file:///x:/XCoding/Octen/hompage/index.html) 顶部的 `<style id="octen-local-nav-width-fix">`、`<style id="octen-vertical-search-styles">`、`<style id="octen-footer-styles">` 与 `public/_next/static/css/c4ae1de60afeb6c3.css`。


