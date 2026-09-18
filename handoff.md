# Octen 官网开发交接 (Handoff)

## 📌 当前最新进展 (Latest Progress)

### 1. 标题标签图标清理 (Section Tag Icons)
- **范围**：`src/sections/06-retrieval-stack.html`
- **处理**：
  1. `More APIs`：移除 Lucide grip 图标，保持标准胶囊药丸尺寸 `w-fit px-4 h-7.5`。
  2. `Application`：移除 Lucide layout-grid 图标及 `gap-1`。
  3. `Performance`：移除 Lucide chart-no-axes-column 图标及 `gap-1`。
  4. `Start Building`：移除 Server 图标图片及 `gap-1`。

### 2. News Search 矩形卡片黑色状态提示 (Status Tip)
- **范围**：`src/sections/05-vertical-search.html` & `public/css/vertical-search.css` & `src/styles/vertical-search.css`
- **样式与定位**：
  - 位置：置于卡片外部（`.canvas-wrapper` 右上角 `top: -54px; right: 0;`），完全移出绿色画布区域，杜绝任何对画布内部元素及时间轴卡片的遮挡与干扰。
  - 视觉：低调紧凑的深黑毛玻璃圆角框（`rgba(13, 17, 23, 0.85)` + `backdrop-filter: blur(8px)` + 微弱白边 `rgba(255, 255, 255, 0.1)`），圆点顶部对齐，多行紧凑排版。
  - 文案（分两行，宽度收缩至约 280px，不拉伸横屏）：
    - `Currently under optimization.`
    - `Based on the front-end engineering results.`
  - 响应式：移动端适配 `top: -46px; right: 0; font-size: 10px;`，自动自然折行。

### 3. Omni Search 绝对居中对齐修复 (Alignment Fix)
- **原因分析**：`public/css/navbar.css` 中此前存在全局 `[style*="opacity:0"], [style*="opacity: 0"] { transform: none !important; }`，导致 Tailwind v4 的 `translate: -50% -50%` 失效或与内联 transform 产生二次偏移。
- **解决方案**：清理该全局覆盖，并在 `src/sections/04-modalities.html` 移除干扰样式，经 DevTools 精确验证中心 Logo 与光锥达到 0.00002px 绝对对称居中。

### 4. Modalities Search 视觉卡片动效 (Image & Video Search)
- **Image Search 卡片**：Firecrawl 螺旋力学自转/公转抵消与 120° T型平顶光束扫描已落地。
- **Video Search 卡片**：四卡单向无限向右走马灯、Figma 17.55px 宽域羽化扫描光带、对称式多模态提取闭环。

### 5. Built on Octen Search 辅助描述文字还原 (Showcase Cards Description Visibility)
- **问题现象**：`Built on Octen Search / Try it for Free` 模块中，4 张卡片（Answer, Deep Research, Multimodal Chat, Grounded Generation）标题下的辅助说明文字在页面上不可见/消失。
- **根因分析**：
  1. `src/sections/06-retrieval-stack.html` 中的 4 张卡片包裹层 `.sm:w-98.5` 遗留了 Framer Motion SSR 冻结内联样式 `style="opacity:0;transform:translateY(40px)"`。
  2. 此前为了消除对 Omni Search 的绝对居中干扰，在 `public/css/navbar.css` 中移除了全局 `[style*="opacity:0"] { transform: none !important; }`，导致卡片向下偏移了 40px。
  3. 卡片横向滚动父容器设置了 `sm:overflow-y-hidden`（高度固定为 581.14px），向下偏移的 40px 使得卡片底部 40px 高的 `<p>` 描述文案（`top: 9125px -> 9165px`）恰好被超出裁剪。
- **修复方案**：
  1. 在 `src/sections/06-retrieval-stack.html` 中将 4 张卡片的内联样式修正为 `style="opacity:1;transform:none"`，并将横向滚动容器增加 `pb-6` (padding-bottom: 24px) 确保底部留有安全行高间隙。
  2. 在 `public/css/navbar.css` 中增加精准定向样式 `.sm\:w-98\.5 { transform: none !important; opacity: 1 !important; }`，杜绝任何外部或内联 translateY 裁剪，同时不影响 Omni Search 的居中样式。
  3. 同步更新 `src/components/BuiltOnOcten.tsx` 第 4 张卡片为 Grounded Generation，保持 React 与静态 HTML 双轨一致。
  4. 经 CDP 无头浏览器与本地服务（3001端口）实测，4 张卡片的所有描述段落完全处于滚动容器内部，`display: block; visibility: visible; opacity: 1` 正常完整渲染。

