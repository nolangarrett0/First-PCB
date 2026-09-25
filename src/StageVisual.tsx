export type StageVisualId = 'schematic' | 'layout' | 'files' | 'bare' | 'tested'

export function StageVisual({ id, className = '' }: { id: StageVisualId; className?: string }) {
  const shared = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return <svg className={className} viewBox="0 0 140 88" aria-hidden="true" focusable="false">
    {id === 'schematic' && <g {...shared}>
      <path d="M16 44h16m0-12v24m8-18v12m0-6h16m39 0h27m-66 0 6-8 7 16 8-16 7 16 6-8" />
      <circle cx="106" cy="44" r="11" /><path d="m102 48 8-8m-6-2 7 3m-3 6 3 3" />
      <text x="16" y="75" className="diagram-text">BT1</text><text x="65" y="75" className="diagram-text">R1</text><text x="99" y="75" className="diagram-text">D1</text>
    </g>}
    {id === 'layout' && <g {...shared}>
      <rect x="17" y="12" width="106" height="64" rx="7" /><circle cx="38" cy="33" r="7" /><circle cx="38" cy="55" r="7" /><rect x="62" y="29" width="25" height="23" rx="3" /><circle cx="108" cy="30" r="8" /><circle cx="108" cy="58" r="8" /><path d="M45 33h17m25 7h13m-62 22V55m70-17v12" /><text x="57" y="67" className="diagram-text">F.Cu</text>
    </g>}
    {id === 'files' && <g {...shared}>
      <path d="M20 16h60l10 10v50H20zM80 16v10h10M48 25h60l10 10v41H48" /><path d="M57 43h47M57 53h47M57 63h31" /><text x="27" y="42" className="diagram-text">.gbr</text><text x="27" y="57" className="diagram-text">.drl</text>
    </g>}
    {id === 'bare' && <g {...shared}>
      <rect x="16" y="11" width="108" height="66" rx="7" /><circle cx="35" cy="30" r="5" /><circle cx="35" cy="57" r="5" /><circle cx="105" cy="30" r="5" /><circle cx="105" cy="57" r="5" /><path d="M40 30h23l8 13h29M40 57h20l9-14m5 0h26" /><rect x="58" y="34" width="23" height="18" rx="2" strokeDasharray="4 4" />
    </g>}
    {id === 'tested' && <g {...shared}>
      <rect x="16" y="11" width="108" height="66" rx="7" /><circle cx="37" cy="30" r="5" /><circle cx="37" cy="57" r="5" /><path d="M42 30h18m0-6v12m6-12v12m0-6h20M42 57h40" /><circle cx="96" cy="43" r="13" /><path d="m91 48 10-10m-7-4 9 3m-3 9 5 3m8-25 7-8m-7 17 8-1" /><text x="25" y="71" className="diagram-text">POWER</text>
    </g>}
  </svg>
}
