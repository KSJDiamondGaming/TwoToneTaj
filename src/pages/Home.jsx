import { Link } from 'react-router-dom'
import YouTubeFeed from '../components/YouTubeFeed'

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

const twitchUrl = 'https://www.twitch.tv/twotonetaj'
const youtubeUrl = 'https://www.youtube.com/@twotonetaj'
const tiktokUrl = 'https://www.tiktok.com/@twotonetaj'
const kickUrl = 'https://kick.com/twotonetaj'
const instagramUrl = 'https://www.instagram.com/twotonetaj'

const twitchEmbedUrl =
  'https://player.twitch.tv/?channel=twotonetaj&parent=twotonetaj.ksjdigital.co.uk&parent=localhost&muted=true'

const streamSchedule = [
  ['Mon', '7:00 PM - 11:00 PM'],
  ['Tue', '7:00 PM - 11:00 PM'],
  ['Wed', 'Offline'],
  ['Thu', '7:00 PM - 11:00 PM'],
  ['Fri', '7:00 PM - 12:00 AM'],
  ['Sat', '12:00 PM - 12:00 AM'],
  ['Sun', '12:00 PM - 10:00 PM'],
]

const socialLinks = [
  [twitchIcon, 'Twitch', 'TwoToneTaj', twitchUrl],
  [tiktokIcon, 'TikTok', 'TwoToneTaj', tiktokUrl],
  [youtubeIcon, 'YouTube', 'TwoToneTaj', youtubeUrl],
  [kIcon, 'Kick', 'TwoToneTaj', kickUrl],
  [instaIcon, 'Instagram', 'TwoToneTaj', instagramUrl],
]

const expectCards = [
  [controllerIcon, 'Live Streams', 'Join me live on Twitch for gameplay, chaos, and good times.'],
  [playIcon, 'Videos', 'Watch highlights, funny moments, and full gameplay videos.'],
  [peopleIcon, 'Community', 'Join the TajSquad. Good vibes, great people, and memories.'],
  [trophyIcon, 'Competitive Play', 'Grinding ranks and taking on the best. Let’s go!'],
]

export default function Home() {
  return (
    <main className="home">
      {/* 1. HERO */}
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="hero-eyebrow">Average gamer. Legendary vibes.</span>

          <h1>TwoToneTaj</h1>

          <div className="hero-est">Est. 1989</div>

          <p>
            TwoToneTaj, an average gamer with a passion for games, a pure heart,
            good laughs, and an awesome community.
          </p>
        </div>

        <img className="hero-dragon" src={heroDragon} alt="TwoToneTaj dragon" />
      </section>

      {/* 2. MAIN GRID */}
      <section className="home-grid">
        {/* 2.1 ABOUT */}
        <article className="panel about-panel">
          <h2>
            <img src={peopleIcon} alt="" />
            About Me
          </h2>

          <img className="about-image" src={setupImage} alt="TwoToneTaj gaming setup" />

          <p>
            I’ve been gaming since 1989 and I’m here for the fun, the challenge,
            and the community. You’ll find gameplay, chill streams, and plenty of
            unforgettable moments with the TajSquad.
          </p>

          <Link className="about-link" to="/about">
            Learn More
          </Link>
        </article>

        {/* 2.2 SCHEDULE */}
        <article className="panel schedule-panel">
          <h2>
            <img src={playIcon} alt="" />
            Stream Schedule
          </h2>

          <div className="schedule-list">
            {streamSchedule.map(([day, time]) => (
              <p key={day}>
                <strong>{day}</strong>
                <span>{time}</span>
              </p>
            ))}
          </div>

          <div className="schedule-timezone">
            <small>Times shown in</small>
            <strong>GMT</strong>
            <p>Schedule is subject to change. Follow on social media for updates!</p>
          </div>
        </article>

        {/* 2.3 TWITCH */}
        <article className="panel twitch-panel">
          <h2>
            <img src={twitchIcon} alt="" />
            Live on Twitch
          </h2>

          <div className="twitch-preview">
            <iframe
              src={twitchEmbedUrl}
              title="TwoToneTaj Twitch live stream"
              allowFullScreen
            />
          </div>

          <div className="twitch-meta-card">
            <small className="live-state">Live Soon / Offline</small>
            <strong>Live Gameplay & Community Streams</strong>
            <span>
              Follow on Twitch for live alerts, community streams, and the latest gaming sessions.
            </span>

            <a href={twitchUrl} target="_blank" rel="noreferrer">
              Follow on Twitch
            </a>
          </div>
        </article>

        {/* 2.4 YOUTUBE */}
        <article className="panel youtube-panel">
          <div className="youtube-panel-head">
            <h2>
              <img src={youtubeIcon} alt="" />
              Latest YouTube Videos
            </h2>

            <a href={youtubeUrl} target="_blank" rel="noreferrer">
              View all videos →
            </a>
          </div>

          <YouTubeFeed />
        </article>
      </section>

      {/* 3. SOCIALS */}
      <section className="socials-panel panel">
        <h2>Stay Connected</h2>

        <div className="socials-grid">
          {socialLinks.map(([icon, title, handle, url]) => (
            <a
              className="social-card"
              href={url}
              target="_blank"
              rel="noreferrer"
              key={title}
              aria-label={`Open TwoToneTaj ${title}`}
            >
              <img src={icon} alt="" />
              <strong className="social-handle">{handle}</strong>
            </a>
          ))}
        </div>
      </section>

      {/* 4. WHAT TO EXPECT */}
      <section className="expect-panel panel">
        <h2>What to Expect</h2>

        <div className="expect-grid">
          {expectCards.map(([icon, title, text]) => (
            <article className="expect-card" key={title}>
              <img src={icon} alt="" />
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 5. MERCH PREVIEW */}
      <section className="merch-panel">
        <div className="merch-card">
          <div className="merch-content">
            <span className="merch-eyebrow">Coming Soon</span>

            <h2>Official TwoToneTaj Merch</h2>

            <p>
              Hoodies, creator apparel, and exclusive TajSquad merchandise are in development.
            </p>

            <div className="merch-actions">
              <Link to="/merch" className="btn primary">
                View Merch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
