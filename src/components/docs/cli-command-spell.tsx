import { Tabs } from '@base-ui/react/tabs'
import { useEffect, useMemo, useState } from 'react'
import { useAtom } from 'jotai'
import { CopyButton } from './copy-button'
import type { PackageManager } from '@/components/atoms'
import { highlightCode } from '@/lib/shiki'
import { packageManagerAtom } from '@/components/atoms'

interface CliCommandSpellProps {
  command: string
  title?: string
  npx?: boolean
}

const packageManagers: Array<{ id: PackageManager; label: string }> = [
  { id: 'pnpm', label: 'pnpm' },
  { id: 'npm', label: 'npm' },
  { id: 'yarn', label: 'yarn' },
  { id: 'bun', label: 'bun' },
]

function isPackageManager(value: string): value is PackageManager {
  return packageManagers.some((pm) => pm.id === value)
}

function getCommandPrefix(pm: PackageManager, npx: boolean) {
  if (npx) {
    switch (pm) {
      case 'pnpm':
        return 'pnpm dlx'
      case 'npm':
        return 'npx'
      case 'yarn':
        return 'npx'
      case 'bun':
        return 'bunx --bun'
    }
  }

  switch (pm) {
    case 'pnpm':
      return 'pnpm add'
    case 'npm':
      return 'npm install'
    case 'yarn':
      return 'yarn add'
    case 'bun':
      return 'bun add'
  }
}

export function CliCommandSpell({
  command,
  title = 'Installation',
  npx = false,
}: CliCommandSpellProps) {
  const [storedPackageManager, setStoredPackageManager] =
    useAtom(packageManagerAtom)
  const [html, setHtml] = useState<string | null>(null)
  const activeTab = isPackageManager(storedPackageManager)
    ? storedPackageManager
    : 'pnpm'

  const fullCommand = useMemo(() => {
    return `${getCommandPrefix(activeTab, npx)} ${command}`
  }, [activeTab, command, npx])

  useEffect(() => {
    let active = true

    void highlightCode(fullCommand, 'bash')
      .then((next) => {
        if (!active) return
        const normalized = next
          .replace(/background-color:[^;"]+;?/g, '')
          .replace(/style=";?"/g, '')
        setHtml(normalized)
      })
      .catch(() => {
        if (!active) return
        setHtml(null)
      })

    return () => {
      active = false
    }
  }, [fullCommand])

  return (
    <section className="space-y-2">
      <div className="text-xs text-neutral-400">{title}</div>
      <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-800 px-3">
          <Tabs.Root
            value={activeTab}
            onValueChange={(value) => {
              if (!isPackageManager(value)) return
              setStoredPackageManager(value)
            }}
          >
            <Tabs.List className="relative z-0 flex items-center gap-0.5 p-0">
              {packageManagers.map((pm) => (
                <Tabs.Tab
                  key={pm.id}
                  value={pm.id}
                  aria-label={pm.label}
                  className="relative z-10 flex h-8 cursor-pointer items-center justify-center border-0 px-2 text-xs font-medium whitespace-nowrap text-neutral-500 outline-none transition-colors select-none hover:text-neutral-200 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-neutral-500 data-[active]:text-neutral-100"
                >
                  {pm.label}
                </Tabs.Tab>
              ))}
              <Tabs.Indicator className="absolute bottom-0 left-0 z-0 h-0.5 w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)] rounded-full bg-neutral-100 transition-all duration-200 ease-in-out" />
            </Tabs.List>
          </Tabs.Root>
        </div>

        <div className="relative bg-neutral-950">
          {html ? (
            <div
              className="[&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-3 [&_pre]:pr-12 [&_pre]:text-[13px] [&_pre]:leading-6 [&_pre]:!whitespace-pre-wrap [&_pre]:!break-words [&_code]:!whitespace-pre-wrap [&_code]:!break-all"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <pre className="m-0 bg-transparent p-3 pr-12 text-[13px] text-neutral-200 whitespace-pre-wrap break-all">
              <code>{fullCommand}</code>
            </pre>
          )}
          <CopyButton
            text={fullCommand}
            copyLabel="Copy command"
            copiedLabel="Copied command"
            className="absolute top-1/2 right-3 -translate-y-1/2"
          />
        </div>
      </div>
    </section>
  )
}
