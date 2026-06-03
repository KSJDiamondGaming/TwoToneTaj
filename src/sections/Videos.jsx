const videos = [
  ['Victory', 'Latest TwoToneTaj Upload', '2.4K views • 3 days ago'],
  ['Funny', 'Funniest Moments with the Squad!', '1.8K views • 6 days ago'],
  ['Ranked', 'Ranked Grind to Diamond', '2.1K views • 1 week ago'],
]

export default function YouTubeCard() {
  return (
    <article className="panel youtube-panel">
      <div className="panel-head">
        <h2>Latest YouTube Videos</h2>
        <a href="https://www.youtube.com/@TwoToneTaj">View all videos →</a>
      </div>

      <div className="video-list">
        {videos.map(([tag, title, meta]) => (
          <a href="https://www.youtube.com/@TwoToneTaj" className="video-row" key={title}>
            <div className="video-thumb">{tag}</div>
            <div>
              <strong>{title}</strong>
              <span>{meta}</span>
            </div>
          </a>
        ))}
      </div>
    </article>
  )
}