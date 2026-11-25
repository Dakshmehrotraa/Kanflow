import { useBoard } from '../context/BoardContext.jsx';
import Column from './Column.jsx';

export default function Board({ onOpenCard }) {
  const { columns, cards, filter, search, saveColumns, loading, activeId } = useBoard();

  const matches = (card) => {
    if (filter !== 'all' && card.priority !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        card.title.toLowerCase().includes(q) ||
        (card.description || '').toLowerCase().includes(q) ||
        (card.tags || []).join(' ').toLowerCase().includes(q)
      );
    }
    return true;
  };

  const addColumn = () => {
    const name = prompt('Column name:', 'New Column');
    if (!name) return;
    const colors = ['#8e8ea8', '#00b894', '#fdcb6e', '#6c5ce7', '#00d2ff', '#ff6ec7'];
    saveColumns([
      ...columns,
      { name: name.trim(), color: colors[columns.length % colors.length], order: columns.length },
    ]);
  };

  if (loading) {
    return <div className="board-wrap"><div className="empty-board"><div className="spinner" /></div></div>;
  }
  if (!activeId) {
    return (
      <div className="board-wrap">
        <div className="empty-board"><div className="big">🗂️</div><p>Create a workspace to get started.</p></div>
      </div>
    );
  }

  const sorted = [...cards].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const isDoneCol = (col) => columns.length && col._id === columns[columns.length - 1]._id;

  return (
    <div className="board-wrap">
      <div className="board">
        {columns.map((col) => (
          <Column
            key={col._id}
            column={col}
            isDone={isDoneCol(col)}
            cards={sorted.filter((c) => c.column === col._id)}
            visible={(c) => matches(c)}
            onOpenCard={onOpenCard}
          />
        ))}
        <button className="add-col" onClick={addColumn}>+ Add column</button>
      </div>
    </div>
  );
}
