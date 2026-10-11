/* Lightweight confetti burst — no dependencies */
export function confetti(x, y) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = document.createElement('canvas');
  Object.assign(cv.style, { position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 300 });
  const dpr = Math.min(devicePixelRatio || 1, 2);
  cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');
  const cols = ['#ffb923', '#35e0ff', '#7a4dff', '#22c55e', '#ff5d73', '#2f7bff'];
  const ps = Array.from({ length: 90 }, () => {
    const a = Math.random() * Math.PI * 2, v = Math.random() * 9 + 4;
    return { x: x * dpr, y: y * dpr, vx: Math.cos(a) * v * dpr, vy: (Math.sin(a) * v - 5) * dpr, s: (Math.random() * 6 + 4) * dpr, r: Math.random() * 6, vr: Math.random() * .4 - .2, c: cols[(Math.random() * cols.length) | 0], life: 1 };
  });
  let raf;
  const tick = () => {
    ctx.clearRect(0, 0, cv.width, cv.height);
    let alive = false;
    for (const p of ps) {
      p.vy += .32 * dpr; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life -= .011;
      if (p.life > 0) {
        alive = true; ctx.save(); ctx.globalAlpha = Math.max(p.life, 0); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore();
      }
    }
    if (alive) raf = requestAnimationFrame(tick); else { cancelAnimationFrame(raf); cv.remove(); }
  };
  tick();
}
