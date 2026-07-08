import logo from '../assets/logo.png'
import { getMailTo } from '../config/siteConfig'
import { useManagedSite } from '../hooks/useManagedSite'
import '../styles/contact.css'

const enquiryTypes = [
  ['Collaborations', 'Creator projects, gaming partnerships and joint content.'],
  ['Media Enquiries', 'Interviews, press, podcasts and promotional opportunities.'],
  ['Sponsorships', 'Relevant brand partnerships that fit the community.'],
  ['Community', 'Discord questions, community topics and general contact.'],
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
  const { site } = useManagedSite()
  const contactOptions = [
    {
      icon: '🔗',
      eyebrow: 'Official Profiles',
      title: 'All Creator Links',
      text: `Find the current ${site.brand.name} channels, social profiles, streaming platforms and official destinations.`,
      action: 'Visit Linktree',
      href: site.socials.linktree,
      note: 'Use only the official profiles linked here.',
      tone: 'links',
    },
    {
      icon: '💚',
      eyebrow: 'Optional Support',
      title: 'Support The Content',
      text: 'Support future content creation and community projects. It is always appreciated and never expected.',
      action: 'Support On PayPal',
      href: site.socials.paypal,
      note: 'Every contribution helps support future content and community projects.',
      tone: 'support',
    },
  ]

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
            use the official {site.brand.name} contact routes below.
          </p>

          <div className="contact-hero-actions">
            <a className="btn primary" href={getMailTo(site.contact.businessEmail, `${site.brand.name} Enquiry`)}>
              Email {site.brand.name}
            </a>
            <ExternalLink
              className="btn ghost"
              href={site.socials.discord}
              label={`Join the ${site.brand.communityName} Discord`}
            >
              Join {site.brand.communityName}
            </ExternalLink>
          </div>
        </div>

        <aside className="contact-hero-mark" aria-label={`${site.brand.name} official branding`}>
          <img src={logo} alt={`${site.brand.name} logo`} />
          <strong>{site.brand.name}</strong>
          <small>{site.brand.tagline}</small>
          <p>Official contact routes only.</p>
        </aside>
      </section>

      <section className="contact-section-head">
        <p className="eyebrow">Official Destinations</p>
        <h2>Links & Support</h2>
        <p>
          Find verified {site.brand.name} profiles or support future content through the official links below.
        </p>
      </section>

      <section className="contact-grid" aria-label={`${site.brand.name} official links and support`}>
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
          <a href={getMailTo(site.contact.businessEmail, `${site.brand.name} Professional Enquiry`)}>
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

      <section className="contact-thanks" aria-label={`${site.brand.communityName} thank you message`}>
        <div>
          <span aria-hidden="true">♛</span>
          <h2>Thank You For Being Part Of {site.brand.communityName}</h2>
          <p>
            Every message, share, laugh and bit of support helps the community grow and keeps the content moving.
          </p>
        </div>
        <strong>{site.brand.communityName}</strong>
      </section>
    </main>
  )
}
