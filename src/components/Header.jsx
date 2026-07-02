import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  return (
    <header className={`site-header${isMenuOpen ? ' site-header--menu-open' : ''}`}>
      <Link className="brand" to="/" aria-label="TwoToneTaj home">
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
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/content">Content</NavLink>
          <NavLink to="/community">Community</NavLink>
          <NavLink to="/merch">Merch</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <a
          className="join-btn"
          href="https://discord.gg/WcbtQPuByd"
          target="_blank"
          rel="noopener noreferrer"
        >
          Join TajSquad
        </a>
      </div>
    </header>
  )
}
