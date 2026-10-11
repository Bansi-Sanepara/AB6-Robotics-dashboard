import React from 'react';

const P = {
  home: 'M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z M20 17v4H6.5A2.5 2.5 0 0 1 4 18.5 M9 8h6',
  trophy: 'M8 21h8 M12 17v4 M7 4h10v5a5 5 0 0 1-10 0z M7 6H4v2a3 3 0 0 0 3 3 M17 6h3v2a3 3 0 0 1-3 3',
  bars: 'M6 20V10 M12 20V4 M18 20v-7',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4',
  users: 'M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1 M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M21 20v-1a4 4 0 0 0-3-3.9 M16 4.1a3.5 3.5 0 0 1 0 6.8',
  clip: 'M9 3h6v3H9z M7 4.5H6a2 2 0 0 0-2 2V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6.5a2 2 0 0 0-2-2h-1 M8 12h8 M8 16h5',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.3-4.3',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.9 1.9 0 0 0 3.4 0',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
  chevron: 'M6 9l6 6 6-6',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  check: 'M5 12l5 5L20 7',
  lock: 'M6 11h12v10H6z M8 11V7a4 4 0 0 1 8 0v4',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
  flame: 'M12 22c4 0 7-3 7-7 0-3-2-5-3-7-1 2-2 3-3 3 0-3-1-6-4-8 0 4-4 6-4 12 0 4 3 7 7 7z',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  compass: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M16 8l-2 6-6 2 2-6z',
  target: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  gift: 'M20 12v10H4V12 M2 7h20v5H2z M12 22V7 M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  robot: 'M12 8V4H8 M6 8h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z M2 14h2 M20 14h2 M9 13v2 M15 13v2',
  bookopen: 'M2 4h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 4h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
  x: 'M18 6L6 18 M6 6l12 12',
  zap: 'M13 2L4 14h7l-1 8 9-12h-7z',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  hex: 'M12 2l9 5v10l-9 5-9-5V7z',
};

const FILLED = new Set(['star', 'bolt', 'flame', 'zap']);

export default function Icon({ n, size = 20, sw = 1.8, fill, ...rest }) {
  const f = fill ?? FILLED.has(n);
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={f ? 'currentColor' : 'none'} stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      <path d={P[n]} />
    </svg>
  );
}

export function LogoMark({ size = 40, draw = false }) {
  return (
    <svg
      className={'logo-mark ab6-logo' + (draw ? ' draw' : '')}
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="AB6 Robotics"
    >
      <defs>
        <linearGradient
          id="ab6LogoGradient"
          x1="8"
          y1="5"
          x2="55"
          y2="59"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#70E7FF" />
          <stop offset=".52" stopColor="#159CFF" />
          <stop offset="1" stopColor="#5368FF" />
        </linearGradient>

        <radialGradient id="ab6LogoCore" cx="0" cy="0" r="1"
          gradientTransform="translate(32 31) rotate(90) scale(15)"
          gradientUnits="userSpaceOnUse">
          <stop stopColor="#8DF3FF" />
          <stop offset="1" stopColor="#087EFF" />
        </radialGradient>

        <filter id="ab6LogoGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Four directional robotic modules */}
      <g stroke="url(#ab6LogoGradient)" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M26 7L32 3L38 7L35 15H29L26 7Z" fill="url(#ab6LogoGradient)" />
        <path d="M57 26L61 32L57 38L49 35V29L57 26Z" fill="url(#ab6LogoGradient)" />
        <path d="M26 57L32 61L38 57L35 49H29L26 57Z" fill="url(#ab6LogoGradient)" />
        <path d="M7 26L3 32L7 38L15 35V29L7 26Z" fill="url(#ab6LogoGradient)" />
      </g>

      {/* Open circuit frame */}
      <path
        d="M21 12L32 8L43 12L52 21L56 32L52 43L43 52L32 56L21 52L12 43L8 32L12 21Z"
        stroke="url(#ab6LogoGradient)"
        strokeWidth="1.8"
        opacity=".65"
      />

      {/* Central abstract A / robotic core */}
      <path
        d="M32 15L47 43H39L32 30L25 43H17L32 15Z"
        fill="url(#ab6LogoGradient)"
        filter="url(#ab6LogoGlow)"
      />

      {/* Negative-space crossbar */}
      <path
        d="M25 36H39L43 43H21L25 36Z"
        fill="#07172C"
      />

      {/* Central intelligence node */}
      <circle cx="32" cy="32" r="5.2" fill="#07172C" />
      <circle
        cx="32"
        cy="32"
        r="3.1"
        fill="url(#ab6LogoCore)"
        filter="url(#ab6LogoGlow)"
      />

      {/* Connection nodes */}
      <g fill="#A4F2FF">
        <circle cx="19" cy="19" r="1.5" />
        <circle cx="45" cy="19" r="1.5" />
        <circle cx="19" cy="45" r="1.5" />
        <circle cx="45" cy="45" r="1.5" />
      </g>
    </svg>
  );
}