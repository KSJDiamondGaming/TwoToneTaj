import { useEffect, useMemo, useState } from 'react'

import logo from '../assets/logo.png'

const DISCORD_INVITE_CODE = 'WcbtQPuByd'
const DISCORD_URL = `https://discord.gg/${DISCORD_INVITE_CODE}`
const DISCORD_INVITE_API = `https://discord.com/api/v10/invites/${DISCORD_INVITE_CODE}?with_counts=true&with_expiration=true`
const COMMUNITY_API_URL = import.meta.env.VITE_COMMUNITY_API_URL
  || 'https://goliath.ksjdigital.co.uk/api/public/community/twotonetaj'

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

function formatDate(value) {
  if (!value) return 'Date coming soon'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Date coming soon'

  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export default function Community() {
  const [communityData, setCommunityData] = useState(null)
  const [discordData, setDiscordData] = useState(null)
  const [dataState, setDataState] = useState('loading')
  const [dataSource, setDataSource] = useState('checking')

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    async function loadCommunityData() {
      try {
        const response = await fetch(COMMUNITY_API_URL, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        })

        if (!response.ok) {
          throw new Error(`Goliath community request failed: ${response.status}`)
        }

        const data = await response.json()
        if (!data?.ok || !data?.community) {
          throw new Error('Goliath returned an invalid community payload')
        }

        if (isMounted) {
          setCommunityData(data)
          setDataState('live')
          setDataSource('goliath')
        }
        return
      } catch (error) {
        if (error.name === 'AbortError') return
        console.warn('Goliath community data unavailable:', error)
      }

      try {
        const response = await fetch(DISCORD_INVITE_API, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Discord invite request failed: ${response.status}`)
        }

        const data = await response.json()
        if (isMounted) {
          setDiscordData(data)
          setDataState('live')
          setDataSource('discord')
        }
      } catch (error) {
        if (error.name === 'AbortError') return
        console.warn('Discord community data unavailable:', error)

        if (isMounted) {
          setDataState('fallback')
          setDataSource('fallback')
        }
      }
    }

    loadCommunityData()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  const community = communityData?.community
  const events = communityData?.events || []
  const announcements = communityData?.announcements || []
  const guild = discordData?.guild

  const serverName = community?.name || guild?.name || fallbackStats.serverName
  const serverIcon = community?.iconUrl || logo
  const inviteUrl = community?.inviteUrl || DISCORD_URL

  const stats = useMemo(() => {
    const memberCount = community?.memberCount ?? discordData?.approximate_member_count
    const onlineCount = community?.onlineCount ?? discordData?.approximate_presence_count

    return [
      ['Community', serverName, dataSource === 'goliath' ? 'Live from Goliath' : dataSource === 'discord' ? 'Public Discord invite data' : 'Discord hub ready'],
      ['Members', memberCount ? formatNumber(memberCount) : fallbackStats.members, dataSource === 'goliath' ? `${formatNumber(community?.humanMemberCount || memberCount)} community members` : 'Approx. public invite count'],
      ['Online', onlineCount ? formatNumber(onlineCount) : fallbackStats.online, onlineCount ? 'Active right now' : 'Exact presence sync coming soon'],
      ['Boosts', typeof community?.boostCount === 'number' ? formatNumber(community.boostCount) : '—', community ? `Server boost level ${community.boostTier || 0}` : 'Available through Goliath'],
      ['Channels', typeof community?.channelCount === 'number' ? formatNumber(community.channelCount) : '—', community ? `${formatNumber(community.roleCount || 0)} community roles` : 'Available through Goliath'],
      ['Status', dataState === 'loading' ? 'Checking...' : dataState === 'live' ? 'Live Data' : fallbackStats.status, dataSource === 'goliath' ? 'Secure Goliath API connected' : dataSource === 'discord' ? 'Discord fallback connected' : 'Fallback mode active'],
    ]
  }, [community, dataSource, dataState, discordData, serverName])

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
            <a className="btn primary" href={inviteUrl} target="_blank" rel="noopener noreferrer">
              Join TajSquad
            </a>
            <a className="btn ghost" href="#community-live">
              View Community
            </a>
          </div>
        </div>

        <aside className="community-discord-card" aria-label="Discord invite card">
          <div className="community-card-glow" />
          <img src={serverIcon} alt={`${serverName} icon`} />
          <span>{dataSource === 'goliath' ? 'Goliath Connected' : dataState === 'live' ? 'Discord Connected' : 'Discord Ready'}</span>
          <strong>{serverName}</strong>
          <p>{community?.description || 'Join the official community for streams, clips, gaming, updates and TajSquad moments.'}</p>
          <a href={inviteUrl} target="_blank" rel="noopener noreferrer">
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
          <span className="eyebrow">Live Community Feed</span>
          <h2>{dataSource === 'goliath' ? 'Powered By Goliath' : 'Discord Data Connected'}</h2>
          <p>
            {dataSource === 'goliath'
              ? 'Secure live stats, Discord events and announcements are supplied by the Goliath bot without exposing private credentials.'
              : 'Public Discord invite data is active. Goliath will automatically take over when the live community API is available.'}
          </p>
          {communityData?.meta?.generatedAt && (
            <small className="community-updated-at">Updated {formatDate(communityData.meta.generatedAt)}</small>
          )}
        </div>

        <div className="community-live-grid">
          <article className="community-live-panel">
            <div className="community-live-panel-head">
              <span>📅</span>
              <div>
                <strong>Upcoming Events</strong>
                <small>{events.length ? `${events.length} scheduled` : 'No public events yet'}</small>
              </div>
            </div>

            <div className="community-feed-list">
              {events.length ? events.map((event) => (
                <article key={event.id}>
                  <strong>{event.name}</strong>
                  <span>{formatDate(event.scheduledStartAt)}</span>
                  {event.description && <p>{event.description}</p>}
                </article>
              )) : (
                <p className="community-feed-empty">Community nights and scheduled Discord events will appear here automatically.</p>
              )}
            </div>
          </article>

          <article className="community-live-panel">
            <div className="community-live-panel-head">
              <span>📣</span>
              <div>
                <strong>Latest Announcements</strong>
                <small>{announcements.length ? `${announcements.length} recent updates` : 'Feed ready'}</small>
              </div>
            </div>

            <div className="community-feed-list">
              {announcements.length ? announcements.map((announcement) => (
                <article key={announcement.id}>
                  <strong>{announcement.title}</strong>
                  <span>{formatDate(announcement.createdAt)}</span>
                  {announcement.content && <p>{announcement.content}</p>}
                </article>
              )) : (
                <p className="community-feed-empty">Latest Discord announcements will appear here when the announcement channel is configured.</p>
              )}
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
