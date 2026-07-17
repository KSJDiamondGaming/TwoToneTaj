import fs from 'node:fs/promises'

const runtime = await fs.readFile(new URL('../src/components/ManagedPageBlocks.jsx', import.meta.url), 'utf8')
const failures = []
const requiredRenderers = ['text', 'image', 'cta', 'gallery', 'video', 'faq', 'products']

if (!runtime.includes('const MANAGED_BLOCK_RENDERERS = Object.freeze({')) failures.push('Managed renderer map is missing')
if (!runtime.includes('export function ManagedBlockRenderer')) failures.push('Universal managed block renderer is missing')
if (!runtime.includes('<ManagedBlockRenderer')) failures.push('Managed page blocks must use the universal renderer')
if (!runtime.includes('function UnsupportedBlock')) failures.push('Unsupported renderer fallback is missing')
if (!runtime.includes("block?.renderer || block?.type || 'text'")) failures.push('Renderer resolution must prefer registry renderer metadata and retain type compatibility')

for (const renderer of requiredRenderers) {
  if (!runtime.includes(`${renderer}: `)) failures.push(`Managed renderer map is missing ${renderer}`)
}

for (const legacyBranch of [
  "{block.type === 'image' && <ImageBlock",
  "{block.type === 'cta' && <CtaBlock",
  "{block.type === 'gallery' && <GalleryBlock",
  "{block.type === 'video' && <VideoBlock",
  "{block.type === 'faq' && <FaqBlock",
  "{block.type === 'products' && <ProductsBlock",
]) {
  if (runtime.includes(legacyBranch)) failures.push(`Legacy managed renderer branch remains: ${legacyBranch}`)
}

if (failures.length) {
  console.error('Managed renderer check failed:')
  failures.forEach(failure => console.error(`- ${failure}`))
  process.exit(1)
}

console.log(`Managed renderer check passed (${requiredRenderers.length} renderers).`)
