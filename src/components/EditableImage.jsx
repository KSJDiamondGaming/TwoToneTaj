import { useEffect, useMemo, useState } from 'react'

function editorEnabled() {
  return new URLSearchParams(window.location.search).get('ksjEditor') === '1'
}

function ruleFor(policy = {}, fieldId) {
  return {
    access: 'editable',
    approvalRequired: true,
    movable: false,
    deletable: false,
    reason: '',
    ...(policy?.fields?.[fieldId] || {}),
  }
}

export default function EditableImage({ fieldId, label, src, fallback, alt = '', policy, className = '' }) {
  const enabled = useMemo(editorEnabled, [])
  const [role, setRole] = useState('client')
  const rule = ruleFor(policy, fieldId)
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
      field: { fieldId, label, value: src || '', kind: 'image', locked, reason: rule.reason },
    }, '*')
  }

  return (
    <span className={`${enabled ? 'ksjEditableImage' : ''} ${locked ? 'ksjFieldLocked' : ''}`.trim()} onClick={select}>
      <img className={className} src={src || fallback} alt={alt} data-ksj-field={fieldId} />
      {enabled && <span className="ksjImageBadge" aria-hidden="true">{locked ? '🔒' : '🖼'}</span>}
    </span>
  )
}
