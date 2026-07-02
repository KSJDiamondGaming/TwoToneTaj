import { Link } from 'react-router-dom'

import logo from '../assets/logo.png'
import '../styles/footer.css'

const currentYear = new Date().getFullYear()
const businessEmail = 'media@ksjdigital.co.uk'
const discordUrl = 'https://discord.gg/WcbtQPuByd'

const siteLinks = [
  ['Home', '/'],
  ['About', '/about'],
  ['Content', '/content'],
  ['Community', '/community'],
  ['Merch', '/merch'],
  ['Contact', '/contact'],
]

const socialLinks = [
  ['Twitch', 'https://www.twitch.tv/twotonetaj'],
  ['YouTube', 'https://www.youtube.com/@twotonetaj'],
  ['TikTok', 'https://www.tiktok.com/@twotonetaj'],
  ['Kick', 'https://kick.com/twotonetaj'],
  ['Instagram', 'https://www.instagram.com/twotonetaj'],
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand-block">
          <Link className="footer-brand" to="/" aria-label="TwoToneTaj home">
            <img src={logo} alt="" />
            <span>
              <strong>TwoToneTaj</strong>
              <small>Average Gamer • Est. 1989</small>
            </span>
          </Link>

          <p>
            Gaming, community, laughs and the moments that matter more than the scoreboard.
          </p>

          <a className="footer-discord" href={discordUrl} target="_blank" rel="noopener noreferrer">
            Join TajSquad
          </a>
        </div>

        <nav className="footer-column" aria-label="Footer site navigation">
          <strong>Explore</strong>
          {siteLinks.map(([label, path]) => (
            <Link to={path} key={path}>{label}</Link>
          ))}
        </nav>

        <nav className="footer-column" aria-label="TwoToneTaj social links">
          <strong>Follow</strong>
          {socialLinks.map(([label, url]) => (
            <a href={url} target="_blank" rel="noopener noreferrer" key={label}>{label}</a>
          ))}
        </nav>

        <div className="footer-column footer-contact">
          <strong>Contact</strong>
          <p>Business, collaborations and media enquiries.</p>
          <a className="footer-email" href={`mailto:${businessEmail}?subject=TwoToneTaj Enquiry`}>
            {businessEmail}
          </a>
          <span>Official contact managed through KSJ Digital.</span>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} TwoToneTaj. All rights reserved.</p>

        <nav aria-label="Legal links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </nav>

        <span>Website by KSJ Digital</span>
      </div>
    </footer>
  )
}
