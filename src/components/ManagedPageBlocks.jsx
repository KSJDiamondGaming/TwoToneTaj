import { useMemo, useState } from 'react'
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

function editorEnabled() {
  return new URLSearchParams(window.location.search).get('ksjEditor') === '1'
}

function safeUrl(value = '') {
  const url = String(value || '').trim()
  if (!url) return '#'
  return url
}

function commitBlockSetting(fieldId, value) {
  window.parent.postMessage({
    source: 'ksj-site-editor',
    type: 'inline-commit',
    field: { fieldId, label: 'Block setting', value, kind: 'text' },
  }, '*')
}

function BlockControls({ block, index, keyName }) {
  const enabled = useMemo(editorEnabled, [])
  const [open, setOpen] = useState(false)

  if (!enabled) return null

  return (
    <div className="managedBlockControls" onClick={event => event.stopPropagation()}>
      <button type="button" className="managedBlockControlToggle" onClick={() => setOpen(current => !current)} aria-expanded={open}>⚙ Block</button>
      {open && (
        <div className="managedBlockControlPanel">
          {block.type === 'text' && (
            <label>Alignment
              <select value={block.align || 'left'} onChange={event => commitBlockSetting(blockField(keyName, index, 'align'), event.target.value)}>
                <option value="left">Left</option>
                <option value="center">Centre</option>
                <option value="right">Right</option>
              </select>
            </label>
          )}

          {block.type === 'image' && (
            <>
              <label>Layout
                <select value={block.layout || 'wide'} onChange={event => commitBlockSetting(blockField(keyName, index, 'layout'), event.target.value)}>
                  <option value="wide">Image left</option>
                  <option value="reverse">Image right</option>
                  <option value="stacked">Image above</option>
                </select>
              </label>
              <label>Alternative text
                <input value={block.alt || ''} onChange={event => commitBlockSetting(blockField(keyName, index, 'alt'), event.target.value)} placeholder="Describe the image" />
              </label>
            </>
          )}

          {block.type === 'cta' && (
            <>
              <label>Button destination
                <input value={block.buttonUrl || ''} onChange={event => commitBlockSetting(blockField(keyName, index, 'buttonUrl'), event.target.value)} placeholder="/contact or https://…" />
              </label>
              <label className="managedBlockCheck"><input type="checkbox" checked={block.newTab === true} onChange={event => commitBlockSetting(blockField(keyName, index, 'newTab'), event.target.checked)} /> Open in new tab</label>
              <label>Alignment
                <select value={block.align || 'left'} onChange={event => commitBlockSetting(blockField(keyName, index, 'align'), event.target.value)}>
                  <option value="left">Left</option>
                  <option value="center">Centre</option>
                </select>
              </label>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function TextBlock({ block, index, keyName, policy }) {
  return (
    <div className={`managedBlock managedBlock--text managedBlock--${block.align || 'left'}`}>
      <BlockControls block={block} index={index} keyName={keyName} />
      <EditableField as="span" className="managedBlockEyebrow" fieldId={blockField(keyName, index, 'eyebrow')} label="Block eyebrow" value={block.eyebrow || ''} policy={policy} />
      <EditableField as="h2" fieldId={blockField(keyName, index, 'title')} label="Block title" value={block.title || 'New text section'} policy={policy} />
      <EditableField as="p" fieldId={blockField(keyName, index, 'text')} label="Block text" value={block.text || 'Click here and start typing.'} policy={policy} kind="textarea" />
    </div>
  )
}

function ImageBlock({ block, index, keyName, policy }) {
  return (
    <div className={`managedBlock managedBlock--image managedBlock--${block.layout || 'wide'}`}>
      <BlockControls block={block} index={index} keyName={keyName} />
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
    <div className={`managedBlock managedBlock--cta managedBlock--${block.align || 'left'}`}>
      <BlockControls block={block} index={index} keyName={keyName} />
      <div>
        <EditableField as="span" className="managedBlockEyebrow" fieldId={blockField(keyName, index, 'eyebrow')} label="Call to action eyebrow" value={block.eyebrow || 'Next Step'} policy={policy} />
        <EditableField as="h2" fieldId={blockField(keyName, index, 'title')} label="Call to action title" value={block.title || 'Ready to get involved?'} policy={policy} />
        <EditableField as="p" fieldId={blockField(keyName, index, 'text')} label="Call to action text" value={block.text || 'Add a clear reason for visitors to take action.'} policy={policy} kind="textarea" />
      </div>
      <a className="btn primary" href={safeUrl(block.buttonUrl)} target={block.newTab ? '_blank' : undefined} rel={block.newTab ? 'noreferrer' : undefined}>
        <EditableField as="span" fieldId={blockField(keyName, index, 'buttonLabel')} label="Button label" value={block.buttonLabel || 'Learn More'} policy={policy} />
      </a>
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
