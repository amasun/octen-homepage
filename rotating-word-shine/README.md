# rotating-word-shine

从 bonjour.bio/jobs-mapping 抽离的「轮播词 + 热成像彩色扫光」效果(原站为 React + three.js r185 + 可选 WebGPU HDR)。

- `shine-word.js` 核心:字形烘焙成纹理 → 每字一个 mesh → 片元着色器算光环/色散/调色板 → 两遍高斯 bloom
- `shine-word.css` 宿主样式(宽度过渡、fallback)
- `index.html` 演示(需本地服务器,ES module):`npx serve .` 或 `python3 -m http.server`

依赖:`three`(demo 用 importmap 引 unpkg;项目里 `pnpm add three` 后去掉 importmap 即可)。

## 约定
- 宿主 `<span>` 的 `font / color / line-height` 决定文字外观;词前用 ` ` 做间距(原站做法)
- 单行文本;未处理 letter-spacing
- 未实现 WebGPU HDR 过曝层(`rgba16float` + `toneMapping: extended`),仅 SDR;不影响观感主体
- `prefers-reduced-motion` 或无 WebGL 时回退为纯文本

## 关键参数(shine-word.js 顶部)
`SHINE_MS=3200` 扫光时长 · `SHINE_OVERLAP=500` 与入场重叠 · `stagger=11ms/字` · `holdMs=700` · `RISE=0.22` 入退场位移
调色板在 `thermalPalette()`,光环宽度在 `heatSweepAt()` 的 0.34/0.19/0.062。

## 配色
导出的 `PALETTES` 含 5 套(aurora / gold / emerald / rose / ice),每换一个词按序切换;可通过 `palettes` 选项传入自定义方案(6 个 RGB 色标,值可 >1 表示过曝)。金属质感在 `heatSweepAt()` 的 `bands` / `spec` 两行。
