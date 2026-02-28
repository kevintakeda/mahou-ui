import type { Spell } from './types'

// Use Vite's glob import to bundle all metadata and source files
const metadataModules = import.meta.glob<any>('../spells/*/metadata.ts', {
  eager: true,
  import: 'default',
})

const fileModules = import.meta.glob<string>(
  '../spells/**/*.{tsx,ts,jsx,js,css}',
  {
    query: '?raw',
    eager: true,
    import: 'default',
  },
)

const spells: Record<string, Spell> = {}

// Process metadata and files into Spell objects
for (const [path, metadata] of Object.entries(metadataModules)) {
  const id = path.split('/').slice(-2, -1)[0]
  if (!id) continue

  const spellDir = `../spells/${id}/`
  const files: Record<string, string> = {}

  // Gather all files belonging to this spell
  for (const [filePath, content] of Object.entries(fileModules)) {
    if (filePath.startsWith(spellDir) && !filePath.endsWith('metadata.ts')) {
      const fileName = filePath.replace(spellDir, '')
      files[fileName] = content
    }
  }

  spells[id] = {
    id,
    ...metadata,
    files,
  }
}

export function getSpell(id: string): Spell | null {
  return spells[id]
}

export function getAllSpellIds(): Array<string> {
  return Object.keys(spells)
}
