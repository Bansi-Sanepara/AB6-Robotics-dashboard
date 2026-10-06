import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const A = '/src/assets/';

// status: done | current | open | locked
const courses = [
  { id: 'control', name: 'Control Systems', icon: '⚙', color: '#f29b38', progress: 15, total: 15, status: 'done', xp: 180, description: 'Master feedback, stability and robot control loops.' },
  { id: 'kinematics', name: 'Kinematics', icon: '✦', color: '#3d8fe0', progress: 14, total: 15, status: 'open', star: true, xp: 320, description: 'Understand robot joints, links, motion and pose.' },
  { id: 'omx', name: 'OMX Kinematics', icon: '◎', color: '#ed5b55', progress: 6, total: 11, status: 'locked', xp: 240, description: 'Apply kinematics to the OMX robotic platform.' },
  { id: 'sensing', name: 'Sensing & Perception', icon: '◉', color: '#8a52e9', progress: 8, total: 14, status: 'current', xp: 210, description: 'Teach robots to see, sense and understand the world.' },
  { id: 'sim', name: 'Sim-to-Real Kinematics', icon: '▣', color: '#2fa75a', progress: 6, total: 13, status: 'locked', xp: 190, description: 'Bridge simulation skills with real robotic systems.' }
];

const nav = [['⌂', 'Home'], ['▤', 'My Learning'], ['🏆', 'Challenges'], ['▥', 'Leaderboard'], ['✪', 'Achievements'], ['☻', 'Community'], ['▭', 'Resources']];

function Island({ c, i, onClick }) {
  return (
    <div className={'island island-' + c.id} style={{ '--i': i }}>
      <img src={A + 'island-' + c.id + '.png'} alt="" draggable="false" />
      <button className="chip" onClick={onClick} style={{ '--accent': c.color }}>
        <span className="chip-icon">{c.icon}</span>
        <span className="chip-text">
          <strong>{c.name}</strong>
          <small>{c.progress} / {c.total} {c.star && <b className="star">★</b>}</small>
        </span>
      </button>
      {c.status === 'done' && <span className="state done-state">✓</span>}
      {c.status === 'locked' && <span className="state lock-state">🔒</span>}
      {c.status === 'current' && <span className="orb" />}
    </div>
  );
}

function Modal({ course, onClose }) {
  if (!course) return null;
  const pct = Math.round((course.progress / course.total) * 100);
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="course-modal" onMouseDown={e => e.stopPropagation()} style={{ '--accent': course.color }}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className="modal-icon">{course.icon}</div>
        <h2>{course.name}</h2>
        <p>{course.description}</p>
        <div className="modal-stats"><b>{course.progress}/{course.total}</b><span>levels completed</span><b className="xp-gain">+{course.xp} XP</b></div>
        <div className="bar"><i style={{ width: pct + '%' }} /></div>
        <button className="start-btn" disabled={course.status === 'locked'}>
          {course.status === 'locked' ? 'Locked' : `Continue Level ${Math.min(course.progress + 1, course.total)} →`}
        </button>
      </div>
    </div>
  );
}

const THEME_KEY = 'ab6-theme';

function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) { /* storage unavailable */ }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignore */ }
  }, [theme]);
  return [theme, () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))];
}

function useCountUp(target, ms = 1300) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(target); return; }
    let raf, t0;
    const step = t => {
      if (t0 === undefined) t0 = t;
      const p = Math.min((t - t0) / ms, 1);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

function ThemeToggle({ theme, onToggle }) {
  const dark = theme === 'dark';
  return (
    <button className="theme-toggle" onClick={onToggle} role="switch" aria-checked={dark}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} title={dark ? 'Light mode' : 'Dark mode'}>
      <span className="tt-track"><span className="tt-thumb">{dark ? '🌙' : '☀️'}</span></span>
    </button>
  );
}

