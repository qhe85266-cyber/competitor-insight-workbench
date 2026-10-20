/** 与 schemas/opportunity-hypothesis.schema.json + 设计规格对齐 */

export type Confidence = 'high' | 'medium' | 'low';
export type ReviewStatus = 'pending' | 'accepted' | 'rejected';
export type AppPhase = 'idle' | 'loading' | 'ready' | 'error' | 'exported';
export type OppFilter = 'all' | 'accepted' | 'rejected';

export interface EvidenceItem {
  sourceLabel: string;
  quote: string;
  source_ref?: string;
  competitor_id?: string;
  dimension_id?: string;
}

export interface Competitor {
  id: string;
  name: string;
  sourceUrls?: string[];
  /** 单竞品时的「你方」占位列 */
  isSelf?: boolean;
}

export interface Dimension {
  id: string;
  name: string;
}

/** cells[dimensionId][competitorId] */
export type ComparisonCells = Record<string, Record<string, string>>;

export interface Opportunity {
  id: string;
  title: string;
  summary: string;
  confidence: Confidence;
  evidence: EvidenceItem[];
  review: ReviewStatus;
  dimensions?: string[];
  hypothesis?: string;
  rationale_short?: string;
  created_at?: string;
}

export interface InsightState {
  topic: string;
  competitors: Competitor[];
  dimensions: Dimension[];
  cells: ComparisonCells;
  opportunities: Opportunity[];
  dirty: boolean;
}

export interface IntakeForm {
  competitorA: string;
  competitorB: string;
  noteUrl: string;
}

/** fixtures/demo-pack.json 原始形状 */
export interface DemoPackRaw {
  meta: {
    fixture_version: string;
    demo_mode: boolean;
    topic: string;
    locale?: string;
    source_note?: string;
    aligned_with?: string;
  };
  competitors: Array<{
    id: string;
    name: string;
    sourceUrls?: string[];
  }>;
  comparison: {
    dimensions: Dimension[];
    cells: ComparisonCells;
  };
  opportunities: Opportunity[];
}
