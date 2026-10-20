export function SkeletonBlock() {
  return (
    <div className="skeleton-block" aria-busy="true" aria-label="加载中">
      <div className="skel-table">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skel-row">
            <div className="skel-cell skel-dim" />
            <div className="skel-cell" />
            <div className="skel-cell" />
          </div>
        ))}
      </div>
      <div className="skel-cards">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skel-card" />
        ))}
      </div>
    </div>
  );
}
