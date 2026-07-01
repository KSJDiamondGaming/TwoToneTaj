import { useEffect, useMemo, useState } from 'react'

import logo from '../assets/logo.png'

const DISCORD_INVITE_CODE = 'WcbtQPuByd'
const DISCORD_URL = `https://discord.gg/${DISCORD_INVITE_CODE}`
const DISCORD_INVITE_API = `https://discord.com/api/v10/invites/${DISCORD_INVITE_CODE}?with_counts=true&with_expiration=true`

const fallbackStats = {
  members: 'TajSquad',
  online: 'Live Soon',
  serverName: 'TajSquad Community',
  status: 'Community Hub',
}

const communityAreas = [
  ['📣', 'Announcements', 'Official updates, stream alerts, community notices, and important TajSquad news.'],
  ['🎮', 'Gaming Chat', 'Talk games, squads, wins, losses, funny moments, clips, and whatever chaos happens next.'],
  ['🎥', 'Stream Alerts', 'Know when TwoToneTaj goes live, catch updates, and jump in when the stream starts.'],
  ['🎧', 'Voice Hangouts', 'Chill in voice, group up, laugh, relax, and be part of the community outside the stream.'],
  ['💚', 'Good Vibes', 'A community built around laughs, support, respect, and people who make gaming better.'],
  ['🛡️', 'Safe Community', 'Clear expectations, staff support, and a community-first approach to keeping things clean.'],
]

const communityValues = [
  ['Respect First', 'No drama, no hate, no unnecessary toxicity. Good people make good communities.'],
  ['Laugh Together', 'The heart of TajSquad is fun, humour, streams, clips, jokes, and unforgettable moments.'],
  ['Support The Squad', 'Help each other, welcome new members, and keep the community feeling alive.'],
  ['Protect The Vibe', 'Staff guidance, fair rules, and common sense keep the Discord enjoyable for everyone.'],
]

function formatNumber(value) {
  if (typeof value !== 'number') return value
  return new Intl.NumberFormat('en-GB').format(value)
}

export default function Community() {
  const [discordData, setDiscordData] = useState(null)
  const [dataState, setDataState] = useState('loading')

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    async function loadDiscordInvite() {
      try {
        const response = await fetch(DISCORD_INVITE_API, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Discord invite request failed: ${response.status}`)
        }

        const data = await response.json()

        if (isMounted) {
          setDiscordData(data)
          setDataState('live')
        }
      } catch (error) {
        if (error.name === 'AbortError') return
        console.warn('Discord community data unavailable:', error)

        if (isMounted) {
          setDataState('fallback')
        }
      }
    }

    loadDiscordInvite()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  const guild = discordData?.guild
  const serverName = guild?.name || fallbackStats.serverName

  const stats = useMemo(() => {
    const memberCount = discordData?.approximate_member_count
    const onlineCount = discordData?.approximate_presence_count

    return [
      ['Community', serverName, dataState === 'live' ? 'Official Discord invite data' : 'Discord hub ready'],
      ['Members', memberCount ? formatNumber(memberCount) : fallbackStats.members, dataState === 'live' ? 'Approximate public member count' : 'Join the growing TajSquad'],
      ['Online', onlineCount ? formatNumber(onlineCount) : fallbackStats.online, dataState === 'live' ? 'Approximate members active now' : 'Community activity coming soon'],
      ['Status', dataState === 'loading' ? 'Checking...' : dataState === 'live' ? 'Connected' : fallbackStats.status, dataState === 'live' ? 'Discord invite data is live' : 'Join through the official invite'],
    ]
  }, [dataState, discordData, serverName])

  return (
    <main className="community-page">
      <section className="community-hero">
        <div className="community-hero-copy">
          <span className="eyebrow">Official Discord Community</span>
          <h1>
            TajSquad
            <span>Community</span>
          </h1>
          <p>
            The home of TwoToneTaj — good games, good laughs, stream alerts, clips, voice hangouts,
            community nights and the people who make the whole thing worth building.
          </p>

          <div className="community-hero-actions">
            <a className="btn primary" href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
              Join TajSquad
            </a>
            <a className="btn ghost" href="#community-live">
              View Community
            </a>
          </div>
        </div>

        <aside className="community-discord-card" aria-label="Discord invite card">
          <div className="community-card-glow" />
          <img src={logo} alt="TwoToneTaj logo" />
          <span>{dataState === 'live' ? 'Discord Connected' : 'Discord Ready'}</span>
          <strong>{serverName}</strong>
          <p>Join the official community for streams, clips, gaming, updates and TajSquad moments.</p>
          <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
            Open Discord
          </a>
        </aside>
      </section>

      <section id="community-live" className="community-stats-grid" aria-label="Community live stats">
        {stats.map(([label, value, note]) => (
          <article className="community-stat-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{note}</small>
          </article>
        ))}
      </section>

      <section className="community-dashboard-panel">
        <div>
          <span className="eyebrow">Community Updates</span>
          <h2>The Discord Is The Heart Of TajSquad</h2>
          <p>
            The website currently shows the public member and online counts supplied by Discord. Events,
            announcements and deeper community updates will be added only when a dedicated TwoToneTaj service is ready.
          </p>
        </div>

        <div className="community-live-grid">
          <article className="community-live-panel">
            <div className="community-live-panel-head">
              <span>📅</span>
              <div>
                <strong>Community Events</strong>
                <small>Planned feature</small>
              </div>
            </div>

            <div className="community-feed-list">
              <p className="community-feed-empty">
                Community nights, game sessions and special Discord events will appear here when the event feed launches.
              </p>
            </div>
          </article>

          <article className="community-live-panel">
            <div className="community-live-panel-head">
              <span>📣</span>
              <div>
                <strong>Latest Announcements</strong>
                <small>Planned feature</small>
              </div>
            </div>

            <div className="community-feed-list">
              <p className="community-feed-empty">
                Important TajSquad announcements will appear here automatically once the dedicated community feed is ready.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="community-section-head">
        <span className="eyebrow">Inside The Discord</span>
        <h2>Everything TajSquad Needs</h2>
        <p>One community hub for streams, chat, gaming, clips, voice, updates and good people.</p>
      </section>

      <section className="community-area-grid" aria-label="Community areas">
        {communityAreas.map(([icon, title, text]) => (
          <article className="community-area-card" key={title}>
            <span>{icon}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="community-values-panel">
        <div className="community-values-copy">
          <span className="eyebrow">Community Standards</span>
          <h2>Protect The Vibe</h2>
          <p>
            TajSquad is built around laughs, respect, support and proper community energy. The goal is simple:
            make the Discord feel like somewhere people actually want to be.
          </p>
        </div>

        <div className="community-values-list">
          {communityValues.map(([title, text]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
