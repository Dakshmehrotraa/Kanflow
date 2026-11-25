import { useAuth } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { BoardProvider } from './context/BoardContext.jsx';
import AuthScreen from './components/AuthScreen.jsx';
import AppShell from './components/AppShell.jsx';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <>
        <div className="aurora"><span /><span /><span /></div>
        <div className="splash"><div className="spinner" /></div>
      </>
    );
  }

  return (
    <ToastProvider>
      <div className="aurora"><span /><span /><span /></div>
      {user ? (
        <BoardProvider>
          <AppShell />
        </BoardProvider>
      ) : (
        <AuthScreen />
      )}
    </ToastProvider>
  );
}
