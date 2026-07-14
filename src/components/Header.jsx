import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useManagedSite } from '../hooks/useManagedSite'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { site } = useManagedSite()
  const closeMenu = () => setIsMenuOpen(false)
  const brandLogo = site.brand.primaryLogo || site.assetUrls?.primaryLogo || logo

  return (
    <header className={`site-header${isMenuOpen ? ' site-header--menu-open' : ''}`} data-ksj-global-region="header">
      <Link className="brand" to="/" aria-label={`${site.brand.name} home`} onClick={closeMenu}>
        <img src={brandLogo} alt={`${site.brand.name} logo`} />
        <span>
          <strong>{site.brand.name}</strong>
          <small>{site.brand.tagline}</small>
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
          {site.navigation.map((item) =>
            item.external ? (
              <a key={item.id || `${item.label}-${item.target}`} href={item.target} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
                {item.label}
              </a>
            ) : (
              <NavLink key={item.id || `${item.label}-${item.target}`} to={item.target} end={item.target === '/'} onClick={closeMenu}>
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <a className="join-btn" href={site.socials.discord} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
          Join {site.brand.communityName}
        </a>
      </div>
    </header>
  )
}