function App() {
  const [theme, toggleTheme] = useTheme();
  const score = useCountUp(1250);
  const pct = useCountUp(38, 1400);
  const [selected, setSelected] = useState(null);
  const [active, setActive] = useState('Home');
  const [search, setSearch] = useState('');
  const q = search.trim().toLowerCase();
  const list = courses.filter(c => c.name.toLowerCase().includes(q));

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand"><span className="brand-bot">🤖</span><b>AB6 Robotics</b></div>
        <nav className="top-nav"><a>Learn</a><i>•</i><a>Build</a><i>•</i><a>Become</a></nav>
        <label className="search">
          <span>⌕</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses, skills, or topics..." />
        </label>
        <button className="bell" aria-label="Notifications">🔔<em>3</em></button>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        {/* <div className="user"><span>B</span>bansi@gmail.com</div> */}
      </header>

      <div className="layout">
        <aside className="sidebar">
          <nav>
            {nav.map(([i, t]) => (
              <button key={t} className={active === t ? 'selected' : ''} onClick={() => setActive(t)}>
                <span className="nav-ico">{i}</span>{t}{t === 'Challenges' && <em>3</em>}
              </button>
            ))}
          </nav>
          <div className="mascot">
            <p>Small steps.<br />Big robots!</p>
            <span>🤖</span>
          </div>
          <div className="next-badge">
            <div><span>🌱 Next badge</span><b>12/15</b></div>
            <div className="bar"><i style={{ width: '80%' }} /></div>
            <p>Keep learning to unlock your next badge!</p>
          </div>
        </aside>

        <main className="main">
          <section className="hero">
            <div className="hero-copy">
              <small>✦ YOUR ROBOTICS JOURNEY</small>
              <h1>Hey Bansi! <span className="wave"></span></h1>
              <p>Every skill you unlock builds a smarter you.</p>
              <button className="btn-green" onClick={() => setSelected(courses[3])}>Continue Learning →</button>
            </div>
            <div className="level-card">
              <div className="ring" style={{ '--p': 38 }}><span>{pct}%</span></div>
              <div><b>Level 3</b><div className="bar"><i style={{ width: '53%' }} /></div><small>320 / 600 XP</small></div>
            </div>
          </section>

          <section className="map-card">
            <div className="map-head">
              <span className="compass-ico">🧭</span>
              <div><h2>Learning Map</h2><p>Explore different worlds, complete missions, and unlock new skills!</p></div>
              <div className="legend">
                <span><i className="g" />Completed</span><span><i className="p" />Current</span><span><i className="x" />Locked</span>
              </div>
            </div>
            <div className="world-map">
              <span className="cloud cl1" aria-hidden="true">☁</span><span className="cloud cl2" aria-hidden="true">☁</span><span className="cloud cl3" aria-hidden="true">☁</span>
              {list.map((c, i) => <Island key={c.id} c={c} i={i} onClick={() => setSelected(c)} />)}
              {list.length === 0 && <p className="empty">No course matches “{search}”. Try another keyword.</p>}
            </div>
          </section>

          <section className="lower">
            <div className="mission">
              <span className="m-eye">👁</span>
              <div className="m-text">
                <small>Current Mission</small>
                <h3>Sensing &amp; Perception — Level 8</h3>
                <p>Learn how robots perceive their environment using sensors and AI.</p>
                <button className="btn-purple" onClick={() => setSelected(courses[3])}>Continue →</button>
              </div>
              <div className="reward"><small>Reward</small><b>★ +150 XP</b><span>◷ 20 min</span></div>
            </div>
            <div className="quick">
              <h3>⚡ Quick Actions</h3>
              <div className="quick-grid">
                {[['🏆', 'Leaderboard'], ['👥', 'Community'], ['📖', 'Resources'], ['🤖', 'AI Tutor']].map(([i, t]) => <button key={t}><span>{i}</span>{t}</button>)}
              </div>
            </div>
          </section>
        </main>

        <aside className="rightbar">
          <section className="profile">
            <div className="p-top"><div className="avatar">B</div><b>bansi@gmail.com</b><small>Rookie Explorer ✎</small></div>
            <div className="p-xp">
              <div className="row"><b>Level 3</b><span>320 / 600 XP</span></div>
              <div className="bar"><i style={{ width: '53%' }} /></div>
              <div className="stats">
                <div><small>⭐ Total Score</small><b>{score.toLocaleString()}</b><em>↑ +320</em></div>
                <div><small>🔥 Streak</small><b>7 <span>Days</span></b></div>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-title"><h3>Your Badges</h3><a>View all →</a></div>
            <div className="badges">
              {[['★', 'First Step', 'b1'], ['⚡', 'Quick Learner', 'b2'], ['⚙', 'Problem Solver', 'b3'], ['🔒', 'Next Up', 'b4']].map(([i, t, k]) => (
                <span key={t}><i className={k}>{i}</i><small>{t}</small></span>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-title"><h3>Daily Challenges</h3><a>View all →</a></div>
            {[['✓', 'Complete 5 lessons in Control', '+100 XP', 'ok'], ['◎', 'Finish Kinematics Level 10', '+200 XP', 'pu'], ['⚡', 'Score 80%+ on a quiz', '+150 XP', 'or']].map(([i, t, x, k]) => (
              <div className="challenge" key={t}>
                <span className={'c-ico ' + k}>{i}</span>
                <div><b>{t}</b><small>{x}</small></div>
                <span>🎁</span>
              </div>
            ))}
          </section>

          <section className="future">
            <span>🏆</span>
            <p>You’re not just learning…<br /><b>you’re building the future!</b></p>
          </section>
        </aside>
      </div>
      <Modal course={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);