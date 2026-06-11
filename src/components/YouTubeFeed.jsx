import { useEffect, useState } from 'react'

const CHANNEL_ID = 'UC54tVexRR4IXeXpzg2Dq1UA'
const CHANNEL_URL = 'https://www.youtube.com/@twotonetaj'
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
const PROXY_URL = `https://api.allorigins.win/raw?url=${encodeURIComponent(RSS_URL)}`

const fallbackVideos = [
  {
    id: 'fallback-1',
    title: 'Latest TwoToneTaj Upload',
    url: CHANNEL_URL,
    thumbnail: null,
    meta: 'Feed loading / coming soon',
    label: 'Latest',
  },
  {
    id: 'fallback-2',
    title: 'Gameplay Highlights',
    url: CHANNEL_URL,
    thumbnail: null,
    meta: 'YouTube channel',
    label: 'Video',
  },
  {
    id: 'fallback-3',
    title: 'Funny Moments & Shorts',
    url: CHANNEL_URL,
    thumbnail: null,
    meta: 'YouTube channel',
    label: 'Shorts',
  },
  {
    id: 'fallback-4',
    title: 'TajSquad Community Clips',
    url: CHANNEL_URL,
    thumbnail: null,
    meta: 'YouTube channel',
    label: 'Clips',
  },
]

function getVideoId(entry) {
  return (
    entry.querySelector('yt\\:videoId')?.textContent ||
    entry.querySelector('videoId')?.textContent ||
    ''
  )
}

function makeThumbnailUrl(videoId) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

function formatDate(dateText) {
  if (!dateText) return 'Latest upload'

  return `Published ${new Date(dateText).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })}`
}

export default function YouTubeFeed() {
  const [videos, setVideos] = useState(fallbackVideos)

  useEffect(() => {
    async function loadVideos() {
      try {
        const response = await fetch(PROXY_URL)

        if (!response.ok) {
          throw new Error(`YouTube RSS failed: ${response.status}`)
        }

        const xmlText = await response.text()

        const parser = new DOMParser()
        const xml = parser.parseFromString(xmlText, 'application/xml')
        const entries = Array.from(xml.querySelectorAll('entry')).slice(0, 4)

        if (!entries.length) return

        const nextVideos = entries.map((entry) => {
          const videoId = getVideoId(entry)
          const title = entry.querySelector('title')?.textContent || 'Latest YouTube Video'
          const link = entry.querySelector('link')?.getAttribute('href') || CHANNEL_URL
          const published = entry.querySelector('published')?.textContent

          return {
            id: videoId || title,
            title,
            url: link,
            thumbnail: videoId ? makeThumbnailUrl(videoId) : null,
            meta: formatDate(published),
            label: title.toLowerCase().includes('#shorts') ? 'Short' : 'Video',
          }
        })

        setVideos(nextVideos)
      } catch (error) {
        console.warn('YouTube feed failed:', error)
      }
    }

    loadVideos()
  }, [])

  return (
    <div className="youtube-grid">
      {videos.map((video) => (
        <a
          className="youtube-card"
          href={video.url}
          target="_blank"
          rel="noreferrer"
          key={video.id}
        >
          <div
            className="youtube-thumb"
            style={
              video.thumbnail
                ? {
                    backgroundImage: `url(${video.thumbnail})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : undefined
            }
          >
            <span>{video.label}</span>
          </div>

          <div className="youtube-card-body">
            <strong>{video.title}</strong>
            <small>{video.meta}</small>
          </div>
        </a>
      ))}
    </div>
  )
}
