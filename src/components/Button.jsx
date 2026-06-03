export default function Button({ href, variant = 'primary', children }) {
  return (
    <a className={`btn btn-${variant}`} href={href}>
      {children}
    </a>
  )
}