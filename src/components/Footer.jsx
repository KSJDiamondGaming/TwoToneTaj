import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>TwoToneTaj</h3>
          <p>Average Gamer • Est. 1989</p>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/content">Content</Link>
          <Link to="/community">Community</Link>
          <Link to="/merch">Merch</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} TwoToneTaj. All rights reserved.</p>

          <div>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}