import { useState } from 'react';
import { useBoard } from '../context/BoardContext.jsx';

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const toDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');

export default function CardModal({ card, colId, onClose }) {
  const { columns, saveCard, deleteCard } = useBoard();
  const editing = Boolean(card);

  const [form, setForm] = useState({
    title: card?.title || '',
    description: card?.description || '',
    column: card?.column || colId || (columns[0] && columns[0]._id),
    due: toDateInput(card?.due),
    priority: card?.priority || 'medium',
    assignee: card?.assignee || '',
    tags: (card?.tags || []).join(', '),
  });
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async () => {
    if (!form.title.trim()) return;
    setBusy(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      column: form.column,
      due: form.due || null,
      priority: form.priority,
      assignee: form.assignee.trim().toUpperCase(),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    try {
      await saveCard(payload, card?._id);
      onClose();
    } finally { setBusy(false); }
  };

  const remove = async () => {
    setBusy(true);
    try { await deleteCard(card._id); onClose(); }
    finally { setBusy(false); }
  };

  return (
    <div className="overlay show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div className="mh-tx">
            <h3>{editing ? 'Edit task' : 'New task'}</h3>
            <p>{editing ? 'Update the details' : 'Add it to your board'}</p>
          </div>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="mfield">
            <label>Task title</label>
            <input autoFocus value={form.title} onChange={set('title')} placeholder="e.g. Finalize onboarding flow" />
          </div>
          <div className="mfield">
            <label>Description</label>
            <textarea value={form.description} onChange={set('description')} placeholder="Add details, context, acceptance criteria…" />
          </div>
          <div className="row2">
            <div className="mfield">
              <label>Column</label>
              <select value={form.column} onChange={set('column')}>
                {columns.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="mfield">
              <label>Due date</label>
              <input type="date" value={form.due} onChange={set('due')} />
            </div>
          </div>
          <div className="mfield">
            <label>Priority</label>
            <div className="prio-pick">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  data-p={p}
                  className={form.priority === p ? 'sel' : ''}
                  onClick={() => setForm({ ...form, priority: p })}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="row2">
            <div className="mfield">
              <label>Assignee initials</label>
              <input maxLength={2} value={form.assignee} onChange={set('assignee')} placeholder="AL" />
            </div>
            <div className="mfield">
              <label>Tags (comma separated)</label>
              <input value={form.tags} onChange={set('tags')} placeholder="design, api" />
            </div>
          </div>
        </div>

        <div className="modal-foot">
          {editing && <button className="btn danger" onClick={remove} disabled={busy}>Delete</button>}
          <div className="grow" />
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn solid" onClick={save} disabled={busy}>
            {busy ? 'Saving…' : 'Save task'}
          </button>
        </div>
      </div>
    </div>
  );
}
