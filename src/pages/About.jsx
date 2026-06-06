import tajAvatar from '../assets/about/taj-avatar.png'
import squad from '../assets/about/squad.png'
import controller from '../assets/about/controller.png'
import microphone from '../assets/about/microphone.png'
import scales from '../assets/about/scales.png'
import crowd from '../assets/about/crowd.png'
import logo from '../assets/logo.png'

export default function About() {
  return (
    <main className="about-page">
      <section className="about-hero-card">
        <div className="about-hero-content">
          <h1>Hey, I&apos;m Taj</h1>

          <p className="about-subtitle">
            Average gamer • Professional scoreboard victim.
          </p>

          <p>
            Welcome to <strong>TwoToneTaj.</strong> A gaming community built on
            laughs, good people, and unforgettable moments.
          </p>

          <p>
            I&apos;m just an average gamer who enjoys
            the banter, friendships, and memories made along the way.
          </p>

          <p className="about-highlight">
            "Gaming was never about the scoreboard for me, It was always about the
            people."
          </p>

          <p className="about-signature">
            <strong>— TAJ </strong>
          </p>
        </div>

        <img className="about-avatar" src={tajAvatar} alt="TwoToneTaj avatar" />
      </section>

      <section className="about-story-grid">
        <article className="about-story-card about-image-card">
          <div className="about-card-copy">
            <h2>🎮 Where It Started</h2>
            <p>
              I came into FPS games late and, honestly, I was terrible. But I
              kept coming back because I loved the people, not the stats.
            </p>
            <p>
              The laughs, late nights, and squad moments mattered more than the
              scoreboard ever did.
            </p>
          </div>

          <img
            className="about-card-art about-card-art-squad"
            src={squad}
            alt="Gaming squad target graphic"
          />
        </article>

        <article className="about-story-card about-image-card">
          <div className="about-card-copy">
            <h2>🌧️ Life Got Heavy</h2>
            <p>
              During difficult chapters, gaming became a way to switch off,
              connect with others, and find a bit of light when I needed it
              most.
            </p>
            <p>
              It gave me somewhere to breathe, laugh, and feel connected again.
            </p>
          </div>

          <img
            className="about-card-art"
            src={controller}
            alt="Gaming controller"
          />
        </article>

        <article className="about-story-card about-image-card">
          <div className="about-card-copy">
            <h2>🎥 Streaming Began</h2>
            <p>
              At first, nobody watched. Most streams felt like I was talking to
              myself, but I kept showing up.
            </p>

            <div className="about-mini-list">
              <span>📹 Uploaded clips</span>
              <span>🎮 Played games</span>
              <span>💬 Talked to chat</span>
              <span>🚀 Kept going</span>
            </div>

            <p>Slowly, things started growing.</p>
          </div>

          <img
            className="about-card-art"
            src={microphone}
            alt="Streaming microphone"
          />
        </article>

        <article className="about-story-card about-image-card">
          <div className="about-card-copy">
            <h2>🔁 Balance Changed Everything</h2>
            <p>
              Eventually, I realised gaming couldn&apos;t solve everything. I
              needed balance.
            </p>

            <div className="about-priority-list">
              <span>💼 Work First</span>
              <span>❤️ Family Second</span>
              <span>🎮 Gaming Third</span>
            </div>

            <p>The moment I found that balance, everything started improving.</p>
          </div>

          <img className="about-card-art" src={scales} alt="Balance scales" />
        </article>

        <article className="about-story-card about-wide-card">
          <img className="about-wide-bg" src={crowd} alt="" aria-hidden="true" />

          <div className="about-card-copy about-wide-copy">
            <h2>💥 The Moment Everything Changed</h2>

            <p>
              One day, <strong>XHubbaxx</strong> dropped into stream, helped me
              improve my setup, and we ran a quick test.
            </p>

            <div className="about-moment-grid">
              <span>🚀 Viewers arrived</span>
              <span>💬 Chat exploded</span>
              <span>🎁 Gifts came in</span>
              <span>🙌 Community came alive</span>
            </div>

            <p>
              What was meant to be a short test became a{' '}
              <strong>12-hour stream</strong>. For the first time in a long
              time, I felt achievement. Not because I was good at the game, but
              because people enjoyed being part of something.
            </p>
          </div>
        </article>

        <article className="about-story-card about-final-card">
          <div className="final-logo">
            <img src={logo} alt="TwoToneTaj logo" />
          </div>

          <div className="final-copy">
            <h2>Welcome to TajSquad</h2>
            <p>
              TwoToneTaj is a place to relax, laugh, unwind, and be yourself. No
              pressure. No drama. Just good people having a good time.
            </p>
            <p>
              <strong>
                Whether you&apos;ve been here since day one or just arrived,
                you&apos;re welcome here.
              </strong>
            </p>
          </div>

          <div className="final-points">
            <span>👥 Good people</span>
            <span>😂 Good laughs</span>
            <span>🎮 Good times</span>
          </div>

          <div className="final-quote">
            <p>Pull up a chair. Grab a drink. Jump into the chat.</p>
            <span>— TAJ 🐉</span>
          </div>
        </article>
      </section>
    </main>
  )
}