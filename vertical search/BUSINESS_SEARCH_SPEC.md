# Business Search 架构与结构性差异规范 (Business Search Spec)

> 💡 **文档定位**：本文档梳理 Octen **Business Search** 的核心数据模型、控制台交互架构，并深度对比其与 **News Search** 的结构性差异，作为控制台端点实现与主页交互移植的权威规范。

---

## 1. 核心定位与业务范式差异

| 维度 | News Search (新闻垂直搜索) | Business Search (商业垂直搜索) |
| :--- | :--- | :--- |
| **设计核心** | **事件驱动（Event-Driven Storyline）** | **实体为中心（Entity-Centric Intelligence）** |
| **核心抓手** | 时间轴与事件进展（突发/地缘/行业宏观动态） | 商业实体深度画像（企业财务、高管履历、官方动向） |
| **典型查询 (Query)** | `Strait of Hormuz shipping disruptions`（霍尔木兹海峡局势） | `Coupang 近况与经营指标`、`Bom Kim background career` |
| **产出形态** | 时序聚合的新闻专题（Subjects）与时间线（Timeline） | **结构化实体档案（Entities）** + **网页级权威检索（Results）** |

---

## 2. 顶层数据拓扑与 Schema 对比

### 2.1 News Search 数据结构
- 单层树形聚合结构：
  ```json
  {
    "query": "Strait of Hormuz shipping disruptions",
    "subjects": [
      {
        "name": "Saudi Arabia halts East-West pipeline after drone attacks...",
        "summary": "...",
        "timeStart": "2026-09-11T00:00:00Z",
        "timeLatest": "2026-09-15T21:40:00Z",
        "cover": "/images/vertical/subject-1.png",
        "articles": [
          { "title": "...", "timePublished": "...", "url": "..." }
        ]
      }
    ]
  }
  ```

### 2.2 Business Search 数据结构
- **双层复合结构（Entities + Results）**：
  ```json
  {
    "data": {
      "query": "Coupang 近况与经营指标",
      "entities": [
        {
          "type": "company",
          "name": "Coupang, Inc.",
          "aliases": ["쿠팡", "Coupang"],
          "identifiers": {
            "website": "aboutcoupang.com",
            "linkedin_url": "https://www.linkedin.com/company/coupang",
            "stock_ticker": "NYSE:CPNG",
            "sec_cik": "0001834584"
          },
          "attributes": {
            "industry": "E-commerce",
            "hq_country": "US",
            "founded_year": 2010,
            "employee_range": "10,001+"
          },
          "metrics": {
            "stock": { "price": 14.29, "todays_change_percent": -1.18, "week_52_high": 34.08, "week_52_low": 14.15, "currency": "USD" },
            "financials": { "revenue": 8900000000, "net_income": -570000000, "currency": "USD", "period": "2026Q2" },
            "funding": { "valuation": 9000000000, "total_funding": 3400000000, "currency": "USD" },
            "web_traffic": { "visits_monthly": 288090220, "rank": 5 }
          },
          "key_people": [
            { "name": "Bom Kim", "title": "Founder & CEO" }
          ],
          "activities": [ ... ],
          "news": [ ... ]
        },
        {
          "type": "person",
          "name": "Bom Kim",
          "summary": "...",
          "current_position": { "title": "Founder & CEO", "organization": "Coupang, Inc." },
          "career": [
            { "organization": "Coupang, Inc.", "title": "Founder & CEO", "start": "2010", "end": null }
          ],
          "activities": [ ... ],
          "news": [ ... ]
        }
      ],
      "results": [
        {
          "title": "Coupang Announces Results for Second Quarter 2026",
          "url": "https://ir.aboutcoupang.com/...",
          "authority": "high",
          "highlight": "..."
        }
      ]
    }
  }
  ```

---

## 3. 实体卡片模型系统（Company vs Person）

### 3.1 Company（公司卡片）
1. **身份标牌**：Logo、公司名称、别名库（Aliases）、Company 标签、官网、LinkedIn、股票代码（Ticker）、SEC CIK 编号；
2. **企业硬属性**：Summary、所属行业（Industry）、总部国家（HQ Country）、创立年份（Founded Year）、员工规模（Employee Range）；
3. **核心金融指标看板（Financial & Market Metrics）**：
   - **实时股价行**：最新价格、当日涨跌幅、**52 周高低位滑轨（52-week High/Low Range，直观查看当前估值所处区间）**；
   - **季度财报指标**：营收（Revenue）、净利润（Net Income），严格对应原币种；
   - **投融资与估值**：估值（Valuation）、总融资额（Total Funding）、轮次及披露日期；
   - **数字化指标**：月均访问量（Monthly Visits）、国家排名（Rank）；
