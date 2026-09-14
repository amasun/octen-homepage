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
   - `Built for AI` 左侧地球图标替换为 20x20 规范 SVG。
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

---

## 📂 代码架构分层说明
- **运行层**: 当前入口为根目录 [index.html](file:///x:/XCoding/Octen/hompage/index.html) + `public/_next/`，呈现 100% 完整原站动效与资产。
- **源码层**: `src/components/*.tsx` 为手写的高质量 React 18 + TS 组件，已预先准备好组件拆分。
- **样式配置**: 核心补丁位于 [index.html](file:///x:/XCoding/Octen/hompage/index.html) 顶部的 `<style id="octen-local-nav-width-fix">` 与 `public/_next/static/css/c4ae1de60afeb6c3.css`。
