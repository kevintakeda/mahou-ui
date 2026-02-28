import { Suspense, lazy } from 'react'
import type { ComponentType } from 'react'

const spellModules = import.meta.glob<ComponentType>('/src/spells/*/demo.tsx', {
  import: 'default',
})

interface DynamicSpellProps {
  spellId: string
  className?: string
}

const NotFoundComponent = () => (
  <div className="flex items-center justify-center h-full text-neutral-500">
    <span className="text-sm">Component not found</span>
  </div>
)

const componentCache = new Map<string, ComponentType>()

function getLazyComponent(spellId: string): ComponentType {
  const cached = componentCache.get(spellId)
  if (cached) {
    return cached
  }

  const modulePath = `/src/spells/${spellId}/demo.tsx`
  const loader = spellModules[modulePath]

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const Component = loader
    ? lazy(() => loader().then((C) => ({ default: C })))
    : NotFoundComponent

  componentCache.set(spellId, Component)
  return Component
}

export function DynamicSpell({ spellId, className }: DynamicSpellProps) {
  const Component = getLazyComponent(spellId)

  return (
    <div
      className={['h-full w-full flex items-center justify-center', className]
        .filter(Boolean)
        .join(' ')}
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <span className="text-sm text-neutral-500">Loading...</span>
          </div>
        }
      >
        {/* eslint-disable-next-line react-hooks/static-components */}
        <Component />
      </Suspense>
    </div>
  )
}
