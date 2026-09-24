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
  - **3. Company Detail**：
    - 上方 Company 卡片展开（`max-height: 414px`），展示 Coupang 核心财务指标（股价/52周轨/营收）与一手动态看板；
    - 下方 Person 卡片折叠收起（高度 ~52px，展示 Bom Kim 头像与标牌），支持点击快速展开；
  - **4. Person Detail**：
    - 上方 Company 卡片平滑收起至折叠态（高度 ~58px，露出最新动态与把手 `—`）；
    - 下方 Person 卡片完全展开（`max-height: 414px`），展示 Bom Kim 生平、Career 职业发展轨与 Activities 官方动态；
  - **5. Overview (概览收缩态)**：
    - 两张详情卡片完成流式呈现后，整体平滑收缩归宿为两张紧凑 Overview 概览卡片（4px 垂直间距，两行文本截断，无滚动条）。
