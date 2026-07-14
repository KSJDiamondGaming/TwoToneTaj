import { Link } from 'react-router-dom'
import YouTubeFeed from '../components/YouTubeFeed'
import EditableField from '../components/EditableField'
import EditableSection from '../components/EditableSection'
import { getTwitchEmbedUrl } from '../config/siteConfig'
import { useManagedSite } from '../hooks/useManagedSite'

import heroDragon from '../assets/home/dragon.png'
import setupImage from '../assets/home/setup.png'
import controllerIcon from '../assets/home/controller.png'
import playIcon from '../assets/home/play.png'
import peopleIcon from '../assets/home/people.png'
import trophyIcon from '../assets/home/trophy.png'
import twitchIcon from '../assets/home/twitch.png'
import tiktokIcon from '../assets/home/tiktok.png'
import youtubeIcon from '../assets/home/youtube.png'
import kIcon from '../assets/home/k.png'
import instaIcon from '../assets/home/insta.png'

const streamSchedule = [
  ['Mon', '7:00 PM - 11:00 PM'], ['Tue', '7:00 PM - 11:00 PM'], ['Wed', 'Offline'],
  ['Thu', '7:00 PM - 11:00 PM'], ['Fri', '7:00 PM - 12:00 AM'],
  ['Sat', '12:00 PM - 12:00 AM'], ['Sun', '12:00 PM - 10:00 PM'],
]

const expectCards = [
  [controllerIcon, 'Live Streams', 'Join me live on Twitch for gameplay, chaos, and good times.'],
  [playIcon, 'Videos', 'Watch highlights, funny moments, and full gameplay videos.'],
  [peopleIcon, 'Community', 'Join the community. Good vibes, great people, and memories.'],
  [trophyIcon, 'Competitive Play', 'Grinding ranks and taking on the best. Let’s go!'],
]

