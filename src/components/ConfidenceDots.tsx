import type { Confidence } from '../types';

const LABEL: Record<Confidence, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

const FILLED: Record<Confidence, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export function ConfidenceDots({ level }: { level: Confidence }) {
  const n = FILLED[level];
  return (
    <span className={`confidence confidence-${level}`} title={`置信度：${LABEL[level]}`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={i < n ? 'dot filled' : 'dot hollow'}
          aria-hidden
        />
      ))}
      <span className="confidence-label">{LABEL[level]}</span>
    </span>
  );
}
