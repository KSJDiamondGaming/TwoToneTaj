import Hero from '../sections/Hero'
import TwitchCard from '../sections/TwitchCard'
import YouTubeCard from '../sections/YouTubeCard'
import ScheduleCard from '../sections/ScheduleCard'
import AboutCard from '../sections/AboutCard'
import Features from '../sections/Features'
import Socials from '../sections/Socials'

export default function Home() {
  return (
    <main className="home">
      <Hero />

      <section className="home-grid">
        <TwitchCard />
        <YouTubeCard />
        <ScheduleCard />
        <AboutCard />
      </section>

      <section className="bottom-grid">
        <Features />
        <Socials />
      </section>
    </main>
  )
}