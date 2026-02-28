export interface SpellDependencies {
  external?: Array<string>
  internal?: Array<string>
}

export interface SpellMetadata {
  dependencies?: SpellDependencies | Array<string>
  center?: boolean
  title?: string
  description?: string
  rank?: number
}

export interface Spell extends SpellMetadata {
  id: string
  files: Record<string, string>
}
