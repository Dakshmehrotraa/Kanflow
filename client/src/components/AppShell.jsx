import { useState, useEffect, useCallback } from 'react';
import { useBoard } from '../context/BoardContext.jsx';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import StatBar from './StatBar.jsx';
import Board from './Board.jsx';
import CardModal from './CardModal.jsx';

export default function AppShell() {
  const { columns, activeId } = useBoard();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState({ open: false, card: null, colId: null });

  const openCard = useCallback((card, colId) => {
    setModal({ open: true, card: card || null, colId: colId || (columns[0] && columns[0]._id) });
  }, [columns]);
  const closeCard = useCallback(() => setModal((m) => ({ ...m, open: false })), []);

  // Keyboard shortcut: "n" creates a new task.
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName || '';
      if (e.key === 'n' && !/INPUT|TEXTAREA|SELECT/.test(tag) && !modal.open && columns.length) {
        e.preventDefault();
        openCard(null, columns[0]._id);
      }
      if (e.key === 'Escape') closeCard();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [columns, modal.open, openCard, closeCard]);

  return (
    <div id="app" className="show">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main">
        <Topbar onMenu={() => setSidebarOpen((v) => !v)} />
        <StatBar />
        <Board onOpenCard={openCard} />
      </main>

      <button className="fab" onClick={() => columns.length && openCard(null, columns[0]._id)} disabled={!activeId}>
        <span>+</span> New task
      </button>

      {modal.open && (
        <CardModal card={modal.card} colId={modal.colId} onClose={closeCard} />
      )}
    </div>
  );
}
