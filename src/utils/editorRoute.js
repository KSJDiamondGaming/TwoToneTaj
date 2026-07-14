export function editorRoute(pathname) {
  const editor = new URLSearchParams(window.location.search).get('ksjEditor') === '1'
  return editor ? { pathname, search: '?ksjEditor=1' } : pathname
}