---

## 🎬 Video Search 动效架构与关键注意事项 (Crucial Notes & Gotchas)

> [!IMPORTANT]
> 后续维护或二开 Video Search 动效时，请务必严格遵守以下准则，避免破坏走马灯连续性与视觉对称。

### 1. 环形缓冲区向右无限流转机制 (4-Slide Circular Buffer)
- **卡片槽位定义（共 5 个位置槽）**：
  - `pos-incoming`：`left: calc(50% - 640px); scale(0.7517); opacity: 0;`（画面左外待命）
  - `pos-left`：`left: calc(50% - 326px); scale(0.7517); opacity: 0.72;`（左侧可视卡）
  - `pos-center`：`left: 50%; scale(1.0); opacity: 1; z-index: 5;`（中心主卡）
  - `pos-right`：`left: calc(50% + 319px); scale(0.7517); opacity: 0.72;`（右侧可视卡）
  - `pos-outgoing`：`left: calc(50% + 640px); scale(0.6); opacity: 0;`（画面右外离场）
- **右推推进流程**：
  - 第三幕（Extract 解构图文卡片）播放完成后，**严禁重置回第一幕**。
  - 进入第四幕（走马灯右移）：当前 `Center -> Right`、`Left -> Center`、`Incoming -> Left`、`Right -> Outgoing`，动画时长为 `0.85s cubic-bezier(0.22, 1, 0.36, 1)`。
- **零闪烁无感复位（No-Flicker Recycling）**：
  - 850ms 动画完成后，离场的卡片（此时已在屏幕右外且透明度为 0）必须通过 `.no-transition` 瞬间移回 `pos-incoming` 待命位，并在此时重置其内部状态（隐藏 Extract 层，重置 Video 播放进度），再触发 `void el.offsetWidth` 强制重绘后移除 `.no-transition`。
  - 严禁在带 transition 的状态下跳跃槽位，否则会产生卡片“倒车回穿”的视觉 Bug。

### 2. 卡片等比缩放与底端平齐法则 (Bottom-Alignment & Origin)
- **基准尺寸与定位**：所有 4 张卡片基准一律为 `width: 317px; height: 208px; bottom: 103px;`。
- **缩放锚点**：必须保持 `transform-origin: bottom center !important;`。
  - 由于缩放中心锁定在底端中央，左侧卡与右侧卡在缩小至 `scale: 0.7517`（面积约 56.5%）时，底边缘绝对对齐，像素高低差严格为 0。
  - 绝不可将 transform-origin 改为 center，否则侧卡底部会悬空上浮约 25.8px。

### 3. 绿色扫描光带规范 (Figma 13716:172855 像素级契合)
- **单层宽域光幕**：
  ```css
  .octen-vcard-scanline {
    position: absolute;
    width: 343.15px;
    height: 17.55px;
    left: calc(50% - 343.15px / 2);
    top: 0;
    background: linear-gradient(180deg, rgba(112, 254, 126, 0) 0%, #70FE7E 50%, rgba(112, 254, 126, 0) 100%);
    opacity: 0;
    pointer-events: none;
    z-index: 10;
  }
  ```
- **注意事项**：
  - 光带宽度（343.15px）略大于卡片宽度（317px），超出部分由外层卡片的 `overflow: hidden` 裁切，确保光幕两端横向满幅。
  - 上下两端在 17.55px 垂直方向自然 0% 渐隐羽化，**严禁添加粗暴的 Box-Shadow 或重复叠加 Glow 层**，原 `.octen-vcard-scan-glow` 已显式禁用。
  - 扫光动态透明度峰值控制在 `0.25`，避免在暗色模式下亮斑刺眼。

### 4. 卡片结构对称统一原则 (Structural Consistency)
- **DOM 结构 1:1 复制**：所有卡片（Slide 0 ~ 3）内部必须包含完全相同的一套子元素（顶栏白点、标题占位条、中心 Play 图标、Octen Robot Mascot、扫描光带、底部时间轴与 Scrubber 圆点）。
- **禁止侧卡差异化裁减**：侧边卡片的缩小纯粹依赖 CSS 矩阵变换（`scale: 0.7517`），绝不可在 CSS 中针对侧卡 `display: none` 隐藏任何时间轴或按钮，否则当该卡片滑动进入中心位时会产生元素瞬间凭空弹出的生硬感。

