import EditableField from '../components/EditableField'
import { useManagedSite } from '../hooks/useManagedSite'
import '../styles/terms.css'

export default function Terms() {
  const { site } = useManagedSite()
  const page = site.terms

  return (
    <main className="page terms-page">
      <section className="terms-hero">
        <EditableField as="p" className="eyebrow" fieldId="terms.eyebrow" label="Terms eyebrow" value={page.eyebrow} policy={site.editorPolicy} />
        <EditableField as="h1" fieldId="terms.title" label="Terms title" value={page.title} policy={site.editorPolicy} />
        <EditableField as="p" fieldId="terms.intro" label="Terms introduction" value={page.intro} policy={site.editorPolicy} kind="textarea" />
      </section>

      <section className="terms-card">
        {(page.sections || []).map((section, index) => (
          <div key={`${section.title}-${index}`}>
            <EditableField as="h2" fieldId={`terms.sections.${index}.title`} label={`Terms section ${index + 1} title`} value={section.title} policy={site.editorPolicy} />
            <EditableField as="p" fieldId={`terms.sections.${index}.text`} label={`Terms section ${index + 1} text`} value={section.text} policy={site.editorPolicy} kind="textarea" />
          </div>
        ))}
        <p><a href={`mailto:${site.contact.supportEmail}`}>{site.contact.supportEmail}</a></p>
        <EditableField as="p" className="terms-updated" fieldId="terms.updated" label="Terms last updated" value={page.updated} policy={site.editorPolicy} />
      </section>
    </main>
  )
}
