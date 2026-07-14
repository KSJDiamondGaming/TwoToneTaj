import { useEffect, useMemo, useState } from 'react'

let activeDrag = null

function editorEnabled() {
  return new URLSearchParams(window.location.search).get('ksjEditor') === '1'
}

function legalPath(sectionId = '') {
  return sectionId === 'privacy' || sectionId.startsWith('privacy.') || sectionId === 'terms' || sectionId.startsWith('terms.')
}

function inheritedRule(policy = {}, sectionId) {
  const sections = policy?.sections || {}
  if (sections[sectionId]) return sections[sectionId]
  const parts = String(sectionId).split('.')
  while (parts.length > 1) {
    parts.pop()
    const parent = parts.join('.')
    if (sections[parent]) return sections[parent]
  }
  return null
}

function sectionRule(policy = {}, sectionId, defaultOrder = 0) {
  const base = legalPath(sectionId)
    ? { access: 'owner-only', approvalRequired: true, movable: false, deletable: false, hidden: false, removed: false, order: defaultOrder, reason: 'Legal content is controlled by KSJ Digital' }
    : { access: 'editable', approvalRequired: true, movable: true, deletable: false, hidden: false, removed: false, order: defaultOrder, reason: '' }
  return { ...base, ...(inheritedRule(policy, sectionId) || {}) }
}

export default function EditableSection({ sectionId, label, policy, defaultOrder = 0, as: Tag = 'section', className = '', children, style, onClick, ...rest }) {
  const enabled = useMemo(editorEnabled, [])
  const [role, setRole] = useState('client')
  const [dragging, setDragging] = useState(false)
  const [dropTarget, setDropTarget] = useState(false)
  const rule = sectionRule(policy, sectionId, defaultOrder)
  const locked = role !== 'owner' && rule.access !== 'editable'
  const draggable = enabled && !locked && rule.movable !== false && rule.hidden !== true && rule.removed !== true
  const hiddenForVisitor = (rule.hidden === true || rule.removed === true) && !enabled
  const hiddenForClientEditor = (rule.hidden === true || rule.removed === true) && enabled && role !== 'owner'

  useEffect(() => {
    if (!enabled) return
    function receive(event) {
      if (event.data?.source !== 'ksj-portal-editor') return
      if (event.data.type === 'initialise') setRole(event.data.role || 'client')
    }
    window.addEventListener('message', receive)
    return () => window.removeEventListener('message', receive)
  }, [enabled])

  if (hiddenForVisitor || hiddenForClientEditor) return null

  function select(event) {
    if (enabled) {
      event.preventDefault()
      event.stopPropagation()
      window.parent.postMessage({ source: 'ksj-site-editor', type: 'select-section', section: { sectionId, label, defaultOrder, locked, reason: rule.reason, hidden: rule.hidden === true, removed: rule.removed === true } }, '*')
      return
    }
    onClick?.(event)
  }

  function dragStart(event) {
    if (!draggable) {
      event.preventDefault()
      return
    }
    event.stopPropagation()
    activeDrag = {
      sectionId,
      label,
      defaultOrder,
      order: Number(rule.order ?? defaultOrder),
      parent: event.currentTarget.parentElement,
    }
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', sectionId)
    setDragging(true)
  }

  function dragOver(event) {
    if (!activeDrag || activeDrag.sectionId === sectionId || activeDrag.parent !== event.currentTarget.parentElement || !draggable) return
    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = 'move'
    setDropTarget(true)
  }

  function dragLeave(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) setDropTarget(false)
  }

  function drop(event) {
    event.preventDefault()
    event.stopPropagation()
    setDropTarget(false)
    if (!activeDrag || activeDrag.sectionId === sectionId || activeDrag.parent !== event.currentTarget.parentElement || !draggable) return
    window.parent.postMessage({
      source: 'ksj-site-editor',
      type: 'section-reorder',
      sourceSection: activeDrag,
      targetSection: {
        sectionId,
        label,
        defaultOrder,
        order: Number(rule.order ?? defaultOrder),
      },
    }, '*')
  }

  function dragEnd() {
    activeDrag = null
    setDragging(false)
    setDropTarget(false)
  }

  return (
    <Tag
      {...rest}
      className={`${className} ${enabled ? 'ksjEditableSection' : ''} ${locked ? 'ksjSectionLocked' : ''} ${rule.hidden || rule.removed ? 'ksjSectionHidden' : ''} ${dragging ? 'ksjSectionDragging' : ''} ${dropTarget ? 'ksjSectionDropTarget' : ''}`.trim()}
      data-ksj-section={sectionId}
      style={{ ...style, order: Number(rule.order ?? defaultOrder) }}
      onClick={select}
      draggable={draggable}
      onDragStart={dragStart}
      onDragOver={dragOver}
      onDragLeave={dragLeave}
      onDrop={drop}
      onDragEnd={dragEnd}
      title={enabled ? (locked ? rule.reason || 'Controlled by KSJ Digital' : draggable ? `Drag or click to manage ${label}` : `Manage ${label}`) : rest.title}
    >
      {children}
      {enabled && <span className="ksjSectionBadge" aria-hidden="true">{locked ? '🔒' : draggable ? '⋮⋮' : '•'}</span>}
    </Tag>
  )
}
