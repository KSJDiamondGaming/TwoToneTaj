import { useEffect, useMemo, useState } from 'react'

function editorEnabled() {
  return new URLSearchParams(window.location.search).get('ksjEditor') === '1'
}

function fieldRule(policy = {}, fieldId) {
  return {
    access: 'editable',
    approvalRequired: true,
    movable: true,
    deletable: true,
    reason: '',
    ...(policy?.fields?.[fieldId] || {}),
  }
}

export default function EditableField({ fieldId, label, value, policy, kind = 'text', as: Tag = 'span', className = '', children }) {
  const enabled = useMemo(editorEnabled, [])
  const [role, setRole] = useState('client')
  const rule = fieldRule(policy, fieldId)
  const hidden = enabled && role !== 'owner' && ['hidden', 'owner-only'].includes(rule.access)
  const locked = role !== 'owner' && rule.access !== 'editable'

  useEffect(() => {
    if (!enabled) return
    function receive(event) {
      if (event.data?.source !== 'ksj-portal-editor') return
      if (event.data.type === 'initialise') setRole(event.data.role || 'client')
    }
    window.addEventListener('message', receive)
    return () => window.removeEventListener('message', receive)
  }, [enabled])

  if (hidden) return null

  function select(event) {
    if (!enabled) return
    event.preventDefault()
    event.stopPropagation()
    window.parent.postMessage({
      source: 'ksj-site-editor',
      type: 'select-field',
      field: {
        fieldId,
        label,
        value,
        kind,
        locked,
        reason: rule.reason,
      },
    }, '*')
  }

  return (
    <Tag
      className={`${className} ${enabled ? 'ksjEditableField' : ''} ${locked ? 'ksjFieldLocked' : ''}`.trim()}
      data-ksj-field={fieldId}
      data-ksj-locked={locked ? 'true' : 'false'}
      onClick={select}
      title={enabled ? (locked ? rule.reason || 'Controlled by KSJ Digital' : `Edit ${label}`) : undefined}
    >
      {children ?? value}
      {enabled && <span className="ksjEditBadge" aria-hidden="true">{locked ? '🔒' : '✎'}</span>}
    </Tag>
  )
}

export function EditorBridgeReady() {
  useEffect(() => {
    if (!editorEnabled()) return
    document.documentElement.classList.add('ksj-editor-mode')
    window.parent.postMessage({ source: 'ksj-site-editor', type: 'ready' }, '*')
    return () => document.documentElement.classList.remove('ksj-editor-mode')
  }, [])
  return null
}
