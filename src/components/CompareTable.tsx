import { Plus, Trash2, Table2 } from 'lucide-react';
import type { ComparisonCells, Competitor, Dimension } from '../types';

interface Props {
  competitors: Competitor[];
  dimensions: Dimension[];
  cells: ComparisonCells;
  dirty: boolean;
  onDimNameChange: (id: string, name: string) => void;
  onColNameChange: (id: string, name: string) => void;
  onCellChange: (dimId: string, colId: string, value: string) => void;
  onAddDimension: () => void;
  onRemoveDimension: (id: string) => void;
  onRestoreDefaults: () => void;
}

export function CompareTable({
  competitors,
  dimensions,
  cells,
  dirty,
  onDimNameChange,
  onColNameChange,
  onCellChange,
  onAddDimension,
  onRemoveDimension,
  onRestoreDefaults,
}: Props) {
  const canDelete = dimensions.length > 5;

  if (dimensions.length === 0) {
    return (
      <section id="compare" className="card">
        <h2 className="section-title">
          <Table2 size={18} aria-hidden />
          对比表
        </h2>
        <p className="muted">至少需要 5 个对比维度</p>
        <button type="button" className="btn ghost" onClick={onRestoreDefaults}>
          恢复默认维度
        </button>
      </section>
    );
  }

  return (
    <section id="compare" className="card">
      <div className="section-head">
        <h2 className="section-title">
          <Table2 size={18} aria-hidden />
          对比表
          {dirty ? <span className="dirty-dot" title="已修改" /> : null}
        </h2>
        <span className="muted text-xs">{dimensions.length} 个维度 · 可编辑</span>
      </div>
      <div className="table-scroll">
        <table className="compare-table">
          <thead>
            <tr>
              <th scope="col">维度</th>
              {competitors.map((c) => (
                <th key={c.id} scope="col">
                  <input
                    className="th-input"
                    value={c.name}
                    aria-label={`列名 ${c.id}`}
                    onChange={(e) => onColNameChange(c.id, e.target.value)}
                  />
                </th>
              ))}
              <th scope="col" className="col-actions" aria-label="操作" />
            </tr>
          </thead>
          <tbody>
            {dimensions.map((d) => (
              <tr key={d.id}>
                <th scope="row">
                  <input
                    className="dim-input"
                    value={d.name}
                    aria-label={`维度 ${d.id}`}
                    onChange={(e) => onDimNameChange(d.id, e.target.value)}
                  />
                </th>
                {competitors.map((c) => {
                  const val = cells[d.id]?.[c.id] ?? '';
                  return (
                    <td key={c.id}>
                      <textarea
                        className={`cell-input${val.trim() ? '' : ' empty'}`}
                        rows={2}
                        value={val}
                        placeholder="点击填写"
                        aria-label={`${d.name} · ${c.name}`}
                        onChange={(e) => onCellChange(d.id, c.id, e.target.value)}
                      />
                    </td>
                  );
                })}
                <td className="col-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    disabled={!canDelete}
                    title={canDelete ? '删除维度' : '至少保留 5 个维度'}
                    aria-label="删除维度"
                    onClick={() => onRemoveDimension(d.id)}
                  >
                    <Trash2 size={16} strokeWidth={1.75} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="btn ghost sm add-dim" onClick={onAddDimension}>
        <Plus size={16} aria-hidden />
        添加维度
      </button>
    </section>
  );
}