export default function Home() {
  const { site } = useManagedSite()
  const twitchEmbedUrl = getTwitchEmbedUrl(site.platforms.twitchChannel)
  const socialLinks = [
    [twitchIcon, 'Twitch', site.brand.name, site.socials.twitch],
    [tiktokIcon, 'TikTok', site.brand.name, site.socials.tiktok],
    [youtubeIcon, 'YouTube', site.brand.name, site.socials.youtube],
    [kIcon, 'Kick', site.brand.name, site.socials.kick],
    [instaIcon, 'Instagram', site.brand.name, site.socials.instagram],
  ]

  return (
    <main className="home">
      <EditableSection sectionId="home.hero" label="Hero section" policy={site.editorPolicy} defaultOrder={10} className="hero-panel">
        <div className="hero-copy">
          <EditableField as="span" className="hero-eyebrow" fieldId="brand.shortTagline" label="Hero eyebrow" value={site.brand.shortTagline} policy={site.editorPolicy} />
          <EditableField as="h1" fieldId="home.heroTitle" label="Hero title" value={site.home.heroTitle} policy={site.editorPolicy} />
          <div className="hero-est">Est. 1989</div>
          <EditableField as="p" fieldId="home.heroText" label="Hero description" value={site.home.heroText} policy={site.editorPolicy} kind="textarea" />
        </div>
        <img className="hero-dragon" src={heroDragon} alt={`${site.brand.name} dragon`} />
      </EditableSection>

      <div className="home-grid">
        <EditableSection as="article" sectionId="home.about" label="About panel" policy={site.editorPolicy} defaultOrder={20} className="panel about-panel">
          <EditableField as="h2" fieldId="home.aboutTitle" label="About section title" value={site.home.aboutTitle} policy={site.editorPolicy}><img src={peopleIcon} alt="" />{site.home.aboutTitle}</EditableField>
          <img className="about-image" src={setupImage} alt={`${site.brand.name} gaming setup`} />
          <EditableField as="p" fieldId="home.aboutText" label="About section text" value={site.home.aboutText} policy={site.editorPolicy} kind="textarea" />
          <Link className="about-link" to="/about">Learn More</Link>
        </EditableSection>

        <EditableSection as="article" sectionId="home.schedule" label="Schedule panel" policy={site.editorPolicy} defaultOrder={30} className="panel schedule-panel">
          <EditableField as="h2" fieldId="home.scheduleTitle" label="Schedule section title" value={site.home.scheduleTitle} policy={site.editorPolicy}><img src={playIcon} alt="" />{site.home.scheduleTitle}</EditableField>
          <div className="schedule-list">{streamSchedule.map(([day, time]) => <p key={day}><strong>{day}</strong><span>{time}</span></p>)}</div>
          <div className="schedule-timezone"><small>Times shown in</small><strong>GMT</strong><p>Schedule is subject to change. Follow on social media for updates!</p></div>
        </EditableSection>

        <EditableSection as="article" sectionId="home.twitch" label="Twitch panel" policy={site.editorPolicy} defaultOrder={40} className="panel twitch-panel">
          <EditableField as="h2" fieldId="home.twitchTitle" label="Twitch section title" value={site.home.twitchTitle} policy={site.editorPolicy}><img src={twitchIcon} alt="" />{site.home.twitchTitle}</EditableField>
          <div className="twitch-preview"><iframe src={twitchEmbedUrl} title={`${site.brand.name} Twitch live stream`} allowFullScreen /></div>
          <div className="twitch-meta-card"><small className="live-state">Live Soon / Offline</small><strong>Live Gameplay & Community Streams</strong><span>Follow on Twitch for live alerts, community streams, and the latest gaming sessions.</span><a href={site.socials.twitch} target="_blank" rel="noreferrer">Follow on Twitch</a></div>
        </EditableSection>

        <EditableSection as="article" sectionId="home.youtube" label="YouTube panel" policy={site.editorPolicy} defaultOrder={50} className="panel youtube-panel">
          <div className="youtube-panel-head"><EditableField as="h2" fieldId="home.youtubeTitle" label="YouTube section title" value={site.home.youtubeTitle} policy={site.editorPolicy}><img src={youtubeIcon} alt="" />{site.home.youtubeTitle}</EditableField><a href={site.socials.youtube} target="_blank" rel="noreferrer">View all videos →</a></div>
          <YouTubeFeed />
        </EditableSection>
      </div>

      <EditableSection sectionId="home.socials" label="Social links section" policy={site.editorPolicy} defaultOrder={60} className="socials-panel panel">
        <EditableField as="h2" fieldId="home.socialsTitle" label="Social section title" value={site.home.socialsTitle} policy={site.editorPolicy} />
        <div className="socials-grid">{socialLinks.map(([icon, title, handle, url]) => <a className="social-card" href={url} target="_blank" rel="noreferrer" key={title} aria-label={`Open ${site.brand.name} ${title}`}><img src={icon} alt="" /><strong className="social-handle">{handle}</strong></a>)}</div>
      </EditableSection>

      <EditableSection sectionId="home.expect" label="What to expect section" policy={site.editorPolicy} defaultOrder={70} className="expect-panel panel">
        <EditableField as="h2" fieldId="home.expectTitle" label="What to expect title" value={site.home.expectTitle} policy={site.editorPolicy} />
        <div className="expect-grid">{expectCards.map(([icon, title, text]) => <article className="expect-card" key={title}><img src={icon} alt="" /><strong>{title}</strong><p>{text}</p></article>)}</div>
      </EditableSection>

      <EditableSection sectionId="home.merch" label="Merch section" policy={site.editorPolicy} defaultOrder={80} className="merch-panel">
        <div className="merch-card"><div className="merch-content"><span className="merch-eyebrow">Coming Soon</span><EditableField as="h2" fieldId="home.merchTitle" label="Merch section title" value={site.home.merchTitle} policy={site.editorPolicy} /><EditableField as="p" fieldId="home.merchText" label="Merch section text" value={site.home.merchText} policy={site.editorPolicy} kind="textarea" /><div className="merch-actions"><Link to="/merch" className="btn primary">View Merch</Link></div></div></div>
      </EditableSection>
    </main>
  )
}
