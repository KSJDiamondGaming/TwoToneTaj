import { useEffect, useMemo, useState } from 'react'
import { getYouTubeFeedUrl } from '../config/siteConfig'
import { useManagedSite } from '../hooks/useManagedSite'

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
  const { site } = useManagedSite()
  const fallbackVideos = useMemo(
    () => [
      {
        id: 'fallback-1',
        title: `Latest ${site.brand.name} Upload`,
        url: site.socials.youtube,
        thumbnail: null,
        meta: 'Feed loading / coming soon',
        label: 'Latest',
      },
      {
        id: 'fallback-2',
        title: 'Gameplay Highlights',
        url: site.socials.youtube,
        thumbnail: null,
        meta: 'YouTube channel',
        label: 'Video',
      },
      {
        id: 'fallback-3',
        title: 'Funny Moments & Shorts',
        url: site.socials.youtube,
        thumbnail: null,
        meta: 'YouTube channel',
        label: 'Shorts',
      },
      {
        id: 'fallback-4',
        title: `${site.brand.communityName} Community Clips`,
        url: site.socials.youtube,
        thumbnail: null,
        meta: 'YouTube channel',
        label: 'Clips',
      },
    ],
    [site.brand.communityName, site.brand.name, site.socials.youtube],
  )
  const [videos, setVideos] = useState(fallbackVideos)

  useEffect(() => {
    setVideos(fallbackVideos)
  }, [fallbackVideos])

  useEffect(() => {
    async function loadVideos() {
      try {
        const rssUrl = getYouTubeFeedUrl(site.platforms.youtubeChannelId)
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`
        const response = await fetch(proxyUrl)

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
          const link = entry.querySelector('link')?.getAttribute('href') || site.socials.youtube
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
  }, [site.platforms.youtubeChannelId, site.socials.youtube])

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
