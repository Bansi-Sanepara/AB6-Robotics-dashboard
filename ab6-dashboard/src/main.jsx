import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import './styles/themes.css';
import './styles/layout.css';
import './styles/dashboard.css';
import './styles/islands.css';
import './styles/effects.css';
import Icon, { LogoMark } from './components/Icon.jsx';
import Starfield from './components/Starfield.jsx';
import Splash from './components/Splash.jsx';
import Cursor from './components/Cursor.jsx';
import { RobotArm, Mascot } from './components/Art.jsx';
import { confetti } from './components/fx.js';

const A = '/assets/';
// status: done | current | locked   (x / y / w are % positions on the map stage)
const courses = [
  { id: 'control', name: 'Control Systems', icon: 'gear', color: '#22c55e', progress: 15, total: 15, status: 'done', star: true, xp: 180, x: 18.5, y: 29, w: 32, description: 'Master feedback, stability and robot control loops.' },
  { id: 'kinematics', name: 'Kinematics', icon: 'zap', color: '#2f9bff', progress: 14, total: 15, status: 'current', star: true, xp: 320, x: 50, y: 33, w: 37, description: 'Understand robot joints, links, motion and pose.' },
  { id: 'omx', name: 'OMX Kinematics', icon: 'target', color: '#ff4d4d', progress: 6, total: 11, status: 'locked', xp: 240, x: 83, y: 29, w: 30, description: 'Apply kinematics to the OMX robotic platform.' },
  { id: 'sensing', name: 'Sensing & Perception', icon: 'eye', color: '#8a52ff', progress: 8, total: 14, status: 'locked', xp: 210, x: 26, y: 72, w: 33, description: 'Teach robots to see, sense and understand the world.' },
  { id: 'sim', name: 'Sim-to-Real Kinematics', icon: 'hex', color: '#17c8a5', progress: 6, total: 13, status: 'locked', xp: 190, x: 72, y: 74, w: 24, description: 'Bridge simulation skills with real robotic systems.' }
];

const nav = [['home', 'Home'], ['book', 'My Learning'], ['trophy', 'Challenges'], ['bars', 'Leaderboard'], ['shield', 'Achievements'], ['users', 'Community'], ['clip', 'Resources']];
const FILTERS = ['All', 'Completed', 'Current', 'Locked'];
const statusOf = { done: 'Completed', current: 'Current', locked: 'Locked' };

const notifs = [
  ['bolt', 'Streak on fire!', 'You’re on a 7-day learning streak.', '2m'],
  ['star', 'New badge unlocked', 'Problem Solver is now in your collection.', '1h'],
  ['gift', 'Reward ready', 'Claim +100 XP from today’s challenge.', '3h']
];

/* ---------- hooks ---------- */
const THEME_KEY = 'ab6-theme';
function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { const s = localStorage.getItem(THEME_KEY); if (s === 'light' || s === 'dark') return s; } catch (e) { /* storage unavailable */ }
    return 'dark';
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignore */ }
  }, [theme]);
  return [theme, () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))];
}

function useCountUp(target, ms = 1300, start = true) {
  const [v, setV] = useState(0);
  const cur = useRef(0);
  useEffect(() => {
    if (!start) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { cur.current = target; setV(target); return; }
    const from = cur.current; let raf, t0;
    const step = t => {
      if (t0 === undefined) t0 = t;
      const p = Math.min((t - t0) / ms, 1);
      cur.current = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3)));
      setV(cur.current);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms, start]);
  return v;
}

/* ---------- small components ---------- */
function ThemeToggle({ theme, onToggle }) {
  const dark = theme === 'dark';
  return (
    <button className={'theme-toggle ' + theme} onClick={onToggle} role="switch" aria-checked={dark}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
      <span className="tt-knob" />
      <span className="tt-i sun"><Icon n="sun" size={17} /></span>
      <span className="tt-i moon"><Icon n="moon" size={16} /></span>
    </button>
  );
}

