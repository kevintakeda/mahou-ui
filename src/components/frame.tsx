import type { PropsWithChildren } from 'react'

export function Frame(props: PropsWithChildren) {
  return (
    <div className="h-dvh bg-neutral-950">
      <div className="h-dvh p-2 relative">{props.children}</div>
    </div>
  )
}
