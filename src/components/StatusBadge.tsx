import type { AppPhase } from '../types';

const LABEL: Record<AppPhase, string> = {
  idle: '未开始',
  loading: '生成中',
  ready: '待审阅',
  error: '出错',
  exported: '已导出',
};

export function StatusBadge({ phase }: { phase: AppPhase }) {
  return (
    <span className={`status-badge phase-${phase}`} aria-live="polite">
      <span className="status-dot" aria-hidden />
      {LABEL[phase]}
    </span>
  );
}
