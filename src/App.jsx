import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'
import FloatingNotice from './components/FloatingNotice'

import Home from './pages/Home'
import About from './pages/About'
import Content from './pages/Content'
import Community from './pages/Community'
import Merch from './pages/Merch'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'

import './styles/theme.css'
import './styles/core.css'
import './styles/home.css'
import './styles/about.css'
import './styles/merch.css'
import './styles/responsive.css'

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/content" element={<Content />} />
        <Route path="/community" element={<Community />} />
        <Route path="/merch" element={<Merch />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>

      <Footer />
      <FloatingNotice />
    </BrowserRouter>
  )
}
