import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const REGISTRY_DIR = path.resolve(__dirname, '../public/r')
const SHADCN_REGISTRY_FILE = path.resolve(
  __dirname,
  '../public/r/registry.json',
)
const SKETCHES_DIR = path.resolve(__dirname, '../src/spells')

type NormalizedDependencies = {
  external: Array<string>
  internal: Array<string>
}

type ShadcnRegistryFileType =
  | 'registry:component'
  | 'registry:hook'
  | 'registry:lib'
  | 'registry:page'

type ShadcnRegistryItem = {
  name: string
  type: 'registry:component'
  title: string
  description: string
  dependencies?: Array<string>
  registryDependencies?: Array<string>
  files: Array<{
    path: string
    type: ShadcnRegistryFileType
  }>
}

function toTitleCase(id: string): string {
  return id
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function isComponentSourceFile(file: string): boolean {
  if (file === 'demo.tsx' || file === 'demo.ts') return false
  if (file === 'metadata.ts') return false
  return /\.(tsx|ts|jsx|js)$/.test(file)
}

function normalizeDependencies(dependencies: any): NormalizedDependencies {
  if (Array.isArray(dependencies)) {
    return { external: dependencies, internal: [] }
  }

  return {
    external: dependencies?.external || [],
    internal: dependencies?.internal || [],
  }
}

function getRegistryFileType(file: string): ShadcnRegistryFileType {
  const normalized = file.toLowerCase()

  if (normalized.includes('/hooks/') || normalized.startsWith('use-')) {
    return 'registry:hook'
  }

  if (normalized.endsWith('.ts') || normalized.endsWith('.js')) {
    return 'registry:lib'
  }

  if (normalized.includes('/pages/') || normalized.includes('/app/')) {
    return 'registry:page'
  }

  return 'registry:component'
}

async function main() {
  console.log('Generating spell indexes...')
  await fs.mkdir(REGISTRY_DIR, { recursive: true })

  const entries = await fs.readdir(SKETCHES_DIR, { withFileTypes: true })
  const spellDirs = entries.filter((dirent) => dirent.isDirectory())

  const byId: Record<string, any> = {}
  const byCategory: Record<string, Array<string>> = {}
  const shadcnItems: Array<ShadcnRegistryItem> = []

  for (const dir of spellDirs) {
    const id = dir.name
    const metadataPath = path.join(SKETCHES_DIR, id, 'metadata.ts')

    try {
      await fs.access(metadataPath)

      const module = await import(metadataPath + `?t=${Date.now()}`)
      const metadata = module.default || module.metadata

      if (!metadata) {
        console.warn(`No metadata found for spell: ${id}`)
        continue
      }

      const spellPath = path.join(SKETCHES_DIR, id)
      const files: Record<string, string> = {}

      const fileEntries = await fs.readdir(spellPath)

      for (const file of fileEntries) {
        if (file === 'metadata.ts') continue

        const filePath = path.join(spellPath, file)
        const stat = await fs.stat(filePath)

        if (stat.isFile()) {
          const content = await fs.readFile(filePath, 'utf-8')
          files[file] = content
        }
      }

      if (!files['demo.tsx']) {
        console.warn(`Skipping ${id}: required file demo.tsx is missing`)
        continue
      }

      const sourceFiles = Object.keys(files).filter(isComponentSourceFile)

      if (sourceFiles.length === 0) {
        console.warn(
          `Skipping ${id}: at least one component source file is required (non-demo .tsx/.ts/.jsx/.js)`,
        )
        continue
      }

      console.log(`Processing ${id}...`)

      const normalizedDependencies = normalizeDependencies(
        metadata.dependencies,
      )

      const data = {
        id,
        ...metadata,
        dependencies: normalizedDependencies,
        files,
      }

      await fs.writeFile(
        path.join(REGISTRY_DIR, `${id}.json`),
        JSON.stringify(data, null, 2),
      )

      byId[id] = data

      const publicItemDir = path.join(REGISTRY_DIR, id)
      await fs.mkdir(publicItemDir, { recursive: true })

      for (const [fileName, content] of Object.entries(files)) {
        await fs.writeFile(path.join(publicItemDir, fileName), content)
      }

      const shadcnItem: ShadcnRegistryItem = {
        name: id,
        type: 'registry:component',
        title: metadata.title || toTitleCase(id),
        description: metadata.description || `Reusable ${id} component.`,
        files: Object.keys(files)
          .filter((fileName) => fileName !== 'metadata.ts')
          .sort((a, b) => a.localeCompare(b))
          .map((fileName) => ({
            path: `registry/${id}/${fileName}`,
            type: getRegistryFileType(fileName),
          })),
      }

      if (normalizedDependencies.external.length > 0) {
        shadcnItem.dependencies = normalizedDependencies.external
      }
      if (normalizedDependencies.internal.length > 0) {
        shadcnItem.registryDependencies = normalizedDependencies.internal
      }

      shadcnItems.push(shadcnItem)

      const category = metadata.category || 'Uncategorized'
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      byCategory[category] = byCategory[category] || []
      byCategory[category].push(id)
    } catch (err) {
      if ((err as any).code === 'ENOENT') {
        console.warn(`Skipping ${id}, no metadata.ts`)
      } else {
        console.error(`Error processing ${id}:`, err)
      }
    }
  }

  const shadcnRegistry = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'mahou-ui',
    homepage: 'https://github.com/kevintakeda/mahou-ui',
    items: shadcnItems.sort((a, b) => a.name.localeCompare(b.name)),
  }

  await fs.writeFile(
    SHADCN_REGISTRY_FILE,
    JSON.stringify(shadcnRegistry, null, 2),
  )
  console.log(`Generated shadcn registry at ${SHADCN_REGISTRY_FILE}`)
}

main().catch(console.error)
