import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from './Logo.jsx';

export default function AuthScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const signup = mode === 'signup';

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    setErr('');
    const { name, email, password } = form;
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('Enter a valid email address.');
    if (password.length < 6) return setErr('Password must be at least 6 characters.');
    if (signup && !name.trim()) return setErr('Tell us your name.');
    setBusy(true);
    try {
      if (signup) await register(name.trim(), email, password);
      else await login(email, password);
    } catch (e) {
      setErr(e.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const onKey = (e) => { if (e.key === 'Enter') submit(); };

  return (
    <div id="auth">
      <div className="auth-hero">
        <div className="hero-bg"><span /><span /><span /></div>
        <div className="hero-cards">
          <div className="ghost"><b>Design review</b><small>Due today · High</small><div className="bar" /></div>
          <div className="ghost"><b>Ship v2.0 API</b><small>In progress · Urgent</small><div className="bar" style={{ width: '70%' }} /></div>
        </div>
        <div className="hero-top"><Logo size={20} color="#fff" /></div>
        <div className="hero-mid">
          <h1>Where teams turn <em>chaos</em> into clear, moving work.</h1>
          <p>Drag-and-drop boards, priority intelligence, deadline tracking and shared workspaces — all in one fluid, focused space.</p>
        </div>
        <div className="hero-chips">
          <span>⚡ Drag &amp; drop</span><span>🎯 Priority tags</span><span>⏱ Deadlines</span><span>👥 Workspaces</span><span>🔒 Secure auth</span>
        </div>
      </div>

      <div className="auth-form">
        <div className="auth-card">
          <h2>{signup ? 'Create your account' : 'Welcome back'}</h2>
          <p className="sub">{signup ? 'Start organizing work in minutes.' : 'Sign in to pick up where your team left off.'}</p>

          {signup && (
            <div className="field">
              <label>Full name</label>
              <input value={form.name} onChange={set('name')} onKeyDown={onKey} placeholder="Ada Lovelace" />
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={set('email')} onKeyDown={onKey} placeholder="you@team.com" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={set('password')} onKeyDown={onKey} placeholder="••••••••" />
          </div>

          <div className="err">{err}</div>
          <button className="btn-primary" onClick={submit} disabled={busy}>
            {busy ? 'Please wait…' : signup ? 'Create account →' : 'Sign in →'}
          </button>

          <div className="auth-alt">
            {signup ? 'Already have an account? ' : 'New to KanFlow? '}
            <button onClick={() => { setMode(signup ? 'signin' : 'signup'); setErr(''); }}>
              {signup ? 'Sign in' : 'Create an account'}
            </button>
          </div>
          <div className="demo-hint">Connects to the KanFlow REST API — start the server, then register above.</div>
        </div>
      </div>
    </div>
  );
}
