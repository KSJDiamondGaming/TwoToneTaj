import { useLocation } from 'react-router-dom'
import EditableField from './EditableField'
import EditableImage from './EditableImage'
import EditableSection from './EditableSection'
import { useManagedSite } from '../hooks/useManagedSite'

function pageKey(pathname = '/') {
  if (pathname === '/') return 'home'
  return pathname.replace(/^\//, '').split('/')[0] || 'home'
}

function blockField(key, index, field) {
  return `engine.pageBlocks.${key}.${index}.${field}`
}

function safeUrl(value = '') {
  const url = String(value || '').trim()
  if (!url) return '#'
  return url
}

function TextBlock({ block, index, keyName, policy }) {
  return (
    <div className={`managedBlock managedBlock--text managedBlock--${block.align || 'left'}`}>
      <EditableField as="span" className="managedBlockEyebrow" fieldId={blockField(keyName, index, 'eyebrow')} label="Block eyebrow" value={block.eyebrow || ''} policy={policy} />
      <EditableField as="h2" fieldId={blockField(keyName, index, 'title')} label="Block title" value={block.title || 'New text section'} policy={policy} />
      <EditableField as="p" fieldId={blockField(keyName, index, 'text')} label="Block text" value={block.text || 'Click here and start typing.'} policy={policy} kind="textarea" />
    </div>
  )
}

function ImageBlock({ block, index, keyName, policy }) {
  return (
    <div className={`managedBlock managedBlock--image managedBlock--${block.layout || 'wide'}`}>
      <EditableImage fieldId={blockField(keyName, index, 'image')} label="Block image" src={block.image || ''} fallback="" alt={block.alt || block.title || ''} policy={policy} />
      <div>
        <EditableField as="h2" fieldId={blockField(keyName, index, 'title')} label="Image block title" value={block.title || 'Image section'} policy={policy} />
        <EditableField as="p" fieldId={blockField(keyName, index, 'text')} label="Image block text" value={block.text || 'Add supporting text for this image.'} policy={policy} kind="textarea" />
      </div>
    </div>
  )
}

function CtaBlock({ block, index, keyName, policy }) {
  return (
    <div className="managedBlock managedBlock--cta">
      <div>
        <EditableField as="span" className="managedBlockEyebrow" fieldId={blockField(keyName, index, 'eyebrow')} label="Call to action eyebrow" value={block.eyebrow || 'Next Step'} policy={policy} />
        <EditableField as="h2" fieldId={blockField(keyName, index, 'title')} label="Call to action title" value={block.title || 'Ready to get involved?'} policy={policy} />
        <EditableField as="p" fieldId={blockField(keyName, index, 'text')} label="Call to action text" value={block.text || 'Add a clear reason for visitors to take action.'} policy={policy} kind="textarea" />
      </div>
      <a className="btn primary" href={safeUrl(block.buttonUrl)}>{block.buttonLabel || 'Learn More'}</a>
    </div>
  )
}

export default function ManagedPageBlocks() {
  const location = useLocation()
  const { site } = useManagedSite()
  const keyName = pageKey(location.pathname)
  const blocks = Array.isArray(site.pageBlocks?.[keyName]) ? site.pageBlocks[keyName] : []

  if (!blocks.length) return null

  return (
    <section className="managedPageBlocks" aria-label="Additional page sections">
      {blocks
        .map((block, index) => ({ block, index }))
        .sort((left, right) => Number(left.block.order || 0) - Number(right.block.order || 0))
        .map(({ block, index }) => {
          const sectionId = `pageBlocks.${keyName}.${block.id}`
          return (
            <EditableSection
              key={block.id}
              sectionId={sectionId}
              label={block.title || `${block.type} block`}
              policy={site.editorPolicy}
              defaultOrder={Number(block.order || (index + 1) * 10)}
              className="managedPageBlockSection"
              data-ksj-block-id={block.id}
              data-ksj-block-index={index}
              data-ksj-page-key={keyName}
            >
              {block.type === 'image' && <ImageBlock block={block} index={index} keyName={keyName} policy={site.editorPolicy} />}
              {block.type === 'cta' && <CtaBlock block={block} index={index} keyName={keyName} policy={site.editorPolicy} />}
              {(!block.type || block.type === 'text') && <TextBlock block={block} index={index} keyName={keyName} policy={site.editorPolicy} />}
            </EditableSection>
          )
        })}
    </section>
  )
}
