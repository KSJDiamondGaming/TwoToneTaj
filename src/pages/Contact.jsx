import logo from '../assets/logo.png'
import '../styles/contact.css'

const officialLinksUrl = 'https://linktr.ee/Twotonetaj'
const discordUrl = 'https://discord.gg/WcbtQPuByd'
const paypalUrl = 'https://paypal.me/2tonetaj'
const businessEmail = 'media@ksjdigital.co.uk'

const contactOptions = [
  {
    icon: '📧',
    eyebrow: 'Business & Media',
    title: 'Email TwoToneTaj',
    text: 'For collaborations, partnerships, creator opportunities, press, sponsorships and professional enquiries.',
    action: businessEmail,
    href: `mailto:${businessEmail}?subject=TwoToneTaj Business Enquiry`,
    note: 'Official media contact managed through KSJ Digital.',
    tone: 'email',
  },
  {
    icon: '💬',
    eyebrow: 'Community Contact',
    title: 'Join The Discord',
    text: 'For community chat, stream updates, gaming conversations and general TajSquad interaction.',
    action: 'Open TajSquad Discord',
    href: discordUrl,
    note: 'The best place for day-to-day community contact.',
    tone: 'discord',
  },
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
    note: 'Every bit helps keep the content and community moving forward.',
    tone: 'support',
  },
]

const enquiryTypes = [
  ['Collaborations', 'Creator projects, gaming partnerships and joint content.'],
  ['Media Enquiries', 'Interviews, press, podcasts and promotional opportunities.'],
  ['Sponsorships', 'Relevant brand partnerships that fit the TwoToneTaj community.'],
  ['Community', 'Discord questions, TajSquad topics and general contact.'],
]

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
            Whether it is a collaboration, media opportunity, community question or a quick hello,
            use the official TwoToneTaj contact routes below.
          </p>

          <div className="contact-hero-actions">
            <a className="btn primary" href={`mailto:${businessEmail}?subject=TwoToneTaj Enquiry`}>
              Email TwoToneTaj
            </a>
            <a className="btn ghost" href={discordUrl} target="_blank" rel="noopener noreferrer">
              Join TajSquad
            </a>
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
        <p className="eyebrow">Choose The Right Route</p>
        <h2>Contact Options</h2>
        <p>Use email for professional enquiries and Discord for community conversation.</p>
      </section>

      <section className="contact-grid" aria-label="TwoToneTaj contact options">
        {contactOptions.map((option) => (
          <article className={`contact-panel contact-panel-${option.tone}`} key={option.title}>
            <div className="contact-panel-top">
              <div className="contact-icon" aria-hidden="true">{option.icon}</div>
              <span>{option.eyebrow}</span>
              <h3>{option.title}</h3>
              <p>{option.text}</p>
            </div>

            <div className="contact-panel-bottom">
              <a
                className="contact-action"
                href={option.href}
                target={option.href.startsWith('http') ? '_blank' : undefined}
                rel={option.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {option.action}
              </a>
              <small>{option.note}</small>
            </div>
          </article>
        ))}
      </section>

      <section className="contact-enquiries" aria-label="Enquiry types">
        <div className="contact-enquiries-copy">
          <p className="eyebrow">What To Contact About</p>
          <h2>Professional Enquiries Welcome</h2>
          <p>
            Relevant opportunities are always considered. Clear details, realistic timelines and a proper introduction
            help make every enquiry easier to review.
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
