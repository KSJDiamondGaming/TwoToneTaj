import { useEffect, useMemo, useState } from 'react'
import logo from '../assets/logo.png'
import EditableField from '../components/EditableField'
import EditableImage from '../components/EditableImage'
import EditableSection from '../components/EditableSection'
import { useManagedSite } from '../hooks/useManagedSite'

const areas = [
  ['📣', 'Announcements', 'Official updates, stream alerts and community notices.'],
  ['🎮', 'Gaming Chat', 'Talk games, squads, clips and whatever chaos happens next.'],
  ['🎥', 'Stream Alerts', 'Know when the stream starts and jump in live.'],
  ['🎧', 'Voice Hangouts', 'Chill in voice, group up and laugh together.'],
  ['💚', 'Good Vibes', 'A community built around laughs, support and respect.'],
  ['🛡️', 'Safe Community', 'Clear expectations and a community-first approach.'],
]

export default function Community() {
  const { site } = useManagedSite()
  const page = site.communityPage
  const [discordData, setDiscordData] = useState(null)
  const [dataState, setDataState] = useState('loading')

  useEffect(() => {
    const code = site.socials.discord?.split('/').filter(Boolean).pop()
    if (!code) return setDataState('fallback')
    const controller = new AbortController()
    fetch(`https://discord.com/api/v10/invites/${code}?with_counts=true&with_expiration=true`, { signal: controller.signal })
      .then(response => response.ok ? response.json() : Promise.reject(new Error(String(response.status))))
      .then(data => { setDiscordData(data); setDataState('live') })
      .catch(error => { if (error.name !== 'AbortError') setDataState('fallback') })
    return () => controller.abort()
  }, [site.socials.discord])

  const serverName = discordData?.guild?.name || `${site.brand.communityName} Community`
  const stats = useMemo(() => [
    ['Community', serverName],
    ['Members', discordData?.approximate_member_count?.toLocaleString('en-GB') || site.brand.communityName],
    ['Online', discordData?.approximate_presence_count?.toLocaleString('en-GB') || 'Live Soon'],
    ['Status', dataState === 'loading' ? 'Checking...' : dataState === 'live' ? 'Connected' : 'Community Hub'],
  ], [dataState, discordData, serverName, site.brand.communityName])

  return (
    <main className="community-page">
      <EditableSection sectionId="community.hero" label="Community hero" policy={site.editorPolicy} defaultOrder={10} className="community-hero">
        <div className="community-hero-copy">
          <EditableField as="span" className="eyebrow" fieldId="communityPage.eyebrow" label="Community eyebrow" value={page.eyebrow} policy={site.editorPolicy} />
          <EditableField as="h1" fieldId="communityPage.title" label="Community title" value={page.title} policy={site.editorPolicy} />
          <EditableField as="p" fieldId="communityPage.intro" label="Community introduction" value={page.intro} policy={site.editorPolicy} kind="textarea" />
          <div className="community-hero-actions"><a className="btn primary" href={site.socials.discord} target="_blank" rel="noopener noreferrer">Join {site.brand.communityName}</a><a className="btn ghost" href="#community-live">View Community</a></div>
        </div>
        <aside className="community-discord-card"><div className="community-card-glow" /><EditableImage fieldId="communityPage.heroImage" label="Community card image" src={page.heroImage || site.brand.primaryLogo} fallback={site.assetUrls.primaryLogo || logo} alt={`${site.brand.name} logo`} policy={site.editorPolicy} /><span>{dataState === 'live' ? 'Discord Connected' : 'Discord Ready'}</span><strong>{serverName}</strong><p>Join the official community for streams, clips, gaming and updates.</p><a href={site.socials.discord} target="_blank" rel="noopener noreferrer">Open Discord</a></aside>
      </EditableSection>

      <EditableSection sectionId="community.stats" label="Community statistics" policy={site.editorPolicy} defaultOrder={20} as="section" className="community-stats-grid" id="community-live">{stats.map(([label, value]) => <article className="community-stat-card" key={label}><span>{label}</span><strong>{value}</strong></article>)}</EditableSection>

      <EditableSection sectionId="community.dashboard" label="Community updates" policy={site.editorPolicy} defaultOrder={30} className="community-dashboard-panel"><div><span className="eyebrow">Community Updates</span><EditableField as="h2" fieldId="communityPage.dashboardTitle" label="Community updates title" value={page.dashboardTitle} policy={site.editorPolicy} /><EditableField as="p" fieldId="communityPage.dashboardText" label="Community updates text" value={page.dashboardText} policy={site.editorPolicy} kind="textarea" /></div></EditableSection>

      <EditableSection sectionId="community.areas" label="Discord areas" policy={site.editorPolicy} defaultOrder={40}><section className="community-section-head"><span className="eyebrow">Inside The Discord</span><EditableField as="h2" fieldId="communityPage.areasTitle" label="Community areas title" value={page.areasTitle} policy={site.editorPolicy} /></section><section className="community-area-grid">{areas.map(([icon, title, text]) => <article className="community-area-card" key={title}><span>{icon}</span><h3>{title}</h3><p>{text}</p></article>)}</section></EditableSection>

      <EditableSection sectionId="community.values" label="Community standards" policy={site.editorPolicy} defaultOrder={50} className="community-values-panel"><div className="community-values-copy"><span className="eyebrow">Community Standards</span><EditableField as="h2" fieldId="communityPage.valuesTitle" label="Community values title" value={page.valuesTitle} policy={site.editorPolicy} /><EditableField as="p" fieldId="communityPage.valuesText" label="Community values text" value={page.valuesText} policy={site.editorPolicy} kind="textarea" /></div></EditableSection>
    </main>
  )
}
