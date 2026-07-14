import tajAvatar from '../assets/about/taj-avatar.png'
import squad from '../assets/about/squad.png'
import controller from '../assets/about/controller.png'
import microphone from '../assets/about/microphone.png'
import scales from '../assets/about/scales.png'
import crowd from '../assets/about/crowd.png'
import logo from '../assets/logo.png'
import EditableField from '../components/EditableField'
import { useManagedSite } from '../hooks/useManagedSite'

const art = [squad, controller, microphone, scales, crowd, logo]

export default function About() {
  const { site } = useManagedSite()
  const page = site.about

  return (
    <main className="about-page">
      <section className="about-hero-card">
        <div className="about-hero-content">
          <EditableField as="h1" fieldId="about.title" label="About title" value={page.title} policy={site.editorPolicy} />
          <EditableField as="p" className="about-subtitle" fieldId="about.subtitle" label="About subtitle" value={page.subtitle} policy={site.editorPolicy} />
          <EditableField as="p" fieldId="about.intro" label="About introduction" value={page.intro} policy={site.editorPolicy} kind="textarea" />
          <EditableField as="p" className="about-highlight" fieldId="about.quote" label="About quote" value={page.quote} policy={site.editorPolicy} kind="textarea" />
          <p className="about-signature"><strong>— {site.brand.ownerName?.toUpperCase()}</strong></p>
        </div>
        <img className="about-avatar" src={tajAvatar} alt={`${site.brand.name} avatar`} />
      </section>

      <section className="about-story-grid">
        {(page.sections || []).map((section, index) => {
          const final = index === (page.sections || []).length - 1
          const wide = index === 4
          return (
            <article className={`about-story-card ${final ? 'about-final-card' : wide ? 'about-wide-card' : 'about-image-card'}`} key={`${section.title}-${index}`}>
              {wide && <img className="about-wide-bg" src={art[index]} alt="" aria-hidden="true" />}
              {final && <div className="final-logo"><img src={site.assetUrls.primaryLogo || logo} alt={`${site.brand.name} logo`} /></div>}
              <div className={final ? 'final-copy' : wide ? 'about-card-copy about-wide-copy' : 'about-card-copy'}>
                <EditableField as="h2" fieldId={`about.sections.${index}.title`} label={`About section ${index + 1} title`} value={section.title} policy={site.editorPolicy} />
                <EditableField as="p" fieldId={`about.sections.${index}.text`} label={`About section ${index + 1} text`} value={section.text} policy={site.editorPolicy} kind="textarea" />
              </div>
              {!final && !wide && <img className={`about-card-art ${index === 0 ? 'about-card-art-squad' : ''}`} src={art[index]} alt="" />}
            </article>
          )
        })}
      </section>
    </main>
  )
}
