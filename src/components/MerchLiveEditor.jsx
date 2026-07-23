import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ksjAssetUrl } from '../config/ksjApi'
import { useManagedSite } from '../hooks/useManagedSite'

function editorEnabled() {
  return new URLSearchParams(window.location.search).get('ksjEditor') === '1'
}

function inheritedRule(records = {}, id) {
  if (records[id]) return records[id]
  const parts = String(id).split('.')
  while (parts.length > 1) {
    parts.pop()
    const parent = parts.join('.')
    if (records[parent]) return records[parent]
  }
  return null
}

function fieldRule(policy = {}, fieldId) {
  return {
    access: 'editable',
    approvalRequired: true,
    reason: '',
    ...(inheritedRule(policy.fields || {}, fieldId) || {}),
  }
}

function sectionRule(policy = {}, sectionId, defaultOrder) {
  return {
    access: 'editable',
    approvalRequired: true,
    movable: true,
    deletable: false,
    hidden: false,
    removed: false,
    order: defaultOrder,
    reason: '',
    ...(inheritedRule(policy.sections || {}, sectionId) || {}),
  }
}

function textValue(element) {
  return String(element?.innerText || element?.textContent || '').replace(/\u00a0/g, ' ').trim()
}

function post(type, payload) {
  window.parent.postMessage({ source: 'ksj-site-editor', type, ...payload }, '*')
}

function setText(element, value) {
  if (!element || document.activeElement === element || value == null) return
  const next = String(value)
  if (textValue(element) !== next) element.textContent = next
}

function productIndex(products, productId, fallbackName = '') {
  if (productId) {
    const byId = products.findIndex(product => String(product?.id || '') === String(productId))
    if (byId >= 0) return byId
  }
  return products.findIndex(product => String(product?.name || '').trim() === String(fallbackName).trim())
}

