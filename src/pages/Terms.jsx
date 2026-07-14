import EditableField from '../components/EditableField'
import { useManagedSite } from '../hooks/useManagedSite'
import '../styles/terms.css'

const fallbackSections = [
  { title: '1. Use of this website', text: 'Use this website responsibly and only for lawful purposes.' },
  { title: '2. Website content', text: 'Content is provided for general information, entertainment, community updates and creator-related purposes.' },
  { title: '3. Development notice', text: 'The website may change as pages, features, layouts and content are improved.' },
  { title: '4. External links', text: 'We are not responsible for the content, policies or actions of third-party services linked from this website.' },
  { title: '5. Intellectual property', text: 'Names, branding, graphics and website content must not be copied or redistributed without permission.' },
  { title: '6. Community behaviour', text: 'Users are expected to behave respectfully when interacting with related content and community services.' },
  { title: '7. No guarantees', text: 'The website is provided as-is and may not always be uninterrupted, error-free or fully up to date.' },
  { title: '8. Support', text: 'For website support or technical questions, contact KSJ Digital.' },
  { title: '9. Changes to these terms', text: 'These terms may be updated as the website develops or new features are added.' },
]

export default function Terms() {
  const { site } = useManagedSite()
  const page = site.terms
  const sections = page.sections?.length ? page.sections : fallbackSections

  return (
    <main className="page terms-page">
      <section className="terms-hero">
        <EditableField as="p" className="eyebrow" fieldId="terms.eyebrow" label="Terms eyebrow" value={page.eyebrow} policy={site.editorPolicy} />
        <EditableField as="h1" fieldId="terms.title" label="Terms title" value={page.title} policy={site.editorPolicy} />
        <EditableField as="p" fieldId="terms.intro" label="Terms introduction" value={page.intro} policy={site.editorPolicy} kind="textarea" />
      </section>
      <section className="terms-card">
        {sections.map((section, index) => <div key={`${section.title}-${index}`}><EditableField as="h2" fieldId={`terms.sections.${index}.title`} label={`Terms section ${index + 1} title`} value={section.title} policy={site.editorPolicy} /><EditableField as="p" fieldId={`terms.sections.${index}.text`} label={`Terms section ${index + 1} text`} value={section.text} policy={site.editorPolicy} kind="textarea" /></div>)}
        <p><a href={`mailto:${site.contact.supportEmail}`}>{site.contact.supportEmail}</a></p>
        <EditableField as="p" className="terms-updated" fieldId="terms.updated" label="Terms last updated" value={page.updated} policy={site.editorPolicy} />
      </section>
    </main>
  )
}
