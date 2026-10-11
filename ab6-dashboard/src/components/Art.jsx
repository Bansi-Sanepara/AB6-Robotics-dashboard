import React from 'react';

/* Hero robot arm — pure SVG, animated joints with CSS */
export function RobotArm() {
  return (
    <svg className="robot-arm" viewBox="225 25 355 290" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">
      <defs>
        <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6d86a3" /><stop offset=".35" stopColor="#f1f7ff" /><stop offset=".7" stopColor="#a9bfd6" /><stop offset="1" stopColor="#5a7391" />
        </linearGradient>
        <linearGradient id="dark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1b2c4d" /><stop offset="1" stopColor="#0a1530" /></linearGradient>
        <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#35e0ff" stopOpacity=".55" /><stop offset="1" stopColor="#35e0ff" stopOpacity="0" /></linearGradient>
        <radialGradient id="padGlow"><stop offset="0" stopColor="#35e0ff" stopOpacity=".55" /><stop offset="1" stopColor="#35e0ff" stopOpacity="0" /></radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>

      {/* holo platform */}
      <ellipse cx="400" cy="292" rx="190" ry="30" fill="url(#padGlow)" />
      <g transform="translate(400 292) scale(1 .18)">
        <circle r="170" fill="none" stroke="#35e0ff" strokeWidth="3" strokeDasharray="4 12" className="spin-slow" opacity=".8" />
        <circle r="120" fill="none" stroke="#6aa8ff" strokeWidth="3" strokeDasharray="30 14" className="spin-rev" opacity=".8" />
        <circle r="70" fill="rgba(53,224,255,.15)" stroke="#35e0ff" strokeWidth="3" />
      </g>
      {/* beam + hologram cube */}
      <polygon className="beam" points="372,150 428,150 470,290 330,290" fill="url(#beam)" />
      <g className="holo-cube" transform="translate(400 225)" filter="url(#glow)" fill="none" stroke="#7df0ff" strokeWidth="1.6">
        <path d="M0-26l24 13v26l-24 13-24-13v-26z" fill="rgba(53,224,255,.12)" />
        <path d="M0-26v26 M0 0l24-13 M0 0l-24-13" opacity=".7" />
      </g>

      {/* base */}
      <g transform="translate(400 292)">
        <rect x="-66" y="-30" width="132" height="30" rx="8" fill="url(#dark)" stroke="#2c4b86" />
        <rect x="-50" y="-22" width="100" height="4" rx="2" fill="#35e0ff" filter="url(#glow)" className="pulse-line" />
        <rect x="-38" y="-48" width="76" height="22" rx="8" fill="url(#steel)" />
      </g>
      {/* arm */}
      <g transform="translate(400 250)">
        <g className="j1">
          <rect x="-17" y="-122" width="34" height="128" rx="15" fill="url(#steel)" />
          <rect x="-3" y="-100" width="6" height="64" rx="3" fill="#35e0ff" filter="url(#glow)" className="pulse-line" />
          <g transform="translate(0 -118)">
            <g className="j2">
              <rect x="-13" y="-116" width="26" height="122" rx="12" fill="url(#steel)" />
              <rect x="-2.5" y="-96" width="5" height="60" rx="2.5" fill="#35e0ff" filter="url(#glow)" className="pulse-line" />
              <circle r="21" fill="url(#steel)" stroke="#2c4b86" strokeWidth="2" />
              <circle r="9" fill="#06122e" stroke="#35e0ff" strokeWidth="2" filter="url(#glow)" />
              <g transform="translate(0 -114)">
                <g className="j3">
                  <circle r="15" fill="url(#steel)" stroke="#2c4b86" strokeWidth="2" />
                  <circle r="6" fill="#35e0ff" filter="url(#glow)" />
                  <rect x="-16" y="-30" width="32" height="16" rx="5" fill="url(#dark)" stroke="#2c4b86" />
                  <g className="claw-l"><path d="M-14-30 L-16-62 L-6-62 L-3-30z" fill="url(#steel)" /></g>
                  <g className="claw-r"><path d="M14-30 L16-62 L6-62 L3-30z" fill="url(#steel)" /></g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      {/* sparks */}
      {[0, 1, 2, 3, 4, 5].map(i => <circle key={i} className="spark" cx={330 + i * 28} cy="270" r="2" fill="#7df0ff" style={{ animationDelay: i * .5 + 's' }} />)}
    </svg>
  );
}

export function Mascot() {
  return (
    <svg className="mascot-svg" viewBox="0 0 120 150" aria-hidden="true">
      <defs>
        <linearGradient id="mw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#bcd3ee" /></linearGradient>
        <radialGradient id="eye"><stop offset="0" stopColor="#c9f6ff" /><stop offset="1" stopColor="#1fb8ff" /></radialGradient>
        <filter id="mg" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <g className="m-flame"><ellipse cx="60" cy="136" rx="9" ry="12" fill="#ff9d2e" opacity=".9" /><ellipse cx="60" cy="134" rx="5" ry="8" fill="#ffe27a" /></g>
      <g className="m-bob">
        <line x1="60" y1="22" x2="60" y2="8" stroke="#9db4d3" strokeWidth="3" strokeLinecap="round" />
        <circle className="m-ant" cx="60" cy="6" r="5" fill="#35e0ff" filter="url(#mg)" />
        <circle cx="18" cy="52" r="9" fill="#2f7bff" /><circle cx="102" cy="52" r="9" fill="#2f7bff" />
        <rect x="20" y="20" width="80" height="60" rx="28" fill="url(#mw)" />
        <rect x="29" y="31" width="62" height="38" rx="18" fill="#0a1530" />
        <g className="m-eyes"><ellipse cx="47" cy="50" rx="7" ry="9" fill="url(#eye)" filter="url(#mg)" /><ellipse cx="73" cy="50" rx="7" ry="9" fill="url(#eye)" filter="url(#mg)" /></g>
        <path d="M54 61q6 5 12 0" stroke="#35e0ff" strokeWidth="2" fill="none" strokeLinecap="round" />
        <rect x="38" y="84" width="44" height="38" rx="18" fill="url(#mw)" />
        <circle cx="60" cy="102" r="6" fill="#2f7bff" filter="url(#mg)" />
        <ellipse cx="32" cy="104" rx="7" ry="12" fill="url(#mw)" transform="rotate(12 32 104)" />
        <g className="m-wave"><ellipse cx="90" cy="98" rx="7" ry="13" fill="url(#mw)" /></g>
      </g>
    </svg>
  );
}
