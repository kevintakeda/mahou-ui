import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const isMenuOpenAtom = atom(false)
export const isDocsVisibleAtom = atom(false)

export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun'

export const packageManagerAtom = atomWithStorage<PackageManager>(
  'preferred-install-pm',
  'pnpm',
)
