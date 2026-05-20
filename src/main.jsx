import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  EyeOff,
  FileText,
  Filter,
  HelpCircle,
  MessageSquare,
  Pin,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  TimerReset,
} from 'lucide-react';
import './styles.css';

const initiatives = [
  {
    id: 'launch',
    label: 'City launch',
    horizon: '~2 weeks',
    signal: 'Revenue and relationship impact',
    open: ['Integration reliability', 'Manual operational steps'],
    accent: 'teal',
  },
  {
    id: 'failures',
    label: 'Permit failures',
    horizon: 'Daily',
    signal: '3-5 cases require investigation',
    open: ['Frequency distribution', 'Customer impact', 'Failure patterns'],
    accent: 'amber',
  },
  {
    id: 'stability',
    label: 'Platform stability',
    horizon: 'Ongoing',
    signal: 'Debugging is slower than the business needs',
    open: ['Delayed upgrades', 'Limited automated checks', 'Incidents surfaced by support'],
    accent: 'slate',
  },
  {
    id: 'ai',
    label: 'AI workflow prototype',
    horizon: '~1 week',
    signal: 'Strategic exploration request',
    open: ['Business value', 'Technical feasibility', 'User demand'],
    accent: 'violet',
  },
];

const prepPrompts = [
  'Questions you would ask before making decisions',
  'How you would prioritize work',
  'Assumptions you would challenge',
  'How you would make progress with limited information',
  'Risks that concern you',
];

const questionStarters = [
  'Which deadline or constraint is immovable?',
  'Which current users are affected, and how often?',
  'What evidence exists versus what is anecdotal?',
  'Which work is reversible if we learn something new?',
  'Who is available to execute or unblock decisions?',
  'What would make leadership change the priority order?',
];

const dashboardRows = [
  ['Permit processing', 'Investigating', '3-5/day'],
  ['City launch path', 'At risk', '2 blockers'],
  ['Support surfaced issues', 'Rising', '+18%'],
  ['Manual fixes', 'Queued', '7 open'],
];

const strongSignals = [
  'Asks which initiative affects revenue and existing users',
  'Separates constraints from preferences',
  'Wants metrics before over-fitting the story',
  'Looks for reversible progress and fast learning loops',
  'Names customer pain without jumping to a tool',
  'Asks what resources are actually available',
];

const yellowFlags = [
  'Immediate solutioning before clarifying the problem',
  'Technology shopping',
  'Assumption stacking',
  'Treating all initiatives as equal priority',
];

const redFlags = [
  'Large rebuild as the first move',
  'Architecture fashion words as a substitute for judgment',
  'Using AI as the answer before defining the problem',
];

