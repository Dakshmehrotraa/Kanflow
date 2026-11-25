import { useBoard } from '../context/BoardContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../hooks/useTheme.js';
import { avColor, initialsOf } from '../utils/helpers.js';
import Logo from './Logo.jsx';

export default function Sidebar({ open, onClose }) {
  const { workspaces, activeId, selectWorkspace, createWorkspace, deleteWorkspace } = useBoard();
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();

  const onAdd = async () => {
    const name = prompt('New workspace name:', 'Untitled Workspace');
    if (name) {
      const colors = ['#6c5ce7', '#00d2ff', '#ff6ec7', '#00b894', '#e17055', '#fdcb6e'];
      await createWorkspace(name.trim(), colors[workspaces.length % colors.length]);
    }
  };

  const onDelete = (e, w) => {
    e.stopPropagation();
    if (workspaces.length <= 1) return;
    if (confirm('Delete this workspace and all its tasks?')) deleteWorkspace(w._id);
  };

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="side-head">
        <Logo />
        <button className="icon-btn" onClick={toggle} title="Toggle theme">
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>

      <div className="side-label">Workspaces <button onClick={onAdd} title="New workspace">+</button></div>
      <div>
        {workspaces.map((w) => (
          <div
            key={w._id}
            className={`ws ${w._id === activeId ? 'active' : ''}`}
            onClick={() => { selectWorkspace(w._id); onClose(); }}
          >
            <span className="dot" style={{ background: w.color }} />
            <span className="nm">{w.name}</span>
            <span className="ct">{w.cardCount ?? ''}</span>
            {workspaces.length > 1 && (
              <button className="del" title="Delete" onClick={(e) => onDelete(e, w)}>✕</button>
            )}
          </div>
        ))}
      </div>

      <div className="side-foot">
        <div className="user-chip">
          <div className="avatar" style={{ background: `linear-gradient(135deg, ${avColor(user.name)}, ${avColor(user.email)})` }}>
            {initialsOf(user.name)}
          </div>
          <div className="meta">
            <b>{user.name}</b>
            <small>{user.email}</small>
          </div>
          <button className="icon-btn" onClick={logout} title="Sign out">⎋</button>
        </div>
      </div>
    </aside>
  );
}
