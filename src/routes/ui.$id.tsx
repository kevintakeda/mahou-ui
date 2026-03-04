import { Link, createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import { Toolbar } from '../components/toolbar'
import type { Spell } from '@/lib/types'
import { isDocsVisibleAtom } from '@/components/atoms'
import { getSpell } from '@/lib/registry'
import { DynamicSpell } from '@/components/spell'
import { SpellDocsTabs } from '@/components/docs/spell-docs-tabs'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/lib/hooks'

export const Route = createFileRoute('/ui/$id')({
  loader: ({ params }) => {
    const spell = getSpell(params.id)
    return spell
  },
  component: SpellPage,
})

function SpellPage() {
  const spell = Route.useLoaderData()

  if (spell) {
    return <SpellDocsLayout spell={spell} />
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
      <h1 className="text-2xl font-bold mb-4">Spell not found</h1>
      <Link to="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  )
}

function getLanguageFromFileName(fileName: string) {
  if (fileName.endsWith('.css')) return 'css'
  if (fileName.endsWith('.html')) return 'html'
  if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) return 'javascript'
  if (fileName.endsWith('.sh') || fileName.endsWith('.bash')) return 'bash'
  return 'tsx'
}

function getPrimarySourceFile(files: Record<string, string>) {
  const candidates = Object.keys(files)
    .filter(
      (file) =>
        file !== 'demo.tsx' && file !== 'demo.ts' && file !== 'metadata.ts',
    )
    .filter((file) => /\.(tsx|ts|jsx|js)$/.test(file))
    .sort((a, b) => a.localeCompare(b))

  return candidates[0] || ''
}

function toPascalCase(value: string) {
  return value
    .replace(/\.[^.]+$/, '')
    .split(/[-_./\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function buildUsageSpell(sourceFile: string) {
  const importPath = `./${sourceFile.replace(/\.[^.]+$/, '')}`
  const componentName = toPascalCase(sourceFile) || 'Component'

  return [
    `import ${componentName} from '${importPath}'`,
    '',
    'export default function Demo() {',
    `  return <${componentName} />`,
    '}',
  ].join('\n')
}

function SpellDocsLayout({ spell }: { spell: Spell }) {
  const [previewReloadKey, setPreviewReloadKey] = useState(0)
  const isDocsVisible = useAtomValue(isDocsVisibleAtom)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const showDocs = isDesktop && isDocsVisible

  const sourceFile = useMemo(
    () => getPrimarySourceFile(spell.files),
    [spell.files],
  )
  const dependencies = spell.dependencies || []
  const registryDependencies = spell.registryDependencies || []

  const usageCode = useMemo(
    () =>
      sourceFile
        ? buildUsageSpell(sourceFile)
        : "import Component from './component'",
    [sourceFile],
  )
  const sourceCode = sourceFile ? spell.files[sourceFile] || '' : ''
  const sources = [
    {
      sourceCode,
      sourceTitle: sourceFile ? `Source (${sourceFile})` : 'Source',
      sourceLang: getLanguageFromFileName(sourceFile || 'source.tsx'),
    },
  ]
  const installCommand = `shadcn@latest add https://mahou-ui.kevintakeda.com/r/${spell.id}.json`
  const handleReload = () => setPreviewReloadKey((prev) => prev + 1)
  const docsWidth = '45vw'
  const previewLeft = showDocs ? '45vw' : 0
  const docsClosedX = -24
  const docsScale = showDocs ? 1 : 0.985
  const panelSpring = { type: 'spring' as const, stiffness: 340, damping: 34 }

  return (
    <div className="relative h-dvh w-screen bg-neutral-950 text-neutral-200">
      <div className="h-full w-full p-2">
        <div className="relative h-full w-full min-h-0 min-w-0 overflow-hidden">
          <motion.section
            initial={false}
            animate={{
              opacity: showDocs ? 1 : 0,
              x: showDocs ? 0 : docsClosedX,
              scale: docsScale,
            }}
            transition={panelSpring}
            className="absolute inset-y-0 left-0 z-10 hidden overflow-hidden md:block"
            style={{
              width: docsWidth,
              pointerEvents: isDocsVisible ? 'auto' : 'none',
            }}
          >
            <div className="h-full overflow-auto scrollbar-hidden px-5 pt-24 pb-5">
              <p className="text-xs uppercase tracking-widest text-neutral-500">
                Component
              </p>
              <h1 className="mt-2 text-2xl font-medium text-white">
                {spell.title || spell.id}
              </h1>
              <p className="mt-2 text-sm text-neutral-400">
                {spell.description ||
                  `Reusable ${spell.id} component with copy-paste source.`}
              </p>
              <SpellDocsTabs
                installCommand={installCommand}
                usageCode={usageCode}
                sources={sources}
                dependencies={dependencies}
                registryDependencies={registryDependencies}
              />
            </div>
          </motion.section>

          <motion.div
            initial={false}
            animate={{ left: previewLeft }}
            transition={panelSpring}
            className="absolute inset-y-0 right-0 z-20"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="h-full min-h-0 min-w-0 rounded-2xl bg-neutral-900 relative">
              <Toolbar onReload={handleReload} />
              <DynamicSpell
                key={`${spell.id}-${previewReloadKey}`}
                spellId={spell.id}
                className="h-full w-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
