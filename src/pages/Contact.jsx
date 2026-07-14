import logo from '../assets/logo.png'
import EditableField from '../components/EditableField'
import { getMailTo } from '../config/siteConfig'
import { useManagedSite } from '../hooks/useManagedSite'
import '../styles/contact.css'

const enquiryTypes = [
  ['Collaborations', 'Creator projects, gaming partnerships and joint content.'],
  ['Media Enquiries', 'Interviews, press, podcasts and promotional opportunities.'],
  ['Sponsorships', 'Relevant brand partnerships that fit the community.'],
  ['Community', 'Discord questions, community topics and general contact.'],
]

export default function Contact() {
  const { site } = useManagedSite()
  const page = site.contactPage

  return (
    <main className="page contact-page">
      <section className="contact-hero">
        <div className="contact-hero-copy">
          <EditableField as="p" className="eyebrow" fieldId="contactPage.eyebrow" label="Contact eyebrow" value={page.eyebrow} policy={site.editorPolicy} />
          <EditableField as="h1" fieldId="contactPage.title" label="Contact title" value={page.title} policy={site.editorPolicy} />
          <EditableField as="p" fieldId="contactPage.intro" label="Contact introduction" value={page.intro} policy={site.editorPolicy} kind="textarea" />
          <div className="contact-hero-actions">
            <a className="btn primary" href={getMailTo(site.contact.businessEmail, `${site.brand.name} Enquiry`)}>Email {site.brand.name}</a>
            <a className="btn ghost" href={site.socials.discord} target="_blank" rel="noopener noreferrer">Join {site.brand.communityName}</a>
          </div>
        </div>
        <aside className="contact-hero-mark">
          <img src={site.assetUrls.primaryLogo || logo} alt={`${site.brand.name} logo`} />
          <strong>{site.brand.name}</strong><small>{site.brand.tagline}</small>
          <p>Official contact routes only.</p>
        </aside>
      </section>

      <section className="contact-section-head">
        <p className="eyebrow">Official Destinations</p>
        <EditableField as="h2" fieldId="contactPage.linksTitle" label="Links section title" value={page.linksTitle} policy={site.editorPolicy} />
      </section>

      <section className="contact-grid">
        <article className="contact-panel contact-panel-links"><div className="contact-panel-top"><div className="contact-icon">🔗</div><span>Official Profiles</span><h3>All Creator Links</h3><p>Find the current channels, social profiles and official destinations.</p></div><div className="contact-panel-bottom"><a className="contact-action" href={site.socials.linktree} target="_blank" rel="noreferrer">Visit Linktree</a></div></article>
        <article className="contact-panel contact-panel-support"><div className="contact-panel-top"><div className="contact-icon">💚</div><span>Optional Support</span><h3>Support The Content</h3><p>Support future content creation and community projects.</p></div><div className="contact-panel-bottom"><a className="contact-action" href={site.socials.paypal} target="_blank" rel="noreferrer">Support On PayPal</a></div></article>
      </section>

      <section className="contact-enquiries">
        <div className="contact-enquiries-copy">
          <p className="eyebrow">Professional Contact</p>
          <EditableField as="h2" fieldId="contactPage.enquiriesTitle" label="Enquiries title" value={page.enquiriesTitle} policy={site.editorPolicy} />
          <EditableField as="p" fieldId="contactPage.enquiriesText" label="Enquiries text" value={page.enquiriesText} policy={site.editorPolicy} kind="textarea" />
          <a href={getMailTo(site.contact.businessEmail, `${site.brand.name} Professional Enquiry`)}>Start An Email</a>
        </div>
        <div className="contact-enquiry-list">{enquiryTypes.map(([title, text]) => <article key={title}><strong>{title}</strong><p>{text}</p></article>)}</div>
      </section>

      <section className="contact-thanks">
        <div><span>♛</span><EditableField as="h2" fieldId="contactPage.thanksTitle" label="Thank you title" value={page.thanksTitle} policy={site.editorPolicy} /><EditableField as="p" fieldId="contactPage.thanksText" label="Thank you text" value={page.thanksText} policy={site.editorPolicy} kind="textarea" /></div>
        <strong>{site.brand.communityName}</strong>
      </section>
    </main>
  )
}
