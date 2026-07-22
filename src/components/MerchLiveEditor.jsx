import { useEffect, useMemo, useRef, useState } from 'react'
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

function findProductIndex(products, card) {
  const name = textValue(card.querySelector('.merch-product-copy h2'))
  return products.findIndex(product => String(product?.name || '').trim() === name)
}

function setText(element, value) {
  if (!element || document.activeElement === element || value == null) return
  const next = String(value)
  if (textValue(element) !== next) element.textContent = next
}

export default function MerchLiveEditor() {
  const location = useLocation()
  const { site } = useManagedSite()
  const enabled = useMemo(editorEnabled, [])
  const [role, setRole] = useState('client')
  const cleanupRef = useRef([])

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
    cleanupRef.current.forEach(cleanup => cleanup())
    cleanupRef.current = []
    if (location.pathname !== '/merch') return undefined

    const policy = site.editorPolicy || {}
    const products = Array.isArray(site.merch?.products) ? site.merch.products : []
    const cleanups = cleanupRef.current

    function listen(element, eventName, handler) {
      element.addEventListener(eventName, handler)
      cleanups.push(() => element.removeEventListener(eventName, handler))
    }

    function wireField(element, { fieldId, label, value, kind = 'text', inline = true }) {
      if (!element || !fieldId) return
      const rule = fieldRule(policy, fieldId)
      const locked = role !== 'owner' && rule.access !== 'editable'
      const hidden = enabled && role !== 'owner' && ['hidden', 'owner-only'].includes(rule.access)
      if (hidden) {
        element.hidden = true
        cleanups.push(() => { element.hidden = false })
        return
      }

      element.dataset.ksjField = fieldId
      element.classList.toggle('ksjEditableField', enabled)
      element.classList.toggle('ksjFieldLocked', enabled && locked)

      if (!enabled) return

      const canInline = inline && !locked && kind !== 'image'
      if (canInline) {
        element.contentEditable = 'true'
        element.spellcheck = true
        element.classList.add('ksjInlineEditable')
      }

      function select(event) {
        event.stopPropagation()
        if (locked) event.preventDefault()
        post('select-field', { field: { fieldId, label, value: kind === 'image' ? value || '' : textValue(element), kind, locked, reason: rule.reason } })
      }
      function input(event) {
        if (!canInline) return
        post('inline-change', { field: { fieldId, label, value: textValue(event.currentTarget), kind } })
      }
      function commit(event) {
        if (!canInline) return
        post('inline-commit', { field: { fieldId, label, value: textValue(event.currentTarget), kind } })
      }
      function keydown(event) {
        if (!canInline) return
        if (kind !== 'textarea' && event.key === 'Enter') {
          event.preventDefault()
          event.currentTarget.blur()
        }
        if (event.key === 'Escape') {
          event.preventDefault()
          setText(event.currentTarget, value)
          event.currentTarget.blur()
        }
      }

      listen(element, 'click', select)
      listen(element, 'input', input)
      listen(element, 'blur', commit)
      listen(element, 'keydown', keydown)
      cleanups.push(() => {
        delete element.dataset.ksjField
        element.removeAttribute('contenteditable')
        element.classList.remove('ksjEditableField', 'ksjFieldLocked', 'ksjInlineEditable')
      })
    }

    function wireImage(element, fieldId, label, value) {
      if (!element) return
      const rule = fieldRule(policy, fieldId)
      const locked = role !== 'owner' && rule.access !== 'editable'
      element.dataset.ksjField = fieldId
      element.classList.toggle('ksjEditableImage', enabled)
      element.classList.toggle('ksjFieldLocked', enabled && locked)
      if (value) element.src = ksjAssetUrl(value)
      if (!enabled) return
      listen(element, 'click', event => {
        event.preventDefault()
        event.stopPropagation()
        post('select-field', { field: { fieldId, label, value: value || '', kind: 'image', locked, reason: rule.reason } })
      })
      cleanups.push(() => {
        delete element.dataset.ksjField
        element.classList.remove('ksjEditableImage', 'ksjFieldLocked')
      })
    }

    function wireSection(element, sectionId, label, defaultOrder) {
      if (!element) return
      const rule = sectionRule(policy, sectionId, defaultOrder)
      const locked = role !== 'owner' && rule.access !== 'editable'
      const hidden = rule.hidden === true || rule.removed === true
      if (hidden && (!enabled || role !== 'owner')) {
        element.hidden = true
        cleanups.push(() => { element.hidden = false })
        return
      }
      element.dataset.ksjSection = sectionId
      element.style.order = String(Number(rule.order ?? defaultOrder))
      element.classList.toggle('ksjEditableSection', enabled)
      element.classList.toggle('ksjSectionLocked', enabled && locked)
      if (enabled) {
        listen(element, 'click', event => {
          if (event.target.closest('[data-ksj-field]')) return
          event.preventDefault()
          event.stopPropagation()
          post('select-section', { section: { sectionId, label, defaultOrder, locked, reason: rule.reason, hidden: rule.hidden === true, removed: rule.removed === true } })
        })
      }
      cleanups.push(() => {
        delete element.dataset.ksjSection
        element.style.removeProperty('order')
        element.classList.remove('ksjEditableSection', 'ksjSectionLocked')
      })
    }

    const staticFields = [
      ['.merch-hero-copy .eyebrow', 'merch.eyebrow', 'Store eyebrow', site.merch?.eyebrow, 'text', true],
      ['.merch-hero-copy h1', 'brand.name', 'Store brand name', site.brand?.name, 'text', false],
      ['.merch-subtitle', 'merch.subtitle', 'Store introduction', site.merch?.subtitle, 'textarea', true],
      ['.merch-hero-brand strong', 'merch.brandLabel', 'Store brand label', site.merch?.brandLabel || site.brand?.tagline?.split('•')[0]?.trim(), 'text', true],
      ['.merch-hero-brand small', 'merch.brandEstablished', 'Store established text', site.merch?.brandEstablished || site.brand?.tagline?.split('•')[1]?.trim(), 'text', true],
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
      wireField(element, { fieldId, label, value, kind, inline })
    })

    wireImage(document.querySelector('.merch-hero-brand img'), 'brand.primaryLogo', 'Store logo', site.brand?.primaryLogo || site.assetUrls?.primaryLogo || '')

    document.querySelectorAll('.merch-product-card').forEach(card => {
      const index = findProductIndex(products, card)
      if (index < 0) return
      const product = products[index]
      wireSection(card, `merch.products.${index}`, `${product.name || 'Product'} card`, 100 + index)
      wireField(card.querySelector('.merch-product-copy h2'), { fieldId: `merch.products.${index}.name`, label: `Product ${index + 1} name`, value: product.name })
      wireField(card.querySelector('.merch-product-copy > span'), { fieldId: `merch.products.${index}.type`, label: `Product ${index + 1} type`, value: product.type })
      wireField(card.querySelector('.merch-product-copy > p:not(.merch-fulfilment-note)'), { fieldId: `merch.products.${index}.description`, label: `Product ${index + 1} description`, value: product.description, kind: 'textarea' })
      wireField(card.querySelector('.merch-product-copy > strong'), { fieldId: `merch.products.${index}.priceGBP`, label: `Product ${index + 1} GBP price`, value: product.priceGBP, inline: false })
      wireField(card.querySelector('.merch-fulfilment-note'), { fieldId: `merch.products.${index}.shippingNote`, label: `Product ${index + 1} shipping note`, value: product.shippingNote, kind: 'textarea' })
      wireImage(card.querySelector('.merch-product-image-wrap img'), `merch.products.${index}.image.url`, `Product ${index + 1} image`, product.image?.url || '')
    })

    document.querySelectorAll('.merch-carousel-item').forEach(item => {
      const type = textValue(item.querySelector(':scope > span'))
      const index = products.findIndex(product => String(product?.type || '').trim() === type)
      if (index >= 0) wireImage(item.querySelector('img'), `merch.products.${index}.image.url`, `${products[index].name || 'Featured product'} image`, products[index].image?.url || '')
    })

    wireSection(document.querySelector('.merch-hero'), 'merch.hero', 'Merch hero', 10)
    wireSection(document.querySelector('.merch-development-note'), 'merch.status', 'Store status', 20)
    wireSection(document.querySelector('.merch-carousel'), 'merch.featured', 'Featured products', 30)
    wireSection(document.querySelector('.merch-section'), 'merch.catalogue', 'Product catalogue', 40)
    wireSection(document.querySelector('.merch-final-cta'), 'merch.finalCta', 'Final call to action', 50)

    const announce = window.setTimeout(() => post('page-change', {
      pathname: location.pathname,
      fieldCount: document.querySelectorAll('[data-ksj-field]').length,
    }), 0)
    cleanups.push(() => window.clearTimeout(announce))

    return () => {
      cleanups.splice(0).forEach(cleanup => cleanup())
    }
  }, [enabled, location.pathname, role, site])

  return null
}
