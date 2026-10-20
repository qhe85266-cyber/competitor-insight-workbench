import type { InsightState } from '../types';

function escapeCell(text: string): string {
  return text.replace(/\r?\n/g, '<br>').replace(/\|/g, '\\|');
}

function dateStamp(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

export function exportFilename(data: InsightState): string {
  const a = (data.competitors[0]?.name || '竞品')
    .replace(/[^\w\u4e00-\u9fff-]+/g, '_')
    .slice(0, 24);
  return `竞品洞察-${a}-${dateStamp()}.md`;
}

export function buildMarkdown(data: InsightState): string {
  const a = data.competitors[0]?.name ?? 'A';
  const b = data.competitors[1]?.name ?? '你方';
  const lines: string[] = [];
  lines.push(`# 竞品洞察：${a} vs ${b}`);
  lines.push('');
  lines.push(
    `> 主题：${data.topic || '（未命名）'} · 导出时间 ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}（Asia/Shanghai）`,
  );
  lines.push('');
  lines.push('## 对比表');
  lines.push('');
  const header = ['维度', ...data.competitors.map((c) => c.name)];
  lines.push(`| ${header.join(' | ')} |`);
  lines.push(`| ${header.map(() => '---').join(' | ')} |`);
  for (const dim of data.dimensions) {
    const row = [
      escapeCell(dim.name),
      ...data.competitors.map((c) =>
        escapeCell(data.cells[dim.id]?.[c.id] ?? ''),
      ),
    ];
    lines.push(`| ${row.join(' | ')} |`);
  }
  lines.push('');

  const accepted = data.opportunities.filter((o) => o.review === 'accepted');
  const rejected = data.opportunities.filter((o) => o.review === 'rejected');

  lines.push('## 已采纳机会');
  lines.push('');
  if (accepted.length === 0) {
    lines.push('_暂无已采纳机会_');
    lines.push('');
  } else {
    accepted.forEach((o, i) => {
      lines.push(`### ${i + 1}. ${o.title}`);
      lines.push('');
      lines.push(o.summary);
      lines.push('');
      lines.push(`- **置信度**：${o.confidence}`);
      for (const e of o.evidence) {
        const ref = e.source_ref ? ` \`${e.source_ref}\`` : '';
        lines.push(`- **证据（${e.sourceLabel}）**${ref}：${e.quote}`);
      }
      lines.push('');
    });
  }

  if (rejected.length > 0) {
    lines.push('## 已驳回（附录）');
    lines.push('');
    rejected.forEach((o, i) => {
      lines.push(`${i + 1}. ~~${o.title}~~`);
    });
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('_本文件为演示导出，证据需人工复核；不构成采购建议。_');
  lines.push('');
  return lines.join('\n');
}

export function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
