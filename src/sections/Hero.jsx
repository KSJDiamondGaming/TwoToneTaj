import heroDragon from '../assets/hero-dragon.png'

export default function Hero() {
  return (
    <section className="tt-hero">
      <div className="tt-hero-copy">
        <p className="eyebrow">Average Gamer. Legendary Vibes.</p>
        <h1>TwoToneTaj</h1>
        <div className="hero-est">Est. 1989</div>

        <p>
          Welcome to the lair! I’m TwoToneTaj — an average gamer with a passion
          for epic games, good laughs, and an awesome community.
        </p>

        <div className="hero-actions">
          <a className="btn primary" href="https://www.twitch.tv/twotonetaj">
            Watch Live
          </a>
          <a className="btn ghost" href="https://www.youtube.com/@TwoToneTaj">
            Latest Video
          </a>
        </div>
      </div>

      <img className="hero-banner-dragon" src={heroDragon} alt="TwoToneTaj dragon banner" />
    </section>
  )
}