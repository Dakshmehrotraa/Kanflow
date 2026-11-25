import { useBoard } from '../context/BoardContext.jsx';

export default function StatBar() {
  const { cards, columns } = useBoard();
  const doneCol = columns.length ? columns[columns.length - 1]._id : null;
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const done = cards.filter((c) => c.column === doneCol).length;
  const urgent = cards.filter((c) => c.priority === 'urgent' && c.column !== doneCol).length;
  const overdue = cards.filter(
    (c) => c.due && new Date(c.due) < today && c.column !== doneCol
  ).length;
  const pct = cards.length ? Math.round((done / cards.length) * 100) : 0;

  return (
    <div className="statbar">
      <div className="stat">
        <div className="ic" style={{ background: 'var(--p-med-bg)', color: 'var(--p-med)' }}>📋</div>
        <div className="tx"><b>{cards.length}</b><small>Total tasks</small></div>
      </div>
      <div className="stat">
        <div className="ic" style={{ background: 'var(--p-urgent-bg)', color: 'var(--p-urgent)' }}>🔥</div>
        <div className="tx"><b>{urgent}</b><small>Urgent &amp; open</small></div>
      </div>
      <div className="stat">
        <div className="ic" style={{ background: 'var(--p-high-bg)', color: 'var(--p-high)' }}>⏰</div>
        <div className="tx"><b>{overdue}</b><small>Overdue</small></div>
      </div>
      <div className="stat">
        <div className="ring" style={{ '--v': pct }} data-v={pct} />
        <div className="tx"><b>{done}/{cards.length || 0}</b><small>Completed</small></div>
      </div>
    </div>
  );
}