4. **管理层核心人物（Key People）**：创始人、CEO、CFO 等关键高管名单。

### 3.2 Person（人物卡片）
1. **个人身份标牌**：头像照片、人名、Person 标签、当前职位（Current Position）、任职组织、LinkedIn 链接；
2. **生平简介**：Bio Summary 综合摘要；
3. **职业生涯履历（Career Timeline）**：起止时间、历史就职单位、历任职位列表。

---

## 4. 关键认知与交互哲学：Activities vs News 双轨分流

在公司与人物实体内部，动态事件被严格拆分为两轨，这是与 News Search 最本质的设计差异：

```
┌─────────────────────────────────────────────────────────────┐
│                    实体内部动态双轨组织                     │
├──────────────────────────────┬──────────────────────────────┤
│ 1. Activities (官方一手事记) │ 2. News (第三方媒体报道)     │
├──────────────────────────────┼──────────────────────────────┤
│ • 发起方：企业/当事人自主发声│ • 发起方：各家独立媒体外部报道│
│ • 内容：财报/公告/人事/扩产  │ • 内容：行业分析/观点/新闻速报│
│ • 特征：前后具有严格因果关联 │ • 特征：各家平行发声，无因果 │
│ • 形态：【垂直时间线 Timeline】│ • 形态：【平铺列表 List】     │
└──────────────────────────────┴──────────────────────────────┘
```

> **设计依据**：
> - **Activities** 是一件事接一件事的演变（例如：7月宣布扩建 ➔ 8月竣工 ➔ 9月上线投产），画成时间线能够让用户理解因果脉络；
> - **News** 是彭博、路透、华尔街日报各自撰写同一时段的报道，先后次序不构成因果。若也画成时间线，只会让人误以为是一连串因果事件或重复报道，因此退回朴素时间戳列表。

---

## 5. 控制台入参控制与实体感知 (Entity-Aware)

1. **入参控制群**：
   - `entities` 开关（`entitiesEnabled`）：控制是否在检索同时执行大模型/知识图谱实体抽取；
   - `count`（实体数）：控制抽取的最大实体数量（默认 2）；
   - `max_activities`：每个实体下提取一手事件上限（默认 5）；
   - `max_news`：每个实体下提取媒体报道上限（默认 5）。
2. **实体感知与空状态保证**：
   - 实体是从 Query 语义中真实识别出来的，不是硬凑生成的；
   - 若查询词为通用宏观词（与收录实体库无关），`entities` 将严格返回空数组 `[]`，前端仅呈现 `Results` 列表，绝不拼凑虚假公司卡片。

---

## 6. 对官网主页巨幅卡片 (Section 05) 的移植指导

