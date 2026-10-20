# 竞品洞察工作台

Vite + React + TypeScript 单页 demo：输入 1–2 个竞品 → 可编辑对比表（≥5 维）→ 3 条带证据的机会假设（采纳/驳回）→ 导出 Markdown。

**无 API Key** 即可完整演示（默认读 `fixtures/demo-pack.json`）。

## 启动

```bash
cd /workspace/vibe-demos/competitor-insight-workbench
npm install
npm run dev
```

浏览器打开终端提示的本地地址（默认 `http://127.0.0.1:5173`）。

```bash
npm run build    # 生产构建
npm run preview  # 预览构建产物
```

## Fixture / 无 Key

| 路径 | 说明 |
|------|------|
| `fixtures/demo-pack.json` | **主演示数据**（AI 层契约） |
| `public/fixtures/demo-pack.json` | 运行时 fetch 兜底副本 |
| `schemas/opportunity-hypothesis.schema.json` | 机会卡 JSON Schema |
| `docs/ai/` | AI 层规格与降级策略 |

UI 入口：「生成洞察」（无 Key 灌 fixture 并模拟 1.2–2s 骨架）或「加载示例数据」。

机会卡字段：`title` / `summary` / `confidence: high|medium|low` / `evidence[{sourceLabel,quote,source_ref?}]` / `review`。

## 设计与致谢

- UI 对齐：`/workspace/design/竞品洞察工作台-设计规格.md`
- 概念参考：`/workspace/competitor-insight-agent`（Streamlit 本地竞品调研；非整文件复制）
- 证据链 / 人审闸门思路借鉴：[scout-product-intelligence](https://github.com/xintongli601/scout-product-intelligence)（MIT；本仓库为独立 Vite MVP，未引入 Convex/Firecrawl）

## MVP 范围

已实现：Intake、≥5 维可编辑对比表（增删下限 5）、3 机会卡+筛选+人审、MD 导出（未审完二次确认）、中文空/错态、设计色板与 Lucide 图标。

还缺：真实模型调用、设计精修/插画、移动端 TopBar「⋯」菜单、证据单元格高亮跳转、深色模式。

## 截图（可选）

```bash
npm run build && npm run preview -- --host 127.0.0.1 --port 4173
# 浏览器打开 http://127.0.0.1:4173 → 加载示例数据 → 截首屏
```
