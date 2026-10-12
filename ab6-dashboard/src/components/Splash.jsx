import React, { useEffect, useRef, useState } from 'react';

const MSGS = [
  [0, 'Initializing robotics systems…'],
  [25, 'Calibrating sensors…'],
  [50, 'Loading learning worlds…'],
  [78, 'Syncing your progress…'],
  [100, 'Ready for launch!'],
];

/* Floating 3D glass cubes: position, size, depth (z), spin/float duration */
const CUBES = [
  { l: '11%', t: '22%', s: 34, z: 140, d: 14 },
  { l: '85%', t: '27%', s: 48, z: 70, d: 18 },
  { l: '19%', t: '73%', s: 28, z: 220, d: 11 },
  { l: '79%', t: '70%', s: 38, z: 150, d: 16 },
  { l: '52%', t: '9%', s: 22, z: -80, d: 12 },
  { l: '93%', t: '52%', s: 20, z: -120, d: 13 },
  { l: '6%', t: '48%', s: 24, z: -90, d: 15 },
];

/* Splits text into individually animated letters (each gets its own 3D flip-in) */
function Letters({ text, base = 0 }) {
  return text.split('').map((ch, i) => (
    <span key={i} className="wl" style={{ '--i': base + i }} aria-hidden="true">
      {ch === ' ' ? '\u00A0' : ch}
    </span>
  ));
}

export default function Splash({ onDone }) {
  const [p, setP] = useState(0);
  const [out, setOut] = useState(false);
  const stageRef = useRef(null);

  /* progress + exit (unchanged behaviour) */
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduce ? 600 : 2900;
    let raf;
    let timeout;
    let start;
    let closed = false;

    const finish = () => {
      if (closed) return;
      closed = true;
      setOut(true);
      timeout = setTimeout(() => {
        onDone?.();
      }, 850);
    };

    const step = (t) => {
      if (start === undefined) start = t;
      const x = Math.min((t - start) / duration, 1);
      const eased = x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
      setP(Math.round(eased * 100));
      if (x < 1) {
        raf = requestAnimationFrame(step);
      } else {
        timeout = setTimeout(finish, 350);
      }
    };

    raf = requestAnimationFrame(step);
    window.__skipSplash = finish;

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
      delete window.__skipSplash;
    };
  }, [onDone]);

  /* 3D parallax: scene tilts toward the pointer, and sways on its own when idle */
  useEffect(() => {
    const el = stageRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, last = -1e9, raf;

    const onMove = (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      last = performance.now();
    };
    const loop = (t) => {
      if (t - last > 2200) { tx = Math.sin(t / 2400) * 0.6; ty = Math.cos(t / 3100) * 0.35; }
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      el.style.setProperty('--ry', (cx * 10).toFixed(2) + 'deg');
      el.style.setProperty('--rx', (-cy * 7).toFixed(2) + 'deg');
      el.style.setProperty('--sx', (1 - cx * 1.3).toFixed(2));   // text-extrusion direction
      el.style.setProperty('--sy', (1.1 - cy * 1).toFixed(2));
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const msg = [...MSGS].reverse().find(([key]) => p >= key)[1];

  return (
    <div
      className={`splash${out ? ' out' : ''}`}
      role="status"
      aria-label="Welcome to the world of robotics"
    >
      <div className="splash-aurora" />
      <div className="splash-grid" />

      {/* Ambient robotics decorations */}
      <div className="welcome-orbit orbit-a" />
      <div className="welcome-orbit orbit-b" />
      <div className="welcome-cross cross-a">+</div>
      <div className="welcome-cross cross-b">+</div>
      <div className="welcome-particle particle-a" />
      <div className="welcome-particle particle-b" />
      <div className="welcome-particle particle-c" />

      {/* ---- 3D scene ---- */}
      <div className="w3d" aria-hidden="false">
        <div className="w3d-enter">
          <div className="w3d-stage" ref={stageRef}>
            <div className="w3d-floor" aria-hidden="true" />

            <div className="w3d-gyro" aria-hidden="true">
              <i className="g g1" /><i className="g g2" /><i className="g g3" />
              <i className="g-core" />
            </div>

            {CUBES.map((c, i) => (
              <div
                key={i}
                className="w3d-cube"
                aria-hidden="true"
                style={{ left: c.l, top: c.t, '--s': c.s + 'px', '--z': c.z + 'px', '--d': c.d + 's', '--dl': -i * 2.3 + 's' }}
              >
                <div className="cube-spin"><i /><i /><i /><i /><i /><i /></div>
              </div>
            ))}

            <main className="splash-center welcome-center w3d-content">
              <div className="welcome-eyebrow">
                <span className="welcome-live-dot" />
                THE FUTURE IS BUILT HERE
              </div>

              <h1 className="welcome-title" aria-label="Welcome to the world of robotics.">
                <span className="welcome-line welcome-line-one" style={{ '--z': '10px' }}>
                  <Letters text="WELCOME TO THE" base={0} />
                </span>
                <span className="welcome-line welcome-line-two" style={{ '--z': '45px' }}>
                  <Letters text="WORLD OF" base={14} />
                </span>
                <span className="welcome-line welcome-highlight" style={{ '--z': '90px' }}>
                  <Letters text="ROBOTICS" base={22} />
                  <span className="wl welcome-period" style={{ '--i': 30 }} aria-hidden="true">.</span>
                </span>
              </h1>

              <div className="welcome-divider">
                <span />
                <span />
                <span />
              </div>

              <p className="welcome-description">
                Build. Learn. Experiment.
                <br />
                <strong>Bring your ideas to life.</strong>
              </p>

              <div className="welcome-platform">
                <span className="welcome-platform-line" />
                <span>AB6 ROBOTICS LEARNING PLATFORM</span>
                <span className="welcome-platform-line" />
              </div>

              <div className="splash-bar">
                <i style={{ width: `${p}%` }} />
                <em />
              </div>

              <div className="splash-meta">
                <span>{msg}</span>
                <b>{p}%</b>
              </div>
            </main>
          </div>
        </div>
      </div>

      <div className="welcome-bottom-label">ENGINEER YOUR IMAGINATION</div>

      <button className="splash-skip" onClick={() => window.__skipSplash?.()}>
        Skip ›
      </button>
    </div>
  );
}
