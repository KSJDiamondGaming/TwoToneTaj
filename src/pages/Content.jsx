import YouTubeFeed from '../components/YouTubeFeed'
import EditableField from '../components/EditableField'
import EditableSection from '../components/EditableSection'
import { useManagedSite } from '../hooks/useManagedSite'

export default function Content() {
  const { site } = useManagedSite()
  const page = site.contentPage
  const platforms = [
    ['▶', 'YouTube', 'Videos & Shorts', 'Gameplay uploads, stream highlights, funny moments and creator projects.', site.socials.youtube, 'youtube'],
    ['◉', 'Twitch', 'Live Streams', 'Chilled sessions, gaming chaos and live community conversations.', site.socials.twitch, 'twitch'],
    ['✦', 'Social Clips', 'Short-Form Content', 'Quick updates, stream moments and highlights across the official channels.', site.socials.linktree, 'social'],
  ]

  return (
    <main className="page content-page">
      <EditableSection sectionId="content.hero" label="Content hero" policy={site.editorPolicy} defaultOrder={10} className="content-hero page-panel">
        <div className="content-hero-copy">
          <EditableField as="p" className="eyebrow" fieldId="contentPage.eyebrow" label="Content eyebrow" value={page.eyebrow} policy={site.editorPolicy} />
          <EditableField as="h1" fieldId="contentPage.title" label="Content title" value={page.title} policy={site.editorPolicy} />
          <EditableField as="p" fieldId="contentPage.intro" label="Content introduction" value={page.intro} policy={site.editorPolicy} kind="textarea" />
          <div className="content-hero-actions"><a className="btn primary" href={site.socials.youtube} target="_blank" rel="noreferrer">Watch On YouTube</a><a className="btn ghost" href={site.socials.twitch} target="_blank" rel="noreferrer">Visit Twitch</a></div>
        </div>
        <aside className="content-hero-feature"><span className="content-feature-kicker">{site.brand.name} Content</span><strong>Good Games. Better Laughs.</strong><p>Highlights, uploads and live moments built around the community.</p><div className="content-feature-tags"><span>Gameplay</span><span>Streams</span><span>Shorts</span><span>{site.brand.communityName}</span></div></aside>
      </EditableSection>

      <EditableSection sectionId="content.latest" label="Latest videos" policy={site.editorPolicy} defaultOrder={20}>
        <section className="content-section-head"><div><p className="eyebrow">Latest From The Channel</p><EditableField as="h2" fieldId="contentPage.latestTitle" label="Latest content title" value={page.latestTitle} policy={site.editorPolicy} /><EditableField as="p" fieldId="contentPage.latestText" label="Latest content text" value={page.latestText} policy={site.editorPolicy} kind="textarea" /></div><a href={site.socials.youtube} target="_blank" rel="noreferrer">View Full Channel</a></section>
        <section className="content-feed page-panel"><YouTubeFeed /></section>
      </EditableSection>

      <EditableSection sectionId="content.platforms" label="Content platforms" policy={site.editorPolicy} defaultOrder={30}>
        <section className="content-section-head content-platforms-head"><div><p className="eyebrow">Follow The Content</p><EditableField as="h2" fieldId="contentPage.platformTitle" label="Platforms title" value={page.platformTitle} policy={site.editorPolicy} /></div></section>
        <section className="content-grid">{platforms.map(([icon, title, label, text, url, tone]) => <article className={`page-panel content-card content-card-${tone}`} key={title}><div><span className="content-card-icon">{icon}</span><small>{label}</small><h3>{title}</h3><p>{text}</p></div><a href={url} target="_blank" rel="noreferrer">Open {title}</a></article>)}</section>
      </EditableSection>

      <EditableSection sectionId="content.footer" label="Content closing section" policy={site.editorPolicy} defaultOrder={40} className="content-footer-panel page-panel"><div><p className="eyebrow">The {site.brand.name} Way</p><EditableField as="h2" fieldId="contentPage.footerTitle" label="Content footer title" value={page.footerTitle} policy={site.editorPolicy} /><EditableField as="p" fieldId="contentPage.footerText" label="Content footer text" value={page.footerText} policy={site.editorPolicy} kind="textarea" /></div><a className="btn primary" href={site.socials.linktree} target="_blank" rel="noreferrer">Stay Connected</a></EditableSection>
    </main>
  )
}
