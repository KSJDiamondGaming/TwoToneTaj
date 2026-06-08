import { useRef, useState } from 'react'
import '../styles/MiniPlayer.css'

export default function AudioControls() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.35)
  const [trackIndex, setTrackIndex] = useState(0)

  const tracks = [
    {
      title: 'TwoToneTaj Radio',
      artist: 'Coming Soon',
      src: '',
    },
  ]

  const currentTrack = tracks[trackIndex]
  const hasTrack = Boolean(currentTrack?.src)

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
    setIsPlaying(false)
  }

  const changeTrack = (direction) => {
    if (tracks.length <= 1) return

    const nextIndex =
      direction === 'next'
        ? (trackIndex + 1) % tracks.length
        : (trackIndex - 1 + tracks.length) % tracks.length

    setTrackIndex(nextIndex)
    setIsPlaying(false)
  }

  const handleVolumeChange = (event) => {
    const nextVolume = Number(event.target.value)
    setVolume(nextVolume)

    if (audioRef.current) {
      audioRef.current.volume = nextVolume
    }
  }

  return (
    <aside className="mini-player" aria-label="TwoToneTaj mini audio player">
      {hasTrack && <audio ref={audioRef} src={currentTrack.src} preload="metadata" />}

      <div className="mini-player__status">
        <span className="mini-player__pulse" aria-hidden="true" />
        <div>
          <p className="mini-player__eyebrow">Taj Radio</p>
          <h2>{currentTrack.title}</h2>
          <p>{currentTrack.artist}</p>
        </div>
      </div>

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

      <label className="mini-player__volume">
        <span>Vol</span>
        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} disabled={!hasTrack} />
      </label>

      {!hasTrack && <p className="mini-player__note">Audio coming soon</p>}
    </aside>
  )
}
