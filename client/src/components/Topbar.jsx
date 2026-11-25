import { useBoard } from '../context/BoardContext.jsx';

const FILTERS = [
  ['all', 'All'], ['urgent', 'Urgent'], ['high', 'High'], ['medium', 'Med'], ['low', 'Low'],
];

export default function Topbar({ onMenu }) {
  const { activeWorkspace, columns, cards, filter, setFilter, search, setSearch } = useBoard();

  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={onMenu}>☰</button>
      <div className="tb-title">
        <h1>
          <span className="ws-dot" style={{ background: activeWorkspace?.color || 'transparent' }} />
          <span>{activeWorkspace?.name || '—'}</span>
        </h1>
        <p>{columns.length} columns · {cards.length} tasks</p>
      </div>
      <div className="tb-spacer" />
      <div className="search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
        </svg>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks…" />
      </div>
      <div className="filter-pills">
        {FILTERS.map(([p, label]) => (
          <button
            key={p}
            className={`pill ${filter === p ? 'on' : ''}`}
            data-p={p}
            onClick={() => setFilter(p)}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}
