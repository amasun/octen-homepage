# News Search 动效改动与新增规范 (Spec 2)

本文档专注于今日 News Search 的新增与调整动效逻辑（四大卖点微动效、数字流转、共享元素形变），只记录改动部分，原有步骤 1~5 基础时序见 [NEWS_SEARCH_ANIMATION_SPEC.md](./NEWS_SEARCH_ANIMATION_SPEC.md)。

---

## 一、四大核心卖点内嵌微动效 (Selling Points Micro-Animations)

四项动效均采用内联行内嵌入，统一位于各条核心关键词紧邻前方，形成严格对齐的视觉韵律。

### 1. 实时电传 LIVE 徽标 (Live Badge)
- **位置**：位于第 1 条卖点 `3 minutes` 前方（`... within <live-badge> 3 minutes ...`）。
- **动画逻辑**：
  - **呼吸脉冲**：橙色圆点执行 `@keyframes live-dot-pulse 1.4s ease-in-out infinite`；
  - **振幅规律**：透明度在 `1.0` 与 `0.35` 间往复，同时伴随 `scale(1)` 到 `scale(0.75)` 的微缩放，传递“电传级发稿即收录”的动态心跳感；
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
    4. **目标定格形态**：前 2 根保持 100% 高度，**第 3 根沉降至 50%（6px）**，后 7 根完全沉降至 0%（仅保留 `rgba(0, 79, 43, 0.3)` 空底槽），精准隐喻节省 75% Token；
  - **循环与驻留**：定格态**静止驻留 3.0 秒**供用户阅读，随后重新注满并循环；切换 Tab 或 Replay 时重置定时器队列。

### 4. 事件脉络时间轴逆向步进 (Storyline Timeline)
- **位置**：位于第 4 条卖点 `storylines` 前方（`... unified <storyline-timeline> storylines.`）。
- **动画逻辑**：
  - **逆向向左步进**：顺应时间流自右向左推进隐喻，单步位移严格恒等于一个节距 **`-18.46px`**；
  - **舒缓停顿节奏（单周期 2.8s）**：
    - **~2.34s（84% 时间）稳稳静止在中央**：在 `0% ~ 72%` 与 `88% ~ 100%` 处于完全静止稳态；
    - **0.45s 舒缓滑移交替**：在 `72% ~ 88%` 区间通过 `cubic-bezier(0.25, 1, 0.4, 1)` 平滑向左移动 `-18.46px`，右侧新节点顺畅滑入正中并平稳接替；
  - **静态规格与绝对对称**：容器 `64px × 10px`，导轨高 `2px`（`opacity: 0.2`）；节点外径 `10px`（内芯 `6px`，描边 `2px #004F2B`，底色 `#8EB876`）；流容器起点 `left: -9.92px`，静止时第 3 节点圆心精确锁定在容器 `32px` 正中心，左右可视节点亚像素级对称。

---

## 二、核心数字动态流转 (NumberFlow Odometer)

- **集成组件**：原生自定义元素 `<number-flow>`（驱动数字 `3` 与 `95%`）。
- **动画逻辑**：
  - **静默锁零**：在步骤 1（Typing）与步骤 2（Searching）期间数值锁定为 `0`；
  - **触发时机**：步骤 3（Overview）展开时触发 `playSellingPointsNumberFlow()`；
  - **滚轮曲线与时长**：配置 `spinTiming = { duration: 950, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }`；
  - **交互体验**：从 0 自下而上如精密仪表盘滚轮般旋转至目标数字，切换 Tab 或 Replay 时重播。

---

## 三、背景水印 ➔ 标题 Icon 共享元素形变 (Shared-Element Morph)

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
