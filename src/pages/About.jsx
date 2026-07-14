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
const fallbackSections = [
  { title: '🎮 Where It Started', text: 'I came into FPS games late and, honestly, I was terrible. But I kept coming back because I loved the people, not the stats.' },
  { title: '🌧️ Life Got Heavy', text: 'During difficult chapters, gaming became a way to switch off, connect with others, and find a bit of light when I needed it most.' },
  { title: '🎥 Streaming Began', text: 'At first, nobody watched. Most streams felt like I was talking to myself, but I kept showing up.' },
  { title: '🔁 Balance Changed Everything', text: 'Eventually, I realised gaming could not solve everything. I needed balance.' },
  { title: '💥 The Moment Everything Changed', text: 'One day, XHubbaxx dropped into stream, helped me improve my setup, and what began as a quick test became a 12-hour stream.' },
  { title: 'Welcome to TajSquad', text: 'TwoToneTaj is a place to relax, laugh, unwind, and be yourself. No pressure. No drama. Just good people having a good time.' },
]

export default function About() {
  const { site } = useManagedSite()
  const page = site.about
  const sections = page.sections?.length ? page.sections : fallbackSections

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
        {sections.map((section, index) => {
          const final = index === sections.length - 1
          const wide = index === 4
          return <article className={`about-story-card ${final ? 'about-final-card' : wide ? 'about-wide-card' : 'about-image-card'}`} key={`${section.title}-${index}`}>
            {wide && <img className="about-wide-bg" src={art[index]} alt="" aria-hidden="true" />}
            {final && <div className="final-logo"><img src={site.assetUrls.primaryLogo || logo} alt={`${site.brand.name} logo`} /></div>}
            <div className={final ? 'final-copy' : wide ? 'about-card-copy about-wide-copy' : 'about-card-copy'}>
              <EditableField as="h2" fieldId={`about.sections.${index}.title`} label={`About section ${index + 1} title`} value={section.title} policy={site.editorPolicy} />
              <EditableField as="p" fieldId={`about.sections.${index}.text`} label={`About section ${index + 1} text`} value={section.text} policy={site.editorPolicy} kind="textarea" />
            </div>
            {!final && !wide && <img className={`about-card-art ${index === 0 ? 'about-card-art-squad' : ''}`} src={art[index]} alt="" />}
          </article>
        })}
      </section>
    </main>
  )
}
