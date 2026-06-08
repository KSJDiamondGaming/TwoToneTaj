import '../styles/contact.css'

const contactEmail = 'support@ksjdigital.co.uk'

const links = [
  {
    label: 'Twitch',
    href: 'https://www.twitch.tv/',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/',
  },
]

export default function Contact() {
  return (
    <main className="page contact-page">
      <section className="contact-hero">
        <p className="eyebrow">Contact</p>

        <h1>Connect With TwoToneTaj</h1>

        <p>
          This page will become the official contact and link hub for
          TwoToneTaj, including socials, enquiries, and useful community links.
        </p>
      </section>

      <section className="contact-card">
        <div className="contact-intro">
          <h2>Link Hub Coming Soon</h2>

          <p>
            Taj’s official Linktree, social links, contact details, and enquiry
            options will be added here as the website develops.
          </p>
        </div>

        <div className="contact-links" aria-label="Placeholder social links">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="contact-support">
          <h2>Need help?</h2>

          <p>
            For website support, issues, or general enquiries, contact KSJ
            Digital.
          </p>

          <a href={`mailto:${contactEmail}?subject=TwoToneTaj Website Enquiry`}>
            📧 {contactEmail}
          </a>
        </div>
      </section>
    </main>
  )
}