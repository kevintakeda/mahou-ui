export interface SpellDependencies {
  external?: Array<string>
  internal?: Array<string>
}

export interface SpellMetadata {
  category: 'Buttons' | 'Simple' | 'Text'
  aspectRatio: '1:2' | '2:1' | '1:1'
  size: 'default' | 'desktop' | 'mobile'
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
