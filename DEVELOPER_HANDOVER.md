# 📋 Octen 官网重点改动与交接说明

本文档专供接手本项目的开发者快速了解近期官网的核心改动与重点待办，按**页面从上到下的顺序**整理如下：

---

## 1. 顶部导航栏 (Navbar)
1. **去除下拉三角**：移除了展开菜单（Products / Developers）右侧的小三角箭头，界面更扁平简洁。
2. **产品菜单分组与命名规范**：
   - **Search · FAST**：Web Search, Broad Search
   - **Search · PREMIER**：News Search
   - **Models**：Embedding, VL Embedding, Model Gateway
   - **Tool**：Extract（修正原线上版本误标为第二个 Models 的问题，统一为单数 Tool）。
3. **图标与对齐**：统一了下拉菜单中各产品图标的尺寸（20px），文字基线居中。
4. **Developers 菜单**：优化了排版间距与外链跳转。

---

## 2. 全局胶囊标签规范 (Glass Tag Pills)
1. **移除前置图标**：去掉了各标签内多余的前置装饰小图标（如小圆点、雷达绿标等），统一为纯文本胶囊。
2. **深色背景磨砂玻璃质感**：
   - 统一高度 30px、圆角 24px、左右内边距 16px。
   - 采用半透明磨砂玻璃背景与微倒角双向内阴影高光，去除了生硬实线外边框，视觉更精致通透。
   - 覆盖范围：Web Search、News Search、Start Building 等所有深色背景区块。
3. **浅色卡片子标签**：统一高度 30px、圆角 19.5px 与浅色微描边，用于 API 架构子项。

---

## 3. Web Search 与 News Search 区块过渡
- **去除分割线**：去掉了 Web Search 与 News Search 两个大暗黑区块之间原有的浅色硬边界线，使页面渐变底色自然融合衔接。

---

## 4. News Search & Business Search 交互与 5 步动画（已完成移植与双 Tab 找回）
1. **底部间距收敛**：区块底部内边距统一缩减为 80px，板块过渡更紧凑。
2. **中央大卡片圆角**：交互舞台巨大卡片的圆角统一调整为 24px。
3. ✅ **双垂直搜索 Tab 栏（News Search / Business Search）**：
   - 舞台上方恢复毛玻璃双 Tab 胶囊切换栏（`[ News Search ]  [ Business Search ]`）；
   - 点击 Tab 实现主题色（青绿 vs 琥珀金）、背景水印、标题说明、Query 输入语句、统计数据及时间线内容完全动态切换。
4. ✅ **5 步时序动画全套移植**（源自 `vertical search/news-search-demo.html`）：
   - **步骤 1 (Typing)**：逐字输入查询语句（32ms/字）+ 光标呼吸停顿。
   - **步骤 2 (Searching)**：输入框通过 WAAPI FLIP 无缝平移至左上角，右侧展开 14 节点正弦波跳动动画。
   - **步骤 3 (Overview)**：左侧统计数字 odometer 翻滚（0 ➔ 4 主题 / 10 报道），右侧白卡依次滚动推入。
   - **步骤 4 (Focus)**：右侧 4 个总览大白卡通过动态绝对定位代理卡片，高保真形变融合为顶部 4 个横向药丸 Tab；下方 Top News 伴随弹簧缓动浮现。
   - **步骤 5 (Timeline Stream)**：事件时间线按时间顺序延展点亮，平滑自动滚动（4/5 卡片滚动居中），结尾平滑弹出 Replay 按钮。
   - **交互支持**：支持药丸 Tab 切换、鼠标悬浮暂停滚动、点击 Replay 重播完整时序。已通过 IntersectionObserver 实现视口滚动进入触发。

---

## 5. 多模态搜索 (原 Search Beyond Text)
1. **拆解为独立双列**：文案拆解为 Image Search 与 Video Search 两列独立结构。
2. **文字宽度锁定**：文案宽度严格限定为 500px，彻底解决线上版本拉伸至 592px 导致文字过长排版失调的问题。
3. **模块解耦**：已抽离为独立组件，方便随时热插拔或按需开启。

---

## 6. The Complete Retrieval Stack (原 More APIs 区块)
1. **去掉顶部标签**：移除了大标题上方多余的 More APIs / Beyond Search 标签。
2. **主标题强制换行**：标题改为换行显示（`The complete` 换行 `retrieval stack`）。
3. **每个子项增加标签**：
   - Embedding ➔ `Models`
   - VL Embedding ➔ `Models`
   - Model Gateway ➔ `Models`
   - Extract ➔ `Tool`
4. **子项排序调整**：将 Extract 整体下移至 Model Gateway 之后（排序为第 4 位），顶部 Sticky Tabs 顺序同步更新为：Embedding ➔ VL Embedding ➔ Model Gateway ➔ Extract。
5. **超大架构图抽离**：将 Model Gateway 中长达 1,300 行的静态复杂 SVG 抽离为独立子模块引入，极大减轻主模板代码体积。

---

## 7. 行动号召区 (Start Building)
- **标签升级**：将原简易线框标签升级为全站统一的磨砂玻璃微倒角胶囊标签，保持全站视觉一致性。

---

## 8. 底部导航与页脚 (Footer)
1. **Slogan 标语调整**：
   - 字号由原过大的 41.5px 调整为精致的 24px（Fraunces 衬线体）。
   - `Real-Time AI` 渐变色对齐 Figma 最新色值（草绿至亮纯绿平滑过渡）。
2. **Logo 尺寸修正**：修正为 Figma 官方比例 119.4px × 40.5px。
3. **导航分组间距对称**：双层导航列间距统一为 50px，左右两端达到视觉高度对称。
4. **认证徽章位置重构**：SOC 2® Type 2 认证徽章与隐私政策等链接组合居右对齐，与左侧版权信息呈水平对称分布。

---

## 🌐 预览地址
- **线上预览地址**：https://octen-homepage.vercel.app/
