// Presentation only: keep circuit IDs, saved answers and case identities intact.
import type { ArtifactKind } from './taskTypes'

export const artifactLabelText=(kind:ArtifactKind)=>['circuit','board','package'].includes(kind)?'BT1 S1 R1 D1 VCC SW LED_A GND net Revision A':kind==='footprint'?'D1 GND':kind==='junction'?'S1 R1 VCC GND SW':kind==='switch'?'S1':''

const names: Record<string, string> = {
  BT1: 'battery holder', S1: 'switch', R1: 'resistor', D1: 'LED',
  VCC: 'supply positive', GND: 'battery return', SW: 'connection after the switch', LED_A: 'connection to the LED anode',
  ERC: 'electrical rules check', DRC: 'design rules check', BOM: 'parts list',
  COM: 'common probe socket', DC: 'direct current', SDS: 'safety data sheet',
  VF: 'forward voltage', IF: 'forward current', TA: 'ambient temperature', VR: 'resistor voltage',
  OL: 'over-range or open indication',
}
const tokens = /\b(?:BT1(?:[+−-]| [+−-])?|(?:S1|R1|D1)(?:\.[123]| pin [123])?)|\b(?:LED_A|VCC|GND|SW)(?: connection| net)?\b|\b(?:ERC|DRC|BOM|COM|DC|SDS|VF|IF|TA|VR|OL)\b/g
export function learningText(text: string): string {
  // Real file names must remain copyable and match the teaching inventory.
  return text.split(/(\b[\w.-]+\.(?:gbr|drl|kicad_pcb|kicad_sch|csv|pdf)\b)/g).map((chunk, i) => i % 2 ? chunk : chunk.replace(tokens, (token, offset: number) => {
    // A label already paired with its explanation must remain readable, even
    // when rendered again in feedback or a learning record.
    const before = chunk.slice(0, offset)
    if (before.endsWith('(') && chunk[offset + token.length] === ')' && /(?:battery(?: holder| positive| negative)?(?: contact)?|switch|resistor|LED(?: anode| cathode)?|supply positive|battery return|battery-negative return|connection after the switch|connection to the LED anode|electrical rules check|design rules check|parts list|common probe socket|direct current|safety data sheet|forward voltage|forward current|ambient temperature|resistor voltage|over-range or open indication)(?: pin [123]| positive contact| negative contact)? \($/i.test(before)) return token
    const component = /^(BT1|S1|R1|D1)(.*)$/.exec(token)
    if (!component) {
      const label = token.replace(/ (?:connection|net)$/, '')
      return `${names[label]} (${label})`
    }
    const [, ref, rawSuffix] = component
    const suffix = rawSuffix.trim()
    const detail = suffix.startsWith('.') ? ` pin ${suffix.slice(1)}` : suffix === '+' ? ' positive contact' : ['−', '-'].includes(suffix) ? ' negative contact' : suffix ? ` ${suffix}` : ''
    return `${names[ref]}${detail} (${token})`
  }).replace(/\b\d+\.\d{7,}\b/g, value => String(Number(Number(value).toPrecision(6))))).join('')
}

export const labelTerms: [string, string][] = [
  ['BT1', 'Battery holder. + and − mark its positive and negative contacts.'],
  ['S1', 'Switch. S1.2 means pin 2 of that switch; the number after the dot identifies a pin.'],
  ['R1', 'Resistor. R1.2 means pin 2 of that resistor.'],
  ['D1', 'LED. D1.1 means pin 1 of that LED. These are drawing labels, not part numbers.'],
  ['VCC', 'Supply positive: the name of the connection from battery positive to the switch in this project.'],
  ['SW', 'The name of the connection from the switch output to the resistor.'],
  ['LED_A', 'The name of the connection from the resistor to the LED anode.'],
  ['GND', 'The battery-negative return connection in this project. It does not mean a connection to mains earth.'],
  ['A / K', 'On the LED symbol, A means anode and K means cathode. This project uses pin 2 for the anode and pin 1 for the cathode. A after a current value instead means amperes.'],
  ['Net', 'A group of electrically connected points. A net name identifies that connection; it is not an extra part.'],
  ['Revision A', 'The version name of this teaching design. Compare against the same version when checking connections or files.'],
  ['ERC', 'Electrical rules check: KiCad checks schematic connections against its configured electrical rules.'],
  ['DRC', 'Design rules check: KiCad checks board geometry and connections against configured rules.'],
  ['BOM', 'Bill of materials: the parts list for the design.'],
  ['COM', 'The common socket for the meter’s black probe. Check the exact meter manual.'],
  ['DC', 'Direct current. Select DC voltage for the voltage measurements in this battery circuit.'],
  ['SDS', 'Safety data sheet: the material supplier’s information about hazards and handling.'],
  ['VF / IF / TA', 'Datasheet labels: forward voltage across the LED, forward current through it, and ambient temperature. Read their test conditions together.'],
  ['OL', 'A meter indication whose meaning depends on the mode and manual; often an open circuit or a reading beyond the range.'],
  ['I / V / R / P', 'In the formulas here: I is current, V is voltage, R is resistance, and P is power.'],
  ['Units', 'A = amperes; mA = milliamperes; V = volts; mV = millivolts; Ω = ohms; kΩ = kilohms; W = watts; mW = milliwatts; mm = millimetres; °C = degrees Celsius.'],
  ['KiCad layers', 'F.Cu / B.Cu = front / back copper; F.Mask / B.Mask = front / back solder mask; F.Silkscreen = front assembly printing; Edge.Cuts = board outline.'],
  ['PCB', 'Printed circuit board: a board with copper pads and tracks that hold and connect electronic components.'],
  ['CAD', 'Computer-aided design: using software to create design drawings and files. This course uses KiCad for the schematic and PCB.'],
]

export function relevantLabelTerms(text: string) {
  return labelTerms.filter(([term]) => {
    if (term === 'Net') return /\bnet\b/i.test(text)
    if (term === 'Units') return /\b(?:mA|mV|mW|mm)\b|Ω|°C|\b\d+(?:\.\d+)? [AVW]\b/.test(text)
    if (term === 'KiCad layers') return /Edge[._]Cuts|[FB][._](?:Cu|Mask|Silkscreen)/.test(text)
    if (term === 'I / V / R / P') return /[IVRP]\s*=|I²|V²/.test(text)
    if (term === 'A / K') return /\bD1\b|\banode\b|\bcathode\b|[12][= (→]+[AK]\b/.test(text)
    return term.split(' / ').some(t => new RegExp(`\\b${t}\\b`).test(text))
  })
}
