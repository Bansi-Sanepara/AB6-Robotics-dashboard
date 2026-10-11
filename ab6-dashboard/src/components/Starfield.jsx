import React, { useEffect, useRef } from 'react';

export default function Starfield() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; const ctx = cv.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w, h, dpr, raf, stars = [], shoot = null, mx = 0, my = 0, tx = 0, ty = 0;
    const init = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr;
      const n = Math.round((innerWidth * innerHeight) / 9000);
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h, r: (Math.random() * 1.3 + .3) * dpr,
        z: Math.random() * .9 + .1, p: Math.random() * 6.28, s: Math.random() * .02 + .005,
        c: Math.random() < .25 ? '120,200,255' : Math.random() < .15 ? '190,150,255' : '255,255,255'
      }));
    };
    const onMove = e => { tx = (e.clientX / innerWidth - .5); ty = (e.clientY / innerHeight - .5); };
    const draw = () => {
      mx += (tx - mx) * .05; my += (ty - my) * .05;
      const light = document.documentElement.dataset.theme === 'light';
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.p += s.s;
        const a = (.35 + Math.sin(s.p) * .35) * s.z + .1;
        const x = (s.x + mx * 40 * s.z * dpr + w) % w, y = (s.y + my * 40 * s.z * dpr + h) % h;
        ctx.fillStyle = light ? `rgba(47,107,255,${a * .35})` : `rgba(${s.c},${a})`;
        ctx.beginPath(); ctx.arc(x, y, s.r, 0, 6.283); ctx.fill();
      }
      if (!light) {
        if (!shoot && Math.random() < .004) shoot = { x: Math.random() * w * .8, y: Math.random() * h * .4, l: 0 };
        if (shoot) {
          const g = ctx.createLinearGradient(shoot.x, shoot.y, shoot.x - 120 * dpr, shoot.y - 60 * dpr);
          g.addColorStop(0, 'rgba(160,220,255,.9)'); g.addColorStop(1, 'rgba(160,220,255,0)');
          ctx.strokeStyle = g; ctx.lineWidth = 1.6 * dpr; ctx.beginPath();
          ctx.moveTo(shoot.x, shoot.y); ctx.lineTo(shoot.x - 120 * dpr, shoot.y - 60 * dpr); ctx.stroke();
          shoot.x += 14 * dpr; shoot.y += 7 * dpr; shoot.l++;
          if (shoot.l > 60) shoot = null;
        }
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    init(); draw();
    addEventListener('resize', init); addEventListener('mousemove', onMove);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', init); removeEventListener('mousemove', onMove); };
  }, []);
  return <canvas ref={ref} className="starfield" aria-hidden="true" />;
}
