# 📋 Octen 官网前端重点改动与交接说明 (Developer Handover)

> 本文档专供接手本项目的开发者快速了解近期的核心架构重构、样式走查（对齐 Figma）与重点待办。  
> 梳理顺序严格按照**页面从上到下（Top-to-Bottom）的视觉呈现顺序**编排。

---

## 1. 顶部导航栏 (Navbar & Dropdown Menus)
- **核心文件**：
  - 模板：[src/sections/01-navbar.html](file:///x:/XCoding/Octen/hompage/src/sections/01-navbar.html)
  - 样式：[public/css/navbar.css](file:///x:/XCoding/Octen/hompage/public/css/navbar.css)
  - 双轨组件：[src/components/Navbar.tsx](file:///x:/XCoding/Octen/hompage/src/components/Navbar.tsx)
- **重点改动**：
  1. **去除下拉三角**：彻底移除了线上版本中导航栏触发按钮（Products / Developers）右侧多余的小三角箭头 (`chevron-down` 图标)，保持极简扁平视觉。
  2. **产品下拉菜单分组与命名规范**：
     - **Search · FAST**：Web Search, Broad Search
     - **Search · PREMIER**：News Search
     - **Models**：Embedding, VL Embedding, Model Gateway
     - **Tool**：Extract（原线上版本误标为第二个 `Models` 分组，现已正名为单数 **`Tool`**）。
  3. **图标尺寸统一**：规范了下拉项中各产品 Icon 的标准宽高（20px），文字基线垂直居中。
  4. **Developers 分组重构**：调整了开发者资源菜单的排版间距与外链结构。

---

## 2. 全局胶囊标签规范 (Unified Glass Tag Pills)
- **核心文件**：
  - 样式：[public/css/octen-tags.css](file:///x:/XCoding/Octen/hompage/public/css/octen-tags.css) 及 [src/styles/octen-tags.css](file:///x:/XCoding/Octen/hompage/src/styles/octen-tags.css)
- **重点改动**：
  1. **移除前置 Icon**：彻底移除了所有胶囊标签中原本多余的前置装饰图标（如小圆点、雷达绿标、hugeicon 等），仅保留纯文本。
  2. **暗色背景磨砂玻璃规范（`.octen-glass-tag` / `.octen-search-tag`）**：
     - 尺寸与圆角：`height: 30px; border-radius: 24px; padding: 0 16px;`
     - 材质质感：`background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(8px);`
     - 微倒角双向内阴影：`box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.08), inset -0.5px -0.5px 1px rgba(255, 255, 255, 0.3), inset 0.5px 0.5px 1px rgba(255, 255, 255, 0.3);`
     - 边框：`border: none;`（杜绝原版粗糙生硬的实线描边）。
     - 应用区块：Web Search、News Search、Start Building 等所有深底区块。
  3. **浅色/子项规范（`.tag-v`）**：
     - 尺寸与圆角：`height: 30px; border-radius: 19.5px; padding: 6px 16px;`
     - 材质：`background: rgba(255, 255, 255, 0.3); border: 1px solid #BCBCBC; backdrop-filter: blur(10px);`
     - 应用区块：The Complete Retrieval Stack 浅底各产品子卡片。

---

## 3. Web Search 与 News Search 区块衔接
- **核心文件**：
  - 模板：[src/sections/03-web-search.html](file:///x:/XCoding/Octen/hompage/src/sections/03-web-search.html)
  - 样式：[public/css/vertical-search.css](file:///x:/XCoding/Octen/hompage/public/css/vertical-search.css)
- **重点改动**：
  1. **去除硬边界线**：将 `.vertical-search-section` 基础样式与暗色主题下的 `border-top` 设置为 `none !important`，移除了原本横贯在两个暗黑板块之间的浅色细线，使深色渐变背景自然融合。

---

## 4. News Search (Vertical Search) 交互与已知待办
- **核心文件**：
  - 模板：[src/sections/05-vertical-search.html](file:///x:/XCoding/Octen/hompage/src/sections/05-vertical-search.html)
  - 样式：[public/css/vertical-search.css](file:///x:/XCoding/Octen/hompage/public/css/vertical-search.css)
  - 双轨组件：[src/components/VerticalSearch.tsx](file:///x:/XCoding/Octen/hompage/src/components/VerticalSearch.tsx)
- **重点改动**：
  1. **底部内边距收敛**：`.vertical-search-section` 的 `padding-bottom` 由 110px 调整为 **`80px`**，使下方内容衔接更为紧凑。
  2. **巨大卡片圆角修正**：中央交互舞台（`.hero-canvas`）的圆角统一由 40px/28px 调整为 **`24px`**（`--canvas-radius: 24px;`），视觉更细腻。
- 🚨 **待前端重点调整的遗留问题（动效对齐）**：
  - **现状痛点**：当前中央舞台的 5 步时序动画（1:输入 ➔ 2:脉冲寻源 ➔ 3:四卡片总览 ➔ 4:聚焦第1卡片 ➔ 5:时间线展开下钻）在状态流转与尺寸自适应上存在跳变和卡顿。
  - **Figma 静态分步参考**：开发时请直接对照该静态分步稿进行帧状态微调：  
    👉 [Figma News 动效 5 步静态设计稿 (Node 13661:163623)](https://www.figma.com/design/jnIlRSuXffn5g2OxnsqYIE/Octen_%E6%B1%87%E6%80%BB?node-id=13661-163623&t=7uy39MOcdDWVIOA4-4)

---

## 5. Omni Search（原 Search Beyond Text 模态拆解）
- **核心文件**：
  - 模板：[src/sections/04-modalities.html](file:///x:/XCoding/Octen/hompage/src/sections/04-modalities.html)
  - 暂存备用模块：[src/sections/backup/](file:///x:/XCoding/Octen/hompage/src/sections/backup/)（包含 `backup-modalities-search.html` 等）
  - 独立测试预览页：[backup-modules.html](file:///x:/XCoding/Octen/hompage/backup-modules.html)
- **重点改动**：
  1. **拆解为独立双列**：将原统一混排的文本拆解为 **Image Search** 与 **Video Search** 两列独立布局。
  2. **宽度严格锁定**：单列文案排版宽度严格限定为 **`500px`**（`width: 500px; flex: 0 0 500px;`），解决了线上版本因拉伸到 592px 导致的字体与换行失调。
  3. **架构解耦机制**：主站若暂不上线多模态大图，可通过热插拔将整块内容指向 `backup-modules.html`，代码已完全组件化隔离。

---

## 6. The Complete Retrieval Stack (原 More APIs 区块)
- **核心文件**：
  - 模板：[src/sections/06-retrieval-stack.html](file:///x:/XCoding/Octen/hompage/src/sections/06-retrieval-stack.html)
  - 架构图 Partial：[src/sections/partials/model-gateway-diagram.html](file:///x:/XCoding/Octen/hompage/src/sections/partials/model-gateway-diagram.html)
  - 双轨组件：[src/components/RetrievalStack.tsx](file:///x:/XCoding/Octen/hompage/src/components/RetrievalStack.tsx)
- **重点改动**：
  1. **移除顶头 Badge**：去掉了 "The complete retrieval stack" 标题上方多余的 `More APIs` / `Beyond Search` 标签。
  2. **主标题强制换行**：显式加入 `<br />` 换行：`<span class="whitespace-pre-wrap">The complete<br />retrieval stack</span>`，杜绝宽屏下被强制挤在同一行。
  3. **各子项独立打标 (`.tag-v`)**：
     - `Embedding` ➔ 挂载 **`Models`**
     - `VL Embedding` ➔ 挂载 **`Models`**
     - `Model Gateway` ➔ 挂载 **`Models`**
     - `Extract` ➔ 挂载 **`Tool`**
  4. **产品排序重构**：将 `Extract` 区块整体下移至 `Model Gateway` 之后（排列第 4 位），顶部 Sticky Tabs 也同步调整为：`Embedding` ➔ `VL Embedding` ➔ `Model Gateway` ➔ `Extract`。
  5. **SVG 架构图独立 Partial 抽取**：
     - 将 Model Gateway 中原本长达 1,291 行的超大复杂静态 SVG 抽离至独立文件 [src/sections/partials/model-gateway-diagram.html](file:///x:/XCoding/Octen/hompage/src/sections/partials/model-gateway-diagram.html)。
     - 主模板代码量由 2,076 行骤降至 **786 行**。
     - 在 [vite.config.ts](file:///x:/XCoding/Octen/hompage/vite.config.ts) 中升级了递归嵌套 Partial 支持，任何子模块均可自由 include 子组件。

---

## 7. 行动号召区 (Start Building CTA)
- **核心文件**：
  - 模板：[src/sections/08-get-started.html](file:///x:/XCoding/Octen/hompage/src/sections/08-get-started.html)
- **重点改动**：
  1. **标签质感升级**：将原粗糙的 `border border-[#FFFFFF4D]` 边框替换为全站统一的磨砂玻璃胶囊标签（`<div class="octen-glass-tag start-building-tag"><span>Start Building</span></div>`）。

---

## 8. 底部导航栏与页脚 (Footer)
- **核心文件**：
  - 模板：[src/sections/09-footer.html](file:///x:/XCoding/Octen/hompage/src/sections/09-footer.html)
  - 样式：[public/css/footer.css](file:///x:/XCoding/Octen/hompage/public/css/footer.css) 与 [src/styles/footer.css](file:///x:/XCoding/Octen/hompage/src/styles/footer.css)
  - 双轨组件：[src/components/Footer.tsx](file:///x:/XCoding/Octen/hompage/src/components/Footer.tsx)
- **重点改动（对齐 Figma 节点 [13625:178499](https://www.figma.com/design/jnIlRSuXffn5g2OxnsqYIE/Octen_%E6%B1%87%E6%80%BB?node-id=13625-178499)）**：
  1. **Slogan 字体与渐变**：
     - 字号从原先偏大的 41.5px 修正为 **`24px`**（Fraunces 衬线体）。
     - `Real-Time AI` 渐变色更新为草绿至纯绿过渡：`linear-gradient(85.39deg, rgb(172, 244, 95) 5.8%, rgb(112, 254, 126) 99.3%)`。
  2. **Logo 尺寸比例修正**：由 184px × 62.5px 精确修正为 **`119.4px × 40.5px`**（对齐 Figma 官方 Dark Logo）。
  3. **导航列对称与间距**：
     - Col 2（Search: FAST / PREMIER）与 Col 5（Developers / Company）的上下组间距统一为 `50px`，使左右两翼形成 304px 的完美视觉高度对称。
  4. **认证徽章与版权栏重构**：
     - SOC 2® Type 2 认证徽章与隐私政策、服务条款组合排版，统一居右对齐，与左侧版权信息呈水平轴分布。

---

## 🛠️ 本地运行与验证指南
```bash
# 1. 启动本地开发服务 (默认端口 3001)
pnpm dev

# 2. 生产打包验证 (TypeScript 校验 + Vite 构建)
pnpm build
```
- **主页预览**：`http://localhost:3001/`
- **备用多模态页面预览**：`http://localhost:3001/backup-modules.html`