function App() {
  const [selected, setSelected] = useState('failures');
  const [checked, setChecked] = useState(() => new Set());
  const [priorities, setPriorities] = useState(['failures']);
  const [notes, setNotes] = useState('');
  const [showInterview, setShowInterview] = useState(
    new URLSearchParams(window.location.search).get('interviewer') === '1',
  );
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      setElapsed(Math.min(30, Math.floor((Date.now() - startedAt) / 60000)));
    }, 10000);

    return () => window.clearInterval(timer);
  }, []);

  const selectedInitiative = initiatives.find((item) => item.id === selected);
  const progress = Math.round((checked.size / prepPrompts.length) * 100);
  const prepMinutes = Math.max(0, 30 - elapsed);

  const prioritySummary = useMemo(
    () => priorities.map((id) => initiatives.find((item) => item.id === id)?.label).filter(Boolean),
    [priorities],
  );

  function togglePrompt(prompt) {
    setChecked((current) => {
      const next = new Set(current);
      next.has(prompt) ? next.delete(prompt) : next.add(prompt);
      return next;
    });
  }

  function togglePriority(id) {
    setPriorities((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      return [...current, id].slice(-3);
    });
  }

  function resetPrep() {
    setChecked(new Set());
    setPriorities(['failures']);
    setNotes('');
    setElapsed(0);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">CF</div>
          <div>
            <h1>CivicFlow candidate pre-read</h1>
            <p>Internal context for a senior engineering interview</p>
          </div>
        </div>
        <div className="topbar-actions">
          <div className="timer">
            <Clock3 size={16} />
            <span>{prepMinutes} min left</span>
          </div>
          <button className="icon-button" type="button" aria-label="Reset preparation" onClick={resetPrep}>
            <TimerReset size={17} />
          </button>
        </div>
      </header>

      <section className="content-grid">
        <section className="message-panel" aria-labelledby="message-title">
          <div className="panel-heading">
            <div>
              <p className="channel">#launch-readiness</p>
              <h2 id="message-title">Monday context drop</h2>
            </div>
            <span className="status-pill">20-30 min prep</span>
          </div>

          <article className="slack-message">
            <div className="avatar">AK</div>
            <div className="message-copy">
              <div className="message-meta">
                <strong>Alex Kim</strong>
                <span>Today at 8:12 AM</span>
              </div>
              <p>
                Welcome aboard. You joined CivicFlow recently as a Senior Software Engineer. The team helps cities
                automate permitting workflows, and this is the Monday morning context you are walking into.
              </p>
              <p>
                Current team: CTO, one junior engineer, one engineer leaving in about six weeks, and an offshore
                engineering support team.
              </p>
              <p>
                Multiple city launches are moving at once. New feature requests keep arriving. Infrastructure work has
                been pushed back several times. Some incidents are first discovered when support hears from users.
              </p>
            </div>
          </article>

          <div className="initiative-list">
            {initiatives.map((item) => (
              <button
                key={item.id}
                className={`initiative-row ${selected === item.id ? 'selected' : ''}`}
                type="button"
                onClick={() => setSelected(item.id)}
              >
                <span className={`dot ${item.accent}`} />
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.signal}</small>
                </span>
                <span className="horizon">{item.horizon}</span>
              </button>
            ))}
          </div>
        </section>

        <aside className="dashboard-panel" aria-labelledby="dashboard-title">
          <div className="panel-heading compact">
            <div>
              <p className="channel">Ops snapshot</p>
              <h2 id="dashboard-title">Tiny dashboard screenshot</h2>
            </div>
            <button className="icon-button ghost" type="button" aria-label="Filter dashboard">
              <Filter size={16} />
            </button>
          </div>

          <div className="metric-strip">
            <div>
              <span>Open launch tasks</span>
              <strong>14</strong>
            </div>
            <div>
              <span>Manual fixes</span>
              <strong>7</strong>
            </div>
            <div>
              <span>Support tickets</span>
              <strong>23</strong>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-head">
              <span>Permit exceptions, last 7 days</span>
              <AlertTriangle size={16} />
            </div>
            <div className="bars" aria-label="Bar chart of permit exceptions">
              {[34, 48, 42, 58, 66, 52, 61].map((height, index) => (
                <span key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>

          <div className="table-card">
            {dashboardRows.map(([name, status, value]) => (
              <div className="dashboard-row" key={name}>
                <span>{name}</span>
                <strong>{status}</strong>
                <em>{value}</em>
              </div>
            ))}
          </div>

          <div className="detail-card">
            <div className={`dot ${selectedInitiative.accent}`} />
            <div>
              <h3>{selectedInitiative.label}</h3>
              <p>{selectedInitiative.signal}</p>
              <ul>
                {selectedInitiative.open.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </section>

      <section className="prep-workspace" aria-labelledby="prep-title">
        <div className="prep-header">
          <div>
            <p className="channel">Candidate workspace</p>
            <h2 id="prep-title">Come prepared to walk through your thinking</h2>
          </div>
          <div className="progress-wrap" aria-label={`${progress}% prepared`}>
            <span>{progress}%</span>
            <div className="progress-bar">
              <i style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="workspace-grid">
          <div className="prep-card checklist-card">
            <div className="card-title">
              <Check size={17} />
              <h3>Preparation prompts</h3>
            </div>
            {prepPrompts.map((prompt) => (
              <label className="check-row" key={prompt}>
                <input
                  type="checkbox"
                  checked={checked.has(prompt)}
                  onChange={() => togglePrompt(prompt)}
                />
                <span>{prompt}</span>
              </label>
            ))}
          </div>

          <div className="prep-card priority-card">
            <div className="card-title">
              <SlidersHorizontal size={17} />
              <h3>Priority sketch</h3>
            </div>
            <div className="priority-buttons">
              {initiatives.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={priorities.includes(item.id) ? 'active' : ''}
                  onClick={() => togglePriority(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="summary-line">
              Current order: {prioritySummary.length ? prioritySummary.join(' → ') : 'none selected yet'}
            </p>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Private notes for your discussion: questions, tradeoffs, assumptions, risks..."
            />
          </div>

          <div className="prep-card question-card">
            <div className="card-title">
              <HelpCircle size={17} />
              <h3>Question starters</h3>
            </div>
            <div className="starter-list">
              {questionStarters.map((question) => (
                <button key={question} type="button" onClick={() => setNotes((value) => `${value}${value ? '\n' : ''}${question}`)}>
                  <Pin size={14} />
                  <span>{question}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {showInterview && (
        <section className="interviewer-panel open" aria-label="Interviewer notes">
            <button className="interviewer-toggle" type="button" onClick={() => setShowInterview(false)}>
              <EyeOff size={16} />
              <span>Hide interviewer notes</span>
              <ChevronDown size={15} />
            </button>
            <div className="interviewer-content">
              <div>
                <h3><MessageSquare size={17} /> Strong signals</h3>
                <ul>{strongSignals.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div>
                <h3><ShieldAlert size={17} /> Yellow flags</h3>
                <ul>{yellowFlags.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div>
                <h3><Sparkles size={17} /> Red flags</h3>
                <ul>{redFlags.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </div>
        </section>
      )}

      <footer className="footer-note">
        <FileText size={15} />
        <span>No coding is required. The interview prompt is: “Walk me through your thinking.”</span>
        <ArrowRight size={15} />
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
