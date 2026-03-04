import { Tabs } from '@base-ui/react/tabs'
import { motion } from 'motion/react'
import { useState } from 'react'
import { CliCommandSpell } from '@/components/docs/cli-command-spell'
import { CodeBlock } from '@/components/docs/code-block'

interface SpellDocsTabsProps {
  installCommand: string
  usageCode: string
  sources: Array<{
    sourceCode: string
    sourceTitle: string
    sourceLang: string
  }>
  dependencies: Array<string>
  registryDependencies: Array<string>
}

export function SpellDocsTabs({
  installCommand,
  usageCode,
  sources,
  dependencies,
  registryDependencies,
}: SpellDocsTabsProps) {
  const [activeTab, setActiveTab] = useState<'cli' | 'manual'>('cli')

  return (
    <Tabs.Root
      className="mt-5"
      value={activeTab}
      onValueChange={(value) =>
        setActiveTab(value === 'manual' ? 'manual' : 'cli')
      }
    >
      <Tabs.List className="relative z-0 flex gap-1 p-0">
        <Tabs.Tab
          value="cli"
          className="relative z-10 flex h-7 cursor-pointer items-center justify-center rounded-md border-0 px-3 text-xs font-medium whitespace-nowrap text-neutral-400 outline-none transition-colors select-none hover:text-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-500 data-[active]:text-neutral-100"
        >
          {activeTab === 'cli' && (
            <motion.div
              layoutId="docs-tab-indicator"
              className="absolute inset-0 z-0 rounded-md bg-neutral-800"
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            />
          )}
          <span className="relative z-10">CLI</span>
        </Tabs.Tab>
        <Tabs.Tab
          value="manual"
          className="relative z-10 flex h-7 cursor-pointer items-center justify-center rounded-md border-0 px-3 text-xs font-medium whitespace-nowrap text-neutral-400 outline-none transition-colors select-none hover:text-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-500 data-[active]:text-neutral-100"
        >
          {activeTab === 'manual' && (
            <motion.div
              layoutId="docs-tab-indicator"
              className="absolute inset-0 z-0 rounded-md bg-neutral-800"
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            />
          )}
          <span className="relative z-10">Manual</span>
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="cli" className="mt-6 space-y-6">
        <CliCommandSpell command={installCommand} title="Installation" npx />
        <CodeBlock title="Usage" code={usageCode} lang="tsx" />
      </Tabs.Panel>

      <Tabs.Panel value="manual" className="mt-6 space-y-4">
        {(dependencies.length > 0 || registryDependencies.length > 0) && (
          <div className="space-y-2">
            {dependencies.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-neutral-400">Dependencies</p>
                <div className="flex flex-wrap gap-1.5">
                  {dependencies.map((dep) => (
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
            {registryDependencies.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-neutral-400">
                  Registry dependencies
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {registryDependencies.map((dep) => (
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
        {sources.map((source, index) => (
          <CodeBlock
            key={`${source.sourceTitle}-${index}`}
            title={source.sourceTitle}
            code={source.sourceCode}
            lang={source.sourceLang}
          />
        ))}
      </Tabs.Panel>
    </Tabs.Root>
  )
}
