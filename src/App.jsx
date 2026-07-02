import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'

// Layout
import Header from './components/Header'
import Footer from './components/Footer'
import FloatingNotice from './components/FloatingNotice'
import AudioControls from './components/AudioControls'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Content from './pages/Content'
import Community from './pages/Community'
import Merch from './pages/Merch'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'

// Global Styles
import './styles/theme.css'
import './styles/core.css'
import './styles/responsive.css'

// Page Styles
import './styles/home.css'
import './styles/about.css'
import './styles/content.css'
import './styles/community.css'
import './styles/community-live.css'
import './styles/merch.css'
import './styles/merch-polish.css'
import './styles/merch-final-fixes.css'
import './styles/contact.css'
import './styles/legal.css'
import './styles/mobile-audit.css'
import './styles/home-mobile.css'
import './styles/remaining-pages-mobile.css'

function App() {
  return (
    <BrowserRouter>
      <Header />

      <div className="site-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/content" element={<Content />} />
          <Route path="/community" element={<Community />} />
          <Route path="/merch" element={<Merch />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />
      <FloatingNotice />
      <AudioControls />
    </BrowserRouter>
  )
}

export default App
