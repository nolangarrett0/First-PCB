import { ArtifactView } from './ArtifactView'
import { LabelKey } from './LabelKey'
import { learningText, artifactLabelText } from './learningLanguage'
import type { TaskCase } from './taskTypes'

export function WorkedExample({task,labelText=''}:{task:TaskCase;labelText?:string}) {
  const points = task.parts.find(part => part.kind === 'nodes')?.expected as string[] | undefined
  return <div className="example-content">
    <p>{learningText(task.context)}</p>
    {points&&['circuit','board','package','breadboard','switch'].includes(task.artifact.kind)&&<p className="record-help">Blue outlines show the example’s selected points.</p>}
    <ArtifactView task={task} selected={points} showKey={false}/>
    <details open className="worked-case">
      <summary>Walk through this example</summary>
      <ol>{task.parts.map((part, index) => <li key={part.id}>
        {index === task.revealAfter && <p><strong>Example observation:</strong> {learningText(task.artifact.observation ?? '')}</p>}
        {index === task.retestAfter && <p><strong>Example repeated test:</strong> {learningText(task.artifact.retestObservation ?? '')}</p>}
        <strong>{learningText(part.prompt)}</strong>
        {part.kind === 'order' && <p className="example-answer">{learningText((part.expected as string[]).map(id => part.options!.find(option => option.id === id)!.label).join(' → '))}</p>}
        {part.kind === 'choice' && <p className="example-answer">{learningText(part.options!.find(option => option.id === part.expected)!.label)}</p>}
        <p>{learningText(part.explanation)}</p>
      </li>)}</ol>
    </details>
    <LabelKey text={[labelText, task.context, ...task.parts.map(part => part.explanation), ...(task.artifact.rows?.flat() ?? []), artifactLabelText(task.artifact.kind)].join(' ')}/>
  </div>
}
