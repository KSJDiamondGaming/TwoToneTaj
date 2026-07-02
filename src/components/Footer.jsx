import { Link } from 'react-router-dom'

const currentYear = new Date().getFullYear()
const supportEmail = 'support@ksjdigital.co.uk'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <div className="footer-brand">
            <strong>TwoToneTaj</strong>
            <small>Average Gamer • Est. 1989</small>
          </div>

          <p>© {currentYear} TwoToneTaj. All rights reserved.</p>
        </div>

        <div className="footer-right">
          <nav className="footer-links" aria-label="Footer links">
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>

            <a href={`mailto:${supportEmail}?subject=TwoToneTaj Website Support`}>
              Support
            </a>
          </nav>

          <span className="footer-credit">Website by KSJ Digital</span>
        </div>
      </div>
    </footer>
  )
}
