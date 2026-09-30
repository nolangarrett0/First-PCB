import { relevantLabelTerms } from './learningLanguage'

export function LabelKey({text}: {text: string}) {
  const terms = relevantLabelTerms(text)
  if (!terms.length) return null
  return <aside className="label-key" aria-label="Labels used here"><h3>Labels used here</h3><dl className="reading-terms">{terms.map(([term, meaning]) => <div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>)}</dl></aside>
}
