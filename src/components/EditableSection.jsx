import { useEffect, useMemo, useState } from 'react'

function editorEnabled() {
  return new URLSearchParams(window.location.search).get('ksjEditor') === '1'
}

function sectionRule(policy = {}, sectionId, defaultOrder = 0) {
  return {
    access: 'editable',
    approvalRequired: true,
    movable: true,
    deletable: false,
    hidden: false,
    order: defaultOrder,
    reason: '',
    ...(policy?.sections?.[sectionId] || {}),
  }
}

export default function EditableSection({
  sectionId,
  label,
  policy,
  defaultOrder = 0,
  as: Tag = 'section',
  className = '',
  children,
}) {
  const enabled = useMemo(editorEnabled, [])
  const [role, setRole] = useState('client')
  const rule = sectionRule(policy, sectionId, defaultOrder)
  const locked = role !== 'owner' && rule.access !== 'editable'
  const hiddenForVisitor = rule.hidden === true && !enabled
  const hiddenForClientEditor = rule.hidden === true && enabled && role !== 'owner'

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
    if (!enabled) return
    event.preventDefault()
    event.stopPropagation()
    window.parent.postMessage({
      source: 'ksj-site-editor',
      type: 'select-section',
      section: {
        sectionId,
        label,
        locked,
        reason: rule.reason,
      },
    }, '*')
  }

  return (
    <Tag
      className={`${className} ${enabled ? 'ksjEditableSection' : ''} ${locked ? 'ksjSectionLocked' : ''} ${rule.hidden ? 'ksjSectionHidden' : ''}`.trim()}
      data-ksj-section={sectionId}
      style={{ order: Number(rule.order ?? defaultOrder) }}
      onClick={select}
      title={enabled ? (locked ? rule.reason || 'Controlled by KSJ Digital' : `Manage ${label}`) : undefined}
    >
      {children}
      {enabled && <span className="ksjSectionBadge" aria-hidden="true">{locked ? '🔒' : '⋮⋮'}</span>}
    </Tag>
  )
}
