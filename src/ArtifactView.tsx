import { learningText } from './learningLanguage'
import { LabelKey } from './LabelKey'
import { BasicsVisual } from './BasicsVisual'
import { useState } from 'react'

import { project } from './teachingProject'

import type { Artifact, TaskCase } from './taskTypes'

const activate=(event:React.KeyboardEvent,action:()=>void)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();action()}}

type ViewProps={artifact:Artifact;selected?:string[];onPoint?:(id:string)=>void;reference?:boolean;resolved?:boolean}

function Point({id,label,x,y,selected,onPoint}:{id:string;label:string;x:number;y:number;selected?:string[];onPoint?:(id:string)=>void}) {

  return <g className={`diagram-point ${selected?.includes(id)?'chosen':''}`} {...(onPoint?{role:'button',tabIndex:0,'aria-label':`Select ${learningText(label)}`,'aria-pressed':selected?.includes(id)??false,onClick:()=>onPoint(id),onKeyDown:(e:React.KeyboardEvent)=>activate(e,()=>onPoint(id))}:{})}><circle cx={x} cy={y} r={onPoint?12:5}/><text x={x} y={y-18} textAnchor="middle">{label}</text></g>

}

export function CircuitView({artifact,selected,onPoint,resolved}:ViewProps){

  const fault=resolved?'':artifact.fault;const target=artifact.target?.split('|')??[]

  const open=(a:string,b:string)=>fault==='open-wire' && target.includes(a)&&target.includes(b)

  const byId=(id:string)=>project.terminals.find(p=>p.id===id)!

  return <div className="diagram-frame"><svg viewBox="0 0 510 250" role={onPoint?'group':'img'} aria-label="Revision A series circuit, with labeled terminals and net names" className="teaching-svg">

    <g className="diagram-wire">{project.connections.map(([a,b])=>{const p=byId(a),q=byId(b);return open(a,b)?<path key={a} d={`M${p.x} ${p.y}L${(p.x+q.x)/2-9} ${(p.y+q.y)/2} M${(p.x+q.x)/2+9} ${(p.y+q.y)/2}L${q.x} ${q.y}`}/>:<path key={a} d={`M${p.x} ${p.y}L${q.x} ${q.y}`}/>})}

      <path d={fault==='open-switch'?'M135 90L183 66 M183 90H205':'M135 90H205'}/>

      <rect x="283" y="78" width="54" height="24"/><path d="M270 90H283 M337 90H350"/>

      <path d="M60 90V123 M60 147V180 M43 128H77 M49 143H71"/>

      <path d={fault==='reversed-led'?'M415 90V112 M402 116H428 M415 121L402 146H428Z M415 146V180':'M415 90V112 M402 116H428L415 141Z M402 145H428 M415 145V180'}/>

      <path d="M439 123L457 105 M451 105H457V111 M439 137L457 119 M451 119H457V125"/>

      {fault==='bypass'&&<path className="fault-path" d="M270 90V45H350V90"/>}

    </g>

    <g className="diagram-labels"><text x="153" y="37">S1</text><text x="296" y="46">R1</text><text x="458" y="157">D1</text><text x="12" y="132">BT1</text><text x="80" y="223">VCC → S1 → SW → R1 → LED_A → D1 → GND</text></g>

    {project.terminals.map(p=><Point key={p.id} {...p} label={p.id==='D1.1'?'D1.1':p.id==='D1.2'?'D1.2':p.id} selected={selected} onPoint={onPoint}/>)}

  </svg>{artifact.voltage!==undefined&&<dl className="measurement-values"><div><dt>Battery voltage / resistor pin 1</dt><dd>{artifact.voltage} V</dd></div><div><dt>LED anode / resistor pin 2</dt><dd>{artifact.ledVoltage} V above battery negative</dd></div><div><dt>Resistor value (R1)</dt><dd>{artifact.resistance} Ω</dd></div></dl>}

  <p className="diagram-note">LED (D1): pin 1 is the cathode (K), pin 2 is the anode (A). The bar on its symbol marks the cathode. {fault==='cells'?'Cells are installed in this case.':'Supply state is stated in the task.'} The drawing is a teaching model.</p></div>

}

