import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/auth.js';
import SessionAuditLog from '../components/SessionAuditLog.jsx';
import SecurityDashboard from '../components/SecurityDashboard.jsx';

/* ══════════════════════════════════════════════════════════════
   DECOY DASHBOARD — Class Schedule / Timetable
   Shown when user logs in with their decoy password.
   Looks completely normal and boring — zero private data.
   ══════════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════
   DECOY DASHBOARD — Personal To-Do List & Daily Planner
   Shown when user logs in with their decoy password.
   Looks completely normal, interactive, and believable — zero private data.
   ══════════════════════════════════════════════════════════════ */
const DEFAULT_DECOY_TODOS = [
  { id: 1, text: 'Buy groceries (milk, eggs, bread, coffee)', category: 'Personal', completed: false, priority: 'medium' },
  { id: 2, text: 'Finish CSE327 assignment report draft', category: 'Study', completed: true, priority: 'high' },
  { id: 3, text: 'Schedule dentist checkup appointment', category: 'Health', completed: false, priority: 'low' },
  { id: 4, text: 'Pay internet bill before the 15th', category: 'Finance', completed: false, priority: 'high' },
  { id: 5, text: 'Water houseplants and clean desk', category: 'Home', completed: true, priority: 'low' },
  { id: 6, text: 'Review lecture notes for upcoming midterm', category: 'Study', completed: false, priority: 'medium' },
];

const CATEGORY_COLORS = {
  Personal: '#3b82f6',
  Study: '#8b5cf6',
  Health: '#10b981',
  Finance: '#f59e0b',
  Home: '#06b6d4',
};

function DecoyDashboard({ username }) {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('graphlock_decoy_todos');
    return saved ? JSON.parse(saved) : DEFAULT_DECOY_TODOS;
  });
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState('Personal');

  useEffect(() => {
    localStorage.setItem('graphlock_decoy_todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    const item = {
      id: Date.now(),
      text: newText.trim(),
      category: newCategory,
      completed: false,
      priority: 'medium',
    };
    setTodos([item, ...todos]);
    setNewText('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const completedCount = todos.filter(t => t.completed).length;
  const progressPct = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="page-container">
      <h1 className="page-title">Welcome, {username} 👋</h1>
      <p className="page-subtitle">Your personal daily planner & task list</p>

      {/* Progress & Overview Card */}
      <div className="glass-card mb-3">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h3 className="section-title" style={{ margin: 0 }}>📊 Daily Task Progress</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '4px 0 0' }}>
              {completedCount} of {todos.length} tasks completed ({progressPct}%)
            </p>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)' }}>{progressPct}%</div>
        </div>
        <div style={{ width: '100%', height: 8, background: 'var(--bg-tertiary)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', transition: 'var(--transition)' }} />
        </div>
      </div>

      {/* Add New Task Form */}
      <div className="glass-card mb-3">
        <form onSubmit={handleAddTodo} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            className="input-field"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Add a new task..."
            style={{ flex: 1, minWidth: 200 }}
          />
          <select
            className="input-field"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            style={{ width: 130, cursor: 'pointer' }}
          >
            <option value="Personal">Personal</option>
            <option value="Study">Study</option>
            <option value="Health">Health</option>
            <option value="Finance">Finance</option>
            <option value="Home">Home</option>
          </select>
          <button className="btn btn-primary" type="submit" disabled={!newText.trim()}>
            + Add Task
          </button>
        </form>
      </div>

      {/* Task List */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <h3 className="section-title" style={{ margin: 0 }}>📋 My Tasks</h3>
          <div style={{ display: 'flex', gap: 6, background: 'var(--bg-tertiary)', padding: 4, borderRadius: 'var(--radius-sm)' }}>
            {['all', 'active', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: filter === f ? 'var(--primary)' : 'transparent',
                  color: filter === f ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'var(--transition)',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredTodos.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 30 }}>
            {filter === 'completed' ? 'No completed tasks yet.' : filter === 'active' ? 'No active tasks!' : 'No tasks added.'}
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredTodos.map(todo => (
              <div
                key={todo.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-sm)',
                  opacity: todo.completed ? 0.6 : 1,
                  transition: 'var(--transition)',
                }}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--primary)' }}
                />
                <span
                  style={{
                    flex: 1,
                    fontSize: '0.92rem',
                    color: todo.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                    textDecoration: todo.completed ? 'line-through' : 'none',
                  }}
                >
                  {todo.text}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '2px 10px',
                    borderRadius: 12,
                    background: `${CATEGORY_COLORS[todo.category] || '#3b82f6'}22`,
                    color: CATEGORY_COLORS[todo.category] || '#3b82f6',
                    border: `1px solid ${CATEGORY_COLORS[todo.category] || '#3b82f6'}44`,
                  }}
                >
                  {todo.category}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem', padding: 4 }}
                  title="Delete Task"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   REAL DASHBOARD — Secret Notes Vault + Password Manager
   Shown when user logs in with their real graphical password.
   ══════════════════════════════════════════════════════════════ */