export default function MerchLiveEditor() {
  const location = useLocation()
  const { site } = useManagedSite()
  const enabled = useMemo(editorEnabled, [])
  const [role, setRole] = useState('client')

  useEffect(() => {
    if (!enabled) return undefined
    function receive(event) {
      if (event.data?.source === 'ksj-portal-editor' && event.data.type === 'initialise') {
        setRole(event.data.role || 'client')
      }
    }
    window.addEventListener('message', receive)
    return () => window.removeEventListener('message', receive)
  }, [enabled])

  useEffect(() => {
    if (!enabled || location.pathname !== '/merch') return undefined

    const policy = site.editorPolicy || {}
    const products = Array.isArray(site.merch?.products) ? site.merch.products : []
    const touched = new Set()

    function markField(element, { fieldId, label, value, kind = 'text', inline = true }) {
      if (!element || !fieldId) return
      const rule = fieldRule(policy, fieldId)
      const locked = role !== 'owner' && rule.access !== 'editable'
      const hidden = role !== 'owner' && ['hidden', 'owner-only'].includes(rule.access)
      if (hidden) {
        element.hidden = true
        touched.add(element)
        return
      }
      element.dataset.ksjField = fieldId
      element.dataset.ksjLabel = label
      element.dataset.ksjKind = kind
      element.dataset.ksjValue = value ?? ''
      element.dataset.ksjLocked = locked ? 'true' : 'false'
      element.dataset.ksjReason = rule.reason || ''
      element.classList.add(kind === 'image' ? 'ksjEditableImage' : 'ksjEditableField')
      if (locked) element.classList.add('ksjFieldLocked')
      if (inline && !locked && kind !== 'image') {
        element.contentEditable = 'true'
        element.spellcheck = true
        element.classList.add('ksjInlineEditable')
      }
      touched.add(element)
    }

    function markImage(element, fieldId, label, value) {
      if (!element) return
      if (element.tagName === 'IMG' && value) element.src = ksjAssetUrl(value)
      markField(element, { fieldId, label, value, kind: 'image', inline: false })
    }

    function markSection(element, sectionId, label, defaultOrder) {
      if (!element) return
      const rule = sectionRule(policy, sectionId, defaultOrder)
      const locked = role !== 'owner' && rule.access !== 'editable'
      const hidden = rule.hidden === true || rule.removed === true
      if (hidden && role !== 'owner') {
        element.hidden = true
        touched.add(element)
        return
      }
      element.dataset.ksjSection = sectionId
      element.dataset.ksjSectionLabel = label
      element.dataset.ksjSectionOrder = String(defaultOrder)
      element.dataset.ksjSectionLocked = locked ? 'true' : 'false'
      element.dataset.ksjSectionReason = rule.reason || ''
      element.dataset.ksjSectionHidden = rule.hidden === true ? 'true' : 'false'
      element.dataset.ksjSectionRemoved = rule.removed === true ? 'true' : 'false'
      element.style.order = String(Number(rule.order ?? defaultOrder))
      element.classList.add('ksjEditableSection')
      if (locked) element.classList.add('ksjSectionLocked')
      touched.add(element)
    }

    const staticFields = [
      ['.merch-hero-copy .eyebrow', 'merch.eyebrow', 'Store eyebrow', site.merch?.eyebrow, 'text', true],
      ['.merch-hero-copy h1', 'brand.name', 'Store brand name', site.brand?.name, 'text', false],
      ['.merch-subtitle', 'merch.subtitle', 'Store introduction', site.merch?.subtitle, 'textarea', true],
      ['.merch-hero-brand strong', 'merch.brandLabel', 'Store brand label', site.merch?.brandLabel || site.brand?.tagline?.split('•')[0]?.trim(), 'text', true],
      ['.merch-hero-brand small', 'merch.brandEstablished', 'Store established text', site.merch?.brandEstablished || site.brand?.tagline?.split('•')[1]?.trim(), 'text', true],
      ['.merch-development-note strong', 'merch.statusTitle', 'Store status title', site.merch?.statusTitle, 'text', true],
      ['.merch-development-note p', 'merch.statusText', 'Store status text', site.merch?.statusText, 'textarea', true],
      ['.merch-carousel-head strong', 'merch.featuredTitle', 'Featured products title', site.merch?.featuredTitle || 'Featured Drops', 'text', true],
      ['.merch-section-head .eyebrow', 'merch.browseEyebrow', 'Product section eyebrow', site.merch?.browseEyebrow || 'Browse The Drop', 'text', true],
      ['.merch-section-head h2', 'merch.browseTitle', 'Product section title', site.merch?.browseTitle || 'Product Preview', 'text', true],
      ['.merch-section-head > p', 'merch.managementNote', 'Product management note', site.merch?.managementNote || 'Products, prices, stock and checkout settings are managed through KSJ Digital.', 'textarea', true],
      ['.merch-final-cta .eyebrow', 'merch.finalEyebrow', 'Final callout eyebrow', site.merch?.finalEyebrow || 'Stay Updated', 'text', true],
      ['.merch-final-cta h2', 'merch.finalTitle', 'Final callout title', site.merch?.finalTitle || 'Want To Know When Merch Goes Live?', 'text', true],
      ['.merch-final-cta p', 'merch.finalText', 'Final callout text', site.merch?.finalText || `Join ${site.brand?.communityName || 'the community'} for launch updates.`, 'textarea', true],
    ]

    staticFields.forEach(([selector, fieldId, label, value, kind, inline]) => {
      const element = document.querySelector(selector)
      if (!element) return
      if (fieldId.startsWith('merch.') && value != null) setText(element, value)
      markField(element, { fieldId, label, value, kind, inline })
    })

    markImage(document.querySelector('.merch-hero-brand img'), 'brand.primaryLogo', 'Store logo', site.brand?.primaryLogo || site.assetUrls?.primaryLogo || '')

    document.querySelectorAll('.merch-product-card').forEach(card => {
      const id = card.getAttribute('data-product-id') || ''
      const name = textValue(card.querySelector('.merch-product-copy h2'))
      const index = productIndex(products, id, name)
      if (index < 0) return
      const product = products[index]
      card.dataset.productId = product.id || ''
      markSection(card, `merch.products.${index}`, `${product.name || 'Product'} card`, 100 + index)
      markField(card.querySelector('.merch-product-copy h2'), { fieldId: `merch.products.${index}.name`, label: `Product ${index + 1} name`, value: product.name })
      markField(card.querySelector('.merch-product-copy > span'), { fieldId: `merch.products.${index}.type`, label: `Product ${index + 1} type`, value: product.type })
      markField(card.querySelector('.merch-product-copy > p:not(.merch-fulfilment-note)'), { fieldId: `merch.products.${index}.description`, label: `Product ${index + 1} description`, value: product.description, kind: 'textarea' })
      markField(card.querySelector('.merch-product-copy > strong'), { fieldId: `merch.products.${index}.priceGBP`, label: `Product ${index + 1} GBP price`, value: product.priceGBP, inline: false })
      markField(card.querySelector('.merch-fulfilment-note'), { fieldId: `merch.products.${index}.shippingNote`, label: `Product ${index + 1} shipping note`, value: product.shippingNote, kind: 'textarea' })
      const visual = card.querySelector('.merch-product-image-wrap img, .merch-product-image-wrap .merch-image-placeholder')
      markImage(visual, `merch.products.${index}.image.url`, `Product ${index + 1} image`, product.image?.url || '')
    })

    document.querySelectorAll('.merch-carousel-item').forEach(item => {
      const type = textValue(item.querySelector(':scope > span'))
      const index = products.findIndex(product => String(product?.type || '').trim() === type)
      if (index < 0) return
      const visual = item.querySelector('img, .merch-image-placeholder')
      markImage(visual, `merch.products.${index}.image.url`, `${products[index].name || 'Featured product'} image`, products[index].image?.url || '')
    })

    markSection(document.querySelector('.merch-hero'), 'merch.hero', 'Merch hero', 10)
    markSection(document.querySelector('.merch-development-note'), 'merch.status', 'Store status', 20)
    markSection(document.querySelector('.merch-carousel'), 'merch.featured', 'Featured products', 30)
    markSection(document.querySelector('.merch-section'), 'merch.catalogue', 'Product catalogue', 40)
    markSection(document.querySelector('.merch-final-cta'), 'merch.finalCta', 'Final call to action', 50)

    function click(event) {
      const field = event.target.closest('[data-ksj-field]')
      if (field) {
        event.preventDefault()
        event.stopPropagation()
        post('select-field', {
          field: {
            fieldId: field.dataset.ksjField,
            label: field.dataset.ksjLabel || 'Website field',
            value: field.dataset.ksjKind === 'image' ? field.dataset.ksjValue || '' : textValue(field),
            kind: field.dataset.ksjKind || 'text',
            locked: field.dataset.ksjLocked === 'true',
            reason: field.dataset.ksjReason || '',
          },
        })
        return
      }
      const section = event.target.closest('[data-ksj-section]')
      if (!section) return
      event.preventDefault()
      event.stopPropagation()
      post('select-section', {
        section: {
          sectionId: section.dataset.ksjSection,
          label: section.dataset.ksjSectionLabel || 'Website section',
          defaultOrder: Number(section.dataset.ksjSectionOrder || 0),
          locked: section.dataset.ksjSectionLocked === 'true',
          reason: section.dataset.ksjSectionReason || '',
          hidden: section.dataset.ksjSectionHidden === 'true',
          removed: section.dataset.ksjSectionRemoved === 'true',
        },
      })
    }

    function input(event) {
      const field = event.target.closest('[data-ksj-field]')
      if (!field || field.dataset.ksjKind === 'image' || field.dataset.ksjLocked === 'true' || field.contentEditable !== 'true') return
      post('inline-change', { field: { fieldId: field.dataset.ksjField, label: field.dataset.ksjLabel, value: textValue(field), kind: field.dataset.ksjKind || 'text' } })
    }

    function blur(event) {
      const field = event.target.closest('[data-ksj-field]')
      if (!field || field.dataset.ksjKind === 'image' || field.dataset.ksjLocked === 'true' || field.contentEditable !== 'true') return
      post('inline-commit', { field: { fieldId: field.dataset.ksjField, label: field.dataset.ksjLabel, value: textValue(field), kind: field.dataset.ksjKind || 'text' } })
    }

    function keydown(event) {
      const field = event.target.closest('[data-ksj-field]')
      if (!field || field.contentEditable !== 'true') return
      if (field.dataset.ksjKind !== 'textarea' && event.key === 'Enter') {
        event.preventDefault()
        field.blur()
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        setText(field, field.dataset.ksjValue || '')
        field.blur()
      }
    }

    document.addEventListener('click', click, true)
    document.addEventListener('input', input, true)
    document.addEventListener('focusout', blur, true)
    document.addEventListener('keydown', keydown, true)

    const observer = new MutationObserver(() => {
      window.clearTimeout(observer.timer)
      observer.timer = window.setTimeout(() => {
        post('page-change', { pathname: location.pathname, fieldCount: document.querySelectorAll('[data-ksj-field]').length })
      }, 50)
    })
    observer.observe(document.querySelector('.merch-page') || document.body, { childList: true, subtree: true })

    post('page-change', { pathname: location.pathname, fieldCount: document.querySelectorAll('[data-ksj-field]').length })

    return () => {
      document.removeEventListener('click', click, true)
      document.removeEventListener('input', input, true)
      document.removeEventListener('focusout', blur, true)
      document.removeEventListener('keydown', keydown, true)
      observer.disconnect()
      window.clearTimeout(observer.timer)
      touched.forEach(element => {
        element.hidden = false
        delete element.dataset.ksjField
        delete element.dataset.ksjLabel
        delete element.dataset.ksjKind
        delete element.dataset.ksjValue
        delete element.dataset.ksjLocked
        delete element.dataset.ksjReason
        delete element.dataset.ksjSection
        delete element.dataset.ksjSectionLabel
        delete element.dataset.ksjSectionOrder
        delete element.dataset.ksjSectionLocked
        delete element.dataset.ksjSectionReason
        delete element.dataset.ksjSectionHidden
        delete element.dataset.ksjSectionRemoved
        element.removeAttribute('contenteditable')
        element.style.removeProperty('order')
        element.classList.remove('ksjEditableField', 'ksjEditableImage', 'ksjFieldLocked', 'ksjInlineEditable', 'ksjEditableSection', 'ksjSectionLocked')
      })
    }
  }, [enabled, location.pathname, role, site])

  return null
}
