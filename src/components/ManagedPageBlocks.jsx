import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import EditableField from './EditableField'
import EditableImage from './EditableImage'
import EditableSection from './EditableSection'
import { useManagedSite } from '../hooks/useManagedSite'
import { editorRoute } from '../utils/editorRoute'

const BLOCK_TYPES = [
  ['text', 'Text'],
  ['image', 'Image'],
  ['cta', 'Call to action'],
  ['gallery', 'Gallery'],
  ['video', 'Video'],
  ['faq', 'FAQ'],
  ['products', 'Product grid'],
]

function pageKey(pathname = '/') {
  if (pathname === '/') return 'home'
  return pathname.replace(/^\//, '').split('/')[0] || 'home'
}

function blockField(key, index, field) {
  return `engine.pageBlocks.${key}.${index}.${field}`
}

function editorEnabled() {
  return new URLSearchParams(window.location.search).get('ksjEditor') === '1'
}

function safeUrl(value = '') {
  return String(value || '').trim() || '#'
}

function commitBlockSetting(fieldId, value) {
  window.parent.postMessage({
    source: 'ksj-site-editor',
    type: 'inline-commit',
    field: { fieldId, label: 'Block setting', value, kind: 'text' },
  }, '*')
}

function videoEmbedUrl(value = '') {
  try {
    const url = new URL(value)
    if (url.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${url.pathname.replace('/', '')}`
    if (url.hostname.includes('youtube.com')) {
      const id = url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).pop()
      return id ? `https://www.youtube.com/embed/${id}` : ''
    }
    if (url.hostname.includes('vimeo.com')) {
      const id = url.pathname.split('/').filter(Boolean).pop()
      return id ? `https://player.vimeo.com/video/${id}` : ''
    }
  } catch {
    return ''
  }
  return ''
}

function defaultGalleryItems(block) {
  return Array.isArray(block.images) && block.images.length
    ? block.images
    : Array.from({ length: 4 }, () => ({ src: '', alt: '', caption: '' }))
}

function defaultFaqItems(block) {
  return Array.isArray(block.items) && block.items.length
    ? block.items
    : Array.from({ length: 4 }, (_, index) => ({ question: `Question ${index + 1}`, answer: 'Add the answer here.' }))
}

function BlockControls({ block, index, keyName }) {
  const enabled = useMemo(editorEnabled, [])
  const [open, setOpen] = useState(false)
  if (!enabled) return null

  const field = name => blockField(keyName, index, name)
  const galleryItems = defaultGalleryItems(block)
  const faqItems = defaultFaqItems(block)

  return (
    <div className="managedBlockControls" onClick={event => event.stopPropagation()}>
      <button type="button" className="managedBlockControlToggle" onClick={() => setOpen(current => !current)} aria-expanded={open}>⚙ Block</button>
      {open && (
        <div className="managedBlockControlPanel">
          <label>Section type
            <select value={block.type || 'text'} onChange={event => commitBlockSetting(field('type'), event.target.value)}>
              {BLOCK_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>

          {['text', 'cta'].includes(block.type || 'text') && (
            <label>Alignment
              <select value={block.align || 'left'} onChange={event => commitBlockSetting(field('align'), event.target.value)}>
                <option value="left">Left</option><option value="center">Centre</option><option value="right">Right</option>
              </select>
            </label>
          )}

          {block.type === 'image' && <>
            <label>Layout
              <select value={block.layout || 'wide'} onChange={event => commitBlockSetting(field('layout'), event.target.value)}>
                <option value="wide">Image left</option><option value="reverse">Image right</option><option value="stacked">Image above</option>
              </select>
            </label>
            <label>Alternative text<input value={block.alt || ''} onChange={event => commitBlockSetting(field('alt'), event.target.value)} placeholder="Describe the image" /></label>
          </>}

          {block.type === 'cta' && <>
            <label>Button destination<input value={block.buttonUrl || ''} onChange={event => commitBlockSetting(field('buttonUrl'), event.target.value)} placeholder="/contact or https://…" /></label>
            <label className="managedBlockCheck"><input type="checkbox" checked={block.newTab === true} onChange={event => commitBlockSetting(field('newTab'), event.target.checked)} /> Open in new tab</label>
          </>}

          {block.type === 'gallery' && <>
            <label>Columns
              <select value={String(block.columns || 3)} onChange={event => commitBlockSetting(field('columns'), Number(event.target.value))}>
                <option value="2">2 columns</option><option value="3">3 columns</option><option value="4">4 columns</option>
              </select>
            </label>
            <div className="managedCollectionSummary"><span>{galleryItems.length} images</span><button type="button" onClick={() => commitBlockSetting(field('images'), [...galleryItems, { src: '', alt: '', caption: '' }])}>＋ Add Image</button></div>
          </>}

          {block.type === 'video' && <label>Video URL<input value={block.videoUrl || ''} onChange={event => commitBlockSetting(field('videoUrl'), event.target.value)} placeholder="YouTube or Vimeo URL" /></label>}

          {block.type === 'faq' && <>
            <label className="managedBlockCheck"><input type="checkbox" checked={block.openFirst === true} onChange={event => commitBlockSetting(field('openFirst'), event.target.checked)} /> Open first answer by default</label>
            <div className="managedCollectionSummary"><span>{faqItems.length} questions</span><button type="button" onClick={() => commitBlockSetting(field('items'), [...faqItems, { question: `Question ${faqItems.length + 1}`, answer: 'Add the answer here.' }])}>＋ Add Question</button></div>
          </>}

          {block.type === 'products' && <>
            <label>Maximum products
              <select value={String(block.limit || 4)} onChange={event => commitBlockSetting(field('limit'), Number(event.target.value))}>
                <option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="6">6</option><option value="8">8</option>
              </select>
            </label>
            <label className="managedBlockCheck"><input type="checkbox" checked={block.featuredOnly === true} onChange={event => commitBlockSetting(field('featuredOnly'), event.target.checked)} /> Featured products only</label>
          </>}
        </div>
      )}
    </div>
  )
}

function CollectionItemControls({ items, index, fieldId, label }) {
  const enabled = useMemo(editorEnabled, [])
  if (!enabled) return null

  function move(direction) {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = items.map(item => ({ ...item }))
    ;[next[index], next[target]] = [next[target], next[index]]
    commitBlockSetting(fieldId, next)
  }

  function remove() {
    if (items.length <= 1) return
    const next = items.filter((_, itemIndex) => itemIndex !== index)
    commitBlockSetting(fieldId, next)
  }

  return (
    <div className="managedCollectionItemControls" onClick={event => event.stopPropagation()} aria-label={`${label} controls`}>
      <button type="button" disabled={index === 0} onClick={() => move(-1)} title="Move earlier">↑</button>
      <button type="button" disabled={index === items.length - 1} onClick={() => move(1)} title="Move later">↓</button>
      <button type="button" className="danger" disabled={items.length <= 1} onClick={remove} title="Remove">×</button>
    </div>
  )
}

function BlockHeading({ block, index, keyName, policy, fallbackTitle }) {
  return <>
    <EditableField as="span" className="managedBlockEyebrow" fieldId={blockField(keyName, index, 'eyebrow')} label="Block eyebrow" value={block.eyebrow || ''} policy={policy} />
    <EditableField as="h2" fieldId={blockField(keyName, index, 'title')} label="Block title" value={block.title || fallbackTitle} policy={policy} />
    {block.text !== undefined && <EditableField as="p" fieldId={blockField(keyName, index, 'text')} label="Block text" value={block.text || ''} policy={policy} kind="textarea" />}
  </>
}

function TextBlock({ block, index, keyName, policy }) {
  return <div className={`managedBlock managedBlock--text managedBlock--${block.align || 'left'}`}><BlockControls block={block} index={index} keyName={keyName} /><BlockHeading block={block} index={index} keyName={keyName} policy={policy} fallbackTitle="New text section" /></div>
}

function ImageBlock({ block, index, keyName, policy }) {
  return <div className={`managedBlock managedBlock--image managedBlock--${block.layout || 'wide'}`}><BlockControls block={block} index={index} keyName={keyName} /><EditableImage fieldId={blockField(keyName, index, 'image')} label="Block image" src={block.image || ''} fallback="" alt={block.alt || block.title || ''} policy={policy} /><div><BlockHeading block={block} index={index} keyName={keyName} policy={policy} fallbackTitle="Image section" /></div></div>
}

function CtaBlock({ block, index, keyName, policy }) {
  return <div className={`managedBlock managedBlock--cta managedBlock--${block.align || 'left'}`}><BlockControls block={block} index={index} keyName={keyName} /><div><BlockHeading block={block} index={index} keyName={keyName} policy={policy} fallbackTitle="Ready to get involved?" /></div><a className="btn primary" href={safeUrl(block.buttonUrl)} target={block.newTab ? '_blank' : undefined} rel={block.newTab ? 'noreferrer' : undefined}><EditableField as="span" fieldId={blockField(keyName, index, 'buttonLabel')} label="Button label" value={block.buttonLabel || 'Learn More'} policy={policy} /></a></div>
}

function GalleryBlock({ block, index, keyName, policy }) {
  const images = defaultGalleryItems(block)
  const imagesField = blockField(keyName, index, 'images')
  return <div className="managedBlock managedBlock--gallery"><BlockControls block={block} index={index} keyName={keyName} /><BlockHeading block={block} index={index} keyName={keyName} policy={policy} fallbackTitle="Gallery" /><div className="managedGalleryGrid" style={{ '--gallery-columns': block.columns || 3 }}>{images.map((image, imageIndex) => <figure key={`${image.src || 'image'}-${imageIndex}`}><CollectionItemControls items={images} index={imageIndex} fieldId={imagesField} label={`Gallery image ${imageIndex + 1}`} /><EditableImage fieldId={blockField(keyName, index, `images.${imageIndex}.src`)} label={`Gallery image ${imageIndex + 1}`} src={image.src || ''} fallback="" alt={image.alt || ''} policy={policy} /><EditableField as="figcaption" fieldId={blockField(keyName, index, `images.${imageIndex}.caption`)} label={`Gallery caption ${imageIndex + 1}`} value={image.caption || ''} policy={policy} /></figure>)}</div></div>
}

function VideoBlock({ block, index, keyName, policy }) {
  const embed = videoEmbedUrl(block.videoUrl)
  return <div className="managedBlock managedBlock--video"><BlockControls block={block} index={index} keyName={keyName} /><BlockHeading block={block} index={index} keyName={keyName} policy={policy} fallbackTitle="Featured video" />{embed ? <div className="managedVideoFrame"><iframe src={embed} title={block.title || 'Featured video'} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div> : <div className="managedVideoPlaceholder">Add a YouTube or Vimeo URL from <strong>⚙ Block</strong>.</div>}</div>
}

function FaqBlock({ block, index, keyName, policy }) {
  const items = defaultFaqItems(block)
  const itemsField = blockField(keyName, index, 'items')
  return <div className="managedBlock managedBlock--faq"><BlockControls block={block} index={index} keyName={keyName} /><BlockHeading block={block} index={index} keyName={keyName} policy={policy} fallbackTitle="Frequently asked questions" /><div className="managedFaqList">{items.map((item, itemIndex) => <div className="managedFaqItem" key={`${item.question || 'question'}-${itemIndex}`}><CollectionItemControls items={items} index={itemIndex} fieldId={itemsField} label={`FAQ item ${itemIndex + 1}`} /><details open={block.openFirst === true && itemIndex === 0}><summary><EditableField as="span" fieldId={blockField(keyName, index, `items.${itemIndex}.question`)} label={`FAQ question ${itemIndex + 1}`} value={item.question || `Question ${itemIndex + 1}`} policy={policy} /></summary><EditableField as="p" fieldId={blockField(keyName, index, `items.${itemIndex}.answer`)} label={`FAQ answer ${itemIndex + 1}`} value={item.answer || 'Add the answer here.'} policy={policy} kind="textarea" /></details></div>)}</div></div>
}

function ProductsBlock({ block, index, keyName, policy, products = [] }) {
  const available = products.filter(product => product.availability !== 'hidden' && (!block.featuredOnly || product.featured === true)).slice(0, Number(block.limit || 4))
  return <div className="managedBlock managedBlock--products"><BlockControls block={block} index={index} keyName={keyName} /><BlockHeading block={block} index={index} keyName={keyName} policy={policy} fallbackTitle="Featured products" />{available.length ? <div className="managedProductGrid">{available.map(product => <article key={product.id}><div className="managedProductImage">{product.image ? <img src={product.image} alt={product.imageAlt || product.name || ''} /> : <span>No image</span>}</div><h3>{product.name}</h3><p>{product.description}</p><strong>£{Number(product.priceGBP || 0).toFixed(2)}</strong></article>)}</div> : <div className="managedVideoPlaceholder">No matching products are currently available.</div>}<Link className="btn ghost" to={editorRoute('/merch')}>View all merchandise</Link></div>
}

export default function ManagedPageBlocks() {
  const location = useLocation()
  const { site } = useManagedSite()
  const keyName = pageKey(location.pathname)
  const blocks = Array.isArray(site.pageBlocks?.[keyName]) ? site.pageBlocks[keyName] : []
  if (!blocks.length) return null

  return <section className="managedPageBlocks" aria-label="Additional page sections">{blocks.map((block, index) => ({ block, index })).sort((left, right) => Number(left.block.order || 0) - Number(right.block.order || 0)).map(({ block, index }) => {
    const sectionId = `pageBlocks.${keyName}.${block.id}`
    const common = { block, index, keyName, policy: site.editorPolicy }
    return <EditableSection key={block.id} sectionId={sectionId} label={block.title || `${block.type} block`} policy={site.editorPolicy} defaultOrder={Number(block.order || (index + 1) * 10)} className="managedPageBlockSection" data-ksj-block-id={block.id} data-ksj-block-index={index} data-ksj-page-key={keyName}>
      {block.type === 'image' && <ImageBlock {...common} />}
      {block.type === 'cta' && <CtaBlock {...common} />}
      {block.type === 'gallery' && <GalleryBlock {...common} />}
      {block.type === 'video' && <VideoBlock {...common} />}
      {block.type === 'faq' && <FaqBlock {...common} />}
      {block.type === 'products' && <ProductsBlock {...common} products={site.merch?.products || []} />}
      {(!block.type || block.type === 'text') && <TextBlock {...common} />}
    </EditableSection>
  })}</section>
}
