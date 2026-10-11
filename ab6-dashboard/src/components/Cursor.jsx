import React, { useEffect, useRef } from 'react';

/* Custom cursor: glowing dot + lagging ring that morphs by target, click burst, sparkle trail.
   Only active for fine pointers (mouse/trackpad); touch devices keep the native behaviour. */
const CLICKABLE = 'a, button:not(:disabled), [role="tab"], [role="switch"], label, .island .chip, summary';

export default function Cursor() {
  const root = useRef(null);
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const html = document.documentElement;
    html.classList.add('has-cursor');
    const el = root.current;
    let x = -100, y = -100, rx = -100, ry = -100, raf, shown = false, lastTrail = 0;

    const setMode = target => {
      const input = target.closest && target.closest('input, textarea');
      const click = !input && target.closest && target.closest(CLICKABLE);
      el.dataset.mode = input ? 'text' : click ? 'link' : '';
      const accentEl = target.closest && target.closest('[style*="--accent"]');
      const c = accentEl ? getComputedStyle(accentEl).getPropertyValue('--accent').trim() : '';
      if (c) el.style.setProperty('--cur', c); else el.style.removeProperty('--cur');
    };

    const move = e => {
      x = e.clientX; y = e.clientY;
      if (!shown) { shown = true; rx = x; ry = y; el.classList.add('show'); }
      dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      setMode(e.target);
      const now = performance.now();
      if (!reduce && now - lastTrail > 45) {
        lastTrail = now;
        const s = document.createElement('i');
        s.className = 'cursor-trail';
        s.style.left = x + (Math.random() * 10 - 5) + 'px'; s.style.top = y + (Math.random() * 10 - 5) + 'px';
        document.body.appendChild(s); setTimeout(() => s.remove(), 700);
      }
    };
    const down = () => el.classList.add('down');
    const up = () => el.classList.remove('down');
    const click = e => {
      if (reduce) return;
      const b = document.createElement('i');
      b.className = 'cursor-burst'; b.style.left = e.clientX + 'px'; b.style.top = e.clientY + 'px';
      document.body.appendChild(b); setTimeout(() => b.remove(), 650);
    };
    const leave = () => el.classList.remove('show');
    const enter = () => { if (shown) el.classList.add('show'); };
    const loop = () => {
      rx += (x - rx) * (reduce ? 1 : .17); ry += (y - ry) * (reduce ? 1 : .17);
      ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    addEventListener('mousemove', move); addEventListener('mousedown', down); addEventListener('mouseup', up); addEventListener('click', click);
    document.addEventListener('mouseleave', leave); document.addEventListener('mouseenter', enter);
    return () => {
      cancelAnimationFrame(raf); html.classList.remove('has-cursor');
      removeEventListener('mousemove', move); removeEventListener('mousedown', down); removeEventListener('mouseup', up); removeEventListener('click', click);
      document.removeEventListener('mouseleave', leave); document.removeEventListener('mouseenter', enter);
    };
  }, []);

  return (
    <div className="cursor" ref={root} aria-hidden="true">
      <div className="cursor-ring" ref={ring}><i /></div>
      <div className="cursor-dot" ref={dot}><i /></div>
    </div>
  );
}