const layerLabels={copper:'Copper',mask:'Mask',silk:'Silkscreen',outline:'Outline',drill:'Drills'}

type Layer=keyof typeof layerLabels

export function BoardView({artifact,selected,onPoint,reference=false,resolved=false,layer='copper'}:ViewProps&{layer?:Layer}){

  const fault=reference||resolved?'':artifact.fault;const target=artifact.target?.split('|')??[]

  const byId=(id:string)=>project.pads.find(p=>p.id===id)!

  const show=(name:Layer)=>layer===name

  const outlineMissing=fault==='missing-outline'

  const drawOutline=show('outline')||!outlineMissing

  return <svg viewBox="0 0 510 270" role={onPoint?'group':'img'} aria-label={`${reference?'Approved reference':'Inspected view'}: ${layerLabels[layer]}`} className={show('mask')?'teaching-svg board-svg mask-layer':'teaching-svg board-svg'}>

    <rect className="board-material" x="28" y="28" width="445" height="190" rx="5"/>

    {drawOutline&&!outlineMissing&&(fault==='edge-gap'?<path className="board-outline" d={artifact.target==='top'?'M235 28H28V218H473V28H252':'M473 111V28H28V218H473V129'}/>:<rect className="board-outline" x="28" y="28" width="445" height="190" rx="0"/>)}

    {show('copper')&&<g className="board-copper">{project.connections.map(([a,b])=>{const p=byId(a),q=byId(b);const missing=fault==='unrouted'&&target.includes(a)&&target.includes(b);return <path key={a} className={missing?'ratsnest':''} d={`M${p.x} ${p.y}L${q.x} ${q.y}`}/>})}</g>}

    {project.pads.map(p=><g key={p.id} className="board-pad">{show('mask')&&<circle className="mask-opening" cx={p.x} cy={p.y} r="17"/>}<circle className="copper-pad" cx={p.x} cy={p.y} r="12"/>{(!['missing-hole','drill-shift','multiple'].includes(fault??'')||p.id!==(artifact.target??'D1.1'))&&<circle className="pad-hole" cx={p.x} cy={p.y} r="4"/>}{show('drill')&&!(fault==='missing-hole'&&p.id===(artifact.target??'D1.1'))&&<g className="drill-center"><circle cx={p.x+(['drill-shift','multiple'].includes(fault??'')&&p.id===(artifact.target??'D1.1')?17:0)} cy={p.y} r="5"/><path d={`M${p.x-8+(['drill-shift','multiple'].includes(fault??'')&&p.id===(artifact.target??'D1.1')?17:0)} ${p.y}h16 M${p.x+(['drill-shift','multiple'].includes(fault??'')&&p.id===(artifact.target??'D1.1')?17:0)} ${p.y-8}v16`}/></g>}</g>)}

    {show('silk')&&<g className="board-silk">{fault!=='missing-switchmark'&&<text x="142" y="101">S1 ON</text>}<text x="284" y="110">R1</text><text x="430" y="140">D1</text>{!['missing-mark','multiple'].includes(fault??'')&&<text x="435" y={fault==='polarity'?102:180}>K</text>}<text x="53" y="99">+</text><text x="50" y="202">−</text></g>}

    {fault==='polarity'&&!show('silk')&&<text className="board-silk" x="435" y="102">K</text>}

    {fault==='placement'&&<g className="placement-overlay"><rect x={artifact.target==='2'?252:85} y={artifact.target==='2'?135:42} width="160" height={artifact.target==='2'?72:105}/><text x={artifact.target==='2'?265:101} y={artifact.target==='2'?165:129}>Holder envelope</text><rect x="116" y="74" width="48" height="24"/><text x="132" y="69">A</text><rect x="267" y={artifact.target==='1'?205:180} width="48" height="24"/><text x="283" y={artifact.target==='1'?198:173}>B</text><rect x={artifact.target==='1'?420:462} y="90" width="40" height="24"/><text x={artifact.target==='1'?434:477} y="82">C</text></g>}

    {project.pads.map(p=><Point key={p.id} {...p} label={p.id} selected={selected} onPoint={onPoint}/>)}

    <text className="diagram-dimension" x="125" y="251">Illustrative outline: 40 × 25 mm; geometry simplified</text>

  </svg>

}

