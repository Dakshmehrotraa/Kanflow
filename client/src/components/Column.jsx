import { useRef, useState } from 'react';
import { useBoard } from '../context/BoardContext.jsx';
import { getDrag, clearDrag, insertBeforeId } from '../utils/dnd.js';
import CardItem from './CardItem.jsx';

export default function Column({ column, cards, isDone, visible, onOpenCard }) {
  const { columns, saveColumns, moveCard, deleteCard } = useBoard();
  const listRef = useRef(null);
  const [over, setOver] = useState(false);

  const shown = cards.filter(visible);

  const onDragOver = (e) => { e.preventDefault(); setOver(true); };
  const onDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setOver(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setOver(false);
    const drag = getDrag();
    if (!drag) return;

    // Compute a fractional order so the card lands exactly where it's dropped.
    const beforeId = listRef.current ? insertBeforeId(listRef.current, e.clientY) : null;
    const colCards = cards.filter((c) => c._id !== drag.id); // already sorted by order
    const idx = beforeId ? colCards.findIndex((c) => c._id === beforeId) : colCards.length;
    const prev = colCards[idx - 1];
    const next = colCards[idx];
    let order;
    if (prev && next) order = (prev.order + next.order) / 2;
    else if (next) order = next.order - 1;
    else if (prev) order = prev.order + 1;
    else order = 0;

    moveCard(drag.id, column._id, order);
    clearDrag();
  };

  const renameColumn = (e) => {
    const name = e.target.textContent.trim() || 'Untitled';
    e.target.textContent = name;
    if (name !== column.name) {
      saveColumns(columns.map((c) => (c._id === column._id ? { ...c, name } : c)));
    }
  };

  const onDeleteColumn = async () => {
    if (columns.length <= 1) return;
    const inCol = cards.length;
    if (inCol && !confirm(`Delete this column and its ${inCol} task(s)?`)) return;
    for (const c of cards) await deleteCard(c._id);
    saveColumns(columns.filter((c) => c._id !== column._id));
  };

  return (
    <div
      className={`column ${over ? 'drag-over' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="col-head">
        <span className="cdot" style={{ background: column.color }} />
        <h3
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onBlur={renameColumn}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); } }}
        >
          {column.name}
        </h3>
        <span className="cnt">{shown.length}</span>
        {columns.length > 1 && (
          <button className="cdel" title="Delete column" onClick={onDeleteColumn}>✕</button>
        )}
      </div>

      <div className="cards" ref={listRef}>
        {shown.map((card) => (
          <CardItem key={card._id} card={card} isDone={isDone} onOpen={() => onOpenCard(card, column._id)} />
        ))}
        {!shown.length && (
          <div style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: 12.5, padding: '18px 0' }}>
            {cards.length ? 'No matching tasks' : 'Drop tasks here'}
          </div>
        )}
      </div>

      <button className="col-add" onClick={() => onOpenCard(null, column._id)}>+ Add task</button>
    </div>
  );
}
