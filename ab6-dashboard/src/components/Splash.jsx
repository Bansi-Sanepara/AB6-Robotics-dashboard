import React, { useEffect, useState } from 'react';
import { LogoMark } from './Icon.jsx';

const MSGS = [[0, 'Booting servos…'], [25, 'Calibrating sensors…'], [50, 'Loading learning worlds…'], [78, 'Syncing your progress…'], [100, 'Ready for launch!']];

export default function Splash({ onDone }) {
  const [p, setP] = useState(0);
  const [out, setOut] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const D = reduce ? 600 : 2900;
    let raf, t0, closed = false;
    const finish = () => { if (closed) return; closed = true; setOut(true); setTimeout(onDone, 850); };
    const step = t => {
      if (t0 === undefined) t0 = t;
      const x = Math.min((t - t0) / D, 1);
      setP(Math.round((x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2) * 100));
      if (x < 1) raf = requestAnimationFrame(step); else setTimeout(finish, 350);
    };
    raf = requestAnimationFrame(step);
    window.__skipSplash = finish;
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  const msg = [...MSGS].reverse().find(([k]) => p >= k)[1];
  return (
    <div className={'splash' + (out ? ' out' : '')} role="status" aria-label="Loading AB6 Robotics">
      <div className="splash-aurora" />
      <div className="splash-grid" />
      <div className="splash-center">
        <div className="logo-stage">
          <i className="orbit o1" /><i className="orbit o2" /><i className="orbit o3" />
          <i className="orbit-dot d1" /><i className="orbit-dot d2" />
          <span className="logo-pulse" />
          <LogoMark size={96} draw />
        </div>
        <h1 className="splash-title" aria-label="AB6 Robotics">
          {'AB6 Robotics'.split('').map((ch, i) => (
            <span key={i} style={{ '--i': i }} className={i >= 4 ? 'tint' : ''}>{ch === ' ' ? ' ' : ch}</span>
          ))}
        </h1>
        <p className="splash-tag"><b>Build.</b> <b>Learn.</b> <b>Become.</b></p>
        <div className="splash-bar"><i style={{ width: p + '%' }} /><em /></div>
        <div className="splash-meta"><span>{msg}</span><b>{p}%</b></div>
      </div>
      <button className="splash-skip" onClick={() => window.__skipSplash && window.__skipSplash()}>Skip ›</button>
    </div>
  );
}
