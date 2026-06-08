import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <div>
          <strong>TwoToneTaj</strong>
          <small>Average Gamer • Est. 1989</small>
        </div>
      </div>

      <p className="footer-copy">
        © {new Date().getFullYear()} TwoToneTaj. All rights reserved.
      </p>

      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/content">Content</Link>
        <Link to="/community">Community</Link>
        <Link to="/merch">Merch</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
      </div>
    </footer>
  )
}