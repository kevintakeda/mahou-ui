export interface SpellMetadata {
  dependencies?: Array<string>
  devDependencies?: Array<string>
  registryDependencies?: Array<string>
  visible?: boolean
  center?: boolean
  title?: string
  description?: string
  rank?: number
}

export interface Spell extends SpellMetadata {
  id: string
  files: Record<string, string>
}
