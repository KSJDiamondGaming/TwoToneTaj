import { Link } from 'react-router-dom'
import { getMailTo } from '../config/siteConfig'
import { useManagedSite } from '../hooks/useManagedSite'
import EditableField from './EditableField'

const currentYear = new Date().getFullYear()

export default function Footer() {
  const { site } = useManagedSite()

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <div className="footer-brand">
            <EditableField as="strong" fieldId="brand.name" label="Footer brand name" value={site.brand.name} policy={site.editorPolicy} />
            <EditableField as="small" fieldId="brand.tagline" label="Footer tagline" value={site.brand.tagline} policy={site.editorPolicy} />
          </div>

          <p>© {currentYear} <EditableField fieldId="brand.name" label="Copyright brand name" value={site.brand.name} policy={site.editorPolicy} />. All rights reserved.</p>
        </div>

        <div className="footer-right">
          <nav className="footer-links" aria-label="Footer links">
            <Link to="/track-order">Track Order</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>

            <a href={getMailTo(site.contact.supportEmail, `${site.brand.name} Website Support`)}>
              Support
            </a>
          </nav>

          <EditableField as="span" className="footer-credit" fieldId="brand.supportCredit" label="KSJ Digital footer credit" value={site.brand.supportCredit} policy={site.editorPolicy} />
        </div>
      </div>
    </footer>
  )
}
