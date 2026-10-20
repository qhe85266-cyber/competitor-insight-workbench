import { Check, X } from 'lucide-react';
import type { Opportunity, ReviewStatus } from '../types';
import { ConfidenceDots } from './ConfidenceDots';

interface Props {
  item: Opportunity;
  index: number;
  onReview: (id: string, review: ReviewStatus) => void;
}

export function OpportunityCard({ item, index, onReview }: Props) {
  return (
    <article className={`opp-card review-${item.review}`}>
      <div className="opp-meta">
        <span className="opp-tag">机会 · #{String(index + 1).padStart(2, '0')}</span>
        <ConfidenceDots level={item.confidence} />
      </div>
      <h3 className={`opp-title${item.review === 'rejected' ? ' struck' : ''}`}>
        {item.title}
      </h3>
      <p className="opp-summary">{item.summary}</p>
      <ul className="evidence-list">
        {item.evidence.map((e, i) => (
          <li key={i}>
            <span className="evidence-source">{e.sourceLabel}</span>
            <span className="evidence-quote">{e.quote}</span>
          </li>
        ))}
      </ul>
      <div className="opp-actions">
        <button
          type="button"
          className={item.review === 'rejected' ? 'btn danger sm' : 'btn ghost sm'}
          onClick={() => onReview(item.id, 'rejected')}
        >
          <X size={14} aria-hidden />
          {item.review === 'rejected' ? '已驳回' : '驳回'}
        </button>
        <button
          type="button"
          className={item.review === 'accepted' ? 'btn primary sm' : 'btn secondary sm'}
          onClick={() => onReview(item.id, 'accepted')}
        >
          <Check size={14} aria-hidden />
          {item.review === 'accepted' ? '已采纳' : '采纳'}
        </button>
      </div>
    </article>
  );
}
