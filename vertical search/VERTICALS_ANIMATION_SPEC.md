# Verticals 动效规范 (Verticals Animation Spec)

本文档梳理 Octen **Vertical Search** 原型中的核心动效规范，涵盖 **Vertical Tabs 交互切换动效逻辑**、News Search 四大卖点微动效、核心数字流转、共享元素形变以及 Timeline 最新新闻定位机制。

> 💡 步骤 1~5 基础右侧视口时序（Typing ➔ Searching ➔ Overview ➔ Top News Focus ➔ Timeline Stream）请参阅 [NEWS_SEARCH_ANIMATION_SPEC.md](./NEWS_SEARCH_ANIMATION_SPEC.md)。

---

## 一、垂直类别 Tabs 切换交互动效 (Vertical Tabs Interactive Switching)

Tabs 控制栏（`#tabNews` 与 `#tabBusiness`）承载了全站两大垂直搜索能力的实时切换，采用双轨平滑滑块（Sliding Glider）与全局状态机重燃机制。

### 1. 双轨滑动滑块指示器 (Sliding Glider Indicator)
- **底层架构**：
  - 外部滑块底板（`#tabsIndicator`）：自适应贴合当前激活 Tab 物理边界；
  - 内部克隆文字轨道（`#tabsIndicatorTrack`）：反向位移实现反色文字精准遮罩。
- **物理运动与曲线**：
  - **位移与缩放**：根据目标 Tab 按钮动态计算 `offsetLeft/offsetTop` 及 `offsetWidth/offsetHeight`，执行 `translate3d(${left}px, ${top}px, 0)`；
  - **时长与曲线**：时长严格设为 **`0.38s`**，采用精密缓动 **`cubic-bezier(0.16, 1, 0.3, 1)`**；
  - **色彩过渡**：随同位移同步执行 `background-color 0.38s` 平滑过渡：
    - **News Tab**：经典草绿色 `#8ADB47`；
    - **Business Tab**：金融琥珀金 `#FBBF24`；
    - *(扩展预留：Academic Tab 为天蓝色 `#38BDF8`)*；
  - **反向视差克隆轨道**：轨道执行 `translate3d(${4 - left}px, ${4 - top}px, 0)`，使克隆白色文字在滑动过程中与原按钮文字 100% 绝对重合，呈现高精度光学遮罩质感。

### 2. Tab 切换时画布全局重燃逻辑 (Canvas Global Re-ignition)
点击切换 Tab 时，触发 `switchVertical(key)` 执行完整的时序重置与视觉重组：
1. **主题环境注入**：根容器更新 `data-theme="news|business"`，全站 CSS 变量与色板即时绑定；
2. **背景大水印弹性弹出（Watermark Pop）**：
   - 切换 SVG 矢量资产（新闻报纸 ➔ 商务公文包）；
   - 强制重绘并触发 `.watermark-pop` 弹性微缩放动效（`cubic-bezier(0.34, 1.18, 0.64, 1)`）；
3. **左侧信息区自适应更新**：
   - 更新左侧大标题（`News Search` ➔ `Business Search`）与 28px 标题图标；
   - 替换下方描述与四大/三大卖点文案；
   - **定时器队列安全分流**：若切至 News，启动数字滚轮与 Token 计量条循环；若切至 Business，彻底清理 `clearTokenMeterTimers()` 消除后台冗余；
4. **胶囊标签与右侧内容重置**：
   - 重置横向胶囊活跃索引为 `0`；
   - 动态更新 Top Focus 主卡片及时间轴数据源；
5. **完整时序重新流转**：
   - 自动开启自动循环（`isAutoLooping = true`），隐藏 Replay 按钮，从步骤 1 打字（`typing`）重新完整推演 1~5 步动效。

---

## 二、News Search 四大核心卖点内嵌微动效 (Selling Points Micro-Animations)

四项微动效内联行内嵌入，统一位于各条核心关键词紧邻前方，形成严格对齐的视觉韵律：