const NOTE_COLORS = ['#1a1a2e', '#1e293b', '#1c1917', '#172554', '#14532d', '#4c1d95', '#7f1d1d', '#713f12'];

function VaultDashboard({ user, passwordExpired, daysRemaining }) {
  const [vaultTab, setVaultTab] = useState('notes');  // 'notes' | 'credentials' | 'security'
  const [notes, setNotes] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);

  // Note form
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteForm, setNoteForm] = useState({ title: '', content: '', color: '#1a1a2e' });

  // Credential form
  const [showCredForm, setShowCredForm] = useState(false);
  const [editingCred, setEditingCred] = useState(null);
  const [credForm, setCredForm] = useState({ siteName: '', siteUrl: '', username: '', password: '', notes: '' });
  const [showPasswords, setShowPasswords] = useState({});

  const fetchNotes = useCallback(async () => {
    try {
      const { data } = await api.get('/vault/notes');
      setNotes(data);
    } catch { /* empty */ }
  }, []);

  const fetchCredentials = useCallback(async () => {
    try {
      const { data } = await api.get('/vault/credentials');
      setCredentials(data);
    } catch { /* empty */ }
  }, []);

  useEffect(() => {
    fetchNotes();
    fetchCredentials();
  }, [fetchNotes, fetchCredentials]);

  // ── NOTE CRUD ──
  const handleSaveNote = async () => {
    setLoading(true);
    try {
      if (editingNote) {
        await api.put(`/vault/notes/${editingNote._id}`, noteForm);
      } else {
        await api.post('/vault/notes', noteForm);
      }
      setShowNoteForm(false);
      setEditingNote(null);
      setNoteForm({ title: '', content: '', color: '#1a1a2e' });
      fetchNotes();
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteForm({ title: note.title, content: note.content, color: note.color || '#1a1a2e' });
    setShowNoteForm(true);
  };

  const handleDeleteNote = async (id) => {
    if (!confirm('Delete this note permanently?')) return;
    try {
      await api.delete(`/vault/notes/${id}`);
      fetchNotes();
    } catch { /* empty */ }
  };

  const handleTogglePin = async (note) => {
    try {
      await api.put(`/vault/notes/${note._id}`, { pinned: !note.pinned });
      fetchNotes();
    } catch { /* empty */ }
  };

  // ── CREDENTIAL CRUD ──
  const handleSaveCred = async () => {
    setLoading(true);
    try {
      if (editingCred) {
        await api.put(`/vault/credentials/${editingCred._id}`, credForm);
      } else {
        await api.post('/vault/credentials', credForm);
      }
      setShowCredForm(false);
      setEditingCred(null);
      setCredForm({ siteName: '', siteUrl: '', username: '', password: '', notes: '' });
      fetchCredentials();
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleEditCred = (cred) => {
    setEditingCred(cred);
    setCredForm({ siteName: cred.siteName, siteUrl: cred.siteUrl || '', username: cred.username, password: cred.password, notes: cred.notes || '' });
    setShowCredForm(true);
  };

  const handleDeleteCred = async (id) => {
    if (!confirm('Delete this credential permanently?')) return;
    try {
      await api.delete(`/vault/credentials/${id}`);
      fetchCredentials();
    } catch { /* empty */ }
  };

  const togglePasswordVisibility = (id) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Welcome back, {user.username}! 👋</h1>
      <p className="page-subtitle">Your private vault & security center</p>

      {passwordExpired && (
        <div className="alert alert-error">
          ⚠️ Your graphical password has expired! <Link to="/reset-password" style={{ marginLeft: 8, fontWeight: 600 }}>Reset it now →</Link>
        </div>
      )}
      {!passwordExpired && daysRemaining !== null && daysRemaining <= 7 && (
        <div className="alert alert-warning">
          ⏰ Your password expires in <strong>{daysRemaining}</strong> day{daysRemaining !== 1 ? 's' : ''}. <Link to="/reset-password" style={{ marginLeft: 8 }}>Change it →</Link>
        </div>
      )}

      {/* Vault Tabs */}
      <div className="vault-tabs">
        <button className={`vault-tab ${vaultTab === 'notes' ? 'active' : ''}`} onClick={() => setVaultTab('notes')}>
          📝 Secret Notes <span className="vault-tab-count">{notes.length}</span>
        </button>
        <button className={`vault-tab ${vaultTab === 'credentials' ? 'active' : ''}`} onClick={() => setVaultTab('credentials')}>
          🔑 Passwords <span className="vault-tab-count">{credentials.length}</span>
        </button>
        <button className={`vault-tab ${vaultTab === 'security' ? 'active' : ''}`} onClick={() => setVaultTab('security')}>
          🛡️ Security
        </button>
      </div>

      {/* ═══ NOTES TAB ═══ */}
      {vaultTab === 'notes' && (
        <div className="fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 className="section-title" style={{ margin: 0 }}>🔒 Secret Notes</h3>
            <button className="btn btn-primary btn-sm" onClick={() => { setShowNoteForm(true); setEditingNote(null); setNoteForm({ title: '', content: '', color: '#1a1a2e' }); }}>
              + New Note
            </button>
          </div>

          {/* Note Form Modal */}
          {showNoteForm && (
            <div className="glass-card mb-3 slide-up" style={{ border: '1px solid var(--primary)', boxShadow: 'var(--shadow-glow)' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: 14 }}>{editingNote ? '✏️ Edit Note' : '✨ New Note'}</h4>
              <div className="form-group">
                <label>Title</label>
                <input className="input-field" value={noteForm.title} onChange={(e) => setNoteForm({...noteForm, title: e.target.value})} placeholder="Note title..." />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea className="input-field" rows={5} value={noteForm.content} onChange={(e) => setNoteForm({...noteForm, content: e.target.value})} placeholder="Write your secret note here..." style={{ resize: 'vertical', fontFamily: 'var(--font)' }} />
              </div>
              <div className="form-group">
                <label>Card Color</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {NOTE_COLORS.map(c => (
                    <button key={c} onClick={() => setNoteForm({...noteForm, color: c})}
                      style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: noteForm.color === c ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', transition: 'var(--transition)' }} />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary btn-sm" onClick={handleSaveNote} disabled={loading || !noteForm.title.trim()}>
                  {loading ? 'Saving...' : editingNote ? 'Update Note' : 'Save Note'}
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => { setShowNoteForm(false); setEditingNote(null); }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Notes Grid */}
          {notes.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>📝</div>
              <p style={{ color: 'var(--text-muted)' }}>No secret notes yet. Click "+ New Note" to create one.</p>
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map(note => (
                <div key={note._id} className="note-card" style={{ background: note.color || '#1a1a2e' }}>
                  {note.pinned && <div className="note-pin">📌</div>}
                  <h4 className="note-title">{note.title}</h4>
                  <p className="note-content">{note.content}</p>
                  <div className="note-date">{new Date(note.updatedAt).toLocaleDateString()}</div>
                  <div className="note-actions">
                    <button onClick={() => handleTogglePin(note)} title={note.pinned ? 'Unpin' : 'Pin'}>
                      {note.pinned ? '📌' : '📍'}
                    </button>
                    <button onClick={() => handleEditNote(note)} title="Edit">✏️</button>
                    <button onClick={() => handleDeleteNote(note._id)} title="Delete">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ CREDENTIALS TAB ═══ */}
      {vaultTab === 'credentials' && (
        <div className="fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 className="section-title" style={{ margin: 0 }}>🔑 Saved Passwords</h3>
            <button className="btn btn-primary btn-sm" onClick={() => { setShowCredForm(true); setEditingCred(null); setCredForm({ siteName: '', siteUrl: '', username: '', password: '', notes: '' }); }}>
              + Add Credential
            </button>
          </div>

          {/* Credential Form */}
          {showCredForm && (
            <div className="glass-card mb-3 slide-up" style={{ border: '1px solid var(--primary)', boxShadow: 'var(--shadow-glow)' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: 14 }}>{editingCred ? '✏️ Edit Credential' : '✨ New Credential'}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Site / Service Name</label>
                  <input className="input-field" value={credForm.siteName} onChange={(e) => setCredForm({...credForm, siteName: e.target.value})} placeholder="e.g. Gmail, GitHub" />
                </div>
                <div className="form-group">
                  <label>URL (optional)</label>
                  <input className="input-field" value={credForm.siteUrl} onChange={(e) => setCredForm({...credForm, siteUrl: e.target.value})} placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label>Username / Email</label>
                  <input className="input-field" value={credForm.username} onChange={(e) => setCredForm({...credForm, username: e.target.value})} placeholder="user@example.com" />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input className="input-field" type="password" value={credForm.password} onChange={(e) => setCredForm({...credForm, password: e.target.value})} placeholder="••••••••" />
                </div>
              </div>
              <div className="form-group">
                <label>Notes (optional)</label>
                <input className="input-field" value={credForm.notes} onChange={(e) => setCredForm({...credForm, notes: e.target.value})} placeholder="Recovery email, 2FA info, etc." />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary btn-sm" onClick={handleSaveCred} disabled={loading || !credForm.siteName.trim() || !credForm.username.trim() || !credForm.password.trim()}>
                  {loading ? 'Saving...' : editingCred ? 'Update' : 'Save Credential'}
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => { setShowCredForm(false); setEditingCred(null); }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Credentials List */}
          {credentials.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🔑</div>
              <p style={{ color: 'var(--text-muted)' }}>No saved passwords yet. Click "+ Add Credential" to store one.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {credentials.map(cred => (
                <div key={cred._id} className="cred-row">
                  <div className="cred-icon">{(cred.siteName || '?')[0].toUpperCase()}</div>
                  <div className="cred-details">
                    <div className="cred-site">
                      {cred.siteUrl ? <a href={cred.siteUrl} target="_blank" rel="noreferrer">{cred.siteName}</a> : cred.siteName}
                    </div>
                    <div className="cred-user">{cred.username}</div>
                  </div>
                  <div className="cred-password">
                    <span className="cred-pass-text">{showPasswords[cred._id] ? cred.password : '••••••••'}</span>
                    <button className="cred-action-btn" onClick={() => togglePasswordVisibility(cred._id)} title={showPasswords[cred._id] ? 'Hide' : 'Reveal'}>
                      {showPasswords[cred._id] ? '🙈' : '👁️'}
                    </button>
                    <button className="cred-action-btn" onClick={() => copyToClipboard(cred.password)} title="Copy password">📋</button>
                  </div>
                  <div className="cred-actions">
                    <button className="cred-action-btn" onClick={() => handleEditCred(cred)} title="Edit">✏️</button>
                    <button className="cred-action-btn" onClick={() => handleDeleteCred(cred._id)} title="Delete">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ SECURITY TAB ═══ */}
      {vaultTab === 'security' && (
        <div className="fade-in">
          {/* Stats */}
          <div className="stats-grid mb-3">
            <div className="stat-card">
              <div className="stat-value">{user.role === 'admin' ? '🛡️ Admin' : '👤 User'}</div>
              <div className="stat-label">Role</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{daysRemaining ?? '—'}</div>
              <div className="stat-label">Days Until Expiry</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{user.hasDecoy ? '✅' : '❌'}</div>
              <div className="stat-label">Decoy Password</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{notes.length + credentials.length}</div>
              <div className="stat-label">Vault Items</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card mb-3">
            <h3 className="section-title">⚡ Quick Actions</h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/reset-password" className="btn btn-secondary">🔄 Change Graphical Password</Link>
              <Link to="/setup-decoy" className="btn btn-secondary">🎭 {user.hasDecoy ? 'Update' : 'Setup'} Decoy Password</Link>
              <Link to="/security" className="btn btn-secondary">📊 Security Analysis</Link>
              <Link to="/shoulder-surfing" className="btn btn-secondary">🕵️ Shoulder Surfing Demo</Link>
            </div>
          </div>

          {/* Session Audit Log */}
          <div className="glass-card mb-3">
            <SessionAuditLog />
          </div>

          {/* Security Overview */}
          <div className="glass-card">
            <SecurityDashboard />
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN EXPORT — Switches between Real & Decoy dashboard
   ══════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { user, isDecoyMode, passwordExpired, daysRemaining } = useAuth();

  if (!user) return <div className="loading-page"><div className="spinner" /></div>;

  if (isDecoyMode) {
    return <DecoyDashboard username={user.username} />;
  }

  return <VaultDashboard user={user} passwordExpired={passwordExpired} daysRemaining={daysRemaining} />;
}
