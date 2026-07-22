import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

function editorEnabled() {
  return new URLSearchParams(window.location.search).get('ksjEditor') === '1'
}

function installEditorBootstrap() {
  if (!editorEnabled() || window.__ksjEditorBootstrapInstalled) return
  window.__ksjEditorBootstrapInstalled = true
  let initialised = false

  function announce(type = 'ready') {
    window.parent.postMessage({
      source: 'ksj-site-editor',
      type,
      fieldCount: document.querySelectorAll('[data-ksj-field]').length,
      pathname: window.location.pathname,
    }, '*')
  }

  window.addEventListener('message', event => {
    if (event.data?.source !== 'ksj-portal-editor') return
    if (event.data.type === 'initialise') initialised = true
    if (event.data.type === 'ping') announce()
  })
  window.addEventListener('load', () => announce())
  window.addEventListener('pageshow', () => announce())
  announce()
  const timer = window.setInterval(() => {
    if (initialised) {
      window.clearInterval(timer)
      return
    }
    announce()
  }, 750)
}

class RenderErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, details) {
    console.error('TwoToneTaj render failed:', error, details)
    if (editorEnabled()) {
      window.parent.postMessage({
        source: 'ksj-site-editor',
        type: 'render-error',
        pathname: window.location.pathname,
        message: error?.message || 'Website render failed',
      }, '*')
    }
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <main style={{ minHeight: '100vh', padding: '2rem', background: '#080b12', color: '#fff' }}>
        <h1>Website preview could not render</h1>
        <p>{this.state.error.message}</p>
      </main>
    )
  }
}

installEditorBootstrap()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RenderErrorBoundary>
      <App />
    </RenderErrorBoundary>
  </React.StrictMode>,
)
