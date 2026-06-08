import { NavLink, Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Header() {
  return (
    <header className="site-header">
      <Link className="brand" to="/">
        <img src={logo} alt="TwoToneTaj logo" />

        <span>
          <strong>TwoToneTaj</strong>
          <small>Average Gamer • Est. 1989</small>
        </span>
      </Link>

      <nav aria-label="Main navigation">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/content">Content</NavLink>
        <NavLink to="/community">Community</NavLink>
        <NavLink to="/merch">Merch</NavLink>
      </nav>

      <a
        className="join-btn"
        href="https://discord.gg/WcbtQPuByd"
        target="_blank"
        rel="noopener noreferrer"
      >
        Join TajSquad
      </a>
    </header>
  )
}