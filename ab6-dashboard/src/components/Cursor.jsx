import React, { useEffect, useRef } from 'react';

/* Custom cursor: glowing dot + lagging ring that morphs by target, click burst, sparkle trail.
   Only active for fine pointers (mouse/trackpad); touch devices keep the native behaviour. */
const CLICKABLE = 'a, button:not(:disabled), [role="tab"], [role="switch"], label, .island .chip, summary';

const RING_EASE = 0.3;   // ring catch-up per 60fps frame: higher = tighter (1 = no trailing at all)
const TRAIL_STEP = 16;   // px the pointer must travel before the next sparkle
const TRAIL_MAX = 10;    // sparkles alive at once

export default function Cursor() {
  const root = useRef(null);
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const html = document.documentElement;
    html.classList.add('has-cursor');
    const el = root.current, dotEl = dot.current, ringEl = ring.current;
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0, last = 0, shown = false;
    let mode = '', cur = '', tx = -1e4, ty = -1e4, trails = 0;

    /* ONE write per frame, and only while something is moving.
       Time-based easing, so a dropped frame doesn't make the ring fall further behind. */
    const tick = now => {
      raf = 0;
      const dt = last ? Math.min(now - last, 50) : 16.7; last = now;
      const k = reduce ? 1 : 1 - Math.pow(1 - RING_EASE, dt / 16.7);
      rx += (x - rx) * k; ry += (y - ry) * k;
      const settled = Math.abs(x - rx) < 0.1 && Math.abs(y - ry) < 0.1;
      if (settled) { rx = x; ry = y; last = 0; }
      dotEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ringEl.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (!settled) raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const spark = (px, py) => {
      const s = document.createElement('i');
      s.className = 'cursor-trail';
      s.style.left = px + (Math.random() * 10 - 5) + 'px'; s.style.top = py + (Math.random() * 10 - 5) + 'px';
      const done = () => { if (s.isConnected) { s.remove(); trails--; } };
      s.addEventListener('animationend', done, { once: true });
      setTimeout(done, 800); // safety net
      trails++; document.body.appendChild(s);
    };

    /* mousemove stays dead cheap: store coords, schedule a frame. No DOM reads, no style writes. */
    const move = e => {
      x = e.clientX; y = e.clientY;
      if (!shown) { shown = true; rx = x; ry = y; el.classList.add('show'); }
      kick();
      if (!reduce && trails < TRAIL_MAX && Math.hypot(x - tx, y - ty) > TRAIL_STEP) { tx = x; ty = y; spark(x, y); }
    };

    /* Hover mode / accent colour only need re-evaluating when the element under the pointer changes
       (pointerover), and only touch the DOM when the value actually changed.
       --accent is an inline style, so read it directly: no getComputedStyle -> no forced style recalc. */
    const over = e => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const input = t.closest('input, textarea');
      const m = input ? 'text' : t.closest(CLICKABLE) ? 'link' : '';
      if (m !== mode) { mode = m; el.dataset.mode = m; }
      const accentEl = t.closest('[style*="--accent"]');
      const c = accentEl ? accentEl.style.getPropertyValue('--accent').trim() : '';
      if (c !== cur) { cur = c; if (c) el.style.setProperty('--cur', c); else el.style.removeProperty('--cur'); }
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

    const P = { passive: true };
    addEventListener('mousemove', move, P); addEventListener('mousedown', down, P); addEventListener('mouseup', up, P); addEventListener('click', click, P);
    document.addEventListener('pointerover', over, P);
    document.addEventListener('mouseleave', leave); document.addEventListener('mouseenter', enter);
    return () => {
      cancelAnimationFrame(raf); html.classList.remove('has-cursor');
      removeEventListener('mousemove', move); removeEventListener('mousedown', down); removeEventListener('mouseup', up); removeEventListener('click', click);
      document.removeEventListener('pointerover', over);
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