主页 `vertical search` 包含 `News Search` 与 `Business Search` 两个 Tab：
- **News 态**：体现“事件追踪”，核心动效为：`1. Typing` ➔ `2. Searching` ➔ `3. Overview (4张Subject卡片流式堆叠)` ➔ `4. Top Focus` ➔ `5. Timeline`；
- **Business 态**：体现“商业实体深度画像与手风琴折叠展开”：
  - **1. Typing**：输入 `Coupang company overview and financial metrics`；
  - **2. Searching**：输入框收缩为左上胶囊，右侧呈现正弦波搜索状态；
  - **3. Company Detail (公司卡片详细态展开、从上到下流式显现与超屏自动滚动)**：
    - 上方 Company 卡片完全展开（锁定 `height: 472px`，平移 `translateY(-14.5px)`，上下对称各留白 30px），内容采用 **从上到下逐级流式展开（Progressive Flow）**：
      - 头部标牌（Logo + 标题 + Company 蓝标 + 股票/官网/LinkedIn 三联图标）；
      - 完整简介 Bio 展开呈现；
      - 3x2 财务核心指标网格（Stock Price $14.29 -1.18%, 52W High $34.08, 52W Low $14.15, Revenue $8.9B, Net Income -$570M, Valuation $9B）；
      - **Key People**：两枚人员胶囊（Bom Kim · Founder & CEO、Gaurav Anand · CFO）滑入；
      - **Official Activities**：3 条一手动态垂直时间线（圆点脉冲发光 + 连线顺流延展 + 时间戳 + `latest` 橙标 + 来源域名），逐条流式显现；
      - **Media News**：3 条权威媒体报道垂直时间线（Barrons.com、Fool.com、MaeilBusiness.com），逐条流式显现；
      - **超屏自动跟随滚动 (Auto-Scroll)**：当后续流入的内容超出 472px 卡片可视视口时，滚动容器以 `0.34s` 曲线平滑向下自动滚动至新生成条目，让用户实时追踪最新生成的动态内容；
      - 展开态下彻底隐藏底部横条把手；
    - **非激活 Person 卡片保留 Overview 概览形态被挤出屏幕**：
      - 保持其完整的 Overview 概览卡片形态（高 135px）；
      - 伴随 Company 卡片的展开，以 `transform: translateY(220px) scale(0.96)` 顺滑向下被推挤出画布视口边界，同时伴随景深虚化与渐隐（`opacity: 0`, `filter: blur(3px)`），完全移出屏幕视野；
    - **自动衔接流转**：当 Company 卡片全部信息流式呈现完毕后，自动无缝触发步骤 4（Person Detail）的人物卡片生成流。
  - **4. Person Detail (人物卡片详细态升起、流式生成与超屏自动滚动)**：
    - 下方 Person 卡片完全展开（严格锁定 `height: 472px`，以 `translateY(-322.5px)` 顺滑移至画布视口顶端，保持上下对称各 30px 留白，无阴影），采用与步骤 3 相同的 **从上到下流式生成与超屏自动滚动逻辑**，像素级对齐 Figma `13810:169958`：
      - 头部标牌（圆头像 + 标题 + Person 橙标 + 职位/LinkedIn 链接）；
      - 完整生平 Bio 展开呈现；
      - **Career**：3 条职业履历时间线（2010–Present Coupang、2006–2008 02138 Magazine、2005–2006 BCG）逐条流式生成，翡翠绿圆点伴随脉冲激活；
      - **Activities**：2 条官方一手动态时间线逐条流式流入；
      - **News**：2 条媒体报道时间线逐条流式流入；
      - **超屏自动跟随滚动 (Auto-Scroll)**：内容溢出卡片下边缘时，容器平滑向下自动滚动，将视口锁定在当前生成的新行；
      - 展开态下彻底隐藏底部横条把手；
    - **非激活 Company 卡片保留 Overview 概览形态被挤出屏幕**：
      - 保持其完整的 Overview 概览卡片形态（高 304px，精确对齐 Figma `13802:167548`）；
      - 伴随 Person 卡片的升起展开，以 `transform: translateY(-380px) scale(0.96)` 顺滑向上被推挤出画布视口上边界，伴随景深虚化渐隐（`opacity: 0`, `filter: blur(3px)`），完全移出屏幕视野；
    - **自动转入 Overview**：当 Person 卡片信息流式呈现完后，自动平滑转入步骤 5（Overview）。
  - **5. Overview (概览收缩归宿与全域交互态 - Figma 13802:167547 像素级规范)**：
    - 两张卡片以 `0.46s cubic-bezier(0.16, 1, 0.3, 1)` 曲线平滑归位至紧凑 Overview 双卡堆叠态（Company 304px + Person 135px，间距 4px，上下留白严格对称各 44.5px，总高 `44.5 + 304 + 4 + 135 + 44.5 = 532px` 完美贴合画布，单屏完整显示无任何滚动条）：
      - **Company 卡片内部高度与内边距配比** (总高 304px / 303.77px)：
        - 内边距严格遵循 `padding: 16px 16px 12px 16px;`（上 16px、右 16px、下 12px、左 16px，外加 8px 半透明描边）；
        - Header 44px + 间距 12px + 2行 Bio 34px + 间距 12px + Stats Grid 108px + 间距 6px + Activity Bar 43px = 内容区 259px；
        - 底部把手 4.77px + 下边距留白 12px；
        - 内部概览内容区高度精确等于可视区高度，0 溢出无内部纵向滚动。
      - **Person 卡片内部高度与内边距配比** (总高 135px / 134.77px)：
        - 内边距严格遵循 `padding: 16px 16px 12px 16px;`（上 16px、右 16px、下 12px、左 16px，外加 8px 半透明描边）；
        - Header 44px + 间距 12px + 2行 Bio 34px = 内容区 90px；
        - 底部把手 4.77px + 下边距留白 12px；
        - 内部概览内容区高度精确等于可视区高度，0 溢出无内部纵向滚动。
    - 底部操作把手重新显示，引导用户交互；
    - **Hover 互斥推挤动效 (Hover-to-Expand & Push-to-Dismiss)**：
      - 鼠标悬浮 Company 卡片时，激活完全相同的推挤动效：Company 伸展至 472px（`translateY(-14.5px)`，上下留白各为 30px），Person 保持 Overview 形态被向下推挤出屏幕（`translateY(220px) scale(0.96)`）；
      - 鼠标悬浮 Person 卡片时：Person 升起并伸展至 472px（`translateY(-322.5px)`，上下留白各为 30px），Company 保持 Overview 形态被向上推挤出屏幕（`translateY(-380px) scale(0.96)`）；
      - 鼠标移开后：平滑恢复为双 Overview 卡片；
      - 统一卡片渲染与空间变换架构，Stage 3、4、5 使用同一套 DOM 与连续动画机制，消灭跳变。
      - **尺寸与间距硬约束**：展开后的卡片锁定高度为 **472px**，最外层容器（Canvas，高度 532px）上下留白各严格为 **30px**（`532 - 472 = 60px`，上下间距严格对称各 30px）；
      - **底部横条智能隐藏**：当卡片处于展开态时，自动彻底隐藏底部的横条（操作把手 `.biz-figma-handle-wrap`），消除多余视觉干扰；仅在紧凑态下展示横条作为 Hover/展开的视觉引导；
      - 移开鼠标后：两张卡片以 `0.46s cubic-bezier(0.16, 1, 0.3, 1)` 曲线无缝恢复为双紧凑概览卡片（304px 与 135px，加 4px 间距，完美单屏容纳于 532px 高度内）；
      - 全过程使用 GPU 硬件加速的 `transform` + `opacity` 动画，彻底消除布局生硬跳变感；
      - **全域无死角触发展开 (Zero-Deadzone Hover)**：在 Overview 阶段，Company 与 Person 卡片内部所有子卡片/子区域（股价核心指标区 `.biz-figma-stats-grid`、单项指标 `.biz-figma-stat-cell`、最新动态条 `.biz-figma-activity-bar`、标牌及链接群）均具备直接事件感知与 CSS `:has()` 双重保障，且严格隔绝了 Stage 3/4 历史手风琴层（`display: none !important; pointer-events: none !important`），确保鼠标无论滑入卡片主体还是子卡片/指标区任意像素，均能瞬时顺滑引起卡片展开与互斥推挤。