### 1. 实时电传 LIVE 徽标 (Live Badge)
- **位置**：位于第 1 条卖点 `3 minutes` 前方（`... within <live-badge> 3 minutes ...`）。
- **动画逻辑**：
  - **呼吸脉冲**：橙色圆点执行 `@keyframes live-dot-pulse 1.4s ease-in-out infinite`；
  - **振幅规律**：透明度在 `1.0` 与 `0.35` 间往复，同时伴随 `scale(1)` 到 `scale(0.75)` 的微缩放，传递“电传级发稿即收录”的心跳感；
  - **静态规格**：外壳 `36.91px × 18px`，背景 `#242D29`，圆角 `4px`，内边距 `4px`；圆点 `5.91px`（`#FF622D`）；文字 `12px DM Sans 700 #FFFFFF`。

### 2. 主流媒体向右平滑滚动 (Avatar Cycles)
- **位置**：位于第 2 条卖点 `news media` 前方（`... tier-1 <avatar-cycles> news media ...`）。
- **动画逻辑**：
  - **向右持续流转**：执行 `@keyframes avatar-cycles-scroll-right`，轨道自 `translate3d(-81.42px, 0, 0)` 平滑匀速移动至 `translate3d(0, 0, 0)`，耗时 **`8.5s linear infinite`**；
  - **无缝闭环**：内置 6 大媒体圆标（Reuters, Bloomberg, WSJ, BBC, FT, AP）+ 6 个首尾克隆标（共 12 节点），首尾位移严格恒等，无任何断层；
  - **双侧羽化渐变蒙版**：容器配置 `mask-image: linear-gradient(90deg, transparent 0%, black 14%, black 86%, transparent 100%)`，使圆标在进入与滑出 48px 视口两侧时柔和消隐；
  - **静态规格**：视口 `48px × 20px`；单标外径 `18px`，黑色底，外描边 `2px #8EB876`，重叠负间距 `-4.43px`（圆心节距 `13.57px`，呈现月牙咬合）。

### 3. Token 级联高度消减计量条 (Mini Token Meter)
- **位置**：位于第 3 条卖点 `tokens` 前方（`... prompt <token-meter> tokens.`）。
- **动画逻辑**：
  - **级联消减流程**：
    1. **满格展示**：展开后保持 100% 满格静态展示约 `500ms~750ms`；
    2. **自右向左逐柱沉降**：后 8 根柱（第 10 根至第 3 根）以 **140ms** 步频依次触发高度消减；
    3. **柔和缓动**：单柱高度消减过渡为 **0.65s**（`cubic-bezier(0.2, 0.8, 0.25, 1)`）；
    4. **目标定格形态**：前 2 根保持 100% 高度，**第 3 根沉降至 50%（6px）**，后 7 根完全沉降至 0%（仅保留 `rgba(36, 45, 41, 0.3)` 空底槽），实心填充统一为深林墨黑 `#242D29`，精准隐喻节省 75% Token；
  - **循环与驻留**：定格态**静止驻留 3.0 秒**供用户阅读，随后重新注满并循环；切换 Tab 或 Replay 时重置定时器队列。

### 4. 事件脉络时间轴逆向步进 (Storyline Timeline)
- **位置**：位于第 4 条卖点 `storylines` 前方（`... unified <storyline-timeline> storylines.`）。
- **动画逻辑**：
  - **逆向向左步进**：顺应时间流自右向左推进隐喻，单步位移严格恒等于一个节距 **`-18.46px`**；
  - **舒缓停顿节奏（单周期 2.8s）**：
    - **~2.34s（84% 时间）稳稳静止在中央**：在 `0% ~ 72%` 与 `88% ~ 100%` 处于完全静止稳态；
    - **0.45s 舒缓滑移交替**：在 `72% ~ 88%` 区间通过 `cubic-bezier(0.25, 1, 0.4, 1)` 平滑向左移动 `-18.46px`，右侧新节点顺畅滑入正中并平稳接替；
  - **静态规格与绝对对称**：容器 `64px × 10px`，导轨高 `2px`（深色 `#242D29`，`opacity: 0.2`）；节点外径 `10px`（内芯 `6px`，外描边 `2px #242D29`，内芯填充色为柔和嫩草绿 **`#b4d095`**）；流容器起点 `left: -9.92px`，静止时第 3 节点圆心精确锁定在容器 `32px` 正中心，左右可视节点亚像素级对称。

---

## 三、核心数字动态流转 (NumberFlow Odometer)