function LayerViewer(props:ViewProps){const[layer,setLayer]=useState<Layer>('copper');return <div className="layer-viewer"><div className="layer-controls" role="group" aria-label="Inspect a layer">{Object.entries(layerLabels).map(([id,label])=><button type="button" key={id} aria-pressed={layer===id} onClick={()=>setLayer(id as Layer)}>{label}</button>)}</div>{props.artifact.kind==='package'?<div className="package-compare"><figure><figcaption>Approved A reference</figcaption><BoardView {...props} reference layer={layer}/></figure><figure><figcaption>Actual example output / receiving view</figcaption><BoardView {...props} layer={layer}/></figure></div>:<BoardView {...props} layer={layer}/>}<p className="diagram-note">Layer models show only the features needed for the exercise. They are not manufacturing files.</p></div>}

function Table({rows:tableRows}: {rows:string[][]}) {return <div className="table-scroll"><table className="teaching-table"><thead><tr>{tableRows[0].map((x,i)=><th key={i} scope="col">{learningText(x)}</th>)}</tr></thead><tbody>{tableRows.slice(1).map((row,i)=><tr key={i}>{row.map((x,j)=><td key={j}>{learningText(x)}</td>)}</tr>)}</tbody></table></div>}

function BreadboardView({artifact,selected,onPoint,resolved}:ViewProps){const row=Number(artifact.target),dest=row+3;const rowNumbers=[row,row+1,dest,dest+1];return <div className="diagram-frame"><svg viewBox="0 0 510 280" className="teaching-svg" role={onPoint?'group':'img'} aria-label="Breadboard with separate numbered strips, center gap and split rail"><rect className="breadboard-body" x="22" y="28" width="450" height="215" rx="10"/>{rowNumbers.map((n,i)=><g key={n}><text x="24" y={79+i*45}>{n}</text><path className="breadboard-strip" d={`M69 ${75+i*45}H216 M279 ${75+i*45}H426`}/>{['a','b','c','d','e','f','g','h','i','j'].map((letter,j)=><Point key={letter} id={`${letter}${n}`} label={`${letter}${n}`} x={69+j*36+(j>4?30:0)} y={75+i*45} selected={selected} onPoint={onPoint}/>)}</g>)}<path className="diagram-wire" d="M483 46V123 M483 144V235"/>{['rail-top','rail-bottom','rail-upper-mid'].map((id,i)=><Point key={id} id={id} label={['Top','Bottom','Mid'][i]} x={483} y={[46,235,100][i]} selected={selected} onPoint={onPoint}/>)}{artifact.fault==='jumper'&&<path className="breadboard-jumper" d={resolved?'M213 75Q247 4 69 165':'M213 75Q247 4 69 210'}/>}<text className="diagram-labels" x="225" y="261">Center gap</text></svg><p className="diagram-note">Lines show the model’s internal strips. {artifact.fault==='jumper'?resolved?`The modeled jumper now reaches intended row ${dest}.`:`Drawn jumper ends on row ${dest+1}, below intended row ${dest}.`:''} The two rail segments have a visible gap. Real boards vary.</p></div>}

