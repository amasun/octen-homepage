# Octen 官网交接文档(统一版)

> 本文件整合了原 `handoff.md`、`DEVELOPER_HANDOVER.md` 与 Hero / Web Search 的最新交接说明,是**唯一的交接入口**。
> 旧文档里已过时或失效的内容(Windows 绝对路径、已不存在的文件、已被取代的方案)已删除或改写;垂直搜索的详细规范仍保留在 `vertical search/` 目录下的各份规范 md 中。

**目录**
- [第一部分 项目概览](#第一部分-项目概览)(运行方式、模块索引、全局设计规范、历史重点改动、垂直搜索)
- [第二部分 Hero + Web Search 最新改动](#第二部分-hero--web-search-最新改动)(技术与样式说明)

---

# 第一部分 项目概览

> 项目主干是 **Vite + 模块化 HTML Partials(`<include>`)+ CSS / 原生 JS**;`src/components/` 里另有一套 React 组件(`Navbar.tsx`、`Hero.tsx` 等),但**当前页面实际运行的是 HTML partials**,React 组件不是主线。

## 1.1 预览与运行

- 线上:https://octen-homepage.vercel.app/
- 本地:
  ```bash
  pnpm install
  pnpm dev        # http://localhost:3001/ (固定端口,局域网可用 http://<本机IP>:3001/)
  pnpm build      # tsc 类型校验 + 打包到 dist/
  pnpm preview    # 本地托管构建产物
  ```
- 一键预览脚本:`preview.bat` / `preview.ps1` / `pnpm dev:open`(自动检测 3001 端口,没起服务会自动拉起)。
- 独立备用页:http://localhost:3001/backup-modules.html;性能基准页 `/benchmarks`、`/performance`(见 `vercel.json` 路由与 `perform/` 子项目)。
- `public/_next/` 是从原站镜像的 Next.js 静态资源(字体、图片等),部分 `<img>` 仍引用它;`vite.config.ts` 里的 `localNextImageProxy` 负责 `/_next/image` 的本地代理。

## 1.2 页面模块索引(`index.html` 的 `<include>` 顺序)

| 顺序 | 文件 | 说明 |
|---|---|---|
| 1 | `src/sections/01-navbar.html` | 顶部导航(Products / Developers 下拉,Pricing 带 New 角标)。样式 `public/css/navbar.css` |
| 2 | `src/sections/02-hero.html` | **Hero**:标题轮播词、搜索 console 演示、底部光晕与动态 ASCII(见第二部分) |
| 3 | `src/sections/03-web-search.html` | **Web Search("Search the way AI does")**:Human vs Octen Broad Search 对比图(见第二部分) |
| 4 | `src/sections/05-vertical-search.html` | News / Business 垂直搜索。⚠️ **当前被设为 `display:none`(隐藏)**,是否恢复请确认 |
| 5 | `src/sections/04-modalities.html` | Omni Search 过渡条。当前**只保留锚点,高度 0**(绿色光晕与叠加图已迁入 Hero 底部);Image/Video Search 文案已暂存到备份 |
| 6 | `src/sections/06-retrieval-stack.html` | **Octen tools and models**:2×2 Bento(Embedding / VL Embedding / Monitor / Extract),扁平插画 + 循环动画,见第二部分 §3.5 |
| 7 | `src/sections/07-showcase.html` | **Try Octen in our applications**(五个 app 横版 banner,横向滚动)+ Built to Perform 基准(拆成 `07-showcase/` 下多个 partial) |
| 7.5 | `src/sections/12-pricing.html` | **Pricing 占位区块**(新增,待实现) |
| 8 | `src/sections/08-get-started.html` | Start Building 行动号召与三步上手 |
| 9 | `src/sections/09-footer.html` | 页脚 |
| — | `src/sections/11-promo-card.html` | 右下角浮动促销卡 |
| — | `src/sections/10-scripts.html` | 全局脚本挂载点 |
| — | `src/sections/backup/` | 暂存模块(Modalities 大图、场景走马灯),对应 `backup-modules.html` |

构建细节:`vite.config.ts` 的 `htmlPartialsPlugin` 递归解析 `<include src="…">`(最多 10 层);`07-showcase/dot-field-background.html` 的最后一行 `</div>` 用来闭合 `02-hero.html` 里打开的 `div#hero`(见该文件注释),不要随意删除。

## 1.3 全局设计规范

> 以下沿用旧交接文档,**本轮未重新核对**,改动前请以代码为准。

1. **暗色磨砂玻璃胶囊标签**(`.octen-glass-tag` / `.octen-search-tag`):高 30px、圆角 24px、左右内边距 16px;`background: rgba(255,255,255,.1)`、`backdrop-filter: blur(8px)`、无边框;双向微倒角内阴影;14px / 500 / 白字,无前置图标。覆盖 Web Search、News Search、Start Building 等深色区块。
2. **浅色卡片子标签**(`.tag-v`):高 30px、圆角 19.5px、内边距 6px 16px;`background: rgba(255,255,255,.3)`、`border: 1px solid #BCBCBC`、`blur(10px)`;DM Sans 14px 黑字。用于 Retrieval Stack 子卡片。
3. **页脚 Header**(Figma `13625:178499`):Logo 119.4×40.5px;Slogan 24px(衬线),`Real-Time AI` 渐变 `linear-gradient(85.39deg, rgb(172,244,95) 5.8%, rgb(112,254,126) 99.3%)`;上下 padding 40px,导航分组间距 50px;SOC 2 徽章居右。

## 1.4 历史重点改动(按页面顺序)

- **导航栏**:去掉下拉三角;产品菜单分组 `Search · FAST`(Web / Broad)、`Search · PREMIER`(News)、`Models`(Embedding / VL Embedding / Model Gateway)、`Tool`(Extract);菜单图标统一 20px。
- **全局标签**:统一为纯文本磨砂玻璃胶囊(见 1.3)。
- **Web Search → Vertical Search 过渡**:去掉两者之间的浅色分割线(`.vertical-search-section` 的 `border-top`)。
- **Omni Search(多模态)**:文案拆成 Image Search / Video Search 两列独立结构,宽度锁定 500px;已解耦成可热插拔的独立模块(现暂存在备份)。
- **Retrieval Stack**(已重做,见第二部分 §3.5):旧版是四个整行展示块 + Sticky Tabs(含 Embedding/VL 的榜单柱状图、1,300 行 Model Gateway 静态 SVG partial、Extract 长表格),现已改为 2×2 Bento;旧 partial 与 Tabs 已删除。`vite.config.ts` 的递归嵌套 partial 解析仍保留(其它模块在用)。
- **Start Building**:标签升级为统一磨砂胶囊;外层补 `#080B12` 底色与底部分割线。
- **页脚**:Slogan 41.5px → 24px,渐变对齐 Figma;Logo 与导航间距按规范调整。

## 1.5 Vertical Search(News / Business)

> 该模块当前在首页被隐藏,但代码和独立 Demo 完整保留。详细规范请直接读 `vertical search/` 下的文档,这里只做摘要。

- **目录**:`vertical search/` 统一存放 News 与 Business 的 Demo、规范与动效;首页版本为 `src/sections/05-vertical-search.html` + `public/js/vertical-search.js` + `public/css/vertical-search.css`。
- **规范文档**:`NEWS_SEARCH_ANIMATION_SPEC.md`、`NEWS_SEARCH_VALUE_PROPOSITIONS.md`、`BUSINESS_SEARCH_SPEC.md`、`BUSINESS_SEARCH_ANIMATION_SPEC.md`、`VERTICALS_ANIMATION_SPEC.md`、`Business Search 控制台交互/`。
- **5 步时序动画**:① Typing 逐字输入(32ms/字)→ ② Searching 输入框 FLIP 平移到左上、右侧 14 节点正弦波 → ③ Overview 统计数字 odometer 翻滚、白卡依次推入 → ④ Focus 总览卡形变为顶部 4 个药丸 Tab → ⑤ Timeline 事件时间线按序延展、自动滚动、结尾弹出 Replay。支持进入视口自动播放、悬停暂停、Tab 切换与重播。
- **双 Tab(News Search / Business Search)**:毛玻璃胶囊栏 + 滑动变色 Glider(弹簧曲线 `cubic-bezier(0.16,1,0.3,1)`,0.38s);News 草绿 `#8adb47`、Business 琥珀金 `#FBBF24`;切换时主题色、背景水印、标题说明、Query、统计、时间线全部联动。
- **共享元素形变**:Stage 1 的 280px 背景水印 ⇄ Stage 2+ 标题左侧 28px 图标,飞行形变;务必在 `onfinish` 里 `anim.cancel()`(`fill:'forwards'` 会长期锁住样式),并用 `.card-canvas.has-results .canvas-watermark { display:none !important }` 兜底。
- **News 四大卖点**(左侧面板):发稿 3 分钟内可搜、95% 头部媒体覆盖、通稿去重省 Token、话题聚合;配套 LIVE 徽标、Avatar Cycles 媒体滚动、Token Meter 柱状消减、Storyline 时间轴节点四种小动效;数字用 `number-flow`(`0.6.2`)的 `<number-flow>` 做滚轮效果。
- **Business Search**:以 Coupang / Bom Kim 为例的实体画像(Company vs Person 双轨:Activities 时间线 vs News 列表);背景渐变与水印(`opacity:.12`、280px、18px 线宽)对齐 Figma `13795:166561`。
- **时间线末尾**:最新卡片用 `xxm ago` + 橙色 `latest` 标签;Stage 5 时间线容器 `max-height: 248px`。
- **已修复的坑**:Tab Glider 首帧偏 4px(JS 误查到 `.tab-clone`,现已把克隆类名与真实按钮隔离,并用 `getActiveTabButton()` + 多阶段校准)。
- **旧约定(请确认是否仍适用)**:此前要求后续垂直搜索需求"仅在独立 Demo(`vertical search/`)里改,暂不改主项目"。

---

# 第二部分 Hero + Web Search 最新改动

> 范围:首页 **Hero**(标题轮播词 Shine Word、背景、console、底部光晕 + 动态 ASCII)和 **Web Search("Search the way AI does")** 模块,以及新增的 **Pricing 占位区块**。
> 约定:除特别说明外,尺寸数值均在 **1440px 宽、桌面双列布局(≥768px)** 下测得。

### 0. 提交状态与文件清单

| 状态 | 说明 |
|---|---|
| 已提交 `c227b04` | Hero:ShineWord、news 胶囊、IBM Plex Serif 等 |
| 已提交 `1a9363c` | Web Search 对比动画、Figma 卡片样式、Pricing 占位、`rotating-word-shine/` 备份 |
| **未提交** | `src/sections/06-retrieval-stack.html`(重写)、新文件 `public/css/retrieval-stack.css`、`public/js/retrieval-stack.js`、`public/images/extract/`;以及 `public/css/hero-shader.css`、`public/css/web-search.css`、`public/js/web-search-animation.js`、`src/sections/02-hero.html`、`src/sections/10-scripts.html`、新文件 `public/js/hero-ascii.js` |
| ⚠️ 未提交但**不是本轮需求** | `src/sections/04-modalities.html`(含本轮的 `height: 0`,以及他人对 SVG 层的隐藏)、`src/sections/05-vertical-search.html`(整个垂直搜索区块被设为 `display:none`)。提交前请确认意图 |
| 未引用的遗留文件 | `public/js/hero-typewriter.js`(旧打字机,已被 ShineWord 取代,未跟踪,可删) |
| 未跟踪、未触碰 | `references/` |
| 已整合 | 根目录旧文档 `handoff.md`、`DEVELOPER_HANDOVER.md` 已并入本文件;`content_structure_proposal.md`、`octen-three-tiers-comparison.md` 已过时并删除(均可从 git 历史找回) |

#### 本轮涉及的文件

| 文件 | 作用 |
|---|---|
| `src/sections/02-hero.html` | Hero 结构:标题轮播词容器、news 胶囊、点阵层、底部光晕容器、console 外框类名 |
| `src/sections/03-web-search.html` | Web Search:标题/文案、两张对比卡片结构、vs.、括号 SVG |
| `src/sections/12-pricing.html` | **新增** Pricing 占位区块 |
| `src/sections/06-retrieval-stack.html`、`public/css/retrieval-stack.css`、`public/js/retrieval-stack.js` | **新增/重写**:Octen tools and models 四张卡片(见 §3.5) |
| `public/images/extract/` | **新增** Extract 示例用的 4 张真实产品图(见 §3.5) |
| `src/sections/04-modalities.html` | 过渡条 `#modalities` 高度置 0(光晕已迁出) |
| `src/sections/10-scripts.html` | 脚本挂载点 |
| `src/lib/shine-word.js` | **Shine Word 核心**(Three.js,无框架) |
| `src/hero-shine-word.js` | Hero 的 Shine Word 启动入口(词表/配色/停留参数) |
| `public/js/hero-ascii.js` | **动态 ASCII 画布**(Canvas 2D) |
| `public/js/web-search-animation.js` | **对比动画状态机** + 括号自适应 |
| `public/css/hero-shader.css` | Hero 全部样式(含 Shine Word、console、光晕、ASCII、胶囊) |
| `public/css/web-search.css` | Web Search 全部样式(含 Figma 卡片、vs.、间距、hover) |
| `public/css/section-titles.css` | **新增**:各模块大标题字重变量 |
| `index.html` | 引入 `section-titles.css`、`12-pricing.html` |
| `rotating-word-shine/` | 独立的 Shine Word 演示/备份(无框架,可单独运行),**不参与站点构建**,未同步后续改动 |

---

### 1. 依赖与构建

- 新增依赖:`three@0.170.0`(已在 `package.json`)。仅 `src/lib/shine-word.js` 使用,经 Vite 打包,`main` 包因此增至约 625KB(gzip ≈170KB)。
- 脚本加载方式分两类(沿用项目现状):
  - **Vite 模块**:`<script type="module" src="/src/hero-shine-word.js">`(会被打包)。
  - **纯静态脚本**:`public/js/*.js`,`defer` 引入(`hero-ascii.js`、`web-search-animation.js`)。
- 字体:IBM Plex Serif(标题,300–700 含斜体)、DM Sans(正文/vs.)、DM Mono(ASCII,有 Apple Symbols / Segoe UI Symbol 后备)。字体由 `index.html` 的 Google Fonts 链接提供。
- 本地开发端口固定 `3001`;静态脚本改动会触发整页刷新。

---

### 2. Hero

#### 2.1 标题轮播词:Shine Word(替代打字机)

**效果**:`Search [词] infrastructure for AI`,中间的词整词滑入 → 彩色扫光 → 退场;每换一词切一套配色;静止态为绿→黄绿渐变。

**技术**:
1. 把每个字用 Canvas 2D 烘焙成纹理(字体/字号/颜色读自宿主元素的 CSS),**每个字一个 `PlaneGeometry`**,`ShaderMaterial` 渲染(WebGL,`THREE.WebGLRenderer`,预乘 alpha)。
2. 扫光在片元着色器里计算:光源在单词正下方,到光源的距离减去随时间增大的半径 = 到光环的距离,叠三层高斯(haze/body/core),再做 RGB 色散;颜色取自 6 个色标的调色板(uniform `uPal[6]`)。
3. 静止态字色由 `uTextColor`→`uTextColor2` 沿单词 x 方向渐变(`baseGradient`)。
4. **已去掉外发光(bloom)**:相关离屏纹理与两遍模糊着色器全部删除,渲染只剩一次绘制。
5. 阶段循环(rAF 驱动):`enter → shine → hold → exit → 切词`。离开视口/标签页隐藏时暂停。

**关键常量**(`src/lib/shine-word.js` 顶部):`ENTER_MS=340`、`EXIT_MS=160`、逐字间隔 `11ms`、`SHINE_MS=3200`、`SHINE_OVERLAP=500`、`SECOND_DELAY=320`/`SECOND_MS=1000`(第二道弱光环)、`RISE=0.22`(位移 = 字号 × 0.22)。

**配色**:导出的 `PALETTES` 共 5 套(aurora / gold / emerald / rose / ice),第 i 个词用 `palettes[i % 5]`;每套 6 个 RGB 色标(冷暗 → 高光),值可 >1。

**入口参数**(`src/hero-shine-word.js`):
```js
new ShineWord(host, {
  words: ['Real-Time','Web','Broad','Image','Video','News','Business','Place','Design','Everything'],
  baseGradient: ['#70fe7e', '#F4FE38'],
  initialDelay: 2000,   // 首屏:先让 "Search" 单独居中 2s
  loopPause: 2000,      // 每轮(回到第一个词之前)同样回到该状态 2s
});
```

**"Search 居中停留"的实现要点**:
- 收起状态靠 **HTML 初始类名** `shine-word--collapsed`(槽位 `width:0`,并用 `margin-left:-0.22em` 抵消行内 gap),所以首帧就是居中,不会"从左边滑回"。展开时移除该类,宽度与 margin 一起过渡(0.6s)。
- 不支持 WebGL / `prefers-reduced-motion`:自动移除收起类、直接显示第一个词。
- 字号随视口变化(`clamp(…vw…)`)时,窗口 resize 后 150ms 重新烘焙(仅在已开始后响应)。

**限制**:单行文本;未处理 `letter-spacing`(宽度按 DOM 实际宽度缩放对齐);文字基础色在创建字形时读取,运行中改主题不会自动刷新。

**样式**(`hero-shader.css`):`.hero-shine-word` 斜体、字重 400、`font-size: 0.92em`(比标题略小)、`clip-path` 防裁切;canvas 外扩 24px(与 JS 中 `PAD` 一致)。标题字号上限 65px(`clamp(28px, 9.1vw, 65px)`)。

#### 2.2 背景层

| 层 | 处理 |
|---|---|
| 顶部绿黄光晕 SVG | `filter: brightness(0.91)` |
| LightRays 光线(WebGL) | `filter: brightness(0.66)` |
| 绿色渐变底色 | 内联 `rgba(11,46,28,.6)`(原 `rgba(17,70,43,.6)` × 0.65),写在 `02-hero.html` |
| 粒子 | 不变 |
| 点阵 | 圆点半径 `1.3px`、间距 `18px`、白 45%;mask 为以顶部中心为圆心的椭圆渐隐 `radial-gradient(ellipse 85% 120% at 50% 0%, black 20%, transparent 100%)` |

#### 2.3 标题上方 news 胶囊(`.hero-news-pill`)

文案 `#1 for speed on Artificial Analysis Search API` + 竖线 + 斜向上箭头,链接 `https://artificialanalysis.ai/agents/search-api`(新标签页,`rel=noopener noreferrer`)。磨砂玻璃(`backdrop-filter: blur(14px)`)、底部彩色内发光(`::after`,`opacity: .5`,青→绿→黄绿)、无投影、高度约 29px。窄屏字号 13px。

#### 2.4 Console 界面

- 外框加类 `hero-console`:桌面高度 **700px**(原 540px;<768px 仍 480px);1px 边框 `rgba(255,255,255,.1)`。
- **底部渐隐**:`mask-image`,8 段缓动渐变,长度变量 `--console-fade: 260px`。
- **背景模糊(重要)**:`backdrop-filter: blur(18px)` 加在 **父级** `.hero-console-wrap` 上,并给父级一个 80px 的底部渐隐 mask。原因见 §5 踩坑 ①②。
- 内部两个可滚动区(左侧 Search Process 列表、右侧 Answer 面板)加 `overscroll-behavior: contain`:鼠标悬停时只滚动该区域,到头也不带动整页。**未**再给它们加底部留白(曾加 260px,滚到底出现大片空白,已撤销)。代价:滚到底时最后几行落在渐隐区里偏淡。

#### 2.5 "Head over to the API Platform" 按钮

选择器 `#hero a[href="/platform/answer"]`:`backdrop-filter: blur(12px)`;底色 `rgba(14,16,20,.65)`(原 `rgba(77,77,77,.3)`),hover `rgba(26,29,35,.72)`。

#### 2.6 底部绿色光晕 + 动态 ASCII(从原"黑白分界处"迁入 Hero 底部)

**结构**:
```
#hero > section
  ├─ div.hero-bottom-glow          (绝对定位,贴底,高 = --hero-glow-h,overflow:hidden,z-index 0)
  │    └─ div.hero-bottom-glow__inner   (宽 max(100%,1036px),水平居中 —— 窄屏不缩小图片)
  │         ├─ img  gradient.png        (绿色光晕)
  │         └─ canvas.hero-ascii        (动态 ASCII,由 hero-ascii.js 创建)
  └─ div.flex-center.pt-50         (内容层,z-index 1,压在光晕之上)
```
原静态叠加图 `multimodal-ascii.png` 已不再使用(文件仍在,别处可能引用)。

**变量**(`#hero`,`hero-shader.css`):

| 变量 | 值 | 含义 |
|---|---|---|
| `--hero-glow-h` | `clamp(300px, 29vw, 556px)` | 光晕容器高度(完整,不裁) |
| `--hero-bottom-gap` | `120px` | Hero 底部内边距(console 下方留白,药丸底到 Hero 底) |
| `--hero-glow-shift` | `calc(var(--hero-glow-h) * 0.24)` | 光晕整体下移量(PC 1440px ≈ 100px),底部被容器裁掉 |
| `--hero-glow-lift` | `20px` | **仅光晕图**在下移基础上再上挪(ASCII 不受影响) |

窄屏:内层固定最小宽 1036px 居中,使手机上露出的光晕高度/观感接近 PC。

**动态 ASCII**(`public/js/hero-ascii.js`,Canvas 2D):
- **字符集**取自 Hacker/Signal/Symbols:密度字符 `. : ; - = + x * O X #`(由疏到密);点缀符号 `✦ ✦ ✦ ○ ◇ × Δ`(✦ 权重最高,概率 `SYMBOL_P=0.16`);另随机混入品牌字母 `o c t e n`(`BRAND_P=0.2`)。
- **亮度轮廓**:越靠底部越密越亮;`VISIBLE=0.72` 决定分布高度(0.36 是原图)。
- **动效**:以光晕容器底边正中为圆心的**涟漪**——距离按 `WAVE_STRETCH=0.5` 横向压缩成扁椭圆环,波长 `WAVE_LEN=240`(按 1429px 宽基准缩放),速度 `WAVE_SPEED=0.26`(波长/秒),环峰字符更密更亮;每个格子按自己的节奏闪烁、换字符。
- **颜色**:暗绿 `[30,105,46]` → 中绿 `[78,200,66]` → 最亮处 `[118,235,84]`(**不到白**),10 档批量绘制;canvas `opacity: .6`、`mix-blend-mode: screen`、贴底 `-32px`、随 `--hero-glow-shift` 下移。
- **字号**:行高 = 宽度 × 0.68%(8–12px),字宽 0.6×行高。
- **性能/行为**:24fps;离开视口、标签页隐藏时暂停;`prefers-reduced-motion` 仅画一帧;DPR 取 `min(dpr,2)`。
- 圆心会按"画布相对光晕容器的偏移"实时校正,保证涟漪从**可见区底边**扩散。

---

### 3. Web Search 模块(`#web-search`)

#### 3.0 浅色 + 整体外框卡片(2026-11-24,Figma `Octen_汇总` node `14376:46661`)

> 以下 3.1–3.4 中与本节冲突的值以本节为准。样式全部追加在 `public/css/web-search.css` 末尾的「浅色模块 + 整体外框卡片」块里(HTML 未改)。

- **模块背景**改为纯白 `#ffffff`(Figma 里是浅绿→白渐变,按需求改为纯色);标题 `#000`、描述 `rgba(0,0,0,.8)`(用 `data-node-id` 选择器覆盖 HTML 里的 `text-white`)。
- **促销胶囊**改深底 `rgba(0,0,0,.8)`(hover .9),文字 `rgba(255,255,255,.82)`,`$20/month` 仍为 `#09fd35`。
- **`#webSearchCompare` 变成整体外框卡片**:`#080b12`、圆角 18px、内边距 `--ws-pad: 8px`,两张面板间距仍为 `--ws-gap: 6px`。
- **面板颜色对齐 Figma**:左 `#1a1a1c`(hover 叠白 .04);右 `rgba(53,196,132,.3)` 叠在 `#080b12` 上(hover .36,变量 `--ws-tint-g`)。
- **vs.**:44px(含 6px 边框),内圆 `#1e2026`;`--ws-module-bg` 改为 `#080b12`(外框底色),所以「镂空」圆环仍成立。桌面端 left 公式已把 `--ws-pad` 算进去:`calc(pad + (100% - 2·pad - gap)/2.9 + gap/2)`,1440px 下实测与间隙中心重合。
- **标题上方新增胶囊「How Octen works」**(`.ws-head-pill`,样式同第三模块 `.rs-head-pill`;与标题间距沿用 title 组的 gap 16px)。标题区因此增高约 46px,模块总高相应增加。
- **括号 / 连接线不再与边框交叉**:括号两端落点 `e = 59 - D`(`web-search-animation.js` 的 `fitBrace`),圆头正好压在子查询网格上边框;汇聚点下移:横线 `y2 = e - 20`、竖干终点 `y1 = y2 - 8`(桌面端汇聚点从 y=2 降到 y=9,竖干约 8px);子查询→结果的竖线容器改为 `top: calc(100% + 1px)`、高度 `--ws-vconn-h`(桌面 20px / 窄屏 28px,= 两网格间距)、左右内缩 8px + 列间距 10px,竖线与胶囊列中心完全对齐,首尾正好贴两条边框。
- **底色定稿为 B 版深底,模块底色 `#101217`**(外框卡片仍 `#080B12`);背景叠 48px 微弱网格细线(白 4%,`#web-search.ws-theme-b::before`,上下边缘渐隐、标题区中央减淡;曾试过点阵 / 点线网络 / 随机亮点,均已移除):`03-web-search.html` 的 `#web-search` 直接带类名 `ws-theme-b`(标题白、说明 `rgba(255,255,255,.7)`、胶囊深色玻璃、促销条 `#4D4D4D4D`、外框卡片 1px `rgba(255,255,255,.08)` 内描边)。白底 A 版样式仍保留在 `web-search.css`,去掉该类名即恢复。A/B 切换按钮已下线:`10-scripts.html` 不再引用 `public/js/web-search-theme-ab.js`(文件保留,重新引用即可恢复按钮;`.ws-ab*` 样式也还在)。
- **标题区 → 卡片间距改为 30px**(原 35px,Figma 为 62px,按需求取 30)。
- 模块总高 1440px 宽下 **951px**(120+173+30+508+120,外框上下各 8px 内边距)。
- 窄屏只做了数值检查,未逐屏目测。

#### 3.1 文案与结构

- 标题 `Search the way AI does`;说明 `A single query only reaches a few sources. Broad Search expands it into sub-queries from different angles and runs them all at once — wider coverage, no longer wait.`(依据 docs.octen.ai/capabilities/broad-search)
- 已**移除**标题上方的 `Search / FAST` 胶囊 → 该胶囊带的 `data-copy-anchor="#web-search"`(点击复制锚点链接)随之失效;页面锚点 `#web-search` 本身仍可用。
- 促销条(`.octen-web-search-promo-pill`,"New · Unlimited with Search Plan from $20/month")**在 Web Search 与 Pricing 占位区块各有一份**,共用同一份 CSS。
- 右卡标题为 `Octen Broad Search`。

```
section#web-search            (--ws-module-bg: #0f0f10)
  └─ .space-y-15 (改为 flex column,gap 35px)
       ├─ 标题区(标题 + 说明 + 促销条)  ≈173px
       └─ div#webSearchCompare           (grid [1fr_1.9fr],gap = --ws-gap = 6px)
            ├─ .octen-web-search-card            左 Human Search
            ├─ .octen-compare-vs > span "vs."    居中压在间隙上
            └─ .octen-web-search-card.octen-web-search-card--accent   右 Octen Broad Search
```

#### 3.2 间距与高度(1440px 宽,模块总高 **940px**)

| 部分 | 值 |
|---|---|
| 模块上/下内边距 | **120px / 120px**(固定值,原 `py-30` 随屏宽缩放) |
| 标题区 | 173px |
| 标题区 → 卡片 | 35px |
| 两张卡片 | **492px**(原 582px) |
| 合计 | 120+173+35+492+120 = 940 |

卡片压缩细则(仅 ≥768px):卡片上下内边距 28px;副标题下边距 8px;左结果面板 268px、条目间距 7px;右子查询网格 121px;右结果网格 127px(每组 41px);两网格间距 20px。窄屏(堆叠)保持原尺寸。
相邻模块:`#modalities` 过渡条高度已置 `0`(之前约 29vw 的空白),所以 Web Search 到下一模块 `retrieval-stack` 的整个间隙 = 模块自身 120px 下内边距。

#### 3.3 卡片样式

- 两张卡片:圆角 **10px**、**无边框**(`border: 0 !important`)。
- 左卡:`#080b12` 上叠白色层 `--ws-tint`(平时 0.05,hover 0.09)。
- 右卡(Figma node `14373:8544`):底色 `#080b12` + `rgba(3,152,85,.12)`(hover 0.19);标题白→`#c8f2dc` 渐变;副标题 `rgba(226,247,236,.88)`、箭头 `#4ade80`;输入框 1.2px `rgba(112,254,126,.55)` 描边、圆角 8px;子查询网格 `rgba(4,27,18,.5)` + 描边 `rgba(112,254,126,.42)`、圆角 12px;子查询胶囊 `#143f2f` / `rgba(94,229,152,.42)`;连接线青绿渐变;结果网格圆角 14px,叠层 4 层 `#0b251a`、前层 `#133b2c`,地球图标 `#4ade80`。
- 左卡结果项的地球图标已换成源站原始 20×20 填充图标(之前路径错误)。
- hover 背景过渡使用 `@property --ws-tint`(`<number>`),不支持的老浏览器会直接切换无过渡。
- 模块底色 `--ws-module-bg`(vs. 圆环边框也引用它)。左右卡的底色里仍带蓝调,与中性灰的模块底色可能有细微色差。

#### 3.4 "vs." 徽章

- 56px 圆,`border: var(--ws-gap) solid var(--ws-module-bg)`(= 6px 的模块底色边框),内圆 `#23252b`,DM Sans 500 15px。
- 桌面端 `position:absolute; left: calc((100% - gap)/2.9 + gap/2)`,垂直居中;窄屏上下堆叠时夹在两卡之间。
- ⚠️ **这是"描边模拟"的镂空感,不是真镂空**:圆环是盖在卡片上的纯色,与模块底色一致才成立。若模块背景改成渐变/纹理(模块底部还叠着一层很淡的粒子),圆环会露馅。真镂空需给两张卡片加 `mask-image` 圆形洞(尚未实现)。
- 卡片间距与圆环边框宽度共用 `--ws-gap`(6px),改一处即可。

#### 3.5 对比动画(`public/js/web-search-animation.js`)

还原自源站 octen.ai 的 Framer Motion 状态机(`idle→typing→searching→results→pausing`),用原生 JS 重写并强化对比。

- **时间线**:两侧**同速**逐字输入同一句 query(`TYPE_MS=60`)→ 分叉:
  - 左 Human:连接线长出 + 加载圆点(`HUMAN_SEARCH_MS=1600`)→ 5 条结果**逐条**出现(`HUMAN_RESULT_MS=750`)→ 总约 9–10s。
  - 右 Octen:括号分叉绘制 → 10 个子查询并发弹出(`CHIP_MS=45`)→ 10 组结果叠层几乎同时展开(`STACK_MS=55`),叠影 4 层(原 2 层 + JS 追加 2 层)→ 约 3s。
  - 全部完成停留 `HOLD_MS=5000`,重置后循环。
- **机制**:JS 给元素打 `data-ws="…"`(`h-conn`/`h-loader`/`h-item`/`o-brace`/`o-chip`/`o-vconn`/`o-stack`/`label`/`label-h`/`caret`),用 `.ws-on` 表示"已出现",根节点加 `.ws-ready`;CSS 用 `:not(.ws-on)` + `!important` 覆盖原 SSR 内联样式。无 JS 时保持静态完整展示。进入视口 30% 开始,离开重置;`prefers-reduced-motion` 直接显示最终态。
- **括号自适应**:源站按容器宽度重算路径,静态页被写死 400px。现在 `ResizeObserver` 监听容器宽度,重算 SVG 宽度、两条路径、渐变坐标;并读取 `--ws-brace-shrink`(22)把括号**竖向压缩**,使右侧子查询网格顶边与左侧结果面板顶边对齐,省下的高度补给右侧两个网格,保证两侧底边也对齐。压缩只在 ≥768px 生效。
- 右卡原 `Multiple Sub-Queries → Concurrent Results` 的箭头段在出现结果后才显示。

---

### 3.5 Retrieval Stack:Octen tools and models(四张独立卡片)

**定位与文案**:这四个是 Octen 在搜索之外的**额外 tools**。标题区为居中堆叠(类 `.rs-head*`):胶囊 `Beyond search` → 大标题 `Octen tools and models` → 辅助文字 `Embed meaning with the #1 retrieval models, reach top LLMs through one API, and turn any URL into clean content.` → **按钮组 `.rs-head-links`**(黑色 `Get started` → `/platform/overview`、白色 `View Docs` → `https://docs.octen.ai`,两个都是通用入口)。卡片内部**不再放任何按钮**。
原来的 Sticky Tabs 已删除,但保留锚点 `#embedding`、`#vl-embedding`、`#monitor`、`#extract`,以及 `#api-introduce` / `#api`(`navbar.js` 用 `#api-introduce` 判定导航栏浅色区起点,**不要删**)。旧的 `#model-gateway` 锚点已不存在。

**文字规范(与第二模块统一)**:大标题 `text-5xl lg:text-[44px]`、字重 500(`section-titles.css`);辅助文字 `1rem`、行高 1.625、`rgba(17,24,39,.8)`;卡片标题 `1.5rem`、600(IBM Plex Serif);卡片描述 16px、**浅灰 `#71717a`**(描述里加粗的 `#1` 为 `#27272a`,`SOTA on … ↗` 外链保持近黑 `#0a0a0a`,用来突出重点)。标题/辅助文字/卡片标题用 **rem**,跟随根字号缩放,与第二模块一致(1440px 下实测 36.75 / 14 / 21px)。

**布局**:
- `.rs-bento`:2 列网格,**gap 16px**(<768px 单列、gap 12px),背景透明;每个 `article.rs-cell` 是**独立卡片**:`#f6f6f6` 底、1px `#e7e7e7` 描边、圆角 16px。原来的共用外框、网格线和交点小圆点(`.rs-dot`)已废弃(HTML 里还在,CSS 里 `display:none`,可顺手删)。
- 每张卡片:左上角 **Tag 标签**(`.rs-tag`,绝对定位 top/left 16px,24px 高、6px 圆角、1px 描边,文字 `Models` / `Tool`)→ 插画区 `.rs-art`(高 **192px**,点阵背景,内容垂直居中)→ 文案(标题 + 描述)。文案区 `.rs-copy` 下内边距 **30px**(描述下方无额外外边距,文字到卡片底 = 30px)。1440px 下每张卡片高约 328px。
- **整体不使用投影/发光**(插画里的小卡片只靠 1px 描边区分层级)。
- <768px 单列;容器较窄时插画用 `@container` + `zoom` 缩放(0.86 / 0.72 / 0.6),插画区高度同步降到 172 / 152px。

| 卡片 | 描述文案 | 插画逻辑 |
|---|---|---|
| Embedding(`Models`) | The **#1** text embedding model. Similar meaning lands close, even with no shared words. + 行内外链 `SOTA on RTEB ↗`(与描述同一行) | 参考产品动画 `p1.mp4`,形式为**持续不断的循环**:黑色圆形 Octen(r=28,与 VL 一样大)**始终居中不动**(SVG 600×168,整体 `translateY(8px)`,与 VL 的 logo 位置一致,实测两者圆心到插画区顶部都是 104px);卡片**原背景点阵**(`.rs-art::before`,16px 网格)通过 CSS 变量 `--emb-ox` 同步 `background-position-x` **从左向右持续流动**(约 44px/s);**所有点保持背景原样、不放大**(最初参考视频做过「距离透镜」放大变深,已按需求移除);球不断向四周(**8 个角度分区 = 8 根触手**)伸出**直线触手**去抓流过身边的点——端点**始终等于点阵里那个点的真实位置**(不截断、不按计时松手):**对称释放带**:线长偏离 RIN 环 `BAND_IN`(14px)后按距离渐隐,到 `BAND_OUT`(30px)完全消失才松开;**连接点位置随机**:在 RIN 环附近一整条带子里随机抓点(右半边点向外漂 → RIN-40..RIN+12;左半边向内漂 → RIN-12..RIN+40),每条线有自己的中心半径 `s.c`(抓点距离沿运动方向前移 16px),渐隐带围绕 `s.c` 计算,所以两侧都是「渐显 → 穿过中心 → 渐隐」;某分区没有可抓的点时(卡片高度有限,左上外环常被裁掉)向相邻分区借点,保证 8 根触手一直在工作;每条线另有寿命 `LIFE`(0.5s×0.7–1.3)兜底,到时淡出,保证上下方向也持续更替;松开后该方向冷却 0–0.04s 再抓新点。实测(逐帧 60fps 模拟,1440px):左右平均线长 99 / 98px(范围约 51–157),同时可见 6–8 根(最常见 7 根),约 13 次新接触 / 秒,端点 0 次回跳。(旧版:离球 125→225px 才渐隐,右侧线拖得很长、左侧很短,已替换。)中央 logo 圆加了远距离弥散投影(SVG `<filter id="emb-hub-shadow">` feDropShadow:dy 14、模糊 14、黑 18%,只作用于圆、不作用于 logo 图形),营造悬浮感;VL Embedding 的 logo 圆通过 `filter="url(#emb-hub-shadow)"` 复用同一投影(filter 定义在 Embedding 卡的 SVG 里,删 Embedding 卡时要把 `<defs>` 挪走)。被抓住的点只在端点显示一个小圆点(r=2.6,`#a1a1aa`;线宽 0.85、线透明度 ×0.55、端点 ×0.65)。⚠️ 曾有 bug:触手按计时(0.7–4s)松手后同方向立刻抓更近的点,看起来像「线有最大长度、点往回跳」,已改为上述按距离松手。**由 JS 驱动**(`public/js/retrieval-stack.js` 顶部的 Embedding IIFE,`requestAnimationFrame`;`measure()` 把背景网格换算到 SVG 坐标,窗口缩放会重算;常量 `SPEED` 流速、`NB` 触手数、`RIN` 触手抓取半径、`R` 球半径);该卡片 `data-ms=3600000`,即不做周期性淡出重启,只在进入/离开视口时启停;`prefers-reduced-motion` 只画静态一帧。⚠️ 开发预览窗格会把 rAF 压到约 2fps,触手分配节奏在预览里偏慢且偏向右侧,真实流畅度需在正常浏览器里看 |
| VL Embedding(`Models`) | The **#1** multimodal embedding model. One vector space, so text, images and video find each other. + `SOTA on MMEB-v2 ↗` | **无外层白卡片**,直接画在卡片点阵上(SVG 360×168,整体下移 8px)。中心是黑色圆形 Octen 标志(引用站内 `/_next/static/media/icon-octen-white.842b5932.svg`);周围先出现 **12 个中性灰圆**(大小不一),其中 **6 个**被浅灰连线(`#a1a1aa`)连到 Octen 并**变形成图标球**(白底圆,半径 21,图标取自 **Lucide**:`type` 文字 / `image` 图片 / `video` 视频,蓝 / 紫 / 橙),另外 6 个灰圆不相关、无连线、原地不动;最后 Octen **把 6 个球连同连线一起拉近 20%**(带轻微回弹)。6 个图标球位置、类型都刻意不规则 |
| Monitor(`Tool`) | Watch a topic or any page and get notified only when a change meets your condition. | 监控卡片:顶部条件栏 `if price drops > 10%`(取自文档)→ 三行商品页(`widget-mini` / `widget-pro` / `widget-max`,右侧带价格),扫描条扫过后只有中间一行高亮、价格变 `$49 → $42` → 箭头 → 事件卡片:绿色描边 `monitor.run.completed` + `price 49 → 42`(结构化前后值) |
| Extract(`Tool`) | Turn any URL into clean markdown, with highlights and page classification. | 内部卡片被**拉高到 190px 并贴顶**,整体做底部渐隐 mask(约 52% 处开始,到 96% 消失):`apple.com`(逐字输入)→ Title / Type / Content / Images 逐行出现;Images 是 **4 张真实 Apple 产品图**(46px 方形缩略图),随渐隐一起消失 |

**真实图片**:`public/images/extract/apple-1.jpg … apple-4.jpg`,从源站 octen.ai 的 Extract 示例下载(原文件 `product-apple-static-1..4.jpg`,前三张是 3008×580 横幅,方形裁切后只显示中间一块,与源站一致)。**这些图片文件是新增的,尚未提交。**

**实现**:
- 插画全部是 **HTML + 内联 SVG**,样式 `public/css/retrieval-stack.css`(前缀 `rs-`),在 `index.html` 里引入。文件末尾是按时间追加的覆盖规则(独立卡片、30px 间距、Extract 渐隐、VL 动画、统一规范),**改样式时注意后写的规则会覆盖前面的同名规则**。
- 动画由 `public/js/retrieval-stack.js` 控制:每个 `.rs-art` 独立循环——进入视口 35% 开始,加 `.rs-run` 播放一轮(`data-ms`,默认 9s),结束加 `.rs-out` 淡出 0.6s 后重启;离开视口暂停并清空。元素用 `.rs-a` 标记,`--d` 是本轮内出现延迟;逐字输入用 `width` + `steps()`。
- **VL 动画**的专用类:`.vl-seed`(灰圆,淡入后在球长出前淡出)、`.vl-ball`(图标球,从 0.38 倍放大,`transform-box: fill-box`)、`.vl-pull`(球外层 `<g>`,带 `--dx/--dy/--pd`,时间轴 3.3s 起被拉近)、`.vl-spokes`(整组连线绕 Octen 中心 `transform-origin:180px 84px` 缩放到 0.8,与球的位移一致)。静止/减少动效时直接显示"已拉近"的最终态。
- SVG 内元素的入场只做 opacity(`rs-fade`);**VL 的球/连线用外层 `<g>` + CSS transform** 做位移缩放,内层仍用 `transform="translate()"` 属性定位,二者不要合并(CSS 会覆盖属性)。
- **Embedding 是 JS 驱动的特例**:它不走 `.rs-a` 的 CSS 入场,而是由 `retrieval-stack.js` 顶部独立的 IIFE 逐帧画(背景点阵流动靠 CSS 变量 `--emb-ox` 驱动 `.rs-art--embed::before` 的 `background-position`);它的 `data-ms` 设成 3600000(1 小时)只为让通用 Loop 不做 9s 周期重启。svg 的显隐沿用 `.rs-js …:not(.rs-run) .emb-svg { opacity:0 }` 规则。
- 无 JS / `prefers-reduced-motion`:不加 `.rs-js`,直接显示最终静态画面(Embedding 画静态一帧)。
- 开发时若要截图中间帧,可用 `art.getAnimations({subtree:true}).forEach(a=>{a.pause(); a.currentTime=ms})` 定格。
- **踩坑**:`public/css/web-search.css` 里有 `.retrieval-stack-section .retrieval-stack-get-started` 的覆盖样式(白底白字),所以标题区按钮**不要**加这个类,否则 Get started 按钮看不见;`.rs-head-links` 另外声明了 `--rs-ink`(变量原本只定义在 `.rs-bento` 上,按钮放在它外面会没有底色)。

**限制与注意**:
- 插画里的示意数据(向量文字、`widget-*` 商品页与价格、`monitor.run.completed` 事件名)请与产品确认后再对外使用;事件名取自产品文档截图。
- **Monitor 链接已由产品文档确认**:控制台 `https://octen.ai/platform/monitor`,API 文档 `https://docs.octen.ai/api-reference/post-monitor`。目前页面里已**没有卡片级链接**(只有标题区两个通用按钮),如需恢复"每卡一个入口"请告知。
- **Model Gateway 已从 bento 移除**,但导航栏 Products 菜单(`01-navbar.html`,链到 `https://octen.ai/products/gateway`)和页脚(`09-footer.html`)里仍然列着 Model Gateway,是否同步改成 Monitor 需要产品确认。
- 原来 Embedding / VL Embedding 的榜单柱状图已移除,榜单只保留 "SOTA on …" 行内外链。
- `zoom` 用于窄容器缩放,Firefox 低于 126 不生效(插画会偏大)。
- 四张插画高度、宽度各不相同(约 130–168px 高;Embedding 的 SVG 宽 600、VL 360、Monitor 约 440),已统一居中;VL 与 Embedding 的 logo 圆心位置一致。
- **Embedding 的动画只在 2fps 的预览窗格里验证过**(触手随机分配的节奏在预览里偏慢且偏右),其运动细节需在正常浏览器里确认;曾参考的产品动画 `p1.mp4` 里那种「球周围点随距离放大变深」的透镜效果已按需求去掉。

### 4. 其它改动

- **Pricing 占位区块**:`src/sections/12-pricing.html`,在 `index.html` 中插入于 07 showcase 与 08 get-started 之间;含标题 "Pricing"(占位文案)、一份促销条、虚线占位框。**白底**(与上方 Showcase 同色):标题黑、说明黑 70%、虚线框黑 15%;促销胶囊在白底下改深底 `rgba(0,0,0,.8)`(`web-search.css` 末尾 `#pricing` 规则)。导航栏的 Pricing 仍指向外部 `pring-octen-ai.vercel.app`。
- **Showcase 改为「Try Octen in our applications」(2026-11-24)**:`07-showcase/showcase.html` 重写,样式在新文件 `public/css/showcase-apps.css`(`index.html` 已引入)。
  - 标题区同 Retrieval Stack 规范:胶囊 `Showcase`(30px,保留 `data-copy-anchor="#showcase"`)+ 44px serif 居中标题,无副标题;去掉了原来的左右箭头、装饰背景图和白色网格。
  - **五个 app**:Answer / Search Agent / Deep Research / Grounded Generation / Auto Search。每个是 2:1、圆角 16px 的横版 banner,**以图片为底**:5 张素材统一裁成 **616×308(2:1,banner 的 2x)**,存于 `public/images/apps/bg-*.png`——Answer=bg-green、Search Agent=bg-desert、Deep Research=bg-blue、Grounded Generation=bg-forest(这四张为用户提供的动感模糊图,原截图带圆角白边,裁切时四周各去掉 6%)、Auto Search=bg-auto(用户提供的绿色弧形光带图);图片放在 `.sc-banner::before`,hover 放大 1.04。原版 Application 背景图(`/_next/static/media/showcase-entry-*.svg`)已不再引用(旧 cards/*.html 仍在用,未删);背景图上叠 **35% 黑色遮罩**(`.sc-banner::after`,logo 方块 z-index 1 在最上层);背景图模糊曾加过(blur 12px、hover 去模糊),已按需求去掉,中央 56px **黑色玻璃**圆角方块(60% 黑 + 很淡的顶部白色高光渐变 + 1px 白 14% 描边,`background-clip: padding-box`;上下 inset 亮线曾造成多余黑白边,已去掉;现加 `backdrop-filter: blur(12px)` 磨砂,配 `overflow:hidden` + `will-change: transform` 防圆角锯齿 —— 若仍有锯齿,先去掉 backdrop-filter 排查),logo 用 `filter: brightness(0) invert(1)` 转为**纯白**,里放 **Figma app logo**(Figma `Octen_汇总` node `14304:38085`,已下载到 `public/images/apps/*.svg`;answer / grounded 两个 logo 在 Figma 中带内边距,用 `.is-inset` 缩到 87.5%),名称在 banner 下方的名称行里。banner 渐变和链接(`href="#"`)仍是占位。
  - Retrieval Stack 与 Showcase 之间的分界线已去掉(删除 `06-retrieval-stack.html` 根节点的 `border-b border-[#CCCCCC80]`);Showcase 底色改为白色与上方一致,顶部内边距归零(`showcase-apps.css` 末尾,`!important` 覆盖平板 / 手机规则),两模块间距 = Retrieval Stack 下内边距,1440px 下实测 bento 卡片底 → Showcase 胶囊顶 **120px**。
  - **嵌套卡片结构**(参考 health-traffic 卡片,只取结构不取颜色,无投影):外层 `.sc-app` 浅灰壳 `rgb(246,246,246)` + 1px `#e7e7e7`(与上方 Octen tools and models 卡片同色)、圆角 18、内边距 4;内层图形卡 `.sc-banner` 圆角 14(与外壳同心)在上;底部 `.sc-foot` 名称(16px `#3f3f46`)在下(箭头已去掉)。hover:外壳描边加深(底色不变)、中央 logo 放大 1.06。1440px 宽下卡片高 203px,模块高约 508px;375px 宽下模块约 450px。
  - **能力标签 `.sc-tags`**(名称下方,22px 高、`rgba(255,255,255,.5)` 底色、1px `#d4d4d8` 描边、圆角 4px,12px `#52525b`;卡片 hover 时不变):标注每个 app 用到的 Octen 能力,依据 docs.octen.ai 各 app 页描述推断,**需产品确认**:
    - Answer → Broad Search("synthesized from a Broad Search")
    - Search Agent → Web Search、News Search("searches the web and news")
    - Deep Research → Web Search、Image Search、Video Search(报告配图 / 视频来自来源)
    - Grounded Generation → Image Search、Video Search("retrieves the images and videos")
    - Auto Search → Model Gateway(一个 API key 接入多家前沿模型 + 内置实时搜索;按需求改为此标签)
    桌面端各卡标签都在一行内(卡高 238px,模块约 543px);375px 下 Deep Research 的 3 个标签折成两行,模块约 498px。
  - **横向滚动轨道**(`.sc-apps`,flex + `overflow-x:auto` + `scroll-snap`):
    - 桌面:首卡左缘对齐 1280px 内容区(`--sc-edge = max(32px, (100% - 1280px)/2)`),卡宽 `--sc-card = (1280 - 3×16)/4 = 308px`,前四张正好铺满 1280,**第五张自然排在右侧、突破 1280 限制**,向右滑动可看全;滚动条隐藏。
    - ≤1024px:卡宽固定 300px;≤767px:卡宽 72vw、间距 12px,轨道用 `margin: 0 -16px` 贴到屏幕边缘(`#showcase` 手机端有 16px 左右内边距)。任何屏宽都可左右滑动并吸附到卡片(375px 实测)。
  - **边缘渐隐 + 左右切换按钮**(新文件 `public/js/showcase-apps.js`,在 `10-scripts.html` 引入):
    - 渐隐:`.sc-apps` 用 `mask-image` 线性渐隐,长度变量 `--sc-fl` / `--sc-fr`(桌面 120px、≤767px 48px)由 JS 按滚动位置写入——还能向右滑时右侧渐隐、滑过之后左侧渐隐,到头的一侧不渐隐。无 JS 时默认只右侧渐隐。
    - 按钮 `.sc-nav`:卡片下方、右对齐 1280 内容区,40px 圆形白底 + 1px `#e4e4e7`(无投影);每次滚动一张卡(卡宽 + 间距),到两端禁用(透明度 .35);内容不溢出时整组隐藏;≤767px 隐藏(靠滑动)。1440px 下可滚动距离 324px(正好一张卡),实测前进 / 后退 / 禁用状态正确。
  - 模块上下内边距桌面 80px(原 120px),1440px 宽下模块高约 473px,375px 宽下约 439px。
  - 旧版 4 张动图卡片 `07-showcase/cards/*.html` 保留未删,只是不再 include。
- **新增模块 Octen Search 三档(Pulse / Fast / Premier,2026-11-24)**:放在 Web Search 之后、Octen tools and models 之前,白底。内容取自 `references/octen-homepage-hifi.html` 第 ② 模块,文字整理在 `references/octen-search-tiers.md`。文件:`src/sections/03b-search-tiers.html`(index.html 中 include)、`public/css/octen-tiers.css`、`public/js/octen-tiers.js`(10-scripts.html 引入)。注意:`public/css/search-tiers.css` 是另一个旧文件(hero 里已隐藏的三档小卡用),不要混淆。布局:标题区 → 速度/质量轴 + 三档概览按钮 → Bento(Pulse 5 列 | Fast 7 列 | Premier 通栏左文右图)。交互:概览按钮 hover/focus 高亮下方对应卡片、其余淡出(≤1024px 点击滚动到卡片;≤767px 概览条隐藏);Pulse 插画光点 query → model → URL 循环(进入视口才播);Fast 的 API 网格悬停上浮,Broad 图标扇出;Premier(2026-11-24 改为 6 格 Bento,参考"左高卡 + 深色卡 + 搜索框"布局)= 整体放在一个父级灰底卡(同 Pulse / Fast,内边距 12px)中,格子白底、插画面板 #fafafa;4 列 × 2 行:A 标语 + 搜索框(左列跨两行,淡网格底,标语灰/黑两段,底部搜索框自动轮流输入 News / Business / Place 示例查询并高亮对应卡片,进入视口才运行)| B News | C Web Premier 深色卡 #101217(跨两列,一列结果标出 "Contains answer",悬停高亮该条;不演示排序/对比)| D Business | E Place | F Design(Soon)。每格灰底 + 内嵌白色插画面板 190px + 名称/一句话。悬停(或被搜索框高亮)时:News 转载卡合并、Business 字段逐行填入、Place 针落下 + 地点卡弹出、Design 扫光选中 App。平板 2 列(A 通栏,dense 填充),手机 1 列。内容来源:Premier 标语来自 hifi 参考页;News/Business/Place/Design 描述与示例取自 "Search by type" 参考图(示例公司/地点为参考图里的虚构示意);Web Premier 描述拼自 hifi 参考页 + FAQ;Web Premier 插图为示意,非真实检索结果。注意参考页本身对 Web Premier 是否已上线、名称("Web Premier" vs "Web Search Premier")不一致,待产品确认。每档强调色:Pulse #16B673、Fast #039855、Premier #B8913F。navbar 浅色区起点改为 `#search-tiers`(`public/js/navbar.js`)。留白:上 120;与下方 Octen tools and models 同白 → 合计 120(本块下 120,`#retrieval-stack` 上改为 0)。标题格式已与其他模块统一(octen-tiers.css 末尾):h2 IBM Plex Serif 44/500;卡片 h3 同 `.rs-title`(24/600/1.33);描述同 `.rs-desc`(16/1.5/#71717a);卡片标签同 `.rs-tag` 灰框小标签(保留色点)。
- **Pricing 头部(2026-11-24)**:副文案改为 "Sign up and get $5 in free balance",下方新增主按钮 "Start building ↗"(复用 `.rs-btn--solid`,链接 /platform/overview,悬停箭头斜向位移;样式见 web-search.css 末尾 `#pricing .pr-start-btn`),促销胶囊保留在按钮下方。"$5 in free balance" 用绿色 #039855 / 600 强调(`#pricing .pr-free`)。
- **Pulse 卡改版(2026-11-24)**:去掉底部 Product / Latency / Best for 规格表;延迟改为大字 "~10 ms" + 小字 "Latency per call",放在介绍文字左侧(细竖线分隔,`.st-lead` / `.st-stat`);"Best for · Routing, pre-fetch & in-loop lookups" 作为小字放在卡片内部底部(`.st-bestfor`);插图徽标改为 "1 inference" 避免与大数字重复。手机端大数字移到文字上方、query → model → URL 流程图改竖排(原横排在 390px 宽溢出)。Pulse Search 文档链接随规格表一起移除。 Fast 卡同样处理:大字 "~62 ms" + "Latency per call" 在介绍文字左侧,底部规格表删除,"Best for · Grounding answers & research agents" 小字在卡片底部;QPS 条右侧文字由 "~62 ms flat" 改为 "flat latency" 避免重复。
- **Premier 卡片悬停突出已恢复(2026-11-24)**:另一次编辑删掉了 `.st-pm:hover` 的上浮 / 描边 / 投影(深色卡同理)。已在 octen-tiers.css 末尾补回:悬停上浮 2px + 描边加深 + 投影(标语格不上浮),与 Fast 卡一致;卡内插画动效仍挂在 :hover / .is-hl 上。以后改 Premier 样式时注意保留这段。
- **Fast 卡 API 图形化改版(2026-11-24)**:原 `st-fb-*` 网格换成与 Premier 同一套语言的 `st-fx-*` 卡片(markup 在 03b-search-tiers.html,样式整体重写在 `public/css/fast-bento.css`)。3 列:Web | Broad(跨两列)/ Image | Video | Sense(Soon,虚线)。每卡白底 + 内嵌 #fafafa 插画面板 116px + 名称 / 一句话 + ↗;只有 Video 为深色卡(#101217)。动效(悬停或被自动轮播高亮 `.is-hl` 时):Web 排名条依次伸展、Broad 连线依次绘出 + 子查询依次亮起、Image 缩略图依次淡入、Video 播放头扫过命中片段、Sense 悬停信号环扩散。`octen-tiers.js` 在网格进入视口后按 Web → Broad → Image → Video 每 2.6s 轮流高亮,悬停网格暂停。Broad 示例问题 "What is the best AI search engine?" 与 4 个子查询取自 hifi 参考页对比图;各卡链接指向 footer 中已有的 docs capability 页面。手机 2 列(Broad 通栏,dense 填充)。
- **白底模块灰卡统一色值(2026-11-24)**:原中性灰 #F6F6F6 / #E7E7E7 与绿调灰 #F2F4F2 / #E6E6E6 合为一套 **#F4F5F4 / #E6E7E6**,定义在 `public/css/surface-tokens.css`(`--octen-card-bg` / `--octen-card-line`,index.html 中在 octen-tiers.css 之前引入)。已引用:octen-tiers.css(`--st-soft` / `--st-line`)、retrieval-stack.css(`--rs-line`、bento 与 `.rs-cell` 底色)、showcase-apps.css(`.sc-app` 及 hover)、get-started.css(步骤卡 + Skills 卡)、pricing-search-plans.css(`.sp-alt-card`)。Built to Perform 的整块底色 #F1F4F2 属于模块背景,不在此列。要整体调色只改 surface-tokens.css。
- **Footer「Back to top」(2026-11-24)**:底栏最右(SOC 2 徽章之后)幽灵胶囊 "Back to top ↑",点击平滑滚回顶部(减少动态效果时直接跳)。`09-footer.html` + `footer.css` 末尾 `.octen-footer-top` + `public/js/back-to-top.js`(10-scripts.html 引入)。悬停箭头上移并变绿 #18FB6F。手机端随法律链接换行。
- **模块上下留白统一规则(桌面 ≥1025px,`public/css/section-spacing.css`,最后加载、覆盖各模块自己的 padding;下文各处旧的 80 / 96 / 100px 留白以此为准)**:相邻模块**底色不同** → 各自内容到自己边缘 120px;**底色相同** → 两块内容之间合计 120px。1440px 实测(内容 = 第一个 / 最后一个可见元素):Hero 底 120(到 "API Platform" 胶囊)→ Web Search 120/120 → Octen Search 三档 120/120 → Octen tools and models 上 0(与上块同白)/ 下 120 → Showcase 上 0(与上块同白,合计 120)/ 下 120(原 88)→ Built to Perform 120/120(原 97,含 1px 边线)→ Pricing 120/120(原 100)→ Get started 上 120(原 100)/ 下 74 + Footer logo 距顶 45 + 1 = 120(两者同为 #080B12)。平板 / 手机留白未改(仍按 section-titles.css 等处的 clamp / 60px)。
- **Built to Perform 头部改为左右布局(2026-11-24,仅 ≥1025px)**:`public/css/built-to-perform-tabs.css` 末尾一段。`.bpt-head` 改为 grid——左列 `Performance` 标签 + 标题 + tabs(左对齐),右列小标题 + 详述(`.bpt-copy-stage`,最宽 440px,贴容器右侧、文字左对齐、底边与 tabs 对齐)。头部宽 `min(1084px, 94vw)`,与默认 Value 面板卡片左右边缘对齐。模块内边距 110/130 → 96/96、头部与卡片间距 36 → 32。1440px 宽下模块高 983 → **823px**。≤1024px 保持原居中堆叠。切换 Scale / Freshness 时右侧文字就地淡入淡出,高度不变。
- **Built to Perform 背景**:已去除 10px 点阵,底色定为 **`#F1F4F2`**(CSS 变量 `--bpt-bg`)。Tab 胶囊改为无色 + 透明度(吸收底色色调):轨道 `rgba(0,0,0,.05)` + 1px `rgba(0,0,0,.04)` 内描边;选中胶囊 `rgba(255,255,255,.85)` + 轻投影 `rgba(0,0,0,.06)`;未选中文字 `rgba(0,0,0,.55)`。均在 `built-to-perform-tabs.css` 末尾。(调色用的临时 H/S/L 滑块面板已删除。)上下边界统一:本模块自带上下各 1px `#CCCCCC80` 边线;原先上方那条来自 `#showcase` 的 `border-b`(已从 showcase.html 移除),下方与 Pricing 之间原本没有线。
- **Hero console 取消滚轮响应(2026-11-24)**:原先 console 内两个滚动区(Search Process 列表 / Answer 面板)设了 `overscroll-behavior: contain`,鼠标停在 console 上时滚轮只滚内部、带不动整页。现在 `public/js/hero-console-scroll.js`(在 `10-scripts.html` 引入)在 console 上监听 wheel(`passive:false`),`preventDefault` 后用 `window.scrollBy` 把滚动量转给整页(ctrl+滚轮缩放不拦截);内部内容**只能拖动滚动条**滚动(overflow 仍为 auto,滚动条可见)。触摸设备(`hover: none`)内部 `overflow-y: hidden`,手指滑动直接滚整页。实测:滚轮在 console 上滚动 → 页面 400→700、内部 scrollTop 保持 0。
- **模块大标题字重**:`public/css/section-titles.css` 以变量 `--module-title-weight: 500` 统一(Web Search、垂直搜索、多模态、retrieval stack、showcase、Built to Perform、Get started、Pricing)。Web Search 两张卡片的 `h3` 为 600。
- **Hero 标题**:`h1` 字号 `clamp(28px, 9.1vw, 65px)`(原 80px 上限)。
- `rotating-word-shine/`:Shine Word 的独立演示(`index.html` + `shine-word.js/css` + README),需要本地服务器(ES module);**未同步**后续改动(无 baseGradient、仍带 bloom、无收起/停留逻辑)。

---

### 5. 踩坑记录(改样式前请先读)

1. **祖先上的 `filter` 会让后代的 `backdrop-filter` 失效**:`.hero-console-wrap` 带内联 `filter:blur(0px)`,它成了"backdrop root",里面元素的背景模糊看不到外面的 ASCII/光晕。所以模糊必须加在这个父级上,而不是 console 本身。
2. **`mask-image` 会稀释同元素的 `backdrop-filter`**:console 自身的渐隐遮罩越靠底越透明,模糊也越弱。
3. **Tailwind 层内的 `!important` 压过无层的 `!important`**:`min-w-full!` 之类用 `@layer` 的工具类带 `!important`,普通样式表里的 `!important` 覆盖不了(层顺序对 `!important` 是反的)。光晕图要变宽,改用外层 `.hero-bottom-glow__inner` 加宽的方式。
4. **内联样式要用 `!important` 覆盖**:右卡内的源站 SSR 内联 `opacity:0 / transform / background` 很多,动画和样式覆盖都靠样式表里的 `!important`。
5. **ShineWord 首帧居中**:收起状态必须写在 HTML 类名里(见 §2.1);若由 JS 加类,会有从左滑回中央的闪动。
6. **整块替换样式文件末尾很危险**:曾因"从某注释到文件末尾整体替换"误删了后面追加的胶囊规则,后来补回。`hero-shader.css`、`web-search.css` 都是**追加式**写法,请按注释分段维护,别整体覆盖。
7. **`@property` / `backdrop-filter` / `mask-image`**:旧浏览器降级为无过渡 / 无模糊 / 无渐隐,功能仍可用。

---

### 6. 可调参数速查

| 想调什么 | 位置 | 参数 |
|---|---|---|
| 首屏/每轮"Search 居中"停留 | `src/hero-shine-word.js` | `initialDelay`、`loopPause` |
| 扫光快慢 / 单字入场 | `src/lib/shine-word.js` | `SHINE_MS`、`ENTER_MS`、`SECOND_*` |
| 轮播词静止渐变 | `src/hero-shine-word.js` | `baseGradient` |
| Hero 底部留白 | `hero-shader.css` | `--hero-bottom-gap` |
| 光晕下移 / 上挪 | `hero-shader.css` | `--hero-glow-shift` 系数、`--hero-glow-lift` |
| Console 高度 / 渐隐长度 | `hero-shader.css` | `.hero-console { height }`、`--console-fade` |
| ASCII 涟漪 | `hero-ascii.js` | `WAVE_LEN`、`WAVE_SPEED`、`WAVE_STRETCH` |
| ASCII 字符大小 / 高度 / 概率 | `hero-ascii.js` | 行高系数 `0.0068`、`VISIBLE`、`SYMBOL_P`、`BRAND_P` |
| ASCII 整体淡/浓 | `hero-shader.css` / `hero-ascii.js` | `.hero-ascii { opacity }`、`STOPS` |
| 对比动画节奏 | `web-search-animation.js` | `TYPE_MS`、`HUMAN_*`、`CHIP_MS`、`STACK_MS`、`HOLD_MS` |
| 卡片间距 / vs. 边框宽 | `web-search.css` | `--ws-gap` |
| 括号压缩 / 顶部对齐 | `web-search.css` | `--ws-brace-shrink`(改后需同步网格高度保持底边对齐) |
| 模块底色 | `web-search.css` | `--ws-module-bg` |
| hover 底色变化 | `web-search.css` | `--ws-tint` 的 hover 值 |
| 标题字重 | `section-titles.css` | `--module-title-weight` |
| Bento 插画动画节奏 | `public/js/retrieval-stack.js` / 各 `.rs-art` 的 `data-ms`、`--d` | 单轮时长、元素出现延迟 |
| Embedding 点阵流速 / 触手数 / 抓取半径 | `retrieval-stack.js` 顶部 Embedding IIFE | `SPEED`(44px/s)、`NB`(8,触手根数)、`RIN`(104)、空闲触手重新抓取概率 `dt/10`、松开后冷却 `random*40`ms、淡入淡出时间常数 30ms、对称释放带 `BAND_IN/BAND_OUT`(14 / 30px,线长范围 ≈ RIN±30)、寿命 `LIFE`(500ms);连线更替快慢主要由 `SPEED`、`BAND_OUT`、`LIFE` 决定 |
| 卡片描述文字颜色 | `retrieval-stack.css` 末尾 | `.rs-desc`(`#71717a`)、`.rs-desc b` |
| 卡片内边距 / 插画区高度 | `retrieval-stack.css` | `.rs-art { height: 192px }`、`.rs-copy { padding-bottom: 30px }` |

---

### 7. 验证情况与已知风险

**已验证**:Shine Word 时序(含首屏/循环收起)、对比动画元素与括号对齐的几何数值(顶/底差为 0)、模块总高 940px、各处样式在页面上的计算值、`pnpm build` 通过(提交 `c227b04` 时)。

**未完整验证(请回归)**:
- Embedding 动画在真实帧率下的观感(预览窗格 rAF 被压到约 2fps);Octen tools and models 四张卡片在手机/平板宽度下的插画缩放(尤其 VL 的 360px 宽 SVG 与拉近动画)、Firefox <126 的 `zoom`;真实播放时的动画流畅度(只定格验证过各时间点)。
- 手机/平板宽度(<768px 与 768–1000px):堆叠布局下 vs. 位置、括号、光晕观感、ShineWord 收起居中;仅在 390px 量过光晕尺寸。
- 动画连续播放的真实节奏(开发环境预览窗格在后台会压低帧率,只验证了离散时间点)。
- 非 macOS 下 ✦ ◇ ○ Δ 的回退字体宽度/粗细。
- 超宽屏(>1917px)光晕封顶 556px 的观感。
- 滚动后画面的完整视觉(自动化截图在滚动区域常出现未绘制的占位图)。

**已知取舍**:
- 窄屏卡片、Figma 稿的原始尺寸在 ≥768px 被压缩(卡片 582→492px),左侧条目间距只有 7px。
- Console 内部滚动区到底时,最后几行位于渐隐区,颜色很淡。
- 左右卡底色偏蓝,与模块底色 `#0f0f10`(中性灰)有轻微色调差,卡片底色尚未最终确定。

**待办 / 建议**:
- 决定是否把 vs. 改为真镂空(`mask-image` 圆洞)。
- 清理/确认:`hero-typewriter.js`(可删)、`04/05-*.html` 的他人改动、`references/`。
- 若需让 `rotating-word-shine/` 与站点同步,需把 `src/lib/shine-word.js` 复制回去。
