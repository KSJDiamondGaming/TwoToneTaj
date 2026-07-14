import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function editorEnabled() {
  return new URLSearchParams(window.location.search).get('ksjEditor') === '1'
}

function legalPath(fieldId = '') {
  return fieldId === 'privacy' || fieldId.startsWith('privacy.') || fieldId === 'terms' || fieldId.startsWith('terms.')
}

function inheritedRule(policy = {}, fieldId) {
  const fields = policy?.fields || {}
  if (fields[fieldId]) return fields[fieldId]
  const parts = String(fieldId).split('.')
  while (parts.length > 1) {
    parts.pop()
    const parent = parts.join('.')
    if (fields[parent]) return fields[parent]
  }
  return null
}

function defaultRule(fieldId) {
  if (fieldId === 'brand.supportCredit' || fieldId === 'globals.platformCredit') {
    return { access: 'owner-only', approvalRequired: true, movable: false, deletable: false, reason: 'KSJ Digital platform credit' }
  }
  if (legalPath(fieldId)) {
    return { access: 'owner-only', approvalRequired: true, movable: false, deletable: false, reason: 'Legal content is controlled by KSJ Digital' }
  }
  return { access: 'editable', approvalRequired: true, movable: true, deletable: true, reason: '' }
}

function fieldRule(policy = {}, fieldId) {
  return { ...defaultRule(fieldId), ...(inheritedRule(policy, fieldId) || {}) }
}

function plainText(element) {
  if (!element) return ''
  const copy = element.cloneNode(true)
  copy.querySelectorAll('.ksjEditBadge').forEach(badge => badge.remove())
  return String(copy.innerText || copy.textContent || '').replace(/\u00a0/g, ' ').trim()
}

export default function EditableField({ fieldId, label, value, policy, kind = 'text', as: Tag = 'span', className = '', children }) {
  const enabled = useMemo(editorEnabled, [])
  const [role, setRole] = useState('client')
  const elementRef = useRef(null)
  const editingRef = useRef(false)
  const rule = fieldRule(policy, fieldId)
  const hidden = enabled && role !== 'owner' && ['hidden', 'owner-only'].includes(rule.access)
  const locked = role !== 'owner' && rule.access !== 'editable'
  const inlineEditable = enabled && !locked && kind !== 'image' && children === undefined

  useEffect(() => {
    if (!enabled) return
    function receive(event) {
      if (event.data?.source !== 'ksj-portal-editor') return
      if (event.data.type === 'initialise') setRole(event.data.role || 'client')
      if (event.data.type === 'patch-field' && event.data.fieldId === fieldId && elementRef.current && !editingRef.current && children === undefined) {
        elementRef.current.innerText = event.data.value ?? ''
      }
    }
    window.addEventListener('message', receive)
    return () => window.removeEventListener('message', receive)
  }, [children, enabled, fieldId])

  useEffect(() => {
    if (!elementRef.current || editingRef.current || children !== undefined) return
    elementRef.current.innerText = value ?? ''
  }, [children, value])

  if (hidden) return null

  function select(event) {
    if (!enabled) return
    event.stopPropagation()
    if (locked) event.preventDefault()
    window.parent.postMessage({ source: 'ksj-site-editor', type: 'select-field', field: { fieldId, label, value: children === undefined ? plainText(event.currentTarget) : value, kind, locked, reason: rule.reason } }, '*')
  }

  function startEditing(event) {
    if (!inlineEditable) return
    editingRef.current = true
    select(event)
  }

  function changeInline(event) {
    if (!inlineEditable) return
    const nextValue = plainText(event.currentTarget)
    window.parent.postMessage({ source: 'ksj-site-editor', type: 'inline-change', field: { fieldId, label, value: nextValue, kind } }, '*')
  }

  function finishEditing(event) {
    if (!inlineEditable) return
    editingRef.current = false
    const nextValue = plainText(event.currentTarget)
    window.parent.postMessage({ source: 'ksj-site-editor', type: 'inline-commit', field: { fieldId, label, value: nextValue, kind } }, '*')
  }

  function keyDown(event) {
    if (!inlineEditable) return
    if (kind !== 'textarea' && event.key === 'Enter') {
      event.preventDefault()
      event.currentTarget.blur()
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      event.currentTarget.innerText = value ?? ''
      event.currentTarget.blur()
    }
  }

  return (
    <Tag
      ref={elementRef}
      className={`${className} ${enabled ? 'ksjEditableField' : ''} ${locked ? 'ksjFieldLocked' : ''} ${inlineEditable ? 'ksjInlineEditable' : ''}`.trim()}
      data-ksj-field={fieldId}
      data-ksj-locked={locked ? 'true' : 'false'}
      contentEditable={inlineEditable}
      suppressContentEditableWarning
      spellCheck={inlineEditable}
      onClick={select}
      onFocus={startEditing}
      onInput={changeInline}
      onBlur={finishEditing}
      onKeyDown={keyDown}
      title={enabled ? (locked ? rule.reason || 'Controlled by KSJ Digital' : inlineEditable ? `Click and type to edit ${label}` : `Edit ${label}`) : undefined}
    >
      {children ?? value}
      {enabled && <span className="ksjEditBadge" aria-hidden="true">{locked ? '🔒' : '✎'}</span>}
    </Tag>
  )
}

export function EditorBridgeReady() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!editorEnabled()) return
    document.documentElement.classList.add('ksj-editor-mode')
    let initialised = false

    function announceReady(type = 'ready') {
      window.parent.postMessage({
        source: 'ksj-site-editor',
        type,
        fieldCount: document.querySelectorAll('[data-ksj-field]').length,
        pathname: window.location.pathname,
      }, '*')
    }

    function receive(event) {
      if (event.data?.source !== 'ksj-portal-editor') return
      if (event.data.type === 'initialise') { initialised = true; announceReady() }
      if (event.data.type === 'ping') announceReady()
      if (event.data.type === 'history-back') window.history.back()
      if (event.data.type === 'history-forward') window.history.forward()
      if (event.data.type === 'navigate' && typeof event.data.pathname === 'string') {
        const pathname = event.data.pathname.startsWith('/') ? event.data.pathname : `/${event.data.pathname}`
        navigate({ pathname, search: '?ksjEditor=1' })
      }
    }

    window.addEventListener('message', receive)
    window.addEventListener('load', announceReady)
    window.addEventListener('pageshow', announceReady)
    announceReady()
    const timer = window.setInterval(() => { if (!initialised) announceReady() }, 750)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('message', receive)
      window.removeEventListener('load', announceReady)
      window.removeEventListener('pageshow', announceReady)
      document.documentElement.classList.remove('ksj-editor-mode')
    }
  }, [navigate])

  useEffect(() => {
    if (!editorEnabled()) return
    const timer = window.setTimeout(() => {
      window.parent.postMessage({
        source: 'ksj-site-editor',
        type: 'page-change',
        fieldCount: document.querySelectorAll('[data-ksj-field]').length,
        pathname: location.pathname,
      }, '*')
    }, 0)
    return () => window.clearTimeout(timer)
  }, [location.pathname])

  return null
}
