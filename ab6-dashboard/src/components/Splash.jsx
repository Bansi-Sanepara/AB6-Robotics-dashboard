import React, { useEffect, useState } from 'react';

const MSGS = [
  [0, 'Initializing robotics systems…'],
  [25, 'Calibrating sensors…'],
  [50, 'Loading learning worlds…'],
  [78, 'Syncing your progress…'],
  [100, 'Ready for launch!'],
];

export default function Splash({ onDone }) {
  const [p, setP] = useState(0);
  const [out, setOut] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

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
      const eased =
        x < 0.5
          ? 2 * x * x
          : 1 - Math.pow(-2 * x + 2, 2) / 2;

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

  const msg = [...MSGS]
    .reverse()
    .find(([key]) => p >= key)[1];

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

      <main className="splash-center welcome-center">
        <div className="welcome-eyebrow">
          <span className="welcome-live-dot" />
          THE FUTURE IS BUILT HERE
        </div>

        <h1 className="welcome-title">
          <span className="welcome-line welcome-line-one">
            WELCOME TO THE
          </span>

          <span className="welcome-line welcome-line-two">
            WORLD OF
          </span>

          <span className="welcome-line welcome-highlight">
            ROBOTICS<span className="welcome-period">.</span>
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

      <div className="welcome-bottom-label">
        ENGINEER YOUR IMAGINATION
      </div>

      <button
        className="splash-skip"
        onClick={() => window.__skipSplash?.()}
      >
        Skip ›
      </button>
    </div>
  );
}
