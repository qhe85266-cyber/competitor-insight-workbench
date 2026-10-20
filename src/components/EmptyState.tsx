import { GitCompare } from 'lucide-react';

interface Props {
  onLoadDemo: () => void;
}

export function EmptyState({ onLoadDemo }: Props) {
  return (
    <div className="empty-panel" id="empty">
      <div className="empty-icon" aria-hidden>
        <GitCompare size={48} strokeWidth={1.5} />
      </div>
      <h2 className="empty-title">还没有洞察</h2>
      <p className="empty-desc">
        输入 1–2 个竞品，生成可编辑对比表和 3 条带证据的机会假设。
      </p>
      <button type="button" className="btn ghost" onClick={onLoadDemo}>
        加载示例数据
      </button>
    </div>
  );
}
