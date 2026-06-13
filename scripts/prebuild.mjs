/**
 * Prebuild script — ensures essential generated files exist before `node ace build`.
 * The Tuyau route registry isn't generated during production builds, only during
 * `node ace serve`. Since it's gitignored, it's missing in Docker/Coolify builds.
 */
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const registryDir = resolve(__dirname, '..', '.adonisjs', 'client', 'registry')
const registryFile = resolve(registryDir, 'index.ts')

if (!existsSync(registryFile)) {
  mkdirSync(registryDir, { recursive: true })
  writeFileSync(registryFile,
`// Auto-generated placeholder for production build
// Full registry generated during development by \`node ace serve\`
interface TuyauRoute {
  path: string
  methods: string[]
  params?: string[]
}
type TuyauRegistry = Record<string, TuyauRoute>
export const registry: TuyauRegistry = {}
`.trimStart())
  console.log('>>> Created placeholder Tuyau registry for production build')
}
