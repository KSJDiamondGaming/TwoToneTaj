import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Header() {
  return (
    <header className="site-header">
      <Link className="brand" to="/">
        <img src={logo} alt="TwoToneTaj logo" />
        <span>
          TwoToneTaj
          <small>Average Gamer • Est. 1989</small>
        </span>
      </Link>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/content">Content</Link>
        <Link to="/community">Community</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <a className="join-btn" href="https://discord.gg/WcbtQPuByd">
        Join TajSquad
      </a>
    </header>
  )
}