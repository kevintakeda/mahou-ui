import { createHighlighter } from 'shiki'
import type { Highlighter } from 'shiki'

let highlighterPromise: Promise<Highlighter> | null = null

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['vitesse-dark'],
      langs: ['tsx', 'bash'],
    })
  }

  return highlighterPromise
}

export async function highlightCode(code: string, lang: string) {
  const highlighter = await getHighlighter()
  return highlighter.codeToHtml(code, {
    lang,
    theme: 'vitesse-dark',
  })
}
