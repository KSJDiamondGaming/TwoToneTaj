export default function Content() {
  return (
    <main className="page content-page">
      <section className="content-hero page-panel">
        <p className="eyebrow">Videos • Streams • Clips</p>
        <h1>Content</h1>
        <p>
          Latest uploads, stream highlights, shorts, funny moments and creator projects will live here.
          Follow the official channels for the newest TwoToneTaj content while the full live feeds are being built.
        </p>
      </section>

      <section className="content-grid" aria-label="TwoToneTaj content areas">
        <article className="page-panel content-card">
          <span>▶</span>
          <h2>YouTube</h2>
          <p>Latest videos, gameplay highlights, shorts and community moments.</p>
          <a href="https://www.youtube.com/@twotonetaj" target="_blank" rel="noreferrer">
            Open YouTube
          </a>
        </article>

        <article className="page-panel content-card">
          <span>☂</span>
          <h2>Twitch</h2>
          <p>Live streams, chilled sessions, gameplay chaos and TajSquad chat.</p>
          <a href="https://www.twitch.tv/twotonetaj" target="_blank" rel="noreferrer">
            Open Twitch
          </a>
        </article>

        <article className="page-panel content-card">
          <span>♛</span>
          <h2>Clips</h2>
          <p>Short-form content, funny moments and quick updates across socials.</p>
          <a href="https://linktr.ee/Twotonetaj" target="_blank" rel="noreferrer">
            View Links
          </a>
        </article>
      </section>
    </main>
  )
}
