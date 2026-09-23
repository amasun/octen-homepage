# Verticals 动效规范 (Verticals Animation Spec)

本文档精炼定义 Octen **Vertical Search** 的核心动效参数与时序交互逻辑。基础 1~5 步右侧主视口时序见 [NEWS_SEARCH_ANIMATION_SPEC.md](./NEWS_SEARCH_ANIMATION_SPEC.md)。

---

## 一、Vertical Tabs 切换动效 (Tabs Switching)

### 1. 滑动滑块指示器 (Sliding Glider)
- **运动时序**：时长 **`0.38s`**，曲线 **`cubic-bezier(0.16, 1, 0.3, 1)`**。
- **物理位移**：外部滑块（`#tabsIndicator`）自适应目标 Tab 坐标与尺寸；内部克隆文字轨道反向位移 `translate3d(${4 - left}px, ${4 - top}px, 0)` 实现反色遮罩。
- **色彩过渡**：底色同步 `0.38s` 渐变：News 为草绿 **`#8ADB47`**，Business 为琥珀金 **`#FBBF24`**。

### 2. 画布全局状态重置 (Global Re-ignition)
- **环境切换**：更新容器 `data-theme`，实时替换大标题、28px 图标、卖点文案与时间轴数据。
- **水印弹性弹出**：更新 SVG 资产并触发 `.watermark-pop` 弹性微缩放动效。
- **定时器分流**：切至 News 触发数字滚轮与 Token 计量条循环；切至 Business 彻底清理 `clearTokenMeterTimers()`。
- **时序重置**：胶囊索引复位至 0，隐藏 Replay 按钮，从步骤 1 打字（`typing`）重新完整流转。

---

## 二、四大卖点内嵌微动效 (Selling Points Micro-Animations)

四项微动效内联嵌入在各条核心关键词紧邻前方：

### 1. 实时电传 LIVE 徽标 (Live Badge)
- **位置**：`3 minutes` 前。
- **动效逻辑**：橙点执行 `@keyframes live-dot-pulse 1.4s ease-in-out infinite`（透明度 `1.0 ⇄ 0.35`，伴随 `scale(1) ⇄ scale(0.75)` 呼吸）。
- **参数规格**：外壳 `36.91 × 18px`，背景 `#242D29`，圆角 `4px`，内边距 `4px`；圆点 `5.91px`（`#FF622D`）；文字 `12px DM Sans 700 #FFFFFF`。

### 2. 主流媒体向右平滑滚动 (Avatar Cycles)
- **位置**：`news media` 前。
- **动效逻辑**：向右匀速平移 `@keyframes avatar-cycles-scroll-right`（`translate3d(-81.42px, 0, 0) ➔ 0`，**`8.5s linear infinite`**）；双侧配置羽化渐变遮罩。
- **参数规格**：视口 `48 × 20px`；6 大媒体 + 6 闭环节点（共 12 节点）；单标外径 `18px`，边框 `2px #8EB876`，重叠负间距 `-4.43px`（圆心节距 `13.57px` 月牙咬合）。

### 3. Token 级联高度消减计量条 (Mini Token Meter)
- **位置**：`tokens` 前。
- **动效逻辑**：满格静态展示 `500~750ms` ➔ 后 8 根柱以 **`140ms`** 步频自右向左依次沉降（单柱消减 `0.65s`）；第 3 根沉降至 **50%（6px）**，后 7 根降至 0%（隐喻节省 75% Token）；定格态**驻留 3.0s** 后循环。
- **参数规格**：实心条 `#242D29`，底层空槽 `rgba(36, 45, 41, 0.3)`。

### 4. 事件脉络时间轴逆向步进 (Storyline Timeline)
- **位置**：`storylines` 前。
- **动效逻辑**：逆向向左步进，单周期 **`2.8s`**（~2.34s 静止稳态居中，0.45s 平滑滑移一个节距 `-18.46px` 交接）。
- **参数规格**：容器 `64 × 10px`，导轨高 `2px`（`#242D29`，`opacity: 0.2`）；节点外径 `10px`（内芯 `6px`，填充色 **`#b4d095`**，外边框 `2px #242D29`）；流起点 `left: -9.92px`，静止时第 3 节点圆心精确锁定在 `32px` 正中。

---

## 三、核心数字动态流转 (NumberFlow Odometer)

- **集成组件**：原生自定义元素 `<number-flow>`（驱动数字 `3` 与 `95%`）。
- **动效逻辑**：步骤 1~2 数值锁定为 0；步骤 3（Overview）展开时触发 `spinTiming: { duration: 950, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }` 自下而上滚轮旋转到位；Tab 切换或 Replay 时重播。

---

## 四、背景水印 ➔ 标题 Icon 共享元素形变 (Shared-Element Morph)

- **正向过渡 (Typing ➔ Searching)**：打字结束瞬间，280px 大水印（`opacity: 0.12`）平滑飞跃至标题插槽，位移中缩小 10 倍至 28px、透明度加深至 1.0（耗时 **`520ms`**），抵达后无缝交接给原生 flex 标题图标。
- **反向过渡 (Results ➔ Typing / Replay / Tab 切换)**：标题小图标沿相反轨迹向画布深处扩散膨胀回 280px 大水印（透明度淡回 0.12）。
- **残影清理 (Triple-Lock)**：WAAPI 显式 `cancel()` + 状态机清理 `display: none` + CSS `.has-results` 物理隔离隐藏。

---

## 五、Timeline Latest 标签与自动定位 (Timeline Latest & Auto-Positioning)

- **Latest 徽标规范**：时间轴正序末尾新闻展示 `<span class="timeline-latest-tag">latest</span>`（鲜亮突发橙 `#F97316`，纯白文字，`padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;`）。
- **Subjects 切换自动定位**：
  1. 点击横向胶囊切换 Subject 时，直接渲染全量卡片（免重复入场）；
  2. `requestAnimationFrame` 自动将容器 `scrollTop` 设为 `maxScroll`，瞬时精准锚定在底部带有 `latest` 标签的最新新闻；
  3. 立即解除滚动锁，允许用户向早前事件自由回溯。
