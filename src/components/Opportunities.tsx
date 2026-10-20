import { Lightbulb } from 'lucide-react';
import type { OppFilter, Opportunity, ReviewStatus } from '../types';
import { OpportunityCard } from './OpportunityCard';

interface Props {
  items: Opportunity[];
  filter: OppFilter;
  onFilterChange: (f: OppFilter) => void;
  onReview: (id: string, review: ReviewStatus) => void;
}

export function Opportunities({ items, filter, onFilterChange, onReview }: Props) {
  const reviewed = items.filter((o) => o.review !== 'pending').length;
  const filtered =
    filter === 'all'
      ? items
      : items.filter((o) => o.review === filter);

  return (
    <section id="opportunities" className="card">
      <div className="section-head">
        <h2 className="section-title">
          <Lightbulb size={18} strokeWidth={2} aria-hidden />
          机会假设
        </h2>
        <div className="opp-toolbar">
          <span className="muted text-xs">
            已审 {reviewed}/{items.length}
          </span>
          <div className="filter-group" role="tablist" aria-label="筛选机会">
            {(
              [
                ['all', '全部'],
                ['accepted', '已采纳'],
                ['rejected', '已驳回'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={filter === key}
                className={`filter-chip${filter === key ? ' active' : ''}`}
                onClick={() => onFilterChange(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="muted empty-filter">没有符合筛选的机会</p>
      ) : (
        <div className="opp-stack">
          {filtered.map((item) => {
            const index = items.findIndex((o) => o.id === item.id);
            return (
              <OpportunityCard
                key={item.id}
                item={item}
                index={index}
                onReview={onReview}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
