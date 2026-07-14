import { Link } from 'react-router-dom'
import { getMailTo } from '../config/siteConfig'
import { useManagedSite } from '../hooks/useManagedSite'

const currentYear = new Date().getFullYear()

export default function Footer() {
  const { site } = useManagedSite()

  return (
    <footer className="footer" data-ksj-global-region="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <div className="footer-brand">
            <strong>{site.brand.name}</strong>
            <small>{site.brand.tagline}</small>
          </div>
          <p>© {currentYear} {site.brand.name}. All rights reserved.</p>
        </div>

        <div className="footer-right">
          <nav className="footer-links" aria-label="Footer links">
            <Link to="/track-order">Track Order</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <a href={getMailTo(site.contact.supportEmail, `${site.brand.name} Website Support`)}>Support</a>
          </nav>
          <span className="footer-credit">{site.brand.supportCredit}</span>
        </div>
      </div>
    </footer>
  )
}
