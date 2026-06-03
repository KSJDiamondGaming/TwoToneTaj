import { schedule } from '../data/schedule'

export default function ScheduleCard() {
  return (
    <article className="panel schedule-panel">
      <h2>Stream Schedule</h2>

      <div className="schedule-list">
        {schedule.map((row) => (
          <p key={row.day}>
            <strong>{row.day}</strong>
            <span>{row.time}</span>
          </p>
        ))}
      </div>

      <div className="timezone">
        <small>Times shown in</small>
        <strong>GMT</strong>
        <p>Schedule is subject to change. Follow socials for updates.</p>
      </div>
    </article>
  )
}
