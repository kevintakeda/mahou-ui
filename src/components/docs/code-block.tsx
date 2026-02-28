import { useEffect, useState } from 'react'
import { CopyButton } from './copy-button'
import { highlightCode } from '@/lib/shiki'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  lang: string
  title?: string
  fileName?: string
  className?: string
}

export function CodeBlock({
  code,
  lang,
  title,
  fileName,
  className,
}: CodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null)
  const escapedCode = String(code)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  useEffect(() => {
    let active = true

    void highlightCode(code, lang)
      .then((next) => {
        if (!active) return
        const normalized = next
          .replace(/background-color:[^;"]+;?/g, '')
          .replace(/style=";?"/g, '')
        setHtml(normalized)
      })
      .catch(() => {
        if (!active) return
        setHtml(`<pre><code>${escapedCode}</code></pre>`)
      })

    return () => {
      active = false
    }
  }, [code, escapedCode, lang])

  return (
    <section className={cn('space-y-2', className)}>
      {(title || fileName) && (
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>{title}</span>
          {fileName && (
            <span className="rounded-full border border-neutral-700 px-2 py-0.5">
              {fileName}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        {html ? (
          <div
            className="overflow-hidden scrollbar-hidden rounded-xl [&_pre]:m-0 [&_pre]:bg-neutral-900 [&_pre]:p-4 [&_pre]:pr-12 [&_pre]:text-[13px] [&_pre]:!whitespace-pre-wrap [&_pre]:!break-words [&_code]:!whitespace-pre-wrap [&_code]:!break-all"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <pre className="overflow-hidden scrollbar-hidden rounded-xl bg-neutral-900 p-4 pr-12 text-[13px] text-neutral-300 whitespace-pre-wrap break-all">
            <code>{code}</code>
          </pre>
        )}
        <CopyButton
          text={code}
          copyLabel="Copy code"
          copiedLabel="Copied code"
          className="absolute top-2 right-2 z-10"
        />
      </div>
    </section>
  )
}
