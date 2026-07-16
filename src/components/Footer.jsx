import { Link } from 'react-router-dom'
import { getMailTo } from '../config/siteConfig'
import { useManagedSite } from '../hooks/useManagedSite'

const currentYear = new Date().getFullYear()

function internalTarget(pathname) {
  const search = new URLSearchParams(window.location.search).get('ksjEditor') === '1'
    ? '?ksjEditor=1'
    : ''
  return { pathname, search }
}

function styleClass(value = '') {
  return value.toLowerCase().replace(/\s+/g, '-')
}

export default function Footer() {
  const { site } = useManagedSite()
  const footerStyle = styleClass(site.branding?.footerStyle || 'Simple')
  const footerText = site.globals?.footerText || `© ${currentYear} ${site.brand.name}. All rights reserved.`
  const links = {
    trackOrder: true,
    contact: true,
    privacy: true,
    terms: true,
    support: true,
    ...(site.globals?.footerLinks || {}),
  }

  return (
    <footer className={`footer footer--${footerStyle}`} data-ksj-global-region="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <div className="footer-brand">
            <strong>{site.brand.name}</strong>
            {site.brand.tagline && <small>{site.brand.tagline}</small>}
          </div>
          <p>{footerText}</p>
        </div>

        <div className="footer-right">
          <nav className="footer-links" aria-label="Footer links">
            {links.trackOrder !== false && <Link to={internalTarget('/track-order')}>Track Order</Link>}
            {links.contact !== false && <Link to={internalTarget('/contact')}>Contact</Link>}
            {links.privacy !== false && <Link to={internalTarget('/privacy')}>Privacy</Link>}
            {links.terms !== false && <Link to={internalTarget('/terms')}>Terms</Link>}
            {links.support !== false && site.contact.supportEmail && <a href={getMailTo(site.contact.supportEmail, `${site.brand.name} Website Support`)}>Support</a>}
          </nav>
          <span className="footer-credit">Website by KSJ Digital</span>
        </div>
      </div>
    </footer>
  )
}
