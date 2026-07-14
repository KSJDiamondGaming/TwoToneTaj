import EditableField from '../components/EditableField'
import { useManagedSite } from '../hooks/useManagedSite'
import '../styles/privacy.css'

export default function Privacy() {
  const { site } = useManagedSite()
  const page = site.privacy

  return (
    <main className="page privacy-page">
      <section className="privacy-hero">
        <EditableField as="p" className="eyebrow" fieldId="privacy.eyebrow" label="Privacy eyebrow" value={page.eyebrow} policy={site.editorPolicy} />
        <EditableField as="h1" fieldId="privacy.title" label="Privacy title" value={page.title} policy={site.editorPolicy} />
        <EditableField as="p" fieldId="privacy.intro" label="Privacy introduction" value={page.intro} policy={site.editorPolicy} kind="textarea" />
      </section>

      <section className="privacy-card">
        {(page.sections || []).map((section, index) => (
          <div key={`${section.title}-${index}`}>
            <EditableField as="h2" fieldId={`privacy.sections.${index}.title`} label={`Privacy section ${index + 1} title`} value={section.title} policy={site.editorPolicy} />
            <EditableField as="p" fieldId={`privacy.sections.${index}.text`} label={`Privacy section ${index + 1} text`} value={section.text} policy={site.editorPolicy} kind="textarea" />
          </div>
        ))}
        <p><a href={`mailto:${site.contact.supportEmail}`}>{site.contact.supportEmail}</a></p>
        <EditableField as="p" className="privacy-updated" fieldId="privacy.updated" label="Privacy last updated" value={page.updated} policy={site.editorPolicy} />
      </section>
    </main>
  )
}