- **集成组件**：原生自定义元素 `<number-flow>`（驱动数字 `3` 与 `95%`）。
- **动画逻辑**：
  - **静默锁零**：在步骤 1（Typing）与步骤 2（Searching）期间数值锁定为 `0`；
  - **触发时机**：步骤 3（Overview）展开时触发 `playSellingPointsNumberFlow()`；
  - **滚轮曲线与时长**：配置 `spinTiming = { duration: 950, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }`；
  - **交互体验**：从 0 自下而上如精密仪表盘滚轮般旋转至目标数字，切换 Tab 或 Replay 时重播。

---

## 四、背景水印 ➔ 标题 Icon 共享元素形变 (Shared-Element Morph)

### 1. 正向穿越过渡 (Typing ➔ Searching)
- **空间飞跃**：打字完成进入搜索瞬间，`280px` 背景半透明大水印（`opacity: 0.12`）脱离底图层，沿亚像素轨迹平滑飞向标题左侧插槽；
- **同步缩放与加深**：在位移过程中自 `280px` 细腻缩小 10 倍至 `28px`，透明度从 `0.12` 加深至 `1.0`，全程耗时约 **520ms**；
- **无缝交接**：抵达瞬间完美贴合原生 flex 标题图标 `#canvasHeadingIcon`，随后隐蔽退出，由原生图标承接后续交互。

### 2. 反向呼吸过渡 (Results ➔ Typing / Replay / Tab 切换)
- 点击 Replay 或重播回滚时，标题小图标沿相反轨迹向画布深处扩散膨胀回 `280px` 大水印，透明度由 `1.0` 柔化淡回 `0.12`。

### 3. 残影清除机制 (Triple-Lock Shield)
- 针对 WAAPI `fill: 'forwards'` 导致步骤 3 Overview 卡片左侧多出水印图标的残留 Bug，实施三重防护：
  1. **WAAPI 显式 cancel**：动画完成回调中调用 `anim.cancel()` 释放样式图层锁定；
  2. **状态机强校验**：进入 `overview/focus/timeline` 状态时强制清理并设置 `display: 'none'`；
  3. **CSS 物理隔离**：规则 `.card-canvas.has-results .canvas-watermark { display: none !important; opacity: 0 !important; }` 从渲染树物理层面杜绝重影。

---

## 五、Timeline 最新新闻 Latest 徽标与 Subjects 自动定位机制

### 1. 最新新闻 Latest 标签元素规范
- **适用目标**：时间轴（Stage 5 Timeline Stream）中按真实发布时间正序排列的**最新（末尾）一条新闻卡片**。
- **元素结构**：
  - 在卡片元信息栏 `.sub-article-time-group` 中，紧随相对时间戳（如 `3m ago`、`10m ago` 等）展示 `<span class="timeline-latest-tag">latest</span>`。
- **视觉规格**：
  - 背景色：鲜亮突发橙 `#F97316`，文字纯白 `#FFFFFF`；
  - 尺寸与排版：`padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; letter-spacing: 0.02em;`；
  - 认知隐喻：直观凸显该时间流中“刚刚突发”的最前沿动态，与卖点 1 的 `live` 徽标形成强烈的时效认知呼应。

### 2. Subjects 切换时自动定位到最新新闻交互机制
- **设计背景与用户预期**：
  - 时间轴采用严格的正序展开（早发生的在上，晚发生的在下），最新发生的新闻往往位于列表最底部；
  - 当卡片数量超出容器可视高度（$N \ge 4$）时，用户切换不同的主题横向胶囊（`Subject1` ~ `Subject4`）时，核心诉求是**第一时间看到该事件最新演进结果**，而非退回最初始的历史起点。
- **自动定位时序与控制逻辑**：
  1. **免重复展开打扰**：在 Stage 5 激活态下点击切换 `subject-h-pill` 时，不再重复播放脊柱导线生长与逐卡弹出的入场动效，直接全量渲染目标 Subject 的完整时间轴卡片；
  2. **瞬时贴底定位**：
     - 在卡片 DOM 挂载后通过 `requestAnimationFrame` 执行视口重定位：
       ```javascript
       const maxScroll = Math.max(0, streamBlock.scrollHeight - streamBlock.clientHeight);
       streamBlock.scrollTop = maxScroll;
       ```
     - 确保视口瞬间精准锚定在包含 `latest` 标签的最底部最新新闻卡片上，并保留底部安全间距；
  3. **交互自由度释放**：
     - 取消当前任何进行中的动画锁和滚动限制，立即开放自由滚轮与触控滑动，方便用户由最新向早期事件反向追溯历史脉络。
