import { Navigate, useParams } from 'react-router-dom'
import EditableField from '../components/EditableField'
import EditableSection from '../components/EditableSection'
import { useManagedSite } from '../hooks/useManagedSite'

export default function DynamicPage() {
  const { pageSlug = '' } = useParams()
  const { site } = useManagedSite()
  const pageIndex = site.pages.findIndex(page => page.slug === pageSlug || page.target === `/${pageSlug}`)
  const page = site.pages[pageIndex]

  if (!page || page.visible === false) return <Navigate to="/" replace />

  return (
    <main className="page dynamic-page">
      <EditableSection
        sectionId={`pages.${page.id || page.slug}.hero`}
        label={`${page.title || page.label || 'Custom page'} heading`}
        policy={site.editorPolicy}
        defaultOrder={10}
        className="dynamicPageHero"
      >
        <EditableField
          as="p"
          className="eyebrow"
          fieldId={`engine.pages.${pageIndex}.eyebrow`}
          label="Page eyebrow"
          value={page.eyebrow || 'Explore'}
          policy={site.editorPolicy}
        />
        <EditableField
          as="h1"
          fieldId={`engine.pages.${pageIndex}.title`}
          label="Page title"
          value={page.title || page.label || 'New Page'}
          policy={site.editorPolicy}
        />
        <EditableField
          as="p"
          fieldId={`engine.pages.${pageIndex}.intro`}
          label="Page introduction"
          value={page.intro || 'Add an introduction for this page.'}
          policy={site.editorPolicy}
          kind="textarea"
        />
      </EditableSection>
    </main>
  )
}
