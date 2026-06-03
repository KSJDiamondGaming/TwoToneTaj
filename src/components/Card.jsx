export default function Card({ href, title, text, featured }) {
  return (
    <a className={featured ? 'card featured' : 'card'} href={href}>
      <strong>{title}</strong>
      <span>{text}</span>
    </a>
  )
}