function Island({ c, i, onClick, dim }) {
  const tilt = useRef(null);
  const move = e => {
    const el = tilt.current; if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
    el.style.setProperty('--rx', (-py * 10).toFixed(2) + 'deg');
    el.style.setProperty('--ry', (px * 12).toFixed(2) + 'deg');
  };
  const leave = () => { const el = tilt.current; if (el) { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); } };
  return (
    <div className={`island is-${c.status}${dim ? ' dim' : ''}`} style={{ '--x': c.x + '%', '--y': c.y + '%', '--w': c.w + '%', '--i': i, '--accent': c.color }}
      onMouseMove={move} onMouseLeave={leave}>
      <div className="island-pop">
        <div className="island-float">
          <span className="island-glow" />
          {c.status === 'current' && <><span className="ring r1" /><span className="ring r2" /></>}
          <div className="island-tilt" ref={tilt}>
            <img src={A + 'island-' + c.id + '.png'} alt="" draggable="false" />
            {c.status === 'done' && <span className="state done-state"><Icon n="check" size={20} sw={3} /></span>}
            {c.status === 'locked' && <span className="state lock-state"><Icon n="lock" size={14} sw={2.4} /></span>}
          </div>
          <button className="chip" onClick={onClick} style={{ '--accent': c.color }} aria-label={`${c.name}, ${c.progress} of ${c.total}`}>
            <span className="chip-icon"><Icon n={c.icon} size={20} /></span>
            <span className="chip-text">
              <strong>{c.name}</strong>
              <small>{c.progress} / {c.total} {c.star && <Icon n="star" size={12} className="star" />}</small>
            </span>
          </button>
          {c.status === 'current' && <span className="current-pill">Current</span>}
        </div>
      </div>
    </div>
  );
}

function Modal({ course, onClose }) {
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, [onClose]);
  if (!course) return null;
  const pct = Math.round((course.progress / course.total) * 100);
  const locked = course.status === 'locked';
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="course-modal" onMouseDown={e => e.stopPropagation()} style={{ '--accent': course.color }} role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Close"><Icon n="x" size={18} /></button>
        <div className="modal-art"><img src={A + 'island-' + course.id + '.png'} alt="" /></div>
        <div className="modal-icon"><Icon n={course.icon} size={26} /></div>
        <h2>{course.name}</h2>
        <p>{course.description}</p>
        <div className="modal-stats"><b>{course.progress}/{course.total}</b><span>levels completed</span><b className="xp-gain">+{course.xp} XP</b></div>
        <div className="bar"><i style={{ width: pct + '%' }} /></div>
        <button className="start-btn" disabled={locked}>
          {locked ? <><Icon n="lock" size={16} /> Complete Kinematics to unlock</> : course.status === 'done' ? 'Review course' : `Continue Level ${Math.min(course.progress + 1, course.total)} →`}
        </button>
      </div>
    </div>
  );
}

