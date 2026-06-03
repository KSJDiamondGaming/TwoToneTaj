import { socials } from '../data/socials'

export default function Socials() {
  return (
    <section className="socials">
      <h2>Stay Connected</h2>

      <div className="social-grid">
        {socials.map((social) => (
          <a className={social.featured ? 'social featured' : 'social'} href={social.href} key={social.title}>
            <span>{social.icon}</span>
            <strong>{social.title}</strong>
            <small>{social.text}</small>
          </a>
        ))}
      </div>
    </section>
  )
}