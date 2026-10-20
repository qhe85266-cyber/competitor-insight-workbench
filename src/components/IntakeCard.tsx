import { Loader2, Sparkles } from 'lucide-react';
import type { IntakeForm } from '../types';

interface Props {
  form: IntakeForm;
  loading: boolean;
  hasInsight: boolean;
  fieldError?: string;
  onChange: (patch: Partial<IntakeForm>) => void;
  onGenerate: () => void;
  onLoadDemo: () => void;
}

export function IntakeCard({
  form,
  loading,
  hasInsight,
  fieldError,
  onChange,
  onGenerate,
  onLoadDemo,
}: Props) {
  return (
    <section id="intake" className="card intake-card">
      <h2 className="section-title">输入竞品</h2>
      <div className="intake-grid">
        <label className="field">
          <span className="field-label">
            竞品 A <em className="req">必填</em>
          </span>
          <input
            className={`text-input${fieldError ? ' invalid' : ''}`}
            value={form.competitorA}
            disabled={loading}
            placeholder="例如：Notion"
            onChange={(e) => onChange({ competitorA: e.target.value })}
          />
          {fieldError ? <span className="field-error">{fieldError}</span> : null}
        </label>
        <label className="field">
          <span className="field-label">竞品 B · 选填</span>
          <input
            className="text-input"
            value={form.competitorB}
            disabled={loading}
            placeholder="可选：第二个竞品"
            onChange={(e) => onChange({ competitorB: e.target.value })}
          />
        </label>
        <label className="field field-wide">
          <span className="field-label">备注 URL · 选填</span>
          <input
            className="text-input"
            value={form.noteUrl}
            disabled={loading}
            placeholder="官网或产品页，仅作展示"
            onChange={(e) => onChange({ noteUrl: e.target.value })}
          />
        </label>
      </div>
      <div className="intake-actions">
        <button
          type="button"
          className="btn primary"
          disabled={loading}
          onClick={onGenerate}
        >
          {loading ? (
            <Loader2 size={16} className="spin" aria-hidden />
          ) : (
            <Sparkles size={16} aria-hidden />
          )}
          {hasInsight ? '重新生成' : '生成洞察'}
        </button>
        <button
          type="button"
          className="btn ghost"
          disabled={loading}
          onClick={onLoadDemo}
        >
          加载示例数据
        </button>
      </div>
    </section>
  );
}
