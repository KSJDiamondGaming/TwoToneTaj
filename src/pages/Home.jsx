import { Link } from 'react-router-dom'

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
// import twitterIcon from '../assets/home/twitter.png'

const videos = [
  {
    image: null,
    tag: 'Victory!',
    title: 'Insane WIN in Warzone!',
    meta: '2.4K views • 3 days ago',
  },
  {
    image: null,
    tag: 'Funny',
    title: 'Funniest Moments with the Squad!',
    meta: '1.8K views • 6 days ago',
  },
  {
    image: null,
    tag: 'Ranked',
    title: 'Ranked Grind to Diamond',
    meta: '2.1K views • 1 week ago',
  },
]

const schedule = [
  ['Mon', '7:00 PM - 11:00 PM'],
  ['Tue', '7:00 PM - 11:00 PM'],
  ['Wed', 'Offline'],
  ['Thu', '7:00 PM - 11:00 PM'],
  ['Fri', '7:00 PM - 12:00 AM'],
  ['Sat', '12:00 PM - 12:00 AM'],
  ['Sun', '12:00 PM - 10:00 PM'],
]

const features = [
  [controllerIcon, 'Live Streams', 'Join me live on Twitch for gameplay, chaos, and good times.'],
  [playIcon, 'Videos', 'Watch highlights, funny moments, and full gameplay videos.'],
  [peopleIcon, 'Community', 'Join the TajSquad. Good vibes, great people, and memories.'],
  [trophyIcon, 'Competitive Play', 'Grinding ranks and taking on the best. Let’s go!'],
]

const socials = [
  [twitchIcon, 'Twitch', '/twotonetaj'],
  [tiktokIcon, 'TikTok', '@twotonetaj'],
  [youtubeIcon, 'YouTube', '/twotonetaj'],
  [kIcon, 'Kick', '/twotonetaj'],
  [instaIcon, 'Instagram', '/twotonetaj'],
  // [twitterIcon, 'Twitter', '/twotonetaj'],
]

export default function Home() {
  return (
    <main className="home">
      <section className="tt-hero">
        <div className="tt-hero-copy">
          <span className="eyebrow">Average gamer. Legendary vibes.</span>

          <h1>TwoToneTaj</h1>

          <div className="hero-est">Est. 1989</div>

          <p>
            Welcome to the lair! I’m TwoToneTaj — an average gamer with a passion
            for epic games, good laughs, and an awesome community.
          </p>

          <div className="hero-actions">
            <a
              className="btn primary"
              href="https://www.twitch.tv/twotonetaj"
              target="_blank"
              rel="noreferrer"
            >
              Watch Live
            </a>

            <a
              className="btn ghost"
              href="https://www.youtube.com"
              target="_blank"
              rel="noreferrer"
            >
              Latest Video
            </a>
          </div>
        </div>

        <img className="hero-banner-dragon" src={heroDragon} alt="TwoToneTaj dragon" />
      </section>

      <section className="home-grid">
        <article className="panel about-panel">
          <h2>
            <img src={peopleIcon} alt="" />
            About Me
          </h2>

          <img className="about-home-image" src={setupImage} alt="TwoToneTaj gaming setup" />

          <p>
            I’ve been gaming since 1989 and I’m here for the fun, the challenge,
            and the community. You’ll find gameplay, chill streams, and plenty of
            unforgettable moments with the TajSquad.
          </p>

          <Link to="/about">Learn More</Link>
        </article>

        <article className="panel schedule-panel">
          <h2>
            <img src={playIcon} alt="" />
            Stream Schedule
          </h2>

          <div className="schedule-list">
            {schedule.map(([day, time]) => (
              <p key={day}>
                <strong>{day}</strong>
                <span>{time}</span>
              </p>
            ))}
          </div>

          <div className="timezone">
            <small>Times shown in</small>
            <strong>GMT</strong>
            <p>Schedule is subject to change. Follow on social media for updates!</p>
          </div>
        </article>

        <article className="panel twitch-panel">
          <h2>
            <img src={twitchIcon} alt="" />
            Live on Twitch
          </h2>

          <div className="twitch-preview">
            <div className="live-badge">● Live</div>
          </div>

          <div className="stream-meta-card">
            <img src={heroDragon} alt="" />

            <div>
              <strong>Live Gameplay & Good Vibes!</strong>
              <span>Playing Warzone</span>
            </div>

            <a href="https://www.twitch.tv/twotonetaj" target="_blank" rel="noreferrer">
              Follow
            </a>
          </div>
        </article>

        <article className="panel youtube-panel">
          <div className="panel-head">
            <h2>
              <img src={youtubeIcon} alt="" />
              Latest YouTube Videos
            </h2>

            <a href="https://www.youtube.com" target="_blank" rel="noreferrer">
              View all videos →
            </a>
          </div>

          <div className="video-list">
            {videos.map((video) => (
              <div className="video-row" key={video.title}>
                <div className="video-thumb">{video.tag}</div>

                <div>
                  <strong>{video.title}</strong>
                  <span>{video.meta}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="home-lower-grid">
        <section className="socials panel">
          <h2>Stay Connected</h2>

          <div className="social-grid">
            {socials.map(([icon, title, text]) => (
              <article className="social" key={title}>
                <img src={icon} alt="" />
                <strong>{title}</strong>
                <small>{text}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="features panel">
          <h2>What to Expect</h2>

          <div className="feature-grid">
            {features.map(([icon, title, text]) => (
              <article className="feature-card" key={title}>
                <img src={icon} alt="" />
                <strong>{title}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="merch-preview-home">
        <div className="merch-home-card">
          <div className="merch-home-content">
            <span className="eyebrow">Coming Soon</span>
            <h2>Official TwoToneTaj Merch</h2>
            <p>Hoodies, creator apparel, and exclusive TajSquad merchandise are in development.</p>

            <div className="merch-home-actions">
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