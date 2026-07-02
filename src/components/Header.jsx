import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className={`site-header${isMenuOpen ? ' site-header--menu-open' : ''}`}>
      <Link className="brand" to="/" aria-label="TwoToneTaj home" onClick={closeMenu}>
        <img src={logo} alt="TwoToneTaj logo" />

        <span>
          <strong>TwoToneTaj</strong>
          <small>Average Gamer • Est. 1989</small>
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
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/about" onClick={closeMenu}>About</NavLink>
          <NavLink to="/content" onClick={closeMenu}>Content</NavLink>
          <NavLink to="/community" onClick={closeMenu}>Community</NavLink>
          <NavLink to="/merch" onClick={closeMenu}>Merch</NavLink>
        </nav>

        <a
          className="join-btn"
          href="https://discord.gg/WcbtQPuByd"
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMenu}
        >
          Join TajSquad
        </a>
      </div>
    </header>
  )
}