function App() {
  const [theme, toggleTheme] = useTheme();
  const [splash, setSplash] = useState(true);
  const ready = !splash;
  const [xp, setXp] = useState(1250);
  const xpShown = useCountUp(xp, 1500, ready);
  const days = useCountUp(7, 1200, ready);
  const badgeN = useCountUp(5, 1000, ready);
  const [selected, setSelected] = useState(null);
  const [active, setActive] = useState('Home');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(3);
  const [claimed, setClaimed] = useState({});
  const [toast, setToast] = useState(null);
  const searchRef = useRef(null);
  const closeSplash = useCallback(() => setSplash(false), []);

  const say = (msg, icon = 'star') => { setToast({ msg, icon, k: Date.now() }); };
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2800); return () => clearTimeout(t); }, [toast]);

  /* ⌘K / Ctrl+K focuses search */
  useEffect(() => {
    const k = e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); searchRef.current?.focus(); } };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, []);
  /* cursor spotlight on glass cards */
  useEffect(() => {
    const m = e => {
      const el = e.target.closest && e.target.closest('.glass');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', e.clientX - r.left + 'px'); el.style.setProperty('--my', e.clientY - r.top + 'px');
    };
    addEventListener('mousemove', m); return () => removeEventListener('mousemove', m);
  }, []);
  /* button ripple */
  useEffect(() => {
    const d = e => {
      const b = e.target.closest && e.target.closest('button:not(:disabled)');
      if (!b) return;
      const r = b.getBoundingClientRect(); const s = document.createElement('span');
      s.className = 'ripple'; const z = Math.max(r.width, r.height) * 2;
      Object.assign(s.style, { width: z + 'px', height: z + 'px', left: e.clientX - r.left - z / 2 + 'px', top: e.clientY - r.top - z / 2 + 'px' });
      b.appendChild(s); setTimeout(() => s.remove(), 650);
    };
    addEventListener('pointerdown', d); return () => removeEventListener('pointerdown', d);
  }, []);
  /* hero parallax */
  const heroRef = useRef(null);
  const heroMove = e => {
    const el = heroRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5).toFixed(3));
    el.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5).toFixed(3));
  };

  const q = search.trim().toLowerCase();
  const matches = c => (filter === 'All' || statusOf[c.status] === filter) && c.name.toLowerCase().includes(q);
  const anyMatch = courses.some(matches);

  const claim = (idx, e) => {
    if (idx !== 0) { say(idx === 1 ? 'Finish Kinematics Level 10 to claim this reward' : 'Score 80%+ on a quiz to claim this reward', 'lock'); return; }
    if (claimed[idx]) return;
    const r = e.currentTarget.getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top + r.height / 2);
    setClaimed(c => ({ ...c, [idx]: true })); setXp(x => x + 100);
    say('+100 XP claimed — nice work!', 'gift');
  };

  const challenges = [
    ['check', 'Complete 5 lessons in Control', '+100 XP', 'ok'],
    ['target', 'Finish Kinematics Level 10', '+200 XP', 'pu'],
    ['bolt', 'Score 80%+ on a quiz', '+150 XP', 'or']
  ];

  return (
    <>
      <Cursor />
      <Starfield />
      <div className="aurora" aria-hidden="true"><i className="a1" /><i className="a2" /><i className="a3" /></div>
      {splash && <Splash onDone={closeSplash} />}
      <div className={'app' + (ready ? ' ready' : '')}>
        <header className="topbar">
          <div className="brand reveal" style={{ '--d': '.05s' }}>
            <LogoMark size={42} /><b>AB6 <span>Robotics</span></b>
          </div>
          <label className="search reveal" style={{ '--d': '.12s' }}>
            <Icon n="search" size={18} />
            <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses, skills, or topics..." />
            <kbd>⌘ K</kbd>
          </label>
          <div className="top-right reveal" style={{ '--d': '.18s' }}>
            <div className="bell-wrap">
              <button className={'bell' + (notifCount ? ' wiggle' : '')} aria-label="Notifications" onClick={() => { setNotifOpen(o => !o); setNotifCount(0); }}>
                <Icon n="bell" size={22} />{notifCount > 0 && <em>{notifCount}</em>}
              </button>
              {notifOpen && (
                <div className="notif glass" onMouseLeave={() => setNotifOpen(false)}>
                  <h4>Notifications</h4>
                  {notifs.map(([ic, t, d, ago]) => (
                    <div className="notif-row" key={t}><span><Icon n={ic} size={16} /></span><div><b>{t}</b><small>{d}</small></div><em>{ago}</em></div>
                  ))}
                </div>
              )}
            </div>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button className="user" aria-label="Account">
              <span className="avatar">B<i /></span>
              <span className="user-text"><b>Bansi Sanepara</b><small>Rookie Explorer • Level 3</small></span>
              <Icon n="chevron" size={16} />
            </button>
          </div>
        </header>

        <div className="layout">
          <aside className="sidebar">
            <nav>
              {nav.map(([i, t], k) => (
                <button key={t} className={'reveal' + (active === t ? ' selected' : '')} style={{ '--d': .2 + k * .05 + 's' }} onClick={() => setActive(t)}>
                  <Icon n={i} size={21} /><span>{t}</span>
                </button>
              ))}
            </nav>
            <div className="mascot reveal" style={{ '--d': '.6s' }}>
              <Mascot />
              <p>Small steps.<br />Big robots!</p>
            </div>
            <div className="next-badge glass reveal" style={{ '--d': '.7s' }}>
              <div><span>Next badge</span><b>12/15</b></div>
              <div className="bar"><i style={{ width: ready ? '80%' : '0%' }} /></div>
              <p>Keep learning to unlock your next badge!</p>
            </div>
          </aside>

          <main className="main">
            <section className="hero glass reveal" style={{ '--d': '.2s' }} ref={heroRef} onMouseMove={heroMove}>
              <div className="hero-fx"><i className="scan" />{Array.from({ length: 14 }, (_, i) => <b key={i} style={{ '--i': i }} />)}</div>
              <div className="hero-copy">
                <small className="hello">Hello, Bansi! <span className="wave"></span></small>
                <h1>Build. Learn. Become.</h1>
                <p>Your robotics journey starts here. Explore courses, complete missions and unlock new skills!</p>
              </div>
              <div className="hero-robot"><RobotArm /></div>
              <div className="stats">
                <div className="stat"><span className="s-ico gold"><Icon n="star" size={24} /></span><div><b>{xpShown.toLocaleString()}</b><small>XP <em>↑320</em></small></div></div>
                <div className="stat"><span className="s-ico blue"><Icon n="hex" size={24} sw={2} /></span><div><b>Level 3</b><small>Rookie Explorer</small></div></div>
                <div className="stat"><span className="s-ico fire"><Icon n="flame" size={26} /></span><div><b>{days}</b><small>Days</small></div></div>
                <div className="stat"><span className="s-ico num">{badgeN}</span><div><b className="one">{badgeN}</b><small>Badges Unlocked</small></div></div>
              </div>
            </section>

            <section className="map-card glass reveal" style={{ '--d': '.35s' }}>
              <div className="map-head">
                <span className="compass-ico"><Icon n="compass" size={26} /></span>
                <div className="map-title"><h2>Learning Map</h2><p>Explore different worlds, complete missions, and unlock new skills!</p></div>
                <div className="tabs" role="tablist">
                  {FILTERS.map(f => <button key={f} role="tab" aria-selected={filter === f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>{f}</button>)}
                  <span className="tab-glow" style={{ '--n': FILTERS.indexOf(filter) }} />
                </div>
              </div>
              <div className="map-stage">
                <div className="map-nebula" />
                <svg className="paths" viewBox="0 0 905 560" preserveAspectRatio="none" aria-hidden="true">
                  <path id="p1" className="solid" d="M262 190 C320 225 365 232 398 228" />
                  <path id="p2" d="M536 232 C640 290 770 300 770 250" />
                  <path id="p3" d="M410 330 C340 385 300 400 292 420" />
                  <path id="p4" d="M330 470 C430 500 480 495 540 470" />
                  <path id="p5" d="M780 300 C810 350 790 380 770 400" />
                  <circle r="4" fill="#7df0ff" className="trav"><animateMotion dur="4.5s" repeatCount="indefinite"><mpath href="#p1" /></animateMotion></circle>
                  <circle r="4" fill="#7df0ff" className="trav"><animateMotion dur="6s" begin="1s" repeatCount="indefinite"><mpath href="#p2" /></animateMotion></circle>
                </svg>
                {['r1', 'r2', 'r3', 'r4', 'r5'].map(r => <span key={r} className={'rock ' + r} />)}
                {Array.from({ length: 16 }, (_, i) => <i key={i} className="sparkle" style={{ '--i': i, left: (i * 53) % 97 + 1 + '%', top: (i * 37) % 90 + 4 + '%' }} />)}
                {courses.map((c, i) => <Island key={c.id} c={c} i={i} dim={!matches(c)} onClick={() => setSelected(c)} />)}
                {!anyMatch && <p className="empty">No world matches “{search || filter}”. Try another keyword.</p>}
              </div>
            </section>
          </main>

          <aside className="rightbar">
            <section className="panel glass reveal" style={{ '--d': '.25s' }}>
              <div className="panel-title"><span className="p-ico"><Icon n="target" size={22} /></span><h3>Current Mission</h3><a>View all <Icon n="arrow" size={13} /></a></div>
              <div className="mission">
                <div className="m-thumb"><img src={A + 'island-kinematics.png'} alt="" /></div>
                <div><b>Kinematics Basics</b><p>Learn about forward and inverse kinematics in robotic systems.</p></div>
              </div>
              <div className="bar thin"><i style={{ width: ready ? '58%' : '0%' }} /></div>
              <div className="m-foot"><small>3/5 lessons</small><button className="btn-blue" onClick={() => setSelected(courses[1])}>Continue <Icon n="arrow" size={15} /></button></div>
            </section>

            <section className="panel glass reveal" style={{ '--d': '.33s' }}>
              <div className="panel-title"><span className="p-ico"><Icon n="shield" size={21} /></span><h3>Your Badges</h3><a>View all <Icon n="arrow" size={13} /></a></div>
              <div className="badges">
                {[['star', 'First Step', 'b1'], ['bolt', 'Quick Learner', 'b2'], ['gear', 'Problem Solver', 'b3'], ['lock', 'Next Up', 'b4']].map(([i, t, k], n) => (
                  <button key={t} className="badge" style={{ '--n': n }} onClick={() => say(k === 'b4' ? 'Keep learning to unlock this badge' : `${t} — unlocked!`, i)}>
                    <i className={'hexb ' + k}><Icon n={i} size={22} sw={k === 'b4' ? 2.2 : 2} /></i><small>{t}</small>
                  </button>
                ))}
              </div>
            </section>

            <section className="panel glass reveal" style={{ '--d': '.41s' }}>
              <div className="panel-title"><span className="p-ico"><Icon n="gear" size={21} /></span><h3>Daily Challenges</h3><a>View all <Icon n="arrow" size={13} /></a></div>
              {challenges.map(([i, t, x, k], idx) => (
                <div className="challenge" key={t}>
                  <span className={'c-ico ' + k}><Icon n={i} size={20} sw={i === 'check' ? 3 : 2} /></span>
                  <div><b>{t}</b><small>{x}</small></div>
                  <button className={'gift' + (idx === 0 && !claimed[0] ? ' ready' : '') + (claimed[idx] ? ' done' : '')} onClick={e => claim(idx, e)} aria-label="Claim reward">
                    <Icon n={claimed[idx] ? 'check' : 'gift'} size={18} sw={claimed[idx] ? 3 : 2} />
                  </button>
                </div>
              ))}
            </section>

            <section className="panel glass reveal" style={{ '--d': '.49s' }}>
              <div className="panel-title"><span className="p-ico"><Icon n="zap" size={20} /></span><h3>Quick Actions</h3></div>
              <div className="quick-grid">
                {[['bars', 'Leaderboard', 'q1'], ['users', 'Community', 'q2'], ['clip', 'Resources', 'q3'], ['robot', 'AI Tutor', 'q4']].map(([i, t, k]) => (
                  <button key={t} className={k} onClick={() => say(t + ' is coming soon', i)}><span><Icon n={i} size={24} /></span>{t}</button>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <Modal course={selected} onClose={() => setSelected(null)} />
        {toast && <div className="toast" key={toast.k}><Icon n={toast.icon} size={18} />{toast.msg}</div>}
      </div>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
