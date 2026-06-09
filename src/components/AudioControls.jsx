import { useEffect, useRef, useState } from 'react'
import '../styles/player.css'

const trackModules = import.meta.glob('../assets/tracks/*.{mp3,wav,ogg,m4a}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const formatTrackTitle = (path) => {
  const fileName = path.split('/').pop() || 'Untitled Track'
  const titleWithoutExtension = fileName.replace(/\.[^/.]+$/, '')

  return titleWithoutExtension
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

const tracks = Object.entries(trackModules)
  .map(([path, src]) => ({
    title: formatTrackTitle(path),
    src,
  }))
  .sort((a, b) => a.title.localeCompare(b.title))

const DEFAULT_POSITION = { x: 555, y: 82 }
const STORAGE_KEY = 'twotonetaj-mini-player-position'

export default function AudioControls() {
  const audioRef = useRef(null)
  const playerRef = useRef(null)
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, originX: 0, originY: 0 })

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState(DEFAULT_POSITION)
  const [volume, setVolume] = useState(0.35)
  const [trackIndex, setTrackIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  const currentTrack = tracks[trackIndex]
  const hasTrack = Boolean(currentTrack?.src)
  const trackTitle = hasTrack ? currentTrack.title : 'No track loaded'

  useEffect(() => {
    const savedPosition = window.localStorage.getItem(STORAGE_KEY)
    if (!savedPosition) return

    try {
      const parsedPosition = JSON.parse(savedPosition)
      if (Number.isFinite(parsedPosition.x) && Number.isFinite(parsedPosition.y)) {
        setPosition(parsedPosition)
      }
    } catch (error) {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    setTrackIndex((currentIndex) => Math.min(currentIndex, Math.max(tracks.length - 1, 0)))
  }, [])

  const clampPosition = (nextX, nextY) => {
    const player = playerRef.current
    const playerWidth = player?.offsetWidth || 245
    const playerHeight = player?.offsetHeight || 120
    const padding = 8

    return {
      x: Math.min(Math.max(padding, nextX), Math.max(padding, window.innerWidth - playerWidth - padding)),
      y: Math.min(Math.max(padding, nextY), Math.max(padding, window.innerHeight - playerHeight - padding)),
    }
  }

  const savePosition = (nextPosition) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPosition))
  }

  const startDrag = (event) => {
    if (event.target.closest('button, input, label')) return

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)

    dragRef.current = {
      isDragging: true,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
    }

    setIsDragging(true)
  }

  const moveDrag = (event) => {
    if (!dragRef.current.isDragging) return

    setPosition(
      clampPosition(
        dragRef.current.originX + event.clientX - dragRef.current.startX,
        dragRef.current.originY + event.clientY - dragRef.current.startY,
      ),
    )
  }

  const endDrag = (event) => {
    if (!dragRef.current.isDragging) return

    const finalPosition = clampPosition(position.x, position.y)
    dragRef.current.isDragging = false
    setPosition(finalPosition)
    setIsDragging(false)
    savePosition(finalPosition)

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const resetPosition = () => {
    setPosition(DEFAULT_POSITION)
    savePosition(DEFAULT_POSITION)
  }

  const togglePlay = async () => {
    if (!hasTrack || !audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
        return
      }

      audioRef.current.volume = volume
      await audioRef.current.play()
      setIsPlaying(true)
    } catch (error) {
      console.warn('Audio playback failed:', error)
      setIsPlaying(false)
    }
  }

  const stopAudio = () => {
    if (!audioRef.current) return

    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setProgress(0)
    setIsPlaying(false)
  }

  const changeTrack = (direction) => {
    if (tracks.length <= 1) return

    const nextIndex = direction === 'next'
      ? (trackIndex + 1) % tracks.length
      : (trackIndex - 1 + tracks.length) % tracks.length

    setTrackIndex(nextIndex)
    setProgress(0)
    setDuration(0)
    setIsPlaying(false)
  }

  const handleProgressChange = (event) => {
    const nextTime = Number(event.target.value)
    setProgress(nextTime)

    if (audioRef.current) {
      audioRef.current.currentTime = nextTime
    }
  }

  const handleVolumeChange = (event) => {
    const nextVolume = Number(event.target.value)
    setVolume(nextVolume)

    if (audioRef.current) {
      audioRef.current.volume = nextVolume
    }
  }

  return (
    <aside
      ref={playerRef}
      className={`mini-player${isMinimized ? ' mini-player--minimized' : ''}${isDragging ? ' mini-player--dragging' : ''}`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      aria-label="TwoToneTaj mini audio player"
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {hasTrack && (
        <audio
          ref={audioRef}
          key={currentTrack.src}
          src={currentTrack.src}
          preload="metadata"
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
          onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime || 0)}
          onEnded={() => changeTrack('next')}
        />
      )}

      <button
        type="button"
        className="mini-player__minimize"
        onClick={() => setIsMinimized((current) => !current)}
        aria-label={isMinimized ? 'Expand audio player' : 'Minimize audio player'}
        title={isMinimized ? 'Expand player' : 'Minimize player'}
      >
        {isMinimized ? '♫' : '−'}
      </button>

      {!isMinimized && (
        <>
          <div className="mini-player__drag-hint" onDoubleClick={resetPosition}>Drag player</div>

          <div className="mini-player__controls">
            <button type="button" onClick={() => changeTrack('previous')} disabled={tracks.length <= 1} aria-label="Previous track">⏮</button>
            <button type="button" className="mini-player__play" onClick={togglePlay} disabled={!hasTrack} aria-label={isPlaying ? 'Pause audio' : 'Play audio'}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button type="button" onClick={stopAudio} disabled={!hasTrack} aria-label="Stop audio">⏹</button>
            <button type="button" onClick={() => changeTrack('next')} disabled={tracks.length <= 1} aria-label="Next track">⏭</button>
          </div>

          <label className="mini-player__slider">
            <span>Track</span>
            <input
              className="mini-player__progress"
              type="range"
              min="0"
              max={duration || 0}
              step="0.01"
              value={progress}
              onChange={handleProgressChange}
              disabled={!hasTrack}
              aria-label="Track progress"
            />
          </label>

          <label className="mini-player__slider">
            <span>Volume</span>
            <input
              className="mini-player__volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              aria-label="Volume"
            />
          </label>

          <p className="mini-player__track">{trackTitle}</p>
        </>
      )}
    </aside>
  )
}
