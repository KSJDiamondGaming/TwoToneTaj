import logo from '../assets/logo.png'
import '../styles/contact.css'

const officialLinksUrl = 'https://linktr.ee/Twotonetaj'
const paypalUrl = 'https://paypal.me/2tonetaj'
const businessEmail = 'business@twotonetaj.co.uk'

export default function Contact() {
  return (
    <main className="page contact-page">
      <section className="contact-hero">
        <div className="contact-hero-copy">
          <p className="eyebrow">Official Contact</p>
          <h1>
            Get In <span>Touch</span>
          </h1>
          <p>
            For collaborations, content opportunities, business enquiries, support,
            or general questions, use the official contact options below.
          </p>
        </div>

        <div className="contact-hero-mark" aria-label="TwoToneTaj official branding">
          <img src={logo} alt="TwoToneTaj logo" />
          <strong>TwoToneTaj</strong>
          <small>Average Gamer • Est. 1989</small>
        </div>
      </section>

      <section className="contact-grid" aria-label="TwoToneTaj contact options">
        <article className="contact-panel">
          <div className="contact-icon" aria-hidden="true">🔗</div>
          <h2>Official Links</h2>
          <p>
            Access the official TwoToneTaj Linktree for current creator profiles,
            community links, platforms, and updates.
          </p>
          <a className="contact-action" href={officialLinksUrl} target="_blank" rel="noopener noreferrer">
            Visit Linktree
          </a>
          <span className="contact-url">linktr.ee/Twotonetaj</span>
        </article>

        <article className="contact-panel">
          <div className="contact-icon" aria-hidden="true">✉️</div>
          <h2>Business Enquiries</h2>
          <p>
            For partnerships, collaborations, media enquiries, or anything business related,
            please get in touch by email.
          </p>
          <a className="contact-email-box" href={`mailto:${businessEmail}?subject=TwoToneTaj Business Enquiry`}>
            {businessEmail}
          </a>
          <small>I aim to respond to all enquiries as soon as possible.</small>
        </article>

        <article className="contact-panel">
          <div className="contact-icon" aria-hidden="true">💬</div>
          <h2>Contact Form</h2>
          <p>
            Have a general question or want to say hello? The contact form layout is ready,
            with full sending functionality planned for a later update.
          </p>
          <form className="contact-form" aria-label="Contact form preview">
            <div className="contact-form-row">
              <input type="text" name="name" placeholder="Your Name" aria-label="Your Name" />
              <input type="email" name="email" placeholder="Email Address" aria-label="Email Address" />
            </div>
            <input type="text" name="subject" placeholder="Subject" aria-label="Subject" />
            <textarea name="message" placeholder="Your Message" rows="5" aria-label="Your Message" />
            <button type="button" disabled>Send Message</button>
          </form>
          <small>Contact form functionality coming soon.</small>
        </article>

        <article className="contact-panel">
          <div className="contact-icon" aria-hidden="true">💚</div>
          <h2>Support TwoToneTaj</h2>
          <p>
            If you would like to support future content creation and community projects,
            any support is appreciated and never expected.
          </p>
          <a className="contact-paypal" href={paypalUrl} target="_blank" rel="noopener noreferrer">
            Support on PayPal
          </a>
          <small>Every bit of support helps keep the content coming and the community growing.</small>
        </article>
      </section>

      <section className="contact-thanks" aria-label="TajSquad thank you message">
        <div>
          <span aria-hidden="true">♛</span>
          <h2>Thank You For Being Part Of TajSquad</h2>
          <p>
            Your support helps keep the community growing and allows me to continue creating
            content for everyone to enjoy. Much love!
          </p>
        </div>
        <strong>TajSquad</strong>
      </section>
    </main>
  )
}
