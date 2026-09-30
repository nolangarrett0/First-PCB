import type { Artifact } from './taskTypes'

const descriptions: Record<string, string> = {
  'E.1': 'A battery, switch, resistor, and LED connected in a loop. Each part is named.',
  'E.2': 'Voltage is measured between two battery contacts; current flows along the circuit path.',
  'E.3': 'A resistor symbol with two terminals. Resistor current equals resistor voltage divided by resistance.',
  'E.4': 'An LED symbol. The bar marks cathode K; outward arrows represent emitted light.',
  'E.5': 'A capacitor has two terminals separated by an insulating material. Capacitance and voltage rating are separate properties.',
  'E.6': 'NPN transistor terminals base, collector, emitter, and MOSFET terminals gate, drain, source. Symbol positions do not establish physical pin order.',
  'E.7': 'A hypothetical chip has pins with different functions. Consult its table for the pin numbers.',
  'E.8': 'Project labels name the battery holder BT1, switch S1, resistor R1, and LED D1. LED pin 2 is anode and pin 1 is cathode.',
  'E.9': 'Series components share one current path. Parallel branches connect between the same two points.',
}
export function BasicsVisual({ artifact }: { artifact: Artifact }) {
  const topic = artifact.target ?? 'E.1'
  const loop = ['E.1', 'E.2', 'E.8'].includes(topic)
  const openSwitch = topic === 'E.1' && artifact.variant === 0
  const openReturn = topic === 'E.1' && artifact.variant === 1
  const short = topic === 'E.1' && artifact.variant === 3
  return <figure className="basics-visual diagram-frame"><svg viewBox="0 0 510 260" className="teaching-svg" role="img" aria-label={descriptions[topic]}>
    <g stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {loop && <>
        <path d={`M60 120V75H135 M175 75H255 M305 75H425V120 M425 160V210H${openReturn ? '275 M250 210H' : ''}60V150`}/>
        <path d={`M40 120H80 M48 150H72 M135 75${openSwitch ? 'L173 55 M175 75H185' : 'H185'}`}/>
        {short && <path d="M60 120H110V150H60" stroke="#9c442e"/>}
        <rect x="255" y="65" width="50" height="20"/>
        <path d="M415 120H435L425 145Z M413 150H437 M441 124L459 106 M452 106H459V113 M446 143L464 125 M457 125H464V132"/>
        {topic === 'E.2' && <><path d="M25 120H10V150H25 M335 75H375 M367 68L375 75L367 82"/></>}
      </>}
      {topic === 'E.3' && <><path d="M65 105H210 M300 105H445"/><rect x="210" y="85" width="90" height="40"/><circle cx="65" cy="105" r="4"/><circle cx="445" cy="105" r="4"/><path d="M65 170V185H445V170"/></>}
      {topic === 'E.4' && <><path d="M55 125H200 M275 125H430 M200 90V160L265 125Z M275 85V165 M225 72L250 47 M239 47H250V58 M265 80L290 55 M279 55H290V66"/></>}
      {topic === 'E.5' && <><path d="M60 120H235 M275 120H445 M235 80V160 M275 80V160"/></>}
      {topic === 'E.6' && <>
        <path d="M35 115H105 M105 75V155 M105 95L150 65V35 M105 135L150 165V195 M130 151L150 165L141 144"/>
        <path d="M315 115H345 M345 80V150 M360 75V155 M360 85H415V35 M360 145H415V195"/>
      </>}
      {topic === 'E.7' && <><rect x="175" y="65" width="160" height="135" rx="8"/><path d="M125 95H175 M125 165H175 M335 95H385 M335 165H385"/></>}
      {topic === 'E.9' && <>
        <path d="M30 80H80 M140 80H175 M220 80H245"/><rect x="80" y="70" width="60" height="20"/><path d="M175 60V100L210 80Z M220 58V102"/>
        <path d="M295 130V80H355 M415 80H465V180H415 M355 180H295V130 M275 130H295 M465 130H490"/><rect x="355" y="70" width="60" height="20"/><rect x="355" y="170" width="60" height="20"/>
        <circle cx="295" cy="130" r="4" fill="currentColor"/><circle cx="465" cy="130" r="4" fill="currentColor"/>
      </>}
    </g>
    <g fill="currentColor" fontSize="16" textAnchor="middle">
      {loop && <>
        <text x="67" y="45">{topic === 'E.8' ? 'Holder BT1' : topic === 'E.1' && artifact.variant === 4 ? 'Cells out' : 'Battery'}</text><text x="145" y="30">{topic === 'E.8' ? 'Switch S1' : 'Switch'}</text><text x="280" y="45">{topic === 'E.8' ? 'Resistor R1' : 'Resistor'}</text><text x="440" y="195">{topic === 'E.8' ? 'LED D1' : 'LED'}</text>
        <text x="95" y="118">+</text><text x="95" y="158">−</text><text x="376" y="118">{topic === 'E.8' ? '2: anode' : 'Anode'}</text><text x="362" y="165">{topic === 'E.8' ? '1: cathode' : 'Cathode'}</text><text x="250" y="245">{topic === 'E.2' ? 'Arrow: conventional current direction' : 'Return path to battery negative'}</text>
      </>}
      {topic === 'E.3' && <><text x="255" y="55">Resistor</text><text x="65" y="145">Terminal 1</text><text x="425" y="145">Terminal 2</text><text x="255" y="215">Voltage across the two terminals</text><text x="255" y="247">I = V/R</text></>}
      {topic === 'E.4' && <><text x="100" y="160">Anode (A)</text><text x="365" y="160">Cathode (K)</text><text x="305" y="35">Light</text><text x="255" y="215">Cathode bar stays with K when rotated</text></>}
      {topic === 'E.5' && <><text x="255" y="50">Capacitor symbol</text><text x="255" y="200">Capacitance: µF</text><text x="255" y="235">Voltage rating: V</text></>}
      {topic === 'E.6' && <><text x="105" y="235">NPN bipolar</text><text x="40" y="145">Base</text><text x="175" y="32">Collector</text><text x="177" y="207">Emitter</text><text x="390" y="235">MOSFET terminals</text><text x="310" y="145">Gate</text><text x="450" y="32">Drain</text><text x="450" y="207">Source</text></>}
      {topic === 'E.7' && <><text x="255" y="135">Hypothetical IC</text><text x="92" y="90">Supply</text><text x="92" y="160">Input</text><text x="420" y="90">Output</text><text x="420" y="160">Return</text><text x="255" y="240">Use the case table for pin numbers</text></>}
      {topic === 'E.9' && <><text x="135" y="40">Series: one path</text><text x="135" y="140">Same current</text><text x="385" y="40">Parallel: two paths</text><text x="385" y="235">Same endpoint voltage</text></>}
    </g>
  </svg><figcaption>{descriptions[topic]} {topic !== 'E.1' && 'Use the table below for this case’s values and connections.'}</figcaption></figure>
}
