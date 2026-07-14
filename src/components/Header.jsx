import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useManagedSite } from '../hooks/useManagedSite'
import EditableField from './EditableField'
import EditableImage from './EditableImage'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { site } = useManagedSite()
  const closeMenu = () => setIsMenuOpen(false)
  const brandLogo = site.assetUrls?.primaryLogo || logo

  return (
    <header className={`site-header${isMenuOpen ? ' site-header--menu-open' : ''}`}>
      <Link className="brand" to="/" aria-label={`${site.brand.name} home`} onClick={closeMenu}>
        <EditableImage
          fieldId="brand.primaryLogo"
          label="Primary logo"
          src={site.brand.primaryLogo || site.assetUrls?.primaryLogo}
          fallback={logo}
          alt={`${site.brand.name} logo`}
          policy={site.editorPolicy}
        />

        <span>
          <EditableField as="strong" fieldId="brand.name" label="Brand name" value={site.brand.name} policy={site.editorPolicy} />
          <EditableField as="small" fieldId="brand.tagline" label="Brand tagline" value={site.brand.tagline} policy={site.editorPolicy} />
        </span>
      </Link>

      <button
        className="mobile-menu-toggle"
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="main-navigation"
        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={() => setIsMenuOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className="header-actions" id="main-navigation">
        <nav aria-label="Main navigation">
          {site.navigation.map((item, index) =>
            item.external ? (
              <a key={item.id || `${item.label}-${item.target}`} href={item.target} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
                <EditableField fieldId={`engine.navigation.${index}.label`} label={`${item.label} navigation label`} value={item.label} policy={site.editorPolicy} />
              </a>
            ) : (
              <NavLink key={item.id || `${item.label}-${item.target}`} to={item.target} end={item.target === '/'} onClick={closeMenu}>
                <EditableField fieldId={`engine.navigation.${index}.label`} label={`${item.label} navigation label`} value={item.label} policy={site.editorPolicy} />
              </NavLink>
            ),
          )}
        </nav>

        <a className="join-btn" href={site.socials.discord} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
          Join <EditableField fieldId="brand.communityName" label="Community name" value={site.brand.communityName} policy={site.editorPolicy} />
        </a>
      </div>
    </header>
  )
}