function JunctionView({artifact,resolved}:ViewProps){const missing=resolved?'':artifact.target;return <svg viewBox="0 0 510 240" className="teaching-svg" role="img" aria-label="Two crossings: the SW branch has no intended junction; the other crossing is independent">{['X1','X2'].map((x,i)=>{const cx=130+i*240;const intended=artifact.target===x;return <g key={x}><path className="diagram-wire" d={`M${cx-70} 105H${cx+70} M${cx} 40V180`}/>{missing!==x&&intended&&<circle cx={cx} cy="105" r="6"/>}<text x={cx-15} y="217">{x}</text><text x={cx-70} y="92">{intended?'S1.2':'VCC'}</text><text x={cx+10} y="50">{intended?'R1.1':'GND'}</text></g>})}</svg>}

function FootprintView({artifact}:ViewProps){return <div className="diagram-frame">{artifact.rows?<Table rows={artifact.rows}/>:<svg viewBox="0 0 510 210" role="img" aria-label="Two LED footprint candidates with different numbered polarity mappings" className="teaching-svg">{[0,1].map((n)=><g key={n}><rect className="footprint-body" x={35+n*250} y="45" width="175" height="125" rx="8"/><circle className="footprint-pad" cx={80+n*250} cy="100" r="14"/><circle className="footprint-pad" cx={165+n*250} cy="100" r="14"/><text x={45+n*250} y="33">Candidate {n?'B':'A'}</text><text x={55+n*250} y="143">1 {n?'K':'A'}</text><text x={140+n*250} y="143">2 {n?'A':'K'}</text><text x={70+n*250} y="192">Pitch 2.54 mm</text></g>)}</svg>}<p className="diagram-note">Reference LED cathode → symbol pin 1 (K) → pad 1 → battery return (GND). Check the exact drawing for a real part.</p></div>}

function SwitchView(){return <div className="diagram-frame"><svg className="teaching-svg" viewBox="0 0 510 210" role="img" aria-label="Illustrative switch ON joins common 1 to 2; OFF joins 1 to 3">{['ON','OFF'].map((label,i)=><g key={label}><text x={75+i*250} y="34">{label}</text><path className="diagram-wire" d={`M${60+i*250} 106L${175+i*250} ${i?151:65}`}/><circle cx={60+i*250} cy="106" r="7"/><circle cx={175+i*250} cy="65" r="7"/><circle cx={175+i*250} cy="151" r="7"/><text x={40+i*250} y="135">1 common</text><text x={184+i*250} y="70">2</text><text x={184+i*250} y="157">3</text></g>)}</svg><p className="diagram-note">This is the teaching contact map, not a selected switch’s datasheet.</p></div>}

function StationView({artifact}:ViewProps){const f=artifact.fault;return <div className="diagram-frame"><svg viewBox="0 0 510 260" className="teaching-svg" role="img" aria-label={`Soldering station: ${f==='iron'?'iron rests on bench':f==='extraction'?'capture opening obstructed':f==='cells'?'work board has cells installed':f==='clutter'?'paper near work':'eye protection absent'}`}><path className="diagram-wire" d="M20 218H490"/><rect className="station-tool" x="52" y="122" width="130" height="65" rx="6"/><text x="67" y="159">Iron stand</text><path className="diagram-wire" d={f==='iron'?'M196 212L302 207':'M68 114L145 168'}/><rect className="board-material" x="216" y="147" width="84" height="44"/><text x="219" y="140">Work board</text>{f==='cells'&&<text x="219" y="177">Cells IN</text>}<path className="diagram-wire" d="M304 171Q285 131 322 105 M384 50V124L323 141"/><text x="344" y="32">Fume capture</text>{f==='extraction'&&<path className="fault-path" d="M321 113L351 143 M351 113L321 143"/>}{f==='clutter'&&<g><rect x="306" y="183" width="63" height="32"/><text x="311" y="202">Paper</text></g>}<text x="55" y="62">{f==='eyes'?'Eye protection absent':'Eye protection ready'}</text></svg><p className="diagram-note">Illustrative setup. Confirm stand, protection, material safety data sheet (SDS), equipment instructions and appropriate fume control before physical work.</p></div>}

