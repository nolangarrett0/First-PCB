import type { TaskCase } from './taskTypes'

const fmt = (n: number) => String(Number(n.toPrecision(6)))
export function explainCalculations(task: TaskCase) {
  const fields = Object.fromEntries((task.artifact.rows ?? []).slice(1).map(([key, value]) => [key, value]))
  const read = (...keys: string[]) => Number.parseFloat(keys.map(key => fields[key]).find(Boolean) ?? '')
  const explain = (id: string, text: string) => {
    const part = task.parts.find(part => part.id === id && part.kind === 'number')
    if (part) part.explanation = text
  }
  if (task.id === '1.3') {
    const ma = read('Current'), kilo = read('Resistance')
    explain('current', `${fmt(ma)} mA ÷ 1000 = ${fmt(ma / 1000)} A.`)
    explain('resistance', `${fmt(kilo)} kΩ × 1000 = ${fmt(kilo * 1000)} Ω.`)
  }
  if (['1.5', '3.4', '8.3'].includes(task.id)) {
    const { voltage: supply, ledVoltage: led, resistance } = task.artifact
    if (supply !== undefined && led !== undefined && resistance !== undefined) {
      const vr = supply - led, current = vr / resistance
      explain('voltage', `The resistor ends are at ${fmt(supply)} V and ${fmt(led)} V relative to battery return. Their difference is ${fmt(supply)} − ${fmt(led)} = ${fmt(vr)} V across the resistor.`)
      explain('current', `I = V/R = ${fmt(vr)} V ÷ ${fmt(resistance)} Ω = ${fmt(current)} A. Multiply by 1000: ${fmt(current * 1000)} mA. This single series path carries the same current through the LED.`)
    }
  }
  if (task.id === '1.4') {
    const voltage = read('R1 voltage'), resistance = read('Changed R1')
    explain('current', `Use the changed resistance: ${fmt(voltage)} V ÷ ${fmt(resistance)} Ω = ${fmt(voltage / resistance)} A. The voltage across the resistor is held fixed in this comparison.`)
  }
  if (['2.4', '9.2'].includes(task.id)) {
    const supply = read('Supply'), led = read('LED voltage', 'Assumed LED drop'), ma = read('Target')
    const current = ma / 1000, resistance = (supply - led) / current
    const high = read('Range-case supply', 'Range supply'), low = read('Range-case LED voltage', 'Range LED drop')
    explain('resistance', `First convert ${fmt(ma)} mA to ${fmt(current)} A. The resistor voltage is ${fmt(supply)} − ${fmt(led)} = ${fmt(supply - led)} V. R = ${fmt(supply - led)} V ÷ ${fmt(current)} A = ${fmt(resistance)} Ω.`)
    explain('range', `Keep that ${fmt(resistance)} Ω resistance. At the supplied range values, I = (${fmt(high)} − ${fmt(low)}) V ÷ ${fmt(resistance)} Ω = ${fmt((high - low) / resistance)} A, or ${fmt((high - low) / resistance * 1000)} mA.`)
    explain('power', `Range-case resistor voltage is ${fmt(high - low)} V. P = V²/R = ${fmt(high - low)} × ${fmt(high - low)} ÷ ${fmt(resistance)} = ${fmt((high - low) ** 2 / resistance)} W.`)
  }
  if (task.id === '2.5') {
    const resistance = read('Resistance'), ma = read('Sample current'), current = ma / 1000
    explain('power', `Convert ${fmt(ma)} mA to ${fmt(current)} A. P = I²R = ${fmt(current)} × ${fmt(current)} × ${fmt(resistance)} = ${fmt(current ** 2 * resistance)} W.`)
    explain('low', `Five percent of ${fmt(resistance)} Ω is ${fmt(resistance * 0.05)} Ω. Subtract it: minimum resistance = ${fmt(resistance * 0.95)} Ω.`)
    explain('high', `Add that same five percent: maximum resistance = ${fmt(resistance * 1.05)} Ω.`)
  }
  if (task.id === '3.5') {
    const data = Object.fromEntries((task.artifact.rows ?? []).slice(1).map(([key, , sample]) => [key, Number.parseFloat(sample)]))
    const vr = data.Supply - data.LED
    explain('vr', `Use the sample-observation column: ${fmt(data.Supply)} − ${fmt(data.LED)} = ${fmt(vr)} V across the resistor.`)
    explain('current', `${fmt(vr)} V ÷ ${fmt(data.R1)} Ω = ${fmt(vr / data.R1)} A, or ${fmt(vr / data.R1 * 1000)} mA. These are supplied readings, not your own bench measurements.`)
  }
}
