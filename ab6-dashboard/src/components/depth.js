/* Pointer-driven 3D depth for the dashboard — no dependencies.
 *
 * One delegated listener (rAF-throttled) drives:
 *   • card tilt        .panel / .hero / .next-badge  → --ax --ay --ang --lift (+ --px --py for inner parallax)
 *   • map parallax     .map-stage                    → --mpx --mpy  (-1..1)
 *   • page parallax    <html>                        → --bgx --bgy  (-1..1)
 * All motion itself lives in CSS (individual `rotate` / `translate` properties), so it
 * composes with the existing `transform` animations instead of fighting them.
 */
const CARD = '.panel.glass, .hero.glass, .next-badge.glass';
const TILT = { hero: 2.2, panel: 4.2, 'next-badge': 4.2 };
const LIFT = { hero: 10, panel: 16, 'next-badge': 16 };

const kind = el => (el.classList.contains('hero') ? 'hero' : el.classList.contains('next-badge') ? 'next-badge' : 'panel');

export function initDepth() {
  const mq = q => window.matchMedia(q).matches;
  if (mq('(prefers-reduced-motion: reduce)') || !mq('(hover: hover) and (pointer: fine)')) return () => {};

  /* --bgx/--bgy are only read by the .aurora blobs, so write them THERE.
     Writing them on <html> made every element inherit a changed variable -> a full-page style recalc per frame. */
  const bg = document.querySelector('.aurora') || document.documentElement;
  let card = null, stage = null, glass = null, cardRect = null, stageRect = null, glassRect = null, ev = null, raf = 0, bx = 0, by = 0;

  const resetCard = el => {
    ['--ax', '--ay', '--ang', '--lift', '--px', '--py'].forEach(p => el.style.removeProperty(p));
    el.classList.remove('is-tilting');
  };
  const resetStage = el => { el.style.removeProperty('--mpx'); el.style.removeProperty('--mpy'); };
  const setBg = (nx, ny) => {
    if (Math.abs(nx - bx) < 0.004 && Math.abs(ny - by) < 0.004) return; // skip no-op writes
    bx = nx; by = ny;
    bg.style.setProperty('--bgx', nx.toFixed(3)); bg.style.setProperty('--bgy', ny.toFixed(3));
  };
  /* rects are cached while the pointer stays on the same element (a tilting card moves, so re-measuring it
     every frame forced a layout AND fed the tilt back into itself); dropped on scroll / resize */
  const dropRects = () => { cardRect = stageRect = glassRect = null; };

  const frame = () => {
    raf = 0;
    const e = ev; if (!e) return;
    const t = e.target instanceof Element ? e.target : null;
    const c = t && t.closest(CARD);
    const s = t && t.closest('.map-stage');
    const g = t && t.closest('.glass');           // cursor spotlight target (was a separate mousemove handler in main.jsx)

    /* ---- reads first ---- */
    if (c !== card) cardRect = null;
    if (s !== stage) stageRect = null;
    if (g !== glass) glassRect = null;
    if (c && !cardRect) cardRect = c.getBoundingClientRect();
    if (s && !stageRect) stageRect = s.getBoundingClientRect();
    if (g && !glassRect) glassRect = g === c ? cardRect : g.getBoundingClientRect();

    /* ---- then writes ---- */
    setBg((e.clientX / innerWidth - .5) * 2, (e.clientY / innerHeight - .5) * 2);

    if (card && card !== c) { resetCard(card); card = null; }
    if (c) {
      const r = cardRect;
      const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      const k = kind(c), max = TILT[k];
      c.style.setProperty('--ax', (-py).toFixed(3));
      c.style.setProperty('--ay', px.toFixed(3));
      c.style.setProperty('--ang', (Math.hypot(px, py) * 2 * max).toFixed(2) + 'deg');
      c.style.setProperty('--lift', LIFT[k] + 'px');
      c.style.setProperty('--px', px.toFixed(3));
      c.style.setProperty('--py', py.toFixed(3));
      c.classList.add('is-tilting');
      card = c;
    }

    if (g) {
      g.style.setProperty('--mx', e.clientX - glassRect.left + 'px');
      g.style.setProperty('--my', e.clientY - glassRect.top + 'px');
    }
    glass = g;

    if (stage && stage !== s) { resetStage(stage); stage = null; }
    if (s) {
      const r = stageRect;
      s.style.setProperty('--mpx', (((e.clientX - r.left) / r.width - .5) * 2).toFixed(3));
      s.style.setProperty('--mpy', (((e.clientY - r.top) / r.height - .5) * 2).toFixed(3));
      stage = s;
    }
  };

  const onMove = e => { ev = e; if (!raf) raf = requestAnimationFrame(frame); };
  const onLeave = () => {
    if (card) { resetCard(card); card = null; }
    if (stage) { resetStage(stage); stage = null; }
    dropRects(); setBg(0, 0);
  };

  addEventListener('pointermove', onMove, { passive: true });
  addEventListener('scroll', dropRects, { passive: true, capture: true });
  addEventListener('resize', dropRects, { passive: true });
  document.documentElement.addEventListener('mouseleave', onLeave);
  return () => {
    removeEventListener('pointermove', onMove);
    removeEventListener('scroll', dropRects, { capture: true });
    removeEventListener('resize', dropRects);
    document.documentElement.removeEventListener('mouseleave', onLeave);
    cancelAnimationFrame(raf);
    onLeave();
  };
}
