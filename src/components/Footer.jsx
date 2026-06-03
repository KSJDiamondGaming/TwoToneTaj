import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <img src={logo} alt="TwoToneTaj logo" />
        <span>
          <strong>TwoToneTaj</strong>
          <small>Average Gamer • Est. 1989</small>
        </span>
      </div>

      <p>© 2026 TwoToneTaj. All Rights Reserved.</p>

      <div className="footer-links">
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
      </div>
    </footer>
  )
}