### 5. 双轨代码同步 (HTML vs React)
- 项目同时存在 原生静态 HTML（`src/sections/04-modalities.html` + `public/js/modalities-search.js`）与 React 组件（`src/components/ImageVideoSearch.tsx`）。
- 生产构建与本地运行以原生 HTML 为主，但在对 Video/Image Search 动画进行任何重构时，务必将槽位状态机与 DOM 同步至 React 文件中，确保两套运行环境一致。

---

### 6. Navbar Products 菜单重构与 Figma 像素级还原 (Products Dropdown Alignment)
- **原型稿参照**：Figma 节点 [13625:174324](https://www.figma.com/design/jnIlRSuXffn5g2OxnsqYIE/Octen_%E6%B1%87%E6%80%BB?node-id=13625-174324&t=7uy39MOcdDWVIOA4-4)
- **核心优化与修改点**：
  1. **分类与文本校准 (Text & Structure)**：
     - 将第四个 Application 菜单项文字修正为 Figma 原型稿标准的 `Ground Generation`（原代码为 `Grounded Generation`）。
     - 三列分类完全对齐：第一列 `Search | FAST`（Web Search, Broad Search）与 `Search | Premier`（Image Search, Video Search, News Search, Business Search）；第二列 `Models`（Embedding, VL Embedding, Model Gateway）与 `Models`（Extract, Collect）；第三列 `Application`（Answer, Deep Research, Multimodal Chat, Ground Generation）。
  2. **15 个矢量图标重构 (Pure SVGs Restoration)**：
     - 完全移除此前使用的外部 `<img>` 结合 CSS 伪滤镜（`filter: invert(53%) sepia(...)`）方案（如 News Search、Business Search 等），杜绝网络图片加载失败或颜色偏差。
     - 直接从 Figma 原型资产服务提取全部高精度矢量路径，统一采用 `currentColor` 进行笔触与填充控制。
     - 包含复合矢量如图标定位（VL Embedding、Model Gateway 晶体折射镜面、Extract 3×3 点阵矩阵、Answer 同心星芒等），保证 20×20 像素级清晰锐利。
  3. **布局与尺寸标准规范 (Layout & Dimensions)**：
     - 下拉菜单总宽度规范为 `860px`（Column 1: 250px + Gap: 20px + Column 2: 250px + Gap: 20px + Column 3: 280px + Padding: 40px），彻底解决此前 `840px` 导致的列宽挤压。
     - 第二列内边距 `pl: 28px`，第三列内边距 `pl: 29px`，两处纵向分割线统一为 `1px solid rgba(202, 202, 202, 0.5)`。
     - 单项菜单项高度严格统一为 `44px`（`padding: 0 10px; border-radius: 8px;`）。
  4. **交互动效与高亮状态 (Hover State)**：
     - 默认状态：文字 `#181D27`，图标颜色 `#628A78`。
     - 悬停状态（`.nav-product-link:hover`）：背景变为 `#F7F7F7`，文字变为 `#0E121B`，图标颜色平滑过渡为品牌绿 `#039855` 并伴随微放大 `transform: scale(1.05)`。
  5. **代码清理与验证**：
     - 清理了 `public/css/navbar.css` 中多处重复及相互冲突的旧属性声明，形成清晰的分组规则。
     - 经无头浏览器与本地服务（3001 端口）自动化校验，所有 15 个子项纯 SVG 渲染无报错，Developers 菜单联动正常。

---

## 📂 核心代码入口
- **导航栏模板**：`src/sections/01-navbar.html`
- **导航栏全局样式**：`public/css/navbar.css`
- **标签与全栈模块**：`src/sections/06-retrieval-stack.html`
- **Vertical Search**：`src/sections/05-vertical-search.html`，`public/css/vertical-search.css`，`src/styles/vertical-search.css`
- **Modalities Search**：`src/sections/04-modalities.html`，`public/css/modalities-search.css`，`public/js/modalities-search.js`，`src/components/ImageVideoSearch.tsx`
- **本地开发服务**：`http://localhost:3001`

