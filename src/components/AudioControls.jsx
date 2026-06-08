import { useRef, useState } from 'react'
import '../styles/MiniPlayer.css'

// Drop MP3/audio files into: public/assets/tracks/
// Then add them below using src: '/assets/tracks/your-file-name.mp3'
const tracks = [
  // Example:
  // {
  //   title: 'Taj Radio 01',
  //   src: '/assets/tracks/taj-radio-01.mp3',
  // },
]

export default function AudioControls() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [volume, setVolume] = useState(0.35)
  const [trackIndex, setTrackIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  const currentTrack = tracks[trackIndex]
  const hasTrack = Boolean(currentTrack?.src)
  const trackTitle = hasTrack ? currentTrack.title : 'No track loaded'

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

    const nextIndex =
      direction === 'next'
        ? (trackIndex + 1) % tracks.length
        : (trackIndex - 1 + tracks.length) % tracks.length

    setTrackIndex(nextIndex)
    setProgress(0)
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
    <aside className={`mini-player${isMinimized ? ' mini-player--minimized' : ''}`} aria-label="TwoToneTaj mini audio player">
      {hasTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.src}
          preload="metadata"
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
          onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime || 0)}
          onEnded={() => setIsPlaying(false)}
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
          <div className="mini-player__controls">
            <button type="button" onClick={() => changeTrack('previous')} disabled={tracks.length <= 1} aria-label="Previous track">
              ⏮
            </button>
            <button type="button" className="mini-player__play" onClick={togglePlay} disabled={!hasTrack} aria-label={isPlaying ? 'Pause audio' : 'Play audio'}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button type="button" onClick={stopAudio} disabled={!hasTrack} aria-label="Stop audio">
              ⏹
            </button>
            <button type="button" onClick={() => changeTrack('next')} disabled={tracks.length <= 1} aria-label="Next track">
              ⏭
            </button>
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
