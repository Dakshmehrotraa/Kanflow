import { useState } from 'react';
import { setDrag, clearDrag } from '../utils/dnd.js';
import { dueInfo, avColor, PRIORITY_COLORS } from '../utils/helpers.js';

export default function CardItem({ card, isDone, onOpen }) {
  const [dragging, setDragging] = useState(false);
  const di = dueInfo(card.due, isDone);

  const onDragStart = (e) => {
    setDrag({ id: card._id, from: card.column });
    setDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };
  const onDragEnd = () => { setDragging(false); clearDrag(); };

  return (
    <div
      className={`card ${dragging ? 'dragging' : ''}`}
      data-cardid={card._id}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={() => !dragging && onOpen()}
    >
      <span className="pstripe" style={{ background: PRIORITY_COLORS[card.priority] }} />
      <div className="ctitle">{card.title}</div>

      {card.tags?.length > 0 && (
        <div className="ctags">
          {card.tags.map((t, i) => <span className="tag" key={i}>{t}</span>)}
        </div>
      )}

      <div className="cfoot">
        <span className="prio" data-p={card.priority}><span className="pd" />{card.priority}</span>
        {di && <span className={`due ${di.cls}`}>⏱ {di.txt}</span>}
        {card.assignee && (
          <span
            className="assignee"
            style={{ background: `linear-gradient(135deg, ${avColor(card.assignee)}, ${avColor(card.assignee + 'x')})` }}
          >
            {card.assignee.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
}
