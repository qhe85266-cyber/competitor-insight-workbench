import { useCallback, useMemo, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { CompareTable } from './components/CompareTable';
import { EmptyState } from './components/EmptyState';
import { InlineAlert } from './components/InlineAlert';
import { IntakeCard } from './components/IntakeCard';
import { Opportunities } from './components/Opportunities';
import { SkeletonBlock } from './components/Skeleton';
import { StatusBadge } from './components/StatusBadge';
import { Toast, type ToastState } from './components/Toast';
import {
  defaultDimensions,
  generateFromFixture,
  loadDemoPack,
  sleep,
} from './lib/demoPack';
import { buildMarkdown, downloadMarkdown, exportFilename } from './lib/exportMd';
import type {
  AppPhase,
  InsightState,
  IntakeForm,
  OppFilter,
  ReviewStatus,
} from './types';

const emptyForm: IntakeForm = {
  competitorA: '',
  competitorB: '',
  noteUrl: '',
};

export default function App() {
  const [form, setForm] = useState<IntakeForm>(emptyForm);
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [phase, setPhase] = useState<AppPhase>('idle');
  const [insight, setInsight] = useState<InsightState | null>(null);
  const [filter, setFilter] = useState<OppFilter>('all');
  const [toast, setToast] = useState<ToastState | null>(null);
  const [exporting, setExporting] = useState(false);

  const closeToast = useCallback(() => setToast(null), []);

  const showToast = useCallback((t: Omit<ToastState, 'id'>) => {
    setToast({ ...t, id: Date.now() });
  }, []);

  const patchForm = (patch: Partial<IntakeForm>) => {
    setForm((f) => ({ ...f, ...patch }));
    setFieldError(undefined);
  };

  const runGenerate = async (mode: 'generate' | 'demo') => {
    if (mode === 'generate' && !form.competitorA.trim()) {
      setFieldError('请先填写竞品 A');
      return;
    }
    setAlertMsg(null);
    setFieldError(undefined);
    setPhase('loading');
    try {
      // 设计规格：骨架 1.2–2s（fixture 模拟延迟）
      const delay = 1200 + Math.floor(Math.random() * 800);
      const [data] = await Promise.all([
        mode === 'demo'
          ? loadDemoPack()
          : generateFromFixture(form.competitorA, form.competitorB),
        sleep(delay),
      ]);
      if (mode === 'demo') {
        setForm({
          competitorA: data.competitors[0]?.name ?? 'Dify',
          competitorB: data.competitors[1]?.name ?? 'FastGPT',
          noteUrl: data.competitors[0]?.sourceUrls?.[0] ?? '',
        });
      }
      setInsight(data);
      setFilter('all');
      setPhase('ready');
    } catch {
      setPhase('error');
      setAlertMsg('示例数据未就绪，请检查 fixture 或点击重试。');
    }
  };

  const onExport = async () => {
    if (!insight) {
      showToast({ kind: 'error', message: '暂无可导出的内容，请先生成洞察。' });
      return;
    }
    const pending = insight.opportunities.some((o) => o.review === 'pending');
    if (pending) {
      showToast({
        kind: 'confirm',
        message: '仍有未审阅机会，确定导出？',
        confirmLabel: '确定导出',
        onConfirm: () => void doExport(),
      });
      return;
    }
    await doExport();
  };

  const doExport = async () => {
    if (!insight) return;
    setExporting(true);
    await sleep(300);
    downloadMarkdown(exportFilename(insight), buildMarkdown(insight));
    setExporting(false);
    setPhase('exported');
    showToast({ kind: 'success', message: '已下载' });
  };

  const setReview = (id: string, review: ReviewStatus) => {
    setInsight((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        opportunities: prev.opportunities.map((o) =>
          o.id === id ? { ...o, review } : o,
        ),
      };
    });
    setPhase((p) => (p === 'exported' ? 'ready' : p));
  };

  const markDirty = () =>
    setInsight((prev) => (prev ? { ...prev, dirty: true } : prev));

  const statusPhase: AppPhase = useMemo(() => {
    if (phase === 'loading' || phase === 'error' || phase === 'idle') return phase;
    if (phase === 'exported') return 'exported';
    return 'ready';
  }, [phase]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-left">
          <div>
            <h1 className="app-title">竞品洞察工作台</h1>
            <p className="app-sub">简历 Demo · Fixture 数据</p>
          </div>
          <StatusBadge phase={statusPhase} />
        </div>
        <button
          type="button"
          id="export"
          className="btn primary"
          disabled={!insight || phase === 'loading' || exporting}
          onClick={() => void onExport()}
        >
          {exporting ? (
            <Loader2 size={16} className="spin" aria-hidden />
          ) : (
            <Download size={16} aria-hidden />
          )}
          导出 Markdown
        </button>
      </header>

      <main className="main">
        <IntakeCard
          form={form}
          loading={phase === 'loading'}
          hasInsight={!!insight}
          fieldError={fieldError}
          onChange={patchForm}
          onGenerate={() => void runGenerate('generate')}
          onLoadDemo={() => void runGenerate('demo')}
        />

        {alertMsg ? (
          <InlineAlert
            message={alertMsg}
            onRetry={() => void runGenerate('demo')}
            onClose={() => setAlertMsg(null)}
          />
        ) : null}

        {phase === 'loading' ? <SkeletonBlock /> : null}

        {phase !== 'loading' && !insight ? (
          <EmptyState onLoadDemo={() => void runGenerate('demo')} />
        ) : null}

        {phase !== 'loading' && insight ? (
          <>
            <CompareTable
              competitors={insight.competitors}
              dimensions={insight.dimensions}
              cells={insight.cells}
              dirty={insight.dirty}
              onDimNameChange={(id, name) => {
                markDirty();
                setInsight((prev) =>
                  prev
                    ? {
                        ...prev,
                        dimensions: prev.dimensions.map((d) =>
                          d.id === id ? { ...d, name } : d,
                        ),
                      }
                    : prev,
                );
              }}
              onColNameChange={(id, name) => {
                markDirty();
                setInsight((prev) =>
                  prev
                    ? {
                        ...prev,
                        competitors: prev.competitors.map((c) =>
                          c.id === id ? { ...c, name } : c,
                        ),
                      }
                    : prev,
                );
              }}
              onCellChange={(dimId, colId, value) => {
                markDirty();
                setInsight((prev) => {
                  if (!prev) return prev;
                  const row = { ...(prev.cells[dimId] ?? {}), [colId]: value };
                  return {
                    ...prev,
                    cells: { ...prev.cells, [dimId]: row },
                  };
                });
              }}
              onAddDimension={() => {
                markDirty();
                setInsight((prev) => {
                  if (!prev) return prev;
                  const id = `dim-${Date.now()}`;
                  const cells = { ...prev.cells, [id]: {} as Record<string, string> };
                  for (const c of prev.competitors) {
                    cells[id][c.id] = '';
                  }
                  return {
                    ...prev,
                    dimensions: [
                      ...prev.dimensions,
                      { id, name: '新维度' },
                    ],
                    cells,
                  };
                });
              }}
              onRemoveDimension={(id) => {
                setInsight((prev) => {
                  if (!prev || prev.dimensions.length <= 5) return prev;
                  markDirty();
                  const rest = { ...prev.cells };
                  delete rest[id];
                  return {
                    ...prev,
                    dirty: true,
                    dimensions: prev.dimensions.filter((d) => d.id !== id),
                    cells: rest,
                  };
                });
              }}
              onRestoreDefaults={() => {
                setInsight((prev) => {
                  if (!prev) return prev;
                  const dims = defaultDimensions();
                  const cells: InsightState['cells'] = {};
                  for (const d of dims) {
                    cells[d.id] = {};
                    for (const c of prev.competitors) {
                      cells[d.id][c.id] = '';
                    }
                  }
                  return { ...prev, dimensions: dims, cells, dirty: true };
                });
              }}
            />
            <Opportunities
              items={insight.opportunities}
              filter={filter}
              onFilterChange={setFilter}
              onReview={setReview}
            />
          </>
        ) : null}
      </main>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