### 7. 全局时间轴节点与间距规范 (Figma 13810:169898 标准)
- **应用范围**：Business Search 所有时间轴组件（Company 详情及 Overview 展开态的 Official Activities / Media News、Person 详情及 Overview 展开态的 Career / Activities / News）：
  1. **节点样式 (Timeline Dot Node)**：
     - 内径：`8px`，背景色：`#4AAC80`（翡翠绿，对齐 Figma 设计稿 SVG `Ellipse 3718` 原型）；
     - 外圈：`2px solid #FFFFFF`（白色描边），外径为 `12px`；
     - 投影：去掉生硬的外阴影圈，保持干净利落的视觉呈现；
     - 垂直对齐：与时间/日期标题行（20px 高度）保持严格的亚像素级垂直居中（`deltaY === 0`）。
  2. **连线样式 (Connecting Spine Line)**：
     - 宽度：`4px`，背景色：`rgba(146, 146, 146, 0.5)`（对齐 Figma `timeline-pre` SVG 原型）；
     - 起止控制：精准从首个圆点中心起始，止于末个圆点中心，末个节点下方绝不产生多余外露延伸线。
  3. **间距与版心布局 (Spacing & Gutters)**：
     - 左侧轴心区域宽度固定为 `42px`，竖线与圆点水平绝对居中于 `21px` 处；
     - 事件内容起始对齐线距左侧 `42px`，事件行垂直间距收紧为标准的 `4px`；
     - 内部日期与 `latest` 标签间距为 `10px`，来源域名向右端对齐；
     - Career 履历行锁定 `32px` 标准行高，实现日期、职位、机构与左侧时间节点的水平零偏差对齐。
  4. **事件悬浮交互 (Event Row Hover Background)**：
     - 鼠标悬浮在时间轴上的单条事件（Official Activities、Media News、Career、Activities、News）时，事件区域呈现优雅细腻的背景色微变化；
     - 采用非侵入式 `::after` 伪元素定位（`top: 1px; bottom: 1px; left: -8px; right: -4px; border-radius: 6px;`），与左侧绿圆点保持严格 7px 安全净距，绝不触碰或挤压连线与圆点，零布局抖动（0 CLS）；
     - 悬浮背景色：`rgba(0, 0, 0, 0.045)`（自然融合于 `#F2F2F2` 底卡上的轻柔微灰）；
     - 过渡曲线：`0.18s cubic-bezier(0.16, 1, 0.3, 1)`，鼠标指针呈 `cursor: pointer`，提供清脆舒适的交互反馈。


