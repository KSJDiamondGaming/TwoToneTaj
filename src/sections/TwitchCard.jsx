export default function TwitchCard() {
  return (
    <article className="panel twitch-panel">
      <h2>Live on Twitch</h2>

      <iframe
        src="https://player.twitch.tv/?channel=twotonetaj&parent=localhost&parent=twotonetaj.ksjdigital.co.uk"
        title="TwoToneTaj Twitch Stream"
        allowFullScreen
      />

      <div className="stream-meta">
        <strong>Live Gameplay & Good Vibes!</strong>
        <span>Playing Warzone</span>
      </div>
    </article>
  )
}
