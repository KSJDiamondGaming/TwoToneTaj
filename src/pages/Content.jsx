import YouTubeFeed from '../components/YouTubeFeed'

const YOUTUBE_URL = 'https://www.youtube.com/@twotonetaj'
const TWITCH_URL = 'https://www.twitch.tv/twotonetaj'
const LINKS_URL = 'https://linktr.ee/Twotonetaj'

const contentPlatforms = [
  {
    icon: '▶',
    title: 'YouTube',
    label: 'Videos & Shorts',
    text: 'Gameplay uploads, stream highlights, funny moments, community clips and creator projects.',
    action: 'Open YouTube',
    url: YOUTUBE_URL,
    tone: 'youtube',
  },
  {
    icon: '◉',
    title: 'Twitch',
    label: 'Live Streams',
    text: 'Chilled sessions, gaming chaos, long streams and live TajSquad conversations.',
    action: 'Open Twitch',
    url: TWITCH_URL,
    tone: 'twitch',
  },
  {
    icon: '✦',
    title: 'Social Clips',
    label: 'Short-Form Content',
    text: 'Quick updates, stream moments and the best clips shared across the official social channels.',
    action: 'View All Links',
    url: LINKS_URL,
    tone: 'social',
  },
]

export default function Content() {
  return (
    <main className="page content-page">
      <section className="content-hero page-panel">
        <div className="content-hero-copy">
          <p className="eyebrow">Videos • Streams • Clips</p>
          <h1>
            Watch The
            <span>Chaos</span>
          </h1>
          <p>
            The home of TwoToneTaj content — gameplay, streams, community moments, shorts and the clips
            that prove the scoreboard was never the most important part.
          </p>

          <div className="content-hero-actions">
            <a className="btn primary" href={YOUTUBE_URL} target="_blank" rel="noreferrer">
              Watch On YouTube
            </a>
            <a className="btn ghost" href={TWITCH_URL} target="_blank" rel="noreferrer">
              Visit Twitch
            </a>
          </div>
        </div>

        <aside className="content-hero-feature" aria-label="TwoToneTaj content overview">
          <span className="content-feature-kicker">TwoToneTaj Content</span>
          <strong>Good Games. Better Laughs.</strong>
          <p>
            Highlights, uploads and live moments built around the people who make gaming worth coming back to.
          </p>
          <div className="content-feature-tags" aria-label="Content types">
            <span>Gameplay</span>
            <span>Streams</span>
            <span>Shorts</span>
            <span>TajSquad</span>
          </div>
        </aside>
      </section>

      <section className="content-section-head">
        <div>
          <p className="eyebrow">Latest From The Channel</p>
          <h2>Recent YouTube Uploads</h2>
          <p>Fresh videos and shorts pulled from the official TwoToneTaj YouTube channel.</p>
        </div>

        <a href={YOUTUBE_URL} target="_blank" rel="noreferrer">
          View Full Channel
        </a>
      </section>

      <section className="content-feed page-panel" aria-label="Latest TwoToneTaj YouTube uploads">
        <YouTubeFeed />
      </section>

      <section className="content-section-head content-platforms-head">
        <div>
          <p className="eyebrow">Follow The Content</p>
          <h2>Choose Your Platform</h2>
          <p>Watch the longer uploads, catch a live stream or find the short-form highlights.</p>
        </div>
      </section>

      <section className="content-grid" aria-label="TwoToneTaj content platforms">
        {contentPlatforms.map((platform) => (
          <article className={`page-panel content-card content-card-${platform.tone}`} key={platform.title}>
            <div>
              <span className="content-card-icon">{platform.icon}</span>
              <small>{platform.label}</small>
              <h3>{platform.title}</h3>
              <p>{platform.text}</p>
            </div>

            <a href={platform.url} target="_blank" rel="noreferrer">
              {platform.action}
            </a>
          </article>
        ))}
      </section>

      <section className="content-footer-panel page-panel">
        <div>
          <p className="eyebrow">The TwoToneTaj Way</p>
          <h2>It’s All About The 💩 And Giggles, Folks.</h2>
          <p>
            No fake perfection. No pretending every match is a masterclass. Just gaming, community and the moments
            worth sharing.
          </p>
        </div>

        <a className="btn primary" href={LINKS_URL} target="_blank" rel="noreferrer">
          Stay Connected
        </a>
      </section>
    </main>
  )
}
