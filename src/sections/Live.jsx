import Section from '../components/Section'

export default function Live() {
  return (
    <Section id="live" title="Live & Videos">
      <div className="embed-grid">
        <iframe
          src="https://player.twitch.tv/?channel=twotonetaj&parent=localhost&parent=twotonetaj.ksjdigital.co.uk"
          title="TwoToneTaj Twitch"
          allowFullScreen
        />

        <iframe
          src="https://www.youtube.com/embed?listType=user_uploads&list=TwoToneTaj"
          title="TwoToneTaj YouTube"
          allowFullScreen
        />
      </div>
    </Section>
  )
}