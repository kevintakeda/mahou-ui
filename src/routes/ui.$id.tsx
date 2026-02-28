import { Link, createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Tabs } from '@base-ui/react/tabs'
import { RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import type { Spell } from '@/lib/types'
import { isDocsVisibleAtom } from '@/components/atoms'
import { getSpell } from '@/lib/registry'
import { DynamicSpell } from '@/components/spell'
import { CodeBlock } from '@/components/docs/code-block'
import { CliCommandSpell } from '@/components/docs/cli-command-spell'
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

function normalizeDependencies(dependencies: Spell['dependencies']): {
  external: Array<string>
  internal: Array<string>
} {
  if (!dependencies) return { external: [], internal: [] }
  if (Array.isArray(dependencies)) {
    return { external: dependencies, internal: [] }
  }
  return {
    external: dependencies.external || [],
    internal: dependencies.internal || [],
  }
}

function SpellDocsLayout({ spell }: { spell: Spell }) {
  const isSmall = useMediaQuery('(max-width: 768px)')
  const [previewReloadKey, setPreviewReloadKey] = useState(0)
  const isDocsVisible = useAtomValue(isDocsVisibleAtom)

  const sourceFile = useMemo(
    () => getPrimarySourceFile(spell.files),
    [spell.files],
  )
  const dependencyInfo = useMemo(
    () => normalizeDependencies(spell.dependencies),
    [spell.dependencies],
  )

  const usageCode = useMemo(
    () =>
      sourceFile
        ? buildUsageSpell(sourceFile)
        : "import Component from './component'",
    [sourceFile],
  )
  const sourceCode = sourceFile ? spell.files[sourceFile] || '' : ''
  const installCommand = `shadcn@latest add https://mahou-ui.kevintakeda.com/r/${spell.id}.json`
  const docsPanelWidth = isSmall ? 320 : 460
  const previewShift = docsPanelWidth + 8
  const handlePreviewReload = () => setPreviewReloadKey((prev) => prev + 1)

  return (
    <div className="relative h-dvh w-screen bg-neutral-950 text-neutral-200">
      <div className="absolute top-6 right-6 z-30">
        <Button
          size="icon-lg"
          variant="secondary"
          className="shadow-md rounded-xl"
          aria-label="Reload component preview"
          onClick={handlePreviewReload}
        >
          <RefreshCw className="size-5" />
        </Button>
      </div>

      <div className="h-full w-full p-2">
        <div className="relative h-full w-full min-h-0 min-w-0 overflow-hidden">
          <motion.section
            initial={false}
            animate={{
              opacity: isDocsVisible ? 1 : 0,
              x: isDocsVisible ? 0 : -24,
              scale: isDocsVisible ? 1 : 0.985,
            }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            className="absolute inset-y-0 left-0 z-10 overflow-hidden"
            style={{
              width: docsPanelWidth,
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

              <Tabs.Root className="mt-5" defaultValue="cli">
                <Tabs.List className="relative z-0 flex gap-1 p-0">
                  <Tabs.Tab
                    value="cli"
                    className="relative z-10 flex h-7 cursor-pointer items-center justify-center rounded-md border-0 px-3 text-xs font-medium whitespace-nowrap text-neutral-400 outline-none transition-colors select-none hover:text-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-500 data-[active]:text-neutral-100"
                  >
                    CLI
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="manual"
                    className="relative z-10 flex h-7 cursor-pointer items-center justify-center rounded-md border-0 px-3 text-xs font-medium whitespace-nowrap text-neutral-400 outline-none transition-colors select-none hover:text-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-500 data-[active]:text-neutral-100"
                  >
                    Manual
                  </Tabs.Tab>
                  <Tabs.Indicator className="absolute inset-y-0 left-0 z-0 w-[--active-tab-width] translate-x-[--active-tab-left] rounded-md bg-neutral-800 transition-all duration-200 ease-in-out" />
                </Tabs.List>

                <Tabs.Panel value="cli" className="mt-6 space-y-6">
                  <CliCommandSpell
                    command={installCommand}
                    title="Installation"
                    npx
                  />
                  <CodeBlock title="Usage" code={usageCode} lang="tsx" />
                </Tabs.Panel>

                <Tabs.Panel value="manual" className="mt-6 space-y-4">
                  {(dependencyInfo.external.length > 0 ||
                    dependencyInfo.internal.length > 0) && (
                    <div className="space-y-2">
                      {dependencyInfo.external.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs text-neutral-400">
                            External dependencies
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {dependencyInfo.external.map((dep) => (
                              <span
                                key={dep}
                                className="rounded-md border border-neutral-700 px-2 py-0.5 text-xs text-neutral-300"
                              >
                                {dep}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {dependencyInfo.internal.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs text-neutral-400">
                            Internal dependencies
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {dependencyInfo.internal.map((dep) => (
                              <span
                                key={dep}
                                className="rounded-md border border-neutral-700 px-2 py-0.5 text-xs text-neutral-300"
                              >
                                {dep}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <CodeBlock title="Usage" code={usageCode} lang="tsx" />
                  <CodeBlock
                    title={sourceFile ? `Source (${sourceFile})` : 'Source'}
                    code={sourceCode}
                    lang={getLanguageFromFileName(sourceFile || 'source.tsx')}
                  />
                </Tabs.Panel>
              </Tabs.Root>
            </div>
          </motion.section>

          <motion.div
            initial={false}
            animate={{ left: isDocsVisible ? previewShift : 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            className="absolute inset-y-0 right-0 z-20"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="h-full min-h-0 min-w-0 rounded-2xl bg-neutral-900">
              <div className="h-full w-full min-h-0 min-w-0 flex items-center justify-center p-8">
                <DynamicSpell
                  key={`${spell.id}-${previewReloadKey}`}
                  spellId={spell.id}
                  className="h-full w-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
