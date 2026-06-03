import Section from '../components/Section'
import Card from '../components/Card'
import { socials } from '../data/socials'

export default function Links() {
  return (
    <Section id="links" title="Links">
      <div className="card-grid">
        {socials.map((item) => (
          <Card key={item.title} {...item} />
        ))}
      </div>
    </Section>
  )
}