const photos=[{id:'bridge',file:'bridge.jpg',alt:'Solder visibly spans adjacent pads',description:'Pad detail'},{id:'wetting',file:'wetting.jpg',alt:'Solder around a lead with incomplete spreading onto its pad',description:'Pad detail'},{id:'good',file:'reference.jpg',alt:'Reference header joints with solder around the leads and pads',description:'Pad detail'}]

function JointView({artifact}:ViewProps){const ordered=photos.map((_,i)=>photos[(i+artifact.variant)%photos.length]);return <div className="joint-gallery">{ordered.map((photo,i)=><figure key={photo.id}><img src={`${import.meta.env.BASE_URL}learning/${photo.file}`} alt={photo.alt}/><figcaption>Photo {String.fromCharCode(65+i)} · {photo.description}</figcaption></figure>)}<p className="diagram-note">Photographs: Bill Earl / Adafruit, <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">CC BY-SA 3.0</a>. Unmodified source images; <a href="https://learn.adafruit.com/adafruit-guide-excellent-soldering/common-problems" target="_blank" rel="noreferrer">original guide and attribution</a>. A photograph is not a complete electrical test.</p></div>}

export function ArtifactView({task,selected,onPoint,resolved=false,showKey=true}:{task:TaskCase;showKey?:boolean;selected?:string[];onPoint?:(id:string)=>void;resolved?:boolean}) {

  const[large,setLarge]=useState(false)
  const props={artifact:task.artifact,selected,onPoint,resolved};const kind=task.artifact.kind

  return <section className="task-artifact" aria-label="Teaching artifact">{['basics','circuit','board','package','breadboard','junction','footprint','switch','station'].includes(kind)&&<button type="button" className="text-button diagram-zoom" aria-pressed={large} onClick={()=>setLarge(!large)}>{large?'Fit diagram':'Enlarge diagram'}</button>}<div className={large?'artifact-scroller enlarged':'artifact-scroller'} tabIndex={large?0:undefined} aria-label={large?'Enlarged diagram; scroll to inspect':undefined}>{kind==='basics'?<><BasicsVisual artifact={task.artifact}/><Table rows={task.artifact.rows??[['Feature','Description']]}/></>:kind==='circuit'?<CircuitView {...props}/>:kind==='board'||kind==='package'?<LayerViewer key={task.variantId} {...props}/>:kind==='breadboard'?<BreadboardView {...props}/>:kind==='junction'?<JunctionView {...props}/>:kind==='footprint'?<FootprintView {...props}/>:kind==='switch'?<SwitchView/>:kind==='station'?<StationView {...props}/>:kind==='joints'?<>{task.id==='7.3'&&<figure className="technique-photo"><img src={`${import.meta.env.BASE_URL}learning/heating.jpg`} alt="Iron tip contacts the pad and lead together"/><figcaption>Heat pad and lead together · Bill Earl / Adafruit · CC BY-SA 3.0 · <a href="https://learn.adafruit.com/assets/1968" target="_blank" rel="noreferrer">Unmodified source</a></figcaption></figure>}<JointView {...props}/></>:kind==='workflow'?<ul className="workflow-cards">{['Outputs: layers and holes','Assembly: joints and measurements','PCB: pads/copper/outline','Schematic: connections','Bare board: receive/inspect'].map(x=><li key={x}>{x}</li>)}</ul>:<Table rows={task.artifact.rows??[['Artifact','Value'],['Reference',project.revision]]}/>} {task.artifact.caption&&<p className="modeled-observation">{learningText(task.artifact.caption)}</p>}</div>{showKey&&<LabelKey text={[task.context,...task.parts.flatMap(p=>[p.prompt,p.hint,p.explanation,...(p.options?.flatMap(o=>[o.label,o.feedback])??[])]),...(task.artifact.rows?.flat()??[]),...(['circuit','board','package'].includes(kind)?['BT1 S1 R1 D1 VCC SW LED_A GND net Revision A']:kind==='footprint'?['D1 GND']:kind==='junction'?['S1 R1 VCC GND SW']:[])].join(" ")}/>}</section>

}
