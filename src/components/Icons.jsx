const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const Icons = {
  globe: (
    <svg viewBox="0 0 40 40" {...P}><circle cx="20" cy="20" r="15" />
      <ellipse cx="20" cy="20" rx="6.5" ry="15" /><path d="M5 20h30M8 11h24M8 29h24" /></svg>
  ),
  target: (
    <svg viewBox="0 0 40 40" {...P}><circle cx="20" cy="20" r="14" /><circle cx="20" cy="20" r="7" />
      <path d="M20 2v8M20 30v8M2 20h8M30 20h8" /><circle cx="20" cy="20" r="2" fill="currentColor" stroke="none" /></svg>
  ),
  layers: (
    <svg viewBox="0 0 40 40" {...P}><path d="M20 5 4 13l16 8 16-8z" /><path d="M4 21l16 8 16-8" /><path d="M4 29l16 8 16-8" /></svg>
  ),
  chart: (
    <svg viewBox="0 0 40 40" {...P}><path d="M5 34V6M5 34h30" /><path d="M11 27l7-9 6 5 9-13" />
      <circle cx="11" cy="27" r="1.8" fill="currentColor" stroke="none" /><circle cx="33" cy="10" r="1.8" fill="currentColor" stroke="none" /></svg>
  ),
  code: (
    <svg viewBox="0 0 40 40" {...P}><path d="M14 12 5 20l9 8M26 12l9 8-9 8M23 8l-6 24" /></svg>
  ),
  cap: (
    <svg viewBox="0 0 40 40" {...P}><path d="M20 7 3 15l17 8 17-8z" /><path d="M11 19v9c0 2.5 4 5 9 5s9-2.5 9-5v-9" /><path d="M35 15v11" /></svg>
  ),
  drone: (
    <svg viewBox="0 0 40 40" {...P}><rect x="15" y="15" width="10" height="10" rx="2" />
      <path d="M15 18 8 11M25 18l7-7M15 22l-7 7M25 22l7 7" />
      <circle cx="7" cy="10" r="3.5" /><circle cx="33" cy="10" r="3.5" />
      <circle cx="7" cy="30" r="3.5" /><circle cx="33" cy="30" r="3.5" /></svg>
  ),
  doc: (
    <svg viewBox="0 0 40 40" {...P}><path d="M23 4H11a3 3 0 0 0-3 3v26a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3V13z" />
      <path d="M23 4v9h9M14 21h12M14 27h8" /></svg>
  ),
  sat: (
    <svg viewBox="0 0 40 40" {...P}><rect x="16" y="16" width="8" height="8" rx="1" transform="rotate(45 20 20)" />
      <path d="M12 12 5 5M28 28l7 7" /><path d="M9 17 3 11l6-6 6 6zM31 23l6 6-6 6-6-6z" />
      <path d="M26 8a9 9 0 0 1 6 6" /><path d="M25 3a14 14 0 0 1 12 12" /></svg>
  ),
  shield: (
    <svg viewBox="0 0 40 40" {...P}><path d="M20 4 6 10v10c0 8 6 14 14 16 8-2 14-8 14-16V10z" /><path d="M14 20l4.5 4.5L27 16" /></svg>
  ),
}
