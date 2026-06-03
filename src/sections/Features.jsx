const features = [
  ['🎮', 'Live Streams', 'Join me live on Twitch for daily gameplay, chaos and good times.'],
  ['▶', 'Videos', 'Watch highlights, funny moments and full gameplay videos.'],
  ['👥', 'Community', 'Join the TajSquad. Good vibes, great people and memories.'],
  ['🏆', 'Competitive Play', 'Grinding ranks and taking on the best. Let’s go!'],
]

export default function Features() {
  return (
    <section className="features">
      <h2>What To Expect</h2>

      <div className="feature-grid">
        {features.map(([icon, title, text]) => (
          <article className="feature-card" key={title}>
            <div className="feature-icon">{icon}</div>
            <strong>{title}</strong>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
