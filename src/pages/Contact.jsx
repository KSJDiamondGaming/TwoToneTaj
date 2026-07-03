import logo from '../assets/logo.png'
import '../styles/contact.css'

const officialLinksUrl = 'https://linktr.ee/Twotonetaj'
const discordUrl = 'https://discord.gg/WcbtQPuByd'
const paypalUrl = 'https://paypal.me/2tonetaj'
const businessEmail = 'media@ksjdigital.co.uk'

const contactOptions = [
  {
    icon: '🔗',
    eyebrow: 'Official Profiles',
    title: 'All Creator Links',
    text: 'Find the current TwoToneTaj channels, social profiles, streaming platforms and official destinations.',
    action: 'Visit Linktree',
    href: officialLinksUrl,
    note: 'Use only the official profiles linked here.',
    tone: 'links',
  },
  {
    icon: '💚',
    eyebrow: 'Optional Support',
    title: 'Support The Content',
    text: 'Support future content creation and community projects. It is always appreciated and never expected.',
    action: 'Support On PayPal',
    href: paypalUrl,
    note: 'Every contribution helps support future content and community projects.',
    tone: 'support',
  },
]

const enquiryTypes = [
  ['Collaborations', 'Creator projects, gaming partnerships and joint content.'],
  ['Media Enquiries', 'Interviews, press, podcasts and promotional opportunities.'],
  ['Sponsorships', 'Relevant brand partnerships that fit the TwoToneTaj community.'],
  ['Community', 'Discord questions, TajSquad topics and general contact.'],
]

function ExternalLink({ className, href, children, label }) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      {children}
    </a>
  )
}

export default function Contact() {
  return (
    <main className="page contact-page">
      <section className="contact-hero">
        <div className="contact-hero-copy">
          <p className="eyebrow">Official Contact</p>
          <h1>
            Let’s <span>Talk</span>
          </h1>
          <p>
            For collaborations, media opportunities, community questions or a quick hello,
            use the official TwoToneTaj contact routes below.
          </p>

          <div className="contact-hero-actions">
            <a className="btn primary" href={`mailto:${businessEmail}?subject=TwoToneTaj Enquiry`}>
              Email TwoToneTaj
            </a>
            <ExternalLink
              className="btn ghost"
              href={discordUrl}
              label="Join the TajSquad Discord"
            >
              Join TajSquad
            </ExternalLink>
          </div>
        </div>

        <aside className="contact-hero-mark" aria-label="TwoToneTaj official branding">
          <img src={logo} alt="TwoToneTaj logo" />
          <strong>TwoToneTaj</strong>
          <small>Average Gamer • Est. 1989</small>
          <p>Official contact routes only.</p>
        </aside>
      </section>

      <section className="contact-section-head">
        <p className="eyebrow">Official Destinations</p>
        <h2>Links & Support</h2>
        <p>
          Find verified TwoToneTaj profiles or support future content through the official links below.
        </p>
      </section>

      <section className="contact-grid" aria-label="TwoToneTaj official links and support">
        {contactOptions.map((option) => (
          <article className={`contact-panel contact-panel-${option.tone}`} key={option.title}>
            <div className="contact-panel-top">
              <div className="contact-icon" aria-hidden="true">{option.icon}</div>
              <span>{option.eyebrow}</span>
              <h3>{option.title}</h3>
              <p>{option.text}</p>
            </div>

            <div className="contact-panel-bottom">
              <ExternalLink
                className="contact-action"
                href={option.href}
                label={`${option.action}: ${option.title}`}
              >
                {option.action}
              </ExternalLink>
              <small>{option.note}</small>
            </div>
          </article>
        ))}
      </section>

      <section className="contact-enquiries" aria-label="Professional enquiry types">
        <div className="contact-enquiries-copy">
          <p className="eyebrow">Professional Contact</p>
          <h2>Enquiries Welcome</h2>
          <p>
            Relevant opportunities are always considered. A clear introduction, useful details and realistic timelines
            make every enquiry easier to review.
          </p>
          <a href={`mailto:${businessEmail}?subject=TwoToneTaj Professional Enquiry`}>
            Start An Email
          </a>
        </div>

        <div className="contact-enquiry-list">
          {enquiryTypes.map(([title, text]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-thanks" aria-label="TajSquad thank you message">
        <div>
          <span aria-hidden="true">♛</span>
          <h2>Thank You For Being Part Of TajSquad</h2>
          <p>
            Every message, share, laugh and bit of support helps the community grow and keeps the content moving.
          </p>
        </div>
        <strong>TajSquad</strong>
      </section>
    </main>
  )
}
