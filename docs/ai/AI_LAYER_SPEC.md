# AI 能力层规格 — 竞品洞察工作台

**给谁看**：PM 口述「为什么这样设计」；前端对接机会卡字段。  
**设计依据**：`/workspace/design/竞品洞察工作台-设计规格.md`  
**落盘**：本仓库 `schemas/` · `fixtures/` · `docs/ai/`

---

## 为什么这样设计

1. **可解释**：每条机会强制带证据（标签 + 摘录 + 可解析 `source_ref`），避免「模型空话」。
2. **可演示**：无 Key 时用 `fixtures/demo-pack.json` 走通「输入 → 表 → 3 卡 → 采纳/驳回 → 导出」。
3. **人审闸门**：模型只能产出 `review=pending`；采纳/驳回是产品决策，不是模型结论。
4. **置信度产品化**：`high|medium|low` 对应设计稿三色点，规则写进提示词，面试能讲清。
5. **边界清楚**：只吃对比表；不爬虫、不写密钥进仓、失败可降级且不脏写入审列表。

---

## 输入 / 输出边界

| | 内容 |
| --- | --- |
| **输入** | Intake 竞品名（1–2）+ 可编辑对比表 `comparison`（≥5 维） |
| **模型输出** | JSON 数组，恰好 3 条 OpportunityHypothesis，`review=pending` |
| **前端状态** | 用户改 `review` → `accepted` / `rejected`（可改口） |
| **导出** | 对比表全文 + 仅 `accepted` 机会 |

### 机会卡字段（与设计规格一致）

| 字段 | 类型 | UI |
| --- | --- | --- |
| `title` | string ≤36 | 卡片标题 |
| `summary` | string ≤80 | 卡片正文 |
| `confidence` | `high`/`medium`/`low` | ConfidenceDots |
| `evidence[]` | `{ sourceLabel, quote, source_ref }` | EvidenceList |
| `review` | `pending`/`accepted`/`rejected` | 采纳 / 驳回 |

AI 扩展（可不进首屏）：`hypothesis`、`dimensions`、`rationale_short`、`created_at`。

### 与当前 `src/types` 的映射（脚手架尚为旧形）

| 设计 / AI schema | 现 `src/types` Hypothesis |
| --- | --- |
| `title` + `summary` | 可暂拼进 `statement`，建议改为设计字段 |
| `evidence[]` | 现为单字符串 `evidence`，建议改为数组 |
| `confidence` `high/medium/low` | 现为 `高/中/低`，建议枚举英文化并做展示映射 |
| `review` | 现字段名 `status`，语义相同 |

**建议前端**：以 `fixtures/demo-pack.json` + 本 schema 为契约，逐步替换 `src/data/fixture.ts`。

---

## 目录树

```
competitor-insight-workbench/
├── schemas/opportunity-hypothesis.schema.json
├── fixtures/demo-pack.json
├── docs/ai/
│   ├── AI_LAYER_SPEC.md          ← 本文件
│   ├── system-prompt.md
│   └── degradation.md
└── src/…                         ← 前端实现（类型迁移见上表）
```

---

## 对接点

1. **生成洞察**：有 Key → 调模型（system-prompt + comparison）；无 Key / Mock → 灌 `demo-pack.json`。
2. **机会列表**：渲染 3 卡；筛选全部/已采纳/已驳回。
3. **采纳 / 驳回**：只改 `review`，不改证据。
4. **加载示例数据**：显式入口，等同无 Key 路径。
5. **降级**：见 `degradation.md`；错态文案对齐设计规格 §3.7。

---

## Fixture 摘要（demo-pack）

- 竞品：Dify、FastGPT  
- 对比维：6（定位 / 用户 / 定价 / 能力 / 差异化 / 部署）  
- 机会 3 条：`opp_01` medium · `opp_02` medium · `opp_03` high；均 `review=pending`，`source_ref` 可解析  

---

*AI 层规格 v1 · 2026-10-21 · 模型应用工程师*
