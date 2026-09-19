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

### 6. Navbar Products 菜单重构与本地标准 SVG 图标替换 (Products Dropdown Alignment & Static Icon Assets)
- **原型稿参照**：Figma 节点 [13625:174324](https://www.figma.com/design/jnIlRSuXffn5g2OxnsqYIE/Octen_%E6%B1%87%E6%80%BB?node-id=13625-174324&t=7uy39MOcdDWVIOA4-4)
- **核心优化与修改点**：
  1. **分类与文本校准 (Text & Structure)**：
     - 将第四个 Application 菜单项文字修正为 Figma 原型稿标准的 `Ground Generation`。
     - 三列分类完全对齐：第一列 `Search | FAST`（Web Search, Broad Search）与 `Search | Premier`（News Search, Image Search, Video Search，Business Search 已移除）；第二列 `Models`（Embedding, VL Embedding, Model Gateway）与 `Tool`（Extract，原 Collect 项已按需删除）；第三列 `Application`（Answer, Deep Research, Multimodal Chat, Ground Generation）。
  2. **14 个标准独立产品图标规范 (Static SVG Icons Replacement)**：
     - 用户反馈内联 SVG 存在编码解析错误风险。已全面切换为 `public/assets/icons/products/` 目录下的独立高质量 SVG 图标资产：
       - Search 列：`web_search.svg`, `broad_search.svg`, `image_search.svg`, `video_search.svg`, `news_search.svg`, `business_search.svg`
       - Models 列：`embedding.svg`, `vl_embedding.svg` (与 `VL embedding.svg` 兼容), `model_gateway.svg`, `extract.svg`
       - Application 列：`answer.svg`, `deep_research.svg`, `multimodal_chat.svg`, `ground_generation.svg`
       - 标题分隔线：`vector562.svg`
     - 结构统一采用标准 `<img src="/assets/icons/products/<name>.svg" alt="..." width="20" height="20" />` 标签，消除长文本内联 SVG 代码冗余与特殊字符编码异常。
  3. **图标样式与默认绿色主题 (Icon Sizing & Default Green Color)**：
     - 全部 15 个独立产品图标（SVG 文件内原生笔触/填充）及 Developers 图标的默认色彩全部统一设为品牌绿 `#039855`。
     - 在 `public/css/navbar.css` 中为 `.nav-dropdown-split .nav-product-icon img` 明确声明 `width: 20px; height: 20px; object-fit: contain; flex-shrink: 0; transition: transform 0.15s ease`。
     - 悬停交互规范：当 `.nav-product-link:hover` 时，背景优雅变为 `#F7F7F7`，文字变为 `#0E121B`，图标在保持高清品牌绿 `#039855` 的同时伴随 `transform: scale(1.05)` 微动放大。
  4. **布局与尺寸标准规范 (Layout & Dimensions)**：
     - 下拉菜单总宽度规范为 `860px`（Column 1: 250px + Gap: 20px + Column 2: 250px + Gap: 20px + Column 3: 280px + Padding: 40px）。
     - 第二列内边距 `pl: 28px`，第三列内边距 `pl: 29px`，两处纵向分割线统一为 `1px solid rgba(202, 202, 202, 0.5)`。
     - 单项菜单项高度严格统一为 `44px`（`padding: 0 10px; border-radius: 8px;`）。
  5. **验证与状态**：
     - 经本地 Node/HTTP 请求测试，全部 16 个图标资源均返回 `200 OK`，且 SVG 内容原生包含 `#039855`。
     - Vite 开发服务（3001 端口）页面热重载正常，DOM 解析无乱码或截断。

---

### 7. Footer 菜单 Search 列分组重构 (Footer Search Fast & Premier Stacked)
- **范围**：`src/sections/07-footer.html` & `src/components/Footer.tsx` & `public/css/footer.css`
- **优化细节**：
  1. **单列纵向双组布局 (Fast & Premier Stacked)**：
     - 将 Footer 第 2 列（原单一的 `SEARCH` 列表）重构为与顶部导航栏完全对应的单列纵向双分组：
       - 上组 `SEARCH · FAST`：包含 `Broad Search`、`Web Search`。
       - 下组 `SEARCH · PREMIER`：包含 `News Search`、`Image Search`、`Video Search`（Business Search 已按需移除）。
  2. **顺序校准 (Ordering)**：
     - 按照用户需求，在 `SEARCH · PREMIER` 分组中将 `News Search` 置于 `Image Search` 之前。
  3. **对称排版规范 (Layout & Spacing)**：
     - 为 Col 2 增加 `.octen-footer-col-search-stacked`（`gap: 30px`），与 Col 5（Developers 4 项 + Company 2 项，gap 30px）形成左右两端完美的视觉高度对称（总高度均为约 304px）。
  4. **双轨代码同步**：
     - 同步更新了 `src/components/Footer.tsx`，保持 React 与静态 HTML 双轨一致。

---

### 8. Footer 认证徽章位置调整 (Footer Certified Badge Repositioning)
- **范围**：`src/sections/07-footer.html` & `public/css/footer.css` & `src/components/Footer.tsx`
- **调整内容**：
  1. **移入法律链接组右侧**：将 SOC 2 认证徽章（`.octen-footer-certified`）置于底部栏 `.octen-footer-legal-links` 中，直接位于 `Terms of Service` 菜单右侧（排列顺序：`Privacy Policy` -> `Terms of Service` -> `octen-footer-certified`）。
  2. **流式排版与居中对齐**：移除绝对定位属性，改用正常文档流（`display: inline-flex; align-items: center; flex-shrink: 0;`），与 `Privacy Policy` 和 `Terms of Service` 保持统一的 Flex 垂直居中对齐与 30px 间距。
  3. **移动端自适应**：在移动小屏场景下随父容器自然折行并保持良好留白，彻底消除了旧版绝对定位在特定视口下遮挡文本的隐患。
  4. **底栏总高度与无边线规范 (84px Height & Borderless)**：彻底移除 `.octen-footer-bottom-bar` 顶部边线（`border: none !important; border-top: none !important;`），总高度严格设定为 `84px`（`height: 84px; box-sizing: border-box; padding-top: 0; padding-bottom: 0;`），所有内容元素垂直居中对齐；移动端响应式设为 `min-height: 84px; height: auto; padding: 20px 0 24px;`。
  5. **Figma 原型高精度矢量图标还原 (Figma Node 13625:174285 Restoration)**：基于 Figma 原稿节点，将原本普通的内联 SVG 与 HTML 纯文本替换为 1:1 导出的本地高精 SVG 资产（`public/assets/icons/footer/soc2-shield.svg` 与 `public/assets/icons/footer/soc2-text.svg`），彻底对齐 Figma 内部盾牌轮廓与内部字形（`SOC 2` 纯白高亮、右上角 `®` 标识以及半透明 `Type 2`）；容器尺寸与间隙参数完全对齐 Figma 规约（`padding: 6px 14px 6px 12px; gap: 2px; border: 1px solid #41535b; border-radius: 8px; background: rgba(15, 32, 24, 0.53); backdrop-filter: blur(2px);`）。

---

### 9. Footer 最后一列 110px 宽度及菜单分组文字色彩与底图协调优化 (Footer Col 5 Width 110px & Group Title Harmonization)
- **范围**：`public/css/footer.css` & `src/sections/07-footer.html` & `src/components/Footer.tsx`
- **优化细节**：
  1. **最后一列 Developers + Company 宽度与布局 1:1 对齐 Figma 原型**：
     - 原版代码中使用 `grid-template-columns: repeat(5, minmax(0, 1fr))` 均分轨道，导致第 5 列轨道被强行拉伸至约 200px 且无法自适应贴齐右边缘。
     - 本次严格对照 Figma 原稿（Node `13625:174221` & `13625:174239` & `13625:178329`）：
       - `.octen-footer-grid` 桌面端重构为 `display: flex; justify-content: space-between; align-items: flex-start;`，各列在 1200px/1280px 容器内均匀自然展开。
       - 第 5 列 `.octen-footer-col-dev-comp` 严格定义为 `width: 110px !important; min-width: 110px !important; max-width: 110px !important; flex: 0 0 110px !important; box-sizing: border-box; white-space: nowrap;`，确保在任何视口及缩放下稳定保持 110px。
       - 为 Col 3 和 Col 4 补充专属类名 `.octen-footer-col-others`（`width: 115px; flex-shrink: 0;`）与 `.octen-footer-col-app`，移动端平滑降级为响应式 Grid 布局。
  2. **菜单分组文字色彩与暗绿底图协调优化 (Group Title Harmonization)**：
     - 原版直接使用了纯冷灰色 `#71717a`（Tailwind Zinc-500），在暗绿色渐变及粒子底图背景下显得生硬、违和且灰暗（“纯灰色”）。
     - 严格对照 Figma 原型规范（`text-white opacity-40`），将分组标题 `.octen-footer-col-title` 及邮箱描述标签 `.octen-footer-touch-label` 设为半透明纯白：`rgba(255, 255, 255, 0.4)`。
     - 40% 透明度纯白色彩使得底层深绿渐变光影与粒子网络自然穿透，字体光感与对比度恰到好处，与底图浑然天成。
  3. **分组标题与列表项强制不折行保障 (Title & Links White-space Nowrap)**：
     - 为 `.octen-footer-col-title`、`.octen-footer-touch-label` 以及 `.octen-footer-link` 显式设置 `white-space: nowrap !important;`。
     - 将第 2 列 `.octen-footer-col-search-stacked` 的宽度约束由固定的 `112px` 改为 `min-width: 140px; white-space: nowrap;`，彻底杜绝 `SEARCH · PREMIER` 因父级宽度狭窄而异常折行断开的缺陷。
  4. **双轨同步**：
     - 同步更新静态 HTML、全局 CSS 以及 `src/components/Footer.tsx`（包含移除遗留的 Collect 菜单项并对齐 OTHERS 分组），保持全栈一致性。

---

### 10. 页脚双分组列间距调整为 50px (Footer Dual-Group Columns Gap = 50px)
- **原型参照**：Figma 节点 [13720:174119](https://www.figma.com/design/jnIlRSuXffn5g2OxnsqYIE/Octen_%E6%B1%87%E6%80%BB?node-id=13720-174119) & [13625:178329](https://www.figma.com/design/jnIlRSuXffn5g2OxnsqYIE/Octen_%E6%B1%87%E6%80%BB?node-id=13625-178329)
- **修改范围**：`public/css/footer.css` & `src/sections/07-footer.html` & `src/components/Footer.tsx`
- **调整细节**：
  1. **间距精确设为 50px (Gap = 50px)**：
     - 拥有上下两组菜单的列共 2 列：
       - **Col 2 (Search)**：上组 `SEARCH · FAST` 与下组 `SEARCH · PREMIER`，间距由 30px 调整为 `50px`。
       - **Col 5 (Dev & Company)**：上组 `DEVELOPERS` 与下组 `COMPANY`，间距由 30px 调整为 `50px`。
     - 完全 1:1 对齐 Figma 原型稿规约（`gap-[50px]`）。
  2. **双轨代码同步**：
     - `public/css/footer.css`：`.octen-footer-col-search-stacked` 与 `.octen-footer-col-dev-comp` 声明 `gap: 50px !important;`。
     - `src/components/Footer.tsx`：两列容器内联 style 统一更新为 `gap: '50px'`。
     - 自动化验证确认 CSS 与 React 运行一致。

---

### 11. 页脚邮箱前图标色彩调整为 #18FB6F (Footer Email Icon Color #18FB6F)
- **修改范围**：`public/css/footer.css` & `src/sections/07-footer.html` & `src/components/Footer.tsx`
- **调整细节**：
  1. **主色调校准为品牌亮绿 `#18FB6F`**：
     - 将原默认暗绿 `#039855` 调整为高亮荧光品牌绿 `#18FB6F`。
     - 使得第一列 `GET IN TOUCH` 下的 `support@octen.ai` 及 `kuan@octen.ai` 左侧小邮件图标在深色暗夜背景下更加明亮通透、层次分明。
  2. **双轨代码同步**：
     - `public/css/footer.css`：`.octen-footer-touch-mail-icon` 明确声明 `stroke: #18FB6F !important;`。
     - `src/sections/07-footer.html`：两个内联 SVG 的 `stroke` 属性更新为 `#18FB6F`。
     - `src/components/Footer.tsx`：`<Mail size={16} color="#18FB6F" />` 同步更新。

---

### 12. 模块解耦与独立备用页面归档 (Modular Extraction & Standalone Backup Staging)
- **需求意图**：将 `More scenarios in future releases`、`Image Search`、`Video Search` 三个模态/实验性模块从主干页面剥离，移入独立备用页面，在主干保留清晰的注释占位位置。
- **改动范围**：
  1. **独立备用预览页**：
     - 新增根目录独立入口：[`backup-modules.html`](file:///x:/XCoding/Octen/hompage/backup-modules.html)，可通过 `http://localhost:3001/backup-modules.html` 独立访问，包含顶栏导航、返回主页按钮及所有完整动效与样式支持。
     - 在 [`src/sections/backup/`](file:///x:/XCoding/Octen/hompage/src/sections/backup/) 归档独立 HTML 模块片段：
       - `backup-modalities-search.html`：双列完整的 Image Search 与 Video Search。
       - `backup-future-scenarios.html`：More scenarios 11 芯片无限跑马灯。
       - `backup-image-search.html` / `backup-video-search.html`：原子化单列备用资产。
  2. **主干静态模板剥离与位置备注**：
     - `src/sections/05-vertical-search.html`：移除底部的 `future-scenarios-section`，置入标准位置备注 `[RESERVED / BACKUP: "More scenarios in future releases" Marquee Section]`。
     - `src/sections/04-modalities.html`：移除两列卡片结构，保留 `<div id="image-search">` 和 `<div id="video-search">` 外部锚点兼容，置入标准位置备注 `[RESERVED / BACKUP: Modalities Search (Image Search & Video Search)]`；后续的主干核心 Omni Search 完整保留。
     - `index.html`：更新 section include 注释，标注模块迁移说明。
  3. **双轨 React 组件同步**：
     - `src/components/VerticalSearch.tsx`：移除底部的 `future-scenarios-section` JSX，留存占位注释。
     - `src/App.tsx`：注释掉 `<ImageVideoSearch />` 渲染并附带备用说明。
  4. **构建工程与验证**：
     - `vite.config.ts`：配置 `build.rollupOptions.input` 支持多页面打包（`main` -> `index.html`, `backup` -> `backup-modules.html`）。
     - 运行 `pnpm build` 与本地 3001 端口双页面端点测试，主页不包含剥离模块且无报错，备用页全部 3 个模块与动效渲染完好。

---

---

### 13. Omni Search 标题与辅助文案双列布局改造 (Dual-Column Image & Video Header)
- **需求参考**：Figma 节点 `13625:173272` (frame width 1280px, 两列宽度调整为 500px)。
- **改动范围**：`src/sections/04-modalities.html` & `public/css/vertical-search.css`
- **实现细节**：
  1. **双列并排结构与 500px 宽度约束（杜绝 592px 异常拉伸）**：
     - 原先项目缺乏 Tailwind JIT 实时编译，导致 `w-[500px]` 属性在未打包前未被 CSS 生成，在 Flex 容器中被自适应拉伸至 592px。
     - 现已通过显式行内样式与全局 CSS 规则双重加固（`width: 500px !important; max-width: 100% !important; flex: 0 0 500px !important;`），精准锁定两列区块宽度严格为 `500px`，中间自然形成 ~200px 的中空空间，与下方的中心 Octen 核心圆盘 Logo 及光束达到视觉平衡。
  2. **左列：Image Search**：
     - 顶部标签：`Search / PREMIER` 绿色胶囊标签（字号 14px，Padding LR 16px）。
     - 标题与徽章：`Image Search`（Fraunces 衬线字体，字号 44px），右侧悬浮紧贴 `#18FB6F` 荧光绿 `Early Access` 标签（JetBrains Mono 14px，深黑文字，4px 圆角）。
     - 辅助说明：`"Retrieves real web images from text or reference images, paired with structured style summaries and reusable HTML snippets."`（严格限定文字容器宽度为 500px：`style="width: 500px; max-width: 100%;"`，居中排版）。
     - 操作按钮：`Request Access` 绿色毛玻璃描边按钮（高度 40px，边框 `#60ff70`，文字 `#70fe7e`，外链指向 `https://octen.ai/platform/overview`）。
  3. **右列：Video Search**：
     - 顶部标签：`Search / PREMIER` 绿色胶囊标签（字号 14px，Padding LR 16px）。
     - 标题与徽章：`Video Search` 标题 + 紧邻的 `#18FB6F` `Early Access` 标签。
     - 辅助说明：`"Retrieves live web videos with rich metadata—ready to preview, embed, or integrate directly into your AI workflows."`（严格限定文字容器宽度为 500px：`style="width: 500px; max-width: 100%;"`，居中排版）。
     - 操作按钮：同款 `Request Access` 绿色毛玻璃描边按钮。
  4. **按钮圆角规范 (Request Access Button Radius = 8px)**：
     - 严格遵循 Figma 节点 `13720:174550` (`rounded-[8px]`)，在 HTML 中显式声明 `rounded-[8px]`，并在 `public/css/vertical-search.css` 与 `src/styles/vertical-search.css` 中将 `.octen-request-access-btn` 与 `.btn-request` 的 `border-radius` 全面统一为 `8px !important;`，保证全站所有 Request Access 按钮圆角均严格为 8px。
   5. **“玻璃”标签样式二次校准 (Glass Tag Pill Refinement)**：
     - 依据 Figma 节点 `13720:174602` 最新状态：
       - 尺寸与布局：`height: 30px; width: auto; padding: 0 16px; gap: 7px; border-radius: 24px;`（取消固定 151.96px 限制，以 16px 内边距与 7px 间距自适应内容）
       - 背景与质感：`background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(8px);`
       - 磨砂微斜切双向内阴影：`box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.08), inset -0.5px -0.5px 1px rgba(255, 255, 255, 0.3), inset 0.5px 0.5px 1px rgba(255, 255, 255, 0.3);`
       - 文字排版：`Search` 与 `/` 均使用纯白 `#ffffff`，`DM Sans 13px 600 line-height: 20px`；`PREMIER` 为 `DM Mono 11.7px 500 line-height: 20px letter-spacing: 0.936px`。
   6. **下层视觉网络保留**：
     - 完整保留下方既有的多模态拓扑连线、ASCII 渐变底图、视频播放器卡片及中心 Octen 动态雷达 Logo。

---

### 14. 全站 Search 标签全局规范统一 (Unified Glass Search Tags Specification)
- **需求**：News Search 顶部标签样式与 Image Search 统一；全面优化 CSS，确保全局所有的 `Search / FAST`、`Search / PREMIER` 标签采用完全一致的单一 CSS 样式规范。
- **改动规范（严格遵循字号=14、Padding LR=16 标准）**：
  1. **容器规范**：
     - 高度与圆角：`height: 30px; border-radius: 24px;`
     - 内边距与间距：`padding: 0 16px !important; gap: 4px !important;`
     - 磨砂玻璃与双向微倒角内阴影：
       `background: rgba(255, 255, 255, 0.1) !important;`
       `box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.08), inset -0.5px -0.5px 1px rgba(255, 255, 255, 0.3), inset 0.5px 0.5px 1px rgba(255, 255, 255, 0.3) !important;`
       `backdrop-filter: blur(8px) !important; -webkit-backdrop-filter: blur(8px) !important;`
       `border: none !important;`
  2. **文字排版规范**：
     - **全局统一字号**：`font-size: 14px !important; line-height: 20px !important;`
     - **前缀 (Search)**：`font-weight: 500 !important; color: #ffffff !important;`
     - **分割线 (/)**：`font-weight: 500 !important; color: rgba(255, 255, 255, 0.4) !important; margin: 0 2px !important;`
     - **关键词 (FAST / PREMIER)**：`font-weight: 700 !important; letter-spacing: 0.04em !important; color: #ffffff !important; text-transform: uppercase !important;`
  3. **全局样式单源架构**：
     - 新建全局核心样式文件 `src/styles/octen-tags.css` 与 `public/css/octen-tags.css`，在 `index.html` 与 `backup-modules.html` 统一引入。
     - 同步更新 `web-search.css`、`modalities-search.css`、`vertical-search.css`（含 `src/` 与 `public/`），彻底消除高特异性选择器覆盖及样式冲突。
  4. **全站标签覆盖**：
     - `Web Search` (`Search / FAST`)
     - `News Search` (`Search / PREMIER`)
     - `Image Search` (`Search / PREMIER`)
     - `Video Search` (`Search / PREMIER`)
     - `backup-modules` 备用预览页全模态标签

---

### 15. API Introduce 区域标签精简 (Remove Badge Above "The complete retrieval stack")
- **需求**：修改 `api-introduce` 部分，去掉 "The complete retrieval stack" 上方的标签。
- **改动范围**：`src/sections/06-retrieval-stack.html` & `src/components/RetrievalStack.tsx`
- **实现细节**：
  1. **HTML 模板 (`src/sections/06-retrieval-stack.html`)**：
     - 移除 `api-introduce` 顶部的大标题上方 `<div class="flex-center w-fit px-4 h-7.5 mb-4 text-sm rounded-full border border-[#BCBCBC]" ...>More APIs</div>` 胶囊标签。
     - 保留 `The complete retrieval stack` 主标题与 `Beyond search` 辅助说明文案及下游四栏切换（Embedding / VL Embedding / Extract / Model Gateway）和 RTEB / MMEB 排行榜。
  2. **React 双轨组件 (`src/components/RetrievalStack.tsx`)**：
     - 移除 `Beyond Search` 的 `.pill-badge` 组件及未使用的 `Database` icon 依赖，使标题直属容器顶端。
  3. **构建验证**：
     - `pnpm build` (`tsc && vite build`) 校验 0 报错通过，本地开发服务 (`http://localhost:3001/`) 验证确认 `More APIs` / `Beyond Search` 标签已彻底移除，排版自然紧凑。

---

### 16. API Introduce 各子项标签补充、排序调整与代码完全可读化 (Sub-item Tags, Extract Reordering & HTML Beautify)
- **需求**：
  1. 为每个子项标题上方增加标签：
     - `Embedding` 标题上方增加 `Models`
     - `VL Embedding` 标题上方增加 `Models`
     - `Model Gateway` 标题上方增加 `Models`
     - `Extract` 标题上方增加 `Tool`
  2. 标签样式规范（`tag -v`）：
     - `height: 30px; border-radius: 19.4617px; padding: 6px 16px; gap: 4px;`
     - `background: rgba(255, 255, 255, 0.3); border: 1px solid #BCBCBC; backdrop-filter: blur(10px);`
     - `font-family: 'DM Sans'; font-size: 14px; font-weight: 400; line-height: 20px; color: #000000; text-align: center;`
  3. 将 `Extract` 区块（包含左右两部分）挪到 `Model Gateway` 下方（排在最后一位）：
     - 排列顺序调整为：`Embedding` (Models) ➔ `VL Embedding` (Models) ➔ `Model Gateway` (Models) ➔ `Extract` (Tool)。
     - 顶部 Tab 导航按钮同步调整为：`Embedding` ➔ `VL Embedding` ➔ `Model Gateway` ➔ `Extract`。
  5. 标题换行对齐：`The complete` 与 `retrieval stack` 之间显式声明 `<br />` 换行符（`The complete<br />retrieval stack`），杜绝宽屏下被强制挤在同一行。
- **改动文件**：
  - `src/sections/06-retrieval-stack.html`：完成结构重排、标签插入、标题换行与代码全量格式化（重构为结构工整清晰的标准 HTML）。
  - `src/components/RetrievalStack.tsx`：同步更新标题换行、左侧产品列表排序（Item 3: Model Gateway, Item 4: Extract）并挂载 `.tag-v` 标签。
  - `public/css/octen-tags.css` & `src/styles/octen-tags.css`：新增 `.tag-v` 与 `.octen-subitem-tag` 统一标准样式。
- **构建与测试**：
  - `pnpm build` 顺利通过（打包正常，零 TypeScript / Vite 报错）。
  - 本地端口 `http://localhost:3001/` 验证确认标题换行、四个区块顺序及 `Models` / `Tool` 标签渲染均符合预期。

### 17. 06-retrieval-stack.html 模块拆解重构 (Modular Split of 06-retrieval-stack.html)
- **背景与痛点**：
  - 原 `06-retrieval-stack.html` 体积达到 3,555 行（246KB），混杂了 3 个业务职责完全独立的大模块（API 架构、Showcase 案例展示、Start Building 行动召唤区），不仅开发维护心智负担重，也容易引发标签闭合冲突与卡顿。
- **拆解架构方案**：
  1. **`src/sections/06-retrieval-stack.html`**（2,075 行）：
     - 纯粹保留 `#api-introduce` 架构栈（Header、Sticky Tabs 及 4 个子项：Embedding ➔ VL Embedding ➔ Model Gateway ➔ Extract）。
  2. **`src/sections/07-showcase.html`**（1,227 行）：
     - 独立封装 "Built on Octen Search" 与 "Try it for Free" 客户案例卡片及动态轮播展示区。
  3. **`src/sections/08-get-started.html`**（254 行）：
     - 独立封装 "Start Building" / "Get started in minutes" 三步引导与 CTA 行动区。
  4. **`src/sections/09-footer.html`**（123 行）：
     - 由原 `07-footer.html` 顺延重命名，语义更严谨。
  5. **`src/sections/10-scripts.html`**（82 行）：
     - 由原 `08-scripts.html` 顺延重命名，页面底部的模块初始化脚本。
  6. **`index.html`**：
     - 声明更新 `<include>` 引入序列为 01 ~ 10 规范模块化加载。
- **构建与测试验证**：
  - `pnpm build`（`tsc && vite build`）通过，打包构建 0 报错。
  - 本地端口 `http://localhost:3001/` 验证确认 06、07、08、09 各模块在 DOM 中的渲染顺序与样式完全无缝衔接。

### 18. Start Building 标签统一为磨砂玻璃质感标签 (Unified Glass Tag for Start Building)
- **需求**：将 Section 08 行动号召区的 `Start Building` 标签由原先简易的 `border border-[#FFFFFF4D]` 边框标签，升级为全站统一规范的“磨砂玻璃质感”胶囊标签（Glass Tag Pill）。
- **统一玻璃规范**：
  - 高度与圆角：`height: 30px; border-radius: 24px;`
  - 内边距：`padding: 0 16px !important; gap: 4px;`
  - 玻璃背景与模糊：`background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);`
  - 微倒角双向内阴影：`box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.08), inset -0.5px -0.5px 1px rgba(255, 255, 255, 0.3), inset 0.5px 0.5px 1px rgba(255, 255, 255, 0.3);`
  - 排版：`font-size: 14px; font-weight: 500; line-height: 20px; color: #ffffff;`
- **改动文件**：
  - `src/sections/08-get-started.html`：标签替换为 `<div class="octen-glass-tag start-building-tag"><span>Start Building</span></div>`。
  - `public/css/octen-tags.css` & `src/styles/octen-tags.css`：在全站玻璃标签通用选择器中统一追加 `.octen-glass-tag` 与 `.start-building-tag`。
  - `src/index.css`：引入 `@import './styles/octen-tags.css';`。
  - `src/components/QuickstartSection.tsx`：同步挂载同款玻璃质感标签类。
- **验证**：
  - `pnpm build` 测试通过（0 报错）。
  - 本地端口 `http://localhost:3001/` 验证确认 `Start Building` 胶囊标签呈现高品质双向微倒角高光与磨砂玻璃质感。

### 19. Footer Header 样式对齐 Figma 最新规范 (octen-footer-header Alignment)
- **Figma 节点**：`13625:178499`（Container）与 `13720:174941`
- **对齐内容与规范参数**：
  1. **容器与间距**：
     - `padding-top: 40px !important; padding-bottom: 40px !important;`（对齐 Figma `py-[40px]`）
     - `border-bottom: 1px solid rgba(207, 207, 207, 0.2) !important;`
     - `gap: 8px !important;`（Logo 与标语间距由原 16px 收敛至 8px）
     - 底部与导航网格无缝对接，网格增加 `padding-top: 40px !important;`。
  2. **Logo 尺寸**：
     - 由原 184px × 62.5px 修正为 **119.4px × 40.5px**（对齐 Figma `119.369px × 40.541px`，对应主品牌 Dark 图标）。
  3. **Slogan 标语排版与字号**：
     - 间距：`gap: 10px !important;`（对齐 Figma `gap-[9.994px]`）
     - 前缀文字 `The Foundation of`：`font-family: Fraunces, serif; font-weight: 300; font-size: 24px; line-height: 1; color: #ffffff;`（字号由原过大的 41.5px 修正为 **24px**）。
     - 渐变文字 `Real-Time AI`：`font-family: Fraunces, serif; font-style: italic; font-weight: 400; font-size: 24px; line-height: 1;`
       - 渐变色值严格对齐 Figma：`linear-gradient(85.39deg, rgb(172, 244, 95) 5.8%, rgb(112, 254, 126) 99.3%)`（从草绿 `#ACF45F` 平滑过渡至纯绿 `#70FE7E`）。
- **改动文件**：
  - `public/css/footer.css` & `src/styles/footer.css`
  - `src/sections/09-footer.html`
  - `src/components/Footer.tsx`
- **验证**：
  - `pnpm build`（`tsc && vite build`）顺利通过，打包 0 报错。
### 20. News Search (Vertical Search) 边界线去除、底部内边距与大卡片圆角微调
- **需求**：
  1. 去掉 Web Search 与 News Search 区块之间的边界分割线。
  2. 将 `.vertical-search-section` 的底部内边距 `padding-bottom` 调整为 `80px`。
  3. 将 News Search 的中央巨大交互卡片（`.hero-canvas`）圆角统一调整为 `24px`。
- **改动参数**：
  - **边界线**：在 `.vertical-search-section` 基础样式与暗色模式下将 `border-top` 全面声明为 `none !important;`，彻底消除浅色描边。
  - **底部间距**：`padding-bottom: 80px !important;`（由原 110px 紧凑收敛至 80px）。
  - **巨大卡片圆角**：`--canvas-radius: 24px;`，在 `.hero-canvas` 容器上显式声明 `border-radius: 24px !important;`（由原 40px/28px 调整为统一规整的 24px）。
- **改动文件**：
  - `public/css/vertical-search.css`
  - `src/styles/vertical-search.css`
- **验证**：
  - `pnpm build` 测试通过（0 报错）。
  - 本地端口 `http://localhost:3001/` 验证确认两区块自然融合无生硬分割线，大卡片圆角 24px 视觉优雅协调。

### 21. Model Gateway 架构静态 SVG 抽取为独立 Partial (Model Gateway SVG Extraction)
- **背景与优化**：
  - `src/sections/06-retrieval-stack.html` 中 Model Gateway 包含了 1,291 行的纯静态架构 SVG（包含大量滤镜、渐变与路径）。
  - 为实现极致的代码轻量化与模块解耦，将该段庞大 SVG 独立抽取至 `src/sections/partials/model-gateway-diagram.html`。
  - `06-retrieval-stack.html` 代码量由原本的 2,076 行锐减至 **786 行**，主干清晰度与可读性大幅提升。
- **技术突破（递归嵌套 Include 支持）**：
  - 在 `vite.config.ts` 的 `htmlPartialsPlugin` 中升级实现递归嵌套解析（while 循环迭代，支持最高 10 层嵌套 Partial 加载），使任何子模块均能自由优雅地引入底层更细粒度的局部组件。
- **改动文件**：
  - `vite.config.ts`：支持递归嵌套 `<include>` 语法。
  - `src/sections/partials/model-gateway-diagram.html`：新建独立静态架构 SVG partial（1,291 行）。
  - `src/sections/06-retrieval-stack.html`：通过 `<include src="./src/sections/partials/model-gateway-diagram.html"></include>` 声明引入。
- **验证**：
  - `pnpm build`（`tsc && vite build`）通过，打包构建 0 报错。
  - 本地端口 `http://localhost:3001/` 验证确认 Model Gateway 架构 SVG 在 DOM 中 100% 完整解析与高保真渲染。

---

## 📂 核心代码入口
- **全局统一标签样式**：`public/css/octen-tags.css`，`src/styles/octen-tags.css`
- **导航栏模板**：`src/sections/01-navbar.html`
- **导航栏全局样式**：`public/css/navbar.css`
- **Omni Search (原 04 模板)**：`src/sections/04-modalities.html`
- **Vertical Search**：`src/sections/05-vertical-search.html`，`public/css/vertical-search.css`，`src/styles/vertical-search.css`
- **API 全栈模块 (api-introduce)**：`src/sections/06-retrieval-stack.html`，`src/components/RetrievalStack.tsx`
- **Model Gateway 架构图 Partial**：`src/sections/partials/model-gateway-diagram.html`
- **客户展示模块 (Showcase)**：`src/sections/07-showcase.html`
- **行动号召模块 (Start Building CTA)**：`src/sections/08-get-started.html`
- **页脚模板**：`src/sections/09-footer.html`
- **页脚全局样式**：`public/css/footer.css`，`src/components/Footer.tsx`，`src/styles/footer.css`
- **模块化交互脚本**：`src/sections/10-scripts.html`
- **独立备用预览页面**：`backup-modules.html` (`http://localhost:3001/backup-modules.html`)
- **备用模块代码仓库**：`src/sections/backup/`（包含 `backup-modalities-search.html`、`backup-future-scenarios.html` 等）
- **本地开发服务**：`http://localhost:3001`




