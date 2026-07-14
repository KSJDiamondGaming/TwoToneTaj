import EditableField from '../components/EditableField'
import { useManagedSite } from '../hooks/useManagedSite'
import '../styles/privacy.css'

const fallbackSections = [
  { title: '1. Who we are', text: 'This website is operated for TwoToneTaj and supported by KSJ Digital.' },
  { title: '2. Information we may collect', text: 'This website may collect limited technical and usage information when you visit pages or interact with embedded content.' },
  { title: '3. Contact emails', text: 'If you contact us by email, we may receive your email address, message and any information you choose to include.' },
  { title: '4. Third-party services', text: 'This website may link to or display content from third-party platforms. Those platforms have their own privacy policies.' },
  { title: '5. Cookies and browser storage', text: 'The site may use basic browser storage for small features and preferences.' },
  { title: '6. How information is used', text: 'Information is used to operate the website, respond to enquiries and improve the user experience.' },
  { title: '7. Data sharing', text: 'We do not sell personal information. Information is only shared where required to operate or protect the website.' },
  { title: '8. Your rights', text: 'You may contact us to request access, correction or deletion of personal information you have provided, where applicable.' },
  { title: '9. Changes to this policy', text: 'This policy may be updated as the website develops or new features are added.' },
]

export default function Privacy() {
  const { site } = useManagedSite()
  const page = site.privacy
  const sections = page.sections?.length ? page.sections : fallbackSections

  return (
    <main className="page privacy-page">
      <section className="privacy-hero">
        <EditableField as="p" className="eyebrow" fieldId="privacy.eyebrow" label="Privacy eyebrow" value={page.eyebrow} policy={site.editorPolicy} />
        <EditableField as="h1" fieldId="privacy.title" label="Privacy title" value={page.title} policy={site.editorPolicy} />
        <EditableField as="p" fieldId="privacy.intro" label="Privacy introduction" value={page.intro} policy={site.editorPolicy} kind="textarea" />
      </section>
      <section className="privacy-card">
        {sections.map((section, index) => <div key={`${section.title}-${index}`}><EditableField as="h2" fieldId={`privacy.sections.${index}.title`} label={`Privacy section ${index + 1} title`} value={section.title} policy={site.editorPolicy} /><EditableField as="p" fieldId={`privacy.sections.${index}.text`} label={`Privacy section ${index + 1} text`} value={section.text} policy={site.editorPolicy} kind="textarea" /></div>)}
        <p><a href={`mailto:${site.contact.supportEmail}`}>{site.contact.supportEmail}</a></p>
        <EditableField as="p" className="privacy-updated" fieldId="privacy.updated" label="Privacy last updated" value={page.updated} policy={site.editorPolicy} />
      </section>
    </main>
  )
}
