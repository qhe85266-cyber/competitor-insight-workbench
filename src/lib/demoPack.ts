import type {
  Competitor,
  ComparisonCells,
  DemoPackRaw,
  InsightState,
  Opportunity,
} from '../types';

/**
 * 主演示数据：仓库根 fixtures/demo-pack.json（构建时由 Vite 打包）。
 * public/fixtures 同步一份供运行时 fetch 兜底。
 */
import bundledPack from '../../fixtures/demo-pack.json';

const DEFAULT_DIM_NAMES = [
  '定位一句话',
  '核心用户',
  '定价模式',
  '关键能力',
  '差异化主张',
  '渠道 / 增长',
];

function clonePack(raw: DemoPackRaw): DemoPackRaw {
  return structuredClone(raw) as DemoPackRaw;
}

function normalizeOpportunities(list: Opportunity[]): Opportunity[] {
  return list.map((o) => ({
    ...o,
    review: 'pending',
    evidence: (o.evidence ?? []).map((e) => ({ ...e })),
    dimensions: o.dimensions ? [...o.dimensions] : undefined,
  }));
}

/** 将 demo-pack 灌进 App 状态（双竞品）。 */
export function packToInsight(raw: DemoPackRaw): InsightState {
  const pack = clonePack(raw);
  return {
    topic: pack.meta.topic,
    competitors: pack.competitors.map((c) => ({
      id: c.id,
      name: c.name,
      sourceUrls: c.sourceUrls ? [...c.sourceUrls] : [],
    })),
    dimensions: pack.comparison.dimensions.map((d) => ({ ...d })),
    cells: structuredClone(pack.comparison.cells) as ComparisonCells,
    opportunities: normalizeOpportunities(pack.opportunities),
    dirty: false,
  };
}

/** 加载打包内 fixture；失败时尝试 fetch public 副本。 */
export async function loadDemoPack(): Promise<InsightState> {
  try {
    return packToInsight(bundledPack as DemoPackRaw);
  } catch {
    const res = await fetch('/fixtures/demo-pack.json');
    if (!res.ok) {
      throw new Error('FIXTURE_MISSING');
    }
    const json = (await res.json()) as DemoPackRaw;
    return packToInsight(json);
  }
}

/**
 * 「生成洞察」：无 Key 路径 —— 以 demo-pack 为底，按 Intake 改写列名；
 * 仅 1 个竞品时第二列变为「你方」空列。
 */
export async function generateFromFixture(
  nameA: string,
  nameB?: string,
): Promise<InsightState> {
  const base = await loadDemoPack();
  const a = nameA.trim();
  const b = nameB?.trim();

  if (b) {
    const cols: Competitor[] = [
      { ...base.competitors[0], id: base.competitors[0]?.id ?? 'col-a', name: a },
      { ...base.competitors[1], id: base.competitors[1]?.id ?? 'col-b', name: b },
    ];
    // 若 demo 只有两列 id，沿用 cells；改显示名即可
    return { ...base, competitors: cols, dirty: false };
  }

  // 单竞品：保留 A 列数据，B 改为「你方」空单元格
  const colA = base.competitors[0] ?? { id: 'dify', name: a };
  const selfId = 'self';
  const cells: ComparisonCells = {};
  for (const dim of base.dimensions) {
    cells[dim.id] = {
      [colA.id]: base.cells[dim.id]?.[colA.id] ?? '',
      [selfId]: '',
    };
  }
  return {
    ...base,
    competitors: [
      { ...colA, name: a },
      { id: selfId, name: '你方', isSelf: true },
    ],
    cells,
    dirty: false,
  };
}

export function defaultDimensions() {
  return DEFAULT_DIM_NAMES.map((name, i) => ({
    id: `dim-${i + 1}`,
    name,
  }));
}

export function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
